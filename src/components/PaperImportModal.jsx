import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, FileText, CheckCircle2, X, Plus } from 'lucide-react';

export const PaperImportModal = ({ isOpen, onClose }) => {
  const { setActivePage } = useApp();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    exam: 'ALP',
    year: '2025',
    shift: 'Shift 2',
    subject: 'Mathematics',
    language: 'Bilingual (English + Telugu)',
    title: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [imported, setImported] = useState(false);

  if (!isOpen) return null;

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setImported(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Upload Paper & Setup Metadata
              </h3>
              <p className="text-xs text-slate-500">
                Upload PDF / JPG / PNG previous year exam papers
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!imported ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* File Upload Box */}
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-orange-500 transition-colors bg-orange-50/20 dark:bg-slate-850 cursor-pointer"
                onClick={() => document.getElementById('fileInput').click()}
              >
                <input 
                  id="fileInput" 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                <FileText className="w-10 h-10 text-orange-500 mx-auto mb-2" />
                {file ? (
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm">
                      {file.name}
                    </span>
                    <span className="text-xs text-emerald-600 font-semibold">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to import
                    </span>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Drag & Drop your RRB PDF or Image paper here
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Supports PDF, JPG, PNG (Max 50MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Form Metadata Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Exam Name
                  </label>
                  <select
                    value={formData.exam}
                    onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm border-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="ALP">RRB ALP</option>
                    <option value="JE">RRB JE</option>
                    <option value="Technician">RRB Technician</option>
                    <option value="NTPC">RRB NTPC</option>
                    <option value="Group D">RRB Group D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Exam Year
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm border-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Shift
                  </label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm border-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Shift 1">Shift 1</option>
                    <option value="Shift 2">Shift 2</option>
                    <option value="Shift 3">Shift 3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Primary Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm border-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Bilingual (English + Telugu)">Bilingual (English + Telugu)</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Telugu">Telugu</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <span>Processing & Extracting...</span>
                ) : (
                  <>
                    <span>Process Paper & Create Questions</span>
                    <Plus className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          ) : (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Paper Imported Successfully!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Paper setup for <span className="font-semibold text-orange-600">RRB {formData.exam} ({formData.year} {formData.shift})</span> is registered. Now verify & add question solutions in the Question Editor.
              </p>
              <div className="flex justify-center space-x-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    setActivePage('admin');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/20"
                >
                  Open Question Editor
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
