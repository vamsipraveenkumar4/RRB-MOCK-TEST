/**
 * OpenAI ChatGPT Service for RRB Mock Test
 * Fetches latest RRB exam questions, current affairs, and generates mock papers using ChatGPT API.
 */

export const getStoredApiKey = () => {
  return localStorage.getItem('railprep_openai_key') || import.meta.env.VITE_OPENAI_API_KEY || '';
};

export const setStoredApiKey = (key) => {
  if (key) {
    localStorage.setItem('railprep_openai_key', key.trim());
  } else {
    localStorage.removeItem('railprep_openai_key');
  }
};

/**
 * Validates the provided API key by calling OpenAI models endpoint
 */
export const testOpenAiKey = async (apiKey) => {
  const keyToTest = apiKey || getStoredApiKey();
  if (!keyToTest) {
    throw new Error('Please enter an OpenAI API Key.');
  }

  const response = await fetch('https://api.openai.com/v1/models', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${keyToTest.trim()}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API Key validation failed (${response.status})`);
  }

  return true;
};

/**
 * Generates fresh up-to-date RRB Questions using ChatGPT
 */
export const fetchLatestRRBQuestionsFromChatGPT = async ({
  apiKey,
  model = 'gpt-4o-mini',
  count = 10,
  exam = 'RRB ALP & NTPC',
  subject = 'All Subjects'
}) => {
  const keyToUse = apiKey || getStoredApiKey();
  if (!keyToUse) {
    throw new Error('OpenAI API Key is missing. Please enter your API key in the AI Refresh settings.');
  }

  const systemPrompt = `You are an expert examination setter for Indian Railway Recruitment Board (RRB) exams including RRB ALP, NTPC, Group D, and JE. 
Your task is to generate accurate, high-quality, up-to-date multiple choice questions based on the latest 2025-2026 RRB syllabus and current exam patterns.

Provide the output ONLY as a JSON array of question objects, without any markdown wrapping (no \`\`\`json block), or format it cleanly inside a JSON block.

Each question object MUST have the following structure:
{
  "id": "ai-q-12345",
  "exam": "${exam}",
  "year": 2026,
  "shift": "AI Refresh 2026",
  "subject": "Mathematics" | "General Science" | "Reasoning" | "General Awareness",
  "topic": "Topic Name",
  "difficulty": "Easy" | "Medium" | "Hard",
  "questionEnglish": "Question text in English...",
  "questionTelugu": "Question text in Telugu (or leave empty if not available)...",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0, (0 for A, 1 for B, 2 for C, 3 for D)
  "explanationEnglish": "Detailed step-by-step solution in English...",
  "explanationTelugu": "Solution in Telugu...",
  "shortcutTelugu": "Quick trick or formula..."
}`;

  const userPrompt = `Generate ${count} fresh, original RRB exam questions for target exam "${exam}" focusing on subject "${subject}".
Include current affairs for 2025-2026, recent Indian Railways updates, core science, quantitative aptitude, and logical reasoning.
Ensure every question has 4 distinct options and exact 0-indexed integer \`correctAnswer\` (0-3).`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${keyToUse.trim()}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `ChatGPT API call failed with status ${response.status}`);
  }

  const data = await response.json();
  const rawContent = data.choices[0]?.message?.content?.trim() || '';

  // Clean markdown code blocks if ChatGPT wraps in ```json ... ```
  let cleaned = rawContent;
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }

  let questionsArray = [];
  try {
    questionsArray = JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse ChatGPT output:", rawContent);
    throw new Error("Could not parse JSON response from ChatGPT. Please try again.");
  }

  if (!Array.isArray(questionsArray)) {
    if (questionsArray.questions && Array.isArray(questionsArray.questions)) {
      questionsArray = questionsArray.questions;
    } else {
      throw new Error("ChatGPT response did not return a valid list of questions.");
    }
  }

  // Sanitize and format each question
  const sanitized = questionsArray.map((q, idx) => ({
    id: q.id || `chatgpt-rrb-${Date.now()}-${idx}`,
    exam: q.exam || exam || "RRB ALP",
    year: q.year || 2026,
    shift: q.shift || "AI Refresh 2026",
    subject: q.subject || subject || "General Awareness",
    topic: q.topic || "Latest RRB Syllabus",
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
    createdAt: new Date().toISOString()
  }));

  return sanitized;
};
