import { useState, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import Header from "./components/Header";
import SkillsSection from "./components/SkillsSection";
import ExperienceSection from "./components/ExperienceSection";
import EducationSection from "./components/EducationSection";
import ProjectsSection from "./components/ProjectsSection";
import SortableSection from "./components/SortableSection";
import GitHubSection from "./components/GitHubSection";
import ATSScorer from "./components/ATSScorer";
import CoverLetterGenerator from "./components/CoverLetterGenerator";
import ProfileBar from "./components/ProfileBar";

import { templates, TEMPLATE_IDS } from "./styles/templates";

import { useReactToPrint } from "react-to-print";

import { motion, AnimatePresence } from "framer-motion";

import LZString from "lz-string";

// Compress resume JSON => URL-safe string
function encodeResume(resumeData) {
  return LZString.compressToEncodedURIComponent(JSON.stringify(resumeData));
}

// Decompress URL-safe string => resume JSON
function decodeResume(encoded) {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    return json ? JSON.parse(json) : null;
  } catch {
    return null; // corrupted URL => fail silently
  }
}

// Initial_Data
const INITIAL_DATA = {
  name: "John Doe",
  title: "AI/ML Developer",
  email: "goat@gmail.com",
  location: "Barcelona, Spain",

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
      bullets: [],
    },
    {
      id: "proj-2",
      name: "Sentiment Analyser",
      description: "NLP model classifying product reviews with 94% accuracy.",
      tech: ["Python", "BERT", "FastAPI"],
      link: "#",
      bullets: [],
    },
  ],

  sectionOrder: ["skills", "experience", "education", "projects", "github"],
};

const DEFAULT_PROFILE_ID = "profile-default";

// Reads all profiles from localStorage.
// On first ever load migrates old flat "resumeData" into the new profile format.
function loadProfiles() {
  try {
    const saved = localStorage.getItem("resumeProfiles");
    if (saved) return JSON.parse(saved);

    // Migration: wrap old flat resumeData into new profile format
    const oldData = localStorage.getItem("resumeData");
    const migratedData = oldData ? JSON.parse(oldData) : INITIAL_DATA;

    const defaultProfiles = {
      [DEFAULT_PROFILE_ID]: {
        id: DEFAULT_PROFILE_ID,
        name: "My Resume",
        data: migratedData, // carry over whatever they had before
      },
    };

    // Save immediately so migration doesn't run again next load
    localStorage.setItem("resumeProfiles", JSON.stringify(defaultProfiles));
    return defaultProfiles;
  } catch {
    // If localStorage is corrupt or unavailable load defaaults
    return {
      [DEFAULT_PROFILE_ID]: {
        id: DEFAULT_PROFILE_ID,
        name: "My Resume",
        data: INITIAL_DATA,
      },
    };
  }
}

// Reads which profile was last active.
// Falls back to the first profile if the saved id no longer exists.
function loadActiveProfileId(profiles) {
  const saved = localStorage.getItem("activeProfileId");
  if (saved && profiles[saved]) return saved; // valid saved id, use it
  return Object.keys(profiles)[0]; // fallback: just use the first one
}

