import { motion } from "framer-motion";

// Each section card fades in and slides up when the page loads
// variants = reusable animation presets (cleaner than inline props)
const cardVariants = {
  hidden: { opacity: 0, y: 24 }, // start: invisible, 24px below
  visible: { opacity: 1, y: 0 }, // end: fully visible, normal position
};

function Section({ title, children, template }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={template.card} //dynamic
    >
      {/* Section title with a left accent bar */}
      <h2 className={template.title}>
        {/* dynamic */}
        {title}
      </h2>
      {/* Whatever put inside <Section>...</Section> renders here */}
      {children}
    </motion.div>
  );
}

export default Section;
