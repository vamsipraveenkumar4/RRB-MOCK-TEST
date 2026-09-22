import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Copy, 
  Eye, 
  ShieldCheck, 
  Download, 
  Upload, 
  FileText,
  CheckCircle2
} from 'lucide-react';
import { QuestionCard } from '../components/QuestionCard';

export const AdminPage = () => {
  const { 
    questions, 
    addQuestion, 
    updateQuestion, 
    deleteQuestion, 
    importQuestionsBatch 
  } = useApp();

  const [editingId, setEditingId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [batchJsonInput, setBatchJsonInput] = useState('');
  const [importTab, setImportTab] = useState('manual'); // 'manual' | 'batch'

  const initialFormState = {
    exam: 'RRB ALP',
    year: 2025,
    shift: 'Shift 2',
    subject: 'Mathematics',
    topic: 'Percentage',
    difficulty: 'Medium',
    questionEnglish: '',
    questionTelugu: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 0,
    explanationEnglish: '',
    explanationTelugu: '',
    shortcutTelugu: '',
    isVerified: true
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleEditClick = (q) => {
    setEditingId(q.id);
    setFormData({
      exam: q.exam,
      year: q.year,
      shift: q.shift,
      subject: q.subject,
      topic: q.topic,
      difficulty: q.difficulty || 'Medium',
      questionEnglish: q.questionEnglish,
      questionTelugu: q.questionTelugu,
      optionA: q.options[0] || '',
      optionB: q.options[1] || '',
      optionC: q.options[2] || '',
      optionD: q.options[3] || '',
      correctAnswer: q.correctAnswer,
      explanationEnglish: q.explanationEnglish,
      explanationTelugu: q.explanationTelugu,
      shortcutTelugu: q.shortcutTelugu || '',
      isVerified: q.isVerified ?? true
    });
    setImportTab('manual');
  };

  const handleDuplicateClick = (q) => {
    const dup = {
      ...q,
      id: 'q-' + Date.now(),
      questionEnglish: q.questionEnglish + ' (Copy)'
    };
    addQuestion(dup);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const qData = {
      exam: formData.exam,
      year: Number(formData.year),
      shift: formData.shift,
      subject: formData.subject,
      topic: formData.topic,
      difficulty: formData.difficulty,
      questionEnglish: formData.questionEnglish,
      questionTelugu: formData.questionTelugu,
      options: [formData.optionA, formData.optionB, formData.optionC, formData.optionD],
      correctAnswer: Number(formData.correctAnswer),
      explanationEnglish: formData.explanationEnglish,
      explanationTelugu: formData.explanationTelugu,
      shortcutTelugu: formData.shortcutTelugu,
      isVerified: formData.isVerified
    };

    if (editingId) {
      updateQuestion(editingId, qData);
      setEditingId(null);
    } else {
      addQuestion(qData);
    }

    setFormData(initialFormState);
    alert('Question saved successfully to verified local question bank!');
  };

  const handleBatchImport = () => {
    try {
      const parsed = JSON.parse(batchJsonInput);
      if (Array.isArray(parsed)) {
        importQuestionsBatch(parsed);
        alert(`Successfully imported ${parsed.length} questions!`);
        setBatchJsonInput('');
      } else {
        alert('Invalid format. Input JSON must be an Array of question objects.');
      }
    } catch (err) {
      alert('JSON Parse Error: Please check your JSON syntax.');
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `railprep_questions_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const previewQObj = {
    id: 'preview',
    exam: formData.exam,
    year: formData.year,
    shift: formData.shift,
    subject: formData.subject,
    topic: formData.topic,
    difficulty: formData.difficulty,
    questionEnglish: formData.questionEnglish || "Sample Question Text in English...",
    questionTelugu: formData.questionTelugu || "నమూనా ప్రశ్న పాఠం తెలుగులో...",
    options: [
      formData.optionA || "Option A",
      formData.optionB || "Option B",
      formData.optionC || "Option C",
      formData.optionD || "Option D"
    ],
    correctAnswer: Number(formData.correctAnswer),
    explanationEnglish: formData.explanationEnglish || "Explanation in English",
    explanationTelugu: formData.explanationTelugu || "తెలుగు వివరణ సూచించబడింది.",
    shortcutTelugu: formData.shortcutTelugu || "షార్ట్‌కట్ సూత్రం.",
    isVerified: formData.isVerified
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <PlusCircle className="w-6 h-6 text-orange-600" />
            <span>Admin Question Editor & Importer</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manually add, edit, verify answer keys, or batch import/export paper questions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center space-x-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* TABS: MANUAL FORM vs BATCH IMPORT */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setImportTab('manual')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all ${
            importTab === 'manual' 
              ? 'border-orange-600 text-orange-600 dark:text-orange-400' 
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          {editingId ? 'Edit Question' : 'Manual Question Editor'}
        </button>

        <button
          onClick={() => setImportTab('batch')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all ${
            importTab === 'batch' 
              ? 'border-orange-600 text-orange-600 dark:text-orange-400' 
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Batch JSON / CSV Import
        </button>
      </div>

      {/* TAB 1: MANUAL QUESTION EDITOR FORM */}
      {importTab === 'manual' && (
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-3xl border border-orange-100 dark:border-slate-800 p-6 sm:p-8 shadow-md space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editingId ? `Editing Question #${editingId}` : 'Add New Verified Question'}
            </h3>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-3.5 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-bold text-xs flex items-center space-x-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showPreview ? 'Hide Preview' : 'Live Preview'}</span>
            </button>
          </div>

          {/* Metadata selection row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Exam</label>
              <select
                value={formData.exam}
                onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs border-none"
              >
                <option value="RRB ALP">RRB ALP</option>
                <option value="RRB JE">RRB JE</option>
                <option value="RRB Technician">RRB Technician</option>
                <option value="RRB NTPC">RRB NTPC</option>
                <option value="RRB Group D">RRB Group D</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Year</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs border-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Shift</label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs border-none"
              >
                <option value="Shift 1">Shift 1</option>
                <option value="Shift 2">Shift 2</option>
                <option value="Shift 3">Shift 3</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs border-none"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Reasoning">Reasoning</option>
                <option value="General Science">General Science</option>
                <option value="General Awareness">General Awareness</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Topic Name</label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g. Percentage, Profit & Loss"
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs border-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs border-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 pt-5">
              <input
                type="checkbox"
                id="isVerifiedCheck"
                checked={formData.isVerified}
                onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                className="w-4 h-4 text-orange-600 rounded"
              />
              <label htmlFor="isVerifiedCheck" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Verified Official Answer Key
              </label>
            </div>
          </div>

          {/* Question Text Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-orange-600 dark:text-orange-400 mb-1 uppercase">
                Question Text (English)
              </label>
              <textarea
                value={formData.questionEnglish}
                onChange={(e) => setFormData({ ...formData, questionEnglish: e.target.value })}
                rows={2}
                placeholder="Enter English question text..."
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm border-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-teal-600 dark:text-teal-400 mb-1 uppercase">
                తెలుగు ప్రశ్న (Telugu Translation)
              </label>
              <textarea
                value={formData.questionTelugu}
                onChange={(e) => setFormData({ ...formData, questionTelugu: e.target.value })}
                rows={2}
                placeholder="తెలుగులో ప్రశ్న వ్రాయండి..."
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-telugu border-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Answer Options & Correct Key Selection
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['A', 'B', 'C', 'D'].map((lbl, idx) => {
                const keys = ['optionA', 'optionB', 'optionC', 'optionD'];
                const key = keys[idx];
                const isCorrect = Number(formData.correctAnswer) === idx;

                return (
                  <div key={idx} className={`p-3 rounded-2xl border-2 flex items-center space-x-3 transition-colors ${
                    isCorrect ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40' : 'border-slate-200 dark:border-slate-800'
                  }`}>
                    <input
                      type="radio"
                      name="correctAnswerRadio"
                      checked={isCorrect}
                      onChange={() => setFormData({ ...formData, correctAnswer: idx })}
                      className="w-4 h-4 text-emerald-600"
                    />
                    <span className="font-bold text-sm text-slate-600 dark:text-slate-400">{lbl})</span>
                    <input
                      type="text"
                      value={formData[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      placeholder={`Option ${lbl}`}
                      className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none"
                      required
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                English Explanation
              </label>
              <textarea
                value={formData.explanationEnglish}
                onChange={(e) => setFormData({ ...formData, explanationEnglish: e.target.value })}
                rows={2}
                placeholder="English detailed step-by-step solution..."
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs border-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-teal-600 dark:text-teal-400 mb-1">
                తెలుగు వివరణ (Telugu Solution)
              </label>
              <textarea
                value={formData.explanationTelugu}
                onChange={(e) => setFormData({ ...formData, explanationTelugu: e.target.value })}
                rows={2}
                placeholder="తెలుగులో వివరణ వ్రాయండి..."
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-telugu border-none"
              />
            </div>
          </div>

          {/* Shortcut Trick Field */}
          <div>
            <label className="block text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
              వేగవంతమైన పరిష్కార ట్రిక్ / షార్ట్‌కట్ (Shortcut Trick)
            </label>
            <input
              type="text"
              value={formData.shortcutTelugu}
              onChange={(e) => setFormData({ ...formData, shortcutTelugu: e.target.value })}
              placeholder="ఉదాహరణ: (A × B) / (A + B) సూత్రం వర్తించండి..."
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-telugu border-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-500/20"
            >
              {editingId ? 'Update Question' : 'Save Question to Bank'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData(initialFormState);
                }}
                className="px-4 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm"
              >
                Cancel Edit
              </button>
            )}
          </div>

        </form>
      )}

      {/* LIVE PREVIEW BOX */}
      {importTab === 'manual' && showPreview && (
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Live Question Card Preview:</h3>
          <QuestionCard
            question={previewQObj}
            questionIndex={0}
            totalQuestions={1}
            selectedOption={0}
            onSelectOption={() => {}}
            onSubmitAnswer={() => {}}
            isSubmitted={true}
            testMode="practice"
          />
        </div>
      )}

      {/* TAB 2: BATCH IMPORT */}
      {importTab === 'batch' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Batch Import Questions (JSON Format)
          </h3>
          <p className="text-xs text-slate-500">
            Paste a JSON array of question objects to import dozens of previous year questions at once.
          </p>

          <textarea
            value={batchJsonInput}
            onChange={(e) => setBatchJsonInput(e.target.value)}
            rows={10}
            placeholder={`[\n  {\n    "exam": "RRB ALP",\n    "year": 2025,\n    "questionEnglish": "Sample Q",\n    "questionTelugu": "సాంపుల్ ప్రశ్న",\n    "options": ["A", "B", "C", "D"],\n    "correctAnswer": 2\n  }\n]`}
            className="w-full p-4 rounded-xl font-mono text-xs bg-slate-100 dark:bg-slate-850 text-slate-900 dark:text-white border-none"
          />

          <button
            onClick={handleBatchImport}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center space-x-1"
          >
            <Upload className="w-4 h-4" />
            <span>Process & Import JSON Questions</span>
          </button>
        </div>
      )}

      {/* EXISTING QUESTIONS BANK TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <span>Question Bank Catalog ({questions.length} Questions)</span>
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto pr-1">
          {questions.map((q) => (
            <div key={q.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2 text-xs font-bold text-blue-600">
                  <span className="bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded">{q.exam}</span>
                  <span>{q.subject} • {q.topic}</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                  {q.questionEnglish}
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => handleEditClick(q)}
                  className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                  title="Edit Question"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDuplicateClick(q)}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (confirm('Delete this question from bank?')) deleteQuestion(q.id);
                  }}
                  className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
