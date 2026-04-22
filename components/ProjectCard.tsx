import type { Project } from "@/lib/projects";
import Reveal from "./Reveal";

type Props = {
  project: Project;
  index: number;
};

export default function ProjectCard({ project, index }: Props) {
  const { name, logline, stack, status, year, detail } = project;
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
      </article>
    </Reveal>
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
