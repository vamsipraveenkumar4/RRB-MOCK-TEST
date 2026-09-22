import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Train, 
  LayoutDashboard, 
  BookOpen, 
  AlertCircle, 
  Bookmark, 
  Calculator, 
  History, 
  PlusCircle, 
  Search, 
  Moon, 
  Sun,
  Flame,
  CheckCircle2
} from 'lucide-react';

export const Navbar = () => {
  const { 
    activePage, 
    setActivePage, 
    darkMode, 
    toggleDarkMode, 
    setIsSearchOpen,
    mistakes,
    bookmarks
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'papers', label: 'Previous Papers', icon: BookOpen },
    { 
      id: 'wrong-practice', 
      label: 'Practice Mistakes', 
      icon: AlertCircle, 
      badge: mistakes.length > 0 ? mistakes.length : null,
      badgeColor: 'bg-rose-500 text-white' 
    },
    { 
      id: 'bookmarks', 
      label: 'Bookmarks', 
      icon: Bookmark, 
      badge: bookmarks.length > 0 ? bookmarks.length : null,
      badgeColor: 'bg-amber-500 text-white' 
    },
    { id: 'logical-maths', label: 'ALP+JE Maths', icon: Calculator },
    { id: 'history', label: 'Test History', icon: History },
    { id: 'admin', label: 'Paper Admin', icon: PlusCircle },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
      {/* Top Banner Accent Line */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActivePage('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
              <Train className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-orange-900 to-amber-800 dark:from-white dark:via-orange-200 dark:to-amber-300 bg-clip-text text-transparent">
                  RailPrep AI
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300 border border-orange-300 dark:border-orange-800">
                  <CheckCircle2 className="w-2.5 h-2.5 mr-0.5 text-orange-600" /> VERIFIED
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                RRB Previous Year Papers • Practice • Learn • Improve
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 shadow-sm border border-orange-200/60 dark:border-orange-800/60'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-orange-50/50 dark:hover:bg-slate-800/60 hover:text-orange-600 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions: Search, Dark Mode, Quick Start */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg text-slate-500 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
              title="Search Questions (Ctrl+K)"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-500 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navbar Scrollable Row */}
        <div className="lg:hidden flex items-center space-x-2 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-100 dark:border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1 rounded-full text-[9px] font-bold bg-white text-orange-900">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
