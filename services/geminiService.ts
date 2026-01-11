
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types.ts";

export const generateQuiz = async (topic: string): Promise<Question[]> => {
  // Attempt to find the API key in common environment locations
  const apiKey = 
    (window as any).process?.env?.API_KEY || 
    (import.meta as any).env?.API_KEY ||
    process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined") {
    console.error("QuizMaster AI Error: API_KEY is missing from the environment.");
    throw new Error(
      "API Key not found. If you are on Netlify: \n" +
      "1. Add 'API_KEY' to Site Configuration > Environment Variables. \n" +
      "2. Ensure you have triggered a fresh deploy. \n" +
      "3. If using a static deploy, check if your build process injects variables."
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a 5-question multiple choice quiz about ${topic}. 
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
    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    const questions = JSON.parse(text.trim());
    return questions;
  } catch (error) {
    console.error("Failed to parse quiz response:", error);
    throw new Error("Could not generate a valid quiz. Please check your API key and try again.");
  }
};
