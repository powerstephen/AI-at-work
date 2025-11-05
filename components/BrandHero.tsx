// components/BrandHero.tsx
import Image from "next/image";

export default function BrandHero() {
  // Pure visual hero that *replaces* the old blue header box.
  // No overlay text; controlled aspect so it doesn’t take the whole page.
  return (
    <section className="w-full">
      <div className="relative w-full overflow-hidden rounded-2xl shadow-lg">
        {/* Adjust height here if you want taller/shorter */}
        <div className="relative h-[260px] md:h-[320px] lg:h-[360px]">
          <Image
            src="/hero.png"
            alt="AI at Work — Brainster"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        {/* Subtle bottom gradient to separate hero from content */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0b1022] to-transparent" />
      </div>
    </section>
  );
}
