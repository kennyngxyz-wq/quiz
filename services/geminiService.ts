
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

export const generateQuiz = async (topic: string): Promise<Question[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a 5-question multiple choice quiz about ${topic} suitable for high school students. 
              The questions should be educational, clear, and engaging. 
              Provide 4 options for each question and clearly identify the correct answer index (0-3). 
              Also include a brief explanation of why the answer is correct.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: {
              type: Type.STRING,
              description: "The quiz question text",
            },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Four multiple choice options",
            },
            correctAnswer: {
              type: Type.INTEGER,
              description: "Index of the correct answer (0-3)",
            },
            explanation: {
              type: Type.STRING,
              description: "A short educational explanation of the correct answer",
            }
          },
          required: ["question", "options", "correctAnswer", "explanation"],
        },
      },
    },
  });

  try {
    const questions = JSON.parse(response.text.trim());
    return questions;
  } catch (error) {
    console.error("Failed to parse quiz response:", error);
    throw new Error("Could not generate a valid quiz. Please try again.");
  }
};
