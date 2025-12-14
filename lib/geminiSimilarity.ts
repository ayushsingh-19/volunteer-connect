import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY as string
);

export async function skillTaskSimilarity(
  userSkills: string[],
  taskTitle: string,
  taskDescription: string
): Promise<number> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
User skills:
${userSkills.join(", ")}

Task:
Title: ${taskTitle}
Description: ${taskDescription}

Return ONLY a number between 0 and 100.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // 🔥 Extract number safely
    const match = text.match(/\d+/);
    if (!match) return 0;

    const score = Number(match[0]);
    return score >= 0 && score <= 100 ? score : 0;

  } catch (error) {
    console.error("🔥 Gemini failed:", error);
    return 0;
  }
}