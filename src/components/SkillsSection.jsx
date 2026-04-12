import Section from "./Section";

function SkillsSection({ skills }) {
  return (
    <Section title="Skills">
      {/* .map() loops over the array and renders a tag for each skill */}
      {/* 'key' is required by React when rendering lists — use something unique */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="bg-indigo-50 text-indigo-700 px-3 py-1 
                       rounded-full text-sm font-medium"
          >
            {skill}
          </span>
        ))}
      </div>
    </Section>
  );
}

export default SkillsSection;
