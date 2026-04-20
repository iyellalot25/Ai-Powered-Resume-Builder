import { useState } from "react";
import Section from "./Section";
import { btn, input, tag } from "../styles/ui";

function SkillsSection({ skills, onAdd, onRemove }) {
  // Local state: what the user is currently typing in the "add skill" input
  const [draft, setDraft] = useState("");

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
      </div>

      {/* Hint */}
      <p className="text-xs text-text-muted mt-2">
        Press Enter or click Add — click × to remove a skill
      </p>
    </Section>
  );
}

export default SkillsSection;
