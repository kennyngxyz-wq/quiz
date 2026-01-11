
import React, { useState, useCallback } from 'react';
import { QuizCard } from './components/QuizCard';
import { ResultsView } from './components/ResultsView';
import { UserInfoForm } from './components/UserInfoForm';
import { Button } from './components/Button';
import { generateQuiz } from './services/geminiService';
import { submitQuizResults } from './services/sheetService';
import { Question, QuizState, QuizStatus, UserInfo } from './types';

const PREDEFINED_TOPICS = [
  "Solar System",
  "World Capitals",
  "Human Biology",
  "Programming Basics",
  "Renaissance Art",
  "Ancient Rome",
  "Environmental Science",
  "Modern History",
  "Psychology",
  "Climate Change"
];

const App: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    status: 'idle',
    userAnswers: [],
    topic: PREDEFINED_TOPICS[0],
    userInfo: null
  });

  const [inputTopic, setInputTopic] = useState(PREDEFINED_TOPICS[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const finalTopic = isCustom ? customTopic.trim() : inputTopic;

  const handleGoToUserInfo = () => {
    if (!finalTopic) return;
    setState(prev => ({ ...prev, status: 'info', topic: finalTopic }));
  };

  const handleStartQuiz = async (info: UserInfo) => {
    setError(null);
    setState(prev => ({ ...prev, status: 'loading', userInfo: info }));
    
    try {
      const questions = await generateQuiz(state.topic);
      setState(prev => ({
        ...prev,
        questions,
        currentQuestionIndex: 0,
        score: 0,
        status: 'playing',
        userAnswers: []
      }));
      setSelectedAnswer(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState(prev => ({ ...prev, status: 'idle' }));
    }
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "CUSTOM") {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      setInputTopic(val);
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const isCorrect = index === state.questions[state.currentQuestionIndex].correctAnswer;
    
    if (isCorrect) {
      setState(prev => ({ ...prev, score: prev.score + 1 }));
    }

    setState(prev => ({
      ...prev,
      userAnswers: [...prev.userAnswers, index]
    }));
  };

  const handleNext = async () => {
    const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1;

    if (isLastQuestion) {
      // Trigger background submission to Google Sheets
      if (state.userInfo) {
        submitQuizResults(
          state.userInfo,
          state.topic,
          state.score,
          state.questions.length
        );
      }
      
      setState(prev => ({ ...prev, status: 'finished' }));
    } else {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
      setSelectedAnswer(null);
    }
  };

  const handleRestart = () => {
    setState(prev => ({ ...prev, status: 'idle' }));
    setSelectedAnswer(null);
    setCustomTopic("");
  };

  const isButtonDisabled = isCustom ? !customTopic.trim() : !inputTopic;

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="z-10 w-full flex flex-col items-center">
        {state.status === 'idle' && (
          <div className="w-full max-w-xl text-center space-y-8 animate-in fade-in zoom-in duration-700">
            <div className="inline-block p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 mb-4">
              <span className="text-indigo-400 font-bold uppercase tracking-widest text-sm">Welcome to QuizMaster AI</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              Test your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Knowledge</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-lg mx-auto">
              Choose a topic and our AI will generate a unique challenge for you.
            </p>
            
            <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50 shadow-xl space-y-6">
              <div className="text-left space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2 ml-1">Select a Topic</label>
                  <select
                    value={isCustom ? "CUSTOM" : inputTopic}
                    onChange={handleTopicChange}
                    className="w-full bg-slate-900/50 border-2 border-slate-700 rounded-2xl px-5 py-4 focus:border-indigo-500 outline-none transition-all text-lg cursor-pointer appearance-none text-white"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '1.5em' }}
                  >
                    {PREDEFINED_TOPICS.map(t => (
                      <option key={t} value={t} className="bg-slate-900 text-white">{t}</option>
                    ))}
                    <option value="CUSTOM" className="bg-slate-900 text-indigo-400 font-bold">Custom Topic...</option>
                  </select>
                </div>

                {isCustom && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-semibold text-slate-400 mb-2 ml-1">Enter Custom Topic</label>
                    <input
                      type="text"
                      autoFocus
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder="e.g. History of Jazz, Particle Physics..."
                      className="w-full bg-slate-900/50 border-2 border-slate-700 rounded-2xl px-5 py-4 focus:border-indigo-500 outline-none transition-all text-lg text-white"
                    />
                  </div>
                )}
              </div>

              <Button 
                onClick={handleGoToUserInfo} 
                className="w-full" 
                size="lg"
                disabled={isButtonDisabled}
              >
                Proceed to Details
              </Button>
            </div>
            {error && (
              <p className="text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{error}</p>
            )}
          </div>
        )}

        {state.status === 'info' && (
          <UserInfoForm 
            topic={state.topic} 
            onConfirm={handleStartQuiz} 
            onBack={handleRestart} 
          />
        )}

        {state.status === 'loading' && (
          <div className="text-center space-y-6 animate-pulse">
            <div className="w-24 h-24 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-3xl font-bold text-white">Generating Quiz...</h2>
            <div className="space-y-2">
              <p className="text-slate-400 text-lg">Preparing 5 questions on <span className="text-indigo-400 font-bold">{state.topic}</span></p>
              <p className="text-slate-500 italic">Tailoring difficulty for a {state.userInfo?.level}...</p>
            </div>
          </div>
        )}

        {state.status === 'playing' && (
          <QuizCard
            question={state.questions[state.currentQuestionIndex]}
            questionNumber={state.currentQuestionIndex + 1}
            totalQuestions={state.questions.length}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            isCorrect={selectedAnswer === null ? null : selectedAnswer === state.questions[state.currentQuestionIndex].correctAnswer}
            onNext={handleNext}
            onExit={handleRestart}
          />
        )}

        {state.status === 'finished' && (
          <ResultsView
            score={state.score}
            total={state.questions.length}
            onRestart={handleRestart}
            userInfo={state.userInfo}
          />
        )}

        {/* Footer / Info */}
        <div className="mt-12 text-slate-500 text-sm flex items-center gap-2 opacity-60">
          <span>Powered by</span>
          <span className="font-bold text-slate-400 px-2 py-0.5 bg-slate-800 rounded-md">Gemini Flash</span>
        </div>
      </div>
    </div>
  );
};

export default App;
