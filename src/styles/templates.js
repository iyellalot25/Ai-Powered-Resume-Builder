export const templates = {
  modern: {
    name: "Modern",
    card: "bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 mb-6",
    title: `text-xl font-bold text-gray-900 dark:text-gray-100
            border-l-4 border-indigo-500 pl-3 mb-4`,
    subtitle: "text-sm font-medium text-indigo-500",
    skillTag: `bg-indigo-50 dark:bg-indigo-900 text-indigo-600
               dark:text-indigo-300 px-3 py-1 rounded-full text-sm font-medium
               flex items-center gap-1`,
    techTag: `bg-slate-100 dark:bg-gray-700 text-slate-600
              dark:text-gray-300 px-2 py-0.5 rounded-full text-xs`,
    bullet: "text-sm text-gray-600 dark:text-gray-400",
  },

  classic: {
    name: "Classic",
    // Sharp corners no shadow double top border feels like a Word doc
    card: `bg-white dark:bg-gray-900
           border-t-4 border-gray-900 dark:border-gray-100
           border-b border-l border-r border-gray-200 dark:border-gray-700
           p-6 mb-3`,
    // ALL CAPS, centered letterspaced traditional resume heading
    title: `text-base font-black text-gray-900 dark:text-gray-100
            uppercase tracking-[0.2em] text-center
            border-b-2 border-double border-gray-900 dark:border-gray-100
            pb-2 mb-4`,
    // Bold black authoritative no color
    subtitle: "text-sm font-bold text-gray-900 dark:text-gray-100",
    // Square badge no rounded corners at all
    skillTag: `bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
               px-3 py-1 text-sm font-semibold
               border-2 border-gray-900 dark:border-gray-300
               flex items-center gap-1`,
    // Inline bracket style [React] [Python]
    techTag: `text-gray-700 dark:text-gray-300 text-xs font-mono
              border border-gray-400 dark:border-gray-500
              px-1.5 py-0.5`,
    // Darker slightly heavier text
    bullet: "text-sm text-gray-800 dark:text-gray-200 font-normal",
  },

  minimal: {
    name: "Minimal",
    // No card at all just whitespace and a thin bottom rule
    card: "bg-transparent p-6 mb-2 border-b border-gray-100 dark:border-gray-800",
    // Tiny muted label almost like a footnote header
    title: `text-xs font-semibold text-gray-300 dark:text-gray-600
            uppercase tracking-[0.3em] mb-5`,
    // Italic muted whisper quiet
    subtitle: "text-sm text-gray-400 dark:text-gray-500 italic font-light",
    // Plain text with a dot separator no background no border
    skillTag: `text-gray-500 dark:text-gray-400 text-sm font-light
               flex items-center gap-1
               after:content-['·'] after:ml-1 after:text-gray-300
               last:after:content-['']`,
    // Just italic text no box at all
    techTag: "text-gray-400 dark:text-gray-500 text-xs font-light italic",
    // Very light almost faded
    bullet: "text-sm text-gray-400 dark:text-gray-500 font-light",
  },
};

export const TEMPLATE_IDS = ["modern", "classic", "minimal"];
