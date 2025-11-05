// components/BrandHero.tsx
import React from "react";

export default function BrandHero() {
  return (
    <div className="relative">
      {/* Hero image with gradient overlay */}
      <div
        className="w-full h-[280px] md:h-[340px] rounded-2xl overflow-hidden border border-blue-500/20"
        style={{
          backgroundImage: "url('/hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full h-full bg-gradient-to-tr from-[#0b1022] via-[#0b1022]/40 to-transparent p-6 md:p-10 flex flex-col justify-end">
          <h1 className="text-2xl md:text-4xl font-semibold text-white drop-shadow-sm">
            AI at Work — Human Productivity ROI
          </h1>
          <p className="text-blue-100/90 mt-2 md:text-lg max-w-3xl drop-shadow-sm">
            Quantify time saved, payback, and retention impact from training managers and teams to work effectively with AI.
          </p>
        </div>
      </div>

      {/* Floating KPI pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 -mt-6 md:-mt-8 relative z-10">
        {[
          { label: "Monthly savings", value: "Auto-calculated" },
          { label: "Payback", value: "months" },
          { label: "Annual ROI", value: "× multiple" },
          { label: "Hours / year", value: "team-level" },
        ].map((x) => (
          <div
            key={x.label}
            className="rounded-xl border border-blue-500/20 bg-[#0f1a3a]/90 backdrop-blur p-4 md:p-5 shadow-lg"
          >
            <div className="text-blue-200 text-[11px] uppercase tracking-wide">{x.label}</div>
            <div className="text-white text-lg font-semibold mt-1">{x.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
