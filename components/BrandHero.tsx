"use client";
import { useEffect, useState } from "react";

const SOURCES = [
  { key: "public", url: "/hero.png" },
  {
    key: "github",
    url: "https://raw.githubusercontent.com/powerstephen/AI-at-work/main/public/hero.png",
  },
  { key: "fallback", url: "https://picsum.photos/1600/800" },
];

export default function BrandHero() {
  const [idx, setIdx] = useState(0); // which source are we using
  const [loaded, setLoaded] = useState(false);

  const src = SOURCES[idx]?.url ?? "";

  useEffect(() => {
    // Try a HEAD request to see if current source is reachable (works for same-origin and most CDNs)
    // If it fails, advance to the next source.
    const trySource = async () => {
      try {
        const res = await fetch(SOURCES[idx].url, { method: "HEAD" });
        if (!res.ok) {
          // advance to next source
          setIdx((i) => Math.min(i + 1, SOURCES.length - 1));
        }
      } catch {
        setIdx((i) => Math.min(i + 1, SOURCES.length - 1));
      }
    };
    trySource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  return (
    <section className="relative max-w-6xl mx-auto my-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Background image (with onError safeguard) */}
      <img
        src={src}
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover"
        onLoad={() => setLoaded(true)}
        onError={() => setIdx((i) => Math.min(i + 1, SOURCES.length - 1))}
      />

      {/* If absolutely everything fails, show a hard gradient */}
      {!loaded && idx === SOURCES.length - 1 && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1635] via-[#1e2a5e] to-[#3366fe]" />
      )}

      {/* Overlay gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1635]/75 via-[#0b1635]/45 to-[#000000]/25" />

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

      {/* Tiny debug badge so we can see which source loaded */}
      <div className="absolute bottom-2 right-2 z-20 text-[11px] px-2 py-1 rounded bg-black/60 border border-white/15 text-white/90">
        img source: <strong>{SOURCES[idx]?.key}</strong>
      </div>
    </section>
  );
}
