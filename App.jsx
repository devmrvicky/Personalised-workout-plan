import { useState, useEffect, useRef, useCallback } from "react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────────────── */
const T = {
  bg: "#0C0F14",
  card: "#13171F",
  cardBorder: "rgba(255,255,255,0.07)",
  text: "#EDE8DF",
  muted: "rgba(237,232,223,0.45)",
  faint: "rgba(237,232,223,0.12)",
  warmup: "#F5C842",
  cardio: "#FF4F2B",
  strength: "#4C7BFF",
  yoga: "#22C9A8",
  cooldown: "#A855F7",
};

const PHASE_META = [
  { id:0, label:"Warm-Up",       icon:"🌅", color:T.warmup,   duration:"3 min",  bg:"rgba(245,200,66,0.07)"  },
  { id:1, label:"Cardio Burst",  icon:"🔥", color:T.cardio,   duration:"6 min",  bg:"rgba(255,79,43,0.07)"   },
  { id:2, label:"Strength",      icon:"💪", color:T.strength, duration:"8 min",  bg:"rgba(76,123,255,0.07)"  },
  { id:3, label:"Yoga & Glow",   icon:"✨", color:T.yoga,     duration:"6 min",  bg:"rgba(34,201,168,0.07)"  },
  { id:4, label:"Cool Down",     icon:"🌿", color:T.cooldown, duration:"2 min",  bg:"rgba(168,85,247,0.07)"  },
];

