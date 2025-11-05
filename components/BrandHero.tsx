// components/BrandHero.tsx
import React from "react";

export default function BrandHero() {
  return (
    <div className="relative">
      {/* Fixed-height hero image with overlay — NO text inside */}
      <div
        className="w-full h-[260px] md:h-[320px] rounded-2xl overflow-hidden border border-blue-500/20"
        style={{
          backgroundImage: "url('/hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-label="Brainster AI at Work"
      >
        <div className="w-full h-full bg-gradient-to-tr from-[#0b1022]/70 via-[#0b1022]/30 to-transparent" />
      </div>
    </div>
  );
}
