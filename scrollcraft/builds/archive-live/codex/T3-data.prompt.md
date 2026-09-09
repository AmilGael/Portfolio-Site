# T3-data: replace the project and skills data modules

Read `CLAUDE.md` first. Strict TypeScript, `type` aliases, named exports for types, no `any`, no comments that describe what the code does. Do NOT commit. Do NOT touch files outside this list.

## Files

- `lib/projects.ts` (rewrite entirely)
- `lib/skills.ts` (rewrite entirely)
- `README.md` (replace the `## Projects` section and the title/intro lines; keep the `## Contact` section)

Other files still import `projects` and `Project` from `lib/projects.ts` and `skills` from `lib/skills.ts`; those consumers are being rewritten in a later task, so `npx tsc --noEmit` may report errors in `components/ProjectCard.tsx` and `app/page.tsx` after your change. That is expected. Your acceptance check is that `lib/projects.ts` and `lib/skills.ts` themselves have no type errors: run `npx tsc --noEmit 2>&1 | grep -E "^lib/"` and expect no output.

## `lib/projects.ts`

Exact types:

```ts
export type Link = { url: string; label: string };
export type Person = { name: string; url?: string };
export type Figure = { value: string; label: string };

export type Project = {
  id: string;
  name: string;
  year: string;
  status: string;
  logline: string;
  what: string;
  role: string;
  stack: string[];
  live: Link | null;
  repo: Link | "private";
  collaborators: Person[];
  client?: string;
  program?: string;
  figures?: Figure[];
};

export const projects: Project[] = [ /* five entries, in this order */ ];
```

Transcribe the following five entries EXACTLY (copy text verbatim, including punctuation; do not paraphrase, do not add fields, do not add numbers that are not here).

### 1. id `vantage`
- name: `Vantage · Executive Intelligence`
- year: `2026`
- status: `Delivered`
- logline: `Executive search for private equity. Plain-language queries return AI-ranked, fit-scored healthcare executives.`
- what: `An enterprise AI platform delivered to Assured Healthcare Partners. Private equity users ask in plain language; the system retrieves, classifies and ranks healthcare executives with a fit score, layered over Thrive TRM as the client's system of record rather than replacing it. Demoed live to Blackstone's investment team.`
- role: `Owned the full UI/UX layer from architecture to the live demo. Designed and integrated the multi-step LLM workflows behind candidate search, classification and ranking, and defined the fit-scoring criteria with the backend engineer. Named the product and set design direction from competitive research on the executive search landscape. One of three engineers in direct contact with client stakeholders.`
- stack: `["React", "TypeScript", "Tailwind CSS", "FastAPI", "LLM integration", "Thrive TRM"]`
- live: `{ url: "https://vantage-demo.onrender.com/", label: "vantage-demo.onrender.com" }`
- repo: `"private"`
- collaborators: `[{ name: "lltchen", url: "https://github.com/lltchen" }, { name: "KevinNatera", url: "https://github.com/KevinNatera" }]`
- client: `Assured Healthcare Partners`
- program: `Pursuit AI-Native & Cybersecurity Fellowship`
- figures: `[{ value: "3", label: "engineers, one product team" }]`

### 2. id `raphel`
- name: `Raphel`
- year: `2026`
- status: `Live`
- logline: `The black box for a construction site. Every entry is chained to the one before it, so any alteration is detectable.`
- what: `A tamper-evident construction documentation platform for the Dominican Republic. Field entries are cryptographically linked by SHA-256 hash chaining and timestamped server-side, so the site log stands as evidence under Dominican Law 126-02. Designed offline-first for basements and dead zones, behind an interface built for non-technical site personnel.`
- role: `Co-authored the product requirements document with Victor Manuel Acevedo, then built the platform: the Next.js interface for site residents and supervisors, the PostgreSQL schema, and the SHA-256 hash-chained record store.`
- stack: `["Next.js", "TypeScript", "PostgreSQL", "PL/pgSQL", "SHA-256 hash chaining"]`
- live: `{ url: "https://www.raphel360.com/", label: "raphel360.com" }`
- repo: `"private"`
- collaborators: `[{ name: "Victor Manuel Acevedo" }]`
- (no client, no program, no figures)

