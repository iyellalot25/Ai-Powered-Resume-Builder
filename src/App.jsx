import { useState } from "react";

import Header from "./components/Header";
import SkillsSection from "./components/SkillsSection";
import ExperienceSection from "./components/ExperienceSection";
import EducationSection from "./components/EducationSection";
import ProjectsSection from "./components/ProjectsSection";

// Initial_Data
const INITIAL_DATA = {
  name: "Srijan Ghosh",
  title: "AI/ML Developer",
  email: "srijan@email.com",
  location: "India",

  skills: [
    "Python",
    "React",
    "Machine Learning",
    "TensorFlow",
    "FastAPI",
    "Docker",
    "SQL",
    "Git",
  ],

  jobs: [
    {
      id: "job-1", // unique id (needed for dnd later)
      role: "AI/ML Developer Intern",
      company: "Tech Startup",
      duration: "2024 – Present",
      bullets: [
        "Built a recommendation engine improving CTR by 18%",
        "Deployed ML models using FastAPI and Docker",
        "Collaborated with frontend team to integrate AI features",
      ],
    },
  ],

  edu: [
    {
      id: "edu-1",
      school: "Your University",
      degree: "B.Tech in Computer Science",
      year: "2022 – 2026",
      cgpa: "8.5",
    },
  ],

  projects: [
    {
      id: "proj-1",
      name: "AI Resume Builder",
      description: "Interactive resume builder with AI-powered suggestions.",
      tech: ["React", "Tailwind", "Hugging Face API"],
      link: "#",
    },
    {
      id: "proj-2",
      name: "Sentiment Analyser",
      description: "NLP model classifying product reviews with 94% accuracy.",
      tech: ["Python", "BERT", "FastAPI"],
      link: "#",
    },
  ],
};

function App() {
  const [resume, setResume] = useState(INITIAL_DATA);

  // Helper: update any top-level field (name, title, email, location)
  function updateField(field, value) {
    setResume((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="min-h-screen bg-surface py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Header
          name={resume.name}
          title={resume.title}
          email={resume.email}
          location={resume.location}
          onUpdate={updateField}
        />

        <SkillsSection skills={resume.skills} />
        <ExperienceSection jobs={resume.jobs} />
        <EducationSection edu={resume.edu} />
        <ProjectsSection projects={resume.projects} />
      </div>
    </div>
  );
}

export default App;
