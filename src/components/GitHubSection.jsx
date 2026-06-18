// src/components/GitHubSection.jsx
import { useState } from "react";
import Section from "./Section";
import { btn, input } from "../styles/ui";

// Language colors maps common languages to a color
// GitHub's official language colors
const LANG_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Rust: "#dea584",
  Go: "#00ADD8",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
  Vue: "#41b883",
  Jupyter: "#DA5B0B",
};

function getLangColor(lang) {
  return LANG_COLORS[lang] || "#6366F1"; // fallback to primary
}

//Profile Stats Bar
function ProfileStats({ profile, totalStars }) {
  // Calculate how long ago the account was created
  const joinYear = new Date(profile.created_at).getFullYear();

  return (
    <div
      className="flex items-center gap-4 mb-6 p-4
                    bg-secondary-light dark:bg-gray-700/50
                    rounded-xl border border-border dark:border-gray-700"
    >
      {/* Avatar */}
      <img
        src={profile.avatar_url}
        alt={profile.login}
        className="w-14 h-14 rounded-full border-2 border-primary shrink-0"
      />

      {/* Bio + username */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-text-primary dark:text-gray-100">
            {profile.name || profile.login}
          </span>
          <span className="text-xs text-text-muted dark:text-gray-500">
            @{profile.login}
          </span>
        </div>
        {profile.bio && (
          <p className="text-xs text-text-secondary dark:text-gray-400 truncate">
            {profile.bio}
          </p>
        )}
        {/* Stats row */}
        <div className="flex flex-wrap gap-3 mt-2">
          <Stat icon="👥" value={profile.followers} label="followers" />
          <Stat icon="📦" value={profile.public_repos} label="repos" />
          <Stat icon="⭐" value={totalStars} label="stars" />
          <Stat icon="📅" value={`Since ${joinYear}`} label="" />
        </div>
      </div>
    </div>
  );
}

// Tiny stat pill used inside ProfileStats
function Stat({ icon, value, label }) {
  return (
    <span className="flex items-center gap-1 text-xs text-text-secondary dark:text-gray-400">
      {icon}
      <span className="font-semibold text-text-primary dark:text-gray-200">
        {value}
      </span>
      {label && <span>{label}</span>}
    </span>
  );
}

//Language Breakdown Bar
function LanguageBar({ repos }) {
  // Count how many repos use each language
  const counts = {};
  repos.forEach((repo) => {
    if (!repo.language) return;
    counts[repo.language] = (counts[repo.language] || 0) + 1;
  });

  // Sort by count descending, take top 6
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const total = sorted.reduce((sum, [, count]) => sum + count, 0);

  if (sorted.length === 0) return null;

  return (
    <div className="mb-5">
      <p
        className="text-xs font-semibold text-text-secondary dark:text-gray-400
                    uppercase tracking-wide mb-2"
      >
        Most Used Languages
      </p>

      {/* Segmented bar */}
      <div className="flex rounded-full overflow-hidden h-2.5 mb-3 gap-0.5">
        {sorted.map(([lang, count]) => (
          <div
            key={lang}
            title={`${lang}: ${Math.round((count / total) * 100)}%`}
            style={{
              width: `${(count / total) * 100}%`,
              backgroundColor: getLangColor(lang),
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {sorted.map(([lang, count]) => (
          <span
            key={lang}
            className="flex items-center gap-1.5 text-xs
                                      text-text-secondary dark:text-gray-400"
          >
            {/* Color dot */}
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: getLangColor(lang) }}
            />
            {lang}
            <span className="text-text-muted dark:text-gray-500">
              {Math.round((count / total) * 100)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

// Single repo card
function RepoCard({ repo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="block border border-border dark:border-gray-700 rounded-xl p-4
                 hover:border-primary hover:shadow-card-hover dark:hover:border-indigo-500
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
            className="flex items-center gap-1.5 text-xs
                           text-text-secondary dark:text-gray-400"
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: getLangColor(repo.language) }}
            />
            {repo.language}
          </span>
        )}
        <span className="text-xs text-text-muted dark:text-gray-500">
          🍴 {repo.forks_count} forks
        </span>
        {repo.topics?.length > 0 && (
          <span className="text-xs text-text-muted dark:text-gray-500 truncate">
            🏷️ {repo.topics.slice(0, 2).join(", ")}
          </span>
        )}
      </div>
    </a>
  );
}

//GitHubSection
function GitHubSection({ isPreview, template }) {
  const [username, setUsername] = useState("");
  const [draft, setDraft] = useState("");
  const [repos, setRepos] = useState([]);
  const [profile, setProfile] = useState(null);
  const [totalStars, setTotalStars] = useState(0);

  // "idle" | "loading" | "success" | "error"
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch repos from GitHub API
  async function fetchData() {
    const trimmed = draft.trim();
    if (!trimmed) return;

    setStatus("loading");
    setRepos([]);
    setProfile(null);
    setErrorMsg("");

    try {
      // Fire both requests at the same time using Promise.all
      // Instead of waiting for one then the other, both run in parallel
      // This is faster — total wait = slowest request, not sum of both
      const [profileRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${trimmed}`),
        // sort=stars => top repos first, per_page=6 => max 6 cards
        fetch(
          `https://api.github.com/search/repositories?q=user:${trimmed}&sort=stars&per_page=6`,
        ),
      ]);

      // GitHub returns 404 if username doesn't exist
      if (profileRes.status === 404) {
        throw new Error(`User "${trimmed}" not found on GitHub.`);
      }

      // GitHub rate limits unauthenticated requests to 60/hour
      if (profileRes.status === 403 || reposRes.status === 403) {
        throw new Error("GitHub rate limit reached. Try again in an hour.");
      }

      if (!profileRes.ok) {
        throw new Error(`GitHub API error: ${profileRes.status}`);
      }
      if (!reposRes.ok) {
        throw new Error(`GitHub Search API error: ${reposRes.status}`);
      }

      const [profileData, searchResultData] = await Promise.all([
        profileRes.json(),
        reposRes.json(),
      ]);

      const reposData = searchResultData.items || [];

      if (reposData.length === 0) {
        throw new Error("This user has no public repositories.");
      }

      // Calculate total stars across all fetched repos
      const stars = reposData.reduce(
        (sum, repo) => sum + repo.stargazers_count,
        0,
      );

      setProfile(profileData);
      setRepos(reposData);
      setTotalStars(stars);
      setUsername(trimmed); // save the confirmed username
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") fetchData();
  }

  // Allow user to search a different username
  function handleReset() {
    setStatus("idle");
    setRepos([]);
    setProfile(null);
    setDraft("");
    setUsername("");
    setTotalStars(0);
  }

  return (
    <Section title="GitHub" template={template}>
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
            onClick={fetchData}
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
              "Fetch Profile"
            )}
          </button>
        </div>
      )}

      {/*Error message*/}
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

      {/* Success state profile + languages + repos */}
      {status === "success" && profile && (
        <>
          {/* Hide change button in preview */}
          {/*Success header shows username + change button*/}
          {!isPreview && (
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

          {/* Profile stats bar */}
          <ProfileStats profile={profile} totalStars={totalStars} />

          {/* Language breakdown */}
          <LanguageBar repos={repos} />

          {/* Repo grid */}
          {repos.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {repos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          )}
        </>
      )}

      {/*Idle hint*/}
      {status === "idle" && (
        <p className="text-xs text-text-muted dark:text-gray-500">
          Enter your GitHub username to display your profile, language stats,
          and top repositories.
        </p>
      )}
    </Section>
  );
}

export default GitHubSection;
