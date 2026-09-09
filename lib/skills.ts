export type SkillGroup = {
  label: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "SQL"],
  },
  {
    label: "AI & ML",
    items: [
      "LLM integration (Anthropic, OpenAI, Gemini)",
      "RAG",
      "Vector search (pgvector)",
      "Agent workflows",
      "NLP",
    ],
  },
  {
    label: "Engineering",
    items: [
      "FastAPI",
      "Node.js",
      "REST APIs",
      "PostgreSQL",
      "Prisma",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Git",
      "Linux/CLI",
    ],
  },
  {
    label: "Security & Practice",
    items: [
      "OWASP Top 10",
      "STRIDE threat modeling",
      "Client discovery",
      "Product requirements documents",
    ],
  },
];
