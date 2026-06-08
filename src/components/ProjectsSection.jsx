import { useState } from "react";
import Section from "./Section";
import { btn, input, tag } from "../styles/ui";
import { suggestProjectBullets } from "../services/aiService";
import useSpeechInput from "../hooks/useSpeechInput";
import MicButton from "./MicButton";

//  Inline edit
function InlineEdit({
  value,
  onSave,
  className = "",
  placeholder = "Click to edit",
  multiline = false,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const { isListening, startListening } = useSpeechInput((transcript) => {
    const updated = draft ? `${draft} ${transcript}` : transcript;
    setDraft(updated);
    onSave(updated.trim());
    setIsEditing(false);
  });

  function handleSave() {
    const trimmed = draft.trim();
    if (trimmed) onSave(trimmed);
    else setDraft(value);
    setIsEditing(false);
  }

  function handleBlur(e) {
    if (e.relatedTarget && e.relatedTarget.closest(".mic-btn-container")) {
      return;
    }
    handleSave();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !multiline) handleSave();
    if (e.key === "Enter" && multiline && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setDraft(value);
      setIsEditing(false);
    }
  }

  if (isEditing) {
    const sharedProps = {
      autoFocus: true,
      value: draft,
      onChange: (e) => setDraft(e.target.value),
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      placeholder,
    };
    return multiline ? (
      <div className="flex items-start gap-1 w-full">
        <textarea
          {...sharedProps}
          rows={2}
          className={`${input.base} resize-none flex-1 ${className}`}
        />
        <div className="mic-btn-container" tabIndex={0}>
          <MicButton isListening={isListening} onClick={startListening} />
        </div>
      </div>
    ) : (
      <input {...sharedProps} className={`${input.base} ${className}`} />
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

// BulletEdit (Updated to support className configuration)
function BulletEdit({ value, onSave, className = "" }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const { isListening, startListening } = useSpeechInput((transcript) => {
    const updated = draft ? `${draft} ${transcript}` : transcript;
    setDraft(updated);
    onSave(updated.trim());
    setIsEditing(false);
  });

  function handleSave() {
    const trimmed = draft.trim();
    if (trimmed) onSave(trimmed);
    else setDraft(value);
    setIsEditing(false);
  }

  function handleBlur(e) {
    if (e.relatedTarget && e.relatedTarget.closest(".mic-btn-container")) {
      return;
    }
    handleSave();
  }

  function handleKeyDown(e) {
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
      <div className="flex-1 flex items-start gap-1">
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          rows={2}
          className={`${input.base} flex-1 resize-none`} // <-- Removed custom className here so it won't glow blue
        />
        <div className="mic-btn-container" tabIndex={0}>
          <MicButton isListening={isListening} onClick={startListening} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-start gap-1">
      <span
        onClick={() => {
          setDraft(value);
          setIsEditing(true);
        }}
        title="Click to edit"
        className={`flex-1 text-sm cursor-pointer hover:text-primary transition-colors duration-150 ${className || "text-text-secondary dark:text-gray-400"}`}
      >
        {value || (
          <span className="text-text-muted italic">
            Click to add bullet text…
          </span>
        )}
      </span>
      <div className="mic-btn-container" tabIndex={0}>
        <MicButton
          isListening={isListening}
          onClick={() => {
            setDraft(value);
            setIsEditing(true);
            setTimeout(startListening, 100);
          }}
        />
      </div>
    </div>
  );
}

//  Single project card
function ProjectCard({
  project,
  projIndex,
  onUpdateProject,
  onAddTech,
  onRemoveTech,
  onRemoveProject,
  onUpdateProjectBullet,
  onAddProjectBullet,
  onRemoveProjectBullet,
}) {
  const [techDraft, setTechDraft] = useState("");

  // AI state — local to each card
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);

  //AI: fetch project bullet suggestion
  async function handleSuggestBullets() {
    if (!project.name) {
      alert("Please fill in the Project Name first.");
      return;
    }

    setIsLoading(true);
    setSuggestions(null);

    try {
      const raw = await suggestProjectBullets(
        project.name,
        project.description || "a software project",
      );

      const parsed = raw
        .split("\n")
        .map((line) => line.replace(/^[-•*\d+.]\s*/, "").trim())
        .filter((line) => line.length > 10)
        .slice(0, 3);

      setSuggestions(parsed.length > 0 ? parsed : null);
      if (parsed.length === 0)
        alert("AI returned an unexpected format. Try again.");
    } catch (err) {
      console.error("AI error:", err);
      setSuggestions(["⚠️ Could not reach AI. Check your token or try again."]);
    } finally {
      setIsLoading(false);
    }
  }

  // ── AI: apply suggestions
  function handleApplyBullets() {
    onUpdateProject(projIndex, "bullets", suggestions);
    setSuggestions(null);
  }

  function handleAddTech() {
    onAddTech(projIndex, techDraft);
    setTechDraft("");
  }

  return (
    <div
      className="border border-border rounded-xl p-4
                      hover:border-primary hover:shadow-card-hover transition-all duration-150"
    >
      {/* Header: project name + link + delete */}
      <div className="flex justify-between items-start gap-2 mb-1">
        <h3 className="text-base font-semibold text-text-primary dark:text-white flex-1">
          <InlineEdit
            value={project.name}
            onSave={(val) => onUpdateProject(projIndex, "name", val)}
            placeholder="Project Name"
          />
        </h3>

        <div className="flex items-center gap-2 shrink-0">
          {/* Link — editable */}
          <InlineEdit
            value={project.link}
            onSave={(val) => onUpdateProject(projIndex, "link", val)}
            placeholder="URL"
            className="text-xs text-primary hover:underline"
          />

          {/* Delete project */}
          <button
            onClick={() => onRemoveProject(projIndex)}
            className="text-text-muted hover:text-danger transition-colors duration-150
                        text-xs px-2 py-1 rounded-lg hover:bg-red-50 border border-transparent
                        hover:border-danger"
            title="Remove project"
          >
            🗑
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary dark:text-gray-400 mt-1 mb-3">
        <InlineEdit
          value={project.description}
          onSave={(val) => onUpdateProject(projIndex, "description", val)}
          placeholder="Short project description…"
          multiline
          className="text-sm"
        />
      </p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {project.tech.map((t) => (
          <span key={t} className={tag.tech + " flex items-center gap-1"}>
            {t}
            <button
              onClick={() => onRemoveTech(projIndex, t)}
              className={btn.pill}
              title={`Remove ${t}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/*Bullets */}
      {project.bullets.length > 0 && (
        <ul className="space-y-2 mb-3">
          {project.bullets.map((bullet, bulletIndex) => (
            <li key={bulletIndex} className="flex items-start gap-2 group">
              <span className="text-primary mt-2 text-xs shrink-0">▸</span>
              <BulletEdit
                value={bullet}
                onSave={(val) =>
                  onUpdateProjectBullet(projIndex, bulletIndex, val)
                }
              />
              <button
                onClick={() => onRemoveProjectBullet(projIndex, bulletIndex)}
                className="opacity-0 group-hover:opacity-100 text-text-muted
                            hover:text-danger transition-all duration-150
                            mt-1.5 text-xs shrink-0"
                title="Remove bullet"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add tech tag row + bullet + AI buttons */}
      <div className="flex gap-2 flex-wrap mb-3">
        <input
          type="text"
          value={techDraft}
          onChange={(e) => setTechDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTech()}
          placeholder="Add tech tag…"
          className={input.base}
        />
        <button
          onClick={handleAddTech}
          disabled={!techDraft.trim()}
          className={btn.secondary + " text-xs px-3 py-1 shrink-0"}
        >
          Add
        </button>
      </div>
      {/* Bullet controls row */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onAddProjectBullet(projIndex)}
          className="bg-secondary-light hover:bg-border text-text-secondary
                      px-3 py-1 rounded-lg text-xs font-medium border border-border
                      transition-colors duration-150"
        >
          + Add Bullet
        </button>

        {/* ✨ AI Suggest Bullets */}
        <button
          onClick={handleSuggestBullets}
          disabled={isLoading}
          className={`${btn.primary} text-xs px-3 py-1 flex items-center gap-1.5
                        disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <>
              <span
                className="w-3 h-3 border-2 border-white border-t-transparent
                                rounded-full animate-spin"
              />
              Generating…
            </>
          ) : (
            "✨ Suggest Bullets"
          )}
        </button>
      </div>

      {/* AI Suggestion Preview Box */}
      {suggestions && (
        <div className="mt-4 p-4 bg-primary-light border border-primary rounded-xl text-sm">
          <p className="text-primary font-semibold mb-2 text-xs uppercase tracking-wide">
            ✨ AI Suggestions — preview only
          </p>
          <ul className="space-y-1.5 mb-3">
            {suggestions.map((s, i) => (
              <li key={i} className="flex gap-2 text-text-secondary">
                <span className="text-primary shrink-0">▸</span>
                {s}
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <button
              onClick={handleApplyBullets}
              className={`${btn.primary} text-xs px-3 py-1`}
            >
              ✅ Use These
            </button>
            <button
              onClick={() => setSuggestions(null)}
              className={`${btn.secondary} text-xs px-3 py-1`}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

//  ProjectsSection
function ProjectsSection({
  projects,
  onUpdateProject,
  onAddTech,
  onRemoveTech,
  onAddProject,
  onRemoveProject,
  onUpdateProjectBullet,
  onAddProjectBullet,
  onRemoveProjectBullet,
}) {
  return (
    <Section title="Projects">
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project, projIndex) => (
          <ProjectCard
            key={project.id}
            project={project}
            projIndex={projIndex}
            onUpdateProject={onUpdateProject}
            onAddTech={onAddTech}
            onRemoveTech={onRemoveTech}
            onRemoveProject={onRemoveProject}
            onUpdateProjectBullet={onUpdateProjectBullet}
            onAddProjectBullet={onAddProjectBullet}
            onRemoveProjectBullet={onRemoveProjectBullet}
          />
        ))}
      </div>

      {/* Add new project */}
      <button
        onClick={onAddProject}
        className="w-full mt-4 py-2 rounded-xl border-2 border-dashed border-border
                    text-text-muted hover:border-primary hover:text-primary
                    text-sm font-medium transition-colors duration-150"
      >
        + Add Project
      </button>
    </Section>
  );
}

export default ProjectsSection;
