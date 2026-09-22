import React from 'react';
import { useApp } from '../context/AppContext';
import { Bookmark, Play, Trash2, CheckCircle2 } from 'lucide-react';

export const BookmarksPage = () => {
  const { bookmarks, questions, toggleBookmark, startTest, setActivePage } = useApp();

  const bookmarkedQs = questions.filter(q => bookmarks.includes(q.id));

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
            <Bookmark className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              My Saved Bookmarks
            </h1>
            <p className="text-xs text-slate-500">
              Personalized repository of important RRB questions saved for quick revision.
            </p>
          </div>
        </div>

        {bookmarkedQs.length > 0 && (
          <button
            onClick={() => startTest('bookmarked', 'practice')}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Practice Saved ({bookmarkedQs.length})</span>
          </button>
        )}
      </div>

      {/* BOOKMARKED QUESTIONS LIST */}
      {bookmarkedQs.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No bookmarked questions yet</h3>
          <p className="text-xs text-slate-400 mt-1">
            Click the "Save" icon on any question during test practice to store it here.
          </p>
          <button
            onClick={() => setActivePage('papers')}
            className="mt-4 px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20"
          >
            Browse Papers
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarkedQs.map((q) => (
            <div 
              key={q.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold px-2.5 py-0.5 rounded text-xs">
                  {q.exam} • {q.subject} • {q.topic}
                </span>
                <button
                  onClick={() => toggleBookmark(q.id)}
                  className="text-xs font-semibold text-rose-500 hover:underline flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Bookmark</span>
                </button>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {q.questionEnglish}
              </h3>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 font-telugu">
                {q.questionTelugu}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-emerald-600 font-semibold flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                Correct Answer: {q.options[q.correctAnswer]}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
