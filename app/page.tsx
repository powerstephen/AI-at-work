'use client';
import React from 'react';

type Props = {
  showResults?: boolean;
  paybackMonths?: string;
  roiMultiple?: string;
  annualValue?: string;
  monthlySavings?: string;
};

export default function BrandHero({
  showResults = false,
  paybackMonths = '—',
  roiMultiple = '—',
  annualValue = '—',
  monthlySavings = '—',
}: Props) {
  return (
    <section className="brand-hero">
      <div className="brand-hero__inner">
        {/* Top Bar */}
        <div className="brand-hero__top">
          <img
            src="/brainster-logo.svg"
            alt="Brainster Logo"
            className="brand-hero__logo"
            width={150}
            height={40}
          />
          <div className="brand-hero__tag">AI at Work</div>
        </div>

        {/* Title */}
        <h1 className="brand-hero__title">Human Productivity ROI</h1>
        <p className="brand-hero__subtitle">
          Quantify time saved, payback, and retention impact from training managers and teams
          to work effectively with AI.
        </p>

        {/* Stats */}
        <div className="brand-hero__stats">
          <Stat label="Payback (months)" value={showResults ? paybackMonths : '—'} />
          <Stat label="Annual ROI (×)" value={showResults ? roiMultiple : '—'} />
          <Stat label="Annual Value" value={showResults ? annualValue : '—'} />
          <Stat label="Monthly Savings" value={showResults ? monthlySavings : '—'} />
        </div>

        {/* What this report shows */}
        <div className="brand-hero__outputs">
          <div className="brand-hero__outputs-title">What this report shows</div>
          <div className="brand-hero__outputs-grid">
            <div className="brand-hero__output">🧠 Time Savings</div>
            <div className="brand-hero__output">💰 Payback Period</div>
            <div className="brand-hero__output">📈 ROI Multiple</div>
            <div className="brand-hero__output">🏆 Retention Impact</div>
          </div>
        </div>
      </div>

      {/* Background Accents */}
      <div className="brand-hero__bg" aria-hidden="true" />
      <div className="brand-hero__grid" aria-hidden="true" />
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="brand-hero__stat">
      <div className="brand-hero__stat-label">{label}</div>
      <div className="brand-hero__stat-value">{value}</div>
    </div>
  );
}
