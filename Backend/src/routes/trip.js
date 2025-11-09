import express from "express";
import parameterize from "../jobs/parameterize_request.js"
import searchPlaces from "../jobs/search_places.js"
import filterCandidates from "../jobs/filter_candidates.js"
import finalizeTour from "../jobs/finalize_tour.js"

const router = express.Router();

router.get("/", (req, res) => {
  res.send("get my tours");
});

router.get("/:tourId", (req, res) => {
  res.send("get tour by id");
});

router.post("/", async (req, res) => {
  const { userPrompt, startingCoords, targetCoords, budget, transportationMethod, tourMinutes } = req.body;

  //1. parameterize the user request using gemini
  const params = await parameterize(userPrompt);

  console.log(params);

  //2. find candidates using google places API with the type parameters
  const places = await searchPlaces(params, startingCoords, targetCoords);
  //console.log(places);

  //3. filter candidates using gemini
  const candidates = await filterCandidates(userPrompt, places, budget);

  //4. finalize the tour using gemini
  const finalists = await finalizeTour(userPrompt, candidates);


  res.json(finalists);

});

export default router;