import { motion } from "framer-motion";

// Each section card fades in and slides up when the page loads
// variants = reusable animation presets (cleaner than inline props)
const cardVariants = {
  hidden: { opacity: 0, y: 24 }, // start: invisible, 24px below
  visible: { opacity: 1, y: 0 }, // end: fully visible, normal position
};

function Section({ title, children }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-gray-300 dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6"
    >
      {/* Section title with a left accent bar */}
      <h2
        className="text-xl font-bold text-gray-900 dark:text-gray-100
                     border-l-4 border-indigo-500 pl-3 mb-4"
      >
        {title}
      </h2>
      {/* Whatever put inside <Section>...</Section> renders here */}
      {children}
    </motion.div>
  );
}

export default Section;
