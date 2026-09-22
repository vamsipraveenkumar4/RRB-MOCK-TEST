import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_QUESTIONS } from '../data/initialQuestions';
import { DEFAULT_PAPERS } from '../data/defaultPapers';
import { RRB_PDF_PAPERS, RRB_PDF_QUESTIONS } from '../data/rrbPdfPapers';

const ALL_INITIAL_PAPERS = [...DEFAULT_PAPERS, ...RRB_PDF_PAPERS];
const ALL_INITIAL_QUESTIONS = [...INITIAL_QUESTIONS, ...RRB_PDF_QUESTIONS];

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- LOCAL STORAGE INITIALIZATION ---
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('railprep_questions');
    if (!saved) return ALL_INITIAL_QUESTIONS;
    try {
      const parsed = JSON.parse(saved);
      const existingIds = new Set(parsed.map(q => q.id));
      const missing = ALL_INITIAL_QUESTIONS.filter(q => !existingIds.has(q.id));
      return [...parsed, ...missing];
    } catch (e) {
      return ALL_INITIAL_QUESTIONS;
    }
  });

  const [papers, setPapers] = useState(() => {
    const saved = localStorage.getItem('railprep_papers');
    if (!saved) return ALL_INITIAL_PAPERS;
    try {
      const parsed = JSON.parse(saved);
      const existingIds = new Set(parsed.map(p => p.id));
      const missing = ALL_INITIAL_PAPERS.filter(p => !existingIds.has(p.id));
      const updated = parsed.map(p => {
        const match = ALL_INITIAL_PAPERS.find(dp => dp.id === p.id);
        return match ? { ...p, totalQuestions: match.totalQuestions, durationMinutes: match.durationMinutes } : p;
      });
      return [...updated, ...missing];
    } catch (e) {
      return ALL_INITIAL_PAPERS;
    }
  });

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('railprep_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const [mistakes, setMistakes] = useState(() => {
    const saved = localStorage.getItem('railprep_mistakes');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('railprep_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('railprep_darkmode');
    return saved ? JSON.parse(saved) : false;
  });

  // Navigation & Test Session State
  const [activePage, setActivePage] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Active Test Engine state
  const [activeTest, setActiveTest] = useState(null); 
  // activeTest structure: {
  //   id, paperTitle, exam, testMode: 'practice' | 'exam',
  //   questions: [], currentIndex: 0,
  //   userAnswers: { [qIndex]: selectedOptionIndex },
  //   submittedAnswers: { [qIndex]: boolean }, // in practice mode, tracks if Q was submitted
  //   markedForReview: { [qIndex]: boolean },
  //   timeRemainingSeconds: 5400,
  //   startTime: Date.now(),
  //   isSubmitted: false,
  //   result: null
  // }

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('railprep_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('railprep_papers', JSON.stringify(papers));
  }, [papers]);

  useEffect(() => {
    localStorage.setItem('railprep_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('railprep_mistakes', JSON.stringify(mistakes));
  }, [mistakes]);

  useEffect(() => {
    localStorage.setItem('railprep_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('railprep_darkmode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // --- TEST ENGINE ACTIONS ---
  const startTest = (paperId, testMode = 'practice') => {
    let paperQuestions = [];
    let paperTitle = "Custom Test";
    let examName = "RRB ALP";

    if (paperId === 'wrong-questions') {
      paperQuestions = questions.filter(q => mistakes.includes(q.id));
      paperTitle = "Practice My Mistakes";
      examName = "Mistakes Practice";
      if (paperQuestions.length === 0) {
        alert("You don't have any wrong questions saved yet! Complete a paper to populate mistakes.");
        return;
      }
    } else if (paperId === 'bookmarked') {
      paperQuestions = questions.filter(q => bookmarks.includes(q.id));
      paperTitle = "Bookmarked Questions";
      examName = "Bookmarks Practice";
      if (paperQuestions.length === 0) {
        alert("You have not bookmarked any questions yet.");
        return;
      }
    } else if (paperId.startsWith('exam-')) {
      const examType = paperId.replace('exam-', '');
      paperQuestions = questions.filter(q => q.exam.toLowerCase() === examType.toLowerCase());
      paperTitle = `RRB ${examType.toUpperCase()} Practice Set`;
      examName = `RRB ${examType.toUpperCase()}`;
    } else if (paperId.startsWith('subject-')) {
      const subjectName = paperId.replace('subject-', '');
      paperQuestions = questions.filter(q => q.subject.toLowerCase() === subjectName.toLowerCase());
      paperTitle = `${subjectName} Practice Test`;
      examName = subjectName;
    } else {
      const paperObj = papers.find(p => p.id === paperId);
      if (paperObj) {
        paperTitle = paperObj.title;
        examName = paperObj.exam;
        paperQuestions = questions.filter(q => q.paperId === paperId);
        if (paperQuestions.length === 0) {
          paperQuestions = questions.filter(q => q.exam === paperObj.exam);
        }
      }
      if (paperQuestions.length === 0) {
        paperQuestions = questions.slice(0, 15);
      }
    }

    const initialTestState = {
      id: 'test-' + Date.now(),
      paperId,
      paperTitle,
      examName,
      testMode, // 'practice' (instant Green/Red check) or 'exam' (timed formal test)
      questions: paperQuestions,
      currentIndex: 0,
      userAnswers: {},
      submittedAnswers: {},
      markedForReview: {},
      timeRemainingSeconds: paperQuestions.length * 60, // 1 min per question default
      startTime: Date.now(),
      isSubmitted: false,
      result: null
    };

    setActiveTest(initialTestState);
    setActivePage('test');
  };

  const selectAnswer = (questionIndex, optionIndex) => {
    if (!activeTest || activeTest.isSubmitted) return;
    setActiveTest(prev => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [questionIndex]: optionIndex
      }
    }));
  };

  const submitSingleAnswerPractice = (questionIndex) => {
    if (!activeTest) return;
    setActiveTest(prev => ({
      ...prev,
      submittedAnswers: {
        ...prev.submittedAnswers,
        [questionIndex]: true
      }
    }));
  };

  const clearAnswer = (questionIndex) => {
    if (!activeTest || activeTest.isSubmitted) return;
    setActiveTest(prev => {
      const updatedAnswers = { ...prev.userAnswers };
      delete updatedAnswers[questionIndex];
      const updatedSubmitted = { ...prev.submittedAnswers };
      delete updatedSubmitted[questionIndex];
      return {
        ...prev,
        userAnswers: updatedAnswers,
        submittedAnswers: updatedSubmitted
      };
    });
  };

  const toggleMarkForReview = (questionIndex) => {
    if (!activeTest) return;
    setActiveTest(prev => ({
      ...prev,
      markedForReview: {
        ...prev.markedForReview,
        [questionIndex]: !prev.markedForReview[questionIndex]
      }
    }));
  };

  const setQuestionIndex = (index) => {
    if (!activeTest) return;
    if (index >= 0 && index < activeTest.questions.length) {
      setActiveTest(prev => ({ ...prev, currentIndex: index }));
    }
  };

  const submitTest = () => {
    if (!activeTest || activeTest.isSubmitted) return;

    const testQs = activeTest.questions;
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    const newMistakeIds = [];
    const subjectScores = {};

    testQs.forEach((q, idx) => {
      const userAns = activeTest.userAnswers[idx];
      const subj = q.subject || "General";
      if (!subjectScores[subj]) {
        subjectScores[subj] = { total: 0, correct: 0 };
      }
      subjectScores[subj].total += 1;

      if (userAns === undefined) {
        skippedCount++;
      } else if (userAns === q.correctAnswer) {
        correctCount++;
        subjectScores[subj].correct += 1;
      } else {
        wrongCount++;
        newMistakeIds.push(q.id);
      }
    });

    const totalCount = testQs.length;
    const accuracy = totalCount > 0 ? Math.round((correctCount / (correctCount + wrongCount || 1)) * 100) : 0;
    const timeSpentSeconds = Math.max(1, Math.round((Date.now() - activeTest.startTime) / 1000));

    const resultObj = {
      testId: activeTest.id,
      paperTitle: activeTest.paperTitle,
      examName: activeTest.examName,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      score: correctCount,
      total: totalCount,
      correct: correctCount,
      wrong: wrongCount,
      skipped: skippedCount,
      accuracy,
      timeSpentSeconds,
      subjectScores,
      questions: testQs,
      userAnswers: activeTest.userAnswers
    };

    // Update global mistakes list
    setMistakes(prev => Array.from(new Set([...prev, ...newMistakeIds])));

    // Update history list
    setHistory(prev => [resultObj, ...prev]);

    setActiveTest(prev => ({
      ...prev,
      isSubmitted: true,
      result: resultObj
    }));

    setActivePage('result');
  };

  // --- BOOKMARKS CONTROL ---
  const toggleBookmark = (questionId) => {
    setBookmarks(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId) 
        : [...prev, questionId]
    );
  };

  // --- ADMIN & QUESTION DATA CRUD ---
  const addQuestion = (newQ) => {
    const qWithId = {
      ...newQ,
      id: newQ.id || 'q-' + (Date.now()),
      isVerified: newQ.isVerified ?? true
    };
    setQuestions(prev => [qWithId, ...prev]);
  };

  const updateQuestion = (id, updatedQ) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updatedQ } : q));
  };

  const deleteQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const importQuestionsBatch = (batchList) => {
    const formatted = batchList.map((item, idx) => ({
      id: item.id || `imp-${Date.now()}-${idx}`,
      exam: item.exam || "RRB ALP",
      year: item.year || 2025,
      shift: item.shift || "Shift 1",
      subject: item.subject || "Mathematics",
      topic: item.topic || "General",
      difficulty: item.difficulty || "Medium",
      questionEnglish: item.questionEnglish || item.question || "",
      questionTelugu: item.questionTelugu || "",
      options: item.options || [item.optionA, item.optionB, item.optionC, item.optionD],
      correctAnswer: typeof item.correctAnswer === 'number' ? item.correctAnswer : 0,
      explanationEnglish: item.explanationEnglish || "",
      explanationTelugu: item.explanationTelugu || "",
      shortcutTelugu: item.shortcutTelugu || "",
      isVerified: item.isVerified ?? true
    }));
    setQuestions(prev => [...formatted, ...prev]);
  };

  // Aggregated Overall Stats
  const totalQuestionsCount = questions.length;
  const totalTestsCompleted = history.length;
  const totalAttempted = history.reduce((acc, h) => acc + (h.correct + h.wrong), 0);
  const totalCorrect = history.reduce((acc, h) => acc + h.correct, 0);
  const totalWrong = history.reduce((acc, h) => acc + h.wrong, 0);
  const overallAccuracy = (totalCorrect + totalWrong) > 0 
    ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100) 
    : 0;

  // Weak Topics Calculation
  const weakTopics = (() => {
    const topicStats = {};
    history.forEach(h => {
      h.questions.forEach((q, idx) => {
        const userAns = h.userAnswers[idx];
        if (userAns !== undefined) {
          const t = q.topic || q.subject;
          if (!topicStats[t]) topicStats[t] = { correct: 0, total: 0 };
          topicStats[t].total += 1;
          if (userAns === q.correctAnswer) topicStats[t].correct += 1;
        }
      });
    });

    const list = Object.keys(topicStats).map(t => {
      const acc = Math.round((topicStats[t].correct / topicStats[t].total) * 100);
      return { topic: t, accuracy: acc, total: topicStats[t].total };
    });

    // Default fallback list if no history yet
    if (list.length === 0) {
      return [
        { topic: "Percentage", accuracy: 45, total: 10 },
        { topic: "Time & Work", accuracy: 52, total: 8 },
        { topic: "Profit & Loss", accuracy: 68, total: 12 },
        { topic: "Reasoning Series", accuracy: 88, total: 15 }
      ];
    }
    return list.sort((a, b) => a.accuracy - b.accuracy);
  })();

  return (
    <AppContext.Provider value={{
      questions,
      papers,
      bookmarks,
      mistakes,
      history,
      darkMode,
      toggleDarkMode,
      activePage,
      setActivePage,
      searchQuery,
      setSearchQuery,
      isSearchOpen,
      setIsSearchOpen,
      isAiModalOpen,
      setIsAiModalOpen,
      setPapers,
      activeTest,
      startTest,
      selectAnswer,
      submitSingleAnswerPractice,
      clearAnswer,
      toggleMarkForReview,
      setQuestionIndex,
      submitTest,
      toggleBookmark,
      addQuestion,
      updateQuestion,
      deleteQuestion,
      importQuestionsBatch,
      totalQuestionsCount,
      totalTestsCompleted,
      totalAttempted,
      totalCorrect,
      totalWrong,
      overallAccuracy,
      weakTopics
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
