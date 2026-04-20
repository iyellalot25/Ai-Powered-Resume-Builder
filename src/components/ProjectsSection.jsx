import { useState } from "react";
import Section from "./Section";
import { btn, input, tag } from "../styles/ui";

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

  function handleSave() {
    const trimmed = draft.trim();
    if (trimmed) onSave(trimmed);
    else setDraft(value);
    setIsEditing(false);
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
      onBlur: handleSave,
      onKeyDown: handleKeyDown,
      placeholder,
    };
    return multiline ? (
      <textarea
        {...sharedProps}
        rows={2}
        className={`${input.base} resize-none ${className}`}
      />
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

//  Single project card
function ProjectCard({
  project,
  projIndex,
  onUpdateProject,
  onAddTech,
  onRemoveTech,
  onRemoveProject,
}) {
  const [techDraft, setTechDraft] = useState("");

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
        <h3 className="text-base font-semibold text-text-primary flex-1">
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
      <p className="text-sm text-text-secondary mt-1 mb-3">
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

      {/* Add tech tag row */}
      <div className="flex gap-2">
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
