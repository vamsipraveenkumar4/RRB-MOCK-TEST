import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Filter, Play, Clock, CheckCircle2, ShieldCheck, Folder, Sparkles } from 'lucide-react';

export const PaperLibrary = () => {
  const { papers, startTest } = useApp();

  const [selectedSource, setSelectedSource] = useState('All');
  const [selectedExam, setSelectedExam] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedShift, setSelectedShift] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  const pdfFolderPapersCount = papers.filter(p => p.source === "RRB PDFs Folder" || p.id.startsWith("rrb-pdf-")).length;

  const filteredPapers = papers.filter(p => {
    const isPdfFolder = p.source === "RRB PDFs Folder" || p.id.startsWith("rrb-pdf-");
    if (selectedSource === 'RRB PDFs Folder' && !isPdfFolder) return false;
    if (selectedSource === 'Standard Mocks' && isPdfFolder) return false;
    if (selectedExam !== 'All' && p.exam !== selectedExam) return false;
    if (selectedYear !== 'All' && String(p.year) !== selectedYear) return false;
    if (selectedShift !== 'All' && p.shift !== selectedShift) return false;
    if (selectedLanguage !== 'All' && !p.language.includes(selectedLanguage)) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
            <BookOpen className="w-7 h-7 text-orange-600" />
            <span>Previous Year Papers & PDF Catalog</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Official RRB question papers loaded from <span className="font-semibold text-orange-600">RRB PDFs Folder</span> ({pdfFolderPapersCount} papers) with verified English + Telugu solutions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedSource(selectedSource === 'RRB PDFs Folder' ? 'All' : 'RRB PDFs Folder')}
            className={`text-xs font-extrabold px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 border ${
              selectedSource === 'RRB PDFs Folder'
                ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-500/20'
                : 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 hover:bg-orange-100'
            }`}
          >
            <Folder className="w-4 h-4 text-amber-400" />
            <span>📁 RRB PDFs Folder ({pdfFolderPapersCount})</span>
          </button>
          
          <div className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
            Showing {filteredPapers.length} of {papers.length} Papers
          </div>
        </div>
      </div>

      {/* SPECIAL RRB PDF FOLDER BANNER */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white border border-orange-400/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0">
            <Folder className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base text-white">RRB PDFs Folder Options Integrated</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-orange-900 uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-orange-600" /> 42 Papers Active
              </span>
            </div>
            <p className="text-xs text-orange-100 mt-0.5">
              All question papers from <code className="bg-slate-950/40 text-amber-200 px-1.5 py-0.5 rounded font-mono text-[11px]">c:\Users\saiva\Downloads\RRB PDFs</code> have been converted into interactive online tests!
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setSelectedSource('RRB PDFs Folder')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all w-full sm:w-auto ${
              selectedSource === 'RRB PDFs Folder'
                ? 'bg-slate-950 text-white shadow-md'
                : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
            }`}
          >
            {selectedSource === 'RRB PDFs Folder' ? 'Showing RRB PDFs' : 'Filter RRB PDFs Only'}
          </button>
          {selectedSource !== 'All' && (
            <button
              onClick={() => setSelectedSource('All')}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-orange-100 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-orange-600" />
          <span>Filter Papers By:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          
          {/* Source Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Source Folder</label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold border-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="All">All Sources</option>
              <option value="RRB PDFs Folder">📁 RRB PDFs Folder (42)</option>
              <option value="Standard Mocks">Standard Mock Tests</option>
            </select>
          </div>

          {/* Exam Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Exam</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium border-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="All">All Exams</option>
              <option value="ALP">RRB ALP</option>
              <option value="JE">RRB JE</option>
              <option value="Technician">RRB Technician</option>
              <option value="NTPC">RRB NTPC</option>
              <option value="Group D">RRB Group D</option>
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium border-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="All">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2018">2018</option>
            </select>
          </div>

          {/* Shift Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Shift</label>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium border-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="All">All Shifts</option>
              <option value="Shift 1">Shift 1</option>
              <option value="Shift 2">Shift 2</option>
              <option value="Shift 3">Shift 3</option>
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium border-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="All">All Languages</option>
              <option value="Telugu">Telugu</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>

        </div>
      </div>

      {/* PAPERS CARDS GRID */}
      {filteredPapers.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No matching papers found</h3>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your filter selection above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-orange-100 dark:border-slate-800 p-6 shadow-md hover:shadow-xl hover:border-orange-500 dark:hover:border-orange-500 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Exam Badge & Year */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1.5">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                      RRB {paper.exam}
                    </span>
                    {(paper.source === "RRB PDFs Folder" || paper.id.startsWith("rrb-pdf-")) && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center space-x-1">
                        <Folder className="w-3 h-3 text-amber-500" />
                        <span>RRB PDF</span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    {paper.year} • {paper.shift}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors mb-2">
                  {paper.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {paper.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {paper.subjects.map((s, i) => (
                    <span key={i} className="text-[10px] font-semibold bg-orange-50/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                {/* Meta details */}
                <div className="flex items-center justify-between py-3 border-t border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-500 mb-4">
                  <span>{paper.totalQuestions} Questions</span>
                  <span>{paper.durationMinutes} Minutes</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-0.5" /> Verified
                  </span>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => startTest(paper.id, 'practice')}
                    className="py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center space-x-1"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Practice Mode</span>
                  </button>

                  <button
                    onClick={() => startTest(paper.id, 'exam')}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center space-x-1"
                  >
                    <Clock className="w-3.5 h-3.5 text-orange-600" />
                    <span>Timed Exam</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
