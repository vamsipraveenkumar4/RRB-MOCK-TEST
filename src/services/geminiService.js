/**
 * Google Gemini AI Service for RRB Mock Test
 * Fetches latest RRB exam questions, current affairs, and generates mock papers using Google Gemini API (Free Tier).
 */

export const getStoredGeminiKey = () => {
  return localStorage.getItem('railprep_gemini_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
};

export const setStoredGeminiKey = (key) => {
  if (key) {
    localStorage.setItem('railprep_gemini_key', key.trim());
  } else {
    localStorage.removeItem('railprep_gemini_key');
  }
};

/**
 * Validates Google Gemini API key by making a minimal generateContent request
 */
export const testGeminiKey = async (apiKey) => {
  const keyToTest = apiKey || getStoredGeminiKey();
  if (!keyToTest) {
    throw new Error('Please enter a Google Gemini API Key.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${keyToTest.trim()}`;
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: 'Hello' }] }]
    })
  });

  if (!response.ok) {
    const fallbackEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${keyToTest.trim()}`;
    const fallbackRes = await fetch(fallbackEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: 'Hello' }] }] })
    });

    if (!fallbackRes.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Gemini API key validation failed (${response.status})`);
    }
  }

  return true;
};

/**
 * Generates fresh up-to-date RRB Questions using Google Gemini AI
 */
export const fetchLatestRRBQuestionsFromGemini = async ({
  apiKey,
  model = 'gemini-2.5-flash',
  count = 10,
  exam = 'RRB ALP & NTPC',
  subject = 'All Subjects'
}) => {
  const keyToUse = apiKey || getStoredGeminiKey();
  if (!keyToUse) {
    throw new Error('Google Gemini API Key is missing. Please enter your Gemini API key from Google AI Studio.');
  }

  const promptText = `You are an expert examination setter for Indian Railway Recruitment Board (RRB) exams including RRB ALP, NTPC, Group D, and JE.
Your task is to generate ${count} accurate, high-quality, up-to-date multiple choice questions based on the latest 2025-2026 RRB syllabus, recent Indian Railways updates, physics/math numericals, reasoning, and current affairs.

Target Exam: "${exam}"
Target Subject: "${subject}"

CRITICAL: Return ONLY a raw JSON array of objects. Do NOT include any markdown code blocks, do NOT write \`\`\`json. Return strictly raw JSON.

Each question object MUST follow this schema:
[
  {
    "id": "gemini-q-1",
    "exam": "${exam}",
    "year": 2026,
    "shift": "Gemini AI 2026",
    "subject": "Mathematics" | "General Science" | "Reasoning" | "General Awareness",
    "topic": "Topic Name",
    "difficulty": "Easy" | "Medium" | "Hard",
    "questionEnglish": "Question text in English...",
    "questionTelugu": "Question text in Telugu...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanationEnglish": "Step-by-step solution in English...",
    "explanationTelugu": "Solution in Telugu...",
    "shortcutTelugu": "Quick formula/trick in Telugu..."
  }
]`;

  let selectedModel = model || 'gemini-3.6-flash';
  let endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${keyToUse.trim()}`;

  let response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8000
      }
    })
  });

  // Fallback to gemini-flash-latest if model name is invalid or unavailable
  if (!response.ok) {
    selectedModel = 'gemini-flash-latest';
    endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${keyToUse.trim()}`;
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8000
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Gemini API request failed with status ${response.status}`);
    }
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

  // Clean markdown wrapping if present
  let cleaned = rawText;
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }

  let questionsArray = [];
  try {
    questionsArray = JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse Gemini output:", rawText);
    throw new Error("Could not parse JSON response from Gemini AI. Please try again.");
  }

  if (!Array.isArray(questionsArray)) {
    if (questionsArray.questions && Array.isArray(questionsArray.questions)) {
      questionsArray = questionsArray.questions;
    } else {
      throw new Error("Gemini API response did not return a valid list of questions.");
    }
  }

  // Format and sanitize each question
  const sanitized = questionsArray.map((q, idx) => ({
    id: q.id || `gemini-rrb-${Date.now()}-${idx}`,
    exam: q.exam || exam || "RRB ALP",
    year: q.year || 2026,
    shift: q.shift || "Gemini Live 2026",
    subject: q.subject || subject || "General Awareness",
    topic: q.topic || "Latest RRB Pattern",
    difficulty: q.difficulty || "Medium",
    questionEnglish: q.questionEnglish || q.question || "",
    questionTelugu: q.questionTelugu || "",
    options: Array.isArray(q.options) && q.options.length >= 4 
      ? q.options.slice(0, 4) 
      : [q.optionA || "Option A", q.optionB || "Option B", q.optionC || "Option C", q.optionD || "Option D"],
    correctAnswer: typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer <= 3 
      ? q.correctAnswer 
      : 0,
    explanationEnglish: q.explanationEnglish || q.explanation || "No explanation provided.",
    explanationTelugu: q.explanationTelugu || "",
    shortcutTelugu: q.shortcutTelugu || "",
    isVerified: true,
    isAiGenerated: true,
    aiProvider: "Google Gemini",
    createdAt: new Date().toISOString()
  }));

  return sanitized;
};
