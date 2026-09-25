"use client";

import type React from "react";
import AsciiArt from "@/components/AsciiArt";
import BinaryBackground from "@/components/BinaryBackground";
import BuildsList from "@/components/BuildsList";
import Portrait from "@/components/Portrait";
import Prompt from "@/components/Prompt";
import Sidebar from "@/components/Sidebar";
import type { MenuItem } from "@/components/TerminalMenu";
import { assetPath } from "@/lib/paths";
import { projects } from "@/lib/projects";
import { skills } from "@/lib/skills";

const MENU: MenuItem[] = [
  { id: "identity", label: "identity" },
  { id: "builds", label: "builds" },
  { id: "profile", label: "profile" },
  { id: "stack", label: "stack" },
  { id: "contact", label: "contact" },
];

type ContactRowProps = {
  label: string;
  href: string;
  display: string;
  newTab?: boolean;
};

function ContactRow({
  label,
  href,
  display,
  newTab = false,
}: ContactRowProps) {
  const opensNewTab = href.startsWith("http") || newTab;

  return (
    <li>
      <div className="grid grid-cols-[5.5rem_auto_1fr] items-baseline gap-4 md:grid-cols-[7rem_auto_1fr] md:gap-6">
        <span className="caps text-[12px] text-muted">{label}</span>
        <span aria-hidden className="text-muted">
          →
        </span>
        <a
          href={href}
          className="signal-link text-[15px]"
          target={opensNewTab ? "_blank" : undefined}
          rel={opensNewTab ? "noreferrer" : undefined}
        >
          {display}
        </a>
      </div>
    </li>
  );
}

