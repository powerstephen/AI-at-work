"use client";
import { useEffect, useState } from "react";

/**
 * This component tries hero.png from THREE sources, in order:
 * 1) Local /public/hero.png (fastest when it exists in the deployed build)
 * 2) Raw GitHub CDN (always available if the file is in your repo)
 * 3) Gradient fallback (never breaks layout)
 */
export default function BrandHero() {
  const [bg, setBg] = useState<string | null>(null);

  // Update this to the RAW link of your GitHub file (not the HTML page URL).
  // How to get it: Open hero.png in GitHub → click "Download raw file".
 
  const RAW_GITHUB = "about:blank"; // disables remote fallback

  // Add a small cache-buster so browsers don’t keep an old 404 in memory
  const LOCAL = "/hero.png";
  const REMOTE = `${RAW_GITHUB}?v=5`;

  useEffect(() => {
    let cancelled = false;

    // Try local first
    const tryLocal = async () => {
      try {
        const r = await fetch(LOCAL, { method: "HEAD", cache: "no-store" });
        if (!cancelled && r.ok) {
          setBg(LOCAL);
          return true;
        }
      } catch {}
      return false;
    };

    // Then try remote (GitHub raw)
    const tryRemote = async () => {
      try {
        const r = await fetch(REMOTE, { method: "HEAD", cache: "no-store" });
        if (!cancelled && r.ok) {
          setBg(REMOTE);
          return true;
        }
      } catch {}
      return false;
    };

    (async () => {
      const okLocal = await tryLocal();
      if (!okLocal) {
        const okRemote = await tryRemote();
        if (!okRemote && !cancelled) {
          setBg(null); // fallback gradient
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasImage = !!bg;

  return (
    <section className="w-full">
      <div
        className="relative mx-auto max-w-6xl rounded-2xl overflow-hidden border border-blue-500/10"
        style={{
          backgroundImage: hasImage
            ? `url("${bg}")`
            : "linear-gradient(180deg, #0b1022 0%, #0f1a3a 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "280px",
        }}
      >
        {/* Overlay for legibility (kept subtle if image exists) */}
        <div
          className={`absolute inset-0 ${
            hasImage ? "bg-[#0b1022]/40" : "bg-transparent"
          }`}
        />

        {/* Content */}
        <div className="relative z-10 px-6 md:px-10 py-8">
          <h1 className="text-white text-3xl md:text-4xl font-semibold tracking-tight text-center">
            AI at Work — Human Productivity ROI
          </h1>
          <p className="mt-3 max-w-3xl mx-auto text-center text-blue-100/90 text-sm md:text-base">
            Quantify time saved, payback, and retention impact from training managers
            and teams to work effectively with AI.
          </p>

          {/* What the report shows (unchanged layout) */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {[
              { label: "Monthly savings", value: "Auto-calculated" },
              { label: "Payback", value: "in months" },
              { label: "Annual ROI", value: "× multiple" },
              { label: "Hours saved / year", value: "team-level" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-blue-400/30 bg-[#0f1a3a]/70 backdrop-blur p-4"
              >
                <div className="text-blue-200 text-[11px] uppercase tracking-wide">
                  {item.label}
                </div>
                <div className="text-white font-semibold mt-1">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
