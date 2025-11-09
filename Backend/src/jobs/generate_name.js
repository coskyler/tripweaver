import ai from "../infra/gemini.js"

export default async function askGeminiToFilter(userPrompt, city) {
  const prompt = `
Given the following:
Location = "${city}"
User request = "${userPrompt}"

Quickly state a short name for their tour.
Respond in plain text, and do not include any other information besides the tour name. Do not add a period at the end.
`;

  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    responseMimeType: "application/json",
  });

  return res.text;
}