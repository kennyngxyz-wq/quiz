import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types.ts";

export const generateQuiz = async (topic: string): Promise<Question[]> => {
  const apiKey = process.env.API_KEY;
  
  // Check if the key is still the placeholder or missing
  if (!apiKey || apiKey === "_REPLACE_ME_WITH_API_KEY_" || apiKey === "undefined") {
    console.error("QuizMaster AI Error: API_KEY not properly injected.");
    throw new Error(
      "API Key missing or injection failed. \n\n" +
      "To fix this in Netlify: \n" +
      "1. Go to Site Configuration > Environment Variables and add 'API_KEY'. \n" +
      "2. Ensure your Build Settings 'Build Command' is set to: \n" +
      "   sed -i \"s|_REPLACE_ME_WITH_API_KEY_|$API_KEY|g\" index.html"
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