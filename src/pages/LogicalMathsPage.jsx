import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calculator, Zap, Play, Filter, CheckCircle2 } from 'lucide-react';
import { QuestionCard } from '../components/QuestionCard';

export const LogicalMathsPage = () => {
  const { questions, startTest } = useApp();

  const mathQuestions = questions.filter(q => q.subject === 'Mathematics');

  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [userAnswers, setUserAnswers] = useState({});
  const [submittedAnswers, setSubmittedAnswers] = useState({});

  const topics = Array.from(new Set(mathQuestions.map(q => q.topic)));

  const filteredMathQs = mathQuestions.filter(q => {
    if (selectedTopic !== 'All' && q.topic !== selectedTopic) return false;
    if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) return false;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white rounded-3xl p-8 shadow-xl border border-orange-400/30 space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
          <Calculator className="w-6 h-6 text-white" />
        </div>

        <div>
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30 backdrop-blur-md">
            RRB ALP + JE Common Aptitude
          </span>
          <h1 className="text-3xl font-black mt-2">Logical Mathematics Master Class</h1>
          <p className="text-orange-100 text-sm max-w-xl leading-relaxed mt-1">
            Handpicked quantitative aptitude questions common to both RRB ALP and JE CBT-1 exams. Features shortcuts, formula tricks, and difficulty ratings.
          </p>
        </div>

        <div className="pt-2 flex items-center space-x-3">
          <button
            onClick={() => startTest('subject-Mathematics', 'practice')}
            className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs shadow-lg transition-all flex items-center space-x-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Start Full Math Test ({mathQuestions.length} Qs)</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-orange-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Topic Filter */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-500">Topic:</label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium border-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="All">All Topics ({topics.length})</option>
            {topics.map((t, idx) => (
              <option key={idx} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-500">Difficulty:</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium border-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">🟢 Easy</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Hard">🔴 Hard</option>
          </select>
        </div>

      </div>

      {/* MATH QUESTIONS LIST */}
      <div className="space-y-6">
        {filteredMathQs.map((q, idx) => (
          <QuestionCard
            key={q.id}
            question={q}
            questionIndex={idx}
            totalQuestions={filteredMathQs.length}
            selectedOption={userAnswers[q.id]}
            onSelectOption={(optIdx) => setUserAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
            onSubmitAnswer={() => setSubmittedAnswers(prev => ({ ...prev, [q.id]: true }))}
            isSubmitted={submittedAnswers[q.id]}
            testMode="practice"
          />
        ))}
      </div>

    </div>
  );
};
