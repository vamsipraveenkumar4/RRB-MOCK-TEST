import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, Play, BookOpen, CheckCircle2, RotateCcw } from 'lucide-react';

export const WrongQuestionsPage = () => {
  const { mistakes, questions, startTest, setActivePage } = useApp();

  const wrongQsList = questions.filter(q => mistakes.includes(q.id));

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-16">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white rounded-3xl p-8 shadow-xl border border-rose-500 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-white" />
        </div>

        <div>
          <span className="bg-white/20 text-rose-100 text-xs font-bold px-3 py-1 rounded-full border border-white/30">
            Mistake Revision Engine
          </span>
          <h1 className="text-3xl font-black mt-2">Practice My Mistakes</h1>
          <p className="text-rose-100 text-sm max-w-xl leading-relaxed mt-1">
            This special practice section automatically collects all questions you answered incorrectly in past tests so you can convert weaknesses into strengths.
          </p>
        </div>

        <div className="pt-2 flex items-center space-x-4">
          <button
            onClick={() => startTest('wrong-questions', 'practice')}
            disabled={wrongQsList.length === 0}
            className="px-6 py-3.5 rounded-xl bg-white text-rose-700 font-bold text-sm shadow-lg hover:bg-rose-50 disabled:opacity-50 transition-all flex items-center space-x-2"
          >
            <Play className="w-4 h-4 fill-rose-700" />
            <span>Practice {wrongQsList.length} Wrong Questions Now</span>
          </button>
        </div>
      </div>

      {/* MISTAKES LIST PREVIEW */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Saved Incorrect Questions ({wrongQsList.length})
          </h3>
          <span className="text-xs text-slate-400 font-medium">Auto-updated after every test</span>
        </div>

        {wrongQsList.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No wrong questions recorded!</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Complete previous year papers and any incorrect answers will automatically land here for revision.
            </p>
            <button
              onClick={() => setActivePage('papers')}
              className="mt-4 px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20"
            >
              Start a Previous Paper
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {wrongQsList.map((q, idx) => (
              <div 
                key={q.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span className="text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">
                    {q.exam} • {q.subject}
                  </span>
                  <span>{q.topic}</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {q.questionEnglish}
                </p>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 font-telugu">
                  {q.questionTelugu}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
