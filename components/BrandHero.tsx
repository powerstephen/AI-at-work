// components/BrandHero.tsx
import React from "react";

export default function BrandHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-[#0b1022]">
      {/* Hero image (served from /public/hero.png if present) */}
      <div
        className="w-full h-[220px] md:h-[280px] bg-[#0b1022]"
        style={{
          backgroundImage: "url('/hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Overlay content */}
      <div className="p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-white">
          AI at Work — Human Productivity ROI
        </h1>
        <p className="text-blue-200/90 mt-2 max-w-3xl">
          Quantify time saved, payback, and retention impact from training managers and teams to work effectively with AI.
        </p>

        {/* What the report shows */}
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Monthly savings", value: "Auto-calculated" },
            { label: "Payback", value: "in months" },
            { label: "Annual ROI", value: "× multiple" },
            { label: "Hours saved / year", value: "team-level" },
          ].map((x) => (
            <div key={x.label} className="rounded-xl border border-blue-500/20 bg-[#0f1a3a]/60 p-4">
              <div className="text-blue-200 text-[11px] uppercase tracking-wide">{x.label}</div>
              <div className="text-white text-lg font-semibold mt-1">{x.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
