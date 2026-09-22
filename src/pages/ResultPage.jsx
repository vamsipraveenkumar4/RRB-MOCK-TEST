import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  RotateCcw, 
  BookOpen, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export const ResultPage = () => {
  const { activeTest, setActivePage, startTest } = useApp();

  const result = activeTest?.result;

  useEffect(() => {
    if (result && result.accuracy >= 70) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [result]);

  if (!result) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">No test results to show</h2>
        <button
          onClick={() => setActivePage('dashboard')}
          className="px-6 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-sm shadow-md"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const {
    paperTitle,
    examName,
    score,
    total,
    correct,
    wrong,
    skipped,
    accuracy,
    timeSpentSeconds,
    subjectScores
  } = result;

  const minutesTaken = Math.floor(timeSpentSeconds / 60);
  const secondsTaken = timeSpentSeconds % 60;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-16">
      
      {/* HEADER RESULT BANNER */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white rounded-3xl p-8 shadow-2xl border border-orange-400/30 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center mx-auto shadow-lg backdrop-blur-md">
          <Award className="w-8 h-8 text-amber-200" />
        </div>

        <div>
          <span className="bg-white/20 text-white text-xs font-bold px-3.5 py-1 rounded-full border border-white/30 backdrop-blur-md">
            {examName} • Test Result
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">{paperTitle}</h1>
        </div>

        {/* Score Radial Highlight */}
        <div className="py-4">
          <div className="inline-block p-6 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 shadow-inner">
            <span className="text-xs uppercase font-bold text-orange-100 block mb-1">Your Total Score</span>
            <div className="text-4xl sm:text-5xl font-black text-white">
              {score} <span className="text-2xl text-orange-200 font-normal">/ {total}</span>
            </div>
            <span className="text-xs font-bold text-amber-200 mt-2 block">
              Accuracy: {accuracy}%
            </span>
          </div>
        </div>
      </div>

      {/* DETAILED STATS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Correct Answers</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{correct}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Wrong Answers</span>
            <span className="text-xl font-black text-rose-600 dark:text-rose-400">{wrong}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Skipped</span>
            <span className="text-xl font-black text-slate-700 dark:text-slate-300">{skipped}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-orange-100 dark:border-slate-800 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Time Taken</span>
            <span className="text-xl font-black text-orange-600 dark:text-orange-400">
              {minutesTaken}m {secondsTaken}s
            </span>
          </div>
        </div>

      </div>

      {/* SUBJECT PERFORMANCE BREAKDOWN */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-orange-100 dark:border-slate-800 p-6 shadow-md space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          <span>Subject Performance Analysis</span>
        </h3>

        <div className="space-y-4">
          {Object.keys(subjectScores).map((subj, idx) => {
            const data = subjectScores[subj];
            const subjAcc = Math.round((data.correct / data.total) * 100);
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800 dark:text-slate-200">{subj}</span>
                  <span className="text-orange-600 dark:text-orange-400">
                    {data.correct} / {data.total} ({subjAcc}%)
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                    style={{ width: `${subjAcc}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        <button
          onClick={() => setActivePage('review')}
          className="py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center space-x-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>Review All Questions</span>
        </button>

        <button
          onClick={() => setActivePage('wrong-practice')}
          className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <AlertCircle className="w-4 h-4" />
          <span>Practice Wrong Questions</span>
        </button>

        <button
          onClick={() => startTest(activeTest.paperId, activeTest.testMode)}
          className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Test</span>
        </button>

        <button
          onClick={() => setActivePage('dashboard')}
          className="py-3 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition-colors flex items-center justify-center space-x-2"
        >
          <span>Back to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
