import Reveal from "./Reveal";

const GAMALIEL = `  ____    _    __  __    _    _     ___ _____ _
 / ___|  / \\  |  \\/  |  / \\  | |   |_ _| ____| |
| |  _  / _ \\ | |\\/| | / _ \\ | |    | ||  _| | |
| |_| |/ ___ \\| |  | |/ ___ \\| |___ | || |___| |___
 \\____/_/   \\_\\_|  |_/_/   \\_\\_____|___|_____|_____|`;

const LEGUISTA = ` _     _____    ____ _   _ ___ ____ _____    _
| |   | ____|  / ___| | | |_ _/ ___|_   _|  / \\
| |   |  _|   | |  _| | | || |\\___ \\ | |   / _ \\
| |___| |___  | |_| | |_| || | ___) || |  / ___ \\
|_____|_____|  \\____|\\___/|___|____/ |_| /_/   \\_\\`;

const CAT = `     /\\_/\\
    ( o.o )
     > ^ <
     (___)`;

export default function AsciiArt() {
  return (
    <div
      role="img"
      aria-label="ASCII art banner. Gamaliel Leguista, with a small cat"
      className="flex flex-col items-start gap-6 md:flex-row md:items-end md:gap-10 lg:gap-14"
    >
      <Reveal delay={90}>
        <pre
          aria-hidden
          className="ascii text-text text-[clamp(0.52rem,1.45vw,0.98rem)] font-medium"
        >
          <span className="block">{GAMALIEL}</span>
          <span className="mt-2 block">{LEGUISTA}</span>
        </pre>
      </Reveal>
      <Reveal delay={220}>
        <pre
          aria-hidden
          className="ascii text-muted text-[clamp(0.8rem,1.25vw,1.1rem)]"
        >
          {CAT}
        </pre>
      </Reveal>
      <span className="sr-only">Gamaliel Leguista</span>
    </div>
  );
}
