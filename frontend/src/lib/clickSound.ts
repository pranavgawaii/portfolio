let _ctx: AudioContext | null = null;
let _last = 0;

function getCtx(): AudioContext {
  if (!_ctx) _ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
}

// ─── Toggle click: A premium, crisp "glassy pop" (like iOS toggles) ───────────
export function playClick() {
  const now = performance.now();
  if (now - _last < 55) return;
  _last = now;
  try {
    const ac = getCtx();
    const t = ac.currentTime;

    const osc = ac.createOscillator();
    const gain = ac.createGain();
    // Premium Minimal Tick (like iOS toggle)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, t);
    osc.frequency.exponentialRampToValueAtTime(500, t + 0.015);
    
    // Instant attack, very fast decay
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);
    
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.025);
  } catch { /* silent */ }
}

// Extremely short, clean, deep "thock" (like a premium mechanical switch).
export function playGeneralClick() {
  const now = performance.now();
  if (now - _last < 55) return;
  _last = now;
  try {
    const ac = getCtx();
    const t = ac.currentTime;

    const osc = ac.createOscillator();
    const gain = ac.createGain();
    // Premium Minimal Tap
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.015);
    
    // Ultra-subtle attack and decay
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.04, t + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);
    
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.025);
  } catch { /* silent */ }
}
