import { useState } from "react";
import { input as inputStyle } from "../styles/ui";

// Props:
//   value      — current text to display
//   onSave     — called with new value when user finishes editing
//   className  — any extra Tailwind classes for the display text
//   inputClass — extra classes for the <input> element
function EditableField({ value, onSave, className = "", inputClass = "" }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value); // "draft" = unsaved typing

  // When user clicks the text switch to edit mode
  function handleClick() {
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

  if (isEditing) {
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
      title="Click to edit" // tooltip on hover
      className={`cursor-pointer hover:text-primary transition-colors duration-150 ${className}`}
    >
      {value}
    </span>
  );
}

function Header({ name, title, email, location, onUpdate }) {
  return (
    <div className="bg-card rounded-2xl shadow-card p-8 mb-6 text-center">
      {/* Avatar — shows first letter of name */}
      <div
        className="w-20 h-20 rounded-full bg-primary-light flex items-center
                      justify-center mx-auto mb-4"
      >
        <span className="text-2xl font-bold text-primary">
          {name.charAt(0)}
        </span>
      </div>

      {/* Name — H1, editable */}
      <h1 className="text-3xl font-bold text-text-primary">
        <EditableField
          value={name}
          onSave={(val) => onUpdate("name", val)}
          inputClass="text-3xl font-bold text-center"
        />
      </h1>

      {/* Title — subtitle, editable */}
      <p className="text-sm font-medium text-primary mt-1">
        <EditableField
          value={title}
          onSave={(val) => onUpdate("title", val)}
          inputClass="text-sm font-medium text-center"
        />
      </p>

      {/* Info row — email + location, both editable */}
      <div className="flex justify-center gap-6 mt-4 text-sm text-text-secondary">
        <span className="flex items-center gap-2">
          📧
          <EditableField
            value={email}
            onSave={(val) => onUpdate("email", val)}
            inputClass="text-sm text-center"
          />
        </span>
        <span className="flex items-center gap-2">
          📍
          <EditableField
            value={location}
            onSave={(val) => onUpdate("location", val)}
            inputClass="text-sm text-center"
          />
        </span>
      </div>

      {/* Hint text — teaches user the click-to-edit interaction */}
      <p className="text-xs text-text-muted mt-3">✏️ Click any field to edit</p>
    </div>
  );
}

export default Header;
