import Image from "next/image";
import { assetPath } from "@/lib/paths";

type Props = {
  className?: string;
};

export default function Portrait({ className = "" }: Props) {
  return (
    <Image
      src={assetPath("/portrait.jpg")}
      alt="Gamaliel Leguista"
      width={375}
      height={500}
      priority
      className={`aspect-[3/4] border border-rule bg-surface object-cover ${className}`}
    />
  );
}
