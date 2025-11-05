"use client"; // MUST be the first line in the file, before imports

import BrandHero from "../components/BrandHero";
import { useState } from "react";

// (Optional) keep your types here if you need them on this page
type TeamScope =
  | "Company-wide"
  | "Marketing"
  | "Sales"
  | "Customer Support"
  | "Operations"
  | "Engineering"
  | "HR";
type Currency = "$" | "€" | "£";

export default function Page() {
  // Keep any state you were using before
  const [mounted, setMounted] = useState(true);

  return (
    <div className="min-h-screen bg-[#0b1022] text-white">
      {/* Hero section */}
      <div className="px-4 py-6 md:px-8 md:py-10">
        <BrandHero />
      </div>

      {/* Main content wrapper */}
      <main className="px-4 md:px-8 max-w-6xl mx-auto pb-16">
        {/* ▼ Put your existing steps / calculator UI back in here ▼ */}
        <section className="rounded-2xl border border-blue-500/10 bg-[#0f1a3a]/40 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">
            AI at Work — Human Productivity ROI
          </h2>
          <p className="text-blue-100/80 mb-6">
            Quantify time saved, payback, and retention impact from training managers and teams to
            work effectively with AI.
          </p>

          {/* TODO: paste your Stepper / Inputs / Results here */}
          <div className="text-blue-200/80 text-sm">
            Replace this placeholder with your step components.
          </div>
        </section>
      </main>
    </div>
  );
}
