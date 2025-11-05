"use client";

import { useEffect, useState } from "react";

export default function BrandHero() {
  const [bg, setBg] = useState<string | null>(null);

  // Force LOCAL ONLY (since remote caused confusion)
  const LOCAL = "/hero.png"; // served from /public/hero.png

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`${LOCAL}?v=${Date.now()}`, { method: "HEAD", cache: "no-store" });
        if (!cancelled && r.ok) {
          setBg(LOCAL);
        } else if (!cancelled) {
          setBg(null); // fallback to gradient
        }
      } catch {
        if (!cancelled) setBg(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasImage = !!bg;

  return (
    <section className="w-full">
      <div
        className="
          relative mx-auto max-w-6xl
          rounded-2xl overflow-hidden
          border border-blue-500/10
          /* fixed height, no full-screen stretching */
          h-[220px] md:h-[260px]
        "
        style={{
          backgroundImage: hasImage
            ? `url("${bg}")`
            : "linear-gradient(180deg, #0b1022 0%, #0f1a3a 100%)",
          backgroundSize: "cover",       // keep image covering the box
          backgroundPosition: "center",  // centered focal point
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Subtle overlay for text legibility */}
        <div className={`absolute inset-0 ${hasImage ? "bg-[#0b1022]/40" : "bg-transparent"}`} />

        {/* Content */}
        <div className="relative z-10 px-6 md:px-10 py-6 md:py-8">
          <h1 className="text-white text-2xl md:text-3xl font-semibold tracking-tight text-center">
            AI at Work — Human Productivity ROI
          </h1>
          <p className="mt-2 max-w-3xl mx-auto text-center text-blue-100/90 text-sm md:text-base">
            Quantify time saved, payback, and retention impact from training managers and teams to work effectively with AI.
          </p>

          {/* Small stats row (unchanged semantics, tighter layout) */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {[
              { label: "Monthly savings", value: "Auto-calculated" },
              { label: "Payback", value: "in months" },
              { label: "Annual ROI", value: "× multiple" },
              { label: "Hours saved / year", value: "team-level" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-blue-400/30 bg-[#0f1a3a]/70 backdrop-blur p-3"
              >
                <div className="text-blue-200 text-[11px] uppercase tracking-wide">
                  {item.label}
                </div>
                <div className="text-white font-semibold mt-0.5 text-sm">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
