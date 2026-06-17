import { useState } from "react";
import { btn, input, card } from "../styles/ui";
import { generateCoverLetter } from "../services/aiService";

export default function CoverLetterGenerator({ resume }) {
  const [jobDesc, setJobDesc] = useState("");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!jobDesc.trim()) return;
    setLoading(true);
    setLetter("");
    setCopied(false);

    const result = await generateCoverLetter(resume, jobDesc);
    setLetter(result);
    setLoading(false);
  }

  function handleReset() {
    setJobDesc("");
    setLetter("");
    setCopied(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // reset after 2s
  }

  return (
    <div className={card.section}>
      {/* Title */}
      <h2
        className="text-xl font-semibold text-text-primary dark:text-gray-100
                     border-l-4 border-primary pl-3 mb-4"
      >
        ✉️ Cover Letter Generator
      </h2>

      <p className="text-sm text-text-secondary dark:text-gray-400 mb-4">
        Paste a job description and AI will write a tailored cover letter using
        your resume data.
      </p>

      {/* Job description input */}
      <textarea
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        placeholder="Paste the job description here…"
        rows={5}
        className={`${input.base} resize-none mb-3`}
      />

      {/* Action buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={handleGenerate}
          disabled={loading || !jobDesc.trim()}
          className={btn.primary}
        >
          {loading ? "Writing…" : "✨ Generate"}
        </button>
        {letter && (
          <button onClick={handleReset} className={btn.secondary}>
            Reset
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div
          className="flex items-center gap-2 text-sm text-text-muted
                        dark:text-gray-400 animate-pulse mb-4"
        >
          <span>🤖 AI is writing your cover letter…</span>
        </div>
      )}

      {/* Output */}
      {letter && (
        <div className="relative">
          {/* Copy button */}
          <button
            onClick={handleCopy}
            className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-lg
              font-medium transition-all duration-150
              ${
                copied
                  ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-400"
                  : "bg-secondary-light dark:bg-gray-700 text-text-secondary dark:text-gray-300 border border-border dark:border-gray-600 hover:border-primary hover:text-primary"
              }`}
          >
            {copied ? "✅ Copied!" : "📋 Copy"}
          </button>

          {/* Letter output */}
          <div
            className="bg-secondary-light dark:bg-gray-900 border border-border
                          dark:border-gray-700 rounded-xl p-5 pr-20
                          text-sm text-text-primary dark:text-gray-200
                          leading-relaxed whitespace-pre-wrap"
          >
            {letter}
          </div>
        </div>
      )}
    </div>
  );
}
