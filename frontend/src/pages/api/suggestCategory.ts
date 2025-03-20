import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  try {
    const prompt = `
      Analyze the following journal entry and classify it into one of the predefined categories:
      - PERSONAL
      - WORK
      - TRAVEL
      - HEALTH
      - FINANCE
      - EDUCATION
      - OTHER
      
      Journal Entry: "${content}"

      Respond with only the category name.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 10,
    });

    const suggestedCategory = response.choices[0]?.message?.content?.trim();

    if (!suggestedCategory) {
      return res
        .status(500)
        .json({ message: "Failed to get a category suggestion" });
    }

    return res.status(200).json({ category: suggestedCategory });
  } catch (error) {
    console.error("Error suggesting category:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
