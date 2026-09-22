import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { SearchModal } from './components/SearchModal';
import { AiRefreshModal } from './components/AiRefreshModal';
import { Dashboard } from './pages/Dashboard';
import { PaperLibrary } from './pages/PaperLibrary';
import { TestEngine } from './pages/TestEngine';
import { ResultPage } from './pages/ResultPage';
import { QuestionReview } from './pages/QuestionReview';
import { WrongQuestionsPage } from './pages/WrongQuestionsPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { LogicalMathsPage } from './pages/LogicalMathsPage';
import { HistoryPage } from './pages/HistoryPage';
import { AdminPage } from './pages/AdminPage';

const MainContent = () => {
  const { activePage } = useApp();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {activePage === 'dashboard' && <Dashboard />}
      {activePage === 'papers' && <PaperLibrary />}
      {activePage === 'test' && <TestEngine />}
      {activePage === 'result' && <ResultPage />}
      {activePage === 'review' && <QuestionReview />}
      {activePage === 'wrong-practice' && <WrongQuestionsPage />}
      {activePage === 'bookmarks' && <BookmarksPage />}
      {activePage === 'logical-maths' && <LogicalMathsPage />}
      {activePage === 'history' && <HistoryPage />}
      {activePage === 'admin' && <AdminPage />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <Navbar />
        <MainContent />
        <SearchModal />
        <AiRefreshModal />
        
        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 py-8 bg-white dark:bg-slate-900 text-slate-500 text-xs text-center space-y-2">
          <p className="font-bold text-slate-700 dark:text-slate-300">
            RailPrep AI • RRB Railway Exam Previous Year Papers Practice Platform
          </p>
          <p>
            Designed for RRB ALP, JE, Technician, NTPC & Group D • English & Telugu Solutions
          </p>
        </footer>
      </div>
    </AppProvider>
  );
}
