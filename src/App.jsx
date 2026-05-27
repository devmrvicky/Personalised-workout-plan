import { useState, useEffect, useRef, useCallback } from "react";

// ─── CSS injected globally ───────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #05080f; }

  @keyframes squat-body { 0%,100%{transform:translateY(0) scaleY(1)} 50%{transform:translateY(14px) scaleY(0.82)} }
  @keyframes squat-lleg { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(40deg)} }
  @keyframes squat-rleg { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-40deg)} }
  @keyframes squat-larm { 0%,100%{transform:rotate(-20deg)} 50%{transform:rotate(40deg)} }
  @keyframes squat-rarm { 0%,100%{transform:rotate(20deg)} 50%{transform:rotate(-40deg)} }

  @keyframes hknee-body { 0%,100%{transform:translateY(0)} 25%{transform:translateY(-4px)} 75%{transform:translateY(-4px)} }
  @keyframes hknee-lleg { 0%,50%{transform:rotate(0deg)} 25%{transform:rotate(-70deg)} 75%,100%{transform:rotate(0deg)} }
  @keyframes hknee-rleg { 0%,50%{transform:rotate(0deg)} 75%{transform:rotate(-70deg)} 100%{transform:rotate(0deg)} }
  @keyframes hknee-larm { 0%,100%{transform:rotate(-20deg)} 25%{transform:rotate(40deg)} }
  @keyframes hknee-rarm { 0%,100%{transform:rotate(20deg)} 50%{transform:rotate(-40deg)} }

  @keyframes pushup-body { 0%,100%{transform:translateY(0) rotate(-8deg)} 50%{transform:translateY(10px) rotate(-8deg)} }
  @keyframes pushup-larm { 0%,100%{transform:rotate(70deg)} 50%{transform:rotate(110deg)} }
  @keyframes pushup-rarm { 0%,100%{transform:rotate(-70deg)} 50%{transform:rotate(-110deg)} }

  @keyframes jjack-lleg { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(30deg)} }
  @keyframes jjack-rleg { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-30deg)} }
  @keyframes jjack-larm { 0%,100%{transform:rotate(-20deg)} 50%{transform:rotate(-110deg)} }
  @keyframes jjack-rarm { 0%,100%{transform:rotate(20deg)} 50%{transform:rotate(110deg)} }

  @keyframes lunge-body { 0%,100%{transform:translateY(0)} 50%{transform:translateY(12px)} }
  @keyframes lunge-lleg { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-50deg)} }
  @keyframes lunge-rleg { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(50deg)} }

  @keyframes plank-pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }

  @keyframes downdog-body { 0%,100%{transform:rotate(-45deg) translateY(0)} 50%{transform:rotate(-45deg) translateY(-5px)} }

  @keyframes breath-circle { 0%,100%{transform:scale(1);opacity:0.7} 50%{transform:scale(1.3);opacity:1} }

  @keyframes march-lleg { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(-50deg)} }
  @keyframes march-rleg { 0%,50%{transform:rotate(0deg)} 75%{transform:rotate(-50deg)} 100%{transform:rotate(0deg)} }
  @keyframes march-larm { 0%,100%{transform:rotate(-20deg)} 50%{transform:rotate(40deg)} }
  @keyframes march-rarm { 0%,50%{transform:rotate(20deg)} 0%{transform:rotate(20deg)} 75%{transform:rotate(-40deg)} 100%{transform:rotate(20deg)} }

  @keyframes bridge-body { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-10px) rotate(-10deg)} }

  @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.8} 100%{transform:scale(1.6);opacity:0} }
  @keyframes float-up { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(-40px);opacity:0} }
  @keyframes glow-pulse { 0%,100%{box-shadow:0 0 20px rgba(246,194,68,0.3)} 50%{box-shadow:0 0 40px rgba(246,194,68,0.7)} }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }
  @keyframes complete-burst { 0%{transform:scale(0);opacity:1} 100%{transform:scale(2.5);opacity:0} }
  @keyframes ticker { 0%{transform:translateY(0);opacity:1} 50%{transform:translateY(-20px);opacity:0} 51%{transform:translateY(20px);opacity:0} 100%{transform:translateY(0);opacity:1} }
  @keyframes waveform { 0%,100%{height:4px} 50%{height:18px} }
