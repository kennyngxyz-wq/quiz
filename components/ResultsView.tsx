
import React from 'react';
import { Button } from './Button';
import { UserInfo } from '../types';

interface ResultsViewProps {
  score: number;
  total: number;
  onRestart: () => void;
  userInfo: UserInfo | null;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ score, total, onRestart, userInfo }) => {
  const percentage = (score / total) * 100;
  
  let message = "";
  let icon = "";
  
  if (percentage === 100) {
    message = `Outstanding, ${userInfo?.name}! You're a true Master!`;
    icon = "🏆";
  } else if (percentage >= 80) {
    message = `Great job, ${userInfo?.name}! You really know your stuff!`;
    icon = "🌟";
  } else if (percentage >= 60) {
    message = `Good effort, ${userInfo?.name}! Keep learning!`;
    icon = "📚";
  } else {
    message = `Don't give up, ${userInfo?.name}! Every mistake is a step towards mastery.`;
    icon = "🌱";
  }

  return (
    <div className="w-full max-w-lg bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 md:p-12 text-center shadow-2xl animate-in zoom-in duration-500">
      <div className="text-7xl mb-6">{icon}</div>
      <h2 className="text-4xl font-extrabold mb-2 text-white">Quiz Complete!</h2>
      <p className="text-slate-400 mb-8">{message}</p>
      
      <div className="relative inline-block mb-10">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-slate-700"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={440}
            strokeDashoffset={440 - (440 * percentage) / 100}
            className="text-indigo-500 transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{score}/{total}</span>
          <span className="text-sm text-slate-400 uppercase tracking-widest font-semibold">Score</span>
        </div>
      </div>

      <div className="space-y-4">
        <Button onClick={onRestart} className="w-full" variant="primary" size="lg">
          Try Another Quiz
        </Button>
        <p className="text-sm text-slate-500">
          Level: {userInfo?.level}
        </p>
      </div>
    </div>
  );
};
