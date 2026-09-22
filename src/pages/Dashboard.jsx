import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Train, 
  Target, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  BookOpen, 
  Flame, 
  AlertCircle, 
  Award, 
  Play, 
  ArrowRight,
  Upload,
  Zap,
  Calculator,
  Bookmark,
  Folder,
  Sparkles
} from 'lucide-react';
import { PaperImportModal } from '../components/PaperImportModal';

export const Dashboard = () => {
  const { 
    totalQuestionsCount, 
    totalAttempted, 
    totalCorrect, 
    totalWrong, 
    overallAccuracy, 
    totalTestsCompleted,
    weakTopics,
    startTest,
    setActivePage,
    setIsAiModalOpen,
    mistakes,
    bookmarks
  } = useApp();

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const examCards = [
    {
      id: 'alp',
      name: 'RRB ALP',
      fullTitle: 'Assistant Loco Pilot CBT-1 & 2',
      badge: 'High Priority',
      badgeColor: 'bg-blue-600 text-white',
      accentColor: 'border-l-4 border-l-blue-600',
      buttonColor: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 hover:bg-blue-600 hover:text-white',
      desc: 'Physics, Basic Science, Mathematics & Reasoning',
      questionCount: 75,
      duration: '60 Min'
    },
    {
      id: 'ntpc',
      name: 'RRB NTPC',
      fullTitle: 'Graduate & Under-Graduate CBT',
      badge: 'Popular',
      badgeColor: 'bg-amber-600 text-white',
      accentColor: 'border-l-4 border-l-amber-600',
      buttonColor: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 hover:bg-amber-600 hover:text-white',
      desc: 'General Awareness, Indian Railways & Quantitative Aptitude',
      questionCount: 100,
      duration: '90 Min'
    },
    {
      id: 'je',
      name: 'RRB JE',
      fullTitle: 'Junior Engineer CBT-1 & 2',
      badge: 'Technical',
      badgeColor: 'bg-emerald-600 text-white',
      accentColor: 'border-l-4 border-l-emerald-600',
      buttonColor: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 hover:bg-emerald-600 hover:text-white',
      desc: 'Logical Reasoning, Technical Aptitude & Engineering Science',
      questionCount: 100,
      duration: '90 Min'
    },
    {
      id: 'technician',
      name: 'RRB Technician',
      fullTitle: 'Grade I & III Signal/Tele',
      badge: 'Grade III',
      badgeColor: 'bg-purple-600 text-white',
      accentColor: 'border-l-4 border-l-purple-600',
      buttonColor: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 hover:bg-purple-600 hover:text-white',
      desc: 'Basic Science, Physics Numericals & Technical Trade',
      questionCount: 100,
      duration: '90 Min'
    },
    {
      id: 'groupd',
      name: 'RRB Group D',
      fullTitle: 'Level 1 Track Maintainer & Assistants',
      badge: 'Level 1',
      badgeColor: 'bg-rose-600 text-white',
      accentColor: 'border-l-4 border-l-rose-600',
      buttonColor: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 hover:bg-rose-600 hover:text-white',
      desc: 'General Science (10th Standard Physics/Chem), Math & GK',
      questionCount: 100,
      duration: '90 Min'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* HERO BANNER SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-8 sm:p-10 shadow-2xl border border-orange-400/30">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold backdrop-blur-md">
            <Train className="w-4 h-4 text-amber-200" />
            <span>RailPrep AI • Smart RRB Exam Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Prepare Smarter for <span className="text-amber-200 underline decoration-amber-300 decoration-wavy underline-offset-4">RRB Railway Exams</span>
          </h1>

          <p className="text-orange-50 text-sm sm:text-base leading-relaxed font-medium">
            Practice Previous Year Questions in <span className="font-bold text-white underline">English + Telugu</span> with instant answer verification (🟢 Green / 🔴 Red), detailed Telugu explanations, and calculation shortcuts.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm shadow-xl transition-all flex items-center space-x-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950 animate-bounce" />
              <span>AI Question Refresh</span>
            </button>

            <button
              onClick={() => startTest('alp-2025-s2', 'practice')}
              className="px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm shadow-xl transition-all flex items-center space-x-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Start Quick Practice</span>
            </button>

            <button
              onClick={() => setActivePage('papers')}
              className="px-6 py-3.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm backdrop-blur-md border border-white/30 transition-all flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Previous Year Papers</span>
            </button>

            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-5 py-3.5 rounded-xl bg-white text-orange-700 hover:bg-orange-50 font-bold text-sm shadow-md transition-all flex items-center space-x-2"
            >
              <Upload className="w-4 h-4 text-orange-600" />
              <span>Upload PDF Paper</span>
            </button>
          </div>
        </div>
      </div>

      {/* PERFORMANCE METRICS OVERVIEW */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span>Your Performance Metrics</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">Real-time local tracking</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-orange-100 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Total Questions</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalQuestionsCount}
            </span>
            <span className="text-[11px] text-orange-600 dark:text-orange-400 block mt-1 font-medium">In Question Bank</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-orange-100 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Attempted</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-orange-600 dark:text-orange-400">
              {totalAttempted}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1 font-medium">Total Solved</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-orange-100 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Correct</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {totalCorrect}
            </span>
            <span className="text-[11px] text-emerald-600 block mt-1 font-medium">🟢 Green Answers</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-orange-100 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Wrong</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400">
              {totalWrong}
            </span>
            <span className="text-[11px] text-rose-500 block mt-1 font-medium">🔴 Mistakes Saved</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-orange-100 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Accuracy %</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-500">
              {overallAccuracy}%
            </span>
            <span className="text-[11px] text-amber-600 block mt-1 font-medium">Overall Score Rate</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-orange-100 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Tests Done</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-orange-600 dark:text-orange-400">
              {totalTestsCompleted}
            </span>
            <span className="text-[11px] text-orange-500 block mt-1 font-medium">Completed Papers</span>
          </div>

        </div>
      </div>

      {/* RRB PDFS FOLDER DIRECT ACCESS SECTION */}
      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-600/10 rounded-3xl p-6 border border-orange-500/30 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-lg shadow-orange-500/30">
              <Folder className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  📁 RRB PDFs Folder (42 Papers Active)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-white flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3" /> Auto Parsed
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Solve official 2018 & 2025/2026 RRB ALP CBT-1 shift papers directly extracted from your local <code className="bg-orange-100 dark:bg-slate-800 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded font-mono text-[11px]">RRB PDFs</code> folder.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActivePage('papers')}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center space-x-2 shrink-0"
          >
            <span>Browse All 42 PDF Papers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick launch grid of sample PDF papers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-orange-200/50 dark:border-slate-800/50">
          <button
            onClick={() => startTest('rrb-pdf-09-08-2018-alp-shift-1', 'practice')}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-orange-200/80 dark:border-slate-800 hover:border-orange-500 text-left transition-all shadow-sm hover:shadow group"
          >
            <span className="text-[10px] font-bold text-orange-600 block uppercase">2018 Shift 1 • ALP</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 truncate block">
              09/08/2018 Shift 1 Paper
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">Start Instant Practice →</span>
          </button>

          <button
            onClick={() => startTest('rrb-pdf-rrb-alp-2025-cbt1-question-paper-and-answer-key-pdf-english-feb-13-2026-shift-1-1774262337', 'practice')}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-orange-200/80 dark:border-slate-800 hover:border-orange-500 text-left transition-all shadow-sm hover:shadow group"
          >
            <span className="text-[10px] font-bold text-orange-600 block uppercase">2025 Shift 1 • ALP</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 truncate block">
              Feb 13 2025 Shift 1 Paper
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">Start Instant Practice →</span>
          </button>

          <button
            onClick={() => startTest('rrb-pdf-rrb-alp-2025-cbt1-question-paper-and-answer-key-pdf-english-feb-16-2026-shift-2-1774262334', 'practice')}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-orange-200/80 dark:border-slate-800 hover:border-orange-500 text-left transition-all shadow-sm hover:shadow group"
          >
            <span className="text-[10px] font-bold text-orange-600 block uppercase">2025 Shift 2 • ALP</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 truncate block">
              Feb 16 2025 Shift 2 Paper
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">Start Instant Practice →</span>
          </button>
        </div>
      </div>

      {/* QUICK PRACTICE BY EXAM CATEGORY */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Train className="w-5 h-5 text-orange-600" />
            <span>Target RRB Exam Practice</span>
          </h2>
          <button 
            onClick={() => setActivePage('papers')}
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center"
          >
            <span>View All Papers</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {examCards.map((exam) => (
            <div 
              key={exam.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl p-5 ${exam.accentColor} transition-all group flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${exam.badgeColor}`}>
                    {exam.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono font-medium">{exam.duration}</span>
                </div>

                <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors">
                  {exam.name}
                </h3>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                  {exam.fullTitle}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {exam.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">
                  {exam.questionCount} Qs
                </span>
                <button
                  onClick={() => startTest(`exam-${exam.id}`, 'practice')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-1 ${exam.buttonColor}`}
                >
                  <span>Practice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WEAK TOPICS & MISTAKE PRACTICE BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Practice Mistakes Card */}
        <div className="bg-gradient-to-br from-rose-500 via-rose-600 to-red-700 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-extrabold mb-1">
              Practice My Mistakes
            </h3>
            <p className="text-rose-100 text-xs sm:text-sm leading-relaxed mb-4">
              Targeted revision engine that pulls all <span className="font-bold underline">{mistakes.length} wrong questions</span> you attempted previously.
            </p>
          </div>

          <button
            onClick={() => setActivePage('wrong-practice')}
            className="w-full py-3.5 px-4 rounded-xl bg-white text-rose-700 font-bold text-sm shadow-md hover:bg-rose-50 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Practice {mistakes.length} Mistakes Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Weak Topics Spotlight */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <span>Your Weak Areas & Topic Accuracy</span>
              </h3>
              <p className="text-xs text-slate-400">
                Topics requiring revision based on your answer history
              </p>
            </div>
            <button
              onClick={() => setActivePage('wrong-practice')}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
            >
              Improve Weak Topics
            </button>
          </div>

          <div className="space-y-3">
            {weakTopics.slice(0, 4).map((wt, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      wt.accuracy < 50 ? 'bg-rose-500' : wt.accuracy < 75 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                    <span>{wt.topic}</span>
                  </span>
                  <span className={
                    wt.accuracy < 50 ? 'text-rose-600 font-bold' : wt.accuracy < 75 ? 'text-amber-600 font-bold' : 'text-emerald-600 font-bold'
                  }>
                    {wt.accuracy}% Accuracy
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      wt.accuracy < 50 ? 'bg-rose-500' : wt.accuracy < 75 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${wt.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* QUICK UTILITY MODULES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setActivePage('logical-maths')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-orange-100 dark:border-slate-800 hover:border-orange-500 cursor-pointer transition-all flex items-center space-x-4 shadow-sm"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center shrink-0">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">ALP + JE Logical Maths</h4>
            <p className="text-xs text-slate-500">Quantitative aptitude bank with difficulty tags</p>
          </div>
        </div>

        <div 
          onClick={() => setActivePage('bookmarks')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 cursor-pointer transition-all flex items-center space-x-4 shadow-sm"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">My Saved Bookmarks</h4>
            <p className="text-xs text-slate-500">{bookmarks.length} saved questions for fast revision</p>
          </div>
        </div>

        <div 
          onClick={() => setIsImportModalOpen(true)}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 cursor-pointer transition-all flex items-center space-x-4 shadow-sm"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center shrink-0">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Import PDF / Images</h4>
            <p className="text-xs text-slate-500">Add custom previous year question papers</p>
          </div>
        </div>
      </div>

      {/* PAPER IMPORT MODAL */}
      <PaperImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
      />

    </div>
  );
};
