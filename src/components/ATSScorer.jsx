// src/components/ATSScorer.jsx
import { useState } from "react";
import { btn, input, card } from "../styles/ui";
import { extractATSKeywords } from "../services/aiService";

// Fallback extractor used only if AI fails
const STOP_WORDS = new Set([
  "the",
  "and",
  "or",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "a",
  "an",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "with",
  "that",
  "this",
  "will",
  "have",
  "has",
  "from",
  "by",
  "as",
  "we",
  "our",
  "you",
  "your",
  "they",
  "their",
  "it",
  "its",
  "not",
  "but",
  "can",
  "all",
  "also",
  "more",
  "into",
  "than",
  "then",
  "when",
  "who",
  "which",
  "what",
  "how",
  "about",
  "up",
  "out",
  "if",
  "so",
  "do",
  "use",
  "using",
  "used",
  "work",
  "working",
  "ability",
  "experience",
  "strong",
  "good",
  "excellent",
  "must",
  "should",
  "would",
  "could",
  "may",
  "need",
]);

function fallbackExtract(text) {
  return [
    ...new Set(
      text
        .toLowerCase()
        .replace(/-/g, " ")
        .replace(/[^a-z0-9+#\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !STOP_WORDS.has(w) && !/^\d+$/.test(w)),
    ),
  ];
}

// Score helpers
function scoreColor(score) {
  if (score >= 70) return "text-emerald-500";
  if (score >= 40) return "text-amber-500";
  return "text-rose-500";
}
function scoreBg(score) {
  if (score >= 70) return "border-emerald-500";
  if (score >= 40) return "border-amber-500";
  return "border-rose-500";
}
function scoreLabel(score) {
  if (score >= 70) return "Strong Match ✅";
  if (score >= 40) return "Partial Match ⚠️";
  return "Weak Match ❌";
}

export default function ATSScorer({ resume }) {
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiUsed, setAiUsed] = useState(false); // track whether AI or fallback ran

  // Flatten all resume content into one searchable string
  function getResumeText() {
    return [
      resume.name,
      resume.title,
      resume.skills.join(" "),
      resume.jobs.flatMap((j) => [j.role, j.company, ...j.bullets]).join(" "),
      resume.edu.map((e) => [e.degree, e.school].join(" ")).join(" "),
      resume.projects
        .flatMap((p) => [p.name, p.description, ...p.tech, ...p.bullets])
        .join(" "),
    ]
      .join(" ")
      .toLowerCase();
  }

  async function handleAnalyse() {
    if (!jobDesc.trim()) return;
    setLoading(true);
    setResult(null);

    const resumeText = getResumeText();

    // Ask AI to extract clean keywords
    const aiResponse = await extractATSKeywords(jobDesc);

    let keywords;
    if (aiResponse) {
      // AI returned a comma-separated list — clean and split it
      keywords = aiResponse
        .split(",")
        .map((k) => k.trim().toLowerCase())
        .filter((k) => k.length > 1);
      setAiUsed(true);
    } else {
      // AI failed — use fallback regex extractor
      keywords = fallbackExtract(jobDesc);
      setAiUsed(false);
    }

    // Remove duplicates
    const uniqueKeywords = [...new Set(keywords)];

    const matched = uniqueKeywords.filter((kw) => resumeText.includes(kw));
    const missing = uniqueKeywords.filter((kw) => !resumeText.includes(kw));
    const score = Math.round((matched.length / uniqueKeywords.length) * 100);

    setResult({ score, matched, missing, total: uniqueKeywords.length });
    setLoading(false);
  }

  function handleReset() {
    setJobDesc("");
    setResult(null);
    setAiUsed(false);
  }

  return (
    <div className={card.section}>
      {/* Title */}
      <h2
        className="text-xl font-semibold text-text-primary dark:text-gray-100
                     border-l-4 border-primary pl-3 mb-4"
      >
        🎯 ATS Keyword Scorer
      </h2>

      <p className="text-sm text-text-secondary dark:text-gray-400 mb-4">
        Paste a job description — AI will extract the real keywords and score
        your resume against them.
      </p>

      {/* Textarea */}
      <textarea
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        placeholder="Paste the job description here..."
        rows={5}
        className={`${input.base} resize-none mb-3`}
      />

      {/* Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={handleAnalyse}
          disabled={loading || !jobDesc.trim()}
          className={btn.primary}
        >
          {loading ? "Analysing…" : "Analyse"}
        </button>
        {result && (
          <button onClick={handleReset} className={btn.secondary}>
            Reset
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div
          className="flex items-center gap-2 text-sm text-text-muted
                        dark:text-gray-400 animate-pulse"
        >
          <span>🤖 AI is extracting keywords…</span>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-5">
          {/* AI / fallback badge */}
          <div className="flex justify-center">
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium
              ${
                aiUsed
                  ? "bg-primary-light dark:bg-indigo-900 text-primary dark:text-indigo-300"
                  : "bg-secondary-light dark:bg-gray-700 text-text-muted dark:text-gray-400"
              }`}
            >
              {aiUsed
                ? "🤖 AI-powered analysis"
                : "⚙️ Basic analysis (AI unavailable)"}
            </span>
          </div>

          {/* Score circle */}
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-28 h-28 rounded-full border-8 ${scoreBg(result.score)}
                            flex flex-col items-center justify-center`}
            >
              <span
                className={`text-3xl font-bold ${scoreColor(result.score)}`}
              >
                {result.score}%
              </span>
            </div>
            <span
              className={`text-sm font-medium mt-1 ${scoreColor(result.score)}`}
            >
              {scoreLabel(result.score)}
            </span>
            <span className="text-xs text-text-muted dark:text-gray-500">
              {result.matched.length} of {result.total} keywords matched
            </span>
          </div>

          {/* Matched */}
          {result.matched.length > 0 && (
            <div>
              <h3
                className="text-sm font-semibold text-text-primary
                             dark:text-gray-200 mb-2"
              >
                ✅ Matched Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.matched.map((kw) => (
                  <span
                    key={kw}
                    className="bg-emerald-50 dark:bg-emerald-950 text-emerald-600
                               dark:text-emerald-400 px-3 py-1 rounded-full text-sm"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing */}
          {result.missing.length > 0 && (
            <div>
              <h3
                className="text-sm font-semibold text-text-primary
                             dark:text-gray-200 mb-2"
              >
                ❌ Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.missing.map((kw) => (
                  <span
                    key={kw}
                    className="bg-rose-50 dark:bg-rose-950 text-rose-500
                               dark:text-rose-400 px-3 py-1 rounded-full text-sm"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
