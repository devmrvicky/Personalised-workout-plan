import { useState } from "react";

const plan = {
  title: "Morning Glow Plan",
  subtitle: "Home · No Equipment · 25 Minutes",
  tagline: "Move. Sweat. Glow.",
  sections: [
    {
      id: "warmup",
      phase: "01",
      label: "Warm-Up",
      duration: "3 min",
      color: "#F6C244",
      bg: "#FFFBEA",
      icon: "🌅",
      tip: "Do this right after waking — before coffee, before phone.",
      exercises: [
        { name: "Neck Rolls", detail: "Slow circles, 5 each side", duration: "30s", skin: false },
        { name: "Shoulder Circles", detail: "Forward & back, loosen up", duration: "30s", skin: false },
        { name: "March in Place", detail: "Lift knees high, swing arms", duration: "1 min", skin: false },
        { name: "Torso Twists", detail: "Hands on hips, rotate gently", duration: "30s", skin: false },
        { name: "Slow Jumping Jacks", detail: "Ease into the rhythm", duration: "30s", skin: false },
      ],
    },
    {
      id: "cardio",
      phase: "02",
      label: "Cardio Burst",
      duration: "6 min",
      color: "#FF5C35",
      bg: "#FFF2EF",
      icon: "🔥",
      tip: "This is your #1 skin-glow phase — floods skin with oxygen-rich blood.",
      exercises: [
        { name: "High Knees", detail: "Drive knees up fast", duration: "45s", skin: true },
        { name: "Rest", detail: "Breathe, shake it out", duration: "15s", skin: false },
        { name: "Butt Kicks", detail: "Heels to glutes, keep pace", duration: "45s", skin: true },
        { name: "Rest", detail: "Breathe deep", duration: "15s", skin: false },
        { name: "Jump Rope (imaginary)", detail: "Wrists rotating, light on feet", duration: "1 min", skin: true },
        { name: "Lateral Shuffles", detail: "Side-to-side, low stance", duration: "1 min", skin: true },
        { name: "Mountain Climbers", detail: "Drive knees in, core tight", duration: "45s", skin: true },
        { name: "Rest", detail: "Walk in place", duration: "1 min", skin: false },
      ],
    },
    {
      id: "strength",
      phase: "03",
      label: "Strength & Tone",
      duration: "8 min",
      color: "#3D6BFF",
      bg: "#EEF2FF",
      icon: "💪",
      tip: "Build muscle, improve posture — good posture = confident glow.",
      exercises: [
        { name: "Squats", detail: "15 reps · feet hip-width", duration: "15 reps", skin: false },
        { name: "Push-Ups", detail: "10 reps · knees ok for beginners", duration: "10 reps", skin: false },
        { name: "Glute Bridges", detail: "15 reps · squeeze at top", duration: "15 reps", skin: false },
        { name: "Plank Hold", detail: "Core tight, don't dip hips", duration: "30s", skin: false },
        { name: "Reverse Lunges", detail: "10 each leg · controlled", duration: "20 reps", skin: false },
        { name: "Superman Hold", detail: "10 reps · back & glutes", duration: "10 reps", skin: false },
        { name: "Tricep Dips (chair)", detail: "10 reps · arms close", duration: "10 reps", skin: false },
      ],
    },
    {
      id: "yoga",
      phase: "04",
      label: "Yoga & Glow Stretch",
      duration: "6 min",
      color: "#1DBFA3",
      bg: "#EDFAF7",
      icon: "✨",
      tip: "Inversions send blood to your face. These poses are your secret skincare.",
      exercises: [
        { name: "Child's Pose", detail: "Forehead down, arms forward", duration: "1 min", skin: true },
        { name: "Downward Dog", detail: "Hips high — inversion for face glow", duration: "45s", skin: true },
        { name: "Seated Forward Fold", detail: "Reach toes, breathe deep", duration: "45s", skin: true },
        { name: "Legs Up the Wall", detail: "Lymphatic drainage, reduces puffiness", duration: "1 min", skin: true },
        { name: "Spinal Twist", detail: "30s each side · detox pose", duration: "1 min", skin: true },
        { name: "Corpse Pose", detail: "Eyes closed, full breath", duration: "30s", skin: true },
      ],
    },
    {
      id: "cooldown",
      phase: "05",
      label: "Cool Down",
      duration: "2 min",
      color: "#9B5DE5",
      bg: "#F5EEFF",
      icon: "🌿",
      tip: "Finish with a face massage — skin is most receptive post-workout.",
      exercises: [
        { name: "Box Breathing", detail: "In 4 · Hold 4 · Out 4 · Repeat x4", duration: "1 min", skin: true },
        { name: "Neck & Wrist Stretches", detail: "Gentle, each direction", duration: "30s", skin: false },
        { name: "Face Tap Massage", detail: "Fingertips on cheeks, forehead, jaw", duration: "30s", skin: true },
      ],
    },
  ],
  skinTips: [
    { icon: "💧", tip: "Drink 500ml water before starting" },
    { icon: "🧴", tip: "Wash face before workout — clear pores sweat better" },
    { icon: "🚿", tip: "Shower within 30 min after — rinse sweat before pores re-clog" },
    { icon: "🍊", tip: "Apply Vitamin C serum post-workout — skin absorbs better now" },
    { icon: "🙌", tip: "Don't touch your face during exercise" },
  ],
  weekly: [
    { day: "Mon", focus: "Full Plan", active: true },
    { day: "Tue", focus: "Full + extra yoga", active: true },
    { day: "Wed", focus: "Full Plan", active: true },
    { day: "Thu", focus: "Yoga only (15 min)", active: false },
    { day: "Fri", focus: "Full Plan", active: true },
    { day: "Sat", focus: "Outdoor walk 30 min", active: true },
    { day: "Sun", focus: "Rest & hydrate", active: false },
  ],
};