function App() {
  //Boolean to check if it is a sharedLink (Check if URL has a ?resume= param)
  const isSharedLink = new URLSearchParams(window.location.search).has(
    "resume",
  );

  // Holds all profiles: { [id]: { id, name, data } }
  const [profiles, setProfiles] = useState(() => loadProfiles());

  // Tracks which profile is currently selected
  const [activeProfileId, setActiveProfileId] = useState(() =>
    loadActiveProfileId(loadProfiles()),
  );

  // Resume data is sourced from the active profile not a flat key
  const [resume, setResume] = useState(() => {
    try {
      // Shared link overrides everything load from URL param instead
      if (isSharedLink) {
        const encoded = new URLSearchParams(window.location.search).get(
          "resume",
        );
        const decoded = decodeResume(encoded);
        if (decoded) return decoded;
      }
      const allProfiles = loadProfiles();
      const activeId = loadActiveProfileId(allProfiles);
      return allProfiles[activeId]?.data ?? INITIAL_DATA;
    } catch {
      return INITIAL_DATA;
    }
  });

  // Auto-saves resume changes into the active profile's data slot
  useEffect(() => {
    if (isSharedLink) return; // never overwrite localStorage on a shared view
    setProfiles((prev) => {
      const updated = {
        ...prev,
        // Only update the active profile's data, leave all others untouched
        [activeProfileId]: { ...prev[activeProfileId], data: resume },
      };
      localStorage.setItem("resumeProfiles", JSON.stringify(updated));
      return updated;
    });
  }, [resume, activeProfileId, isSharedLink]);

  // Separately persists which profile is active so it survives page refresh
  useEffect(() => {
    localStorage.setItem("activeProfileId", activeProfileId);
  }, [activeProfileId]);

  // Dark mode state
  // Read saved preference from localStorage on first load
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  const [isPreview, setIsPreview] = useState(isSharedLink);

  const [shareCopied, setShareCopied] = useState(false);

  // Whenever isDark changes=> add/remove the "dark" class on <html>
  // and save the preference so it persists across page refreshes
  useEffect(() => {
    const root = document.documentElement; // this is the <html> element
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const [activeTemplate, setActiveTemplate] = useState(
    () => localStorage.getItem("resumeTemplate") ?? "modern",
  );

  // Save template preference whenever it changes
  useEffect(() => {
    localStorage.setItem("resumeTemplate", activeTemplate);
  }, [activeTemplate]);

  function toggleDark() {
    setIsDark((prev) => !prev);
  }

  // Ref pointing to the printable resume area
  const printRef = useRef(null); //initializing to null

  // react-to-print hook => prints only the div attached to printRef
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${resume.name}_Resume`, // sets the PDF filename
  });

  function handleDownload() {
    setIsPreview(true); // activate preview mode first
    setTimeout(() => {
      handlePrint(); // then trigger print
      setIsPreview(false); // restore edit mode after
    }, 150); // small delay so React re-renders preview first
  }

  function handleShare() {
    const encoded = encodeResume(resume);
    const url = `${window.location.origin}${window.location.pathname}?resume=${encoded}`;
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  }

  // Saves current resume (already handled by useEffect) then loads the new profile
  function switchProfile(profileId) {
    if (profileId === activeProfileId) return; // already on this profile, do nothing
    setActiveProfileId(profileId);
    setResume(profiles[profileId].data); // load that profile's resume data
  }

  // Creates a new profile with a fresh INITIAL_DATA resume and switches to it
  function createProfile(name) {
    const id = `profile-${Date.now()}`; // timestamp gives a unique id
    const newProfile = { id, name, data: INITIAL_DATA };
    const updated = { ...profiles, [id]: newProfile };
    setProfiles(updated);
    localStorage.setItem("resumeProfiles", JSON.stringify(updated));
    setActiveProfileId(id);
    setResume(INITIAL_DATA); // start the new profile with clean data
  }

  // Renames a profile — only updates the name field, data stays the same
  function renameProfile(profileId, newName) {
    const trimmed = newName.trim();
    if (!trimmed) return; // don't allow empty names
    setProfiles((prev) => {
      const updated = {
        ...prev,
        [profileId]: { ...prev[profileId], name: trimmed },
      };
      localStorage.setItem("resumeProfiles", JSON.stringify(updated));
      return updated;
    });
  }

  // Deletes a profile — if it was active switches to the next available one
  function deleteProfile(profileId) {
    const ids = Object.keys(profiles);
    if (ids.length === 1) return; // guard: always keep at least one profile
    const updated = { ...profiles };
    delete updated[profileId];
    setProfiles(updated);
    localStorage.setItem("resumeProfiles", JSON.stringify(updated));
    // If we deleted the currently active profile, switch to the first remaining one
    if (profileId === activeProfileId) {
      const nextId = Object.keys(updated)[0];
      setActiveProfileId(nextId);
      setResume(updated[nextId].data);
    }
  }

  // Creates a copy of any profile with "Copy of" prefix, then switches to it
  function duplicateProfile(profileId) {
    const source = profiles[profileId];
    const id = `profile-${Date.now()}`;
    const newProfile = {
      id,
      name: `Copy of ${source.name}`,
      data: { ...source.data }, // shallow copy
    };
    const updated = { ...profiles, [id]: newProfile };
    setProfiles(updated);
    localStorage.setItem("resumeProfiles", JSON.stringify(updated));
    setActiveProfileId(id);
    setResume(newProfile.data); // switch to the duplicate immediately
  }

  //  Drag end handler ─
  // Called by dnd-kit when user drops a section in a new position
  function handleDragEnd(event) {
    const { active, over } = event;

    // active = what was dragged, over = where it was dropped
    // If dropped in same spot, do nothing
    if (!over || active.id === over.id) return;

    setResume((prev) => {
      const oldIndex = prev.sectionOrder.indexOf(active.id);
      const newIndex = prev.sectionOrder.indexOf(over.id);

      // arrayMove is a dnd-kit utility — reorders an array cleanly
      return {
        ...prev,
        sectionOrder: arrayMove(prev.sectionOrder, oldIndex, newIndex),
      };
    });
  }

  //  Sensors — how dnd-kit detects drag gestures
  // PointerSensor works for both mouse and touch
  // activationConstraint: user must drag 8px before it counts (prevents accidental drags)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      // User must press and hold 250ms before drag starts on touch
      // This prevents accidental drags while scrolling
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );

  //  Section map — id => component
  // This is the clean way to render sections in dynamic order
  const sectionMap = {
    skills: (
      <SkillsSection
        skills={resume.skills}
        onAdd={addSkill}
        onRemove={removeSkill}
        isPreview={isPreview}
        template={templates[activeTemplate]}
      />
    ),
    experience: (
      <ExperienceSection
        jobs={resume.jobs}
        onUpdateJob={updateJob}
        onUpdateBullet={updateBullet}
        onAddBullet={addBullet}
        onRemoveBullet={removeBullet}
        onAddJob={addJob}
        onRemoveJob={removeJob}
        isPreview={isPreview}
        template={templates[activeTemplate]}
      />
    ),
    education: (
      <EducationSection
        edu={resume.edu}
        onUpdateEdu={updateEdu}
        onAddEdu={addEdu}
        onRemoveEdu={removeEdu}
        isPreview={isPreview}
        template={templates[activeTemplate]}
      />
    ),
    projects: (
      <ProjectsSection
        projects={resume.projects}
        onUpdateProject={updateProject}
        onAddTech={addTech}
        onRemoveTech={removeTech}
        onAddProject={addProject}
        onRemoveProject={removeProject}
        onUpdateProjectBullet={updateProjectBullet}
        onAddProjectBullet={addProjectBullet}
        onRemoveProjectBullet={removeProjectBullet}
        isPreview={isPreview}
        template={templates[activeTemplate]}
      />
    ),
    github: (
      <GitHubSection
        isPreview={isPreview}
        template={templates[activeTemplate]}
      />
    ),
  };

  return (
    <div
      className="min-h-screen bg-surface dark:bg-gray-900 py-10 px-4
                    transition-colors duration-300"
    >
      <div className="max-w-3xl mx-auto">
        {/* Profile switcher — hidden on shared links and when printing */}
        {!isSharedLink && (
          <div className="print:hidden mb-3">
            <ProfileBar
              profiles={profiles}
              activeProfileId={activeProfileId}
              onSwitch={switchProfile}
              onCreate={createProfile}
              onRename={renameProfile}
              onDelete={deleteProfile}
              onDuplicate={duplicateProfile}
            />
          </div>
        )}

        {/* Toolbar — hidden when printing */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 print:hidden w-full">
          {/* Row 1 on mobile: Template switcher + dark mode */}
          {/* Left alignment group for core document actions */}
          <div className="flex items-center justify-between sm:justify-start gap-2">
            {/* Template switcher */}
            <div
              className="flex items-center gap-1 bg-card dark:bg-gray-800
        border border-border dark:border-gray-700
        rounded-lg p-1 shadow-card"
            >
              {TEMPLATE_IDS.map((id) => (
                <motion.button
                  key={id}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setActiveTemplate(id)}
                  className={`px-2 sm:px-3 h-7 rounded-md text-xs font-medium transition-all duration-150
            ${
              activeTemplate === id
                ? "bg-primary text-white"
                : "text-text-secondary dark:text-gray-400 hover:text-primary"
            }`}
                >
                  {templates[id].name}
                </motion.button>
              ))}
            </div>

            {/* Dark mode toggle — moves here on mobile */}
            {/* Right alignment group for app/system settings */}
            <motion.button
              whileTap={{ scale: 0.92 }} // slight squish on click
              whileHover={{ scale: 1.08 }} // slight grow on hover
              onClick={toggleDark}
              title="Toggle dark mode"
              className={`relative w-14 sm:w-16 h-8 rounded-full transition-colors duration-300
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          dark:focus:ring-offset-gray-900
          ${isDark ? "bg-indigo-500" : "bg-gray-300"}`}
            >
              {/* The sliding circle with the emoji inside */}
              <span
                className={`absolute top-1 left-1 w-6 h-6 rounded-full
                  flex items-center justify-center text-sm
                  shadow-md transition-transform duration-300
                  ${isDark ? "translate-x-6 sm:translate-x-8 bg-indigo-900" : "translate-x-0 bg-white"}`}
              >
                {isDark ? "🌙" : "☀️"}
              </span>
            </motion.button>
          </div>

          {/* Row 2 on mobile: Reset + Preview + Download */}
          <div className="flex items-center gap-2">
            {/* Reset resume data button */}
            {!isSharedLink && (
              <motion.button
                whileTap={{ scale: 0.92 }} // slight squish on click
                whileHover={{ scale: 1.08 }} // slight grow on hover
                onClick={() => setResume(INITIAL_DATA)} // Only resets the current profile — other profiles are unaffected
                className="flex items-center gap-1 px-3 h-9 rounded-lg text-sm font-medium
                bg-white dark:bg-gray-800 text-danger border border-danger
                hover:bg-red-100 dark:hover:bg-red-950
                shadow-card transition-all duration-150"
              >
                🗑 <span className="hidden sm:inline">Reset</span>
              </motion.button>
            )}
            {/* Preview toggle button */}
            <motion.button
              whileTap={{ scale: 0.92 }} // slight squish on click
              whileHover={{ scale: 1.08 }} // slight grow on hover
              disabled={isSharedLink}
              onClick={() => setIsPreview((prev) => !prev)}
              className={`flex items-center gap-1 px-3 h-9 rounded-lg text-sm font-medium
          border transition-all duration-150 shadow-card
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          dark:focus:ring-offset-gray-900 ${isSharedLink ? "opacity-60 cursor-not-allowed" : ""}
          ${
            isPreview
              ? "bg-primary text-white border-primary"
              : "bg-card dark:bg-gray-800 text-text-secondary dark:text-gray-300 border-border dark:border-gray-700 hover:border-primary"
          }`}
            >
              {isSharedLink ? "🔒" : isPreview ? "✏️" : "👁"}
              <span className="hidden sm:inline">
                {isSharedLink ? " View Only" : isPreview ? " Edit" : " Preview"}
              </span>
            </motion.button>
            {/* Download PDF button */}
            <motion.button
              whileTap={{ scale: 0.92 }} // slight squish on click
              whileHover={{ scale: 1.06 }} // slight grow on hover
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 h-9 rounded-lg text-sm font-medium
                bg-primary hover:bg-primary-dark text-white
                dark:bg-indigo-800 dark:hover:bg-indigo-700
                shadow-card transition-all duration-150
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                dark:focus:ring-offset-gray-900"
            >
              ⬇️ <span className="hidden sm:inline">Download PDF</span>
            </motion.button>
            {/* Share button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.06 }}
              onClick={handleShare}
              className={`flex items-center gap-1 px-3 h-9 rounded-lg text-sm font-medium
                shadow-card transition-all duration-150
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                dark:focus:ring-offset-gray-900
    ${
      shareCopied
        ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-400"
        : "bg-card dark:bg-gray-800 text-text-secondary dark:text-gray-300 border border-border dark:border-gray-700 hover:border-primary hover:text-primary"
    }`}
            >
              {shareCopied ? "✅" : "🔗"}
              <span className="hidden sm:inline">
                {shareCopied ? " Copied!" : " Share"}
              </span>
            </motion.button>
          </div>
        </div>

        {/* ── Printable resume area ── */}
        {/* ref tells react-to-print "print everything inside here" */}
        <div ref={printRef}>
          {/* Header is not draggable — always stays on top */}
          <Header
            name={resume.name}
            title={resume.title}
            email={resume.email}
            location={resume.location}
            onUpdate={updateField}
            isPreview={isPreview}
          />

          {/* DndContext wraps everything that can be dragged */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {/* SortableContext knows the current order */}
            <SortableContext
              items={resume.sectionOrder}
              strategy={verticalListSortingStrategy}
            >
              {/* Render sections in current order */}
              {resume.sectionOrder.map((sectionId) => (
                <SortableSection
                  key={sectionId}
                  id={sectionId}
                  isPreview={isPreview}
                >
                  {sectionMap[sectionId]}
                </SortableSection>
              ))}
            </SortableContext>
          </DndContext>

          {!isSharedLink && (
            // ATS Scorer — hidden when printing
            <div className="print:hidden">
              <ATSScorer resume={resume} />
            </div>
          )}

          {!isSharedLink && (
            // Cover Letter Generator — hidden when printing
            <div className="print:hidden">
              <CoverLetterGenerator resume={resume} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  //All updater fns
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

  function updateProjectBullet(projIndex, bulletIndex, value) {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((p, i) => {
        if (i !== projIndex) return p;
        const newBullets = p.bullets.map((b, bi) =>
          bi === bulletIndex ? value : b,
        );
        return { ...p, bullets: newBullets };
      }),
    }));
  }

  function addProjectBullet(projIndex) {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((p, i) =>
        i === projIndex ? { ...p, bullets: [...p.bullets, ""] } : p,
      ),
    }));
  }

  function removeProjectBullet(projIndex, bulletIndex) {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((p, i) => {
        if (i !== projIndex) return p;
        return {
          ...p,
          bullets: p.bullets.filter((_, bi) => bi !== bulletIndex),
        };
      }),
    }));
  }
}

export default App;
