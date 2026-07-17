import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function ProfileBar({
  profiles,
  activeProfileId,
  onSwitch,
  onCreate,
  onRename,
  onDelete,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [renamingId, setRenamingId] = useState(null); // id of profile being renamed, or null
  const [renameValue, setRenameValue] = useState("");
  const [isCreating, setIsCreating] = useState(false); // shows the new profile input
  const [newName, setNewName] = useState("");

  const dropdownRef = useRef(null);
  const activeProfile = profiles[activeProfileId];
  const profileList = Object.values(profiles); // array form for easy mapping

  // Close the dropdown when user clicks anywhere outside it
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsCreating(false);
        setRenamingId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup: remove listener when component unmounts
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleCreate() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    onCreate(trimmed); // calls createProfile() in App
    setNewName("");
    setIsCreating(false);
    setIsOpen(false); // close dropdown after creating
  }

  function handleRenameSubmit(profileId) {
    onRename(profileId, renameValue); // calls renameProfile() in App
    setRenamingId(null); // exit rename mode
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button — shows active profile name, click to open dropdown */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium
          bg-card dark:bg-gray-800 border border-border dark:border-gray-700
          text-text-primary dark:text-gray-100 shadow-card
          hover:border-primary transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          dark:focus:ring-offset-gray-900"
      >
        {/* Coloured dot — visual identity for the active profile */}
        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
        {/* truncate prevents long names from breaking the layout */}
        <span className="max-w-[160px] truncate">
          {activeProfile?.name ?? "My Resume"}
        </span>
        {/* Chevron rotates 180° when dropdown is open */}
        <span
          className={`ml-1 transition-transform duration-200 text-text-muted
          ${isOpen ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </motion.button>

      {/* AnimatePresence enables the exit animation when dropdown closes */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-11 z-50 w-72
              bg-card dark:bg-gray-800 border border-border dark:border-gray-700
              rounded-xl shadow-card-hover overflow-hidden"
          >
            {/* Scrollable profile list */}
            <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
              {profileList.map((profile) => (
                <div
                  key={profile.id}
                  className="group flex items-center gap-2 rounded-lg px-2 py-1.5
                    hover:bg-primary-light dark:hover:bg-gray-700 transition-colors duration-100"
                >
                  {/* Show rename input OR normal row depending on state */}
                  {renamingId === profile.id ? (
                    // ── Rename mode: inline input replaces the name ──
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameSubmit(profile.id);
                        if (e.key === "Escape") setRenamingId(null); // cancel rename
                      }}
                      onBlur={() => handleRenameSubmit(profile.id)} // also save on blur
                      className="flex-1 text-sm bg-transparent border-b border-primary
                        outline-none text-text-primary dark:text-gray-100 py-0.5"
                    />
                  ) : (
                    // ── Normal mode: click the row to switch to this profile ──
                    <button
                      onClick={() => {
                        onSwitch(profile.id);
                        setIsOpen(false);
                      }}
                      className="flex-1 text-left text-sm text-text-primary dark:text-gray-100
                        flex items-center gap-2"
                    >
                      {/* Filled dot = active, transparent dot = inactive (keeps alignment) */}
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0
                        ${profile.id === activeProfileId ? "bg-primary" : "bg-transparent"}`}
                      />
                      <span className="truncate">{profile.name}</span>
                      {profile.id === activeProfileId && (
                        <span className="ml-auto text-xs text-primary font-medium">
                          active
                        </span>
                      )}
                    </button>
                  )}

                  {/* Rename + Delete buttons — only visible on hover via group-hover */}
                  {renamingId !== profile.id && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        title="Rename"
                        onClick={() => {
                          setRenamingId(profile.id);
                          setRenameValue(profile.name);
                        }}
                        className="p-1 rounded text-text-muted hover:text-primary
                          dark:text-gray-500 dark:hover:text-indigo-400 transition-colors"
                      >
                        ✏️
                      </button>
                      {/* Disabled when only 1 profile exists — can't delete the last one */}
                      <button
                        title={
                          profileList.length === 1
                            ? "Can't delete last profile"
                            : "Delete"
                        }
                        disabled={profileList.length === 1}
                        onClick={() => onDelete(profile.id)}
                        className="p-1 rounded text-text-muted hover:text-danger
                          dark:text-gray-500 dark:hover:text-rose-400 transition-colors
                          disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        🗑
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-border dark:border-gray-700" />

            {/* New profile section at the bottom of the dropdown */}
            <div className="p-2">
              {isCreating ? (
                // ── Creation mode: type a name and press Add or Enter ──
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    placeholder="Profile name…"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreate();
                      if (e.key === "Escape") {
                        setIsCreating(false);
                        setNewName("");
                      }
                    }}
                    className="flex-1 text-sm border border-border dark:border-gray-600 rounded-lg
                      px-2 py-1.5 bg-card dark:bg-gray-900 text-text-primary dark:text-gray-100
                      outline-none focus:border-border-focus placeholder:text-text-muted"
                  />
                  <button
                    onClick={handleCreate}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium
                      bg-primary hover:bg-primary-dark text-white transition-colors"
                  >
                    Add
                  </button>
                </div>
              ) : (
                // ── Default: a "+ New profile" button to enter creation mode ──
                <button
                  onClick={() => setIsCreating(true)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm
                    text-text-secondary dark:text-gray-400 hover:text-primary hover:bg-primary-light
                    dark:hover:bg-gray-700 transition-colors duration-100"
                >
                  <span className="text-lg leading-none">+</span>
                  New profile
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProfileBar;
