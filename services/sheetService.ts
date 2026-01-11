
import { UserInfo } from "../types.ts";

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwZcVQIs5Wc09ODR6fM8ri-vgaoc2FphzR3R4KEbk9EMxm1R1DawxXxKeoKB8SR4bJR/exec";

export interface QuizResultPayload {
  name: string;
  level: string;
  topic: string;
  score: number;
  total: number;
  timestamp: string;
}

export const submitQuizResults = async (
  userInfo: UserInfo,
  topic: string,
  score: number,
  total: number
): Promise<void> => {
  const payload: QuizResultPayload = {
    name: userInfo.name,
    level: userInfo.level,
    topic: topic,
    score: score,
    total: total,
    timestamp: new Date().toISOString(),
  };

  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    console.log("Quiz results submitted successfully to Google Sheets.");
  } catch (error) {
    console.error("Failed to submit quiz results:", error);
  }
};
