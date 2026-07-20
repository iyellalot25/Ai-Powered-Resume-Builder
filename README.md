# 🎨 AI-Powered Interactive Resume Builder

A production-ready AI-powered resume builder built with **React**, **Vite**, and **Tailwind CSS** that combines interactive resume editing, AI-assisted writing, ATS optimization, PDF export, and portfolio integration into a single modern web application.

Designed to demonstrate scalable React architecture, reusable component design, external API integration, responsive UI development, and production deployment.

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

## Developer Experience

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

- Modular component-based React architecture
- Centralized reusable design system built on custom Tailwind tokens
- Reusable UI primitives for buttons, inputs, cards, and tags
- Scalable client-side state management
- Service layer for external API integrations
- Responsive-first design with accessibility-conscious UI patterns
- Theme-aware styling supporting light, dark, and print layouts

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

# 🎯 Engineering Highlights

- Built using a modular React component architecture for scalability and maintainability.
- Implemented reusable UI primitives backed by a centralized design system to ensure consistent styling.
- Integrated multiple external APIs while maintaining graceful error handling and offline fallbacks.
- Optimized for responsive layouts, accessibility, and production deployment.
- Structured the application for future extensibility through reusable hooks, services, and shared utilities.

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
