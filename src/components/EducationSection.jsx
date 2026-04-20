// src/components/EducationSection.jsx
import { useState } from "react";
import Section from "./Section";
import { input } from "../styles/ui";

// Reusable inline edit (same pattern as ExperienceSection)
function InlineEdit({
  value,
  onSave,
  className = "",
  placeholder = "Click to edit",
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function handleSave() {
    const trimmed = draft.trim();
    if (trimmed) onSave(trimmed);
    else setDraft(value);
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setDraft(value);
      setIsEditing(false);
    }
  }

  if (isEditing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`${input.base} ${className}`}
      />
    );
  }

  return (
    <span
      onClick={() => {
        setDraft(value);
        setIsEditing(true);
      }}
      title="Click to edit"
      className={`cursor-pointer hover:text-primary transition-colors duration-150 ${className}`}
    >
      {value || <span className="text-text-muted italic">{placeholder}</span>}
    </span>
  );
}

// Single education card
function EduCard({ item, eduIndex, onUpdateEdu, onRemoveEdu }) {
  return (
    <div
      className="border border-border rounded-xl p-4 mb-5 last:mb-0
                    hover:border-primary hover:shadow-card-hover transition-all duration-150"
    >
      {/* Header row: school name + year badge + delete */}
      <div className="flex justify-between items-start gap-4 mb-1">
        <h3 className="text-base font-semibold text-text-primary flex-1">
          <InlineEdit
            value={item.school}
            onSave={(val) => onUpdateEdu(eduIndex, "school", val)}
            placeholder="University Name"
          />
        </h3>

        <div className="flex items-center gap-2 shrink-0">
          {/* Year badge */}
          <span className="bg-secondary-light text-text-muted px-2 py-1 rounded-full text-xs">
            <InlineEdit
              value={item.year}
              onSave={(val) => onUpdateEdu(eduIndex, "year", val)}
              placeholder="2022 – 2026"
              className="text-xs"
            />
          </span>

          {/* Delete button */}
          <button
            onClick={() => onRemoveEdu(eduIndex)}
            className="text-text-muted hover:text-danger transition-colors duration-150
                       text-xs px-2 py-1 rounded-lg hover:bg-red-50 border border-transparent
                       hover:border-danger"
            title="Remove this entry"
          >
            🗑
          </button>
        </div>
      </div>

      {/* Degree — primary subtitle */}
      <p className="text-sm font-medium text-primary mb-2">
        <InlineEdit
          value={item.degree}
          onSave={(val) => onUpdateEdu(eduIndex, "degree", val)}
          placeholder="Degree / Program"
        />
      </p>

      {/* CGPA — caption style */}
      <p className="text-xs text-text-muted">
        CGPA:{" "}
        <InlineEdit
          value={item.cgpa}
          onSave={(val) => onUpdateEdu(eduIndex, "cgpa", val)}
          placeholder="e.g. 8.5"
          className="text-xs"
        />
      </p>
    </div>
  );
}

// EducationSection
function EducationSection({ edu, onUpdateEdu, onAddEdu, onRemoveEdu }) {
  return (
    <Section title="Education">
      {edu.map((item, eduIndex) => (
        <EduCard
          key={item.id}
          item={item}
          eduIndex={eduIndex}
          onUpdateEdu={onUpdateEdu}
          onRemoveEdu={onRemoveEdu}
        />
      ))}

      {/* Add new education */}
      <button
        onClick={onAddEdu}
        className="w-full mt-2 py-2 rounded-xl border-2 border-dashed border-border
                   text-text-muted hover:border-primary hover:text-primary
                   text-sm font-medium transition-colors duration-150"
      >
        + Add Education
      </button>
    </Section>
  );
}

export default EducationSection;
