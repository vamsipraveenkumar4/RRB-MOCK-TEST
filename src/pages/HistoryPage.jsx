import React from 'react';
import { useApp } from '../context/AppContext';
import { History, BookOpen, Clock, Award, ArrowRight } from 'lucide-react';

export const HistoryPage = () => {
  const { history, setActivePage } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-16">
      
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center font-bold">
          <History className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            My Test History & Progress
          </h1>
          <p className="text-xs text-slate-500">
            Timeline log of all completed RRB paper attempts and score accuracy.
          </p>
        </div>
      </div>

      {/* HISTORY CARDS LIST */}
      {history.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <History className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No test attempts logged yet</h3>
          <p className="text-xs text-slate-400 mt-1">Start a practice paper to record your performance history.</p>
          <button
            onClick={() => setActivePage('papers')}
            className="mt-4 px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20"
          >
            Start Practice Paper
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((h, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-orange-100 dark:border-slate-800 p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-orange-500 transition-all"
            >
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-orange-600 dark:text-orange-400 mb-1">
                  <span className="bg-orange-100 dark:bg-orange-950 px-2.5 py-0.5 rounded-full text-orange-800 dark:text-orange-300">{h.examName}</span>
                  <span>{h.date}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {h.paperTitle}
                </h3>
                <div className="flex items-center space-x-4 text-xs font-medium text-slate-500 mt-2">
                  <span>Score: <strong className="text-slate-900 dark:text-white">{h.score} / {h.total}</strong></span>
                  <span>Accuracy: <strong className="text-emerald-600">{h.accuracy}%</strong></span>
                  <span>Time: <strong>{Math.floor(h.timeSpentSeconds / 60)}m</strong></span>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={() => setActivePage('review')}
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center space-x-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Review Test</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
