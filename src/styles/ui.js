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
    disabled:opacity-50 disabled:cursor-not-allowed
  `,

  // Secondary — less important actions (Cancel, Edit)
  secondary: `
    bg-secondary-light hover:bg-border
    text-text-secondary
    px-4 py-2 rounded-lg text-sm font-medium
    border border-border
    transition-colors duration-150
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
  `,

  // Danger — destructive actions (Delete, Remove)
  danger: `
    bg-white hover:bg-red-50
    text-danger
    px-4 py-2 rounded-lg text-sm font-medium
    border border-danger
    transition-colors duration-150
  `,

  // Ghost — icon-only or subtle buttons
  ghost: `
    hover:bg-primary-light
    text-text-secondary hover:text-primary
    p-2 rounded-lg
    transition-colors duration-150
  `,

  // Icon pill — tiny action inside a tag (the × on skills)
  pill: `
    text-text-muted hover:text-danger
    transition-colors duration-150
    leading-none ml-1
  `,
};

export const input = {
  // Standard text input
  base: `
    w-full
    border border-border
    rounded-lg
    px-3 py-2
    text-sm text-text-primary
    placeholder:text-text-muted
    bg-card
    outline-none
    focus:border-border-focus focus:shadow-input
    transition-all duration-150
  `,

  // Inline edit (used in Header click-to-edit)
  inline: `
    border-b-2 border-primary
    outline-none bg-transparent
    text-center w-full
    text-text-primary
  `,
};

export const card = {
  // Main section card (Skills, Experience, etc.)
  section: `
    bg-card rounded-2xl shadow-card
    p-6 mb-6
  `,

  // Smaller inner card (project item, job entry)
  inner: `
    border border-border rounded-xl
    p-4
    hover:border-primary hover:shadow-card-hover
    transition-all duration-150
  `,

  // Header card (special — centered, larger padding)
  header: `
    bg-card rounded-2xl shadow-card
    p-8 mb-6 text-center
  `,
};

export const tag = {
  // Skill tag — colored pill
  skill: `
    bg-primary-light text-primary
    px-3 py-1 rounded-full
    text-sm font-medium
    flex items-center gap-1
  `,

  // Tech tag — neutral small pill
  tech: `
    bg-secondary-light text-text-secondary
    px-2 py-0.5 rounded-full
    text-xs
  `,

  // Date badge
  date: `
    bg-secondary-light text-text-muted
    px-2 py-1 rounded-full
    text-xs
  `,
};
