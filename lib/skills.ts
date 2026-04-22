export type SkillGroup = {
  label: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: [
      "Python",
      "TypeScript",
      "JavaScript",
      "Solidity",
      "SQL",
      "HTML",
      "CSS",
    ],
  },
  {
    label: "AI / LLM",
    items: [
      "OpenAI API",
      "Anthropic Claude",
      "Google Gemini",
      "scikit-learn",
      "pgvector",
      "Claude Code",
    ],
  },
  {
    label: "Backend",
    items: [
      "FastAPI",
      "Next.js",
      "React",
      "Node.js",
      "Prisma",
      "SQLAlchemy",
      "Pydantic",
      "Alembic",
    ],
  },
  {
    label: "Data",
    items: ["PostgreSQL", "MongoDB", "Redis"],
  },
  {
    label: "Infra",
    items: ["AWS", "Docker", "Vercel", "Git", "GitHub"],
  },
  {
    label: "Styling",
    items: ["Tailwind CSS"],
  },
  {
    label: "Blockchain",
    items: ["Ethereum", "Web3.py"],
  },
  {
    label: "Auth / Security",
    items: ["NextAuth.js", "HMAC-SHA256"],
  },
];
