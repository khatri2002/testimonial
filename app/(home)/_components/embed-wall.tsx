"use client";

import { EMBED_WALL_CDN_URL } from "@/constants";
import Script from "next/script";
import { iframeSrc } from "../lib/config";

export default function EmbedWall() {
  const iframeId = "testimonial-wall";

  return (
    <>
      <Script
        src={EMBED_WALL_CDN_URL}
        strategy="afterInteractive"
        onLoad={() =>
          window.TestimonialWall?.init({
            iframeId,
          })
        }
      />

      <iframe id={iframeId} src={iframeSrc} width="100%"></iframe>
    </>
  );
}
