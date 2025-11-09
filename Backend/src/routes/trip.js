import express from "express";
import { pool } from "../infra/db.js";

import parameterize from "../jobs/parameterize_request.js";
import searchPlaces from "../jobs/search_places.js";
import filterCandidates from "../jobs/filter_candidates.js";
import finalizeTour from "../jobs/finalize_tour.js";
import generateName from "../jobs/generate_name.js";
import askGeminiForDescription from "../jobs/generate_description.js";

const router = express.Router();

const priceMap = {
  PRICE_LEVEL_UNSPECIFIED: 0,
  PRICE_LEVEL_FREE: 0,
  PRICE_LEVEL_INEXPENSIVE: 1,
  PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3,
  PRICE_LEVEL_VERY_EXPENSIVE: 4,
};

router.get("/", async (req, res) => {
  const owner = req.uid || req.query.owner;
  if (!owner) return res.status(400).json({ error: "Missing owner" });

  try {
    const { rows } = await pool.query(
      `SELECT id, name, city, description, stops, type, created_at
       FROM tour
       WHERE owner = $1
       ORDER BY created_at DESC`,
      [owner]
    );
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch tours:", err);
    res.status(500).json({ error: "Failed to fetch tours" });
  }
});

router.get("/:tourId", async (req, res) => {
  const { tourId } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT
     seq,
     description,
     snap_name AS name,
     snap_rating AS rating,
     snap_price_level AS price,
     snap_address AS address,
     snap_lat AS lat,
     snap_lng AS lng,
     snap_url AS url,
     snap_photo AS photo
   FROM tour_stop
   WHERE tour_id = $1
   ORDER BY seq ASC`,
      [tourId]
    );

    const hydrated = await Promise.all(
      rows.map(async (r) => {
        if (!r.photo) return { ...r, photo: null };

        const mediaEndpoint = `https://places.googleapis.com/v1/${r.photo}/media?maxWidthPx=800&skipHttpRedirect=true&key=${process.env.GOOGLE_PLACES_API_KEY}`;

        try {
          const { data } = await axios.get(mediaEndpoint, {
            headers: { Accept: "application/json" },
          });
          // data.photoUri is the direct CDN URL
          return { ...r, photo: data?.photoUri ?? null };
        } catch (e) {
          // fall back to returning the media endpoint (browser will follow redirect)
          return { ...r, photo: `https://places.googleapis.com/v1/${r.photo}/media?maxWidthPx=800&key=${process.env.GOOGLE_PLACES_API_KEY}` };
        }
      })
    );

    //get name and desc
    const infoResult = await pool.query(
      `SELECT name, description
       FROM tour
       WHERE id = $1
       LIMIT 1`,
      [tourId]
    );

    const tourName = infoResult.rows[0]?.name || null;
    const tourDescription = infoResult.rows[0]?.description || null;

    const withTourInfo = hydrated.map((row) => ({
      ...row,
      tourName,
      tourDescription,
    }));


    res.json(withTourInfo);
  } catch (err) {
    console.error("Failed to fetch tour stops:", err);
    res.status(500).json({ error: "Failed to fetch tour stops" });
  }
});

router.post("/", async (req, res) => {
  const { userPrompt, startingCoords, targetCoords, budget, transportationMethod, searchRadius, city } = req.body;
  const owner = req.uid;

  console.log(req.body);

  //generate tour name
  try {
    var tourName = await generateName(userPrompt, city);
  } catch (err) {
    console.error("Name generation error:", err);
    return res.status(500).json({ error: "Failed to generate tour name" });
  }

  //insert job to db
  try {
    const { rows: [row] } = await pool.query(
      `INSERT INTO tour (name, owner, city, budget, search_radius, type, start_lat, start_lng, end_lat, end_lng)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, status`,
      [
        tourName,
        owner,
        city ?? null,
        Number.isFinite(budget) ? budget : null,
        Number.isFinite(searchRadius) ? searchRadius : null,
        transportationMethod ?? "driving",
        startingCoords?.lat ?? null,
        startingCoords?.lng ?? null,
        targetCoords?.lat ?? null,
        targetCoords?.lng ?? null,
      ]
    );
    var tourRowId = row.id;
    res.status(202).json({ id: row.id, status: row.status });
  } catch (err) {
    console.error("DB insert error:", err);
    return res.status(500).json({ error: "Failed to create tour job" });
  }

  //begin APi pipeline background job
  //1. parameterize the user request using gemini
  //2. find candidates using google places API with the type parameters
  //3. filter candidates using gemini
  //4. finalize the tour using gemini
  setImmediate(async () => {
    try {
      const params = await parameterize(userPrompt);
      const places = await searchPlaces(params, startingCoords, targetCoords);
      const candidates = await filterCandidates(userPrompt, places, budget);
      const finalists = await finalizeTour(userPrompt, candidates);
      const genDescription = await askGeminiForDescription(userPrompt, finalists, city);
      // add stops to tour_stop db
      try {
        const insertSql = `
          INSERT INTO tour_stop
            (tour_id, seq, description, snap_name, snap_rating, snap_price_level, snap_address, snap_lat, snap_lng, snap_url, snap_photo)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
          ON CONFLICT (tour_id, seq) DO UPDATE SET
            description = EXCLUDED.description,
            snap_name = EXCLUDED.snap_name,
            snap_rating = EXCLUDED.snap_rating,
            snap_price_level = EXCLUDED.snap_price_level,
            snap_address = EXCLUDED.snap_address            ,
            snap_lat = EXCLUDED.snap_lat,
            snap_lng = EXCLUDED.snap_lng,
            snap_url = EXCLUDED.snap_url,
            snap_photo = EXCLUDED.snap_photo
        `;

        for (let i = 0; i < finalists.length; i++) {
          const s = finalists[i];

          const description =
            s.editorialSummary || s.generativeSummary || s.reviewSummary || "No description listed";

          const priceLevel = priceMap[s.priceLevel] ?? 0;

          await pool.query(insertSql, [
            tourRowId,
            i + 1,
            description,
            s.name,
            s.rating ?? null,
            priceLevel,
            s.formattedAddress ?? null,
            s.lat ?? null,
            s.lng ?? null,
            s.url ?? null,
            s.photo ?? null
          ]);
        }

        console.log(`Inserted ${finalists.length} stops for tour ${tourRowId}`);

        //update tour table
        try {
          await pool.query(
            `UPDATE tour
            SET stops = $2,
              status = $3,
              description = $4
            WHERE id = $1`,
            [tourRowId, finalists.length, "complete", genDescription]
          );
        } catch (err) {
          console.error("Failed to update tour status:", err);
        }
      } catch (err) {
        console.error("Failed to insert tour stops:", err);
      }


    } catch (err) {
      console.error("Background pipeline error:", err);

      //mark as failed in db
      try {
        await pool.query(
          `UPDATE tour
          SET status = $2
          WHERE id = $1`,
          [tourRowId, "failed"]
        );
      } catch (err) {
        console.error("Failed to update tour status to failed:", err);
      }

    }
  });

});


export default router;