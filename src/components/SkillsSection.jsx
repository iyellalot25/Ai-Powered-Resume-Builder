import { useState } from "react";
import Section from "./Section";
import { btn, input, tag } from "../styles/ui";
import { suggestSkills } from "../services/aiService";
import { motion, AnimatePresence } from "framer-motion";

function SkillsSection({ skills, onAdd, onRemove, isPreview, template }) {
  // Local state: what the user is currently typing in the "add skill" input
  const [draft, setDraft] = useState("");

  // AI state
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]); // array of skill strings

  // Role prompt state — shown inline when user clicks ✨ Suggest
  const [showRolePrompt, setShowRolePrompt] = useState(false);
  const [roleDraft, setRoleDraft] = useState("");

  // AI: fetch skill suggestions
  //user clicks ✨ Suggest => show role input
  function handleSuggestClick() {
    setSuggestions([]); // clear old suggestions
    setShowRolePrompt(true); // show the role prompt box
    setRoleDraft(""); // clear previous role input
  }

  // user submits role => call AI
  async function handleRoleSubmit() {
    const role = roleDraft.trim();
    if (!role) return;

    setShowRolePrompt(false); // hide the prompt
    setIsLoading(true);

    try {
      const raw = await suggestSkills(skills, role);

      // Parse comma-separated list — DON'T filter duplicates here
      // We'll show them as disabled chips instead so user sees a result
      const parsed = raw
        .split(",")
        .map((s) => s.trim().replace(/^[-•*\d+.]\s*/, ""))
        .filter((s) => s.length > 1) // only remove blanks/stray chars
        .slice(0, 5);

      setSuggestions(parsed);
    } catch (err) {
      console.error("AI error:", err);
      setSuggestions(["⚠️ AI unavailable. Try again."]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleRoleKeyDown(e) {
    if (e.key === "Enter") handleRoleSubmit();
    if (e.key === "Escape") setShowRolePrompt(false);
  }

  //  Add one suggested skill
  function handleAddSuggestion(skill) {
    onAdd(skill);
    setSuggestions((prev) => prev.filter((s) => s !== skill));
  }

  //  Add ALL non-duplicate suggestions at once
  function handleAddAll() {
    suggestions
      .filter((s) => !skills.includes(s) && !s.startsWith("⚠️"))
      .forEach((skill) => onAdd(skill));
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
    <Section title="Skills" template={template}>
      {/*Skill tag list */}

      <div className="flex flex-wrap gap-2 mb-4">
        <AnimatePresence>
          {skills.map((skill) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.7 }} // start: invisible + small
              animate={{ opacity: 1, scale: 1 }} // end: normal
              exit={{ opacity: 0, scale: 0.7 }} // leaving: shrink + fade
              transition={{ duration: 0.15 }}
              className={template.skillTag}
            >
              {skill}
              {/* Hide × button in preview mode */}
              {!isPreview && (
                /* × remove button sits inside the tag */
                <button
                  onClick={() => onRemove(skill)}
                  className={btn.pill}
                  title={`Remove ${skill}`}
                  aria-label={`Remove ${skill}`}
                >
                  ×
                </button>
              )}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* Hide everything below in preview mode */}
      {!isPreview && (
        <>
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

            {/* ✨ Suggestopens role prompt instead of calling AI directly */}
            <button
              onClick={handleSuggestClick}
              disabled={isLoading || showRolePrompt}
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

          {/* Role Prompt Box  */}
          {showRolePrompt && (
            <div className="mt-3 p-4 bg-secondary-light border border-border rounded-xl">
              <p className="text-xs font-semibold text-text-secondary mb-2">
                What role are you targeting? (e.g. AI/ML Engineer, Frontend
                Developer)
              </p>
              <div className="flex gap-2">
                <input
                  autoFocus
                  type="text"
                  value={roleDraft}
                  onChange={(e) => setRoleDraft(e.target.value)}
                  onKeyDown={handleRoleKeyDown}
                  placeholder="e.g. Full Stack Developer"
                  className={input.base}
                />
                <button
                  onClick={handleRoleSubmit}
                  disabled={!roleDraft.trim()}
                  className={`${btn.primary} shrink-0 disabled:opacity-50
                              disabled:cursor-not-allowed`}
                >
                  Go
                </button>
                <button
                  onClick={() => setShowRolePrompt(false)}
                  className={`${btn.secondary} shrink-0`}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/*AI Suggestion Preview*/}
          {suggestions.length > 0 && (
            <div className="mt-4 p-4 bg-primary-light border border-primary rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                  ✨ Suggested Skills — click to add
                </p>
                <div className="flex gap-2">
                  {/* Add All only if at least one non-duplicate, non-error chip exists */}
                  {suggestions.some(
                    (s) => !skills.includes(s) && !s.startsWith("⚠️"),
                  ) && (
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
                {suggestions.map((skill) => {
                  const isError = skill.startsWith("⚠️");
                  const isAlreadyAdded = skills.includes(skill);

                  // ── Error chip
                  if (isError) {
                    return (
                      <span key={skill} className="text-xs text-danger">
                        {skill}
                      </span>
                    );
                  }

                  // Already added chip greyed out, not clickable
                  if (isAlreadyAdded) {
                    return (
                      <span
                        key={skill}
                        className="bg-secondary-light text-text-muted
                                   px-3 py-1 rounded-full text-sm
                                   flex items-center gap-1 cursor-default"
                        title="Already in your skills"
                      >
                        ✓ {skill}
                      </span>
                    );
                  }

                  //  Normal chip; clickable
                  return (
                    <button
                      key={skill}
                      onClick={() => handleAddSuggestion(skill)}
                      className={`${tag.skill} cursor-pointer hover:bg-primary
                                  hover:text-white transition-colors duration-150`}
                    >
                      + {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </Section>
  );
}

export default SkillsSection;
