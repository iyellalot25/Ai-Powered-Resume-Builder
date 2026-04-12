import Section from "./Section";

function ExperienceSection({ jobs }) {
  return (
    <Section title="Experience">
      {jobs.map((job) => (
        // key goes on the outermost element of the loop
        <div key={job.company} className="mb-5 last:mb-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-800">{job.role}</h3>
              <p className="text-indigo-500 text-sm">{job.company}</p>
            </div>
            <span
              className="text-xs text-gray-400 bg-gray-100 
                           px-2 py-1 rounded-full"
            >
              {job.duration}
            </span>
          </div>

          {/* Bullet points list */}
          <ul className="mt-2 space-y-1">
            {job.bullets.map((bullet, index) => (
              // index as key is OK here since bullets don't reorder
              <li
                key={index}
                className="text-sm text-gray-600 
                                        flex gap-2"
              >
                <span className="text-indigo-400 mt-0.5">▸</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Section>
  );
}

export default ExperienceSection;