export default function Page() {
  return (
    <>
      <BinaryBackground />
      <Sidebar menu={MENU} />
      <main className="relative z-10 md:ml-[30%]">
        <section id="identity" data-sc-act="pin" data-sc-span="2.0">
          <div data-sc-stage>
            <div className="flex h-full flex-col justify-center pt-[104px] md:pt-0 px-5 md:px-10 lg:px-20">
              <h1 className="sr-only">Gamaliel Leguista</h1>
              <div data-sc-cue="0 1 0 0.06" className="overflow-x-auto pb-2">
                <AsciiArt />
              </div>
              <div className="md:hidden">
                <Portrait className="mt-6 w-[160px]" />
              </div>
              <dl className="mt-10 space-y-4 max-w-xl">
                <div
                  data-sc-cue="0.08 1 0.08 0.06"
                  className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4"
                >
                  <dt className="caps text-[12px] text-muted">&gt; whoami</dt>
                  <dd className="text-[15.5px] leading-[1.6] text-text">
                    AI Engineer · Full-Stack Developer
                  </dd>
                </div>
                <div
                  data-sc-cue="0.24 1 0.08 0.06"
                  className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4"
                >
                  <dt className="caps text-[12px] text-muted">&gt; locale</dt>
                  <dd className="text-[15.5px] leading-[1.6] text-text">
                    Bronx, NY · EN / ES
                  </dd>
                </div>
                <div
                  data-sc-cue="0.42 1 0.08 0.06"
                  className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4"
                >
                  <dt className="caps text-[12px] text-muted">&gt; status</dt>
                  <dd className="text-[15.5px] leading-[1.6] text-text">
                    Pursuit · AI Solutions Architect, Google SMB Program · AI-Native fellowship
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section
          id="builds"
          data-sc-act="flow"
          className="px-5 md:px-10 lg:px-20 pt-[104px] pb-16 md:pt-10 md:pb-24"
        >
          <h2 className="caps text-[12px] tracking-[0.14em] text-signal">
            <span aria-hidden className="text-muted">
              &gt;{" "}
            </span>
            ls builds/
            <span className="ml-3 text-muted normal-case tracking-normal">
              05 entries. Open a row.
            </span>
          </h2>
          <div className="mt-8">
            <BuildsList projects={projects} />
          </div>
        </section>

        <section id="profile" data-sc-act="pin" data-sc-span="3.0">
          <div data-sc-stage>
            <div className="flex h-full flex-col justify-center pt-[104px] md:pt-0 px-5 md:px-10 lg:px-20">
              <div className="max-w-[62ch]">
                <h2 className="caps text-[12px] tracking-[0.14em] text-signal">
                  <span aria-hidden className="text-muted">
                    &gt;{" "}
                  </span>
                  cat profile.md
                </h2>
                <div className="profile-lines relative mt-8 min-h-[16rem] md:min-h-[14rem]">
                  <p
                    data-sc-cue="0 0.12 0 0.25"
                    className="absolute inset-x-0 top-0 text-[clamp(1.15rem,1.9vw,1.55rem)] leading-[1.55] text-text"
                  >
                    I kept records for a living. Three years at Urban Health Plan handling chart custody under HIPAA: who asked, what left, when it came back.
                  </p>
                  <p
                    data-sc-cue="0.09 0.34 0.12 0.12"
                    className="absolute inset-x-0 top-0 text-[clamp(1.15rem,1.9vw,1.55rem)] leading-[1.55] text-text"
                  >
                    That is why the builds look the way they do. Sentry signs every movement pass. Raphel chains every site entry to the one before it. A record you can quietly edit is not a record.
                  </p>
                  <p
                    data-sc-cue="0.31 0.56 0.12 0.12"
                    className="absolute inset-x-0 top-0 text-[clamp(1.15rem,1.9vw,1.55rem)] leading-[1.55] text-text"
                  >
                    Vantage ranks healthcare executives for a private equity client. I did not borrow the domain; I came from it.
                  </p>
                  <p
                    data-sc-cue="0.53 0.78 0.12 0.12"
                    className="absolute inset-x-0 top-0 text-[clamp(1.15rem,1.9vw,1.55rem)] leading-[1.55] text-text"
                  >
                    I work in two languages. Raphel is built for Dominican construction sites. Daysi&apos;s site opens in Spanish. I have volunteered in the Dominican Republic with Light a Candle Foundation since 2016.
                  </p>
                  <p
                    data-sc-cue="0.75 1 0.12 0.12"
                    className="absolute inset-x-0 top-0 text-[clamp(1.15rem,1.9vw,1.55rem)] leading-[1.55] text-text"
                  >
                    I take products end to end: discovery on site, a requirements document through three revisions, a live demo in front of Blackstone&apos;s investment team. Twenty CRM merged my fix for 27 languages.
                  </p>
                </div>
                <p className="mt-10 caps text-[12px] text-muted">
                  Pursuit AI-Native fellowship since September 2025. AI Solutions Architect on the Google SMB Program since July 2026. Bronx, NY.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="stack" data-sc-act="pan" data-sc-span="1.8">
          <div data-sc-stage>
            <div className="flex h-full items-center">
              <ul
                className="stack-rail flex items-stretch gap-8 pl-5 md:pl-10 lg:pl-20 pr-[40vw]"
                data-sc-pan="0.06"
              >
                <li
                  className="shrink-0 w-[clamp(17rem,24vw,22rem)] p-6"
                  style={{ "--i": 0 } as React.CSSProperties}
                >
                  <h2 className="caps text-[12px] tracking-[0.14em] text-signal">
                    <span aria-hidden className="text-muted">
                      &gt;{" "}
                    </span>
                    cat stack.txt
                  </h2>
                  <p className="mt-4 text-[14.5px] leading-[1.7] text-muted max-w-[28ch]">
                    Five groups. What I reach for when the pressure is on.
                  </p>
                </li>
                {skills.map((group, index) => (
                  <li
                    key={group.label}
                    className="shrink-0 w-[clamp(17rem,24vw,22rem)] border border-rule bg-surface/60 p-6"
                    style={{ "--i": index + 1 } as React.CSSProperties}
                  >
                    <h3 className="caps text-[12px] text-signal">
                      {group.label}
                    </h3>
                    <ul className="mt-4 space-y-1.5 text-[14.5px] leading-[1.6] text-text/90">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </li>
                ))}
                <li
                  className="shrink-0 w-[clamp(17rem,24vw,22rem)] border border-rule bg-surface/60 p-6"
                  style={{ "--i": skills.length + 1 } as React.CSSProperties}
                >
                  <p className="text-[14.5px] leading-[1.7] text-muted">
                    The long form is on the resume.
                  </p>
                  <a
                    href={assetPath("/resume.pdf")}
                    target="_blank"
                    rel="noreferrer"
                    className="signal-link mt-4 inline-block text-[14.5px]"
                  >
                    resume.pdf ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="contact" data-sc-act="pin" data-sc-span="1.4">
          <div data-sc-stage>
            <div className="flex h-full flex-col justify-center pt-[104px] md:pt-0 px-5 md:px-10 lg:px-20">
              <div data-sc-cue="0 1 0 0" className="max-w-[62ch]">
                <h2 className="caps text-[12px] tracking-[0.14em] text-signal">
                  <span aria-hidden className="text-muted">
                    &gt;{" "}
                  </span>
                  ls contact/
                </h2>
                <ul className="mt-6 space-y-4">
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
                    href={assetPath("/resume.pdf")}
                    display="resume.pdf"
                    newTab
                  />
                </ul>
                <Prompt />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
