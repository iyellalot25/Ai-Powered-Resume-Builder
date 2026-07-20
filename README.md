# 🎨 AI-Powered Interactive Resume Builder

An AI-powered resume builder built with React, Vite, and Tailwind CSS that combines interactive resume editing, AI-assisted writing, ATS optimization, PDF export, and portfolio integration into a single modern web application.

The application emphasizes reusable component architecture, scalable state management, centralized styling, responsive UI design, and seamless third-party API integration.

🌐 **Live Demo:** https://ai-powered-resume-builder-liard.vercel.app/

---

# 🚀 Project Overview

Creating a professional resume often requires multiple disconnected tools for editing, AI writing assistance, ATS optimization, exporting, and sharing.

This project consolidates that workflow into a single application where users can create, optimize, preview, export, and share resumes through an intuitive interface enhanced with AI.

The application emphasizes maintainable frontend architecture, reusable UI components, centralized styling, scalable state management, and seamless third-party API integration while delivering a polished user experience.

---

# ✨ Features

## Interactive Resume Editing

- Inline editing across all resume sections
- Add, edit, duplicate, and delete skills, education, experience, and projects
- Drag-and-drop section reordering using **dnd-kit**
- Multiple resume profiles with automatic local persistence
- Responsive editing experience for desktop and mobile devices

## AI-Assisted Resume Enhancement

- Generate professional experience bullet points
- Generate project descriptions and achievements
- Suggest role-specific technical skills
- AI-powered ATS keyword extraction and resume scoring
- Generate tailored cover letters from resume data and job descriptions
- Human-in-the-loop workflow requiring approval before applying AI suggestions
- Rule-based offline fallback when AI services are unavailable

## Resume Presentation

- Multiple professionally designed resume templates
- Light and dark themes
- Dedicated preview mode
- Print-optimized PDF export
- Shareable read-only resume links using compressed URLs

## Advanced Features

- GitHub profile and repository integration
- Voice input using the Web Speech API
- Smooth UI animations powered by Framer Motion
- Automatic data persistence using LocalStorage
- Mobile-friendly drag-and-drop interactions
- Animated ATS score visualization and achievement feedback

---

# 🛠️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- JavaScript (ES6+)

### APIs

- Hugging Face Inference API
- GitHub REST API
- Web Speech API
- Clipboard API
- LocalStorage API

### Libraries

- dnd-kit
- Framer Motion
- react-to-print
- lz-string
- canvas-confetti

### Tooling & Deployment

- Git
- GitHub
- Vercel
- Vercel Analytics

---

# 🏗️ Architecture Highlights

- Modular, component-based React architecture designed for scalability and maintainability
- Centralized design system built on custom Tailwind design tokens and reusable UI primitives
- Scalable client-side state management with clear separation between UI, business logic, and services
- Dedicated service layer for AI, GitHub, and browser API integrations with graceful error handling and offline fallbacks
- Reusable hooks and shared utilities to encourage extensibility and reduce code duplication
- Responsive, theme-aware interface supporting light, dark, mobile, and print layouts
- Feature-oriented project structure that keeps components, hooks, services, and styling concerns organized

---

# 📂 Project Structure

```text
ai-resume-builder/
├── public/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── styles/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

---

# ⚙️ Getting Started

## Clone the repository

```bash
git clone https://github.com/iyellalot25/ai-resume-builder.git
```

## Install dependencies

```bash
cd ai-resume-builder
npm install
```

## Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_HF_TOKEN=your_huggingface_token
```

## Start the development server

```bash
npm run dev
```

## Build for production

```bash
npm run build
```

---

# 🚀 Future Improvements

- User authentication and cloud synchronization
- Resume version history
- DOCX and Markdown export
- Custom resume sections
- AI interview preparation
- Resume analytics dashboard
- Real-time collaborative editing
- Recruiter review mode
- Additional resume templates
- Internationalization (i18n)

---

# 👨‍💻 Author

**Srijan Ghosh**

Aspiring Software Engineer focused on building production-ready full-stack applications with modern web technologies and AI-powered user experiences.

---
