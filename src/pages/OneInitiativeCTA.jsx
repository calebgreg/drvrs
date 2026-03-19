import { useState, useRef, useEffect } from "react";

const NODES = [
  { id: 'budget',    x: 450, y: 140, r: 38, label: 'Budget',          q: 'How much has been allocated or spent?' },
  { id: 'people',    x: 720, y: 260, r: 34, label: 'People',          q: 'Who and how many have been pulled in?' },
  { id: 'time',      x: 760, y: 490, r: 30, label: 'Time',            q: 'How long has this been in motion?' },
  { id: 'momentum',  x: 550, y: 610, r: 30, label: 'Momentum',        q: 'How is team energy around this?' },
  { id: 'focus',     x: 350, y: 610, r: 30, label: 'Strategic focus', q: 'What got deprioritized for this?' },
  { id: 'trust',     x: 140, y: 490, r: 30, label: 'Trust',           q: 'Who is watching this — board, CEO, customers?' },
  { id: 'decisions', x: 180, y: 260, r: 30, label: 'Decisions made',  q: 'What has already been committed or locked in?' },
];

const EDGES = [
  ['budget','people'],['budget','decisions'],['budget','focus'],
  ['people','time'],['people','momentum'],
  ['time','momentum'],['momentum','focus'],
  ['focus','trust'],['trust','decisions'],['decisions','budget'],
  ['time','trust'],['people','focus'],
];

function fmt(n) {
  if (!n) return '$0';
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return '$' + Math.round(n / 1000) + 'K';
  return '$' + Math.round(n);
}

