import { SKILL_SUGGESTIONS, BULLET_SUGGESTIONS } from "./fallbackData";

//Fallback helper matches role to a key
// Returns the first key that appears in the role string
// Falls back to "default" if nothing matches
function matchRole(role) {
  const lower = role.toLowerCase();
  const keys = Object.keys(SKILL_SUGGESTIONS);
  return keys.find((key) => lower.includes(key)) ?? "default";
}

const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;
const MODEL = "Qwen/Qwen2.5-7B-Instruct";
const API_URL = "https://router.huggingface.co/v1/chat/completions";

//Core fetch function
async function callHuggingFace(systemPrompt, userPrompt, maxTokens = 300) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`HF API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  // OpenAI-compatible format: choices[0].message.content
  return data.choices[0].message.content.trim();
}

//Feature: Bullet Suggestions
// Takes a job role + company, returns 3 resume bullets
export async function suggestBullets(role, company) {
  const system = `You are an elite professional resume writer specializing in ATS-optimized, high-impact career achievements.
    Write exactly 3 concise, impactful resume bullet points tailored to the given role and company.

    [STRICT WRITING RULES]
    1. METRIC-DRIVEN (XYZ Formula): Every bullet point must imply or include realistic business impact, scale, or metrics (e.g., efficiency gains, revenue, user growth, processing speed, or team optimization).
    2. ACTION-FIRST: Every bullet point must start with a strong, sophisticated, varied action verb (e.g., Spearheaded, Engineered, Orchestrated, Modernized). Never reuse the same starting verb.
    3. CONCISE & PUNCHY: Keep each bullet point to a single, impactful sentence. Avoid fluff or corporate filler text.
    4. NO PLACEHOLDERS: Do not leave blank brackets or templates like "[X]%". Write fully fleshed-out, contextually plausible industry achievements.

    [OUTPUT FORMAT]
    Return ONLY the 3 bullet points using the exact Markdown format below. Do not include introductory text, conversational filler, or explanations:
    - [bullet 1]
    - [bullet 2]
    - [bullet 3]`;

  const user = `Job role: ${role} at ${company}`;

  try {
    return await callHuggingFace(system, user);
  } catch (err) {
    console.warn("AI unavailable, using fallback:", err.message);
    // Return fallback bullets joined as a string (same format as API)
    const key = matchRole(role);
    return BULLET_SUGGESTIONS[key].join("\n");
  }
}

//Feature: Keyword Enhancement
// Takes current skills array, returns suggested skills to add
export async function suggestSkills(currentSkills, jobRole) {
  const system = `You are an elite technical resume writer for an interactive resume builder platform.
    Your task is to analyze a user's current skillset and suggest exactly 5 highly relevant, non-generic skills required to optimize their resume for a target role.

    [STRICT ARCHITECTURAL RULES]
    1. ECOSYSTEM MATCHING: Tailor suggestions to their current tech stack ecosystem (e.g., if they know React, suggest Next.js/Redux, not Vue/Nuxt).
    2. LEVEL APPROPRIATENESS: Match the complexity of the skills to their implied experience level. Do not suggest complex DevOps tooling to a junior UI developer.
    3. ANTI-GENERIC FILTER: Do NOT suggest basic, obvious entry-level skills (e.g., no "HTML", "CSS", "Git", or "Microsoft Word"). 
    4. NO DUPLICATES: Never suggest a skill already present in their current skills list.

    [OUTPUT FORMAT]
    Return ONLY a comma-separated list, with no intro, no conclusion, and no numbered labels.
    Example Input: Current skills: [React, JavaScript], Target role: Full Stack Developer
    Example Output: Next.js, Node.js, PostgreSQL, Prisma, Docker`;

  const user = `Current skills: ${currentSkills.join(", ")}
    Target role: ${jobRole}`;

  try {
    return await callHuggingFace(system, user);
  } catch (err) {
    console.warn("AI unavailable, using fallback:", err.message);
    const key = matchRole(jobRole);
    // Return as comma-separated string (same format as API)
    return SKILL_SUGGESTIONS[key].join(", ");
  }
}
// Feature: Project Bullet Suggestions
// Takes project name + description, returns 3 impact bullets
export async function suggestProjectBullets(projectName, description) {
  const system = `You are an elite professional resume writer specializing in technical portfolios and project optimization.
    Write exactly 3 concise, high-impact resume bullet points focusing on the technical implementation of this project.

    [STRICT PROJECT WRITING RULES]
    1. THE TECH STACK LINK: Directly weave specific modern tech tools, frameworks, languages, or architectures into the execution of the bullet points.
    2. SYSTEM IMPACT: Focus on technical metrics and engineering results (e.g., latency reduction, automated deployment time, database query optimization, user engagement, or architecture reliability).
    3. PROBLEM TO SOLUTION: Show individual engineering ownership—illustrate a technical challenge that was solved, rather than just listing features.
    4. VARIETY: Start every bullet point with a distinct, authoritative action verb (e.g., Architected, Optimized, Implemented, Streamlined). Never repeat a verb.
    5. NO PLACEHOLDERS: Do not leave blank brackets or templates like "[X]%". Generate fully completed, contextually realistic project metrics.

    [OUTPUT FORMAT]
    Return ONLY the 3 bullet points. Do not include introductory text, conversational filler, markdown code blocks, or explanations:
    - [bullet 1]
    - [bullet 2]
    - [bullet 3]`;

  const user = `Project: ${projectName}
    Description: ${description}`;

  try {
    return await callHuggingFace(system, user);
  } catch (err) {
    console.warn("AI unavailable, using fallback:", err.message);
    // Use project name + description to guess role context
    const key = matchRole(`${projectName} ${description}`);
    return BULLET_SUGGESTIONS[key].join("\n");
  }
}

// Feature: ATS Keyword Extraction
// Takes a job description, returns only meaningful technical keywords
export async function extractATSKeywords(jobDescription) {
  const system = `You are an advanced Applicant Tracking System (ATS) parsing engine optimized for technical keyword extraction.
    Analyze the provided job description and extract only the hard technical skills and core industry competencies.

    [STRICT EXTRACTION RULES]
    1. RAW ENTITIES ONLY: Extract only specific hard skills, programming languages, libraries, frameworks, developer tools, databases, infrastructure components, or defined engineering methodologies.
    2. ZERO SOFT SKILLS: Absolutely exclude soft skills, character traits, or corporate buzzwords (e.g., do NOT extract "teamwork", "leadership", "communication", "motivation", or "problem-solving").
    3. NO METRICS OR CONTEXT: Extract only the literal names of the technologies. Do not include experience lengths, proficiency levels, or parenthetical notes (e.g., extract "React", not "React (3+ years)").
    4. NO FILLER OR DUPLICATES: Deduplicate the list. Do not extract company names, location details, salary structures, or generic terms like "software" or "code".

    [OUTPUT FORMAT]
    Return ONLY a flat, comma-separated list of the extracted technical keywords. Do not include bullet points, numbering, introductory text, explanations, or code-block wrappers.
    Example: Python, REST API, Docker, Java, SQL, Agile, Git`;

  const user = `Job description:\n${jobDescription}`;

  try {
    return await callHuggingFace(system, user);
  } catch (err) {
    console.warn("AI unavailable for ATS, using fallback:", err.message);
    // Fallback: return null so ATSScorer knows to use basic extraction
    return null;
  }
}

// Feature: Cover Letter Generator
export async function generateCoverLetter(resume, jobDescription) {
  const system = `You are an expert career coach and professional cover letter writer.
    Write a concise, compelling cover letter in exactly 3 paragraphs based ONLY on the applicant data provided:
    1. Opening — who the applicant is and what role they're applying for
    2. Middle — 2-3 specific achievements or skills matching the job
    3. Closing — enthusiasm and call to action

    [CRITICAL CONSTRAINT]
    Do NOT invent, assume, or hallucinate any experience, metrics, or skills that are not explicitly stated in the applicant's data. If a skill is required by the job but missing from the candidate's profile, focus strictly on their existing transferable skills. Do not make up past company names.

    Formatting Constraints:
    - Keep it under 250 words.
    - Sound human and confident, not robotic or overly formal.
    - Return ONLY the cover letter body text.
    - Do NOT include a subject line, date, or address headers. Start directly with the greeting.`;

  const user = `Applicant Name: ${resume.name}
    Target Title: ${resume.title}
    Skills: ${resume.skills.join(", ")}
    Experience: ${resume.jobs
      .map((j) => `${j.role} at ${j.company}: ${j.bullets.join("; ")}`)
      .join(" | ")}
    Education: ${resume.edu
      .map((e) => `${e.degree} from ${e.school} (${e.year})`)
      .join(" | ")}
    Projects: ${resume.projects
      .map((p) => `${p.name} — ${p.description} [${p.tech.join(", ")}]`)
      .join(" | ")}

    Job Description:
    ${jobDescription}`;

  try {
    return await callHuggingFace(system, user, 500);
  } catch (err) {
    console.warn("AI unavailable for cover letter:", err.message);
    // Fallback — uses all sections
    return `Dear Hiring Manager,

I am ${resume.name}, a ${resume.title} with experience in ${resume.skills.slice(0, 3).join(", ")}. I am excited to apply for this position and believe my background makes me a strong candidate.

${
  resume.jobs[0]
    ? `In my role as ${resume.jobs[0].role} at ${resume.jobs[0].company}, I ${resume.jobs[0].bullets[0]?.toLowerCase() ?? "delivered impactful results"}.`
    : ""
} I have also built projects including ${resume.projects
      .slice(0, 2)
      .map((p) => p.name)
      .join(
        " and ",
      )}, and hold a ${resume.edu[0]?.degree ?? "degree"} from ${resume.edu[0]?.school ?? "university"}.

I would love the opportunity to bring my skills to your team. Thank you for your time and consideration.

Sincerely,
${resume.name}`;
  }
}
