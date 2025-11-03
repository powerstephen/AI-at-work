'use client';
import React, { useMemo, useState } from 'react';

/* ========= constants & helpers ========= */
type Team = 'all'|'hr'|'ops'|'marketing'|'sales'|'support'|'product';
type Currency = 'EUR'|'USD'|'GBP';
type Goal = 'throughput'|'quality'|'onboarding'|'retention'|'cost'|'upskilling';

const BLUE = '#3366FE';
const TEAMS: {label:string; value:Team}[] = [
  { label: 'Company-wide', value: 'all' },
  { label: 'HR / People Ops', value: 'hr' },
  { label: 'Operations', value: 'ops' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Sales', value: 'sales' },
  { label: 'Customer Support', value: 'support' },
  { label: 'Product', value: 'product' },
];

const GOAL_META: Record<Goal,{label:string; hint:string}> = {
  throughput: { label:'Throughput / Cycle time', hint:'Ship more, remove blockers' },
  quality:    { label:'Quality / Rework',        hint:'Cut rework & error rates' },
  onboarding: { label:'Onboarding speed',        hint:'Faster time-to-productivity' },
  retention:  { label:'Retention',               hint:'Avoid regretted churn cost' },
  cost:       { label:'Cost',                    hint:'Tool consolidation savings' },
  upskilling: { label:'Upskilling',              hint:'Competency coverage → gains' }
};

const symbol = (c:Currency)=> c==='EUR'?'€':c==='USD'?'$':'£';
const money = (n:number,c:Currency)=> new Intl.NumberFormat('en',{style:'currency',currency:c,maximumFractionDigits:0}).format(n);
const clamp = (n:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,n));
const hourlyFromSalary = (s:number)=> s/(52*40);

