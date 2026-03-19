import { useState, useRef, useEffect } from "react";

function fmt(n) {
  if (!n || isNaN(n)) return '$0';
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return '$' + Math.round(n / 1000) + 'K';
  return '$' + Math.round(n);
}

function useAutoFocus() {
  const ref = useRef(null);
  useEffect(() => { const t = setTimeout(() => ref.current?.focus(), 80); return () => clearTimeout(t); }, []);
  return ref;
}

const S = {
  root: { background: '#0a1a14', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#f5f0e8', display: 'flex', flexDirection: 'column' },
  label: { fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#2d8a6e' },
  serif: (size, color = '#f5f0e8', extra = {}) => ({ fontFamily: "'DM Serif Display', serif", fontSize: size, color, lineHeight: 1.1, ...extra }),
  tray: { background: '#1a3a2a', padding: '2.5rem 3rem', display: 'flex', alignItems: 'center', gap: '1.5rem' },
  trayInput: { flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.4rem,2.5vw,2rem)', color: '#f5f0e8', caretColor: '#2d8a6e' },
  goBtn: (show) => ({ padding: '0.75rem 1.5rem', background: '#2d8a6e', border: 'none', color: '#f5f0e8', fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', flexShrink: 0, opacity: show ? 1 : 0, pointerEvents: show ? 'all' : 'none', transition: 'opacity 0.3s' }),
  leftPanel: { width: '40%', background: '#1a3a2a', padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem' },
  rightPanel: { flex: 1, padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  lItemLabel: { fontSize: '0.52rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2d8a6e', marginBottom: '0.35rem' },
  lItemVal: { fontFamily: "'DM Serif Display', serif", fontSize: '1.05rem', color: '#f5f0e8', fontStyle: 'italic', lineHeight: 1.4 },
  lDiv: { height: '1px', background: 'rgba(45,138,110,0.15)' },
  bigQ: (light) => ({ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: light ? '#0a1a14' : '#f5f0e8', lineHeight: 1.1, marginBottom: '0.4rem' }),
  sub: (light) => ({ fontSize: '0.78rem', color: light ? 'rgba(10,26,20,0.35)' : 'rgba(245,240,232,0.25)', lineHeight: 1.7, maxWidth: '420px', marginBottom: '2.5rem' }),
  textArea: { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(10,26,20,0.2)', outline: 'none', fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.4rem,2.5vw,2rem)', color: '#0a1a14', padding: '0.5rem 0', caretColor: '#1a3a2a', resize: 'none', overflow: 'hidden' },
  continueBtn: (show) => ({ marginTop: '2rem', padding: '0.85rem 1.75rem', background: '#0a1a14', border: '1px solid #0a1a14', color: '#f5f0e8', fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', alignSelf: 'flex-start', opacity: show ? 1 : 0, pointerEvents: show ? 'all' : 'none', transition: 'opacity 0.3s' }),
};

function AutoResizeTextarea({ style, onValueChange, onEnter, ...props }) {
  const ref = useRef(null);
  const autoRef = useAutoFocus();
  const handleChange = (e) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
    onValueChange(e.target.value);
  };
  return (
    <textarea
      ref={el => { ref.current = el; autoRef.current = el; }}
      rows={1}
      style={style}
      onChange={handleChange}
      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onEnter(); } }}
      {...props}
    />
  );
}

function LeftPanel({ items }) {
  return (
    <div style={S.leftPanel}>
      {items.map((item, i) => (
        <div key={i}>
          {i > 0 && <div style={{ ...S.lDiv, marginBottom: '2rem' }} />}
          <div style={S.lItemLabel}>{item.label}</div>
          <div style={S.lItemVal}>"{item.val}"</div>
        </div>
      ))}
    </div>
  );
}

function Step0({ onNext }) {
  const [val, setVal] = useState('');
  const ref = useAutoFocus();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', textAlign: 'center' }}>
        <div>
          <div style={{ ...S.label, marginBottom: '1.5rem' }}>One Team</div>
          <div style={S.serif('clamp(2rem,4vw,3rem)')}>What needs to happen</div>
          <div style={S.serif('clamp(2rem,4vw,3rem)', 'rgba(245,240,232,0.22)', { fontStyle: 'italic' })}>this year?</div>
        </div>
      </div>
      <div style={S.tray}>
        <input ref={ref} type="text" value={val} onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && val.trim() && onNext(val.trim())}
          placeholder="The number, the market, the motion — in your words."
          style={{ ...S.trayInput }}
        />
        <button style={S.goBtn(val.trim().length > 0)} onClick={() => val.trim() && onNext(val.trim())}>Continue →</button>
      </div>
    </div>
  );
}

function StepTextarea({ leftItems, question, sub, onNext }) {
  const [val, setVal] = useState('');
  return (
    <div style={{ display: 'flex', flex: 1, background: '#f5f0e8' }}>
      <LeftPanel items={leftItems} />
      <div style={S.rightPanel}>
        <div style={S.bigQ(true)}>{question}</div>
        {sub && <div style={S.sub(true)}>{sub}</div>}
        <AutoResizeTextarea style={S.textArea} onValueChange={setVal} onEnter={() => val.trim() && onNext(val.trim())} />
        <button style={S.continueBtn(val.trim().length > 0)} onClick={() => val.trim() && onNext(val.trim())}>Continue →</button>
      </div>
    </div>
  );
}

function StepNumber({ label, question, sub, buttonText, onNext }) {
  const [raw, setRaw] = useState('');
  const ref = useAutoFocus();
  const numeric = parseInt(raw.replace(/,/g, '')) || 0;
  const handleInput = (e) => {
    const digits = e.target.value.replace(/[^0-9]/g, '');
    setRaw(digits ? parseInt(digits).toLocaleString() : '');
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', textAlign: 'center' }}>
        <div>
          <div style={{ ...S.label, marginBottom: '1.5rem' }}>{label}</div>
          <div style={S.serif('clamp(2rem,4vw,3rem)')}>{question}</div>
          {sub && <div style={{ fontSize: '0.78rem', color: 'rgba(245,240,232,0.25)', marginTop: '1rem' }}>{sub}</div>}
        </div>
      </div>
      <div style={S.tray}>
        <span style={S.serif('clamp(1.6rem,3vw,2.4rem)', 'rgba(245,240,232,0.2)', { flexShrink: 0 })}>$</span>
        <input ref={ref} type="text" value={raw} onChange={handleInput}
          onKeyDown={e => e.key === 'Enter' && numeric > 0 && onNext(numeric)}
          placeholder="0" style={S.trayInput}
        />
        <button style={S.goBtn(numeric > 0)} onClick={() => numeric > 0 && onNext(numeric)}>{buttonText}</button>
      </div>
    </div>
  );
}

function Reveal({ payroll, actual }) {
  const opp = payroll > actual ? payroll - actual : 0;
  const total = payroll + opp;
  return (
    <div style={{ display: 'flex', flex: 1 }}>
      <div style={{ width: '50%', padding: '4rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid rgba(45,138,110,0.1)' }}>
        <div style={{ ...S.label, marginBottom: '3rem' }}>The cost of the wrong direction</div>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.2)', marginBottom: '0.5rem' }}>Fixed cost — what the team costs to run</div>
          <div style={S.serif('clamp(2.5rem,5vw,3.5rem)')}>{fmt(payroll)}</div>
          <div style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.2)', marginTop: '0.3rem' }}>per year in payroll</div>
        </div>
        <div style={{ height: '1px', background: 'rgba(45,138,110,0.1)', margin: '2rem 0' }} />
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.2)', marginBottom: '0.5rem' }}>Opportunity cost — revenue that isn't there</div>
          <div style={S.serif('clamp(2.5rem,5vw,3.5rem)', 'rgba(192,57,43,0.8)')}>{fmt(opp)}</div>
          <div style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.2)', marginTop: '0.3rem' }}>gap between what's going in and what's coming out</div>
        </div>
        <div style={{ height: '1px', background: 'rgba(45,138,110,0.1)', margin: '2rem 0' }} />
        <div>
          <div style={{ fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.2)', marginBottom: '0.5rem' }}>Total — sails pointed the wrong way</div>
          <div style={S.serif('clamp(3rem,6vw,4.5rem)')}>{fmt(total)}</div>
          <div style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.2)', marginTop: '0.3rem' }}>and compounding every month</div>
        </div>
      </div>
      <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderBottom: '1px solid rgba(45,138,110,0.1)', cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(192,57,43,0.05)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <div style={{ fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(192,57,43,0.5)', marginBottom: '1rem' }}>Option A</div>
          <div style={S.serif('clamp(1.6rem,3vw,2.2rem)', '#f5f0e8', { marginBottom: '0.75rem' })}>Stay the course.</div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(245,240,232,0.3)', lineHeight: 1.7, maxWidth: '300px' }}>The team is working hard. Maybe the motion just needs more time.</div>
        </div>
        <div style={{ flex: 1, padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(45,138,110,0.04)', cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(45,138,110,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(45,138,110,0.04)'}>
          <div style={{ fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2d8a6e', marginBottom: '1rem' }}>Option B</div>
          <div style={S.serif('clamp(1.6rem,3vw,2.2rem)', '#f5f0e8', { marginBottom: '0.75rem' })}>Point the sails the right way.</div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(245,240,232,0.3)', lineHeight: 1.7, maxWidth: '300px' }}>Get fractional revenue leadership inside the team. Someone who's built this motion before.</div>
          <a href="https://tally.so/r/VLPjKa" target="_blank" rel="noopener noreferrer"
            style={{ marginTop: '2rem', padding: '1rem 2rem', background: '#2d8a6e', border: 'none', color: '#f5f0e8', fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', alignSelf: 'flex-start', textDecoration: 'none', display: 'inline-block' }}>
            Book One Team →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function OneTeamCTA() {
  const [step, setStep] = useState(0);
  const [a0, setA0] = useState('');
  const [a1, setA1] = useState('');
  const [a2, setA2] = useState('');
  const [payroll, setPayroll] = useState(0);
  const [actual, setActual] = useState(0);

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        textarea::placeholder { color: rgba(245,240,232,0.1); }
        input::placeholder { color: rgba(245,240,232,0.12); }
      `}</style>

      {/* Nav */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 30, pointerEvents: 'none' }}>
        <a onClick={() => window.history.back()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(45,138,110,0.6)', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', pointerEvents: 'all', cursor: 'pointer' }}>← Back</a>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem', fontWeight: 400, letterSpacing: '0.05em', color: '#f5f0e8', textDecoration: 'none', pointerEvents: 'all' }}>
          <div style={{ width: 24, height: 12, background: '#f5f0e8', borderRadius: 6 }} />
          drvrs
        </a>
      </div>

      {step === 0 && <Step0 onNext={v => { setA0(v); setStep(1); }} />}
      {step === 1 && <StepTextarea
        leftItems={[{ label: 'What needs to happen', val: a0 }]}
        question="Where are you right now?"
        sub="Honest. Not the board deck version."
        onNext={v => { setA1(v); setStep(2); }}
      />}
      {step === 2 && <StepTextarea
        leftItems={[{ label: 'What needs to happen', val: a0 }, { label: 'Where you are', val: a1 }]}
        question="And if you don't get there?"
        sub=""
        onNext={v => { setA2(v); setStep(3); }}
      />}
      {step === 3 && <StepTextarea
        leftItems={[{ label: 'What needs to happen', val: a0 }, { label: 'Where you are', val: a1 }, { label: 'At stake', val: a2 }]}
        question="Why's that?"
        sub=""
        onNext={v => { setStep(4); }}
      />}
      {step === 4 && <StepNumber
        label="Now the numbers"
        question={<>What does your revenue team <em style={{ color: 'rgba(245,240,232,0.22)', fontStyle: 'italic' }}>cost to run annually?</em></>}
        sub="Total payroll — reps, managers, SDRs. Everyone carrying a number."
        buttonText="Continue →"
        onNext={v => { setPayroll(v); setStep(5); }}
      />}
      {step === 5 && <StepNumber
        label="One Team"
        question={<>What are they actually <em style={{ color: 'rgba(245,240,232,0.22)', fontStyle: 'italic' }}>producing right now?</em></>}
        sub="Confirmed revenue. Not pipeline. Not forecast."
        buttonText="Show me the cost →"
        onNext={v => { setActual(v); setStep(6); }}
      />}
      {step === 6 && <Reveal payroll={payroll} actual={actual} />}
    </div>
  );
}