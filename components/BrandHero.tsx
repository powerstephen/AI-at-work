"use client";
import { useState } from "react";

export default function BrandHero() {
  const [fallback, setFallback] = useState(false);

  // cache-busting query param ensures Vercel pulls new image
  const HERO_URL = "/hero.png?v=4";

  return (
    <section className="w-full bg-[#0b1022] text-white">
      <div
        className="relative mx-auto max-w-6xl rounded-2xl overflow-hidden border border-blue-500/10"
        style={{
          backgroundImage: fallback
            ? "linear-gradient(180deg, #0b1022 0%, #0f1a3a 100%)"
            : `url(${HERO_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "280px",
        }}
      >
        {/* Hidden loader to detect 404 and switch to fallback */}
        {!fallback && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={HERO_URL}
            alt=""
            className="hidden"
            onError={() => setFallback(true)}
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#0b1022]/50" />

        {/* Text content */}
        <div className="relative z-10 px-6 md:px-10 py-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-center">
            AI at Work — Human Productivity ROI
          </h1>
          <p className="mt-3 max-w-3xl mx-auto text-center text-blue-100/90 text-sm md:text-base">
            Quantify time saved, payback, and retention impact from training
            managers and teams to work effectively with AI.
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {[
              { label: "Monthly savings", value: "Auto-calculated" },
              { label: "Payback", value: "in months" },
              { label: "Annual ROI", value: "× multiple" },
              { label: "Hours saved / year", value: "team-level" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-blue-400/30 bg-[#0f1a3a]/70 backdrop-blur p-4"
              >
                <div className="text-blue-200 text-[11px] uppercase tracking-wide">
                  {item.label}
                </div>
                <div className="text-white font-semibold mt-1">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
