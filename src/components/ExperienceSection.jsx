import { useState } from "react";
import Section from "./Section";
import { input } from "../styles/ui";

//  Reusable inline-editable text field ─
// Same click-to-edit pattern from Header, extracted here for use in this file
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
    else setDraft(value); // revert if empty
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
      {value || <span className="text-text-muted">{placeholder}</span>}
    </span>
  );
}

//  Single job card ─
// Updated JobCard signature
function JobCard({
  job,
  jobIndex,
  onUpdateJob,
  onUpdateBullet,
  onAddBullet,
  onRemoveBullet,
  onRemoveJob,
}) {
  return (
    <div
      className="border border-border rounded-xl p-4 mb-5 last:mb-0
                    hover:border-primary hover:shadow-card-hover transition-all duration-150"
    >
      {/* Job header row */}
      <div className="flex justify-between items-start gap-4 mb-1">
        <h3 className="text-base font-semibold text-text-primary flex-1">
          <InlineEdit
            value={job.role}
            onSave={(val) => onUpdateJob(jobIndex, "role", val)}
            placeholder="Job Title"
          />
        </h3>

        {/* Right side: duration badge + delete button */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-secondary-light text-text-muted px-2 py-1 rounded-full text-xs">
            <InlineEdit
              value={job.duration}
              onSave={(val) => onUpdateJob(jobIndex, "duration", val)}
              placeholder="2024 – Present"
              className="text-xs"
            />
          </span>

          {/* Delete entire job — danger style, always visible */}
          <button
            onClick={() => onRemoveJob(jobIndex)}
            className="text-text-muted hover:text-danger transition-colors duration-150
                       text-xs px-2 py-1 rounded-lg hover:bg-red-50 border border-transparent
                       hover:border-danger"
            title="Remove this experience"
          >
            🗑
          </button>
        </div>
      </div>

      {/* Company */}
      <p className="text-sm font-medium text-primary mb-3">
        <InlineEdit
          value={job.company}
          onSave={(val) => onUpdateJob(jobIndex, "company", val)}
          placeholder="Company Name"
        />
      </p>

      {/* Bullets */}
      <ul className="space-y-2 mb-3">
        {job.bullets.map((bullet, bulletIndex) => (
          <li key={bulletIndex} className="flex items-start gap-2 group">
            <span className="text-primary mt-2 text-xs shrink-0">▸</span>
            <BulletEdit
              value={bullet}
              onSave={(val) => onUpdateBullet(jobIndex, bulletIndex, val)}
            />
            <button
              onClick={() => onRemoveBullet(jobIndex, bulletIndex)}
              className="opacity-0 group-hover:opacity-100 text-text-muted
                         hover:text-danger transition-all duration-150 mt-1.5
                         text-xs shrink-0"
              title="Remove bullet"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onAddBullet(jobIndex)}
        className="bg-secondary-light hover:bg-border text-text-secondary
                   px-3 py-1 rounded-lg text-xs font-medium border border-border
                   transition-colors duration-150"
      >
        + Add bullet
      </button>
    </div>
  );
}

//  Bullet edit: textarea that auto-saves
// Uses textarea (not input) because bullets can be long
function BulletEdit({ value, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function handleSave() {
    const trimmed = draft.trim();
    if (trimmed) onSave(trimmed);
    else setDraft(value);
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    // Shift+Enter = newline inside textarea; plain Enter = save
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setDraft(value);
      setIsEditing(false);
    }
  }

  if (isEditing) {
    return (
      <textarea
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        rows={2}
        className={`${input.base} flex-1 resize-none`}
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
      className="flex-1 text-sm text-text-secondary cursor-pointer
                 hover:text-primary transition-colors duration-150"
    >
      {value || (
        <span className="text-text-muted italic">
          Click to add bullet text…
        </span>
      )}
    </span>
  );
}

//  ExperienceSection
function ExperienceSection({
  jobs,
  onUpdateJob,
  onUpdateBullet,
  onAddBullet,
  onRemoveBullet,
  onAddJob,
  onRemoveJob,
}) {
  return (
    <Section title="Experience">
      {jobs.map((job, jobIndex) => (
        <JobCard
          key={job.id}
          job={job}
          jobIndex={jobIndex}
          onUpdateJob={onUpdateJob}
          onUpdateBullet={onUpdateBullet}
          onAddBullet={onAddBullet}
          onRemoveBullet={onRemoveBullet}
          onRemoveJob={onRemoveJob}
        />
      ))}

      {/* Add new experience button  */}
      <button
        onClick={onAddJob}
        className="w-full mt-2 py-2 rounded-xl border-2 border-dashed border-border
                   text-text-muted hover:border-primary hover:text-primary
                   text-sm font-medium transition-colors duration-150"
      >
        + Add Experience
      </button>
    </Section>
  );
}

export default ExperienceSection;