/* ─── EXERCISE DATA (with real Giphy / tenor embed IDs via search URL) ─ */
// We use publicly accessible Wikimedia / web GIFs for exercises
const EX = [
  // WARM-UP
  { id:"neck",      phase:0, name:"Neck Rolls",          type:"timed", val:30,  reps:null, skin:false,
    gif:"https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif",
    desc:"Slow full circles, 5 each side. Keep shoulders down and relaxed.",
    muscles:["Neck","Shoulders"] },
  { id:"march",     phase:0, name:"March in Place",      type:"timed", val:60,  reps:null, skin:true,
    gif:"https://media.giphy.com/media/3o7TKRwpns23QMNNiE/giphy.gif",
    desc:"Lift knees to hip height. Swing arms naturally. Wake up your body.",
    muscles:["Legs","Core","Cardio"] },
  { id:"twist",     phase:0, name:"Torso Twists",        type:"timed", val:30,  reps:null, skin:false,
    gif:"https://media.giphy.com/media/xT9IgG50Lg7russbDa/giphy.gif",
    desc:"Hands on hips, feet shoulder-width. Rotate gently side to side.",
    muscles:["Core","Spine"] },
  { id:"jjack",     phase:0, name:"Slow Jumping Jacks",  type:"timed", val:60,  reps:null, skin:true,
    gif:"https://media.giphy.com/media/23hPPMRcSHBMOSADwq/giphy.gif",
    desc:"Wide stance, arms overhead. Find a slow, comfortable rhythm.",
    muscles:["Full Body","Coordination"] },

  // CARDIO
  { id:"hknees",    phase:1, name:"High Knees",          type:"timed", val:45,  reps:null, skin:true,
    gif:"https://media.giphy.com/media/HQjJiKgQ5q5EYQF0mc/giphy.gif",
    desc:"Drive knees to hip height, fast. Pump your arms — this is your glow phase!",
    muscles:["Legs","Core","Cardio"] },
  { id:"rest1",     phase:1, name:"Rest",                type:"rest",  val:15,  reps:null, skin:false,
    gif:null,
    desc:"Breathe deep. Shake out your hands. Let your heart recover.",
    muscles:[] },
  { id:"bkicks",    phase:1, name:"Butt Kicks",          type:"timed", val:45,  reps:null, skin:true,
    gif:"https://media.giphy.com/media/l3vRhBz5rBgSzFuBy/giphy.gif",
    desc:"Heels to glutes, keep torso upright. Feel the hamstrings fire.",
    muscles:["Hamstrings","Cardio"] },
  { id:"rest2",     phase:1, name:"Rest",                type:"rest",  val:15,  reps:null, skin:false,
    gif:null,
    desc:"Almost there! Breathe. Two more rounds.",
    muscles:[] },
  { id:"jumprope",  phase:1, name:"Jump Rope",           type:"timed", val:60,  reps:null, skin:true,
    gif:"https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif",
    desc:"No rope needed — simulate the wrist rotation. Light on your feet.",
    muscles:["Calves","Coordination","Cardio"] },
  { id:"shuffle",   phase:1, name:"Lateral Shuffles",    type:"timed", val:60,  reps:null, skin:true,
    gif:"https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
    desc:"Low athletic stance. Shuffle side-to-side. Touch the floor each side.",
    muscles:["Glutes","Agility","Legs"] },
  { id:"mtncli",    phase:1, name:"Mountain Climbers",   type:"timed", val:45,  reps:null, skin:true,
    gif:"https://media.giphy.com/media/xT9IgkLsGBSMFVKHqo/giphy.gif",
    desc:"Plank position. Drive knees alternating, fast. Core TIGHT.",
    muscles:["Core","Arms","Cardio"] },
  { id:"rest3",     phase:1, name:"Rest & Walk",         type:"rest",  val:45,  reps:null, skin:false,
    gif:null,
    desc:"Walk in place. Let your heart rate come down gradually.",
    muscles:[] },

  // STRENGTH
  { id:"squat",     phase:2, name:"Squats",              type:"reps",  val:null, reps:15, skin:false,
    gif:"https://media.giphy.com/media/2WxWfiavndgcM/giphy.gif",
    desc:"Feet hip-width. Sit back and down like into a chair. Chest stays tall.",
    muscles:["Quads","Glutes","Core"] },
  { id:"pushup",    phase:2, name:"Push-Ups",            type:"reps",  val:null, reps:10, skin:false,
    gif:"https://media.giphy.com/media/du4PMBLbwHitTJLFkI/giphy.gif",
    desc:"Knees okay for beginners. Lower chest to floor. Keep core tight throughout.",
    muscles:["Chest","Triceps","Core"] },
  { id:"bridge",    phase:2, name:"Glute Bridges",       type:"reps",  val:null, reps:15, skin:false,
    gif:"https://media.giphy.com/media/UPFQBGePKhAWc/giphy.gif",
    desc:"Lie back, feet flat. Drive hips up, squeeze glutes hard at the top. Hold 1 sec.",
    muscles:["Glutes","Hamstrings","Core"] },
  { id:"plank",     phase:2, name:"Plank Hold",          type:"timed", val:30,  reps:null, skin:false,
    gif:"https://media.giphy.com/media/l3vRdDUBCRJl7nEXK/giphy.gif",
    desc:"Elbows under shoulders. One straight line from head to heels. Breathe.",
    muscles:["Core","Shoulders","Back"] },
  { id:"lunge",     phase:2, name:"Reverse Lunges",      type:"reps",  val:null, reps:20, skin:false,
    gif:"https://media.giphy.com/media/l0HlRnAWXxn0MhKLK/giphy.gif",
    desc:"Step back, both knees 90°. Alternate legs. 10 each side. Controlled.",
    muscles:["Quads","Glutes","Balance"] },
  { id:"superman",  phase:2, name:"Superman Hold",       type:"reps",  val:null, reps:10, skin:false,
    gif:"https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
    desc:"Face down. Simultaneously lift arms & legs. Hold 2 seconds. Back & glutes.",
    muscles:["Back","Glutes","Shoulders"] },

  // YOGA
  { id:"child",     phase:3, name:"Child's Pose",        type:"timed", val:60,  reps:null, skin:true,
    gif:"https://media.giphy.com/media/3oriO13KTkzPwTykp2/giphy.gif",
    desc:"Forehead to floor, arms forward. Breathe deep into your back. Full release.",
    muscles:["Back","Hips","Shoulders"] },
  { id:"ddog",      phase:3, name:"Downward Dog",        type:"timed", val:45,  reps:null, skin:true,
    gif:"https://media.giphy.com/media/26xBMhA6KqZYSmLcQ/giphy.gif",
    desc:"Hips high, heels towards floor. Blood rushes to your face — #1 glow move.",
    muscles:["Hamstrings","Calves","Shoulders"] },
  { id:"ffold",     phase:3, name:"Seated Forward Fold", type:"timed", val:45,  reps:null, skin:true,
    gif:"https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/giphy.gif",
    desc:"Reach towards toes. Don't force — breathe into the stretch each exhale.",
    muscles:["Hamstrings","Lower Back"] },
  { id:"legsup",    phase:3, name:"Legs Up the Wall",    type:"timed", val:60,  reps:null, skin:true,
    gif:"https://media.giphy.com/media/3oEdv5e5VkvVg2bEtW/giphy.gif",
    desc:"Lie on your back, legs straight up. Lymphatic drainage. Reduces puffiness.",
    muscles:["Recovery","Circulation"] },
  { id:"sptwist",   phase:3, name:"Spinal Twist",        type:"timed", val:60,  reps:null, skin:true,
    gif:"https://media.giphy.com/media/xT9IgxSWFqAcEhVPpC/giphy.gif",
    desc:"30 seconds each side. Deep detox through compression. Breathe out toxins.",
    muscles:["Spine","Hips","Obliques"] },
  { id:"corpse",    phase:3, name:"Corpse Pose",         type:"timed", val:30,  reps:null, skin:true,
    gif:"https://media.giphy.com/media/l0HlHC3KJqIFVBHnO/giphy.gif",
    desc:"Eyes closed. Arms loose by sides. Complete stillness. You earned this.",
    muscles:["Mind","Nervous System"] },

  // COOL DOWN
  { id:"boxbreath", phase:4, name:"Box Breathing",       type:"timed", val:60,  reps:null, skin:true,
    gif:null,
    desc:"In 4 · Hold 4 · Out 4 · Hold 4. Resets cortisol. Clears your skin from inside.",
    muscles:["Lungs","Mind"] },
  { id:"nkstretch", phase:4, name:"Neck & Wrist Stretch", type:"timed", val:30, reps:null, skin:false,
    gif:"https://media.giphy.com/media/l0HlIO2OJUmJTnBbO/giphy.gif",
    desc:"Gentle tilt each direction. Wrist circles both ways. Release tension.",
    muscles:["Neck","Wrists"] },
  { id:"facemass",  phase:4, name:"Face Tap Massage",    type:"timed", val:30,  reps:null, skin:true,
    gif:null,
    desc:"Fingertips on cheeks, forehead, jaw. 30 seconds. Boosts circulation post-sweat.",
    muscles:["Face","Lymph"] },
];

const TOTAL_EX = EX.length;

