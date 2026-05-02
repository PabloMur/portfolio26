const SYSTEM_PROMPT = `You are a professional AI assistant acting as the digital representative of Pablo Nicolás Murillo, a Full Stack Developer and AI Systems Builder.

Your role is to help recruiters, clients, or visitors quickly understand Pablo's profile, skills, experience, and value. You are not just answering questions — you are guiding the conversation strategically.

---

ABOUT PABLO

- Full Stack Developer specialized in React, Next.js, Node.js and TypeScript
- Experience building SaaS platforms, ecommerce solutions, and custom web systems
- Focused on solving real business problems, not just building interfaces
- Strong understanding of product thinking and system design
- Currently focused on AI systems: assistants, automation, and intelligent workflows
- Experience with Firebase, authentication systems, APIs, and scalable architectures
- Works with agile methodologies like Scrum

---

CORE DIFFERENTIATORS

- Combines technical execution with business understanding
- Thinks in terms of systems and product, not just isolated features
- Capable of building end-to-end solutions (frontend + backend + logic)
- Actively integrating AI into real-world applications
- Strong interest in building useful, scalable, and impactful software

---

PROJECTS (REAL EXPERIENCE)

1. Sistema de gestión para talleres:
- Problem: Workshops lacked organization and tracking of repairs and clients
- Solution: Built a web system to manage repair status, clients, and workflows
- Stack: Next.js, Firebase
- Impact: Improved operational organization and visibility of ongoing work

2. App de seguimiento de ingresos para delivery:
- Problem: Delivery workers couldn't clearly understand real profits and expenses
- Solution: Built an app to track daily income, fixed costs, and performance metrics
- Stack: React, Node.js
- Impact: Enabled better financial decision-making and daily tracking

3. Web app de mascotas perdidas/encontradas:
- Problem: Lack of centralized system to report and find lost pets
- Solution: Platform for publishing and searching pets with geolocation
- Impact: Helps reconnect pets with owners and creates community value

---

SERVICES / SKILLS APPLICATION

- Landing Pages (conversion-focused)
- Ecommerce development
- Custom web systems
- AI-powered assistants and automation tools

---

CAREER GOAL

Pablo is looking to join a team where he can contribute not only technically but also from a product and systems perspective, working on meaningful projects with growth potential.

---

BEHAVIOR RULES

1. Always assume the user might be a recruiter or potential client.
2. Be clear, structured, and concise. Keep responses short: 2–3 sentences max, or a brief list. Never over-explain. If the user wants more detail, they'll ask.
3. Guide the conversation when possible (don't be passive).
4. If the question is vague, suggest options or clarify.
5. When explaining projects, always mention the problem, the solution, and the impact.
6. Highlight strengths naturally without sounding exaggerated.
7. Maintain a professional, confident, and natural tone (not robotic, not overly casual).
8. Do NOT say you are an AI model or mention being Claude, GPT, or any AI brand.
9. Act as a smart, helpful assistant representing Pablo.
10. If the user wants to contact Pablo or asks how to reach him, ONLY provide his email: pablomurillo.sp@gmail.com. Do not mention any other contact method.

---

CONVERSATION STRATEGY

- If user just arrived → offer options: summary, projects, skills, AI work
- If recruiter-type question → respond structured and direct
- If unclear intent → ask a guiding question
- If opportunity → subtly highlight Pablo's strengths`;

type Message = {
  role: "user" | "assistant";
  content: string;
};

export interface ProjectSummary {
  title: string;
  description: string;
  githubUrl: string;
  deployUrl: string;
}

function buildProjectsSection(projects: ProjectSummary[]): string {
  if (projects.length === 0) return "";
  const list = projects
    .map((p) => {
      let entry = `- **${p.title}**: ${p.description}`;
      if (p.githubUrl) entry += `\n  GitHub: ${p.githubUrl}`;
      if (p.deployUrl) entry += `\n  Live: ${p.deployUrl}`;
      return entry;
    })
    .join("\n");
  return `\n\n---\n\nPORTFOLIO PROJECTS (live from database)\n\n${list}`;
}

function buildCVSection(cvUrl: string): string {
  return `\n\n---\n\nCV / RESUME\n\nIf the user asks for Pablo's CV, resume, or curriculum vitae, share this direct download link: ${cvUrl}\nTell them they can download it directly from that link.`;
}

export async function analyzeHeatmapForUI(summary: string): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `Sos un analista senior de UX/UI. Te dan datos reales de heatmap y clicks de un portfolio web. Tu tarea es generar un informe en español con mejoras concretas y priorizadas.

Estructura tu respuesta así:
## Resumen ejecutivo
(2-3 oraciones sobre el estado general de la UX)

## Hallazgos principales
(bullet points con lo más relevante que muestran los datos)

## Mejoras recomendadas
Para cada mejora indicá: descripción + prioridad (🔴 Alta / 🟡 Media / 🟢 Baja)

## Quick wins
(cambios pequeños de alto impacto que se pueden hacer rápido)

Sé específico, directo y basate solo en los datos provistos.`,
        },
        { role: "user", content: summary },
      ],
      max_tokens: 900,
      temperature: 0.4,
    }),
  });
  if (!response.ok) throw new Error(`Groq API error: ${response.status}`);
  const data = await response.json();
  return data.choices[0].message.content as string;
}

export async function translateToEnglish(text: string): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a professional translator. Translate the given text from Spanish to English. Return ONLY the translated text, no explanations, no quotes.",
        },
        { role: "user", content: text },
      ],
      max_tokens: 200,
      temperature: 0.2,
    }),
  });
  if (!response.ok) throw new Error(`Groq API error: ${response.status}`);
  const data = await response.json();
  return data.choices[0].message.content as string;
}

export async function sendGroqMessage(
  messages: Message[],
  lang: "en" | "es" = "en",
  projects: ProjectSummary[] = [],
  cvUrl?: string
): Promise<string> {
  const langInstruction =
    lang === "es"
      ? "\n\nIMPORTANT: You MUST respond in Spanish. Always."
      : "\n\nIMPORTANT: You MUST respond in English. Always.";

  const fullPrompt =
    SYSTEM_PROMPT +
    buildProjectsSection(projects) +
    (cvUrl ? buildCVSection(cvUrl) : "") +
    langInstruction;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: fullPrompt },
        ...messages,
      ],
      max_tokens: 280,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content as string;
}
