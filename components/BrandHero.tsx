// components/BrandHero.tsx
import Image from "next/image";

export default function BrandHero() {
  // Pure visual hero that replaces the old blue header block (no tiles inside).
  // Height is constrained and responsive; image is centered and covers without cropping the headline area.
  return (
    <section className="w-full">
      <div className="relative w-full h-[240px] md:h-[320px] lg:h-[380px] overflow-hidden rounded-2xl shadow-lg">
        <Image
          src="/hero.png"
          alt="AI at Work — Brainster"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </section>
  );
}
