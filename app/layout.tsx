import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import ScrollCraftMount from "@/components/ScrollCraftMount";
import "./scrollcraft.css";
import "./globals.css";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gamaliel // Archive",
  description:
    "AI engineer and full-stack developer. Bronx, NY. Client-facing products end to end, from discovery to live demo.",
  openGraph: {
    title: "Gamaliel // Archive",
    description:
      "AI engineer and full-stack developer. Bronx, NY. Client-facing products end to end, from discovery to live demo.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plexMono.variable}>
      <body>
        {children}
        <ScrollCraftMount />
      </body>
    </html>
  );
}