const S = {
  root: { background: '#0a1a14', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#f5f0e8', display: 'flex', flexDirection: 'column' },
  label: { fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#2d8a6e', marginBottom: '1.5rem' },
  serif: (size, color = '#f5f0e8', extra = {}) => ({ fontFamily: "'DM Serif Display', serif", fontSize: size, color, lineHeight: 1.1, ...extra }),
  tray: { background: '#1a3a2a', padding: '2.5rem 3rem', display: 'flex', alignItems: 'center', gap: '1.5rem' },
  trayInput: { flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: "'DM Serif Display', serif", fontSize: '1.6rem', color: '#f5f0e8', caretColor: '#2d8a6e' },
  goBtn: { padding: '0.75rem 1.5rem', background: '#2d8a6e', border: 'none', color: '#f5f0e8', fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' },
  leftPanel: { width: '40%', background: '#1a3a2a', padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  rightPanel: { flex: 1, padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  bigQ: (color = '#0a1a14') => ({ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2rem,3.5vw,2.8rem)', color, lineHeight: 1.1, marginBottom: '3rem' }),
  textArea: (color = '#0a1a14') => ({ width: '100%', background: 'transparent', border: 'none', borderBottom: `2px solid ${color === '#0a1a14' ? 'rgba(10,26,20,0.2)' : 'rgba(245,240,232,0.15)'}`, outline: 'none', fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem', color, padding: '0.5rem 0 0.75rem', caretColor: color === '#0a1a14' ? '#1a3a2a' : '#2d8a6e', resize: 'none', overflow: 'hidden' }),
  continueBtn: (show, dark = false) => ({ marginTop: '2rem', padding: '0.85rem 1.75rem', background: dark ? '#0a1a14' : 'transparent', border: dark ? 'none' : '1px solid rgba(45,138,110,0.35)', color: dark ? '#f5f0e8' : '#2d8a6e', fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', alignSelf: 'flex-start', opacity: show ? 1 : 0, pointerEvents: show ? 'all' : 'none', transition: 'opacity 0.3s' }),
};

function useAutoFocus() {
  const ref = useRef(null);
  useEffect(() => { const t = setTimeout(() => ref.current?.focus(), 80); return () => clearTimeout(t); }, []);
  return ref;
}

function Step0({ onNext }) {
  const [val, setVal] = useState('');
  const ref = useAutoFocus();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', textAlign: 'center' }}>
        <div>
          <div style={S.label}>One Initiative</div>
          <div style={S.serif('clamp(2rem,4vw,3rem)')}>
            What's a bet you made
            <em style={{ color: 'rgba(245,240,232,0.25)', fontStyle: 'italic', display: 'block' }}>that needs to pay off?</em>
          </div>
        </div>
      </div>
      <div style={S.tray}>
        <input ref={ref} type="text" value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && val.trim() && onNext(val.trim())} placeholder="Name it." style={S.trayInput} />
        <button style={S.goBtn} onClick={() => val.trim() && onNext(val.trim())}>Continue →</button>
      </div>
    </div>
  );
}

function Step1({ bet, onNext }) {
  const [val, setVal] = useState('');
  const ref = useAutoFocus();
  const taRef = useRef(null);
  const resize = el => { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; };
  return (
    <div style={{ display: 'flex', flex: 1, background: '#f5f0e8' }}>
      <div style={S.leftPanel}>
        <div style={{ fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2d8a6e', marginBottom: '1rem' }}>The bet</div>
        <div style={S.serif('clamp(1rem,1.5vw,1.3rem)', '#f5f0e8', { fontStyle: 'italic', lineHeight: 1.5 })}>"{bet}"</div>
      </div>
      <div style={S.rightPanel}>
        <div style={S.bigQ()}>And if it doesn't?</div>
        <textarea ref={el => { taRef.current = el; if (el && !val) setTimeout(() => el.focus(), 80); }} value={val} rows={1}
          onChange={e => { setVal(e.target.value); resize(e.target); }}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); val.trim() && onNext(val.trim()); } }}
          style={S.textArea()} />
        <button style={S.continueBtn(val.trim().length > 0, true)} onClick={() => val.trim() && onNext(val.trim())}>Continue →</button>
      </div>
    </div>
  );
}

function Step2({ bet, stake, onNext }) {
  const [val, setVal] = useState('');
  const taRef = useRef(null);
  const resize = el => { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; };
  useEffect(() => { setTimeout(() => taRef.current?.focus(), 80); }, []);
  return (
    <div style={{ display: 'flex', flex: 1, background: '#f5f0e8' }}>
      <div style={S.leftPanel}>
        <div style={{ fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2d8a6e', marginBottom: '1rem' }}>The bet</div>
        <div style={S.serif('clamp(1rem,1.5vw,1.3rem)', '#f5f0e8', { fontStyle: 'italic', lineHeight: 1.5 })}>{bet}</div>
        <div style={{ height: '1px', background: 'rgba(45,138,110,0.15)', margin: '1.5rem 0' }} />
        <div style={{ fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2d8a6e', marginBottom: '1rem' }}>If it doesn't</div>
        <div style={S.serif('clamp(1rem,1.5vw,1.3rem)', '#f5f0e8', { fontStyle: 'italic', lineHeight: 1.5 })}>{stake}</div>
      </div>
      <div style={S.rightPanel}>
        <div style={S.bigQ()}>Why's that?</div>
        <textarea ref={taRef} value={val} rows={1}
          onChange={e => { setVal(e.target.value); resize(e.target); }}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); val.trim() && onNext(val.trim()); } }}
          style={S.textArea()} />
        <button style={S.continueBtn(val.trim().length > 0, true)} onClick={() => val.trim() && onNext(val.trim())}>Continue →</button>
      </div>
    </div>
  );
}

function Step3({ onNext }) {
  const [raw, setRaw] = useState('');
  const ref = useAutoFocus();
  const numeric = parseInt(raw.replace(/[^0-9]/g, '')) || 0;
  const hasVal = raw.replace(/[^0-9]/g, '').length > 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', textAlign: 'center' }}>
        <div>
          <div style={S.label}>One Initiative</div>
          <div style={S.serif('clamp(1.8rem,3.5vw,2.6rem)', '#f5f0e8')}>What was this supposed to produce?</div>
          <div style={S.serif('clamp(1.8rem,3.5vw,2.6rem)', 'rgba(245,240,232,0.22)', { fontStyle: 'italic', marginBottom: '2rem' })}>And what's that worth in a year?</div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(245,240,232,0.25)', lineHeight: 1.7, maxWidth: '440px', margin: '0 auto' }}>Revenue unlocked, cost eliminated, or capability created. Ballpark is fine.</div>
        </div>
      </div>
      <div style={S.tray}>
        <span style={S.serif('clamp(2rem,4vw,3.5rem)', 'rgba(245,240,232,0.25)', { marginRight: '0.25rem' })}>$</span>
        <input ref={ref} type="text" value={raw}
          onChange={e => { const d = e.target.value.replace(/[^0-9]/g, ''); setRaw(d ? parseInt(d).toLocaleString() : ''); }}
          onKeyDown={e => e.key === 'Enter' && hasVal && onNext(numeric)}
          placeholder="0"
          style={{ ...S.trayInput, fontSize: 'clamp(2rem,4vw,3.5rem)' }} />
        <button style={{ ...S.goBtn, opacity: hasVal ? 1 : 0.3, pointerEvents: hasVal ? 'all' : 'none', transition: 'opacity 0.3s' }} onClick={() => hasVal && onNext(numeric)}>Show the cost →</button>
      </div>
    </div>
  );
}

function NodePopup({ node, svgEl, committed, onConfirm, onClose }) {
  const [detail, setDetail] = useState(committed[node.id]?.detail || '');
  const ref = useAutoFocus();

  const pos = (() => {
    if (!svgEl) return { left: 20, top: 20 };
    const rect = svgEl.getBoundingClientRect();
    const sx = rect.width / 900, sy = rect.height / 700;
    let px = rect.left + node.x * sx;
    let py = rect.top + node.y * sy + node.r * sy + 12;
    if (py + 200 > window.innerHeight) py = rect.top + node.y * sy - node.r * sy - 210;
    if (px + 340 > window.innerWidth) px = window.innerWidth - 350;
    if (px < 10) px = 10;
    return { left: px, top: py };
  })();

  return (
    <div style={{ position: 'fixed', ...pos, background: '#1a3a2a', border: '1px solid rgba(45,138,110,0.35)', padding: '1.25rem 1.5rem', minWidth: '260px', maxWidth: '320px', zIndex: 20 }}>
      <div style={{ fontSize: '0.52rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#2d8a6e', marginBottom: '0.5rem' }}>{node.label}</div>
      <div style={S.serif('1rem', '#f5f0e8', { lineHeight: 1.4, marginBottom: '0.75rem' })}>{node.q}</div>
      <input ref={ref} value={detail} onChange={e => setDetail(e.target.value)} onKeyDown={e => e.key === 'Enter' && onConfirm(detail)}
        placeholder="Optional — add specifics"
        style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(45,138,110,0.25)', outline: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#f5f0e8', padding: '0.4rem 0', caretColor: '#2d8a6e', marginBottom: '0.75rem' }} />
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => onConfirm(detail)} style={{ padding: '0.5rem 1rem', background: '#2d8a6e', border: 'none', color: '#f5f0e8', fontFamily: "'DM Sans', sans-serif", fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>This applies</button>
        <button onClick={onClose} style={{ padding: '0.5rem 0.75rem', background: 'transparent', border: '1px solid rgba(245,240,232,0.1)', color: 'rgba(245,240,232,0.3)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>Not this one</button>
      </div>
    </div>
  );
}

function Step4Web({ bet, stake, committed, onCommit, onReveal }) {
  const [popup, setPopup] = useState(null);
  const svgRef = useRef(null);
  const count = Object.keys(committed).length;

  const openNode = (node) => {
    setPopup(node);
  };

  const confirmNode = (detail) => {
    onCommit(popup.id, { label: popup.label, detail });
    setPopup(null);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Header */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '2rem 3rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', zIndex: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={S.serif('0.9rem', 'rgba(245,240,232,0.35)', { fontStyle: 'italic' })}>"{bet}"</div>
          <div style={S.serif('0.9rem', 'rgba(245,240,232,0.25)', { fontStyle: 'italic' })}>"{stake}"</div>
        </div>
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(45,138,110,0.5)', textAlign: 'right' }}>Tap a node to mark what's been committed</div>
      </div>

      {/* SVG */}
      <svg ref={svgRef} viewBox="0 0 900 700" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', flex: 1 }}>
        {EDGES.map(([a, b]) => {
          const na = NODES.find(n => n.id === a), nb = NODES.find(n => n.id === b);
          const bothLit = committed[a] && committed[b];
          return <line key={a+b} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke={bothLit ? 'rgba(45,138,110,0.45)' : 'rgba(45,138,110,0.2)'} strokeWidth="1" />;
        })}
        {NODES.map(n => {
          const lit = !!committed[n.id];
          const short = committed[n.id]?.detail?.substring(0, 30) + (committed[n.id]?.detail?.length > 30 ? '...' : '');
          return (
            <g key={n.id} style={{ cursor: 'pointer' }} onClick={() => openNode(n)}>
              <circle cx={n.x} cy={n.y} r={n.r + 8} fill="none" stroke="rgba(45,138,110,0.1)" strokeWidth="1" />
              <circle cx={n.x} cy={n.y} r={n.r} fill={lit ? 'rgba(45,138,110,0.3)' : 'rgba(45,138,110,0.08)'} stroke={lit ? '#2d8a6e' : 'rgba(45,138,110,0.4)'} strokeWidth={lit ? 2 : 1.5} />
              <text x={n.x} y={n.y + 4} textAnchor="middle" dominantBaseline="middle" fill={lit ? '#f5f0e8' : 'rgba(245,240,232,0.7)'} fontSize={n.r > 33 ? 11 : 10} fontFamily="DM Sans" letterSpacing="1">{n.label.toUpperCase()}</text>
              {lit && committed[n.id]?.detail && <text x={n.x} y={n.y + n.r + 18} textAnchor="middle" fill="rgba(245,240,232,0.4)" fontSize="8" fontFamily="DM Sans" fontStyle="italic">{short}</text>}
            </g>
          );
        })}
      </svg>

      {/* Bottom bar */}
      <div style={{ position: 'absolute', bottom: '2rem', left: '3rem', fontSize: '0.65rem', color: 'rgba(245,240,232,0.25)', letterSpacing: '0.08em' }}>
        {count > 0 ? `${count} area${count > 1 ? 's' : ''} marked` : ''}
      </div>
      <div style={{ position: 'absolute', bottom: '2rem', right: '3rem' }}>
        <button onClick={onReveal} style={{ padding: '0.85rem 2rem', background: '#2d8a6e', border: 'none', color: '#f5f0e8', fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', opacity: count > 0 ? 1 : 0, pointerEvents: count > 0 ? 'all' : 'none', transition: 'opacity 0.4s' }}>
          Show me what it's costing →
        </button>
      </div>

      {/* Popup */}
      {popup && <NodePopup node={popup} svgEl={svgRef.current} committed={committed} onConfirm={confirmNode} onClose={() => setPopup(null)} />}
    </div>
  );
}

function Step5Reveal({ bet, stake, value, committed }) {
  const pills = Object.values(committed);

  return (
    <div style={{ display: 'flex', flex: 1 }}>
      {/* Left */}
      <div style={{ width: '50%', padding: '4rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid rgba(45,138,110,0.1)' }}>
        <div style={{ fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.25)', marginBottom: '3rem' }}>The bet</div>

        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.52rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.2)', marginBottom: '0.5rem' }}>What you put in</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {pills.length === 0
              ? <span style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.25)', fontStyle: 'italic' }}>Nothing marked</span>
              : pills.map((v, i) => (
                <div key={i} style={{ fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(45,138,110,0.8)', border: '1px solid rgba(45,138,110,0.25)', padding: '4px 10px' }}>
                  {v.label}{v.detail ? ' — ' + v.detail : ''}
                </div>
              ))
            }
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(45,138,110,0.1)', marginBottom: '2.5rem' }} />

        <div style={{ marginBottom: '4rem' }}>
          <div style={{ fontSize: '0.52rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.2)', marginBottom: '0.5rem' }}>What you expected back</div>
          <div style={S.serif('clamp(2rem,4vw,3rem)')}>{value ? fmt(value) : '—'}</div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.25)', marginTop: '0.3rem' }}>per year</div>
        </div>

        <div style={S.serif('clamp(1.3rem,2vw,1.7rem)', 'rgba(245,240,232,0.5)', { lineHeight: 1.4, marginBottom: '0.5rem' })}>That return isn't here yet.</div>
        <div style={S.serif('clamp(1.3rem,2vw,1.7rem)', 'rgba(245,240,232,0.22)', { fontStyle: 'italic', lineHeight: 1.4 })}>So what do you do with the bet?</div>
      </div>

      {/* Right */}
      <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
        {/* Option A */}
        <div style={{ flex: 1, padding: '4rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderBottom: '1px solid rgba(45,138,110,0.1)', cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(192,57,43,0.06)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <div style={{ fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(192,57,43,0.5)', marginBottom: '1rem' }}>Option A</div>
          <div style={S.serif('clamp(1.6rem,3vw,2.4rem)', '#f5f0e8', { lineHeight: 1.1, marginBottom: '0.75rem' })}>Cut your losses.</div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(245,240,232,0.3)', lineHeight: 1.7, maxWidth: '320px' }}>Walk away from what you've committed. Accept the sunk cost. Move on to the next bet.</div>
        </div>

        {/* Option B */}
        <div style={{ flex: 1, padding: '4rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s', background: 'rgba(45,138,110,0.04)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(45,138,110,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(45,138,110,0.04)'}>
          <div style={{ fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2d8a6e', marginBottom: '1rem' }}>Option B</div>
          <div style={S.serif('clamp(1.6rem,3vw,2.4rem)', '#f5f0e8', { lineHeight: 1.1, marginBottom: '0.75rem' })}>Go all in.</div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(245,240,232,0.3)', lineHeight: 1.7, maxWidth: '320px' }}>Find what's actually blocking the return and remove it. The commitment is already made. Make it work.</div>
          <a href="https://tally.so/r/VLPjKa" target="_blank" rel="noopener noreferrer"
            style={{ marginTop: '2rem', padding: '1rem 2rem', background: '#2d8a6e', border: 'none', color: '#f5f0e8', fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', alignSelf: 'flex-start', textDecoration: 'none', display: 'inline-block' }}>
            Book One Initiative →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function OneInitiativeCTA() {
  const [step, setStep] = useState(0);
  const [bet, setBet] = useState('');
  const [stake, setStake] = useState('');
  const [why, setWhy] = useState('');
  const [value, setValue] = useState(0);
  const [committed, setCommitted] = useState({});

  const commitNode = (id, data) => {
    setCommitted(prev => ({ ...prev, [id]: data }));
  };

  const goReveal = () => {
    setStep(5); // skip loading for now, go straight to reveal
  };

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 30, pointerEvents: 'none' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(45,138,110,0.6)', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', pointerEvents: 'all' }}>← Back</a>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem', fontWeight: 400, letterSpacing: '0.05em', color: '#f5f0e8', textDecoration: 'none', pointerEvents: 'all' }}>
          <div style={{ width: 24, height: 12, background: '#f5f0e8', borderRadius: 6 }} />
          drvrs
        </a>
      </div>

      {step === 0 && <Step0 onNext={v => { setBet(v); setStep(1); }} />}
      {step === 1 && <Step1 bet={bet} onNext={v => { setStake(v); setStep(2); }} />}
      {step === 2 && <Step2 bet={bet} stake={stake} onNext={v => { setWhy(v); setStep(3); }} />}
      {step === 3 && <Step3 onNext={v => { setValue(v); setStep(4); }} />}
      {step === 4 && <Step4Web bet={bet} stake={stake} committed={committed} onCommit={commitNode} onReveal={goReveal} />}
      {step === 5 && <Step5Reveal bet={bet} stake={stake} value={value} committed={committed} />}
    </div>
  );
}