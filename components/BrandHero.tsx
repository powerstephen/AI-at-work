// components/BrandHero.tsx
import React from "react";

export default function BrandHero() {
  return (
    <div className="relative">
      {/* Fixed-height hero, image from /public/hero.png */}
      <div
        className="w-full h-[240px] md:h-[300px] rounded-2xl overflow-hidden border border-blue-500/20"
        style={{
          backgroundImage: "url('/hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Soft gradient so text below has separation */}
        <div className="w-full h-full bg-gradient-to-tr from-[#0b1022]/70 via-[#0b1022]/30 to-transparent" />
      </div>

      {/* Title + sub under the image (not overlay) */}
      <div className="mt-5">
        <h1 className="text-2xl md:text-3xl font-semibold">
          AI at Work — Human Productivity ROI
        </h1>
        <p className="text-blue-200/90 mt-1">
          Quantify time saved, payback, and retention impact from training managers and teams
          to work effectively with AI.
        </p>
      </div>
    </div>
  );
}
