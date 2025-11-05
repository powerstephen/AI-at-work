// components/BrandHero.tsx
"use client";

import Image from "next/image";

export default function BrandHero() {
  return (
    <header className="relative overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-white">
          AI at Work — Human Productivity ROI
        </h1>
        <p className="mt-2 text-blue-200">
          Quantify time saved, payback, and retention impact from training managers and teams to work effectively with AI.
        </p>

        {/* Hero image */}
        <div className="mt-6 relative rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
          <Image
            src="/hero-v3.png"     // <— IMPORTANT: new filename
            alt="AI at Work"
            width={1920}
            height={768}
            priority
            className="w-full h-auto object-cover"
          />
        </div>

        {/* What the report shows */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Monthly savings", value: "Auto-calculated" },
            { label: "Payback", value: "in months" },
            { label: "Annual ROI", value: "× multiple" },
            { label: "Hours saved / year", value: "team-level" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl bg-blue-600/15 border border-blue-400/30 p-4"
            >
              <div className="text-blue-200 text-xs uppercase tracking-wide">{item.label}</div>
              <div className="text-white font-semibold mt-1">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* BG tint */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0b1022] via-transparent to-[#0b1022]" />
    </header>
  );
}
