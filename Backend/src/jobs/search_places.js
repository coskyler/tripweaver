import axios from "axios";


export default async function askPlaces(types, startingCoords, targetCoords) {
  console.log("Starting search...");

  if (!Array.isArray(types) || types.length === 0) return [];

  const midpoint = {
    lat: (startingCoords.lat + targetCoords.lat) / 2,
    lng: (startingCoords.lng + targetCoords.lng) / 2,
  };

  const baseBody = {
    locationRestriction: {
      circle: {
        center: { latitude: midpoint.lat, longitude: midpoint.lng },
        radius: 2000,
      },
    },
    maxResultCount: 10,
  };

  const headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY,
    "X-Goog-FieldMask": [
      "places.name",
      "places.displayName",
      "places.location",
      "places.formattedAddress",
      "places.priceLevel",
      "places.rating",
      "places.reviewSummary",
      "places.generativeSummary",
      "places.editorialSummary",
      "places.types"
    ].join(","),
    "Accept-Language": "en",
  };

  //one request per type, in parallel
  const requests = types.map((type) =>
    axios.post(
      "https://places.googleapis.com/v1/places:searchNearby",
      { ...baseBody, includedTypes: [type] },
      { headers }
    )
  );

  const results = await Promise.allSettled(requests);

  //gather successful responses
  const allPlaces = results
    .filter(r => r.status === "fulfilled")
    .flatMap((r) => r.value.data?.places ?? []);

  //dedupe each poi by name
  const seen = new Set();
  const deduped = [];
  for (const p of allPlaces) {
    const key = p?.name || `${p?.displayName?.text}__${p?.formattedAddress}`;
    if (key && !seen.has(key)) {
      seen.add(key);
      deduped.push(p);
    }
  }

  //remove redundant information
  const simplified = deduped.map(place => ({
    name: place.displayName?.text ?? "Untitled Location",
    types: place.types ?? null,
    formattedAddress: place.formattedAddress ?? null,
    editorialSummary: place.editorialSummary?.text ?? null,
    generativeSummary: place.generativeSummary?.overview.text ?? null,
    reviewSummary: place.reviewSummary?.text.text ?? null,
    rating: place.rating ?? "Unspecified",
    priceLevel: place.priceLevel ?? "PRICE_LEVEL_UNSPECIFIED",
  }));


  return simplified;
}
