import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  getStoredApiKey, 
  setStoredApiKey, 
  testOpenAiKey, 
  fetchLatestRRBQuestionsFromChatGPT 
} from '../services/openAiService';
import { 
  getStoredGeminiKey, 
  setStoredGeminiKey, 
  testGeminiKey, 
  fetchLatestRRBQuestionsFromGemini 
} from '../services/geminiService';
import { 
  Sparkles, 
  Key, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  X, 
  Bot, 
  Zap, 
  Eye,
  EyeOff,
  Globe,
  Cpu
} from 'lucide-react';

export const AiRefreshModal = () => {
  const { 
    isAiModalOpen, 
    setIsAiModalOpen, 
    importQuestionsBatch,
    setPapers
  } = useApp();

  // AI Provider Choice: 'gemini' | 'openai'
  const [provider, setProvider] = useState('gemini');

  // Keys
  const [geminiKey, setGeminiKey] = useState('');
  const [openAiKey, setOpenAiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState(null); // null | 'testing' | 'valid' | 'invalid'
  const [keyErrorMsg, setKeyErrorMsg] = useState('');

  // Generation Settings
  const [model, setModel] = useState('gemini-2.5-flash');
  const [questionCount, setQuestionCount] = useState(10);
  const [examType, setExamType] = useState('RRB ALP & NTPC');
  const [subject, setSubject] = useState('All Subjects');

  // Loading & Result State
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [lastGeneratedCount, setLastGeneratedCount] = useState(null);

  useEffect(() => {
    if (isAiModalOpen) {
      const savedGemini = getStoredGeminiKey();
      const savedOpenAi = getStoredApiKey();
      setGeminiKey(savedGemini);
      setOpenAiKey(savedOpenAi);
      setKeyStatus(null);
      setKeyErrorMsg('');
      setLastGeneratedCount(null);
    }
  }, [isAiModalOpen]);

  // Update default model when provider changes
  useEffect(() => {
    if (provider === 'gemini') {
      setModel('gemini-2.5-flash');
    } else {
      setModel('gpt-4o-mini');
    }
    setKeyStatus(null);
    setKeyErrorMsg('');
  }, [provider]);

  if (!isAiModalOpen) return null;

  const currentKey = provider === 'gemini' ? geminiKey : openAiKey;

  const handleSaveAndTestKey = async () => {
    if (!currentKey.trim()) {
      setKeyStatus('invalid');
      setKeyErrorMsg(`Please enter a valid ${provider === 'gemini' ? 'Google Gemini' : 'OpenAI'} API key.`);
      return;
    }

    setKeyStatus('testing');
    setKeyErrorMsg('');
    try {
      if (provider === 'gemini') {
        await testGeminiKey(currentKey.trim());
        setStoredGeminiKey(currentKey.trim());
      } else {
        await testOpenAiKey(currentKey.trim());
        setStoredApiKey(currentKey.trim());
      }
      setKeyStatus('valid');
    } catch (err) {
      setKeyStatus('invalid');
      setKeyErrorMsg(err.message || 'Key validation failed. Please verify your API key.');
    }
  };

  const handleGenerateQuestions = async () => {
    if (!currentKey.trim()) {
      alert(`Please enter your ${provider === 'gemini' ? 'Google Gemini' : 'OpenAI'} API key to fetch questions.`);
      return;
    }

    setIsGenerating(true);
    setStatusMessage(`Connecting to ${provider === 'gemini' ? 'Google Gemini AI' : 'ChatGPT API'}...`);
    setLastGeneratedCount(null);

    try {
      let freshQuestions = [];

      if (provider === 'gemini') {
        setStoredGeminiKey(currentKey.trim());
        setStatusMessage(`Prompting ${model} (Google AI) for latest 2026 ${examType} questions...`);

        freshQuestions = await fetchLatestRRBQuestionsFromGemini({
          apiKey: currentKey.trim(),
          model,
          count: parseInt(questionCount, 10),
          exam: examType,
          subject
        });
      } else {
        setStoredApiKey(currentKey.trim());
        setStatusMessage(`Prompting ${model} (ChatGPT) for latest 2026 ${examType} questions...`);

        freshQuestions = await fetchLatestRRBQuestionsFromChatGPT({
          apiKey: currentKey.trim(),
          model,
          count: parseInt(questionCount, 10),
          exam: examType,
          subject
        });
      }

      setStatusMessage('Integrating fresh RRB questions into local exam dataset...');

      // Add to global questions
      importQuestionsBatch(freshQuestions);

      // Create a dedicated AI Mock Paper
      const newPaperId = `paper-ai-${Date.now()}`;
      const providerLabel = provider === 'gemini' ? 'Google Gemini AI' : 'ChatGPT AI';
      const newPaperObj = {
        id: newPaperId,
        title: `${providerLabel} Live RRB Paper 2026 (${examType})`,
        exam: examType,
        year: 2026,
        shift: `${providerLabel} Live`,
        totalQuestions: freshQuestions.length,
        durationMinutes: freshQuestions.length,
        difficulty: "Medium-Hard",
        isAiGenerated: true,
        tags: [providerLabel, "Latest 2026", "Current Affairs"]
      };

      // Assign paperId to questions
      freshQuestions.forEach(q => {
        q.paperId = newPaperId;
      });

      setPapers(prev => [newPaperObj, ...prev]);

      setLastGeneratedCount(freshQuestions.length);
      setStatusMessage(`Success! ${freshQuestions.length} fresh RRB questions generated via ${providerLabel} and saved.`);
    } catch (err) {
      console.error(err);
      alert(`Error generating questions: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Top Header Banner */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
              <Bot className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold tracking-tight">AI Live Question Refresh</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-900 uppercase">
                  RRB 2026
                </span>
              </div>
              <p className="text-xs text-blue-100 font-medium">
                Fetch real-time RRB questions using Google Gemini AI or OpenAI ChatGPT
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
          
          {/* AI Provider Switcher */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setProvider('gemini')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                provider === 'gemini'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Google Gemini AI (Free Tier Recommended)</span>
            </button>

            <button
              type="button"
              onClick={() => setProvider('openai')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                provider === 'openai'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>OpenAI ChatGPT</span>
            </button>
          </div>

          {/* Section 1: API Key Input */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm font-semibold text-slate-800 dark:text-slate-200">
                <Key className="w-4 h-4 text-blue-500 mr-2" />
                {provider === 'gemini' ? 'Google Gemini API Key' : 'OpenAI ChatGPT API Key'}
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
                  value={currentKey}
                  onChange={(e) => {
                    if (provider === 'gemini') {
                      setGeminiKey(e.target.value);
                    } else {
                      setOpenAiKey(e.target.value);
                    }
                    setKeyStatus(null);
                  }}
                  placeholder={provider === 'gemini' ? 'AIzaSy...' : 'sk-proj-...'}
                  className="w-full pl-3 pr-10 py-2 rounded-lg text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
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
              {provider === 'gemini' ? (
                <>
                  Get a free API key from{' '}
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-blue-600 dark:text-blue-400 underline font-semibold"
                  >
                    aistudio.google.com/app/apikey
                  </a>
                  . Free Tier included!
                </>
              ) : (
                <>
                  Get your key from{' '}
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-orange-600 dark:text-orange-400 underline font-semibold"
                  >
                    platform.openai.com/api-keys
                  </a>
                </>
              )}
            </p>
          </div>

          {/* Section 2: Question Generation Options */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center">
              <Sparkles className="w-4 h-4 text-amber-500 mr-2" />
              AI Refresh Parameters
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Model Choice */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  AI Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                >
                  {provider === 'gemini' ? (
                    <>
                      <option value="gemini-2.5-flash">gemini-2.5-flash (Latest & Fast - Recommended)</option>
                      <option value="gemini-1.5-flash">gemini-1.5-flash (Fast Free Tier)</option>
                      <option value="gemini-1.5-pro">gemini-1.5-pro (Deep Knowledge)</option>
                    </>
                  ) : (
                    <>
                      <option value="gpt-4o-mini">gpt-4o-mini (Fast & Recommended)</option>
                      <option value="gpt-4o">gpt-4o (High Accuracy)</option>
                      <option value="gpt-3.5-turbo">gpt-3.5-turbo (Standard)</option>
                    </>
                  )}
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
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
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
                : 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
            }`}>
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400 shrink-0" />
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
            Supports English & Telugu solutions dynamically.
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
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 ${
                provider === 'gemini'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-500/25'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Fetching from AI...</span>
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
