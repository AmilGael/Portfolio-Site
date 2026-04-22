export type Project = {
  name: string;
  logline: string;
  stack: string;
  status: string;
  year: string;
  detail: string;
};

export const projects: Project[] = [
  {
    name: "Anchore",
    logline: "Blockchain document verification backend on Ethereum testnet.",
    stack: "Solidity · Web3.py · FastAPI",
    status: "Shipped",
    year: "2025",
    detail:
      "Co-built the backend and Solidity notary contract that seals SHA-256 document fingerprints into an Ethereum-compatible ledger. The API takes an arbitrary file, computes its hash off-chain, and anchors the digest on-chain — producing an immutable receipt that outlives any institution's filing cabinet.",
  },
  {
    name: "Semantic Search Engine",
    logline: "pgvector-backed retrieval using AI embeddings.",
    stack: "Python · PostgreSQL · pgvector · OpenAI",
    status: "Internal",
    year: "2025",
    detail:
      "A retrieval system that understands intent rather than keywords. OpenAI embeddings persisted in Postgres through pgvector, with cosine-similarity search over arbitrary document corpora. Built to make production-grade RAG infrastructure legible to engineers without an ML background.",
  },
  {
    name: "NLP Support Classifier",
    logline: "Ticket triage pipeline — 87% accuracy.",
    stack: "Python · scikit-learn",
    status: "Shipped",
    year: "2024",
    detail:
      "A disciplined scikit-learn pipeline that routes inbound support tickets into categories at 87% accuracy. TF-IDF features, logistic regression baseline, careful class balancing. A small reminder of how much ground classical NLP still covers before reaching for a transformer.",
  },
  {
    name: "Healthcare Agent",
    logline: "Multi-step AI workflow — two hours to under five minutes.",
    stack: "OpenAI · Anthropic Claude · FastAPI",
    status: "In production",
    year: "2025",
    detail:
      "A multi-step agent that replaces a two-hour manual intake process with under five minutes of guided conversation. Orchestrates OpenAI and Anthropic models behind a FastAPI service, with structured-output validation and human-in-the-loop escalation wired directly into the graph.",
  },
  {
    name: "Cal.com Round Robin Indicator",
    logline: "Open-source contribution — fairness signal for team schedulers.",
    stack: "TypeScript · React",
    status: "Merged",
    year: "2025",
    detail:
      "An amber indicator on team avatars that surfaces when round-robin booking has drifted out of balance. Lets managers see scheduling inequity at a glance without cracking open the data. Merged upstream into the Cal.com open-source scheduler.",
  },
];
