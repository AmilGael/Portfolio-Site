import Reveal from "./Reveal";

type Props = {
  entry: string;
  title: string;
  subhead: string;
};

export default function EntryHeader({ entry, title, subhead }: Props) {
  return (
    <header className="mb-10 md:mb-14">
      <Reveal>
        <div className="caps text-[12px] text-muted mb-6 md:mb-8">
          <span className="text-signal">ENTRY</span>
          <span className="mx-2 text-rule">//</span>
          <span>{entry}</span>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="font-semibold leading-[1] tracking-[-0.035em] text-[clamp(2.5rem,5.8vw,4.75rem)]">
          {title}
        </h2>
      </Reveal>
      <Reveal delay={160}>
        <p className="caps text-[12px] text-muted mt-5 md:mt-6">{subhead}</p>
      </Reveal>
    </header>
  );
}
