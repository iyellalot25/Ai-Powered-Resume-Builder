function Section({ title, children }) {
  return (
    <div className="bg-gray-300 dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
      {/* Section title with a left accent bar */}
      <h2
        className="text-xl font-bold text-gray-900 dark:text-gray-100 border-l-4 
                   border-indigo-500 pl-3 mb-4"
      >
        {title}
      </h2>

      {/* Whatever put inside <Section>...</Section> renders here */}
      {children}
    </div>
  );
}

export default Section;
