import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  getStoredApiKey, 
  setStoredApiKey, 
  testOpenAiKey, 
  fetchLatestRRBQuestionsFromChatGPT 
} from '../services/openAiService';
import { 
  Sparkles, 
  Key, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  X, 
  Bot, 
  Zap, 
  HelpCircle,
  Eye,
  EyeOff,
  Flame,
  BookOpen
} from 'lucide-react';

export const AiRefreshModal = () => {
  const { 
    isAiModalOpen, 
    setIsAiModalOpen, 
    importQuestionsBatch,
    setPapers
  } = useApp();

  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState(null); // null | 'testing' | 'valid' | 'invalid'
  const [keyErrorMsg, setKeyErrorMsg] = useState('');

  // Generation Settings
  const [model, setModel] = useState('gpt-4o-mini');
  const [questionCount, setQuestionCount] = useState(10);
  const [examType, setExamType] = useState('RRB ALP & NTPC');
  const [subject, setSubject] = useState('All Subjects');

  // Loading & Result State
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [lastGeneratedCount, setLastGeneratedCount] = useState(null);

  useEffect(() => {
    if (isAiModalOpen) {
      const savedKey = getStoredApiKey();
      setApiKey(savedKey);
      setKeyStatus(null);
      setKeyErrorMsg('');
      setLastGeneratedCount(null);
    }
  }, [isAiModalOpen]);

  if (!isAiModalOpen) return null;

  const handleSaveAndTestKey = async () => {
    if (!apiKey.trim()) {
      setKeyStatus('invalid');
      setKeyErrorMsg('Please enter an OpenAI API key.');
      return;
    }

    setKeyStatus('testing');
    setKeyErrorMsg('');
    try {
      await testOpenAiKey(apiKey.trim());
      setStoredApiKey(apiKey.trim());
      setKeyStatus('valid');
    } catch (err) {
      setKeyStatus('invalid');
      setKeyErrorMsg(err.message || 'Key validation failed. Please check your API key.');
    }
  };

  const handleGenerateQuestions = async () => {
    if (!apiKey.trim()) {
      alert('Please enter your OpenAI API key to fetch live questions from ChatGPT.');
      return;
    }

    setIsGenerating(true);
    setStatusMessage('Connecting to ChatGPT API...');
    setLastGeneratedCount(null);

    try {
      // Save key first
      setStoredApiKey(apiKey.trim());

      setStatusMessage(`Prompting ${model} for latest 2026 ${examType} questions...`);

      const freshQuestions = await fetchLatestRRBQuestionsFromChatGPT({
        apiKey: apiKey.trim(),
        model,
        count: parseInt(questionCount, 10),
        exam: examType,
        subject
      });

      setStatusMessage('Integrating new RRB questions into local dataset...');

      // Add to global questions
      importQuestionsBatch(freshQuestions);

      // Also create a dedicated AI Mock Paper
      const newPaperId = `paper-ai-${Date.now()}`;
      const newPaperObj = {
        id: newPaperId,
        title: `ChatGPT AI Live Paper 2026 (${examType})`,
        exam: examType,
        year: 2026,
        shift: "ChatGPT Live Refresh",
        totalQuestions: freshQuestions.length,
        durationMinutes: freshQuestions.length,
        difficulty: "Medium-Hard",
        isAiGenerated: true,
        tags: ["ChatGPT", "Latest 2026", "Current Affairs"]
      };

      // Assign paperId to these questions
      freshQuestions.forEach(q => {
        q.paperId = newPaperId;
      });

      setPapers(prev => [newPaperObj, ...prev]);

      setLastGeneratedCount(freshQuestions.length);
      setStatusMessage(`Success! ${freshQuestions.length} new RRB questions generated and saved.`);
    } catch (err) {
      console.error(err);
      alert(`Error generating questions with ChatGPT: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Top Header Banner */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
              <Bot className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold tracking-tight">ChatGPT API Integration</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-900 uppercase">
                  LIVE RRB 2026
                </span>
              </div>
              <p className="text-xs text-orange-100 font-medium">
                Fetch latest RRB exam updates, current affairs & generate custom mock tests dynamically
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAiModalOpen(false)}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Section 1: OpenAI API Key Input */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm font-semibold text-slate-800 dark:text-slate-200">
                <Key className="w-4 h-4 text-orange-500 mr-2" />
                OpenAI ChatGPT API Key
              </label>
              {keyStatus === 'valid' && (
                <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Connected
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setKeyStatus(null);
                  }}
                  placeholder="sk-proj-..."
                  className="w-full pl-3 pr-10 py-2 rounded-lg text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                onClick={handleSaveAndTestKey}
                disabled={keyStatus === 'testing'}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white transition-all flex items-center space-x-1 shrink-0"
              >
                {keyStatus === 'testing' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <span>Save & Test</span>
                )}
              </button>
            </div>

            {keyErrorMsg && (
              <p className="text-xs text-rose-500 font-medium flex items-center">
                <XCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                {keyErrorMsg}
              </p>
            )}

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Get your key from{' '}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noreferrer" 
                className="text-orange-600 dark:text-orange-400 underline font-semibold"
              >
                platform.openai.com/api-keys
              </a>
              . Key is stored locally in your browser.
            </p>
          </div>

          {/* Section 2: Question Generation Options */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center">
              <Sparkles className="w-4 h-4 text-amber-500 mr-2" />
              AI Refresh & Generator Parameters
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* ChatGPT Model */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  ChatGPT Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                >
                  <option value="gpt-4o-mini">gpt-4o-mini (Fast & Recommended)</option>
                  <option value="gpt-4o">gpt-4o (High Accuracy & Deep Explanation)</option>
                  <option value="gpt-3.5-turbo">gpt-3.5-turbo (Standard)</option>
                </select>
              </div>

              {/* Exam Target */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Target RRB Exam
                </label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                >
                  <option value="RRB ALP & NTPC">RRB ALP & NTPC</option>
                  <option value="RRB Group D">RRB Group D</option>
                  <option value="RRB JE">RRB JE (Junior Engineer)</option>
                  <option value="All RRB Exams">All RRB Exams Combined</option>
                </select>
              </div>

              {/* Subject Focus */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Subject Focus
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                >
                  <option value="All Subjects">All Subjects (Balanced Paper)</option>
                  <option value="General Awareness">General Awareness & Railway Current Affairs</option>
                  <option value="General Science">General Science (Physics, Chemistry, Bio)</option>
                  <option value="Mathematics">Mathematics & Quant Tricks</option>
                  <option value="Reasoning">General Intelligence & Reasoning</option>
                </select>
              </div>

              {/* Question Count */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Number of Questions to Fetch
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                >
                  <option value={5}>5 Questions (Quick Test)</option>
                  <option value={10}>10 Questions (Standard Mock)</option>
                  <option value={15}>15 Questions (Detailed Set)</option>
                  <option value={20}>20 Questions (Full Paper)</option>
                </select>
              </div>

            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={`p-3 rounded-xl text-xs font-medium border flex items-center space-x-2 ${
              lastGeneratedCount 
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' 
                : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
            }`}>
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin text-amber-600 dark:text-amber-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              )}
              <span>{statusMessage}</span>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
            <Zap className="w-3.5 h-3.5 text-amber-500 mr-1" />
            AI generates real-time questions with explanations & Telugu solutions.
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsAiModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              Close
            </button>

            <button
              onClick={handleGenerateQuestions}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Fetching from ChatGPT...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-amber-200 text-amber-100" />
                  <span>Refresh & Generate Questions</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
