import type { Project } from "@/lib/projects";
import Reveal from "./Reveal";

type Props = {
  project: Project;
  index: number;
};

export default function ProjectCard({ project, index }: Props) {
  const { name, logline, stack, status, year, detail, repo, live } = project;
  return (
    <Reveal delay={index * 60} className="h-full">
      <article
        tabIndex={0}
        className="project-card group relative h-full cursor-default border border-rule bg-transparent p-6 md:p-7 transition-colors duration-300 hover:bg-surface focus-visible:bg-surface focus-visible:outline-none"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-full w-[2px] origin-top scale-y-0 bg-signal transition-transform duration-500 ease-out group-hover:scale-y-100 group-focus-within:scale-y-100"
        />
        <h3 className="text-[1.25rem] md:text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-text">
          {name}
        </h3>
        <p className="mt-2 text-[14.5px] leading-snug text-text/80">{logline}</p>

        <div className="card-detail mt-0 text-[14.5px] leading-relaxed text-muted">
          <div className="card-detail-inner">
            <p className="pt-4">{detail}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-rule pt-4 text-[11.5px] text-muted caps">
          <Meta label="Stack" value={stack} />
          <Meta label="Status" value={status} />
          <Meta label="Year" value={year} />
        </div>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[11.5px] caps">
          {repo ? (
            <LinkRow label="Repo" href={repo.url} display={repo.label} />
          ) : (
            <span className="inline-flex items-baseline gap-1.5 italic text-rule">
              <span className="not-italic">Repo</span>
              <span className="normal-case tracking-normal">
                private, available on request
              </span>
            </span>
          )}
          {live && (
            <LinkRow label="Live" href={live.url} display={live.label} />
          )}
        </div>
      </article>
    </Reveal>
  );
}

function LinkRow({
  label,
  href,
  display,
}: {
  label: string;
  href: string;
  display: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="signal-link inline-flex items-baseline gap-1.5 text-muted hover:text-text"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="text-rule">{label}</span>
      <span className="normal-case tracking-normal">{display}</span>
      <span aria-hidden className="text-signal">
        ↗
      </span>
    </a>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-rule">{label}</span>
      <span className="text-text/70 normal-case tracking-normal">{value}</span>
    </div>
  );
}
