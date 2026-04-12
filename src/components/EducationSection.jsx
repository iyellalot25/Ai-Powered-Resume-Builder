import Section from "./Section";

function EducationSection({ edu }) {
  return (
    <Section title="Education">
      {edu.map((edu) => (
        // key goes on the outermost element of the loop
        <div key={edu.degree} className="mb-5 last:mb-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-800">{edu.school}</h3>
              <p className="text-indigo-500 text-sm">{edu.degree}</p>
              <span
                className="text-xs text-gray-800 
                            rounded-full"
              >
                CGPA = {edu.cgpa}
              </span>
            </div>
            <span
              className="text-xs text-gray-400 bg-gray-100 
                            px-2 py-1 rounded-full"
            >
              {edu.year}
            </span>
          </div>
        </div>
      ))}
    </Section>
  );
}

export default EducationSection;
