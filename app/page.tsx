"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Reveal from "@/components/Reveal";
import EntryHeader from "@/components/EntryHeader";
import ProjectCard from "@/components/ProjectCard";
import AsciiArt from "@/components/AsciiArt";
import type { MenuItem } from "@/components/TerminalMenu";
import { projects } from "@/lib/projects";
import { skills } from "@/lib/skills";

type SectionMeta = {
  id: string;
  entry: string;
  status: string;
};

const SECTIONS: SectionMeta[] = [
  { id: "landing", entry: "00", status: "Receiving" },
  { id: "about", entry: "01", status: "Field Notes" },
  { id: "skills", entry: "02", status: "Calibration" },
  { id: "projects", entry: "03", status: "Catalog Access" },
  { id: "contact", entry: "04", status: "Open Channels" },
];

const TOTAL = String(SECTIONS.length - 1).padStart(2, "0");

const MENU: MenuItem[] = [
  { id: "about", label: "about me", href: "#about" },
  { id: "skills", label: "skills", href: "#skills" },
  { id: "projects", label: "my projects", href: "#projects" },
  { id: "contact", label: "contact me", href: "#contact" },
  { id: "resume", label: "resume.pdf", href: "/resume.pdf", download: true },
];

export default function Page() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio ||
              a.target.getBoundingClientRect().top -
                b.target.getBoundingClientRect().top,
          );
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const active = SECTIONS.find((s) => s.id === activeId) ?? SECTIONS[0];

  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <main className="relative min-h-screen">
      <Sidebar
        entry={active.entry}
        total={TOTAL}
        status={active.status}
        showIdentity={activeId !== "landing"}
        activeId={activeId}
        menu={MENU}
      />

      <div
        className="ml-0 pl-5 pr-5 pt-[72px] md:ml-[30%] md:pl-10 md:pr-10 md:pt-0 lg:pl-20 lg:pr-24"
        style={{ maxWidth: "min(100%, 980px)" }}
      >
        {/* ENTRY // 00 — LANDING */}
        <section
          id="landing"
          ref={setRef("landing")}
          className="flex min-h-[92vh] flex-col justify-center border-b border-signal/30 py-24"
        >
          <Reveal>
            <div className="caps text-[12px] text-muted">
              <span className="text-signal">ENTRY</span>
              <span className="mx-2 text-rule">//</span>
              <span>00</span>
              <span className="mx-2 text-rule">//</span>
              <span>Signal Acquired</span>
            </div>
          </Reveal>
          <div className="mt-10 overflow-x-auto pb-2">
            <AsciiArt />
          </div>
          <Reveal delay={300}>
            <p className="mt-12 max-w-[52ch] text-[clamp(1.1rem,1.9vw,1.35rem)] leading-[1.55] text-text/90">
              <span className="text-rule">{"> "}</span>
              All defeat is{" "}
              <span className="text-signal">psychological</span> until death.
            </p>
          </Reveal>
          <Reveal delay={380}>
            <p className="mt-10 max-w-xl text-[15.5px] leading-[1.85] text-muted">
              Engineer, writer, operator. Building systems for the people
              institutions overlook.
            </p>
          </Reveal>
          <Reveal delay={460}>
            <a
              href="#about"
              className="signal-link mt-14 inline-flex items-center gap-3 caps text-[12px]"
            >
              <span>Begin Transmission</span>
              <span aria-hidden className="text-signal">
                ↓
              </span>
            </a>
          </Reveal>
        </section>

        {/* ENTRY // 01 — ABOUT ME */}
        <section
          id="about"
          ref={setRef("about")}
          className="border-b border-signal/30 py-28 md:py-36"
        >
          <EntryHeader
            entry="01"
            title="About Me"
            subhead="Field notes — who is on the other end of this line."
          />
          <div className="max-w-[62ch] space-y-6 text-[15.5px] leading-[1.85] text-text/90">
            <Reveal>
              <p>
                I am an AI-Native Software Engineering Fellow at{" "}
                <span className="text-signal">Pursuit</span>, embedded in the
                cohort team{" "}
                <span className="italic text-text">Dark Launch</span>. The work
                is deliberately small and deliberately useful — systems that
                earn their place.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <p>
                Before the fellowship I ran operations in high-volume
                healthcare and fitness — the kind of environments where triage
                is a lifestyle and inefficiency costs people their afternoons,
                their paychecks, or worse. I build software the same way:
                pragmatic, load-bearing, quiet.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <p>
                My stack tilts toward the backend — Python, FastAPI,
                PostgreSQL, TypeScript — with detours into Solidity when the
                problem demands a ledger. The throughline is infrastructure
                for people institutions tend to overlook.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ENTRY // 02 — SKILLS */}
        <section
          id="skills"
          ref={setRef("skills")}
          className="border-b border-signal/30 py-28 md:py-36"
        >
          <EntryHeader
            entry="02"
            title="Skills"
            subhead="Calibration — what I reach for when the pressure is on."
          />
          <div className="space-y-5">
            {skills.map((group) => (
              <Reveal key={group.label}>
                <div className="grid grid-cols-1 items-baseline gap-1 border-b border-rule pb-4 sm:grid-cols-[10rem_1fr] sm:gap-6 sm:border-b-0 sm:pb-0 md:grid-cols-[12rem_1fr] md:gap-8">
                  <span className="caps text-[12px] tracking-[0.12em] text-signal">
                    {group.label}
                  </span>
                  <div className="text-[15px] leading-[1.9] text-text/85">
                    {group.items.map((item, i) => (
                      <Fragment key={item}>
                        {i > 0 && (
                          <span
                            aria-hidden
                            className="mx-2 text-rule"
                          >
                            ·
                          </span>
                        )}
                        <span className="whitespace-nowrap">{item}</span>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ENTRY // 03 — MY PROJECTS */}
        <section
          id="projects"
          ref={setRef("projects")}
          className="border-b border-signal/30 py-28 md:py-36"
        >
          <EntryHeader
            entry="03"
            title="My Projects"
            subhead={`Catalog — ${projects.length.toString().padStart(2, "0")} entries · hover to open file.`}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {projects.map((project, i) => (
              <ProjectCard key={project.name} project={project} index={i} />
            ))}
          </div>
        </section>

        {/* ENTRY // 04 — CONTACT ME */}
        <section
          id="contact"
          ref={setRef("contact")}
          className="py-28 md:py-36"
        >
          <EntryHeader
            entry="04"
            title="Contact Me"
            subhead="Open channels — no form, just a line."
          />
          <ul className="space-y-5">
            <ContactRow
              label="GitHub"
              href="https://github.com/AmilGael"
              display="github.com/AmilGael"
            />
            <ContactRow
              label="LinkedIn"
              href="https://www.linkedin.com/in/gamaliel-leguista-725958191/"
              display="linkedin.com/in/gamaliel-leguista"
            />
            <ContactRow
              label="Resume"
              href="/resume.pdf"
              display="download resume.pdf ↓"
              download
            />
          </ul>
        </section>

        <footer className="border-t border-rule py-10">
          <p className="caps text-[11px] text-rule">
            <span>Archive</span>
            <span className="mx-2">//</span>
            <span>NYC</span>
            <span className="mx-2">//</span>
            <span>{new Date().getFullYear()}</span>
          </p>
        </footer>
      </div>
    </main>
  );
}

function ContactRow({
  label,
  href,
  display,
  download,
}: {
  label: string;
  href: string;
  display: string;
  download?: boolean;
}) {
  const external = href.startsWith("http");
  return (
    <li>
      <Reveal>
        <div className="grid grid-cols-[5.5rem_auto_1fr] items-baseline gap-4 md:grid-cols-[7rem_auto_1fr] md:gap-6">
          <span className="caps text-[12px] text-muted">{label}</span>
          <span aria-hidden className="text-rule">
            →
          </span>
          <a
            href={href}
            className="signal-link text-[15px]"
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            download={download || undefined}
          >
            {display}
          </a>
        </div>
      </Reveal>
    </li>
  );
}
