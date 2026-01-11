
import React, { useState } from 'react';
import { Button } from './Button';
import { UserInfo } from '../types';

interface UserInfoFormProps {
  onConfirm: (info: UserInfo) => void;
  onBack: () => void;
  topic: string;
}

export const UserInfoForm: React.FC<UserInfoFormProps> = ({ onConfirm, onBack, topic }) => {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("High School Student");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onConfirm({ name, level });
    }
  };

  return (
    <div className="w-full max-w-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 md:p-12 shadow-2xl animate-in slide-in-from-right-10 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Almost Ready!</h2>
        <p className="text-slate-400">Tell us a bit about yourself for a personalized quiz on <span className="text-indigo-400 font-semibold">{topic}</span>.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-400 mb-2 ml-1">Your Name</label>
          <input
            type="text"
            required
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full bg-slate-900/50 border-2 border-slate-700 rounded-2xl px-5 py-4 focus:border-indigo-500 outline-none transition-all text-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-400 mb-2 ml-1">Learning Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full bg-slate-900/50 border-2 border-slate-700 rounded-2xl px-5 py-4 focus:border-indigo-500 outline-none transition-all text-lg cursor-pointer appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '1.5em' }}
          >
            <option value="Middle School">Middle School</option>
            <option value="High School Student">High School</option>
            <option value="University / College">University / College</option>
            <option value="Professional / Expert">Professional / Expert</option>
            <option value="Casual Learner">Casual Learner</option>
          </select>
        </div>

        <div className="flex gap-4 pt-2">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button type="submit" variant="primary" className="flex-[2]" disabled={!name.trim()}>
            Start Generation
          </Button>
        </div>
      </form>
    </div>
  );
};