`;

// ─── Exercise Data ────────────────────────────────────────────────────────────
const EXERCISES = [
  // WARM-UP
  { id:"neck-rolls", name:"Neck Rolls", phase:0, duration:30, reps:null, type:"timed", color:"#F6C244", desc:"Slow circles, 5 each side. Keep shoulders relaxed.", muscles:["Neck","Shoulders"], skin:false, animation:"march" },
  { id:"march", name:"March in Place", phase:0, duration:60, reps:null, type:"timed", color:"#F6C244", desc:"Lift knees high, swing arms naturally. Warm up your heart.", muscles:["Legs","Core"], skin:false, animation:"march" },
  { id:"torso-twist", name:"Torso Twists", phase:0, duration:30, reps:null, type:"timed", color:"#F6C244", desc:"Hands on hips, rotate gently side to side.", muscles:["Core","Back"], skin:false, animation:"march" },
  { id:"slow-jacks", name:"Slow Jumping Jacks", phase:0, duration:60, reps:null, type:"timed", color:"#F6C244", desc:"Wide stance, arms overhead. Ease into the rhythm.", muscles:["Full Body"], skin:true, animation:"jjack" },

  // CARDIO
  { id:"high-knees", name:"High Knees", phase:1, duration:45, reps:null, type:"timed", color:"#FF5C35", desc:"Drive knees up to hip height. Pump those arms!", muscles:["Legs","Core","Cardio"], skin:true, animation:"hknee" },
  { id:"rest1", name:"Rest", phase:1, duration:15, reps:null, type:"rest", color:"#FF5C35", desc:"Breathe deep. Shake out your hands.", muscles:[], skin:false, animation:"breath" },
  { id:"butt-kicks", name:"Butt Kicks", phase:1, duration:45, reps:null, type:"timed", color:"#FF5C35", desc:"Heels to glutes. Keep your core tight.", muscles:["Hamstrings","Cardio"], skin:true, animation:"march" },
  { id:"rest2", name:"Rest", phase:1, duration:15, reps:null, type:"rest", color:"#FF5C35", desc:"Breathe deep. You're doing great.", muscles:[], skin:false, animation:"breath" },
  { id:"jump-rope", name:"Jump Rope (imaginary)", phase:1, duration:60, reps:null, type:"timed", color:"#FF5C35", desc:"Wrists rotating, light on feet. Find your rhythm.", muscles:["Calves","Cardio","Coordination"], skin:true, animation:"jjack" },
  { id:"shuffles", name:"Lateral Shuffles", phase:1, duration:60, reps:null, type:"timed", color:"#FF5C35", desc:"Side-to-side, low stance. Touch the floor each side.", muscles:["Legs","Glutes","Agility"], skin:true, animation:"lunge" },
  { id:"mtn-climbers", name:"Mountain Climbers", phase:1, duration:45, reps:null, type:"timed", color:"#FF5C35", desc:"Drive knees alternating. Keep hips level, core tight.", muscles:["Core","Arms","Cardio"], skin:true, animation:"pushup" },
  { id:"rest3", name:"Rest", phase:1, duration:60, reps:null, type:"rest", color:"#FF5C35", desc:"Walk in place. Let your heart rate come down.", muscles:[], skin:false, animation:"breath" },

  // STRENGTH
  { id:"squats", name:"Squats", phase:2, duration:null, reps:15, type:"reps", color:"#3D6BFF", desc:"Feet hip-width. Sit back and down. Chest tall.", muscles:["Quads","Glutes","Core"], skin:false, animation:"squat" },
  { id:"pushups", name:"Push-Ups", phase:2, duration:null, reps:10, type:"reps", color:"#3D6BFF", desc:"Knees ok for beginners. Lower chest to floor. Core tight.", muscles:["Chest","Arms","Core"], skin:false, animation:"pushup" },
  { id:"bridges", name:"Glute Bridges", phase:2, duration:null, reps:15, type:"reps", color:"#3D6BFF", desc:"Lie back, feet flat. Drive hips up, squeeze glutes at top.", muscles:["Glutes","Hamstrings","Core"], skin:false, animation:"bridge" },
  { id:"plank", name:"Plank Hold", phase:2, duration:30, reps:null, type:"timed", color:"#3D6BFF", desc:"Elbows under shoulders. Don't let hips sag or rise.", muscles:["Core","Shoulders","Back"], skin:false, animation:"plank" },
  { id:"lunges", name:"Reverse Lunges", phase:2, duration:null, reps:20, type:"reps", color:"#3D6BFF", desc:"Step back, both knees 90°. Alternate legs. 10 each side.", muscles:["Quads","Glutes","Balance"], skin:false, animation:"lunge" },
  { id:"superman", name:"Superman Hold", phase:2, duration:null, reps:10, type:"reps", color:"#3D6BFF", desc:"Lie face down. Lift arms and legs simultaneously. Hold 2 sec.", muscles:["Back","Glutes","Shoulders"], skin:false, animation:"plank" },

  // YOGA
  { id:"childs", name:"Child's Pose", phase:3, duration:60, reps:null, type:"timed", color:"#1DBFA3", desc:"Forehead down, arms forward. Breathe into your back.", muscles:["Back","Hips","Shoulders"], skin:true, animation:"downdog" },
  { id:"downdog", name:"Downward Dog", phase:3, duration:45, reps:null, type:"timed", color:"#1DBFA3", desc:"Hips high. Blood rushes to face — your natural glow booster.", muscles:["Hamstrings","Calves","Shoulders"], skin:true, animation:"downdog" },
  { id:"forward-fold", name:"Seated Forward Fold", phase:3, duration:45, reps:null, type:"timed", color:"#1DBFA3", desc:"Reach towards toes. Don't force it — breathe into the stretch.", muscles:["Hamstrings","Lower Back"], skin:true, animation:"downdog" },
  { id:"legs-wall", name:"Legs Up the Wall", phase:3, duration:60, reps:null, type:"timed", color:"#1DBFA3", desc:"Lie back, legs straight up. Lymphatic drainage = less puffiness.", muscles:["Recovery","Circulation"], skin:true, animation:"breath" },
  { id:"spinal-twist", name:"Spinal Twist", phase:3, duration:60, reps:null, type:"timed", color:"#1DBFA3", desc:"30 sec each side. Deep detox for your organs and skin.", muscles:["Spine","Hips","Obliques"], skin:true, animation:"downdog" },
  { id:"corpse", name:"Corpse Pose", phase:3, duration:30, reps:null, type:"rest", color:"#1DBFA3", desc:"Eyes closed. Full body release. You've earned this.", muscles:["Mind","Nervous System"], skin:true, animation:"breath" },

  // COOL DOWN
  { id:"box-breath", name:"Box Breathing", phase:4, duration:60, reps:null, type:"timed", color:"#9B5DE5", desc:"In 4 · Hold 4 · Out 4 · Hold 4. Cortisol reset.", muscles:["Lungs","Mind"], skin:true, animation:"breath" },
  { id:"neck-stretch", name:"Neck & Wrist Stretches", phase:4, duration:30, reps:null, type:"timed", color:"#9B5DE5", desc:"Gentle tilt each direction. Circles with wrists.", muscles:["Neck","Wrists"], skin:false, animation:"march" },
  { id:"face-massage", name:"Face Tap Massage", phase:4, duration:30, reps:null, type:"timed", color:"#9B5DE5", desc:"Fingertips on cheeks, forehead, jaw. Boost facial circulation.", muscles:["Face","Lymph"], skin:true, animation:"breath" },
];

const PHASES = [
  { id:0, name:"Warm-Up", icon:"🌅", color:"#F6C244", duration:"3 min" },
  { id:1, name:"Cardio Burst", icon:"🔥", color:"#FF5C35", duration:"6 min" },
  { id:2, name:"Strength & Tone", icon:"💪", color:"#3D6BFF", duration:"8 min" },
  { id:3, name:"Yoga & Glow", icon:"✨", color:"#1DBFA3", duration:"6 min" },
  { id:4, name:"Cool Down", icon:"🌿", color:"#9B5DE5", duration:"2 min" },
];

const TOTAL_DURATION = EXERCISES.reduce((a, e) => a + (e.duration || (e.reps ? e.reps * 3 : 0)), 0);

// ─── Stick Figure Animations ──────────────────────────────────────────────────
function StickFigure({ type = "march", color = "#F6C244", size = 120 }) {
  const s = size;
  const c = color;
  const stroke = { stroke: c, strokeWidth: 3, strokeLinecap: "round", fill: "none" };
  const headStyle = { fill: c, opacity: 0.9 };

  const configs = {
    squat: {
      bodyAnim: { animation: "squat-body 1.2s ease-in-out infinite" },
      lLegAnim: { animation: "squat-lleg 1.2s ease-in-out infinite", transformOrigin: "50px 62px" },
      rLegAnim: { animation: "squat-rleg 1.2s ease-in-out infinite", transformOrigin: "50px 62px" },
      lArmAnim: { animation: "squat-larm 1.2s ease-in-out infinite", transformOrigin: "42px 46px" },
      rArmAnim: { animation: "squat-rarm 1.2s ease-in-out infinite", transformOrigin: "58px 46px" },
    },
    hknee: {
      bodyAnim: { animation: "hknee-body 0.7s ease-in-out infinite" },
      lLegAnim: { animation: "hknee-lleg 0.7s ease-in-out infinite", transformOrigin: "45px 62px" },
      rLegAnim: { animation: "hknee-rleg 0.7s ease-in-out infinite", transformOrigin: "55px 62px" },
      lArmAnim: { animation: "hknee-larm 0.7s ease-in-out infinite", transformOrigin: "42px 46px" },
      rArmAnim: { animation: "hknee-rarm 0.7s ease-in-out infinite", transformOrigin: "58px 46px" },
    },
    march: {
      bodyAnim: { animation: "hknee-body 0.9s ease-in-out infinite" },
      lLegAnim: { animation: "march-lleg 0.9s ease-in-out infinite", transformOrigin: "45px 62px" },
      rLegAnim: { animation: "march-rleg 0.9s ease-in-out infinite", transformOrigin: "55px 62px" },
      lArmAnim: { animation: "march-larm 0.9s ease-in-out infinite", transformOrigin: "42px 46px" },
      rArmAnim: { animation: "march-rarm 0.9s ease-in-out infinite", transformOrigin: "58px 46px" },
    },
    jjack: {
      bodyAnim: { animation: "hknee-body 0.6s ease-in-out infinite" },
      lLegAnim: { animation: "jjack-lleg 0.6s ease-in-out infinite", transformOrigin: "45px 62px" },
      rLegAnim: { animation: "jjack-rleg 0.6s ease-in-out infinite", transformOrigin: "55px 62px" },
      lArmAnim: { animation: "jjack-larm 0.6s ease-in-out infinite", transformOrigin: "42px 46px" },
      rArmAnim: { animation: "jjack-rarm 0.6s ease-in-out infinite", transformOrigin: "58px 46px" },
    },
    lunge: {
      bodyAnim: { animation: "lunge-body 1.4s ease-in-out infinite" },
      lLegAnim: { animation: "lunge-lleg 1.4s ease-in-out infinite", transformOrigin: "45px 62px" },
      rLegAnim: { animation: "lunge-rleg 1.4s ease-in-out infinite", transformOrigin: "55px 62px" },
      lArmAnim: { animation: "squat-larm 1.4s ease-in-out infinite", transformOrigin: "42px 46px" },
      rArmAnim: { animation: "squat-rarm 1.4s ease-in-out infinite", transformOrigin: "58px 46px" },
    },
    pushup: {
      bodyAnim: { animation: "pushup-body 1s ease-in-out infinite" },
      lLegAnim: {},
      rLegAnim: {},
      lArmAnim: { animation: "pushup-larm 1s ease-in-out infinite", transformOrigin: "38px 52px" },
      rArmAnim: { animation: "pushup-rarm 1s ease-in-out infinite", transformOrigin: "62px 52px" },
    },
    plank: {
      bodyAnim: { animation: "plank-pulse 2s ease-in-out infinite" },
      lLegAnim: {},
      rLegAnim: {},
      lArmAnim: {},
      rArmAnim: {},
    },
    bridge: {
      bodyAnim: { animation: "bridge-body 1.5s ease-in-out infinite" },
      lLegAnim: { animation: "squat-lleg 1.5s ease-in-out infinite", transformOrigin: "45px 65px" },
      rLegAnim: { animation: "squat-rleg 1.5s ease-in-out infinite", transformOrigin: "55px 65px" },
      lArmAnim: {},
      rArmAnim: {},
    },
    downdog: {
      bodyAnim: { animation: "downdog-body 2s ease-in-out infinite", transformOrigin: "50px 50px" },
      lLegAnim: {},
      rLegAnim: {},
      lArmAnim: {},
      rArmAnim: {},
    },
    breath: {
      bodyAnim: {},
      lLegAnim: {},
      rLegAnim: {},
      lArmAnim: {},
      rArmAnim: {},
    },
  };

  const cfg = configs[type] || configs.march;

  if (type === "breath") {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="20" fill={c} opacity="0.2" style={{ animation: "breath-circle 4s ease-in-out infinite" }} />
        <circle cx="50" cy="50" r="14" fill={c} opacity="0.4" style={{ animation: "breath-circle 4s ease-in-out infinite 0.5s" }} />
        <circle cx="50" cy="50" r="8" fill={c} opacity="0.9" style={{ animation: "breath-circle 4s ease-in-out infinite 1s" }} />
        <text x="50" y="78" textAnchor="middle" fill={c} fontSize="9" fontFamily="DM Mono" opacity="0.7">breathe</text>
      </svg>
    );
  }

  if (type === "plank") {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" style={cfg.bodyAnim}>
        <circle cx="20" cy="52" r="7" style={headStyle} />
        <line x1="27" y1="52" x2="75" y2="52" {...stroke} strokeWidth={4} />
        <line x1="30" y1="52" x2="30" y2="68" {...stroke} />
        <line x1="45" y1="52" x2="45" y2="68" {...stroke} />
        <line x1="65" y1="52" x2="65" y2="68" {...stroke} />
        <line x1="78" y1="52" x2="78" y2="68" {...stroke} />
      </svg>
    );
  }

  if (type === "pushup") {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <g style={cfg.bodyAnim}>
          <circle cx="20" cy="46" r="7" style={headStyle} />
          <line x1="27" y1="46" x2="76" y2="54" {...stroke} strokeWidth={3.5} />
          <line x1="65" y1="52" x2="65" y2="70" {...stroke} />
          <line x1="78" y1="54" x2="78" y2="70" {...stroke} />
        </g>
        <line x1="27" y1="46" x2="22" y2="62" {...stroke} style={cfg.lArmAnim} />
        <line x1="38" y1="48" x2="33" y2="64" {...stroke} style={cfg.rArmAnim} />
      </svg>
    );
  }

  if (type === "downdog") {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" style={cfg.bodyAnim}>
        <circle cx="72" cy="28" r="7" style={headStyle} />
        <line x1="67" y1="33" x2="40" y2="55" {...stroke} strokeWidth={3.5} />
        <line x1="62" y1="30" x2="55" y2="18" {...stroke} />
        <line x1="72" y1="30" x2="78" y2="18" {...stroke} />
        <line x1="40" y1="55" x2="30" y2="68" {...stroke} />
        <line x1="40" y1="55" x2="50" y2="70" {...stroke} />
      </svg>
    );
  }

  // Default upright figure
  return (
    <svg width={s} height={s} viewBox="0 0 100 100">
      {/* Head */}
      <circle cx="50" cy="22" r="9" style={headStyle} />
      {/* Body */}
      <g style={cfg.bodyAnim}>
        <line x1="50" y1="31" x2="50" y2="62" {...stroke} strokeWidth={3.5} />
        {/* Left arm */}
        <line x1="50" y1="38" x2="34" y2="52" {...stroke} style={cfg.lArmAnim} />
        {/* Right arm */}
        <line x1="50" y1="38" x2="66" y2="52" {...stroke} style={cfg.rArmAnim} />
        {/* Left leg */}
        <line x1="50" y1="62" x2="38" y2="82" {...stroke} style={cfg.lLegAnim} />
        {/* Right leg */}
        <line x1="50" y1="62" x2="62" y2="82" {...stroke} style={cfg.rLegAnim} />
      </g>
    </svg>
  );
}

// ─── Circular Timer ───────────────────────────────────────────────────────────
function CircularTimer({ total, remaining, color, size = 160 }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const progress = total > 0 ? (total - remaining) / total : 0;
  const dash = circ * progress;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.3s linear", filter: `drop-shadow(0 0 8px ${color}88)` }} />
    </svg>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("home"); // home | workout | summary
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [completedIds, setCompletedIds] = useState(new Set());
  const [streak, setStreak] = useState(3);
  const [totalTime, setTotalTime] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [particles, setParticles] = useState([]);
  const [breathPhase, setBreathPhase] = useState("inhale");
  const [breathCount, setBreathCount] = useState(4);
  const timerRef = useRef(null);
  const breathRef = useRef(null);
  const particleRef = useRef(0);

  const current = EXERCISES[currentIdx];
  const phase = PHASES[current?.phase];

  // Init exercise
  const initExercise = useCallback((idx) => {
    const ex = EXERCISES[idx];
    if (!ex) return;
    setCurrentIdx(idx);
    setTimeLeft(ex.duration || 0);
    setRepCount(0);
    setRunning(false);
    clearInterval(timerRef.current);
  }, []);

  // Timer
  useEffect(() => {
    if (running && current?.type !== "reps") {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            handleExerciseDone();
            return 0;
          }
          setTotalTime(tt => tt + 1);
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [running, currentIdx]);

  // Breath animation for rest/breath exercises
  useEffect(() => {
    if (current?.animation === "breath" && running) {
      const cycle = ["inhale", "hold", "exhale", "hold2"];
      const counts = [4, 4, 4, 4];
      let phase = 0, count = counts[0];
      setBreathPhase(cycle[0]);
      setBreathCount(counts[0]);
      breathRef.current = setInterval(() => {
        count--;
        setBreathCount(count);
        if (count <= 0) {
          phase = (phase + 1) % 4;
          count = counts[phase];
          setBreathPhase(cycle[phase]);
          setBreathCount(count);
        }
      }, 1000);
      return () => clearInterval(breathRef.current);
    }
    return () => clearInterval(breathRef.current);
  }, [running, currentIdx]);

  const spawnParticles = () => {
    const ps = Array.from({ length: 8 }, (_, i) => ({
      id: particleRef.current++,
      x: Math.random() * 200 - 100,
      emoji: ["✨", "🌟", "💫", "⭐"][Math.floor(Math.random() * 4)],
    }));
    setParticles(ps);
    setTimeout(() => setParticles([]), 1000);
  };

  const handleExerciseDone = () => {
    setCompletedIds(prev => new Set([...prev, EXERCISES[currentIdx]?.id]));
    spawnParticles();
    const next = currentIdx + 1;
    if (next >= EXERCISES.length) {
      setView("summary");
      setStreak(s => s + 1);
    } else {
      initExercise(next);
    }
  };

  const handleRepDone = () => {
    const newCount = repCount + 1;
    setRepCount(newCount);
    setTotalTime(tt => tt + 3);
    if (newCount >= current.reps) {
      setTimeout(() => handleExerciseDone(), 300);
    }
  };

  const startWorkout = () => {
    setView("workout");
    setCurrentIdx(0);
    setCompletedIds(new Set());
    setTotalTime(0);
    initExercise(0);
  };

  const toggleTimer = () => setRunning(r => !r);

  const skip = () => {
    clearInterval(timerRef.current);
    handleExerciseDone();
  };

  const prev = () => {
    if (currentIdx > 0) initExercise(currentIdx - 1);
  };

  const progressPct = Math.round((completedIds.size / EXERCISES.length) * 100);
  const glowExs = EXERCISES.filter(e => e.skin);

  // ── HOME VIEW ──────────────────────────────────────────────────────────────
  if (view === "home") {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div style={{ minHeight:"100vh", background:"#05080f", fontFamily:"'DM Sans', sans-serif", color:"#F0EBE0" }}>
          {/* Hero */}
          <div style={{ position:"relative", padding:"56px 24px 40px", textAlign:"center", overflow:"hidden",
            background:"radial-gradient(ellipse at 50% 0%, rgba(246,194,68,0.12) 0%, transparent 60%)" }}>
            <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(246,194,68,0.06) 1px, transparent 1px)", backgroundSize:"24px 24px" }} />

            <div style={{ display:"inline-flex", gap:"6px", background:"rgba(246,194,68,0.1)", border:"1px solid rgba(246,194,68,0.25)", borderRadius:"20px", padding:"6px 16px", marginBottom:"24px" }}>
              <span style={{ fontSize:"11px", letterSpacing:"3px", color:"#F6C244", fontFamily:"'DM Mono', monospace" }}>☀ MORNING · HOME · 25 MIN</span>
            </div>

            <h1 style={{ fontFamily:"'DM Serif Display', serif", fontSize:"clamp(38px,10vw,64px)", fontWeight:"400", lineHeight:1.05, marginBottom:"12px", letterSpacing:"-1px" }}>
              Morning<br /><em style={{ color:"#F6C244" }}>Glow</em> Plan
            </h1>
            <p style={{ color:"rgba(240,235,224,0.5)", fontSize:"15px", maxWidth:"280px", margin:"0 auto 32px", lineHeight:1.6 }}>
              25 minutes. No equipment. Skin that glows all day.
            </p>

            {/* Streak */}
            <div style={{ display:"inline-flex", alignItems:"center", gap:"16px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"16px", padding:"16px 28px", marginBottom:"32px" }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:"26px", fontFamily:"'DM Serif Display', serif", color:"#F6C244" }}>{streak}</div>
                <div style={{ fontSize:"10px", letterSpacing:"2px", color:"rgba(240,235,224,0.4)", fontFamily:"'DM Mono', monospace" }}>DAY STREAK</div>
              </div>
              <div style={{ width:"1px", height:"36px", background:"rgba(255,255,255,0.1)" }} />
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:"26px", fontFamily:"'DM Serif Display', serif", color:"#1DBFA3" }}>{glowExs.length}</div>
                <div style={{ fontSize:"10px", letterSpacing:"2px", color:"rgba(240,235,224,0.4)", fontFamily:"'DM Mono', monospace" }}>GLOW MOVES</div>
              </div>
              <div style={{ width:"1px", height:"36px", background:"rgba(255,255,255,0.1)" }} />
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:"26px", fontFamily:"'DM Serif Display', serif", color:"#9B5DE5" }}>25</div>
                <div style={{ fontSize:"10px", letterSpacing:"2px", color:"rgba(240,235,224,0.4)", fontFamily:"'DM Mono', monospace" }}>MINUTES</div>
              </div>
            </div>

            {/* Phases preview */}
            <div style={{ display:"flex", gap:"8px", justifyContent:"center", flexWrap:"wrap", marginBottom:"36px" }}>
              {PHASES.map(p => (
                <div key={p.id} style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${p.color}33`, borderRadius:"12px", padding:"10px 14px", textAlign:"center" }}>
                  <div style={{ fontSize:"18px", marginBottom:"4px" }}>{p.icon}</div>
                  <div style={{ fontSize:"11px", color:p.color, fontFamily:"'DM Mono', monospace", letterSpacing:"1px" }}>{p.name}</div>
                  <div style={{ fontSize:"10px", color:"rgba(240,235,224,0.3)", marginTop:"2px" }}>{p.duration}</div>
                </div>
              ))}
            </div>

            {/* Start Button */}
            <button onClick={startWorkout} style={{
              background:"linear-gradient(135deg, #F6C244, #FF5C35)",
              border:"none", borderRadius:"50px", padding:"18px 52px",
              fontSize:"17px", color:"#0a0500", fontWeight:"700", cursor:"pointer",
              fontFamily:"'DM Sans', sans-serif", letterSpacing:"0.5px",
              boxShadow:"0 8px 32px rgba(246,194,68,0.4)",
              animation:"glow-pulse 2s ease-in-out infinite",
            }}>
              Start Workout ✦
            </button>
          </div>

          {/* Exercise Preview List */}
          <div style={{ padding:"24px 16px", maxWidth:"520px", margin:"0 auto" }}>
            <div style={{ fontFamily:"'DM Mono', monospace", fontSize:"10px", letterSpacing:"3px", color:"rgba(240,235,224,0.3)", marginBottom:"16px" }}>ALL EXERCISES · {EXERCISES.length} MOVES</div>
            {PHASES.map(ph => (
              <div key={ph.id} style={{ marginBottom:"20px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
                  <span style={{ fontSize:"16px" }}>{ph.icon}</span>
                  <span style={{ fontFamily:"'DM Serif Display', serif", fontSize:"16px", color:ph.color }}>{ph.name}</span>
                  <span style={{ fontFamily:"'DM Mono', monospace", fontSize:"10px", color:"rgba(240,235,224,0.3)", marginLeft:"auto" }}>{ph.duration}</span>
                </div>
                {EXERCISES.filter(e => e.phase === ph.id).map((ex, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"8px 12px", borderRadius:"10px", marginBottom:"4px",
                    background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)" }}>
                    <StickFigure type={ex.animation} color={ph.color} size={36} />
                    <div style={{ flex:1 }}>
                      <span style={{ fontSize:"13px", color:"rgba(240,235,224,0.8)" }}>{ex.name}</span>
                      {ex.skin && <span style={{ marginLeft:"6px", fontSize:"9px", background:`${ph.color}22`, color:ph.color, padding:"1px 5px", borderRadius:"6px", fontFamily:"'DM Mono', monospace" }}>✨ GLOW</span>}
                    </div>
                    <span style={{ fontFamily:"'DM Mono', monospace", fontSize:"11px", color:"rgba(240,235,224,0.3)" }}>
                      {ex.duration ? `${ex.duration}s` : `${ex.reps} reps`}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // ── WORKOUT VIEW ───────────────────────────────────────────────────────────
  if (view === "workout") {
    const isRest = current.type === "rest";
    const isReps = current.type === "reps";
    const breathLabel = breathPhase === "hold2" ? "hold" : breathPhase;

    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div style={{ minHeight:"100vh", background:"#05080f", fontFamily:"'DM Sans', sans-serif", color:"#F0EBE0", display:"flex", flexDirection:"column" }}>

          {/* Top Bar */}
          <div style={{ padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
            <button onClick={() => setView("home")} style={{ background:"none", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"8px", padding:"6px 12px", color:"rgba(240,235,224,0.5)", fontSize:"12px", cursor:"pointer", fontFamily:"'DM Mono', monospace" }}>← EXIT</button>
            <div style={{ fontFamily:"'DM Mono', monospace", fontSize:"10px", letterSpacing:"3px", color:phase.color }}>{phase.icon} {phase.name.toUpperCase()}</div>
            <div style={{ fontFamily:"'DM Mono', monospace", fontSize:"11px", color:"rgba(240,235,224,0.4)" }}>{currentIdx + 1}/{EXERCISES.length}</div>
          </div>

          {/* Progress bar */}
          <div style={{ height:"3px", background:"rgba(255,255,255,0.05)" }}>
            <div style={{ height:"100%", width:`${progressPct}%`, background:`linear-gradient(90deg, ${phase.color}, ${phase.color}88)`, transition:"width 0.5s ease" }} />
          </div>

          {/* Phase dots */}
          <div style={{ display:"flex", justifyContent:"center", gap:"6px", padding:"12px" }}>
            {PHASES.map(p => (
              <div key={p.id} style={{ width: p.id === current.phase ? "24px" : "6px", height:"6px", borderRadius:"3px",
                background: p.id < current.phase ? "#ffffff33" : p.id === current.phase ? p.color : "rgba(255,255,255,0.1)",
                transition:"all 0.3s ease" }} />
            ))}
          </div>

          {/* Main content */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"16px 20px", position:"relative" }}>

            {/* Particles */}
            {particles.map(p => (
              <div key={p.id} style={{ position:"absolute", top:"40%", left:`calc(50% + ${p.x}px)`, fontSize:"20px", animation:"float-up 1s ease-out forwards", pointerEvents:"none" }}>{p.emoji}</div>
            ))}

            {/* Exercise name */}
            <div style={{ textAlign:"center", marginBottom:"8px", animation:"fadeIn 0.4s ease" }}>
              <div style={{ fontFamily:"'DM Mono', monospace", fontSize:"10px", letterSpacing:"3px", color:phase.color, marginBottom:"8px" }}>
                EXERCISE {currentIdx + 1} OF {EXERCISES.length}
              </div>
              <h2 style={{ fontFamily:"'DM Serif Display', serif", fontSize:"clamp(26px,7vw,40px)", fontWeight:"400", marginBottom:"6px" }}>
                {current.name}
              </h2>
              {current.skin && (
                <div style={{ display:"inline-flex", alignItems:"center", gap:"4px", background:`${phase.color}22`, border:`1px solid ${phase.color}44`, borderRadius:"12px", padding:"3px 10px", fontSize:"11px", color:phase.color, fontFamily:"'DM Mono', monospace" }}>
                  ✨ SKIN GLOW MOVE
                </div>
              )}
            </div>

            {/* Animation stage */}
            <div style={{ position:"relative", width:"180px", height:"180px", display:"flex", alignItems:"center", justifyContent:"center",
              background:`radial-gradient(circle, ${phase.color}12 0%, transparent 70%)`,
              borderRadius:"50%", margin:"8px 0" }}>
              <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:`2px solid ${phase.color}22`, animation:"pulse-ring 2s ease-out infinite" }} />
              <StickFigure type={current.animation} color={phase.color} size={140} />

              {/* Breath overlay for rest */}
              {current.animation === "breath" && running && (
                <div style={{ position:"absolute", bottom:"-30px", left:"50%", transform:"translateX(-50%)", textAlign:"center" }}>
                  <div style={{ fontFamily:"'DM Mono', monospace", fontSize:"12px", color:phase.color, letterSpacing:"2px", textTransform:"uppercase" }}>{breathLabel}</div>
                  <div style={{ fontFamily:"'DM Serif Display', serif", fontSize:"24px", color:"#F0EBE0", animation:"ticker 1s ease-in-out" }}>{breathCount}</div>
                </div>
              )}
            </div>

            {/* Timer or Reps */}
            {isReps ? (
              <div style={{ textAlign:"center", margin:"16px 0" }}>
                <div style={{ position:"relative", width:"160px", height:"160px", margin:"0 auto" }}>
                  <CircularTimer total={current.reps} remaining={current.reps - repCount} color={phase.color} size={160} />
                  <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ fontFamily:"'DM Serif Display', serif", fontSize:"42px", lineHeight:1 }}>{repCount}</div>
                    <div style={{ fontFamily:"'DM Mono', monospace", fontSize:"10px", color:"rgba(240,235,224,0.4)", letterSpacing:"2px" }}>of {current.reps}</div>
                  </div>
                </div>
                <button onClick={handleRepDone} style={{
                  marginTop:"20px", background:`linear-gradient(135deg, ${phase.color}, ${phase.color}bb)`,
                  border:"none", borderRadius:"50px", padding:"16px 44px",
                  fontSize:"16px", fontWeight:"700", color:"#050810", cursor:"pointer",
                  fontFamily:"'DM Sans', sans-serif",
                  boxShadow:`0 6px 24px ${phase.color}44`,
                  animation: repCount === current.reps - 1 ? "glow-pulse 0.8s ease-in-out infinite" : "none",
                }}>
                  {repCount >= current.reps ? "Done! ✓" : `Rep ${repCount + 1} ✓`}
                </button>
              </div>
            ) : (
              <div style={{ textAlign:"center", margin:"8px 0" }}>
                <div style={{ position:"relative", width:"160px", height:"160px", margin:"0 auto 16px" }}>
                  <CircularTimer total={current.duration} remaining={timeLeft} color={isRest ? "rgba(255,255,255,0.3)" : phase.color} size={160} />
                  <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ fontFamily:"'DM Serif Display', serif", fontSize:"48px", lineHeight:1, color: timeLeft <= 5 ? "#FF5C35" : "#F0EBE0" }}>{timeLeft}</div>
                    <div style={{ fontFamily:"'DM Mono', monospace", fontSize:"10px", color:"rgba(240,235,224,0.4)", letterSpacing:"2px" }}>SECONDS</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tip */}
            <div style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${phase.color}22`, borderRadius:"12px", padding:"12px 16px", maxWidth:"340px", textAlign:"center", marginBottom:"16px" }}>
              <p style={{ fontSize:"13px", color:"rgba(240,235,224,0.6)", lineHeight:1.6 }}>{current.desc}</p>
              {current.muscles.length > 0 && (
                <div style={{ display:"flex", gap:"4px", justifyContent:"center", flexWrap:"wrap", marginTop:"8px" }}>
                  {current.muscles.map(m => (
                    <span key={m} style={{ fontSize:"10px", background:`${phase.color}18`, color:phase.color, padding:"2px 8px", borderRadius:"8px", fontFamily:"'DM Mono', monospace" }}>{m}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Controls */}
            {!isReps && (
              <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
                <button onClick={prev} disabled={currentIdx === 0} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"50%", width:"48px", height:"48px", fontSize:"18px", cursor:"pointer", color:"rgba(240,235,224,0.5)", opacity: currentIdx === 0 ? 0.3 : 1 }}>‹</button>
                <button onClick={toggleTimer} style={{
                  background: running ? "rgba(255,255,255,0.08)" : `linear-gradient(135deg, ${phase.color}, ${phase.color}bb)`,
                  border: running ? `2px solid ${phase.color}` : "none",
                  borderRadius:"50px", padding:"16px 40px",
                  fontSize:"15px", fontWeight:"700", cursor:"pointer",
                  color: running ? phase.color : "#050810",
                  fontFamily:"'DM Sans', sans-serif",
                  minWidth:"140px",
                  boxShadow: running ? "none" : `0 6px 24px ${phase.color}44`,
                }}>
                  {running ? "⏸ Pause" : (timeLeft === (current.duration || 0) ? "▶ Start" : "▶ Resume")}
                </button>
                <button onClick={skip} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"50%", width:"48px", height:"48px", fontSize:"18px", cursor:"pointer", color:"rgba(240,235,224,0.5)" }}>›</button>
              </div>
            )}
          </div>

          {/* Bottom exercise queue */}
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)", padding:"12px 16px" }}>
            <div style={{ fontFamily:"'DM Mono', monospace", fontSize:"9px", letterSpacing:"2px", color:"rgba(240,235,224,0.25)", marginBottom:"8px" }}>UP NEXT</div>
            <div style={{ display:"flex", gap:"8px", overflowX:"auto", paddingBottom:"4px" }}>
              {EXERCISES.slice(currentIdx + 1, currentIdx + 5).map((ex, i) => (
                <div key={i} style={{ flexShrink:0, background:"rgba(255,255,255,0.04)", border:`1px solid ${PHASES[ex.phase].color}22`, borderRadius:"10px", padding:"8px 12px", minWidth:"100px" }}>
                  <div style={{ fontSize:"11px", color:"rgba(240,235,224,0.7)", marginBottom:"3px", whiteSpace:"nowrap" }}>{ex.name}</div>
                  <div style={{ fontFamily:"'DM Mono', monospace", fontSize:"9px", color:PHASES[ex.phase].color }}>{ex.duration ? `${ex.duration}s` : `${ex.reps} reps`}</div>
                </div>
              ))}
              {currentIdx + 1 >= EXERCISES.length && (
                <div style={{ flexShrink:0, background:"rgba(246,194,68,0.08)", border:"1px solid rgba(246,194,68,0.2)", borderRadius:"10px", padding:"8px 12px" }}>
                  <div style={{ fontSize:"11px", color:"#F6C244" }}>🎉 Finish!</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── SUMMARY VIEW ───────────────────────────────────────────────────────────
  if (view === "summary") {
    const mins = Math.floor(totalTime / 60);
    const secs = totalTime % 60;
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div style={{ minHeight:"100vh", background:"#05080f", fontFamily:"'DM Sans', sans-serif", color:"#F0EBE0", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px", textAlign:"center",
          background:"radial-gradient(ellipse at 50% 30%, rgba(246,194,68,0.1) 0%, #05080f 60%)" }}>
          
          <div style={{ fontSize:"64px", marginBottom:"16px" }}>🌟</div>
          <div style={{ fontFamily:"'DM Mono', monospace", fontSize:"11px", letterSpacing:"4px", color:"#F6C244", marginBottom:"12px" }}>WORKOUT COMPLETE</div>
          <h1 style={{ fontFamily:"'DM Serif Display', serif", fontSize:"clamp(32px,8vw,52px)", fontWeight:"400", marginBottom:"8px" }}>
            You're <em>glowing!</em>
          </h1>
          <p style={{ color:"rgba(240,235,224,0.5)", fontSize:"14px", marginBottom:"40px", maxWidth:"280px", lineHeight:1.6 }}>
            Your skin is now flooded with oxygen-rich blood. That post-workout glow is real and will last hours.
          </p>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px", width:"100%", maxWidth:"380px", marginBottom:"40px" }}>
            {[
              { label:"TIME", value:`${mins}:${String(secs).padStart(2,"0")}`, color:"#F6C244", icon:"⏱" },
              { label:"EXERCISES", value:EXERCISES.length, color:"#1DBFA3", icon:"💪" },
              { label:"STREAK", value:`${streak} days`, color:"#9B5DE5", icon:"🔥" },
            ].map(stat => (
              <div key={stat.label} style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${stat.color}33`, borderRadius:"16px", padding:"20px 12px" }}>
                <div style={{ fontSize:"22px", marginBottom:"8px" }}>{stat.icon}</div>
                <div style={{ fontFamily:"'DM Serif Display', serif", fontSize:"22px", color:stat.color }}>{stat.value}</div>
                <div style={{ fontFamily:"'DM Mono', monospace", fontSize:"9px", color:"rgba(240,235,224,0.3)", letterSpacing:"2px", marginTop:"4px" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background:"rgba(29,191,163,0.06)", border:"1px solid rgba(29,191,163,0.2)", borderRadius:"16px", padding:"20px", maxWidth:"380px", width:"100%", marginBottom:"32px", textAlign:"left" }}>
            <div style={{ fontFamily:"'DM Mono', monospace", fontSize:"10px", letterSpacing:"2px", color:"#1DBFA3", marginBottom:"14px" }}>POST-WORKOUT RITUAL</div>
            {[
              { icon:"🚿", text:"Shower now — rinse sweat before pores re-clog" },
              { icon:"🍊", text:"Apply Vitamin C serum — skin absorbs it 3× better right now" },
              { icon:"💧", text:"Drink 500ml water to replenish" },
              { icon:"🧊", text:"Cold water face rinse to seal pores & boost glow" },
            ].map((tip, i) => (
              <div key={i} style={{ display:"flex", gap:"10px", marginBottom: i < 3 ? "12px" : 0, alignItems:"flex-start" }}>
                <span style={{ fontSize:"16px" }}>{tip.icon}</span>
                <span style={{ fontSize:"13px", color:"rgba(240,235,224,0.7)", lineHeight:1.5 }}>{tip.text}</span>
              </div>
            ))}
          </div>

          <button onClick={() => { setView("home"); setStreak(s => s); }} style={{
            background:"linear-gradient(135deg, #F6C244, #FF5C35)",
            border:"none", borderRadius:"50px", padding:"16px 44px",
            fontSize:"16px", color:"#0a0500", fontWeight:"700", cursor:"pointer",
            fontFamily:"'DM Sans', sans-serif",
            boxShadow:"0 8px 32px rgba(246,194,68,0.35)",
          }}>
            Back to Home ✦
          </button>
        </div>
      </>
    );
  }

  return null;
}
