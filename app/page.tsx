"use client";

import { Fragment, useCallback, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Reveal from "@/components/Reveal";
import EntryHeader from "@/components/EntryHeader";
import ProjectCard from "@/components/ProjectCard";
import AsciiArt from "@/components/AsciiArt";
import TerminalMenu, { type MenuItem } from "@/components/TerminalMenu";
import BinaryBackground from "@/components/BinaryBackground";
import { projects } from "@/lib/projects";
import { skills } from "@/lib/skills";

type ViewId =
  | "landing"
  | "about"
  | "skills"
  | "projects"
  | "contact"
  | "resume";

const VIEW_META: Record<ViewId, { entry: string; status: string }> = {
  landing: { entry: "00", status: "Receiving" },
  about: { entry: "01", status: "Field Notes" },
  skills: { entry: "02", status: "Calibration" },
  projects: { entry: "03", status: "Catalog Access" },
  contact: { entry: "04", status: "Open Channels" },
  resume: { entry: "05", status: "Dossier" },
};

const TOTAL = "05";

const MENU: MenuItem[] = [
  { id: "about", label: "about me" },
  { id: "skills", label: "skills" },
  { id: "projects", label: "my projects" },
  { id: "contact", label: "contact me" },
  { id: "resume", label: "resume.pdf" },
];

export default function Page() {
  const [view, setView] = useState<ViewId>("landing");

  const onNav = useCallback((id: string) => {
    if (id in VIEW_META) {
      setView(id as ViewId);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      }
    }
  }, []);

  const meta = VIEW_META[view];

  return (
    <main className="relative min-h-screen">
      <BinaryBackground />

      <Sidebar
        entry={meta.entry}
        total={TOTAL}
        status={meta.status}
        view={view}
        menu={MENU}
        onNav={onNav}
      />

      <div
        className="relative z-10 ml-0 pl-5 pr-5 pt-[104px] md:ml-[30%] md:pl-10 md:pr-10 md:pt-0 lg:pl-20 lg:pr-24"
        style={{ maxWidth: "min(100%, 1000px)" }}
      >
        <div
          key={view}
          className="view-fade flex min-h-[calc(100dvh-104px)] flex-col justify-center py-8 md:min-h-screen md:py-14"
        >
          {view === "landing" && <LandingView onNav={onNav} />}
          {view === "about" && <AboutView />}
          {view === "skills" && <SkillsView />}
          {view === "projects" && <ProjectsView />}
          {view === "contact" && <ContactView />}
          {view === "resume" && <ResumeView />}
        </div>
      </div>
    </main>
  );
}

function LandingView({ onNav }: { onNav: (id: string) => void }) {
  return (
    <>
      <Reveal>
        <div className="caps text-[12px] text-muted">
          <span className="text-signal">ENTRY</span>
          <span className="mx-2 text-rule">//</span>
          <span>00</span>
          <span className="mx-2 text-rule">//</span>
          <span>Signal Acquired</span>
        </div>
      </Reveal>

      <div className="mt-8 overflow-x-auto pb-2">
        <AsciiArt />
      </div>

      <Reveal delay={260}>
        <div className="mt-10">
          <TerminalMenu
            items={MENU}
            activeId=""
            onSelect={onNav}
            variant="hero"
          />
        </div>
      </Reveal>

      <Reveal delay={500}>
        <p className="mt-10 max-w-xl text-[15.5px] leading-[1.85] text-muted">
          Engineer, writer, operator. Building systems for the people
          institutions overlook.
        </p>
      </Reveal>
    </>
  );
}

function AboutView() {
  return (
    <>
      <EntryHeader
        entry="01"
        title="About Me"
        subhead="Field notes. Who is on the other end of this line."
      />
      <div className="max-w-[62ch] space-y-5 text-[15.5px] leading-[1.8] text-text/90">
        <Reveal>
          <p>
            Backend engineer.{" "}
            <span className="text-signal">
              Intelligence layer by design, not retrofit.
            </span>
          </p>
        </Reveal>
        <Reveal delay={80}>
          <p>
            I build systems for people the default ones overlook: a case
            management platform for residential re-entry, a mental health
            support tool with escalation paths for the moments that matter, a
            matching engine for community resources that usually sit one query
            away from the people who need them.
          </p>
        </Reveal>
        <Reveal delay={160}>
          <p>
            My path ran through high-volume healthcare and fitness operations,
            where triage is a lifestyle and inefficiency costs people their
            afternoons or their paychecks. I left that world on purpose, took
            the pay cut, and joined{" "}
            <span className="text-signal">Pursuit&apos;s</span> AI-Native
            fellowship to build the systems I&apos;d spent years working
            around.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <p>
            Stack tilts backend: Python, FastAPI, PostgreSQL, TypeScript, with
            detours into Solidity when the problem demands a ledger.
          </p>
        </Reveal>
      </div>
    </>
  );
}

function SkillsView() {
  return (
    <>
      <EntryHeader
        entry="02"
        title="Skills"
        subhead="Calibration. What I reach for when the pressure is on."
      />
      <div className="space-y-3">
        {skills.map((group) => (
          <Reveal key={group.label}>
            <div className="grid grid-cols-1 items-baseline gap-1 sm:grid-cols-[10rem_1fr] sm:gap-6 md:grid-cols-[12rem_1fr] md:gap-8">
              <span className="caps text-[12px] tracking-[0.12em] text-signal">
                {group.label}
              </span>
              <div className="text-[14.5px] leading-[1.85] text-text/85">
                {group.items.map((item, i) => (
                  <Fragment key={item}>
                    {i > 0 && (
                      <span aria-hidden className="mx-2 text-rule">
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
    </>
  );
}

function ProjectsView() {
  return (
    <>
      <EntryHeader
        entry="03"
        title="My Projects"
        subhead={`Catalog. ${projects.length
          .toString()
          .padStart(2, "0")} entries · hover to open file.`}
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {projects.map((project, i) => (
          <ProjectCard key={project.name} project={project} index={i} />
        ))}
      </div>
    </>
  );
}

function ContactView() {
  return (
    <>
      <EntryHeader
        entry="04"
        title="Contact Me"
        subhead="Open channels. No form, just a line."
      />
      <ul className="space-y-4">
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
      </ul>
    </>
  );
}

function ResumeView() {
  return (
    <>
      <EntryHeader
        entry="05"
        title="Resume"
        subhead="Dossier. View in place, no download prompt."
      />
      <div className="relative w-full border border-rule">
        <span
          aria-hidden
          className="caps absolute left-4 top-0 -translate-y-1/2 bg-bg px-2 text-[10.5px] tracking-[0.16em] text-signal"
        >
          ── RESUME.PDF ──
        </span>
        <iframe
          src="/resume.pdf#view=FitH&toolbar=0&navpanes=0"
          title="Gamaliel Leguista Resume"
          className="block h-[calc(100vh-16rem)] min-h-[560px] w-full bg-surface"
        />
      </div>
    </>
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
