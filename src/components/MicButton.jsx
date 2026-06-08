// ── Reusable mic button ───────────────────────────────────
// Defined here, also used in ProjectsSection
function MicButton({ isListening, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={isListening ? "Listening… click to stop" : "Click to speak"}
      className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center
                  transition-all duration-150 mt-1
                  ${
                    isListening
                      ? "bg-danger text-white animate-pulse" // red + pulsing while listening
                      : "bg-secondary-light dark:bg-gray-700 text-text-muted dark:text-gray-400 hover:text-primary hover:bg-primary-light dark:hover:bg-indigo-900"
                  }`}
    >
      🎤
    </button>
  );
}
export default MicButton;
