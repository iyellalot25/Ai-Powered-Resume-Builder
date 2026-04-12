import Header from "./components/Header";
import SkillsSection from "./components/SkillsSection";
import ExperienceSection from "./components/ExperienceSection";
import ProjectsSection from "./components/ProjectsSection";

const resumeData = {
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

  projects: [
    {
      name: "AI Resume Builder",
      description:
        "An interactive resume builder with AI-powered suggestions and drag-and-drop layout.",
      tech: ["React", "Tailwind", "Hugging Face API"],
      link: "#",
    },
    {
      name: "Sentiment Analyser",
      description:
        "NLP model that classifies product reviews with 94% accuracy.",
      tech: ["Python", "BERT", "FastAPI"],
      link: "#",
    },
  ],
};

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Header
          name={resumeData.name}
          title={resumeData.title}
          email={resumeData.email}
          location={resumeData.location}
        />

        <SkillsSection skills={resumeData.skills} />
        <ExperienceSection jobs={resumeData.jobs} />
        <ProjectsSection projects={resumeData.projects} />
      </div>
    </div>
  );
}

export default App;
