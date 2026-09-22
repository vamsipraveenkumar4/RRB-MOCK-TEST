import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QuestionCard } from '../components/QuestionCard';
import { QuestionNavigator } from '../components/QuestionNavigator';
import { Timer } from '../components/Timer';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Bookmark, 
  RotateCcw, 
  Send, 
  AlertTriangle 
} from 'lucide-react';

export const TestEngine = () => {
  const { 
    activeTest, 
    selectAnswer, 
    submitSingleAnswerPractice, 
    clearAnswer, 
    toggleMarkForReview, 
    setQuestionIndex, 
    submitTest,
    setActivePage
  } = useApp();

  const [showSubmitModal, setShowSubmitModal] = useState(false);

  if (!activeTest || !activeTest.questions || activeTest.questions.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">No active test session</h2>
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
    testMode,
    questions,
    currentIndex,
    userAnswers,
    submittedAnswers,
    markedForReview,
    timeRemainingSeconds
  } = activeTest;

  const currentQ = questions[currentIndex];
  const selectedOpt = userAnswers[currentIndex];
  const isSubmittedPractice = submittedAnswers[currentIndex];
  const isMarked = markedForReview[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) setQuestionIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setQuestionIndex(currentIndex + 1);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      
      {/* TEST ENGINE TOP HEADER */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-orange-100 dark:border-slate-800 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-orange-600 dark:text-orange-400 mb-0.5">
            <span className="bg-orange-100 dark:bg-orange-950 px-2.5 py-0.5 rounded-full text-orange-800 dark:text-orange-300">{examName}</span>
            <span>Mode: {testMode === 'practice' ? 'Interactive Practice (Instant Check)' : 'Timed Formal Exam'}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            {paperTitle}
          </h1>
        </div>

        {/* Timer & Finish Test */}
        <div className="flex items-center space-x-3">
          {testMode === 'exam' && (
            <Timer 
              initialSeconds={timeRemainingSeconds} 
              onExpire={() => submitTest()} 
            />
          )}

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Finish Test</span>
          </button>
        </div>
      </div>

      {/* MAIN TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interactive Question Card & Control Buttons */}
        <div className="lg:col-span-2 space-y-6">
          
          <QuestionCard
            question={currentQ}
            questionIndex={currentIndex}
            totalQuestions={questions.length}
            selectedOption={selectedOpt}
            onSelectOption={(optIdx) => selectAnswer(currentIndex, optIdx)}
            onSubmitAnswer={() => submitSingleAnswerPractice(currentIndex)}
            isSubmitted={testMode === 'practice' ? isSubmittedPractice : false}
            testMode={testMode}
          />

          {/* ACTION BUTTONS BAR */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-orange-100 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
            
            {/* Left Actions: Clear & Mark for Review */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => clearAnswer(currentIndex)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Answer</span>
              </button>

              <button
                onClick={() => toggleMarkForReview(currentIndex)}
                className={`px-3.5 py-2 rounded-xl font-semibold text-xs border transition-colors flex items-center space-x-1 ${
                  isMarked 
                    ? 'bg-amber-400 text-amber-950 border-amber-500 font-bold' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isMarked ? 'fill-amber-950' : ''}`} />
                <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>
            </div>

            {/* Right Actions: Previous & Next */}
            <div className="flex items-center space-x-2 ml-auto">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 font-bold text-xs text-slate-700 dark:text-slate-300 transition-colors flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 font-bold text-xs text-white shadow-md shadow-orange-500/20 transition-colors flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Right Column: Question Navigator Grid */}
        <div className="lg:col-span-1">
          <QuestionNavigator
            questions={questions}
            currentIndex={currentIndex}
            userAnswers={userAnswers}
            submittedAnswers={submittedAnswers}
            markedForReview={markedForReview}
            onSelectIndex={(idx) => setQuestionIndex(idx)}
            testMode={testMode}
          />
        </div>

      </div>

      {/* CONFIRMATION SUBMIT TEST MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Submit Test Confirmation</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to finish and submit your test?
              </p>
            </div>

            {/* Quick summary stats */}
            <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Total Questions:</span>
                <span className="font-bold text-slate-900 dark:text-white">{questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Attempted:</span>
                <span className="font-bold text-orange-600">{Object.keys(userAnswers).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Marked for Review:</span>
                <span className="font-bold text-amber-600">{Object.values(markedForReview).filter(Boolean).length}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Continue Test
              </button>

              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  submitTest();
                }}
                className="py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