export default function App() {
  const [activeSection, setActiveSection] = useState(null);
  const [done, setDone] = useState({});

  const toggle = (id) => setActiveSection(activeSection === id ? null : id);
  const toggleDone = (secId, exIdx) => {
    const key = `${secId}-${exIdx}`;
    setDone((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalExercises = plan.sections.reduce((a, s) => a + s.exercises.length, 0);
  const doneCount = Object.values(done).filter(Boolean).length;
  const progress = Math.round((doneCount / totalExercises) * 100);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0F0F0F",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#F5F0E8",
      padding: "0 0 60px",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a0a2e 0%, #0d1f3c 50%, #0a2a1a 100%)",
        padding: "48px 24px 36px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        {/* bg orbs */}
        <div style={{ position:"absolute", top:"-40px", left:"-40px", width:"200px", height:"200px", borderRadius:"50%", background:"radial-gradient(circle, rgba(246,194,68,0.15) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-60px", right:"-30px", width:"250px", height:"250px", borderRadius:"50%", background:"radial-gradient(circle, rgba(29,191,163,0.12) 0%, transparent 70%)", pointerEvents:"none" }} />

        <div style={{ fontSize:"13px", letterSpacing:"4px", color:"#F6C244", textTransform:"uppercase", marginBottom:"12px", fontFamily:"'Courier New', monospace" }}>
          ☀ Personal Morning Plan
        </div>
        <h1 style={{ fontSize:"clamp(32px,8vw,56px)", fontWeight:"400", margin:"0 0 8px", lineHeight:1.1, letterSpacing:"-1px" }}>
          {plan.title}
        </h1>
        <p style={{ color:"rgba(245,240,232,0.5)", fontSize:"14px", letterSpacing:"2px", margin:"0 0 24px", fontFamily:"'Courier New', monospace" }}>
          {plan.subtitle}
        </p>
        <div style={{ display:"inline-block", background:"rgba(246,194,68,0.12)", border:"1px solid rgba(246,194,68,0.3)", borderRadius:"20px", padding:"6px 20px", fontSize:"16px", letterSpacing:"1px", color:"#F6C244" }}>
          {plan.tagline}
        </div>

        {/* Progress */}
        <div style={{ maxWidth:"360px", margin:"28px auto 0" }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", color:"rgba(245,240,232,0.4)", letterSpacing:"2px", marginBottom:"8px", fontFamily:"'Courier New', monospace" }}>
            <span>TODAY'S PROGRESS</span>
            <span>{doneCount}/{totalExercises} · {progress}%</span>
          </div>
          <div style={{ height:"4px", background:"rgba(255,255,255,0.08)", borderRadius:"2px", overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg, #F6C244, #FF5C35, #1DBFA3)", borderRadius:"2px", transition:"width 0.4s ease" }} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth:"640px", margin:"0 auto", padding:"0 16px" }}>

        {/* Sections */}
        <div style={{ marginTop:"32px" }}>
          {plan.sections.map((sec) => {
            const isOpen = activeSection === sec.id;
            const secDone = sec.exercises.filter((_, i) => done[`${sec.id}-${i}`]).length;
            return (
              <div key={sec.id} style={{ marginBottom:"12px" }}>
                {/* Section header */}
                <button
                  onClick={() => toggle(sec.id)}
                  style={{
                    width:"100%", textAlign:"left", background: isOpen ? sec.bg : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isOpen ? sec.color + "55" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: isOpen ? "16px 16px 0 0" : "16px",
                    padding:"18px 20px", cursor:"pointer", transition:"all 0.3s ease",
                  }}
                >
                  <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                    <span style={{ fontSize:"22px" }}>{sec.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                        <span style={{ fontFamily:"'Courier New', monospace", fontSize:"10px", color: sec.color, letterSpacing:"2px" }}>
                          PHASE {sec.phase}
                        </span>
                        {secDone === sec.exercises.length && (
                          <span style={{ background: sec.color, color:"#000", fontSize:"9px", padding:"1px 7px", borderRadius:"10px", letterSpacing:"1px", fontFamily:"'Courier New', monospace" }}>DONE ✓</span>
                        )}
                      </div>
                      <div style={{ fontSize:"18px", color: isOpen ? "#0F0F0F" : "#F5F0E8", fontWeight:"600", marginTop:"2px" }}>
                        {sec.label}
                      </div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:"13px", color: isOpen ? sec.color : "rgba(245,240,232,0.4)", fontFamily:"'Courier New', monospace", fontWeight:"600" }}>{sec.duration}</div>
                      <div style={{ fontSize:"11px", color: isOpen ? "rgba(0,0,0,0.4)" : "rgba(245,240,232,0.25)", marginTop:"2px" }}>{secDone}/{sec.exercises.length}</div>
                    </div>
                  </div>
                </button>

                {/* Expanded */}
                {isOpen && (
                  <div style={{
                    background: sec.bg, border:`1px solid ${sec.color}55`, borderTop:"none",
                    borderRadius:"0 0 16px 16px", padding:"0 20px 20px",
                  }}>
                    {/* tip */}
                    <div style={{ background:"rgba(0,0,0,0.06)", borderLeft:`3px solid ${sec.color}`, borderRadius:"0 8px 8px 0", padding:"10px 14px", marginBottom:"16px", fontSize:"13px", color:"rgba(0,0,0,0.6)", fontStyle:"italic" }}>
                      💡 {sec.tip}
                    </div>
                    {sec.exercises.map((ex, i) => {
                      const key = `${sec.id}-${i}`;
                      const isDone = done[key];
                      const isRest = ex.name === "Rest";
                      return (
                        <div
                          key={i}
                          onClick={() => !isRest && toggleDone(sec.id, i)}
                          style={{
                            display:"flex", alignItems:"center", gap:"12px",
                            padding:"10px 12px", borderRadius:"10px", marginBottom:"6px",
                            background: isDone ? `${sec.color}22` : isRest ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.6)",
                            border: isDone ? `1px solid ${sec.color}55` : "1px solid transparent",
                            cursor: isRest ? "default" : "pointer",
                            transition:"all 0.2s ease",
                            opacity: isRest ? 0.5 : 1,
                          }}
                        >
                          <div style={{
                            width:"22px", height:"22px", borderRadius:"50%", flexShrink:0,
                            border: `2px solid ${isDone ? sec.color : "rgba(0,0,0,0.2)"}`,
                            background: isDone ? sec.color : "transparent",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:"11px", transition:"all 0.2s",
                          }}>
                            {isDone && "✓"}
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:"15px", color:"#111", fontWeight: isDone ? "400" : "600", textDecoration: isDone ? "line-through" : "none", opacity: isDone ? 0.5 : 1 }}>
                              {ex.name} {ex.skin && <span style={{ fontSize:"10px", background:`${sec.color}33`, color: sec.color, padding:"1px 6px", borderRadius:"8px", marginLeft:"4px", fontFamily:"'Courier New', monospace", verticalAlign:"middle" }}>✨ GLOW</span>}
                            </div>
                            <div style={{ fontSize:"12px", color:"rgba(0,0,0,0.45)", marginTop:"1px" }}>{ex.detail}</div>
                          </div>
                          <div style={{ fontSize:"12px", color: sec.color, fontFamily:"'Courier New', monospace", fontWeight:"600", whiteSpace:"nowrap" }}>
                            {ex.duration}
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

        {/* Skin Tips */}
        <div style={{ marginTop:"36px" }}>
          <div style={{ fontFamily:"'Courier New', monospace", fontSize:"10px", color:"#1DBFA3", letterSpacing:"3px", marginBottom:"14px" }}>
            ✦ SKIN GLOW RITUAL
          </div>
          <div style={{ background:"rgba(29,191,163,0.06)", border:"1px solid rgba(29,191,163,0.2)", borderRadius:"16px", padding:"20px" }}>
            {plan.skinTips.map((t, i) => (
              <div key={i} style={{ display:"flex", gap:"12px", alignItems:"flex-start", marginBottom: i < plan.skinTips.length - 1 ? "14px" : 0 }}>
                <span style={{ fontSize:"18px", flexShrink:0 }}>{t.icon}</span>
                <span style={{ fontSize:"14px", color:"rgba(245,240,232,0.75)", lineHeight:1.5 }}>{t.tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Schedule */}
        <div style={{ marginTop:"36px" }}>
          <div style={{ fontFamily:"'Courier New', monospace", fontSize:"10px", color:"#F6C244", letterSpacing:"3px", marginBottom:"14px" }}>
            ✦ WEEKLY SCHEDULE
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:"6px" }}>
            {plan.weekly.map((w, i) => (
              <div key={i} style={{
                background: w.active ? "rgba(246,194,68,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${w.active ? "rgba(246,194,68,0.3)" : "rgba(255,255,255,0.06)"}`,
                borderRadius:"12px", padding:"10px 6px", textAlign:"center",
              }}>
                <div style={{ fontFamily:"'Courier New', monospace", fontSize:"10px", color: w.active ? "#F6C244" : "rgba(245,240,232,0.3)", letterSpacing:"1px", marginBottom:"6px" }}>
                  {w.day.toUpperCase()}
                </div>
                <div style={{ fontSize:"9px", color: w.active ? "rgba(245,240,232,0.6)" : "rgba(245,240,232,0.2)", lineHeight:1.4 }}>
                  {w.focus}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop:"48px", textAlign:"center", padding:"24px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize:"24px", marginBottom:"8px" }}>🌸</div>
          <div style={{ fontFamily:"'Courier New', monospace", fontSize:"11px", color:"rgba(245,240,232,0.3)", letterSpacing:"2px" }}>
            CONSISTENCY IS YOUR SKINCARE
          </div>
          <div style={{ fontSize:"12px", color:"rgba(245,240,232,0.2)", marginTop:"6px" }}>
            Tap each exercise to mark it done · Track your progress daily
          </div>
        </div>
      </div>
    </div>
  );
}
