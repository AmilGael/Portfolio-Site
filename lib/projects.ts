export type ProjectLink = { url: string; label: string } | null;

export type Project = {
  name: string;
  logline: string;
  stack: string;
  status: string;
  year: string;
  detail: string;
  repo: ProjectLink;
  live?: ProjectLink;
};

export const projects: Project[] = [
  {
    name: "MatchPoint",
    logline:
      "Semantic search API. 500 resources, 1,200 entries, ranked by meaning.",
    stack: "Python · FastAPI · PostgreSQL · pgvector · OpenAI",
    status: "In Development",
    year: "2025",
    detail:
      "Built a semantic search API using OpenAI's text-embedding-3-small to rank resources by meaning. pgvector inside PostgreSQL handles vector similarity search across roughly 500 resources and 1,200 entries. Relational and vector data live in a single PostgreSQL database to keep the architecture simple; the API is exposed through a FastAPI REST layer.",
    repo: null,
  },
  {
    name: "Sentry",
    logline:
      "Case management platform for re-entry facilities, with signed QR movement passes.",
    stack: "Next.js · TypeScript · PostgreSQL · Prisma · Auth.js · HMAC-SHA256",
    status: "Shipped",
    year: "2025",
    detail:
      "Full-stack case management platform for residential re-entry facilities. Role-based access control across four staff roles (Admin, Case Manager, Employment Specialist, Front Desk) on PostgreSQL 15 and Prisma. Movement passes are cryptographically signed QR codes using HMAC-SHA256; failed signature verifications auto-generate incident reports so accountability survives shift changes.",
    repo: {
      url: "https://github.com/AmilGael/Sentry",
      label: "github.com/AmilGael/Sentry",
    },
  },
  {
    name: "MHS2",
    logline:
      "AI mental health support platform. Crisis detection and escalation.",
    stack: "React · TypeScript · Vite · TailwindCSS · Google Gemini API",
    status: "Shipped",
    year: "2025",
    detail:
      "AI mental health support platform integrating Google Gemini. Built the service layer that handles conversation state, AI response processing, and automated detection of high-risk signals, with escalation workflows that route sensitive conversations to appropriate human support channels.",
    repo: {
      url: "https://github.com/AmilGael/MHS2",
      label: "github.com/AmilGael/MHS2",
    },
  },
  {
    name: "Anchore",
    logline: "Immutable digital notary. Document hashes anchored on-chain.",
    stack: "Solidity · Python · Web3.py · Ethereum Sepolia",
    status: "Deployed · Sepolia",
    year: "2025",
    detail:
      "Solidity smart contracts record document hashes and credential metadata on-chain; a Python service using Web3.py manages all contract interaction and transaction submission. Deployed and tested on the Ethereum Sepolia testnet. Records can be verified without reliance on a central authority.",
    repo: null,
  },
];
