import { useState } from "react";
import Section from "./Section";
import { btn, input, tag } from "../styles/ui";
import { suggestSkills } from "../services/aiService";

function SkillsSection({ skills, onAdd, onRemove }) {
  // Local state: what the user is currently typing in the "add skill" input
  const [draft, setDraft] = useState("");

  // AI state
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]); // array of skill strings

  // AI: fetch skill suggestions
  async function handleSuggestSkills() {
    const targetRole = skills.some((s) =>
      ["TensorFlow", "PyTorch", "Machine Learning", "BERT"].includes(s),
    )
      ? "AI/ML Developer"
      : "Software Developer";

    setIsLoading(true);
    setSuggestions([]);

    try {
      const raw = await suggestSkills(skills, targetRole);

      const parsed = raw
        .split(",")
        .map((s) => s.trim().replace(/^[-•*]\s*/, ""))
        .filter((s) => s.length > 0 && !skills.includes(s))
        .slice(0, 5);

      setSuggestions(parsed);
    } catch (err) {
      console.error("AI error:", err);
      setSuggestions(["⚠️ AI unavailable. Try again."]);
    } finally {
      setIsLoading(false);
    }
  }

  // ── Add one suggested skill (called on chip click)
  function handleAddSuggestion(skill) {
    onAdd(skill);
    setSuggestions((prev) => prev.filter((s) => s !== skill));
  }

  // ── Add ALL remaining suggestions at once
  function handleAddAll() {
    suggestions.forEach((skill) => onAdd(skill));
    setSuggestions([]);
  }

  // Called when user submits a new skill (Enter key or Add button)
  function handleAdd() {
    onAdd(draft); // App.jsx handles validation + state update
    setDraft(""); // clear the input after adding
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleAdd();
  }

  return (
    <Section title="Skills">
      {/* ── Skill tag list */}
      <div className="flex flex-wrap gap-2 mb-4">
        {skills.map((skill) => (
          <span key={skill} className={tag.skill}>
            {skill}
            {/* × remove button — sits inside the tag */}
            <button
              onClick={() => onRemove(skill)}
              className={btn.pill}
              title={`Remove ${skill}`}
              aria-label={`Remove ${skill}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Add new skill row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a skill… (e.g. PyTorch)"
          className={input.base}
        />
        <button
          onClick={handleAdd}
          disabled={!draft.trim()} // disable if input is empty
          className={btn.primary}
        >
          Add
        </button>

        {/* ✨ AI Suggest Button — sits next to Add */}
        <button
          onClick={handleSuggestSkills}
          disabled={isLoading}
          className={`${btn.secondary} flex items-center gap-1.5 shrink-0
                      disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <>
              <span
                className="w-3 h-3 border-2 border-secondary border-t-transparent
                               rounded-full animate-spin"
              />
              Thinking…
            </>
          ) : (
            "✨ Suggest"
          )}
        </button>
      </div>

      {/* Hint */}
      <p className="text-xs text-text-muted mt-2">
        Press Enter or click Add — click × to remove a skill
      </p>

      {/*AI Suggestion Preview*/}
      {suggestions.length > 0 && (
        <div className="mt-4 p-4 bg-primary-light border border-primary rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide">
              ✨ Suggested Skills — click to add
            </p>
            <div className="flex gap-2">
              {!suggestions[0].startsWith("⚠️") && (
                <button
                  onClick={handleAddAll}
                  className={`${btn.primary} text-xs px-2 py-1`}
                >
                  + Add All
                </button>
              )}
              <button
                onClick={() => setSuggestions([])}
                className={`${btn.secondary} text-xs px-2 py-1`}
              >
                Dismiss
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {suggestions.map((skill) => (
              <button
                key={skill}
                onClick={() => handleAddSuggestion(skill)}
                disabled={skill.startsWith("⚠️")}
                className={
                  skill.startsWith("⚠️")
                    ? "text-xs text-danger"
                    : `${tag.skill} cursor-pointer hover:bg-primary
                       hover:text-white transition-colors duration-150`
                }
              >
                {skill.startsWith("⚠️") ? skill : `+ ${skill}`}
              </button>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

export default SkillsSection;
