// Each template is a collection of style strings
// Components pick styles from whichever template is active

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
    card: `bg-white dark:bg-gray-900 border border-gray-300
           dark:border-gray-600 p-6 mb-4`,
    title: `text-xl font-bold text-gray-900 dark:text-gray-100
            border-b-2 border-gray-800 dark:border-gray-400
            pb-1 mb-4 uppercase tracking-wide`,
    subtitle: "text-sm font-semibold text-gray-700 dark:text-gray-300",
    skillTag: `bg-gray-100 dark:bg-gray-700 text-gray-700
               dark:text-gray-300 px-3 py-1 text-sm font-medium
               border border-gray-300 dark:border-gray-500
               flex items-center gap-1`,
    techTag: `bg-gray-200 dark:bg-gray-600 text-gray-700
              dark:text-gray-300 px-2 py-0.5 text-xs border
              border-gray-300 dark:border-gray-500`,
    bullet: "text-sm text-gray-700 dark:text-gray-300",
  },

  minimal: {
    name: "Minimal",
    card: "p-6 mb-4 border-b border-gray-200 dark:border-gray-700",
    title: `text-sm font-semibold text-gray-400 dark:text-gray-500
            uppercase tracking-widest mb-4`,
    subtitle: "text-sm text-gray-500 dark:text-gray-400 italic",
    skillTag: `text-gray-600 dark:text-gray-400 text-sm underline
               underline-offset-2 flex items-center gap-1`,
    techTag: "text-gray-400 dark:text-gray-500 text-xs italic",
    bullet: "text-sm text-gray-500 dark:text-gray-400",
  },
};

export const TEMPLATE_IDS = ["modern", "classic", "minimal"];
