import Section from "./Section";

function ProjectsSection({ projects }) {
  return (
    <Section title="Projects">
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <div
            key={project.name}
            className="border border-gray-100 rounded-xl p-4 
                          hover:border-indigo-400 transition-colors"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-gray-800">{project.name}</h3>

              {/* Only show link if it exists */}
              {project.link && (
                <a
                  href={project.link}
                  className="text-xs text-indigo-500 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  View →
                </a>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-1">{project.description}</p>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-gray-100 text-gray-600 
                                 px-2 py-0.5 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default ProjectsSection;
