import React from 'react';
import { Bookmark, CheckCircle, HelpCircle } from 'lucide-react';

export const QuestionNavigator = ({
  questions,
  currentIndex,
  userAnswers,
  submittedAnswers,
  markedForReview,
  onSelectIndex,
  testMode = 'practice'
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between">
        <span>Question Palette</span>
        <span className="text-xs text-slate-400 font-normal">{questions.length} Questions</span>
      </h3>

      {/* Grid Palette */}
      <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 mb-6 max-h-60 overflow-y-auto pr-1">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const userAns = userAnswers[idx];
          const isSubmitted = submittedAnswers[idx];
          const isMarked = markedForReview[idx];
          const isCorrect = userAns === q.correctAnswer;

          let btnBg = "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700";

          if (isMarked) {
            btnBg = "bg-amber-400 text-amber-950 font-bold border-amber-500 shadow-sm";
          } else if (testMode === 'practice' && isSubmitted) {
            if (isCorrect) {
              btnBg = "bg-emerald-500 text-white font-bold border-emerald-600 shadow-sm";
            } else {
              btnBg = "bg-rose-500 text-white font-bold border-rose-600 shadow-sm";
            }
          } else if (userAns !== undefined) {
            btnBg = "bg-orange-500 text-white font-bold border-orange-600 shadow-sm";
          }

          return (
            <button
              key={idx}
              onClick={() => onSelectIndex(idx)}
              className={`h-10 rounded-xl font-mono text-xs flex items-center justify-center border-2 transition-all relative ${btnBg} ${
                isCurrent ? 'ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-slate-900 scale-105 z-10' : ''
              }`}
            >
              <span>{idx + 1}</span>
              {isMarked && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white dark:border-slate-900" />
              )}
            </button>
          );
        })}
      </div>

      {/* Color Legend */}
      <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-4">
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-emerald-500"></span>
            <span>Correct / Answered</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-rose-500"></span>
            <span>Wrong</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-amber-400"></span>
            <span>Marked for Review</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"></span>
            <span>Not Attempted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
