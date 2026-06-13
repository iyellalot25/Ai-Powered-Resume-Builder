// Add this import at the very top of aiService.js
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
async function callHuggingFace(systemPrompt, userPrompt) {
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
      max_tokens: 300,
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
  const system = `You are a professional resume writer. 
Write exactly 3 concise, impactful resume bullet points.
Each bullet starts with a strong action verb.
Use this format — return ONLY the 3 bullets, nothing else:
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
  const system = `You are a technical resume expert.
Suggest exactly 5 relevant technical skills to add.
Return ONLY a comma-separated list, nothing else.
Example: Docker, Kubernetes, FastAPI, Redis, PostgreSQL`;

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
  const system = `You are a professional resume writer.
Write exactly 3 concise, impactful resume bullet points for a project.
Each bullet starts with a strong action verb.
Focus on technical implementation, impact, and results.
Return ONLY the 3 bullets, nothing else:
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
  const system = `You are an ATS (Applicant Tracking System) expert.
Extract only the important, specific keywords from a job description.
Focus on: technical skills, programming languages, tools, frameworks, methodologies.
Ignore: generic words, company names, salary info, soft skills like "teamwork".
Return ONLY a comma-separated list of keywords, nothing else.
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