/* ─── AUDIO (Web Audio API tones) ───────────────────────────────────── */
function useAudio() {
  const ctx = useRef(null);
  const getCtx = () => {
    if (!ctx.current) ctx.current = new (window.AudioContext || window.webkitAudioContext)();
    return ctx.current;
  };
  const beep = (freq = 880, dur = 0.12, vol = 0.3, type = "sine", delay = 0) => {
    try {
      const ac = getCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.type = type; osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, ac.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + dur);
      osc.start(ac.currentTime + delay);
      osc.stop(ac.currentTime + delay + dur + 0.05);
    } catch {}
  };
  return {
    tick: () => beep(660, 0.08, 0.2),
    countdown: (n) => { for (let i = 0; i < n; i++) beep(880, 0.1, 0.3, "sine", i * 1); },
    done: () => { beep(880, 0.15, 0.4, "sine", 0); beep(1100, 0.15, 0.4, "sine", 0.18); beep(1320, 0.3, 0.4, "sine", 0.36); },
    start: () => { beep(440, 0.1, 0.3, "triangle", 0); beep(660, 0.2, 0.4, "triangle", 0.12); },
    warning: () => beep(550, 0.1, 0.25, "square"),
  };
}

/* ─── BREATH ANIMATOR ────────────────────────────────────────────────── */
function BreathCircle({ active, color }) {
  const [phase, setPhase] = useState("inhale");
  const [count, setCount] = useState(4);
  useEffect(() => {
    if (!active) return;
    const sequence = [
      { label:"inhale",  duration:4000 },
      { label:"hold",    duration:4000 },
      { label:"exhale",  duration:4000 },
      { label:"hold",    duration:4000 },
    ];
    let si = 0, sc = 4, interval;
    setPhase(sequence[0].label); setCount(4);
    interval = setInterval(() => {
      sc--;
      if (sc <= 0) {
        si = (si + 1) % 4;
        sc = 4;
        setPhase(sequence[si].label);
      }
      setCount(sc);
    }, 1000);
    return () => clearInterval(interval);
  }, [active]);

  const scale = phase === "inhale" ? 1.4 : phase === "exhale" ? 0.85 : 1.15;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16, padding:"24px 0" }}>
      <div style={{ position:"relative", width:140, height:140, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:`${color}18`,
          transform:`scale(${scale})`, transition:`transform ${phase==="inhale"?4:phase==="exhale"?4:0.3}s ease-in-out` }} />
        <div style={{ position:"absolute", inset:16, borderRadius:"50%", background:`${color}28`,
          transform:`scale(${scale * 0.85})`, transition:`transform ${phase==="inhale"?4:phase==="exhale"?4:0.3}s ease-in-out` }} />
        <div style={{ position:"absolute", inset:32, borderRadius:"50%", background:`${color}55`,
          transform:`scale(${scale * 0.7})`, transition:`transform ${phase==="inhale"?4:phase==="exhale"?4:0.3}s ease-in-out` }} />
        <div style={{ position:"relative", zIndex:2, textAlign:"center" }}>
          <div style={{ fontSize:28, fontFamily:"'Playfair Display', serif", color:T.text }}>{count}</div>
        </div>
      </div>
      <div style={{ fontSize:13, letterSpacing:4, textTransform:"uppercase", color, fontFamily:"'Space Mono', monospace" }}>{phase}</div>
    </div>
  );
}

/* ─── CIRCULAR PROGRESS ──────────────────────────────────────────────── */
function Ring({ pct, color, size=140, stroke=10, children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position:"relative", width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)", position:"absolute", inset:0 }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circ * Math.min(pct,1)} ${circ}`}
          style={{ transition:"stroke-dasharray 0.9s ease", filter:`drop-shadow(0 0 6px ${color}88)` }} />
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        {children}
      </div>
    </div>
  );
}

