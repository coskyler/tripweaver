import ai from "../infra/gemini.js"

export default async function askGeminiToFilter(userPrompt, places) {
  //remove null and unhelpful fields before prompting
  const readable = places.map(place =>
    Object.fromEntries(
      Object.entries(place).filter(
        ([key, value]) =>
          !["priceLevel", "lng", "lat", "url"].includes(key) && value != null
      )
    )
  );



  const prompt = `
Given the following:
places array = ${JSON.stringify(readable)}
user request = "${userPrompt}"

Given a list of candidate places, create an ordered tour that can be reasonably completed within one day.
Prioritize the user’s request above all else, ensuring that each major aspect of their prompt is represented by at least one selected place.
When determining order, consider logical flow and variety. For example, schedule activities between meal stops.
Output a JSON array of integers, representing the indices of the selected places in the original places array, in the exact visiting order.
Output must be a valid JSON array of integers with no extra text or explanation.
`;

  console.log("FINALIZING...");

  const res = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: prompt,
    responseMimeType: "application/json",
  });

  const clean = JSON.parse(res.text.replace(/```(?:json)?/g, "").trim());

  console.log(clean);

  const reMapped = clean.map(i => places[i]);


  return reMapped;
}