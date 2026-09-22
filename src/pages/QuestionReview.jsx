import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Bookmark, 
  Lightbulb, 
  Zap, 
  ArrowLeft 
} from 'lucide-react';

export const QuestionReview = () => {
  const { activeTest, setActivePage, bookmarks, toggleBookmark } = useApp();
  const [filter, setFilter] = useState('All'); // 'All' | 'Correct' | 'Wrong' | 'Unattempted' | 'Marked'

  if (!activeTest || !activeTest.questions) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">No test data available to review</h2>
        <button
          onClick={() => setActivePage('dashboard')}
          className="px-6 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-sm shadow-md"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const { questions, userAnswers, markedForReview, paperTitle } = activeTest;
  const optionLabels = ['A', 'B', 'C', 'D'];

  const filteredQuestions = questions.filter((q, idx) => {
    const userAns = userAnswers[idx];
    const isCorrect = userAns === q.correctAnswer;
    const isMarked = markedForReview[idx];

    if (filter === 'Correct') return isCorrect;
    if (filter === 'Wrong') return userAns !== undefined && !isCorrect;
    if (filter === 'Unattempted') return userAns === undefined;
    if (filter === 'Marked') return isMarked;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActivePage('result')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Question Review
            </h1>
            <p className="text-xs text-slate-500">{paperTitle}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          {['All', 'Correct', 'Wrong', 'Unattempted', 'Marked'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === t 
                  ? 'bg-orange-600 text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* QUESTION REVIEW CARDS LIST */}
      {filteredQuestions.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No questions match filter "{filter}"</h3>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredQuestions.map((q, originalIdx) => {
            const idx = questions.findIndex(orig => orig.id === q.id);
            const userAns = userAnswers[idx];
            const isCorrect = userAns === q.correctAnswer;
            const isBookmarked = bookmarks.includes(q.id);

            return (
              <div 
                key={q.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-4"
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-2.5 py-0.5 rounded text-xs">
                      Question #{idx + 1}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {q.subject} • {q.topic}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {userAns === undefined ? (
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                        Skipped
                      </span>
                    ) : isCorrect ? (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Correct 🟢
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2.5 py-1 rounded-md flex items-center">
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Wrong 🔴
                      </span>
                    )}

                    <button
                      onClick={() => toggleBookmark(q.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isBookmarked ? 'bg-amber-50 text-amber-500 border-amber-300' : 'text-slate-400 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* English + Telugu Question */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {q.questionEnglish}
                  </h3>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 font-telugu">
                    {q.questionTelugu}
                  </p>
                </div>

                {/* Options Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {q.options.map((optText, optIdx) => {
                    const isSelected = userAns === optIdx;
                    const isCorrectOpt = optIdx === q.correctAnswer;

                    let style = "bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800";
                    if (isCorrectOpt) {
                      style = "bg-emerald-500 text-white font-bold border-emerald-600 shadow-sm";
                    } else if (isSelected && !isCorrect) {
                      style = "bg-rose-500 text-white font-bold border-rose-600 shadow-sm";
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between ${style}`}
                      >
                        <span>
                          <strong className="mr-1">{optionLabels[optIdx]})</strong> {optText}
                        </span>
                        {isCorrectOpt && <span>✓ Correct</span>}
                        {isSelected && !isCorrect && <span>✗ Your Answer</span>}
                      </div>
                    );
                  })}
                </div>

                {/* TELUGU EXPLANATION BOX */}
                <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white">
                    <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>తెలుగు వివరణ (Solution):</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-telugu leading-relaxed whitespace-pre-line">
                    {q.explanationTelugu || q.explanationEnglish}
                  </p>

                  {q.shortcutTelugu && (
                    <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs font-telugu flex items-start space-x-2">
                      <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span><strong>షార్ట్‌కట్:</strong> {q.shortcutTelugu}</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
