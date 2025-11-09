import ai from "../infra/gemini.js"

const priceMap = {
  PRICE_LEVEL_UNSPECIFIED: 0,
  PRICE_LEVEL_FREE: 0,
  PRICE_LEVEL_INEXPENSIVE: 1,
  PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3,
  PRICE_LEVEL_VERY_EXPENSIVE: 4,
};

export default async function askGeminiToFilter(userPrompt, places, budget) {
  //remove null fields and filter by price before prompting
  const readable = places
    .filter(place => {
      const level = priceMap[place.priceLevel] ?? 0;
      return level <= budget;
    })
    .map((place, index) => {
      const cleaned = Object.fromEntries(
        Object.entries(place).filter(([key, value]) => key !== "priceLevel" && value != null)
      );
      return { ...cleaned, index };
    });



  console.log(readable);


  const prompt = `
Given the following:
places array = ${JSON.stringify(readable)}
user request = "${userPrompt}"

Return only a JSON array of indices representing places in the places array that are highly relevant at least one aspect of the user prompt.
Determine relevance primarily using each place's "types" field, but also consider names, summaries, and other available details.
You should select up to 20 places that best cover all aspects of the user request, ensuring the final list represents the full intent of the prompt.
Output must be a valid JSON array of integers with no extra text or explanation.
`;

  //console.log(prompt);

  console.log("FILTERING...");

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