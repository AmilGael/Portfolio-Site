"use client";

import Script from "next/script";
import { useEffect } from "react";
import { assetPath } from "@/lib/paths";
import { mountScrollCraft } from "@/lib/scrollcraft";

export default function ScrollCraftMount() {
  useEffect(() => {
    mountScrollCraft();
  }, []);

  return (
    <Script
      src={assetPath("/scrollcraft/scrollcraft.js")}
      strategy="afterInteractive"
      onLoad={() => mountScrollCraft()}
    />
  );
}
