
import React from 'react';
import { Question } from '../types';
import { Button } from './Button';

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (index: number) => void;
  selectedAnswer: number | null;
  isCorrect: boolean | null;
  onNext: () => void;
  onExit: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  selectedAnswer,
  isCorrect,
  onNext,
  onExit
}) => {
  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="w-full max-w-2xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-10 shadow-2xl relative">
      {/* Progress Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-1">
          <span className="text-slate-400 font-semibold tracking-wider text-xs uppercase">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onExit}
          className="text-xs py-1.5 px-3 border-slate-700 hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400"
        >
          Exit Quiz
        </Button>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-tight">
        {question.question}
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {question.options.map((option, index) => {
          let optionStyles = "flex items-center p-4 md:p-5 rounded-2xl border-2 transition-all text-left group ";
          
          if (selectedAnswer === null) {
            optionStyles += "bg-slate-700/30 border-slate-700 hover:border-indigo-500/50 hover:bg-slate-700/50 cursor-pointer";
          } else {
            if (index === question.correctAnswer) {
              optionStyles += "bg-emerald-500/20 border-emerald-500 text-emerald-400";
            } else if (index === selectedAnswer && index !== question.correctAnswer) {
              optionStyles += "bg-rose-500/20 border-rose-500 text-rose-400";
            } else {
              optionStyles += "bg-slate-700/10 border-slate-700 opacity-50";
            }
          }

          return (
            <button
              key={index}
              disabled={selectedAnswer !== null}
              onClick={() => onAnswer(index)}
              className={optionStyles}
            >
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center font-bold mr-4 transition-colors
                ${selectedAnswer === null ? 'bg-slate-700 group-hover:bg-indigo-600' : 
                  index === question.correctAnswer ? 'bg-emerald-600' :
                  index === selectedAnswer ? 'bg-rose-600' : 'bg-slate-800'}
              `}>
                {String.fromCharCode(65 + index)}
              </div>
              <span className="flex-1 font-medium">{option}</span>
            </button>
          );
        })}
      </div>

      {selectedAnswer !== null && (
        <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className={`p-4 rounded-2xl ${isCorrect ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            <p className="font-bold flex items-center">
              {isCorrect ? (
                <><span className="mr-2">✨</span> Spot on!</>
              ) : (
                <><span className="mr-2">💡</span> Nice try!</>
              )}
            </p>
            <p className="mt-1 text-sm text-slate-300 italic">
              {question.explanation}
            </p>
          </div>
          <Button onClick={onNext} className="w-full" variant="primary">
            {questionNumber === totalQuestions ? 'See Results' : 'Next Question'}
          </Button>
        </div>
      )}
    </div>
  );
};
