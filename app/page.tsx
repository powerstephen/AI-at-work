'use client';
import React, { useState } from 'react';
import BrandHero from '@/components/BrandHero';

export default function Page() {
  // Simulate results for now
  const [atResults, setAtResults] = useState(true);

  // Dummy KPI values
  const paybackMonths = 2.8;
  const roiMultiple = 4.2;
  const annualValue = 420000;
  const monthlySavings = 35000;
  const currency = '€';

  const money = (val: number, symbol = '€') =>
    `${symbol}${val.toLocaleString('en-US')}`;

  return (
    <main className="main">
      <BrandHero
        showResults={atResults}
        paybackMonths={paybackMonths.toFixed(1)}
        roiMultiple={roiMultiple.toFixed(1)}
        annualValue={money(annualValue, currency)}
        monthlySavings={money(monthlySavings, currency)}
      />

      {/* Content below hero */}
      <div className="content">
        <h2>Interactive ROI Calculator Coming Next</h2>
        <p>
          This page will host the full Brainster “AI at Work — Human Productivity ROI”
          experience. The hero above is fully branded and ready for production.
        </p>
      </div>
    </main>
  );
}
