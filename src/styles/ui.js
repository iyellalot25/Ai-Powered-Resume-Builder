// src/styles/ui.js
// Usage: import { btn, input, card } from '../styles/ui'
// Then:  <button className={btn.primary}>Save</button>

export const btn = {
  // Primary — main actions (Save, Add, Generate)
  primary: `
    bg-primary hover:bg-primary-dark
    text-text-on-primary
    px-4 py-2 rounded-lg text-sm font-medium
    transition-colors duration-150
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
    dark:focus:ring-offset-gray-900
    disabled:opacity-50 disabled:cursor-not-allowed
  `,

  // Secondary — less important actions (Cancel, Edit)
  secondary: `
    bg-secondary-light hover:bg-border
    dark:bg-gray-700 dark:hover:bg-gray-600
    text-text-secondary dark:text-gray-300
    px-4 py-2 rounded-lg text-sm font-medium
    border border-border dark:border-gray-600
    transition-colors duration-150
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
    dark:focus:ring-offset-gray-900
  `,

  // Danger — destructive actions (Delete, Remove)
  danger: `
    bg-white hover:bg-red-50
    dark:bg-gray-800 dark:hover:bg-red-950
    text-danger
    px-4 py-2 rounded-lg text-sm font-medium
    border border-danger
    transition-colors duration-150
  `,

  // Ghost — icon-only or subtle buttons
  ghost: `
    hover:bg-primary-light dark:hover:bg-gray-700
    text-text-secondary dark:text-gray-400 hover:text-primary
    p-2 rounded-lg
    transition-colors duration-150
  `,

  // Icon pill — tiny action inside a tag (the × on skills)
  pill: `
    text-text-muted hover:text-danger
    dark:text-gray-500 dark:hover:text-danger
    transition-colors duration-150
    leading-none ml-1
  `,
};

export const input = {
  // Standard text input
  base: `
    w-full
    border border-border dark:border-gray-600
    rounded-lg
    px-3 py-2
    text-sm text-text-primary dark:text-gray-100
    placeholder:text-text-muted dark:placeholder:text-gray-500
    bg-card dark:bg-gray-800
    outline-none
    focus:border-border-focus focus:shadow-input
    transition-all duration-150
  `,

  // Inline edit (used in Header click-to-edit)
  inline: `
    border-b-2 border-primary
    outline-none bg-transparent
    text-center w-full
    text-text-primary dark:text-gray-100
  `,
};

export const card = {
  // Main section card (Skills, Experience, etc.)
  section: `
    bg-card dark:bg-gray-800 rounded-2xl shadow-card
    p-6 mb-6
  `,

  // Smaller inner card (project item, job entry)
  inner: `
    border border-border dark:border-gray-700  rounded-xl
    p-4
    hover:border-primary hover:shadow-card-hover
    transition-all duration-150
  `,

  // Header card (special — centered, larger padding)
  header: `
    bg-card dark:bg-gray-800 rounded-2xl shadow-card
    p-8 mb-6 text-center
  `,
};

export const tag = {
  // Skill tag — colored pill
  skill: `
    bg-primary-light dark:bg-indigo-900 text-primary dark:text-indigo-300
    px-3 py-1 rounded-full
    text-sm font-medium
    flex items-center gap-1
  `,

  // Tech tag — neutral small pill
  tech: `
    bg-secondary-light dark:bg-gray-700 text-text-secondary dark:text-gray-300
    px-2 py-0.5 rounded-full
    text-xs
  `,

  // Date badge
  date: `
    bg-secondary-light dark:bg-gray-700 text-text-muted dark:text-gray-400
    px-2 py-1 rounded-full
    text-xs
  `,
};