/* ========= simple error boundary ========= */
class EB extends React.Component<{children:React.ReactNode},{err?:Error}>{
  constructor(p:any){ super(p); this.state={}; }
  static getDerivedStateFromError(e:Error){ return { err:e }; }
  componentDidCatch(e:Error, info:any){ console.error('Runtime error:', e, info); }
  render(){
    if(this.state.err){
      return (
        <main style={{maxWidth:980,margin:'24px auto',padding:'0 16px'}}>
          <div style={{background:'#fff5f5',border:'1px solid #ffd6d6',borderRadius:12,padding:16}}>
            <h2 style={{marginTop:0}}>Render error</h2>
            <pre style={{whiteSpace:'pre-wrap'}}>{String(this.state.err.message)}</pre>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

/* ========= page ========= */
export default function Page(){
  return (
    <EB>
      <Calculator/>
    </EB>
  );
}

/* ========= calculator (single-file) ========= */
function Calculator(){
  // nav
  const [step, setStep] = useState(0);

  // basics
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [team, setTeam] = useState<Team>('all');
  const [employees, setEmployees] = useState(150);
  const [avgSalary, setAvgSalary] = useState(52000);
  const [trainingPerEmployee, setTrainingPerEmployee] = useState(850);
  const [durationMonths, setDurationMonths] = useState(3);
  const hourly = useMemo(()=>hourlyFromSalary(avgSalary),[avgSalary]);
  const programCost = trainingPerEmployee * employees * (durationMonths/12);

  // choose top 3
  const [selected, setSelected] = useState<Goal[]>(['throughput','retention','upskilling']);
  const toggleGoal = (g:Goal)=> setSelected(prev=>{
    const on = prev.includes(g);
    if(on) return prev.filter(x=>x!==g);
    if(prev.length>=3) return prev; // max 3
    return [...prev,g];
  });

  // throughput
  const [tpHoursPerWeek, setTpHoursPerWeek] = useState(3);
  const [tpUtilPct, setTpUtilPct] = useState(70);

  // quality
  const [qlEventsPerPersonPerMonth, setQlEventsPerPersonPerMonth] = useState(3);
  const [qlReductionPct, setQlReductionPct] = useState(20);
  const [qlHoursPerFix, setQlHoursPerFix] = useState(1);

  // onboarding
  const [obHiresPerYear, setObHiresPerYear] = useState(24);
  const [obBaselineRamp, setObBaselineRamp] = useState(3);
  const [obImprovedRamp, setObImprovedRamp] = useState(2);

  // retention
  const [rtBaselineTurnoverPct, setRtBaselineTurnoverPct] = useState(20);
  const [rtReductionPct, setRtReductionPct] = useState(10);
  const [rtReplacementCostPct, setRtReplacementCostPct] = useState(50);

  // cost
  const [csConsolidationPerMonth, setCsConsolidationPerMonth] = useState(0);
  const [csEliminatedTools, setCsEliminatedTools] = useState(0);
  const [csAvgToolCostPerMonth, setCsAvgToolCostPerMonth] = useState(200);

  // upskilling
  const [upCoveragePct, setUpCoveragePct] = useState(60);
  const [upHoursPerWeek, setUpHoursPerWeek] = useState(2);
  const [upUtilPct, setUpUtilPct] = useState(70);

  // formulas
  const valThroughput = selected.includes('throughput')
    ? tpHoursPerWeek*52*employees*hourly*clamp(tpUtilPct/100,0,1) : 0;

  const valQuality = selected.includes('quality')
    ? (qlEventsPerPersonPerMonth*employees*12*(qlReductionPct/100)*qlHoursPerFix)*hourly*clamp(tpUtilPct/100,0,1) : 0;

  const valOnboarding = selected.includes('onboarding')
    ? clamp(obBaselineRamp - Math.min(obBaselineRamp, obImprovedRamp),0,24)*obHiresPerYear*(avgSalary/12)*clamp(tpUtilPct/100,0,1) : 0;

  const valRetention = selected.includes('retention')
    ? (employees*(rtBaselineTurnoverPct/100)*(rtReductionPct/100))*(avgSalary*(rtReplacementCostPct/100)) : 0;

  const valCost = selected.includes('cost')
    ? (csConsolidationPerMonth + csEliminatedTools*csAvgToolCostPerMonth)*12 : 0;

  const upBase = selected.includes('upskilling')
    ? (upCoveragePct/100)*employees*upHoursPerWeek*52*hourly*clamp(upUtilPct/100,0,1) : 0;
  const valUpskilling = (selected.includes('throughput') && selected.includes('upskilling')) ? upBase*0.7 : upBase;

  const annualValue = valThroughput+valQuality+valOnboarding+valRetention+valCost+valUpskilling;
  const monthlySavings = annualValue/12;
  const roiMultiple = programCost>0 ? (annualValue/programCost) : 0;
  const paybackMonths = monthlySavings>0 ? (programCost/monthlySavings) : Infinity;

  // steps
  const steps = [
    'Basics',
    'Pick top 3 priorities',
    ...selected.map(g=>`Configure: ${GOAL_META[g].label}`),
    'Results'
  ];
  const progress = steps.length>1 ? (step/(steps.length-1)) : 0;

  /* ===== styles ===== */
  const container = { maxWidth:1120, margin:'0 auto', padding:'20px 16px' } as const;
  const hero = {
    background:`linear-gradient(135deg,#4B6FFF 0%, ${BLUE} 60%)`,
    color:'#fff', borderRadius:18, boxShadow:'0 18px 40px rgba(15,42,120,.25)',
    padding:18, maxWidth:980, margin:'0 auto 16px', border:'1px solid rgba(255,255,255,.24)'
  } as const;
  const heroGrid = { display:'grid', gap:10, gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))' } as const;
  const heroStat = { border:'1px solid rgba(255,255,255,.35)', borderRadius:12, padding:'10px 12px', background:'rgba(255,255,255,.10)', fontWeight:800 } as const;

  const card = { background:'#fff', border:'1px solid #E7ECF7', borderRadius:16, boxShadow:'0 10px 28px rgba(12,20,38,.08)', padding:18, maxWidth:980, margin:'16px auto' } as const;
  const h3 = { margin:'0 0 .7rem', fontSize:'1.06rem', fontWeight:900, color:'#0F172A' } as const;
  const grid = { display:'grid', gap:14, gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))' } as const;
  const input = { width:'100%', border:'1px solid #E2E8F5', borderRadius:12, padding:'10px 12px' } as const;
  const label = { fontWeight:800 } as const;
  const help = { fontSize:'.86rem', color:'#667085' } as const;
  const btn = { display:'inline-flex', alignItems:'center', gap:8, padding:'10px 14px', borderRadius:12, fontWeight:800, border:'1px solid #E7ECF7', cursor:'pointer', background:'#fff' } as const;
  const btnPrimary = { ...btn, background:`linear-gradient(90deg,#5A7BFF,${BLUE})`, color:'#fff', borderColor:'transparent', boxShadow:'0 8px 20px rgba(31,77,255,.25)' } as const;

  return (
    <main style={container}>
      {/* hero */}
      <section style={hero}>
        <h1 style={{margin:0,fontSize:'1.25rem',fontWeight:900}}>AI at Work — Human Productivity ROI</h1>
        <p style={{margin:'6px 0 10px',color:'rgba(255,255,255,.92)'}}>
          Quantify time saved, payback, and retention impact from training managers and teams to work effectively with AI.
        </p>
        <div style={heroGrid}>
          <div style={heroStat}>Payback (months): <strong>{Number.isFinite(paybackMonths)?paybackMonths.toFixed(1):'—'}</strong></div>
          <div style={heroStat}>Annual ROI (×): <strong>{roiMultiple.toFixed(1)}</strong></div>
          <div style={heroStat}>Annual Value: <strong>{money(annualValue,currency)}</strong></div>
          <div style={heroStat}>Monthly Savings: <strong>{money(monthlySavings,currency)}</strong></div>
        </div>
      </section>

      {/* progress */}
      <section style={{...card,padding:12}}>
        <div style={{height:10,background:'#E9EDFB',borderRadius:999,overflow:'hidden'}}>
          <span style={{display:'block',height:'100%',width:`${progress*100}%`,background:`linear-gradient(90deg,#6D8BFF,${BLUE})`}}/>
        </div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center',marginTop:10}}>
          {steps.map((t,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:8,color:i<=step?'#0F172A':'#8892A6'}}>
              <div style={{
                width:28,height:28,borderRadius:999,
                border:i<=step?'none':'2px solid #CFD8FF',
                background:i<=step?BLUE:'#fff',
                color:i<=step?'#fff':'#0E1320',
                display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:13
              }}>{i+1}</div>
              <span style={{fontWeight:800,fontSize:13}}>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* step 0: basics */}
      {step===0 && (
        <section style={card}>
          <h3 style={h3}>Basics</h3>
          <div style={grid}>
            <div>
              <label style={label}>Department</label>
              <select value={team} onChange={e=>setTeam(e.target.value as Team)} style={input}>
                {TEAMS.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <p style={help}>Choose a function or “Company-wide”.</p>
            </div>
            <div>
              <label style={label}>Employees in scope</label>
              <input type="number" min={1} value={employees} onChange={e=>setEmployees(Number(e.target.value||0))} style={input}/>
            </div>
            <div>
              <label style={label}>Currency</label>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {(['EUR','USD','GBP'] as Currency[]).map(c=>(
                  <button key={c} type="button"
                    onClick={()=>setCurrency(c)}
                    style={{
                      display:'inline-flex',alignItems:'center',gap:8,padding:'8px 10px',borderRadius:999,
                      border:`1px solid ${currency===c?'transparent':'#E7ECF7'}`,
                      background: currency===c?BLUE:'#fff',
                      color: currency===c?'#fff':'#0E1320', fontWeight:800, cursor:'pointer'
                    }}>{c}</button>
                ))}
              </div>
            </div>
          </div>

          <div style={{marginTop:14}}>
            <h4 style={{margin:'0 0 8px',fontSize:'.95rem',fontWeight:900}}>Program cost assumptions</h4>
            <div style={grid}>
              <FieldNum label={`Average annual salary (${symbol(currency)})`} v={avgSalary} set={setAvgSalary} step={1000}/>
              <FieldNum label={`Training per employee (${symbol(currency)})`} v={trainingPerEmployee} set={setTrainingPerEmployee} step={25}/>
              <FieldNum label="Program duration (months)" v={durationMonths} set={setDurationMonths} step={1}/>
            </div>
          </div>

          <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
            <button style={btnPrimary} onClick={()=>setStep(1)}>Continue →</button>
          </div>
        </section>
      )}

      {/* step 1: pick top 3 */}
      {step===1 && (
        <section style={card}>
          <h3 style={h3}>Pick your top 3 priorities</h3>
          <p style={help}>Choose up to three. The next screens will adapt.</p>

          <div style={{display:'grid',gap:12,gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))'}}>
            {(Object.keys(GOAL_META) as Goal[]).map(g=>{
              const on = selected.includes(g);
              return (
                <div key={g} style={{border:'1px solid #E7ECF7',borderRadius:14,padding:12,background:on?'rgba(51,102,254,.06)':'#fff'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}>
                    <button type="button"
                      onClick={()=>toggleGoal(g)}
                      style={{
                        display:'inline-flex',alignItems:'center',gap:8,padding:'8px 10px',
                        borderRadius:999,border:`1px solid ${on?'transparent':'#E7ECF7'}`,
                        background:on?BLUE:'#fff', color:on?'#fff':'#0E1320', fontWeight:800, cursor:'pointer'
                      }}>
                      {GOAL_META[g].label}
                    </button>
                  </div>
                  <div style={{marginTop:8,fontSize:'.86rem',color:'#667085'}}>{GOAL_META[g].hint}</div>
                </div>
              );
            })}
          </div>

          <div style={{display:'flex',justifyContent:'space-between',gap:8,marginTop:12}}>
            <button style={btn} onClick={()=>setStep(0)}>← Back</button>
            <button style={btnPrimary} onClick={()=>setStep(2)} disabled={selected.length===0}>Continue →</button>
          </div>
        </section>
      )}

      {/* steps 2..N-1: each selected goal gets its own simple inputs */}
      {selected.map((g, idx)=>{
        const idxStep = 2+idx;
        if(step!==idxStep) return null;
        return (
          <section key={g} style={card}>
            <h3 style={h3}>{GOAL_META[g].label}</h3>
            <p style={help}>{GOAL_META[g].hint}</p>

            {g==='throughput' && (
              <div style={grid}>
                <FieldNum label="Hours saved per person / week" v={tpHoursPerWeek} set={setTpHoursPerWeek} step={0.5}/>
                <FieldNum label="Utilization factor (%)" v={tpUtilPct} set={setTpUtilPct} min={0} max={100} step={5}/>
              </div>
            )}
            {g==='quality' && (
              <div style={grid}>
                <FieldNum label="Rework events / person / month" v={qlEventsPerPersonPerMonth} set={setQlEventsPerPersonPerMonth} step={1}/>
                <FieldNum label="Expected reduction (%)" v={qlReductionPct} set={setQlReductionPct} min={0} max={100} step={1}/>
                <FieldNum label="Hours per fix" v={qlHoursPerFix} set={setQlHoursPerFix} step={0.5}/>
              </div>
            )}
            {g==='onboarding' && (
              <div style={grid}>
                <FieldNum label="New hires / year" v={obHiresPerYear} set={setObHiresPerYear} step={1}/>
                <FieldNum label="Baseline ramp (months)" v={obBaselineRamp} set={setObBaselineRamp} step={0.5}/>
                <FieldNum label="Improved ramp (months)" v={obImprovedRamp} set={setObImprovedRamp} step={0.5}/>
              </div>
            )}
            {g==='retention' && (
              <div style={grid}>
                <FieldNum label="Baseline annual turnover (%)" v={rtBaselineTurnoverPct} set={setRtBaselineTurnoverPct} min={0} max={100} step={1}/>
                <FieldNum label="Expected reduction (%)" v={rtReductionPct} set={setRtReductionPct} min={0} max={100} step={1}/>
                <FieldNum label="Replacement cost (% of salary)" v={rtReplacementCostPct} set={setRtReplacementCostPct} min={0} max={200} step={5}/>
              </div>
            )}
            {g==='cost' && (
              <div style={grid}>
                <FieldNum label={`Consolidation savings / month (${symbol(currency)})`} v={csConsolidationPerMonth} set={setCsConsolidationPerMonth} step={50}/>
                <FieldNum label="Eliminated tools (count)" v={csEliminatedTools} set={setCsEliminatedTools} step={1}/>
                <FieldNum label={`Avg tool cost / month (${symbol(currency)})`} v={csAvgToolCostPerMonth} set={setCsAvgToolCostPerMonth} step={20}/>
              </div>
            )}
            {g==='upskilling' && (
              <div style={grid}>
                <FieldNum label="Competency coverage after program (%)" v={upCoveragePct} set={setUpCoveragePct} min={0} max={100} step={5}/>
                <FieldNum label="Hours saved per competent person / week" v={upHoursPerWeek} set={setUpHoursPerWeek} step={0.5}/>
                <FieldNum label="Utilization factor (%)" v={upUtilPct} set={setUpUtilPct} min={0} max={100} step={5}/>
              </div>
            )}

            <div style={{display:'flex',justifyContent:'space-between',gap:8,marginTop:12}}>
              <button style={btn} onClick={()=>setStep(idxStep-1)}>← Back</button>
              <button style={btnPrimary} onClick={()=>setStep(idxStep+1)}>Continue →</button>
            </div>
          </section>
        );
      })}

      {/* results */}
      {step === (2 + selected.length) && (
        <section style={card}>
          <h3 style={h3}>Results</h3>
          <div style={{display:'grid',gap:12,gridTemplateColumns:'repeat(2,minmax(0,1fr))'}}>
            <KPI t="Total annual value" v={money(annualValue,currency)} />
            <KPI t="Annual ROI" v={`${roiMultiple.toFixed(1)}×`} />
            <KPI t="Payback" v={Number.isFinite(paybackMonths)?`${paybackMonths.toFixed(1)} mo`:'—'} />
            <KPI t="Monthly savings" v={money(monthlySavings,currency)} />
          </div>
          <div style={{marginTop:12,padding:'12px 14px',border:'1px solid #E7ECF7',borderRadius:12,background:'#F8FAFF'}}>
            <strong>Next steps:</strong>{' '}
            {selected.includes('throughput') && 'Map top workflows → prompt libraries + QA gates. '}
            {selected.includes('quality') && 'Introduce AI review checkpoints to cut rework. '}
            {selected.includes('onboarding') && 'Role playbooks + guided “first 90 days”. '}
            {selected.includes('retention') && 'AI Champions cohort; quarterly ROI reviews. '}
            {selected.includes('cost') && 'Audit overlap; pilot tool consolidation. '}
            {selected.includes('upskilling') && 'Set competency targets; measure weekly AI usage.'}
          </div>
          <div style={{display:'flex',justifyContent:'space-between',gap:8,marginTop:12}}>
            <button style={btn} onClick={()=>setStep(2+selected.length-1)}>← Back</button>
            <button style={btnPrimary} onClick={()=>setStep(0)}>Start over</button>
          </div>
        </section>
      )}

      <section style={{textAlign:'center',color:'#667085',fontSize:12,padding:'8px 0 24px'}}>
        Build: {new Date().toISOString()}
      </section>
    </main>
  );
}

/* ===== small UI bits ===== */
function FieldNum({label,v,set,min,max,step}:{label:string;v:number;set:(n:number)=>void;min?:number;max?:number;step?:number}){
  return (
    <div>
      <label style={{fontWeight:800}}>{label}</label>
      <input type="number" value={v} min={min} max={max} step={step}
        onChange={e=>set(Number(e.target.value||0))}
        style={{width:'100%',border:'1px solid #E2E8F5',borderRadius:12,padding:'10px 12px'}}/>
    </div>
  );
}

function KPI({t,v}:{t:string;v:string}){
  return (
    <div style={{ background:'#fff', border:'1px solid #E8EEFF', borderRadius:14, padding:14, position:'relative' }}>
      <div style={{ position:'absolute', left:0, top:0, right:0, height:4, borderRadius:'14px 14px 0 0', background:`linear-gradient(90deg,#6D8BFF,${BLUE})` }} />
      <div style={{ fontSize:12, color:'#64748B', fontWeight:800, marginTop:2 }}>{t}</div>
      <div style={{ fontWeight:900, fontSize:'1.1rem' }}>{v}</div>
    </div>
  );
}