### 3. id `daysi`
- name: `Daysi Collection`
- year: `2026`
- status: `Live`
- logline: `A bilingual atelier site for the Bronx. Custom garments, alterations at published prices, a back office the owner controls.`
- what: `The website and client workflow tools for Daysi Fernández's atelier: a filterable collection with fixed prices, an alterations price list, an estimate builder, appointments against real availability, a request flow that reaches the owner with everything she needs, and a passwordless back office for orders, sessions and the books. Spanish first, English second, and architected for client ownership on accounts the business controls, with no recurring platform fees.`
- role: `Solo, end to end. Led bilingual client discovery on site, authored the product requirements document across three revisions, and built the whole thing: one price list that every page resolves to, server-side pricing, Stripe Checkout, the Google Business Profile integration, and the office.`
- stack: `["Next.js", "TypeScript", "next-intl", "Stripe Checkout", "zod"]`
- live: `{ url: "https://daysiscollectioninc.com/", label: "daysiscollectioninc.com" }`
- repo: `{ url: "https://github.com/AmilGael/Daysi-Collection-Website-", label: "github.com/AmilGael/Daysi-Collection-Website-" }`
- collaborators: `[]`
- client: `Daysi Collection Inc.`
- program: `Google SMB Program (Hispanic Federation), Pursuit`
- figures: `[{ value: "10", label: "builders selected, program-wide" }]`

### 4. id `sentry`
- name: `Sentry`
- year: `2025`
- status: `Shipped`
- logline: `Case management for re-entry facilities. Paper movement passes replaced by signed QR codes.`
- what: `A web-based case management system for residential re-entry facilities. Digitizes employment authorization workflows, issues movement passes as HMAC-SHA256-signed QR codes, and gives the front desk a real-time scan-and-verify view. Failed signature checks auto-generate incident reports, so accountability survives shift changes. Role-based access across Admin, Case Manager, Employment Specialist and Front Desk.`
- role: `Built the resident and employment authorization workflows, designed the Prisma schema for residents, passes and incidents, implemented the HMAC-signed QR pass generation, and built the front desk scan/verify flow.`
- stack: `["Next.js", "TypeScript", "PostgreSQL", "Prisma", "NextAuth.js", "Tailwind CSS", "HMAC-SHA256"]`
- live: `null`
- repo: `{ url: "https://github.com/AmilGael/Sentry", label: "github.com/AmilGael/Sentry" }`
- collaborators: `[{ name: "Jawad5C", url: "https://github.com/Jawad5C" }]`
- (no client, no program, no figures)

### 5. id `twenty`
- name: `Twenty CRM · i18n restoration`
- year: `2026`
- status: `Merged upstream`
- logline: `Hardcoded English strings were bypassing the translation system. One fix restored coverage across 27 languages.`
- what: `Twenty is an open-source CRM. Settings screens carried hardcoded English strings that never reached the translation layer, so every non-English locale showed English in those spots. The fix routes the strings through the i18n system and restores coverage across all 27 supported languages, platform-wide.`
- role: `Traced the strings that bypassed translation, wrote the fix, and carried it through review to merge on 11 June 2026.`
- stack: `["TypeScript", "React", "i18n"]`
- live: `null`
- repo: `{ url: "https://github.com/twentyhq/twenty/pull/21424", label: "twentyhq/twenty #21424" }`
- collaborators: `[]`
- figures: `[{ value: "27", label: "languages restored" }]`

## `lib/skills.ts`

Keep the existing `SkillGroup` type (`{ label: string; items: string[] }`). Replace the array with exactly these four groups, in this order:

1. `Languages`: `Python`, `TypeScript`, `JavaScript`, `SQL`
2. `AI & ML`: `LLM integration (Anthropic, OpenAI, Gemini)`, `RAG`, `Vector search (pgvector)`, `Agent workflows`, `NLP`
3. `Engineering`: `FastAPI`, `Node.js`, `REST APIs`, `PostgreSQL`, `Prisma`, `React`, `Next.js`, `Tailwind CSS`, `Git`, `Linux/CLI`
4. `Security & Practice`: `OWASP Top 10`, `STRIDE threat modeling`, `Client discovery`, `Product requirements documents`

## `README.md`

Replace everything above `## Contact` with:

```
# Gamaliel Leguista · AI Engineer · Full-Stack Developer

AI engineer and full-stack developer who takes client-facing products end to end, from discovery and requirements through production interface and live client demo. Bronx, NY. Bilingual (English/Spanish).

Portfolio source: Next.js 14 static export, deployed to Netlify. See `CLAUDE.md` for the working rules.

GitHub: [@AmilGael](https://github.com/AmilGael)

---

## Builds
```

followed by one `###` block per project in the order above, each with the `logline` as the first paragraph, then bullet lines `- **Stack:**` (stack joined with ` · `), `- **Live:**` (URL, or omit the line when `live` is null), `- **Repo:**` (URL, or `private, available on request`), `- **With:**` (collaborator names joined with `, `; omit the line when empty). Use `·` and periods; never an em dash in the README body.

Keep the existing `## Contact` section as is.

## Acceptance

- `npx tsc --noEmit 2>&1 | grep -E "^lib/"` prints nothing.
- `npm run lint` reports no errors originating in `lib/`.
- `git status --short` shows only `lib/projects.ts`, `lib/skills.ts`, `README.md`.
- Finish with a short list of what changed and the command results. No prose beyond that.
