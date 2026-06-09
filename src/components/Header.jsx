import { useState } from "react";
import { input as inputStyle } from "../styles/ui";

// Props:
//   value      — current text to display
//   onSave     — called with new value when user finishes editing
//   className  — any extra Tailwind classes for the display text
//   inputClass — extra classes for the <input> element
//   isPreview  — blocks editing functionality when true
function EditableField({
  value,
  onSave,
  className = "",
  inputClass = "",
  isPreview = false,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value); // "draft" = unsaved typing

  // When user clicks the text switch to edit mode
  function handleClick() {
    if (isPreview) return; // ← block editing in preview mode
    setDraft(value); // reset draft to latest saved value
    setIsEditing(true);
  }

  // When user finishes (Enter key or click away) save and exit edit mode
  function handleSave() {
    const trimmed = draft.trim();
    if (trimmed) onSave(trimmed); // only save if not empty
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") setIsEditing(false); // cancel on Escape
  }

  if (isEditing && !isPreview) {
    return (
      <input
        // autoFocus automatically focuses the input when it appears
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleSave} // save when user clicks away
        onKeyDown={handleKeyDown}
        className={`${inputStyle.inline} ${inputClass}`}
      />
    );
  }

  return (
    <span
      onClick={handleClick}
      title={isPreview ? "" : "Click to edit"} // tooltip on hover
      className={`transition-colors duration-150
                  ${!isPreview ? "cursor-pointer hover:text-primary" : "cursor-default"}
                  ${className}`}
    >
      {value}
    </span>
  );
}

function Header({ name, title, email, location, onUpdate, isPreview }) {
  return (
    <div className="bg-card dark:bg-gray-800 rounded-2xl shadow-card p-8 mb-6 text-center">
      {/* Avatar — shows first letter of name */}
      <div
        className="w-20 h-20 rounded-full bg-primary-light dark:bg-indigo-900 flex items-center
                   justify-center mx-auto mb-4"
      >
        <span className="text-2xl font-bold text-primary dark:text-indigo-300">
          {name.charAt(0)}
        </span>
      </div>

      {/* Name — H1, editable */}
      <h1 className="text-3xl font-bold text-text-primary dark:text-gray-100">
        <EditableField
          value={name}
          onSave={(val) => onUpdate("name", val)}
          inputClass="text-3xl font-bold text-center"
          isPreview={isPreview}
        />
      </h1>

      {/* Title — subtitle, editable */}
      <p className="text-sm font-medium text-primary mt-1">
        <EditableField
          value={title}
          onSave={(val) => onUpdate("title", val)}
          inputClass="text-sm font-medium text-center"
          isPreview={isPreview}
        />
      </p>

      {/* Info row — email + location, both editable */}
      <div className="flex justify-center gap-6 mt-4 text-sm text-text-secondary dark:text-gray-400">
        <span className="flex items-center gap-2">
          📧
          <EditableField
            value={email}
            onSave={(val) => onUpdate("email", val)}
            inputClass="text-sm text-center"
            isPreview={isPreview}
          />
        </span>
        <span className="flex items-center gap-2">
          📍
          <EditableField
            value={location}
            onSave={(val) => onUpdate("location", val)}
            inputClass="text-sm text-center"
            isPreview={isPreview}
          />
        </span>
      </div>

      {/* Hide hint in preview mode */}
      {!isPreview && (
        <p className="text-xs text-text-muted dark:text-gray-500 mt-3">
          ✏️ Click any field to edit
        </p>
      )}
    </div>
  );
}

export default Header;
