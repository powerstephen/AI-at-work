// app/page.tsx
import BrandHero from "@/components/BrandHero";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0b1022] text-white">
      {/* Hero */}
      <BrandHero />

      {/* CONTENT BELOW — replace with your calculator/steps */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Calculator</h2>
          <p className="text-blue-100">
            Your interactive steps go here. If you already have components, render them below.
          </p>

          {/* Example placeholder block — delete if you have your own */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-blue-200">
              Replace this placeholder with your <strong>RoiCalculator</strong> component and the
              rest of the flow.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
