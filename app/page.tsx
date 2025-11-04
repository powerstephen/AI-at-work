import BrandHero from "@/components/BrandHero";

// Fallback Goal type definition (safe if not imported elsewhere)
type Goal = "throughput" | "quality" | "onboarding" | "retention" | "upskilling";

// Mock GOAL_META just for compile; keep or replace with real data
const GOAL_META = {
  throughput: { label: "Throughput" },
  quality: { label: "Quality" },
  onboarding: { label: "Onboarding" },
  retention: { label: "Retention" },
  upskilling: { label: "Upskilling" },
};

export default function Page() {
  // Dummy values for demonstration — replace with live calculations
  const selected = ["throughput", "upskilling"];
  const upBase = 10;
  const valThroughput = 25;
  const valQuality = 15;
  const valOnboarding = 20;
  const valRetention = 12;
  const valUpskilling =
    selected.includes("throughput") && selected.includes("upskilling")
      ? upBase * 0.7
      : upBase;

  const breakdown: { key: Goal; label: string; value: number }[] = [
    { key: "throughput" as Goal, label: GOAL_META.throughput.label, value: valThroughput },
    { key: "quality" as Goal, label: GOAL_META.quality.label, value: valQuality },
    { key: "onboarding" as Goal, label: GOAL_META.onboarding.label, value: valOnboarding },
    { key: "retention" as Goal, label: GOAL_META.retention.label, value: valRetention },
    { key: "upskilling" as Goal, label: GOAL_META.upskilling.label, value: valUpskilling },
  ];

  return (
    <main className="min-h-screen bg-[#0b1022] text-white">
      <BrandHero />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-200">
          Productivity Impact Breakdown
        </h2>

        <div className="overflow-x-auto border border-blue-800/40 rounded-xl bg-blue-950/30 backdrop-blur-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-900/40 text-blue-100 uppercase tracking-wide text-xs">
              <tr>
                <th className="px-6 py-3">Priority Area</th>
                <th className="px-6 py-3 text-right">Hours Saved</th>
                <th className="px-6 py-3 text-right">Est. $ Value</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map(({ key, label, value }) => (
                <tr
                  key={key}
                  className="border-t border-blue-800/20 hover:bg-blue-900/20 transition"
                >
                  <td className="px-6 py-3 font-medium text-blue-100">{label}</td>
                  <td className="px-6 py-3 text-right text-blue-200">{value} hrs</td>
                  <td className="px-6 py-3 text-right text-blue-200">
                    ${(value * 50).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 bg-blue-950/40 p-6 rounded-xl text-blue-100">
          <h3 className="text-lg font-semibold mb-3 text-blue-200">
            Key Takeaways & Next Steps
          </h3>
          <ul className="list-disc list-inside space-y-2 text-blue-100/90">
            <li>Identify the top 3 priorities for AI-driven efficiency gains.</li>
            <li>Estimate tangible ROI using Brainster’s “AI at Work” calculator.</li>
            <li>Launch small-scale AI adoption pilots with clear metrics.</li>
            <li>Benchmark AI maturity across teams to track improvement.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
