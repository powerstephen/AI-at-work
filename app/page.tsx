// app/page.tsx
import BrandHero from "../components/BrandHero"; // <- relative path

const GOALS = ["throughput", "quality", "onboarding", "retention", "upskilling"] as const;
type Goal = (typeof GOALS)[number];
type BreakdownRow = { key: Goal; label: string; value: number };

const GOAL_META: Record<Goal, { label: string; hint?: string }> = {
  throughput: { label: "Throughput", hint: "Ship faster; reduce cycle time" },
  quality: { label: "Quality", hint: "Fewer reworks; better first-pass yield" },
  onboarding: { label: "Onboarding", hint: "Ramp new hires quicker" },
  retention: { label: "Retention", hint: "Reduce regretted attrition" },
  upskilling: { label: "Upskilling", hint: "Expand AI competency coverage" },
};

export default function Page() {
  const currency = "$";
  const hourlyCost = 50;
  const selected: Goal[] = ["throughput", "upskilling"];

  const valThroughput = 25;
  const valQuality = 15;
  const valOnboarding = 20;
  const valRetention = 12;
  const upBase = 10;
  const valUpskilling =
    selected.includes("throughput") && selected.includes("upskilling") ? upBase * 0.7 : upBase;

  const breakdown = [
    { key: "throughput", label: GOAL_META.throughput.label, value: valThroughput },
    { key: "quality", label: GOAL_META.quality.label, value: valQuality },
    { key: "onboarding", label: GOAL_META.onboarding.label, value: valOnboarding },
    { key: "retention", label: GOAL_META.retention.label, value: valRetention },
    { key: "upskilling", label: GOAL_META.upskilling.label, value: valUpskilling },
  ] satisfies ReadonlyArray<BreakdownRow>;

  const totalHours = breakdown.reduce((s, r) => s + r.value, 0);
  const totalValue = totalHours * hourlyCost;

  return (
    <main className="min-h-screen bg-[#0b1022] text-white">
      <BrandHero />

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
                <tr key={key} className="border-t border-blue-800/20 hover:bg-blue-900/20 transition">
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
      </section>
    </main>
  );
}