/* ─── GIF EXERCISE CARD ──────────────────────────────────────────────── */
function ExerciseGif({ gif, name, color }) {
  const [err, setErr] = useState(false);
  if (!gif || err) {
    // Fallback: animated CSS illustration per exercise type
    return (
      <div style={{ width:"100%", height:180, borderRadius:16, background:`${color}10`,
        border:`1px solid ${color}22`, display:"flex", alignItems:"center", justifyContent:"center",
        flexDirection:"column", gap:8 }}>
        <div style={{ fontSize:48 }}>🏃</div>
        <div style={{ fontSize:11, color, fontFamily:"'Space Mono', monospace", letterSpacing:2 }}>EXERCISE IN PROGRESS</div>
      </div>
    );
  }
  return (
    <div style={{ width:"100%", height:180, borderRadius:16, overflow:"hidden", border:`1px solid ${color}22`, position:"relative" }}>
      <img src={gif} alt={name} onError={() => setErr(true)}
        style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
      <div style={{ position:"absolute", inset:0, background:`linear-gradient(to top, ${T.bg}cc 0%, transparent 50%)` }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen]           = useState("plan");     // plan | guided | done
  const [openPhase, setOpenPhase]     = useState(null);
  const [checked, setChecked]         = useState({});         // { exId: bool }
  const [streak, setStreak]           = useState(4);

  // Guided mode state
  const [guidedIdx, setGuidedIdx]     = useState(0);
  const [timeLeft, setTimeLeft]       = useState(0);
  const [running, setRunning]         = useState(false);
  const [repsDone, setRepsDone]       = useState(0);
  const [guidedDone, setGuidedDone]   = useState(new Set());
  const [totalSecs, setTotalSecs]     = useState(0);
  const timerRef                      = useRef(null);
  const audio                         = useAudio();

  const totalDone   = Object.values(checked).filter(Boolean).length;
  const progress    = Math.round((totalDone / TOTAL_EX) * 100);

  /* ── check/uncheck ── */
  const toggle = (id) => setChecked(p => ({ ...p, [id]: !p[id] }));

  /* ── guided: init exercise ── */
  const initEx = useCallback((idx) => {
    clearInterval(timerRef.current);
    const ex = EX[idx];
    if (!ex) return;
    setGuidedIdx(idx);
    setRepsDone(0);
    setRunning(false);
    setTimeLeft(ex.type !== "reps" ? ex.val : 0);
  }, []);

  /* ── guided: start ── */
  const startGuided = () => {
    setScreen("guided");
    setGuidedDone(new Set());
    setTotalSecs(0);
    initEx(0);
  };

  /* ── guided: timer tick ── */
  useEffect(() => {
    if (screen !== "guided" || !running) return;
    const ex = EX[guidedIdx];
    if (!ex || ex.type === "reps") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 4 && t > 1) audio.warning();
        if (t <= 1) {
          clearInterval(timerRef.current);
          audio.done();
          advanceEx();
          return 0;
        }
        setTotalSecs(s => s + 1);
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [running, guidedIdx, screen]);

  const advanceEx = () => {
    const next = guidedIdx + 1;
    setGuidedDone(p => new Set([...p, EX[guidedIdx]?.id]));
    setChecked(p => ({ ...p, [EX[guidedIdx]?.id]: true }));
    if (next >= TOTAL_EX) { setScreen("done"); setStreak(s => s + 1); }
    else { setTimeout(() => { initEx(next); audio.start(); }, 400); }
  };

  const handleRep = () => {
    const newR = repsDone + 1;
    setRepsDone(newR);
    audio.tick();
    setTotalSecs(s => s + 3);
    if (newR >= EX[guidedIdx].reps) {
      setTimeout(() => { audio.done(); advanceEx(); }, 300);
    }
  };

  const toggleRun = () => {
    if (!running) audio.start();
    setRunning(r => !r);
  };

  const skipEx = () => { clearInterval(timerRef.current); advanceEx(); };
  const prevEx = () => { if (guidedIdx > 0) { clearInterval(timerRef.current); initEx(guidedIdx - 1); } };

  const curEx    = EX[guidedIdx];
  const curPhase = curEx ? PHASE_META[curEx.phase] : PHASE_META[0];

  /* ─── FONT IMPORT ──────────────────────────────────────────────────── */
  const fontLink = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700&display=swap";

  const globalStyle = `
    @import url('${fontLink}');
    * { box-sizing:border-box; margin:0; padding:0; }
    body { background:${T.bg}; -webkit-tap-highlight-color:transparent; }
    ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.15); border-radius:2px; }
    @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes scaleIn  { from{opacity:0;transform:scale(0.93)} to{opacity:1;transform:scale(1)} }
    @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.5} }
    @keyframes glowRing { 0%,100%{box-shadow:0 0 0 0 var(--gc)} 50%{box-shadow:0 0 0 8px transparent} }
    @keyframes spin     { to{transform:rotate(360deg)} }
    @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
    @keyframes confetti { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(-60px) rotate(720deg);opacity:0} }
  `;

  /* ════════════════════════════════════════════════════════
     SCREEN: PLAN
  ════════════════════════════════════════════════════════ */
  if (screen === "plan") return (
    <>
      <style>{globalStyle}</style>
      <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'Syne', sans-serif", color:T.text, paddingBottom:80 }}>

        {/* ── HERO ── */}
        <div style={{ position:"relative", padding:"48px 20px 32px", overflow:"hidden",
          background:"radial-gradient(ellipse 80% 60% at 50% -10%, rgba(245,200,66,0.14) 0%, transparent 70%)" }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(245,200,66,0.05) 1px, transparent 1px)", backgroundSize:"28px 28px", pointerEvents:"none" }} />

          {/* Tag */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(245,200,66,0.1)", border:"1px solid rgba(245,200,66,0.25)", borderRadius:20, padding:"5px 14px", marginBottom:20 }}>
            <span style={{ fontSize:11, letterSpacing:3, color:T.warmup, fontFamily:"'Space Mono',monospace" }}>☀ MORNING · HOME · 25 MIN</span>
          </div>

          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(40px,11vw,68px)", fontWeight:600, lineHeight:1.02, marginBottom:10, letterSpacing:"-1.5px" }}>
            Morning<br/><span style={{ color:T.warmup, fontStyle:"italic" }}>Glow</span> Plan
          </h1>
          <p style={{ color:T.muted, fontSize:14, maxWidth:280, lineHeight:1.7, marginBottom:28 }}>
            25 minutes. Zero equipment. Skin that radiates all day long.
          </p>

          {/* Stats row */}
          <div style={{ display:"flex", gap:12, marginBottom:32, flexWrap:"wrap" }}>
            {[
              { v:streak,      unit:"day streak",  c:T.warmup  },
              { v:"25",        unit:"minutes",     c:T.cardio  },
              { v:TOTAL_EX,    unit:"exercises",   c:T.strength},
              { v:`${progress}%`, unit:"complete", c:T.yoga    },
            ].map((s,i) => (
              <div key={i} style={{ background:T.card, border:`1px solid ${s.c}28`, borderRadius:12, padding:"10px 16px", minWidth:72 }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:s.c, lineHeight:1 }}>{s.v}</div>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:T.muted, letterSpacing:2, marginTop:4 }}>{s.unit.toUpperCase()}</div>
              </div>
            ))}
          </div>

          {/* Overall progress bar */}
          <div style={{ marginBottom:4 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"'Space Mono',monospace", fontSize:9, color:T.muted, letterSpacing:2, marginBottom:6 }}>
              <span>PROGRESS</span><span>{totalDone}/{TOTAL_EX} exercises</span>
            </div>
            <div style={{ height:5, background:"rgba(255,255,255,0.06)", borderRadius:3, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${progress}%`, background:`linear-gradient(90deg,${T.warmup},${T.cardio},${T.yoga})`, borderRadius:3, transition:"width 0.6s ease" }} />
            </div>
          </div>
        </div>

        {/* ── GUIDED MODE BUTTON ── */}
        <div style={{ padding:"20px 20px 0" }}>
          <button onClick={startGuided} style={{
            width:"100%", background:`linear-gradient(135deg,${T.warmup},${T.cardio})`,
            border:"none", borderRadius:16, padding:"18px 24px",
            display:"flex", alignItems:"center", justifyContent:"space-between",
            cursor:"pointer", boxShadow:`0 8px 32px rgba(245,200,66,0.25)`,
          }}>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:3, color:"rgba(0,0,0,0.6)", marginBottom:4 }}>GUIDED WORKOUT MODE</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"#0a0500", fontWeight:600 }}>Start Today's Session</div>
            </div>
            <div style={{ width:48, height:48, borderRadius:"50%", background:"rgba(0,0,0,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>▶</div>
          </button>
        </div>

        {/* ── PHASE ACCORDION ── */}
        <div style={{ padding:"24px 20px 0" }}>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:3, color:T.muted, marginBottom:14 }}>EXERCISE PLAN · {TOTAL_EX} MOVES</div>

          {PHASE_META.map(ph => {
            const phExs  = EX.filter(e => e.phase === ph.id);
            const phDone = phExs.filter(e => checked[e.id]).length;
            const isOpen = openPhase === ph.id;
            return (
              <div key={ph.id} style={{ marginBottom:10, animation:"fadeUp 0.4s ease both", animationDelay:`${ph.id * 0.06}s` }}>
                {/* Phase header */}
                <button onClick={() => setOpenPhase(isOpen ? null : ph.id)} style={{
                  width:"100%", textAlign:"left", cursor:"pointer",
                  background: isOpen ? ph.bg : T.card,
                  border:`1px solid ${isOpen ? ph.color+"44" : T.cardBorder}`,
                  borderRadius: isOpen ? "14px 14px 0 0" : 14,
                  padding:"14px 16px",
                  transition:"all 0.25s ease",
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:20 }}>{ph.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
                        <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:ph.color, letterSpacing:2 }}>PHASE {ph.id+1}</span>
                        {phDone === phExs.length && phExs.length > 0 && (
                          <span style={{ background:ph.color, color:"#000", fontSize:8, padding:"1px 7px", borderRadius:8, fontFamily:"'Space Mono',monospace", letterSpacing:1 }}>✓ DONE</span>
                        )}
                      </div>
                      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:600, color: isOpen ? T.text : T.text }}>{ph.label}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontFamily:"'Space Mono',monospace", fontSize:12, color:ph.color, fontWeight:700 }}>{ph.duration}</div>
                      <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:T.muted, marginTop:2 }}>{phDone}/{phExs.length}</div>
                    </div>
                    <div style={{ marginLeft:4, fontSize:12, color:T.muted, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition:"transform 0.25s" }}>▼</div>
                  </div>
                </button>

                {/* Exercises */}
                {isOpen && (
                  <div style={{ background:ph.bg, border:`1px solid ${ph.color}44`, borderTop:"none", borderRadius:"0 0 14px 14px", overflow:"hidden" }}>
                    {/* Phase tip */}
                    <div style={{ padding:"10px 16px", borderBottom:`1px solid ${ph.color}22`, display:"flex", gap:8, alignItems:"flex-start" }}>
                      <span style={{ fontSize:14 }}>💡</span>
                      <span style={{ fontSize:12, color:"rgba(0,0,0,0.55)", fontStyle:"italic", lineHeight:1.5 }}>
                        { [
                          "Do this right after waking — before your phone!",
                          "This is your glow phase — sweating flushes toxins from skin.",
                          "Good posture built here = confident glow every day.",
                          "These inversions send blood rushing to your face. Secret skincare.",
                          "Finish with face massage — skin absorbs everything better now.",
                        ][ph.id] }
                      </span>
                    </div>

                    {phExs.map((ex, i) => {
                      const done = !!checked[ex.id];
                      const isRest = ex.type === "rest";
                      return (
                        <div key={ex.id} onClick={() => !isRest && toggle(ex.id)}
                          style={{
                            display:"flex", alignItems:"center", gap:12, padding:"11px 16px",
                            borderBottom: i < phExs.length-1 ? `1px solid ${ph.color}18` : "none",
                            background: done ? `${ph.color}18` : "transparent",
                            cursor: isRest ? "default" : "pointer",
                            transition:"background 0.2s",
                            opacity: isRest ? 0.5 : 1,
                          }}>
                          {/* Checkbox */}
                          <div style={{
                            width:22, height:22, borderRadius:6, border:`2px solid ${done ? ph.color : "rgba(0,0,0,0.2)"}`,
                            background: done ? ph.color : "rgba(255,255,255,0.5)",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            flexShrink:0, transition:"all 0.2s", fontSize:12, fontWeight:700, color:"#000",
                          }}>
                            {done && "✓"}
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                              <span style={{ fontSize:14, fontWeight:600, color:"#111",
                                textDecoration: done ? "line-through" : "none",
                                opacity: done ? 0.5 : 1 }}>{ex.name}</span>
                              {ex.skin && !isRest && (
                                <span style={{ fontSize:9, background:`${ph.color}33`, color:ph.color, padding:"1px 6px", borderRadius:8, fontFamily:"'Space Mono',monospace", letterSpacing:1 }}>✨ GLOW</span>
                              )}
                            </div>
                            <div style={{ fontSize:11, color:"rgba(0,0,0,0.45)", marginTop:2, lineHeight:1.4 }}>{ex.desc}</div>
                            {ex.muscles.length > 0 && (
                              <div style={{ display:"flex", gap:4, marginTop:5, flexWrap:"wrap" }}>
                                {ex.muscles.map(m => (
                                  <span key={m} style={{ fontSize:9, background:`${ph.color}22`, color:ph.color, padding:"1px 6px", borderRadius:6, fontFamily:"'Space Mono',monospace" }}>{m}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:11, color:ph.color, fontWeight:700, whiteSpace:"nowrap" }}>
                            {isRest ? `${ex.val}s rest` : ex.type === "reps" ? `${ex.reps} reps` : `${ex.val}s`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── SKIN GLOW TIPS ── */}
        <div style={{ padding:"28px 20px 0" }}>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:3, color:T.yoga, marginBottom:12 }}>✦ SKIN GLOW RITUAL</div>
          <div style={{ background:`rgba(34,201,168,0.06)`, border:`1px solid rgba(34,201,168,0.2)`, borderRadius:16, padding:18 }}>
            {[
              { icon:"💧", tip:"Drink 500ml water before starting — hydrates skin from inside" },
              { icon:"🧴", tip:"Wash face before workout — sweat clears pores better without makeup" },
              { icon:"🚿", tip:"Shower within 30 min after — rinse sweat before pores re-clog" },
              { icon:"🍊", tip:"Apply Vitamin C serum post-workout — skin absorbs 3× better now" },
              { icon:"🙌", tip:"Don't touch your face during exercise — bacteria transfer" },
              { icon:"🧊", tip:"Cold water face rinse post-shower — seals pores, locks in glow" },
            ].map((t,i) => (
              <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom: i < 5 ? 12 : 0 }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{t.icon}</span>
                <span style={{ fontSize:13, color:T.muted, lineHeight:1.55 }}>{t.tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── WEEKLY SCHEDULE ── */}
        <div style={{ padding:"28px 20px 0" }}>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:3, color:T.warmup, marginBottom:12 }}>✦ WEEKLY SCHEDULE</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6 }}>
            {[
              { d:"MON", f:"Full Plan",        a:true  },
              { d:"TUE", f:"Full + Yoga",      a:true  },
              { d:"WED", f:"Full Plan",        a:true  },
              { d:"THU", f:"Yoga only",        a:false },
              { d:"FRI", f:"Full Plan",        a:true  },
              { d:"SAT", f:"Walk 30m",         a:true  },
              { d:"SUN", f:"Rest + Hydrate",   a:false },
            ].map((w,i) => (
              <div key={i} style={{
                background: w.a ? "rgba(245,200,66,0.08)" : "rgba(255,255,255,0.03)",
                border:`1px solid ${w.a ? "rgba(245,200,66,0.28)" : "rgba(255,255,255,0.06)"}`,
                borderRadius:12, padding:"9px 4px", textAlign:"center",
              }}>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color: w.a ? T.warmup : T.faint, letterSpacing:1, marginBottom:5 }}>{w.d}</div>
                <div style={{ fontSize:9, color: w.a ? T.muted : "rgba(237,232,223,0.2)", lineHeight:1.4 }}>{w.f}</div>
              </div>
            ))}
          </div>
        </div>

        {/* footer */}
        <div style={{ marginTop:48, textAlign:"center", padding:"0 20px" }}>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:"rgba(237,232,223,0.2)", letterSpacing:2 }}>CONSISTENCY IS YOUR SKINCARE</div>
        </div>
      </div>
    </>
  );

  /* ════════════════════════════════════════════════════════
     SCREEN: GUIDED
  ════════════════════════════════════════════════════════ */
  if (screen === "guided") {
    const isRest = curEx?.type === "rest";
    const isReps = curEx?.type === "reps";
    const isTimed = curEx?.type === "timed";
    const isBreath = curEx?.id === "boxbreath" || curEx?.id === "facemass";
    const pct = isTimed ? (curEx.val - timeLeft) / curEx.val : isReps ? repsDone / curEx.reps : 1;
    const guidedProgress = Math.round((guidedDone.size / TOTAL_EX) * 100);

    return (
      <>
        <style>{globalStyle}</style>
        <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'Syne',sans-serif", color:T.text, display:"flex", flexDirection:"column" }}>

          {/* Top bar */}
          <div style={{ padding:"14px 18px", display:"flex", alignItems:"center", justifyContent:"space-between",
            borderBottom:`1px solid ${T.cardBorder}` }}>
            <button onClick={() => { clearInterval(timerRef.current); setScreen("plan"); }}
              style={{ background:"none", border:`1px solid ${T.cardBorder}`, borderRadius:8, padding:"6px 12px",
                color:T.muted, fontSize:11, cursor:"pointer", fontFamily:"'Space Mono',monospace" }}>← EXIT</button>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:2, color:curPhase.color }}>
              {curPhase.icon} {curPhase.label.toUpperCase()}
            </div>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:T.muted }}>{guidedIdx+1}/{TOTAL_EX}</div>
          </div>

          {/* Phase progress dots */}
          <div style={{ display:"flex", justifyContent:"center", gap:6, padding:"10px 0 0" }}>
            {PHASE_META.map(p => (
              <div key={p.id} style={{ height:4, borderRadius:2, transition:"all 0.3s ease",
                width: p.id === curEx?.phase ? 24 : 6,
                background: p.id < curEx?.phase ? "rgba(255,255,255,0.2)" : p.id === curEx?.phase ? p.color : "rgba(255,255,255,0.1)" }} />
            ))}
          </div>

          {/* Overall progress bar */}
          <div style={{ height:2, background:"rgba(255,255,255,0.04)", margin:"8px 18px" }}>
            <div style={{ height:"100%", width:`${guidedProgress}%`, background:curPhase.color, transition:"width 0.5s", borderRadius:1 }} />
          </div>

          {/* Main exercise area */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"12px 20px 0", animation:"scaleIn 0.35s ease" }} key={guidedIdx}>

            {/* Exercise name */}
            <div style={{ textAlign:"center", marginBottom:12, width:"100%" }}>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:3, color:curPhase.color, marginBottom:6 }}>
                EXERCISE {guidedIdx+1} OF {TOTAL_EX}
              </div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(24px,6vw,36px)", fontWeight:600, lineHeight:1.1, marginBottom:6 }}>
                {curEx?.name}
              </h2>
              <div style={{ display:"flex", gap:6, justifyContent:"center", flexWrap:"wrap" }}>
                {curEx?.skin && (
                  <span style={{ fontSize:10, background:`${curPhase.color}22`, border:`1px solid ${curPhase.color}44`, color:curPhase.color, padding:"2px 10px", borderRadius:10, fontFamily:"'Space Mono',monospace", letterSpacing:1 }}>✨ SKIN GLOW MOVE</span>
                )}
                {isRest && (
                  <span style={{ fontSize:10, background:"rgba(255,255,255,0.08)", color:T.muted, padding:"2px 10px", borderRadius:10, fontFamily:"'Space Mono',monospace", letterSpacing:1 }}>REST</span>
                )}
              </div>
            </div>

            {/* GIF or breath viz */}
            <div style={{ width:"100%", maxWidth:380, marginBottom:14 }}>
              {isBreath || isRest ? (
                <BreathCircle active={running} color={curPhase.color} />
              ) : (
                <ExerciseGif gif={curEx?.gif} name={curEx?.name} color={curPhase.color} />
              )}
            </div>

            {/* Timer or reps */}
            {isReps ? (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14, marginBottom:14 }}>
                <Ring pct={repsDone / curEx.reps} color={curPhase.color} size={150} stroke={10}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:44, color:T.text, lineHeight:1 }}>{repsDone}</div>
                  <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:T.muted, letterSpacing:1, marginTop:2 }}>of {curEx.reps}</div>
                </Ring>
                <button onClick={handleRep} style={{
                  background:`linear-gradient(135deg,${curPhase.color},${curPhase.color}cc)`,
                  border:"none", borderRadius:50, padding:"16px 44px",
                  fontSize:16, fontWeight:700, color:"#050810", cursor:"pointer",
                  fontFamily:"'Syne',sans-serif", boxShadow:`0 6px 28px ${curPhase.color}44`,
                  "--gc":curPhase.color,
                }}>
                  {repsDone >= curEx.reps - 1 ? "Last Rep! ✓" : `Rep ${repsDone+1} ✓`}
                </button>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14, marginBottom:14 }}>
                <Ring pct={pct} color={isRest ? "rgba(255,255,255,0.2)" : curPhase.color} size={150} stroke={10}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:48, color: timeLeft <= 5 && !isRest ? T.cardio : T.text, lineHeight:1,
                    animation: timeLeft <= 3 && running ? "pulse 0.5s ease-in-out infinite" : "none" }}>
                    {timeLeft}
                  </div>
                  <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:T.muted, letterSpacing:2 }}>SECONDS</div>
                </Ring>
                <button onClick={toggleRun} style={{
                  background: running ? "rgba(255,255,255,0.07)" : `linear-gradient(135deg,${curPhase.color},${curPhase.color}bb)`,
                  border: running ? `2px solid ${curPhase.color}` : "none",
                  borderRadius:50, padding:"15px 40px", fontSize:15, fontWeight:700,
                  color: running ? curPhase.color : "#050810",
                  cursor:"pointer", fontFamily:"'Syne',sans-serif", minWidth:148,
                  boxShadow: running ? "none" : `0 6px 28px ${curPhase.color}44`,
                }}>
                  {running ? "⏸ Pause" : (timeLeft === curEx?.val ? "▶ Start" : "▶ Resume")}
                </button>
              </div>
            )}

            {/* Desc + muscles */}
            <div style={{ background:T.card, border:`1px solid ${curPhase.color}22`, borderRadius:14, padding:"12px 16px", width:"100%", maxWidth:380, marginBottom:12 }}>
              <p style={{ fontSize:13, color:T.muted, lineHeight:1.65, marginBottom:8 }}>{curEx?.desc}</p>
              {curEx?.muscles.length > 0 && (
                <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                  {curEx.muscles.map(m => (
                    <span key={m} style={{ fontSize:10, background:`${curPhase.color}18`, color:curPhase.color, padding:"2px 8px", borderRadius:8, fontFamily:"'Space Mono',monospace" }}>{m}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Nav controls */}
          <div style={{ padding:"12px 20px 16px", display:"flex", justifyContent:"center", gap:12, borderTop:`1px solid ${T.cardBorder}` }}>
            <button onClick={prevEx} disabled={guidedIdx===0}
              style={{ background:T.card, border:`1px solid ${T.cardBorder}`, borderRadius:"50%", width:48, height:48, fontSize:20, cursor:"pointer", color:T.muted, opacity:guidedIdx===0?0.3:1 }}>‹</button>
            <button onClick={skipEx}
              style={{ background:T.card, border:`1px solid ${T.cardBorder}`, borderRadius:50, padding:"0 28px", fontSize:12, cursor:"pointer", color:T.muted, fontFamily:"'Space Mono',monospace", letterSpacing:1 }}>
              SKIP →
            </button>
            <button onClick={prevEx} disabled style={{ opacity:0, width:48 }} />
          </div>

          {/* Up next strip */}
          <div style={{ borderTop:`1px solid ${T.cardBorder}`, padding:"10px 18px 20px" }}>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:2, color:T.muted, marginBottom:8 }}>UP NEXT</div>
            <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4 }}>
              {EX.slice(guidedIdx+1, guidedIdx+5).map((ex,i) => {
                const ph = PHASE_META[ex.phase];
                return (
                  <div key={i} style={{ flexShrink:0, background:T.card, border:`1px solid ${ph.color}22`, borderRadius:10, padding:"8px 12px", minWidth:110 }}>
                    <div style={{ fontSize:12, color:T.text, marginBottom:3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{ex.name}</div>
                    <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:ph.color }}>
                      {ex.type==="reps" ? `${ex.reps} reps` : `${ex.val}s`}
                    </div>
                  </div>
                );
              })}
              {guidedIdx+1 >= TOTAL_EX && (
                <div style={{ flexShrink:0, background:"rgba(245,200,66,0.08)", border:"1px solid rgba(245,200,66,0.2)", borderRadius:10, padding:"8px 12px" }}>
                  <div style={{ fontSize:14 }}>🎉</div>
                  <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:T.warmup, marginTop:3 }}>FINISH!</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ════════════════════════════════════════════════════════
     SCREEN: DONE
  ════════════════════════════════════════════════════════ */
  if (screen === "done") {
    const m = Math.floor(totalSecs/60), s = totalSecs%60;
    return (
      <>
        <style>{globalStyle}</style>
        <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'Syne',sans-serif", color:T.text,
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px", textAlign:"center",
          background:`radial-gradient(ellipse 80% 50% at 50% 10%, rgba(245,200,66,0.12) 0%, ${T.bg} 60%)` }}>

          <div style={{ fontSize:64, marginBottom:16, animation:"float 3s ease-in-out infinite" }}>🌟</div>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:4, color:T.warmup, marginBottom:10 }}>WORKOUT COMPLETE</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(34px,9vw,56px)", fontWeight:600, marginBottom:10, lineHeight:1.05 }}>
            You're <em style={{ color:T.warmup }}>glowing!</em>
          </h1>
          <p style={{ color:T.muted, fontSize:14, maxWidth:290, lineHeight:1.7, marginBottom:36 }}>
            Your skin is flooded with oxygen-rich blood right now. That post-workout glow is real and lasts for hours.
          </p>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, width:"100%", maxWidth:380, marginBottom:36 }}>
            {[
              { label:"TIME",      value:`${m}:${String(s).padStart(2,"0")}`, color:T.warmup,   icon:"⏱" },
              { label:"EXERCISES", value:TOTAL_EX,                           color:T.yoga,     icon:"💪" },
              { label:"STREAK",    value:`${streak}d`,                       color:T.cooldown, icon:"🔥" },
            ].map(stat => (
              <div key={stat.label} style={{ background:T.card, border:`1px solid ${stat.color}28`, borderRadius:16, padding:"18px 10px" }}>
                <div style={{ fontSize:20, marginBottom:8 }}>{stat.icon}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:stat.color }}>{stat.value}</div>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:T.muted, letterSpacing:2, marginTop:4 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background:`rgba(34,201,168,0.06)`, border:`1px solid rgba(34,201,168,0.2)`, borderRadius:16, padding:20, maxWidth:380, width:"100%", marginBottom:32, textAlign:"left" }}>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:3, color:T.yoga, marginBottom:14 }}>POST-WORKOUT RITUAL</div>
            {[
              { icon:"🚿", text:"Shower now — rinse sweat before pores re-clog" },
              { icon:"🍊", text:"Apply Vitamin C serum — skin absorbs 3× better right now" },
              { icon:"💧", text:"Drink 500ml water to replenish hydration" },
              { icon:"🧊", text:"Cold water face rinse — seals pores & locks in your glow" },
            ].map((tip,i) => (
              <div key={i} style={{ display:"flex", gap:10, marginBottom: i<3?12:0, alignItems:"flex-start" }}>
                <span style={{ fontSize:16 }}>{tip.icon}</span>
                <span style={{ fontSize:13, color:T.muted, lineHeight:1.55 }}>{tip.text}</span>
              </div>
            ))}
          </div>

          <button onClick={() => setScreen("plan")} style={{
            background:`linear-gradient(135deg,${T.warmup},${T.cardio})`,
            border:"none", borderRadius:50, padding:"16px 44px",
            fontSize:16, color:"#0a0500", fontWeight:700, cursor:"pointer",
            fontFamily:"'Syne',sans-serif", boxShadow:`0 8px 32px rgba(245,200,66,0.3)`,
          }}>
            Back to Plan ✦
          </button>
        </div>
      </>
    );
  }

  return null;
}
