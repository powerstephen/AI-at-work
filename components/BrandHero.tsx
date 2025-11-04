// components/BrandHero.tsx
"use client";
import { useState } from "react";

/**
 * This hero tries /hero.png first (from Vercel public/).
 * If that fails (404 or path mismatch), it falls back to the raw GitHub file.
 */
export default function BrandHero() {
  const [src, setSrc] = useState<string>("/hero.png");
  const fallback = "https://raw.githubusercontent.com/powerstephen/AI-at-work/main/public/hero.png";

  return (
    <section className="relative max-w-6xl mx-auto my-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Background layer: image or fallback gradient */}
      {/* Use a plain <img> so we don't need domain config */}
      <img
        src={src}
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover"
        onError={() => {
          // If /hero.png fails, try the raw GitHub URL once
          if (src !== fallback) setSrc(fallback);
        }}
      />

      {/* Overlay gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1635]/80 via-[#1e2a5e]/60 to-[#000000]/30" />

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10 text-white">
        <p className="uppercase tracking-wider text-xs sm:text-sm text-blue-200 mb-2">
          Branded for Brainster · vivid blue theme
        </p>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3">
          AI at Work — Human Productivity ROI
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-3xl mb-6">
          Quantify time saved, payback, and retention impact from training managers and teams to
          work effectively with AI.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {[
            ["Monthly savings", "Auto-calculated"],
            ["Payback", "in months"],
            ["Annual ROI", "× multiple"],
            ["Hours saved / year", "team-level"],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm"
            >
              <div className="font-semibold text-white">{title}</div>
              <div className="text-xs sm:text-sm text-blue-100">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
