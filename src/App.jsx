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

  // Add a new skill (called from SkillsSection)
  function addSkill(skill) {
    const trimmed = skill.trim();
    // Guard: don't add empty or duplicate skills
    if (!trimmed || resume.skills.includes(trimmed)) return;
    setResume((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
  }

  // Remove skill by its value
  function removeSkill(skill) {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  }

  // Update a single field on a job (role, company, duration)
  // jobIndex = which job, field = which key, value = new value
  function updateJob(jobIndex, field, value) {
    setResume((prev) => ({
      ...prev,
      jobs: prev.jobs.map((job, i) =>
        i === jobIndex ? { ...job, [field]: value } : job,
      ),
    }));
  }

  // Update one bullet inside a job
  function updateBullet(jobIndex, bulletIndex, value) {
    setResume((prev) => ({
      ...prev,
      jobs: prev.jobs.map((job, i) => {
        if (i !== jobIndex) return job;
        const newBullets = job.bullets.map((b, bi) =>
          bi === bulletIndex ? value : b,
        );
        return { ...job, bullets: newBullets };
      }),
    }));
  }

  // Add a blank bullet to a job
  function addBullet(jobIndex) {
    setResume((prev) => ({
      ...prev,
      jobs: prev.jobs.map((job, i) =>
        i === jobIndex ? { ...job, bullets: [...job.bullets, ""] } : job,
      ),
    }));
  }

  // Remove a bullet from a job
  function removeBullet(jobIndex, bulletIndex) {
    setResume((prev) => ({
      ...prev,
      jobs: prev.jobs.map((job, i) => {
        if (i !== jobIndex) return job;
        return {
          ...job,
          bullets: job.bullets.filter((_, bi) => bi !== bulletIndex),
        };
      }),
    }));
  }

  // Add a brand new blank job entry
  function addJob() {
    const newJob = {
      id: `job-${Date.now()}`, // unique id using timestamp
      role: "",
      company: "",
      duration: "",
      bullets: [""],
    };
    setResume((prev) => ({ ...prev, jobs: [...prev.jobs, newJob] }));
  }

  // Remove an entire job entry by index
  function removeJob(jobIndex) {
    setResume((prev) => ({
      ...prev,
      jobs: prev.jobs.filter((_, i) => i !== jobIndex),
    }));
  }

  //Edu section updaters
  function updateEdu(eduIndex, field, value) {
    setResume((prev) => ({
      ...prev,
      edu: prev.edu.map((item, i) =>
        i === eduIndex ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function addEdu() {
    setResume((prev) => ({
      ...prev,
      edu: [
        ...prev.edu,
        {
          id: `edu-${Date.now()}`,
          school: "",
          degree: "",
          year: "",
          cgpa: "",
        },
      ],
    }));
  }

  function removeEdu(eduIndex) {
    setResume((prev) => ({
      ...prev,
      edu: prev.edu.filter((_, i) => i !== eduIndex),
    }));
  }

  //Proj updaters
  function updateProject(projIndex, field, value) {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((p, i) =>
        i === projIndex ? { ...p, [field]: value } : p,
      ),
    }));
  }

  // Tech tags on a project add/remove strings
  function addTech(projIndex, tech) {
    const trimmed = tech.trim();
    if (!trimmed) return;
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((p, i) => {
        if (i !== projIndex) return p;
        if (p.tech.includes(trimmed)) return p; // no duplicates
        return { ...p, tech: [...p.tech, trimmed] };
      }),
    }));
  }

  function removeTech(projIndex, tech) {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((p, i) =>
        i === projIndex ? { ...p, tech: p.tech.filter((t) => t !== tech) } : p,
      ),
    }));
  }

  function addProject() {
    setResume((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: `proj-${Date.now()}`,
          name: "",
          description: "",
          tech: [],
          link: "",
        },
      ],
    }));
  }

  function removeProject(projIndex) {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== projIndex),
    }));
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

        <SkillsSection
          skills={resume.skills}
          onAdd={addSkill}
          onRemove={removeSkill}
        />
        <ExperienceSection
          jobs={resume.jobs}
          onUpdateJob={updateJob}
          onUpdateBullet={updateBullet}
          onAddBullet={addBullet}
          onRemoveBullet={removeBullet}
          onAddJob={addJob}
          onRemoveJob={removeJob}
        />
        <EducationSection
          edu={resume.edu}
          onUpdateEdu={updateEdu}
          onAddEdu={addEdu}
          onRemoveEdu={removeEdu}
        />
        <ProjectsSection
          projects={resume.projects}
          onUpdateProject={updateProject}
          onAddTech={addTech}
          onRemoveTech={removeTech}
          onAddProject={addProject}
          onRemoveProject={removeProject}
        />
      </div>
    </div>
  );
}

export default App;
