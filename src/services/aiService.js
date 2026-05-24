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

  return callHuggingFace(system, user);
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

  return callHuggingFace(system, user);
}
