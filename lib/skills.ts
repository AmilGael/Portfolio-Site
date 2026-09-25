export type SkillGroup = {
  label: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "SQL", "PL/pgSQL"],
  },
  {
    label: "AI & ML",
    items: [
      "LLM integration (Anthropic, OpenAI, Gemini)",
      "Vision input (photo to product copy)",
      "RAG",
      "Vector search (pgvector)",
      "Agent workflows",
      "Agentic development (Claude Code)",
      "NLP",
    ],
  },
  {
    label: "Engineering",
    items: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "FastAPI",
      "Node.js",
      "REST APIs",
      "PostgreSQL",
      "Prisma",
      "zod",
      "Stripe Checkout",
      "i18n (next-intl)",
      "Offline-first (IndexedDB)",
      "PDF generation",
    ],
  },
  {
    label: "Delivery",
    items: [
      "Vitest",
      "GitHub Actions CI",
      "Docker",
      "Fly.io",
      "Netlify",
      "S3 / Cloudflare R2 presigned uploads",
      "Git",
      "Linux/CLI",
    ],
  },
  {
    label: "Security & Practice",
    items: [
      "OWASP Top 10",
      "STRIDE threat modeling",
      "Content Security Policy",
      "Auth.js / passwordless sign-in",
      "Client discovery",
      "Product requirements documents",
      "Bilingual product work (ES/EN)",
      "Responsive, mobile-first UI",
    ],
  },
];
