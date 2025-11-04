"use client";
import { useEffect, useMemo, useState } from "react";

const GH_RAW =
  "https://raw.githubusercontent.com/powerstephen/AI-at-work/main/public/hero.png";
const FALLBACK = "https://picsum.photos/1600/800";

export default function BrandHero() {
  // Cache-bust local file so Vercel won’t serve a stale 404
  const localSrc = useMemo(() => `/hero.png?v=${Date.now()}`, []);
  const [src, setSrc] = useState(localSrc);
  const [which, setWhich] = useState<"public" | "github" | "fallback">("public");

  useEffect(() => {
    // HEAD the local asset first to see if Vercel serves it
    fetch(localSrc, { method: "HEAD" })
      .then((r) => {
        if (!r.ok) {
          setSrc(GH_RAW);
          setWhich("github");
        }
      })
      .catch(() => {
        setSrc(GH_RAW);
        setWhich("github");
      });
  }, [localSrc]);

  return (
    <section className="relative max-w-6xl mx-auto my-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <img
        src={src}
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover"
        onError={() => {
          if (which === "public") {
            setSrc(GH_RAW);
            setWhich("github");
          } else if (which === "github") {
            setSrc(FALLBACK);
            setWhich("fallback");
          }
        }}
        onLoad={() => {
          /* loaded */
        }}
      />
      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1635]/75 via-[#0b1635]/45 to-[#000]/25" />
      {/* content */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10 text-white">
        <p className="uppercase tracking-wider text-xs sm:text-sm text-blue-200 mb-2">
          Branded for Brainster · vivid blue theme
        </p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3">
          AI at Work — Human Productivity ROI
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-3xl mb-6">
          Quantify time saved, payback, and retention impact from training managers and teams to work effectively with AI.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {[
            ["Monthly savings", "Auto-calculated"],
            ["Payback", "in months"],
            ["Annual ROI", "× multiple"],
            ["Hours saved / year", "team-level"],
          ].map(([title, desc]) => (
            <div key={title} className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm">
              <div className="font-semibold text-white">{title}</div>
              <div className="text-xs sm:text-sm text-blue-100">{desc}</div>
            </div>
          ))}
        </div>
      </div>
      {/* tiny debug badge */}
      <div className="absolute bottom-2 right-2 z-20 text-[11px] px-2 py-1 rounded bg-black/60 border border-white/15 text-white/90">
        img source: <strong>{which}</strong>
      </div>
    </section>
  );
}
