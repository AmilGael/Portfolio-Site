"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, TransitionEvent } from "react";
import type { Figure, Project } from "@/lib/projects";
import { relayout } from "@/lib/scrollcraft";

type Props = {
  projects: Project[];
};

type FigureValueProps = {
  figure: Figure;
  open: boolean;
};

export function motionIsReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollRowIntoPosition(
  row: HTMLLIElement,
  behavior: ScrollBehavior,
) {
  const rowTop = window.scrollY + row.getBoundingClientRect().top;
  window.scrollTo({ top: rowTop - window.innerHeight * 0.2, behavior });
}

export function FigureValue({ figure, open }: FigureValueProps) {
  const target = Number.parseInt(figure.value, 10);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!open) {
      setValue(0);
      return;
    }

    if (motionIsReduced()) {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 500, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };

    setValue(0);
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [open, target]);

  return (
    <span>
      <span className="tabular-nums text-[1.6rem] font-semibold text-text">
        {value}
      </span>{" "}
      <span className="caps text-[11.5px] text-muted">{figure.label}</span>
    </span>
  );
}

export default function BuildsList({ projects }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
  const rowRefs = useRef(new Map<string, HTMLLIElement>());

  const close = (id: string) => {
    setOpenId(null);
    window.history.replaceState(null, "", "#builds");
    window.dispatchEvent(new CustomEvent("archive:close", { detail: { id } }));
    relayout();
  };

  const open = (id: string, behavior: ScrollBehavior) => {
    setOpenId(id);
    window.history.replaceState(null, "", `#builds/${id}`);
    const row = rowRefs.current.get(id);
    if (row) scrollRowIntoPosition(row, behavior);
    window.dispatchEvent(new CustomEvent("archive:open", { detail: { id } }));
    relayout();
  };

  useEffect(() => {
    const match = window.location.hash.match(/^#builds\/([a-z0-9-]+)$/);
    const id = match?.[1];
    if (!id || !projects.some((project) => project.id === id)) return;

    setOpenId(id);
    window.dispatchEvent(new CustomEvent("archive:open", { detail: { id } }));
    relayout();
    const frame = window.requestAnimationFrame(() => {
      const row = rowRefs.current.get(id);
      if (row) scrollRowIntoPosition(row, "instant");
    });
    return () => window.cancelAnimationFrame(frame);
  }, [projects]);

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    id: string,
    index: number,
  ) => {
    let targetIndex: number | null = null;

    if (event.key === "ArrowDown") targetIndex = (index + 1) % projects.length;
    if (event.key === "ArrowUp") {
      targetIndex = (index - 1 + projects.length) % projects.length;
    }
    if (event.key === "Home") targetIndex = 0;
    if (event.key === "End") targetIndex = projects.length - 1;

    if (targetIndex !== null) {
      event.preventDefault();
      buttonRefs.current.get(projects[targetIndex].id)?.focus();
      return;
    }

    if (event.key === "Escape" && openId !== null) {
      event.preventDefault();
      const closingId = openId;
      close(closingId);
      buttonRefs.current.get(closingId)?.focus();
    }
  };

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) relayout();
  };

  return (
    <ol className="border-t border-rule" data-sc-in data-sc-stagger="60">
      {projects.map((project, index) => {
        const isOpen = openId === project.id;
        const displayIndex = `[${String(index + 1).padStart(2, "0")}]`;
        const linkTabIndex = isOpen ? undefined : -1;

        return (
          <li
            key={project.id}
            ref={(row) => {
              if (row) rowRefs.current.set(project.id, row);
              else rowRefs.current.delete(project.id);
            }}
            className="border-b border-rule"
          >
            <h3>
              <button
                ref={(button) => {
                  if (button) buttonRefs.current.set(project.id, button);
                  else buttonRefs.current.delete(project.id);
                }}
                type="button"
                id={`build-${project.id}-button`}
                aria-expanded={isOpen}
                aria-controls={`build-${project.id}-panel`}
                onClick={() => {
                  if (isOpen) close(project.id);
                  else open(project.id, motionIsReduced() ? "auto" : "smooth");
                }}
                onKeyDown={(event) => handleKeyDown(event, project.id, index)}
                className="grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 px-2 py-4 text-left transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:outline-none md:grid-cols-[2.5rem_1fr_6rem_8rem_5rem]"
              >
                <span
                  className={`text-[12px] ${
                    isOpen ? "text-signal" : "text-muted/70"
                  }`}
                >
                  {displayIndex}
                </span>
                <span className="text-[1.05rem] md:text-[1.15rem] font-semibold tracking-[-0.01em] text-text">
                  {isOpen && (
                    <span aria-hidden className="text-signal">
                      &gt;{" "}
                    </span>
                  )}
                  {project.name}
                </span>
                <span className="caps hidden text-[11.5px] text-muted md:block">
                  {project.year}
                </span>
                <span className="caps hidden text-[11.5px] text-muted md:block">
                  {project.status}
                </span>
                <span
                  className={`caps text-right text-[11.5px] ${
                    project.live ? "text-signal" : "text-muted/60"
                  }`}
                >
                  {project.live ? "live ↗" : "open"}
                </span>
              </button>
            </h3>

            <div
              id={`build-${project.id}-panel`}
              role="region"
              aria-labelledby={`build-${project.id}-button`}
              aria-hidden={!isOpen}
              className="build-panel"
              data-open={isOpen}
              onTransitionEnd={handleTransitionEnd}
            >
              <div>
                <div className="grid gap-x-8 gap-y-5 px-2 pb-8 pt-2 md:grid-cols-[9rem_1fr]">
                  <span className="caps text-[11.5px] text-muted pt-1">
                    What it does
                  </span>
                  <p className="text-[14.5px] leading-[1.75] text-text/90">
                    {project.what}
                  </p>

                  <span className="caps text-[11.5px] text-muted pt-1">
                    My part
                  </span>
                  <p className="text-[14.5px] leading-[1.75] text-text/90">
                    {project.role}
                  </p>

                  <span className="caps text-[11.5px] text-muted pt-1">
                    Stack
                  </span>
                  <p className="text-[14.5px] leading-[1.75] text-text/90">
                    {project.stack.join(" · ")}
                  </p>

                  <span className="caps text-[11.5px] text-muted pt-1">
                    Live
                  </span>
                  <p className="text-[14.5px] leading-[1.75] text-text/90">
                    {project.live ? (
                      <a
                        href={project.live.url}
                        className="signal-link"
                        target="_blank"
                        rel="noreferrer"
                        tabIndex={linkTabIndex}
                      >
                        {project.live.label} ↗
                      </a>
                    ) : (
                      <span className="text-muted">not deployed</span>
                    )}
                  </p>

                  <span className="caps text-[11.5px] text-muted pt-1">
                    Repo
                  </span>
                  <p className="text-[14.5px] leading-[1.75] text-text/90">
                    {project.repo === "private" ? (
                      <span className="text-muted">
                        private, available on request
                      </span>
                    ) : (
                      <a
                        href={project.repo.url}
                        className="signal-link"
                        target="_blank"
                        rel="noreferrer"
                        tabIndex={linkTabIndex}
                      >
                        {project.repo.label} ↗
                      </a>
                    )}
                  </p>

                  <span className="caps text-[11.5px] text-muted pt-1">
                    With
                  </span>
                  <p className="text-[14.5px] leading-[1.75] text-text/90">
                    {project.collaborators.length === 0 ? (
                      <span className="text-muted">solo</span>
                    ) : (
                      project.collaborators.map((person, personIndex) => (
                        <Fragment key={person.name}>
                          {personIndex > 0 && ", "}
                          {person.url ? (
                            <a
                              href={person.url}
                              className="signal-link"
                              target="_blank"
                              rel="noreferrer"
                              tabIndex={linkTabIndex}
                            >
                              {person.name} ↗
                            </a>
                          ) : (
                            person.name
                          )}
                        </Fragment>
                      ))
                    )}
                  </p>

                  {project.client && (
                    <>
                      <span className="caps text-[11.5px] text-muted pt-1">
                        Client
                      </span>
                      <p className="text-[14.5px] leading-[1.75] text-text/90">
                        {project.client}
                      </p>
                    </>
                  )}

                  {project.program && (
                    <>
                      <span className="caps text-[11.5px] text-muted pt-1">
                        Program
                      </span>
                      <p className="text-[14.5px] leading-[1.75] text-text/90">
                        {project.program}
                      </p>
                    </>
                  )}

                  {project.figures && (
                    <>
                      <span className="caps text-[11.5px] text-muted pt-1">
                        Figures
                      </span>
                      <div className="space-y-3 text-[14.5px] leading-[1.75] text-text/90">
                        {project.figures.map((figure) => (
                          <FigureValue
                            key={figure.label}
                            figure={figure}
                            open={isOpen}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
