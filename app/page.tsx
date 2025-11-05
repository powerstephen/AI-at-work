"use client"; // MUST be first line

import BrandHero from "../components/BrandHero";
import React from "react";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0b1022] text-white">
      {/* HERO */}
      <div className="px-4 py-6 md:px-8 md:py-10">
        <BrandHero />
      </div>

      {/* MAIN CONTENT */}
      <main className="px-4 md:px-8 max-w-6xl mx-auto pb-16">
        <section className="rounded-2xl border border-blue-500/10 bg-[#0f1a3a]/40 p-6 md:p-8">
          {/* ▼▼▼ Paste your existing 5-step calculator here ▼▼▼ */}
          {/* Keep your prior, working Steps / Inputs / Results JSX in this spot.
              Do NOT move the hero or change its height. */}
          <div className="text-blue-200/80 text-sm">
            {/* TODO: paste your stepper/calculator UI here */}
          </div>
          {/* ▲▲▲ End paste ▲▲▲ */}
        </section>
      </main>
    </div>
  );
}
