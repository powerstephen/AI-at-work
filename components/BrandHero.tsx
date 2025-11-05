// components/BrandHero.tsx
"use client";

import Image from "next/image";

export default function BrandHero() {
  return (
    <section className="w-full bg-[#0b1022] text-white">
      {/* Title & subhead */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10">
        <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-center">
          AI at Work — Human Productivity ROI
        </h1>
        <p className="mt-2 max-w-3xl mx-auto text-center text-blue-100/90 text-sm md:text-base">
          Quantify time saved, payback, and retention impact from training managers and teams to work effectively with AI.
        </p>
      </div>

      {/* Image block (bounded height, no overlay, no absolute) */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-6">
        <div className="rounded-2xl overflow-hidden border border-blue-500/20 bg-[#0f1a3a]">
          <Image
            src="/hero-v3.png"          // make sure public/hero-v3.png exists
            alt="AI at Work"
            width={1600}
            height={700}
            priority
            className="w-full h-auto block"
          />
        </div>
      </div>

      {/* “What the report shows” */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
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
