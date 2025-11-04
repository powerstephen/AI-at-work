"use client";
import { useState, useEffect } from "react";

export default function BrandHero() {
  const [heroSrc, setHeroSrc] = useState("/hero.png");

  useEffect(() => {
    // Try fetching the local hero
    fetch("/hero.png", { method: "HEAD" })
      .then((res) => {
        if (!res.ok) {
          // fallback to GitHub if not found
          setHeroSrc(
            "https://raw.githubusercontent.com/powerstephen/AI-at-work/main/public/hero.png"
          );
        }
      })
      .catch(() => {
        setHeroSrc(
          "https://raw.githubusercontent.com/powerstephen/AI-at-work/main/public/hero.png"
        );
      });
  }, []);

  return (
    <section className="relative max-w-6xl mx-auto my-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Background Image */}
      <img
        src={heroSrc}
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1635]/70 via-[#1e2a5e]/50 to-[#3366fe]/40" />

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10 text-white">
        <p className="uppercase tracking-wider text-xs sm:text-sm text-blue-200 mb-2">
          Branded for Brainster · vivid blue theme
        </p>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3">
          AI at Work — Human Productivity ROI
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-3xl mb-6">
          Quantify time saved, payback, and retention impact from training managers and teams to
          work effectively with AI.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {[
            ["Monthly savings", "Auto-calculated"],
            ["Payback", "in months"],
            ["Annual ROI", "× multiple"],
            ["Hours saved / year", "team-level"],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm"
            >
              <div className="font-semibold text-white">{title}</div>
              <div className="text-xs sm:text-sm text-blue-100">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
