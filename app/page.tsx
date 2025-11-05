// app/page.tsx
import BrandHero from "@/components/BrandHero";

/**
 * Strong typing for goals — and pre-typed constants
 * so we never hit "Type 'string' is not assignable to type 'Goal'".
 */
type Goal = "throughput" | "quality" | "onboarding" | "retention" | "upskilling";

const K_THROUGHPUT: Goal = "throughput";
const K_QUALITY: Goal = "quality";
const K_ONBOARDING: Goal = "onboarding";
const K_RETENTION: Goal = "retention";
const K_UPSKILLING: Goal = "upskilling";

const GOAL_META: Record<Goal, { label: string; hint?: string }> = {
  throughput: { label: "Throughput", hint: "Ship faster; reduce cycle time" },
  quality: { label: "Quality", hint: "Fewer reworks; better first-pass yield" },
  onboarding: { label: "Onboarding", hint: "Ramp new hires quicker" },
  retention: { label: "Retention", hint: "Reduce regretted attrition" },
  upskilling: { label: "Upskilling", hint: "Expand AI competency coverage" },
};

export default function Page() {
  // --------------------------------------------
  // Replace these placeholders with your real state/logic
  // --------------------------------------------
  const currency = "$";
  const hourlyCost = 50; // blended hourly cost example
  const selected: Goal[] = [K_THROUGHPUT, K_UPSKILLING];

  // Example values per goal (replace with your model outputs)
  const valThroughput = 25;
  const valQuality = 15;
  const valOnboarding = 20;
  const valRetention = 12;
  const upBase = 10;
  const valUpskilling =
    selected.includes(K_THROUGHPUT) && selected.includes(K_UPSKILLING)
      ? upBase * 0.7
      : upBase;

  // Fully typed breakdown (no casts, no 'as Goal' needed)
  const breakdown: Array<{ key: Goal; label: string; value: number }> = [
    { key: K_THROUGHPUT, label: GOAL_META.throughput.label, value: valThroughput },
    { key: K_QUALITY, label: GOAL_META.quality.label, value: valQuality },
    { key: K_ONBOARDING, label: GOAL_META.onboarding.label, value: valOnboarding },
    { key: K_RETENTION, label: GOAL_META.retention.label, value: valRetention },
    { key: K_UPSKILLING, label: GOAL_META.upskilling.label, value: valUpskilling },
  ];

  const totalHours = breakdown.reduce((sum, r) => sum + r.value, 0);
  const totalValue = totalHours * hourlyCost;

  return (
    <main className="min-h-screen bg-[#0b1022] text-white">
      {/* Top hero */}
      <BrandHero />

      {/* Results table */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-semibold mb-2 text-center text-blue-100">
          Productivity Impact Breakdown
        </h2>
        <p className="text-center text-blue-300 mb-8">
          Estimated weekly hours saved by priority area (demo values). Replace with live calculator outputs.
        </p>

        <div className="overflow-x-auto border border-blue-800/40 rounded-xl bg-blue-950/30 backdrop-blur-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-900/40 text-blue-100 uppercase tracking-wide text-xs">
              <tr>
                <th className="px-6 py-3">Priority Area</th>
                <th className="px-6 py-3 hidden md:table-cell">Why it matters</th>
                <th className="px-6 py-3 text-right">Hours Saved</th>
                <th className="px-6 py-3 text-right">Est. Value ({currency})</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map(({ key, label, value }) => (
                <tr
                  key={key}
                  className="border-t border-blue-800/20 hover:bg-blue-900/20 transition"
                >
                  <td className="px-6 py-3 font-medium text-blue-100">{label}</td>
                  <td className="px-6 py-3 hidden md:table-cell text-blue-300">
                    {GOAL_META[key].hint}
                  </td>
                  <td className="px-6 py-3 text-right text-blue-100">
                    {value.toLocaleString()} hrs
                  </td>
                  <td className="px-6 py-3 text-right text-blue-100">
                    {(value * hourlyCost).toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-blue-800/40 bg-blue-900/30">
                <td className="px-6 py-3 font-semibold text-blue-100">Total</td>
                <td className="px-6 py-3 hidden md:table-cell" />
                <td className="px-6 py-3 text-right font-semibold text-blue-100">
                  {totalHours.toLocaleString()} hrs
                </td>
                <td className="px-6 py-3 text-right font-semibold text-blue-100">
                  {totalValue.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Takeaways / Next Steps */}
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="bg-blue-950/40 p-6 rounded-xl text-blue-100 border border-blue-800/30">
            <h3 className="text-lg font-semibold mb-3 text-blue-200">Key Takeaways</h3>
            <ul className="list-disc list-inside space-y-2 text-blue-100/90">
              <li>Focus on the top 2–3 priorities to avoid diluted impact.</li>
              <li>Translate hours saved into business KPIs (cycle time, NPS, ramp).</li>
              <li>Tie savings to roles and workflows to validate with managers.</li>
              <li>Benchmark maturity now, then re-measure post-enablement.</li>
            </ul>
          </div>
          <div className="bg-blue-950/40 p-6 rounded-xl text-blue-100 border border-blue-800/30">
            <h3 className="text-lg font-semibold mb-3 text-blue-200">Next Steps</h3>
            <ul className="list-disc list-inside space-y-2 text-blue-100/90">
              <li>Pick 3 workflows and ship prompt templates/guardrails in 2 weeks.</li>
              <li>Nominate “AI Champions” per team; run weekly office hours.</li>
              <li>Set a competency coverage target (e.g., 60%) and track usage.</li>
              <li>Review ROI monthly; double-down on the highest leverage area.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
