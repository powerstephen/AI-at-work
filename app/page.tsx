// app/page.tsx
import BrandHero from "@/components/BrandHero";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0b1022] text-white">
      <BrandHero />

      {/* Your calculator or other sections below */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-semibold mb-3">Calculator</h2>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-blue-200">
            Replace this block with your RoiCalculator component.
          </p>
        </div>
      </section>
    </main>
  );
}
