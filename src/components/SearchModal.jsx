import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, BookOpen, ArrowRight } from 'lucide-react';

export const SearchModal = () => {
  const { isSearchOpen, setIsSearchOpen, questions, startTest } = useApp();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const filteredQuestions = query.trim() === '' ? [] : questions.filter(q => 
    q.questionEnglish.toLowerCase().includes(query.toLowerCase()) ||
    q.questionTelugu.toLowerCase().includes(query.toLowerCase()) ||
    q.topic.toLowerCase().includes(query.toLowerCase()) ||
    q.subject.toLowerCase().includes(query.toLowerCase()) ||
    q.exam.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3 bg-slate-50/50 dark:bg-slate-900/50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions by topic (e.g., percentage, physics, 2025, ALP)..."
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base font-medium"
            autoFocus
          />
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              Type to search questions across all RRB exams, topics, English & Telugu text.
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              No matching questions found for "<span className="font-semibold text-slate-700 dark:text-slate-300">{query}</span>"
            </div>
          ) : (
            filteredQuestions.map((q, idx) => (
              <div 
                key={q.id} 
                className="py-3 group hover:bg-orange-50/50 dark:hover:bg-orange-950/30 px-3 rounded-xl transition-colors cursor-pointer"
                onClick={() => {
                  setIsSearchOpen(false);
                  startTest('alp-2025-s2', 'practice');
                }}
              >
                <div className="flex items-center space-x-2 text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">
                  <span className="bg-orange-100 dark:bg-orange-950/60 px-2 py-0.5 rounded text-[10px] text-orange-800 dark:text-orange-300">{q.exam}</span>
                  <span>{q.subject} • {q.topic}</span>
                  <span className="ml-auto text-slate-400 font-normal">{q.year}</span>
                </div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                  {q.questionEnglish}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-telugu line-clamp-1 mt-0.5">
                  {q.questionTelugu}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 flex justify-between items-center">
          <span>Found {filteredQuestions.length} results</span>
          <span className="text-[11px]">Press ESC or X to close</span>
        </div>
      </div>
    </div>
  );
};
