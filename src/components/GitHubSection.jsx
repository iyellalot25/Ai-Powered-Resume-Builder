// src/components/GitHubSection.jsx
import { useState } from "react";
import Section from "./Section";
import { btn, input } from "../styles/ui";

// Single repo card
function RepoCard({ repo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="block border border-border dark:border-gray-700 rounded-xl p-4
                 hover:border-primary hover:shadow-card-hover
                 transition-all duration-150 group"
    >
      {/* Repo name + star count */}
      <div className="flex justify-between items-start gap-2 mb-1">
        <h3 className="text-sm font-semibold text-primary group-hover:underline truncate">
          {repo.name}
        </h3>
        <span className="text-xs text-text-muted dark:text-gray-500 shrink-0 flex items-center gap-1">
          ⭐ {repo.stargazers_count}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-text-secondary dark:text-gray-400 mb-3 line-clamp-2">
        {repo.description || "No description provided."}
      </p>

      {/* Language + forks */}
      <div className="flex items-center gap-3">
        {repo.language && (
          <span
            className="bg-primary-light dark:bg-indigo-900 text-primary
                           dark:text-indigo-300 px-2 py-0.5 rounded-full text-xs"
          >
            {repo.language}
          </span>
        )}
        <span className="text-xs text-text-muted dark:text-gray-500">
          🍴 {repo.forks_count} forks
        </span>
      </div>
    </a>
  );
}

// ── GitHubSection ─────────────────────────────────────────
function GitHubSection() {
  const [username, setUsername] = useState("");
  const [draft, setDraft] = useState("");
  const [repos, setRepos] = useState([]);

  // "idle" | "loading" | "success" | "error"
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch repos from GitHub API
  async function fetchRepos() {
    const trimmed = draft.trim();
    if (!trimmed) return;

    setStatus("loading");
    setRepos([]);
    setErrorMsg("");

    try {
      const res = await fetch(
        // sort=stars => top repos first, per_page=6 => max 6 cards
        `https://api.github.com/users/${trimmed}/repos?sort=stars&per_page=6`,
      );

      // GitHub returns 404 if username doesn't exist
      if (res.status === 404) {
        throw new Error(`User "${trimmed}" not found on GitHub.`);
      }

      // GitHub rate limits unauthenticated requests to 60/hour
      if (res.status === 403) {
        throw new Error("GitHub rate limit reached. Try again in an hour.");
      }

      if (!res.ok) {
        throw new Error(`GitHub API error: ${res.status}`);
      }

      const data = await res.json();

      if (data.length === 0) {
        throw new Error("This user has no public repositories.");
      }

      setRepos(data);
      setUsername(trimmed); // save the confirmed username
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") fetchRepos();
  }

  // Allow user to search a different username
  function handleReset() {
    setStatus("idle");
    setRepos([]);
    setDraft("");
    setUsername("");
  }

  return (
    <Section title="GitHub">
      {/*Search bar hidden after successful fetch*/}
      {status !== "success" && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your GitHub username…"
            className={input.base}
          />
          <button
            onClick={fetchRepos}
            disabled={!draft.trim() || status === "loading"}
            className={`${btn.primary} shrink-0
                        disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center gap-2`}
          >
            {status === "loading" ? (
              <>
                {/* Spinner — same pattern as AI buttons */}
                <span
                  className="w-3 h-3 border-2 border-white
                                 border-t-transparent rounded-full animate-spin"
                />
                Loading…
              </>
            ) : (
              "Fetch Repos"
            )}
          </button>
        </div>
      )}

      {/* ── Error message ── */}
      {status === "error" && (
        <div
          className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-danger
                        rounded-xl text-sm text-danger flex justify-between items-center"
        >
          <span>⚠️ {errorMsg}</span>
          <button
            onClick={handleReset}
            className="text-xs underline ml-4 shrink-0"
          >
            Try again
          </button>
        </div>
      )}

      {/* ── Success header — shows username + change button ── */}
      {status === "success" && (
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-text-secondary dark:text-gray-400">
            Showing top repos for{" "}
            <span className="font-semibold text-primary">@{username}</span>
          </p>
          <button
            onClick={handleReset}
            className={`${btn.secondary} text-xs px-3 py-1`}
          >
            Change
          </button>
        </div>
      )}

      {/* Repo grid */}
      {repos.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}

      {/*Idle hint*/}
      {status === "idle" && (
        <p className="text-xs text-text-muted dark:text-gray-500">
          Enter your GitHub username to display your top public repositories.
        </p>
      )}
    </Section>
  );
}

export default GitHubSection;
