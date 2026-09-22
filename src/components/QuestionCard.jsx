import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  Lightbulb, 
  ShieldCheck, 
  HelpCircle,
  Zap
} from 'lucide-react';

export const QuestionCard = ({
  question,
  questionIndex,
  totalQuestions,
  selectedOption,
  onSelectOption,
  onSubmitAnswer,
  isSubmitted,
  testMode = 'practice'
}) => {
  const { bookmarks, toggleBookmark } = useApp();
  const [langMode, setLangMode] = React.useState('both'); // 'english' | 'telugu' | 'both'

  if (!question) return null;

  const isBookmarked = bookmarks.includes(question.id);
  const isCorrect = selectedOption === question.correctAnswer;
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md p-6 sm:p-8 transition-all">
      
      {/* Header Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100 dark:border-slate-800 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-2 font-semibold">
          <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm shadow-orange-500/20">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <span className="bg-orange-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md">
            {question.subject} • {question.topic}
          </span>
          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
            question.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
            question.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
            'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
          }`}>
            {question.difficulty || 'Medium'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* LANGUAGE SWITCHER BAR */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setLangMode('english')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                langMode === 'english' 
                  ? 'bg-orange-600 text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLangMode('both')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                langMode === 'both' 
                  ? 'bg-orange-600 text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Both
            </button>
            <button
              onClick={() => setLangMode('telugu')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                langMode === 'telugu' 
                  ? 'bg-orange-600 text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              తెలుగు
            </button>
          </div>

          {/* Verified Badge */}
          {question.isVerified ? (
            <span className="hidden sm:flex items-center text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified
            </span>
          ) : (
            <span className="hidden sm:flex items-center text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-1 rounded-md border border-amber-200 dark:border-amber-800">
              <HelpCircle className="w-3.5 h-3.5 mr-1" /> Unverified
            </span>
          )}

          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(question.id)}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
              isBookmarked 
                ? 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border-slate-200 dark:border-slate-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* QUESTION TEXT DISPLAY BASED ON LANG MODE */}
      <div className="space-y-4 mb-8">
        {(langMode === 'english' || langMode === 'both') && (
          <div>
            {langMode === 'both' && (
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 block mb-1">
                English Question
              </span>
            )}
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
              {question.questionEnglish}
            </h2>
          </div>
        )}

        {(langMode === 'telugu' || langMode === 'both') && question.questionTelugu && (
          <div className="bg-orange-50/40 dark:bg-slate-850 p-4 rounded-xl border border-orange-100 dark:border-slate-800">
            {langMode === 'both' && (
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                తెలుగు ప్రశ్న
              </span>
            )}
            <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-200 font-telugu leading-relaxed">
              {question.questionTelugu}
            </p>
          </div>
        )}
      </div>

      {/* OPTIONS LIST */}
      <div className="space-y-3 mb-8">
        <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
          Select Answer Option:
        </label>
        {question.options.map((optionText, optIdx) => {
          const isSelected = selectedOption === optIdx;
          const isCorrectOption = optIdx === question.correctAnswer;
          
          let btnStyle = "bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-orange-400 hover:bg-orange-50/50 dark:hover:bg-slate-800";
          let badgeStyle = "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300";

          if (isSubmitted || (testMode === 'practice' && isSubmitted)) {
            if (isCorrectOption) {
              // Correct Option -> Bright Green State
              btnStyle = "bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20";
              badgeStyle = "bg-emerald-600 text-white font-bold";
            } else if (isSelected && !isCorrect) {
              // User's Wrong Selected Option -> Bright Red State
              btnStyle = "bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/20";
              badgeStyle = "bg-rose-600 text-white font-bold";
            } else {
              btnStyle = "bg-slate-50 dark:bg-slate-850 text-slate-400 border-slate-200 dark:border-slate-800 opacity-60";
              badgeStyle = "bg-slate-200 dark:bg-slate-800 text-slate-400";
            }
          } else if (isSelected) {
            btnStyle = "bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-500/20 ring-2 ring-orange-400/50";
            badgeStyle = "bg-orange-700 text-white font-bold";
          }

          return (
            <button
              key={optIdx}
              onClick={() => !isSubmitted && onSelectOption(optIdx)}
              disabled={isSubmitted}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${btnStyle}`}
            >
              <div className="flex items-center space-x-3 flex-1">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${badgeStyle}`}>
                  {optionLabels[optIdx]}
                </span>
                <span className="text-base font-medium leading-snug">
                  {optionText}
                </span>
              </div>

              {/* Status Icons */}
              {isSubmitted && (
                <div>
                  {isCorrectOption && (
                    <span className="flex items-center text-xs font-bold bg-white/20 px-2.5 py-1 rounded-md">
                      <CheckCircle2 className="w-4 h-4 mr-1 stroke-[2.5]" /> Correct
                    </span>
                  )}
                  {isSelected && !isCorrect && (
                    <span className="flex items-center text-xs font-bold bg-white/20 px-2.5 py-1 rounded-md">
                      <XCircle className="w-4 h-4 mr-1 stroke-[2.5]" /> Your Answer (Wrong)
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* SUBMIT BUTTON (PRACTICE MODE) */}
      {testMode === 'practice' && !isSubmitted && selectedOption !== undefined && (
        <div className="mb-6">
          <button
            onClick={onSubmitAnswer}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-base shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center space-x-2 active:scale-[0.99]"
          >
            <span>Submit & Check Answer</span>
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* ANSWER EVALUATION & EXPLANATION BOX (VISIBLE AFTER SUBMIT) */}
      {isSubmitted && (
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800 animate-fadeIn">
          
          {/* Status Result Alert */}
          {isCorrect ? (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-emerald-800 dark:text-emerald-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-extrabold text-base">✓ Correct Answer!</h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    Great job! You selected the right option.
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold bg-emerald-200 dark:bg-emerald-900 px-3 py-1 rounded-lg">
                Correct Answer: {optionLabels[question.correctAnswer]}) {question.options[question.correctAnswer]}
              </span>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-800 dark:text-rose-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold">
                  ✗
                </div>
                <div>
                  <h4 className="font-extrabold text-base">✗ Wrong Answer</h4>
                  <p className="text-xs text-rose-700 dark:text-rose-300">
                    Your Answer: {selectedOption !== undefined ? optionLabels[selectedOption] : 'None'} • Correct Answer: <span className="font-bold underline">{optionLabels[question.correctAnswer]}</span>
                  </p>
                </div>
              </div>
              <div className="text-sm font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-3 py-1.5 rounded-lg flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                Correct: {optionLabels[question.correctAnswer]}) {question.options[question.correctAnswer]}
              </div>
            </div>
          )}

          {/* TELUGU EXPLANATION (తెలుగు వివరణ) */}
          <div className="bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-slate-800 dark:text-white font-bold text-sm mb-3">
              <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>తెలుగు వివరణ (Telugu Explanation):</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-telugu leading-relaxed whitespace-pre-line mb-3">
              {question.explanationTelugu || question.explanationEnglish}
            </p>

            {/* SHORTCUT / TRICK BOX */}
            {question.shortcutTelugu && (
              <div className="mt-3 p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs font-telugu flex items-start space-x-2">
                <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-700 dark:text-amber-300 block mb-0.5">
                    వేగవంతమైన పరిష్కార ట్రిక్ (Shortcut Trick):
                  </span>
                  <span>{question.shortcutTelugu}</span>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
