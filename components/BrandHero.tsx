// components/BrandHero.tsx
"use client";

import Image from "next/image";

export default function BrandHero() {
  return (
    <section className="w-full bg-[#0b1022] text-white">
      {/* Banner with fixed height so it can't collapse onto other sections */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        <Image
          src="/hero-v3.png"       // <- ensure this file exists in /public
          alt="AI at Work"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Soft overlay so white text always readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/60" />
        {/* Title block */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-2xl md:text-4xl font-semibold tracking-tight">
            AI at Work — Human Productivity ROI
          </h1>
          <p className="mt-2 max-w-3xl text-sm md:text-base text-blue-100/90">
            Quantify time saved, payback, and retention impact from training managers and teams to work effectively with AI.
          </p>
        </div>
      </div>

      {/* “What the report shows” – separate row (in normal flow, cannot overlap steps) */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-5">
        <h2 className="sr-only">What the report shows</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Monthly savings", value: "Auto-calculated" },
            { label: "Payback", value: "in months" },
            { label: "Annual ROI", value: "× multiple" },
            { label: "Hours saved / year", value: "team-level" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-blue-400/30 bg-[#0f1a3a] p-4"
            >
              <div className="text-blue-200 text-[11px] uppercase tracking-wide">
                {item.label}
              </div>
              <div className="text-white font-semibold mt-1">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
