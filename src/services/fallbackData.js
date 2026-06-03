// Offline fallback suggestions when AI API is unavailable.
// Keys are lowercase role keywords — we match by checking
// if the user's role string contains the keyword.

export const SKILL_SUGGESTIONS = {
  ml: ["PyTorch", "Scikit-learn", "Pandas", "NumPy", "Hugging Face"],
  ai: ["LangChain", "OpenCV", "FAISS", "Transformers", "MLflow"],
  frontend: ["TypeScript", "Next.js", "Redux", "Vitest", "Storybook"],
  backend: ["Node.js", "PostgreSQL", "Redis", "GraphQL", "Prisma"],
  fullstack: ["TypeScript", "Next.js", "Node.js", "PostgreSQL", "Docker"],
  devops: ["Kubernetes", "Terraform", "AWS", "CI/CD", "Prometheus"],
  data: ["Pandas", "NumPy", "Spark", "Airflow", "dbt"],
  default: ["Git", "Docker", "Linux", "REST APIs", "Agile"],
};

export const BULLET_SUGGESTIONS = {
  ml: [
    "Trained and evaluated machine learning models achieving over 90% accuracy",
    "Built data preprocessing pipelines reducing training time by 30%",
    "Deployed models as REST APIs using FastAPI and Docker",
  ],
  ai: [
    "Developed AI-powered features improving user engagement by 25%",
    "Integrated large language models into production workflows",
    "Optimised inference latency by 40% through model quantisation",
  ],
  frontend: [
    "Built responsive React components used by 10,000+ users",
    "Reduced page load time by 35% through code splitting and lazy loading",
    "Implemented accessible UI components following WCAG 2.1 standards",
  ],
  backend: [
    "Designed RESTful APIs serving 1M+ requests per day",
    "Optimised database queries reducing response time by 50%",
    "Implemented authentication and authorisation using JWT and OAuth2",
  ],
  default: [
    "Collaborated with cross-functional teams to deliver features on schedule",
    "Wrote unit and integration tests achieving 85% code coverage",
    "Reviewed pull requests and mentored junior developers",
  ],
};
