"use client";

export default function BrandHero() {
  return (
    <section className="w-full">
      <div
        className="
          relative mx-auto max-w-6xl
          rounded-2xl overflow-hidden
          border border-blue-500/10
          h-[220px] md:h-[260px]      /* FIXED HEIGHT */
          bg-[#0b1022]
        "
      >
        {/* Background image — no fetching, no fallbacks */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: "url('/hero.png')" }}
          aria-hidden
        />

        {/* Subtle dark overlay for contrast */}
        <div className="absolute inset-0 bg-[#0b1022]/45" aria-hidden />

        {/* Content */}
        <div className="relative z-10 px-6 md:px-10 py-6 md:py-8">
          <h1 className="text-white text-2xl md:text-3xl font-semibold tracking-tight text-center">
            AI at Work — Human Productivity ROI
          </h1>
          <p className="mt-2 max-w-3xl mx-auto text-center text-blue-100/90 text-sm md:text-base">
            Quantify time saved, payback, and retention impact from training managers and teams to work effectively with AI.
          </p>

          {/* 4 small summary boxes (visual only; your live values render elsewhere) */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {[
              { label: "Monthly savings", value: "Auto-calculated" },
              { label: "Payback", value: "in months" },
              { label: "Annual ROI", value: "× multiple" },
              { label: "Hours saved / year", value: "team-level" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-blue-400/30 bg-[#0f1a3a]/70 backdrop-blur p-3"
              >
                <div className="text-blue-200 text-[11px] uppercase tracking-wide">
                  {item.label}
                </div>
                <div className="text-white font-semibold mt-0.5 text-sm">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
