
export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface UserInfo {
  name: string;
  level: string;
}

export type QuizStatus = 'idle' | 'info' | 'loading' | 'playing' | 'finished';

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  status: QuizStatus;
  userAnswers: number[];
  topic: string;
  userInfo: UserInfo | null;
}
