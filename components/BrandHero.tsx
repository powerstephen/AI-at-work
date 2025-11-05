// components/BrandHero.tsx
import Image from "next/image";

export default function BrandHero() {
  return (
    <section className="w-full">
      <div
        className="
          relative w-full overflow-hidden rounded-2xl shadow-lg
          max-h-[420px]   /* hard cap so it never fills screen */
        "
      >
        {/* Fixed-height wrapper; image covers but never grows past 420px */}
        <div className="relative h-[220px] sm:h-[260px] md:h-[320px] lg:h-[380px]">
          <Image
            src="/hero.png"
            alt="AI at Work — Brainster"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center select-none"
          />
        </div>

        {/* very small fade so content separation is clear, but not covering */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0b1022] to-transparent" />
      </div>
    </section>
  );
}
