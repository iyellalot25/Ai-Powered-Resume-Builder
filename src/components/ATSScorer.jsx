import { useState } from "react";
import { btn, input, card } from "../styles/ui";

// Stop words we ignore when extracting keywords
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

//Keyword extractor
// Takes a string => returns array of unique meaningful words
function extractKeywords(text) {
  return [
    ...new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s+#]/g, " ") // keep letters, numbers, + and #
        .split(/\s+/) // split on whitespace
        .filter((w) => w.length > 2 && !STOP_WORDS.has(w)), // remove stop words
    ),
  ];
}

// core color helper
// Returns a Tailwind color class based on score
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

// Main Component
export default function ATSScorer({ resume }) {
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null); // null cuz not scored yet

  // Flatten all resume text into one big lowercase string
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

  function handleAnalyse() {
    if (!jobDesc.trim()) return;

    const resumeText = getResumeText();
    const jdKeywords = extractKeywords(jobDesc);

    const matched = jdKeywords.filter((kw) => resumeText.includes(kw));
    const missing = jdKeywords.filter((kw) => !resumeText.includes(kw));
    const score = Math.round((matched.length / jdKeywords.length) * 100);

    setResult({ score, matched, missing, total: jdKeywords.length });
  }

  function handleReset() {
    setJobDesc("");
    setResult(null);
  }

  return (
    <div className={card.section}>
      {/* Section Title*/}
      <h2
        className="text-xl font-semibold text-text-primary dark:text-gray-100
                     border-l-4 border-primary pl-3 mb-4"
      >
        🎯 ATS Keyword Scorer
      </h2>

      {/*Explanation */}
      <p className="text-sm text-text-secondary dark:text-gray-400 mb-4">
        Paste a job description below. We'll compare it against your resume and
        show how well you match.
      </p>

      {/*Textarea*/}
      <textarea
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        placeholder="Paste the job description here..."
        rows={5}
        className={`${input.base} resize-none mb-3`}
      />

      {/*Buttons */}
      <div className="flex gap-2 mb-6">
        <button onClick={handleAnalyse} className={btn.primary}>
          Analyse
        </button>
        {result && (
          <button onClick={handleReset} className={btn.secondary}>
            Reset
          </button>
        )}
      </div>

      {/*Results*/}
      {result && (
        <div className="space-y-5">
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

          {/* Matched keywords */}
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

          {/* Missing keywords */}
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
