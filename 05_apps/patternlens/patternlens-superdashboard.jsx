import { useState, useEffect, useCallback, useRef } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar,
} from "recharts";

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS — "Obsidian Terminal" aesthetic
   Fintech precision meets structural analysis depth
   Fonts: Syne (display) + IBM Plex Mono (data/code)
   ═══════════════════════════════════════════════════════════ */

const T = {
  bg:          "#040408",
  bgSubtle:    "#08081a",
  surface:     "#0b0b1e",
  surfaceAlt:  "#0f0f28",
  surfaceHot:  "#141438",
  border:      "#1a1a40",
  borderHot:   "#2a2a60",
  borderAccent:"#4f46e5",
  text:        "#eeeef6",
  text2:       "#a0a0c0",
  text3:       "#6060a0",
  text4:       "#404070",
  accent:      "#4f46e5",
  accentLight: "#6366f1",
  accentGlow:  "rgba(79,70,229,0.20)",
  accentGlow2: "rgba(79,70,229,0.08)",
  green:       "#00e68a",
  greenGlow:   "rgba(0,230,138,0.12)",
  red:         "#ff3355",
  redGlow:     "rgba(255,51,85,0.10)",
  amber:       "#ffaa00",
  amberGlow:   "rgba(255,170,0,0.10)",
  cyan:        "#00ccff",
  cyanGlow:    "rgba(0,204,255,0.10)",
  magenta:     "#e040a0",
  magentaGlow: "rgba(224,64,160,0.10)",
  white08:     "rgba(255,255,255,0.08)",
  white04:     "rgba(255,255,255,0.04)",
};

const fontDisplay = "'Syne', 'Poppins', 'Manrope', system-ui, sans-serif";
const fontMono = "'IBM Plex Mono', 'JetBrains Mono', 'Fira Code', monospace";

/* ═══ DATA ═══ */

const MRR_DATA = [
  { m:"Sep'25", mrr:0, users:12, proj:false },
  { m:"Oct", mrr:290, users:34, proj:false },
  { m:"Nov", mrr:870, users:78, proj:false },
  { m:"Dec", mrr:2030, users:156, proj:false },
  { m:"Jan'26", mrr:4640, users:312, proj:false },
  { m:"Feb", mrr:8700, users:589, proj:false },
  { m:"Mar*", mrr:15200, users:980, proj:true },
  { m:"Apr*", mrr:24800, users:1540, proj:true },
  { m:"May*", mrr:38000, users:2400, proj:true },
  { m:"Jun*", mrr:56000, users:3700, proj:true },
  { m:"Jul*", mrr:78000, users:5200, proj:true },
  { m:"Aug*", mrr:104000, users:7100, proj:true },
];

const OBJ_WEEKLY = [
  { w:"W48", created:45, analyzed:42, patterns:18 },
  { w:"W49", created:67, analyzed:64, patterns:28 },
  { w:"W50", created:89, analyzed:85, patterns:41 },
  { w:"W51", created:134, analyzed:128, patterns:62 },
  { w:"W01", created:198, analyzed:190, patterns:94 },
  { w:"W02", created:267, analyzed:258, patterns:131 },
  { w:"W03", created:312, analyzed:301, patterns:158 },
  { w:"W04", created:389, analyzed:376, patterns:192 },
  { w:"W05", created:445, analyzed:432, patterns:221 },
];

const AI_SPEND = [
  { m:"Oct", claude:12, whisper:4, embed:1, total:17 },
  { m:"Nov", claude:28, whisper:9, embed:2, total:39 },
  { m:"Dec", claude:56, whisper:18, embed:5, total:79 },
  { m:"Jan", claude:112, whisper:36, embed:11, total:159 },
  { m:"Feb", claude:198, whisper:64, embed:22, total:284 },
];

const COMPLIANCE = [
  { cat:"GDPR",        total:28, pass:27, status:"warn" },
  { cat:"Safety",      total:22, pass:22, status:"ok" },
  { cat:"Language",    total:41, pass:39, status:"warn" },
  { cat:"AI Contract", total:18, pass:18, status:"ok" },
  { cat:"App Store",   total:24, pass:21, status:"warn" },
  { cat:"A11y",        total:14, pass:12, status:"warn" },
];

const CRISIS = [
  { id:"CR-041", date:"Feb 4", level:"HARD", action:"Modal + Resources PL", ok:true },
  { id:"CR-040", date:"Feb 3", level:"SOFT", action:"Soft Redirect", ok:true },
  { id:"CR-039", date:"Feb 1", level:"SOFT", action:"Soft Redirect", ok:true },
  { id:"CR-038", date:"Jan 29", level:"HARD", action:"Modal + Resources US", ok:true },
  { id:"CR-037", date:"Jan 27", level:"SOFT", action:"Soft Redirect", ok:true },
  { id:"CR-036", date:"Jan 24", level:"HARD", action:"Modal + Resources PL", ok:true },
];

const DOMAINS = [
  { d:"patternlens.app", role:"Consumer PWA", tier:"Prod", st:"live" },
  { d:"patternslab.app", role:"B2B Platform", tier:"Prod", st:"live" },
  { d:"patternslab.work", role:"Investor Portal", tier:"Biz", st:"live" },
  { d:"silence-objects.dev", role:"Open Source Docs", tier:"Community", st:"building" },
  { d:"patternslab.org", role:"Framework Registry", tier:"MIT", st:"building" },
];

const OSS_PKGS = [
  { name:"@silence-objects/core", desc:"Structural pattern classifier — 4-phase protocol", loc:"2.8k", license:"MIT", st:"ready" },
  { name:"@silence-objects/safety", desc:"3-layer crisis detection (hard/soft/AI)", loc:"1.6k", license:"MIT", st:"ready" },
  { name:"@silence-objects/language", desc:"Bilingual terminology validator (PL/EN)", loc:"1.2k", license:"MIT", st:"ready" },
  { name:"@silence-objects/validator", desc:"Contract compliance linter — CI/CD integration", loc:"720", license:"MIT", st:"published" },
];

const RECENT_OBJ = [
  { id:"OBJ-892", txt:"Rozmowa z przełożonym o deadline — napięcie autonomii", p:3, t:"2h" },
  { id:"OBJ-891", txt:"Voice: Conflict at team meeting about priorities", p:2, t:"5h" },
  { id:"OBJ-890", txt:"Recurring tension: authority vs. independence pattern", p:4, t:"1d" },
  { id:"OBJ-889", txt:"Voice: Boundary discussion — communication breakdown", p:2, t:"1d" },
  { id:"OBJ-888", txt:"Decision paralysis at professional crossroad", p:3, t:"2d" },
  { id:"OBJ-887", txt:"Pattern: defensive response in feedback situations", p:5, t:"3d" },
];

const MOAT = [
  { name:"SILENCE.OBJECTS Constitutional Framework", pct:95, color:T.accent },
  { name:"Dual-Lens Structural Analysis (unique IP)", pct:92, color:T.accentLight },
  { name:'"NOT therapy" regulatory positioning', pct:88, color:T.green },
  { name:"147-point compliance matrix", pct:85, color:T.cyan },
  { name:"Open-source community flywheel", pct:60, color:T.magenta },
  { name:"Bilingual PL/EN from day one", pct:75, color:T.amber },
];

/* ═══ PRIMITIVES ═══ */

const Badge = ({ children, color, bg }) => (
  <span style={{
    fontSize:9, fontWeight:700, letterSpacing:"0.08em", padding:"3px 7px",
    borderRadius:4, background:bg||T.accentGlow, color:color||T.accent,
    fontFamily:fontMono, display:"inline-block", lineHeight:1,
  }}>{children}</span>
);

const Stat = ({ label, value, sub, delta, icon, color, glow }) => {
  const c = color || T.accent;
  return (
    <div style={{
      background:T.surface, border:`1px solid ${T.border}`, borderRadius:14,
      padding:"20px 22px", position:"relative", overflow:"hidden",
      transition:"border-color 0.2s",
    }}>
      <div style={{
        position:"absolute",top:-30,right:-30,width:100,height:100,
        background:`radial-gradient(circle,${glow||T.accentGlow},transparent 70%)`,
        borderRadius:"50%",pointerEvents:"none",
      }}/>
      <div style={{ position:"relative" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div style={{ fontSize:10, color:T.text3, letterSpacing:"0.1em", fontFamily:fontMono, textTransform:"uppercase" }}>{label}</div>
          <span style={{ fontSize:20 }}>{icon}</span>
        </div>
        <div style={{ fontSize:30, fontWeight:800, color:c, marginTop:8, fontFamily:fontDisplay, letterSpacing:"-0.03em", lineHeight:1 }}>{value}</div>
        {sub && <div style={{ fontSize:10, color:T.text3, marginTop:6, fontFamily:fontMono }}>{sub}</div>}
        {delta !== undefined && (
          <div style={{ marginTop:8, fontSize:11, fontFamily:fontMono }}>
            <span style={{ color:delta>=0?T.green:T.red, fontWeight:700 }}>{delta>=0?"▲":"▼"} {Math.abs(delta)}%</span>
            <span style={{ color:T.text4, marginLeft:6 }}>vs prev</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Section = ({ icon, title, sub, children, noPad }) => (
  <div style={{ marginBottom:0 }}>
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
      <span style={{ fontSize:15 }}>{icon}</span>
      <div>
        <h3 style={{ fontSize:14, fontWeight:700, color:T.text, margin:0, fontFamily:fontDisplay }}>{title}</h3>
        {sub && <p style={{ fontSize:10, color:T.text4, margin:"2px 0 0", fontFamily:fontMono }}>{sub}</p>}
      </div>
    </div>
    <div style={ noPad ? {} : { background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, padding:20 }}>
      {children}
    </div>
  </div>
);

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:T.surfaceAlt, border:`1px solid ${T.border}`, borderRadius:8,
      padding:"8px 12px", fontSize:11, fontFamily:fontMono,
    }}>
      <div style={{ color:T.text, fontWeight:700, marginBottom:4 }}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{ color:p.color, display:"flex", gap:8 }}>
          <span style={{ color:T.text3 }}>{p.name}:</span>
          <span style={{ fontWeight:600 }}>{typeof p.value==="number"?p.value.toLocaleString():p.value}</span>
        </div>
      ))}
    </div>
  );
};

const ProgressBar = ({ pct, color, h=4 }) => (
  <div style={{ height:h, background:T.white04, borderRadius:h/2, overflow:"hidden" }}>
    <div style={{ height:"100%", width:`${pct}%`, background:color||T.accent, borderRadius:h/2, transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)" }}/>
  </div>
);

/* ═══════════════════════════════════════════════
   VIEW 1: INVESTOR (DEFAULT) — patternslab.work
   ═══════════════════════════════════════════════ */

function InvestorView() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      {/* Hero */}
      <div style={{
        background:`linear-gradient(135deg, ${T.surfaceAlt} 0%, ${T.surface} 40%, ${T.bgSubtle} 100%)`,
        border:`1px solid ${T.green}22`, borderRadius:20, padding:"32px 36px",
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute",top:-80,right:-40,width:300,height:300,background:`radial-gradient(circle,${T.greenGlow},transparent 60%)`,pointerEvents:"none" }}/>
        <div style={{ position:"absolute",bottom:-60,left:-40,width:200,height:200,background:`radial-gradient(circle,${T.accentGlow},transparent 60%)`,pointerEvents:"none" }}/>
        <div style={{ position:"relative" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
            <Badge color={T.green} bg={T.greenGlow}>LIVE METRICS</Badge>
            <Badge color={T.text3} bg={T.white04}>FEB 2026</Badge>
          </div>
          <h1 style={{ fontSize:26, fontWeight:900, color:T.text, margin:"8px 0 0", fontFamily:fontDisplay, letterSpacing:"-0.02em" }}>
            PatternLens Ecosystem
          </h1>
          <p style={{ fontSize:12, color:T.text3, margin:"6px 0 0", fontFamily:fontMono }}>
            Structural pattern analysis platform — neurodiversity-focused — NOT therapy
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20, marginTop:28 }}>
            {[
              { label:"ARR Run Rate", value:"104k", unit:"PLN", sub:"~€24k · 12x MRR", color:T.green },
              { label:"Active Users", value:"589", unit:"", sub:"+89% MoM growth", color:T.cyan },
              { label:"AI Gross Margin", value:"93%", unit:"", sub:"29 PLN rev / ~2 PLN cost", color:T.accent },
              { label:"TAM (PL)", value:"2.3M", unit:"", sub:"neurodiv adults addressable", color:T.magenta },
            ].map(m=>(
              <div key={m.label}>
                <div style={{ fontSize:9, color:T.text4, fontFamily:fontMono, letterSpacing:"0.1em", textTransform:"uppercase" }}>{m.label}</div>
                <div style={{ marginTop:6, display:"flex", alignItems:"baseline", gap:4 }}>
                  <span style={{ fontSize:32, fontWeight:900, color:m.color, fontFamily:fontDisplay, lineHeight:1, letterSpacing:"-0.03em" }}>{m.value}</span>
                  {m.unit && <span style={{ fontSize:14, color:m.color, fontFamily:fontMono, opacity:0.7 }}>{m.unit}</span>}
                </div>
                <div style={{ fontSize:10, color:T.text3, fontFamily:fontMono, marginTop:4 }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MRR Chart */}
      <Section icon="📈" title="Revenue Trajectory" sub="Actual (solid) + Projected (dashed) — PLN">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={MRR_DATA}>
            <defs>
              <linearGradient id="inv-mrr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={T.green} stopOpacity={0.35}/>
                <stop offset="100%" stopColor={T.green} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="inv-usr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={T.cyan} stopOpacity={0.15}/>
                <stop offset="100%" stopColor={T.cyan} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="m" stroke={T.text4} fontSize={9} tickLine={false} axisLine={false} fontFamily={fontMono}/>
            <YAxis yAxisId="l" stroke={T.text4} fontSize={9} tickLine={false} axisLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`} fontFamily={fontMono}/>
            <YAxis yAxisId="r" orientation="right" stroke={T.text4} fontSize={9} tickLine={false} axisLine={false} fontFamily={fontMono}/>
            <Tooltip content={<ChartTip/>}/>
            <Area yAxisId="l" type="monotone" dataKey="mrr" stroke={T.green} fill="url(#inv-mrr)" strokeWidth={2.5} dot={false} name="MRR (PLN)"/>
            <Area yAxisId="r" type="monotone" dataKey="users" stroke={T.cyan} fill="url(#inv-usr)" strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="Users"/>
          </AreaChart>
        </ResponsiveContainer>
      </Section>

      {/* Unit Econ + Moat */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Section icon="🎯" title="Unit Economics" sub="Per-user profitability">
          {[
            { k:"ARPU", v:"29 PLN/mo", c:T.green },
            { k:"CAC", v:"~15 PLN", c:T.amber },
            { k:"LTV (12mo)", v:"~290 PLN", c:T.green },
            { k:"LTV:CAC Ratio", v:"19.3 : 1", c:T.accent },
            { k:"AI Cost / User", v:"~2 PLN/mo", c:T.cyan },
            { k:"Gross Margin", v:"93%", c:T.green },
            { k:"Payback Period", v:"0.5 months", c:T.green },
            { k:"Net Revenue Retention", v:"115%", c:T.accent },
          ].map(r=>(
            <div key={r.k} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${T.border}`, fontSize:12, fontFamily:fontMono }}>
              <span style={{ color:T.text3 }}>{r.k}</span>
              <span style={{ color:r.c, fontWeight:700 }}>{r.v}</span>
            </div>
          ))}
        </Section>

        <Section icon="🏆" title="Competitive Moat" sub="Defensibility scoring">
          {MOAT.map(m=>(
            <div key={m.name} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, fontFamily:fontMono, marginBottom:4 }}>
                <span style={{ color:T.text2 }}>{m.name}</span>
                <span style={{ color:m.color, fontWeight:700 }}>{m.pct}%</span>
              </div>
              <ProgressBar pct={m.pct} color={m.color} h={5}/>
            </div>
          ))}
        </Section>
      </div>

      {/* Domains + Open/Prop Split */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Section icon="🌐" title="Domain Architecture" sub="5-domain ecosystem">
          {DOMAINS.map(d=>(
            <div key={d.d} style={{ display:"grid", gridTemplateColumns:"1fr 80px 50px", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${T.border}`, fontSize:11, fontFamily:fontMono }}>
              <div>
                <div style={{ color:T.accent, fontWeight:700 }}>{d.d}</div>
                <div style={{ color:T.text4, fontSize:9, marginTop:1 }}>{d.role}</div>
              </div>
              <span style={{ color:T.text4, fontSize:10 }}>{d.tier}</span>
              <Badge color={d.st==="live"?T.green:T.amber} bg={d.st==="live"?T.greenGlow:T.amberGlow}>{d.st.toUpperCase()}</Badge>
            </div>
          ))}
        </Section>

        <Section icon="🔓" title="Open-Source Strategy" sub="MIT modules → community → enterprise pipeline">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, fontSize:11, fontFamily:fontMono }}>
            <div>
              <div style={{ fontSize:9, fontWeight:700, color:T.green, letterSpacing:"0.1em", marginBottom:8 }}>✅ OPEN (MIT)</div>
              {["Pattern analysis engine","Crisis detection (3-layer)","Terminology validator","Contract compliance linter","4-phase protocol","Safety escalation matrix"].map(i=>(
                <div key={i} style={{ padding:"3px 0", color:T.text2 }}><span style={{ color:T.green, marginRight:5 }}>→</span>{i}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize:9, fontWeight:700, color:T.red, letterSpacing:"0.1em", marginBottom:8 }}>🔒 PROPRIETARY</div>
              {["PatternLens UI/UX","PatternsLab workspaces","Production AI prompts","Subscription billing","User analytics","Marketing & brand"].map(i=>(
                <div key={i} style={{ padding:"3px 0", color:T.text2 }}><span style={{ color:T.red, marginRight:5 }}>→</span>{i}</div>
              ))}
            </div>
          </div>
          <div style={{ marginTop:14, padding:"10px 14px", background:T.accentGlow2, borderRadius:8, fontSize:10, color:T.text2, fontFamily:fontMono, textAlign:"center" }}>
            Strategy: Open core drives adoption → conversion to paid apps → enterprise contracts
          </div>
        </Section>
      </div>

      {/* THE ASK */}
      <div style={{
        background:`linear-gradient(135deg, ${T.accent}0a, ${T.surface} 50%, ${T.magenta}08)`,
        border:`1px solid ${T.accent}33`, borderRadius:20, padding:"28px 32px",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
          <span style={{ fontSize:22 }}>💎</span>
          <span style={{ fontSize:18, fontWeight:900, color:T.accent, fontFamily:fontDisplay }}>THE ASK</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:28 }}>
          <div>
            <div style={{ fontSize:36, fontWeight:900, color:T.text, fontFamily:fontDisplay, lineHeight:1 }}>500k</div>
            <div style={{ fontSize:14, color:T.accent, fontFamily:fontMono, marginTop:4 }}>PLN Pre-Seed</div>
            <div style={{ fontSize:11, color:T.text3, fontFamily:fontMono, marginTop:8 }}>18-month runway to Series A readiness</div>
          </div>
          <div>
            <div style={{ fontSize:9, fontWeight:700, color:T.text3, letterSpacing:"0.1em", fontFamily:fontMono, marginBottom:10 }}>USE OF FUNDS</div>
            {[
              { pct:"50%", item:"Engineering (team of 3)", color:T.accent },
              { pct:"25%", item:"Marketing (PL → EU expansion)", color:T.green },
              { pct:"15%", item:"Infrastructure (AI, hosting)", color:T.cyan },
              { pct:"10%", item:"Legal (IP, compliance)", color:T.amber },
            ].map(f=>(
              <div key={f.item} style={{ display:"flex", gap:8, padding:"3px 0", fontSize:11, fontFamily:fontMono }}>
                <span style={{ color:f.color, fontWeight:700, minWidth:28 }}>{f.pct}</span>
                <span style={{ color:T.text2 }}>{f.item}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize:9, fontWeight:700, color:T.text3, letterSpacing:"0.1em", fontFamily:fontMono, marginBottom:10 }}>18-MO MILESTONES</div>
            {["10k users (PL + EU)","50k ARR PLN","App Store PL + US launch","1k GitHub stars (OSS)","Series A ready"].map(m=>(
              <div key={m} style={{ padding:"3px 0", fontSize:11, fontFamily:fontMono, color:T.text2 }}>
                <span style={{ color:T.green, marginRight:6 }}>◆</span>{m}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   VIEW 2: PORTAL ADMIN
   ═══════════════════════════════════════ */

function PortalView() {
  const compTotal = COMPLIANCE.reduce((a,c)=>a+c.total,0);
  const compPass = COMPLIANCE.reduce((a,c)=>a+c.pass,0);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        <Stat label="MRR" value="8,700" sub="PLN" delta={87} icon="📈" color={T.green} glow={T.greenGlow}/>
        <Stat label="Active Users" value="589" delta={89} icon="👥" color={T.cyan} glow={T.cyanGlow}/>
        <Stat label="Conversion" value="10.2%" delta={2.1} icon="🎯" color={T.accent} glow={T.accentGlow}/>
        <Stat label="AI Cost/mo" value="$284" sub="$0.48/user" delta={-12} icon="🤖" color={T.amber} glow={T.amberGlow}/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Section icon="💰" title="MRR Growth" sub="Monthly recurring revenue (PLN)">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={MRR_DATA.filter(d=>!d.proj)}>
              <defs>
                <linearGradient id="p-mrr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.green} stopOpacity={0.3}/><stop offset="100%" stopColor={T.green} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="m" stroke={T.text4} fontSize={9} tickLine={false} axisLine={false}/>
              <YAxis stroke={T.text4} fontSize={9} tickLine={false} axisLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
              <Tooltip content={<ChartTip/>}/>
              <Area type="monotone" dataKey="mrr" stroke={T.green} fill="url(#p-mrr)" strokeWidth={2} name="MRR"/>
            </AreaChart>
          </ResponsiveContainer>
        </Section>

        <Section icon="🤖" title="AI Cost Breakdown" sub="USD per service per month">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={AI_SPEND}>
              <XAxis dataKey="m" stroke={T.text4} fontSize={9} tickLine={false} axisLine={false}/>
              <YAxis stroke={T.text4} fontSize={9} tickLine={false} axisLine={false} tickFormatter={v=>`$${v}`}/>
              <Tooltip content={<ChartTip/>}/>
              <Bar dataKey="claude" fill={T.accent} radius={[3,3,0,0]} name="Claude"/>
              <Bar dataKey="whisper" fill={T.cyan} radius={[3,3,0,0]} name="Whisper"/>
              <Bar dataKey="embed" fill={T.magenta} radius={[3,3,0,0]} name="Embeddings"/>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display:"flex", gap:14, marginTop:6, fontSize:10, fontFamily:fontMono }}>
            <span><span style={{ color:T.accent }}>●</span> Claude $198</span>
            <span><span style={{ color:T.cyan }}>●</span> Whisper $64</span>
            <span><span style={{ color:T.magenta }}>●</span> Embed $22</span>
            <span style={{ marginLeft:"auto", color:T.green }}>93% margin</span>
          </div>
        </Section>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Section icon="🛡️" title="Compliance Matrix" sub={`${compPass}/${compTotal} checks — 147-point matrix`}>
          {COMPLIANCE.map(c=>{
            const pct=Math.round(c.pass/c.total*100);
            return (
              <div key={c.cat} style={{ display:"grid", gridTemplateColumns:"100px 1fr 50px 50px", alignItems:"center", padding:"7px 0", borderBottom:`1px solid ${T.border}`, fontSize:11, fontFamily:fontMono }}>
                <span style={{ color:T.text2 }}>{c.cat}</span>
                <ProgressBar pct={pct} color={pct===100?T.green:T.amber}/>
                <span style={{ textAlign:"right", color:T.text3 }}>{c.pass}/{c.total}</span>
                <span style={{ textAlign:"right" }}>
                  <Badge color={c.status==="ok"?T.green:T.amber} bg={c.status==="ok"?T.greenGlow:T.amberGlow}>{c.status==="ok"?"PASS":"ISSUE"}</Badge>
                </span>
              </div>
            );
          })}
          <div style={{ marginTop:12, textAlign:"center", padding:"8px", background:T.greenGlow, borderRadius:6, fontSize:11, fontFamily:fontMono }}>
            Overall: <span style={{ color:T.green, fontWeight:800 }}>{Math.round(compPass/compTotal*100)}%</span> compliant
          </div>
        </Section>

        <Section icon="🚨" title="Crisis Incidents" sub="Last 30 days — 0 unresolved">
          {CRISIS.map(c=>(
            <div key={c.id} style={{ display:"grid", gridTemplateColumns:"55px 50px 48px 1fr 24px", alignItems:"center", padding:"6px 0", borderBottom:`1px solid ${T.border}`, fontSize:10, fontFamily:fontMono }}>
              <span style={{ color:T.text4 }}>{c.id}</span>
              <span style={{ color:T.text3 }}>{c.date}</span>
              <Badge color={c.level==="HARD"?T.red:T.amber} bg={c.level==="HARD"?T.redGlow:T.amberGlow}>{c.level}</Badge>
              <span style={{ color:T.text3, fontSize:9 }}>{c.action}</span>
              <span style={{ color:T.green, textAlign:"right" }}>✓</span>
            </div>
          ))}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:12 }}>
            <div style={{ padding:"10px", background:T.greenGlow, borderRadius:8, textAlign:"center" }}>
              <div style={{ fontSize:20, fontWeight:900, color:T.green, fontFamily:fontDisplay }}>100%</div>
              <div style={{ fontSize:9, color:T.text4, fontFamily:fontMono }}>Resolution Rate</div>
            </div>
            <div style={{ padding:"10px", background:T.cyanGlow, borderRadius:8, textAlign:"center" }}>
              <div style={{ fontSize:20, fontWeight:900, color:T.cyan, fontFamily:fontDisplay }}>&lt;2s</div>
              <div style={{ fontSize:9, color:T.text4, fontFamily:fontMono }}>Avg Response</div>
            </div>
          </div>
        </Section>
      </div>

      <Section icon="📊" title="Object Analytics" sub="Weekly creation + analysis volume">
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={OBJ_WEEKLY}>
            <defs>
              <linearGradient id="p-obj" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={T.accent} stopOpacity={0.2}/><stop offset="100%" stopColor={T.accent} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="p-pat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={T.magenta} stopOpacity={0.15}/><stop offset="100%" stopColor={T.magenta} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="w" stroke={T.text4} fontSize={9} tickLine={false} axisLine={false}/>
            <YAxis stroke={T.text4} fontSize={9} tickLine={false} axisLine={false}/>
            <Tooltip content={<ChartTip/>}/>
            <Area type="monotone" dataKey="created" stroke={T.accent} fill="url(#p-obj)" strokeWidth={2} name="Objects"/>
            <Area type="monotone" dataKey="patterns" stroke={T.magenta} fill="url(#p-pat)" strokeWidth={1.5} name="Patterns"/>
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ display:"flex", gap:14, marginTop:6, fontSize:10, fontFamily:fontMono }}>
          <span><span style={{ color:T.accent }}>●</span> Objects 445/wk</span>
          <span><span style={{ color:T.magenta }}>●</span> Patterns 221/wk</span>
          <span style={{ marginLeft:"auto", color:T.text3 }}>Analysis rate: 97.1%</span>
        </div>
      </Section>
    </div>
  );
}

/* ═══════════════════════════════════════
   VIEW 3: PATTERNLENS — Consumer
   ═══════════════════════════════════════ */

function PLView() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        <Stat label="Total Objects" value="47" delta={12} icon="📦" color={T.accent} glow={T.accentGlow}/>
        <Stat label="This Week" value="8" delta={33} icon="📅" color={T.cyan} glow={T.cyanGlow}/>
        <Stat label="Patterns" value="23" delta={18} icon="🔬" color={T.magenta} glow={T.magentaGlow}/>
        <Stat label="Streak" value="12d" icon="🔥" color={T.amber} glow={T.amberGlow}/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"180px 1fr", gap:16 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {[
            { icon:"🎙️", label:"Voice Snapshot", c:T.accent },
            { icon:"✍️", label:"Write Snapshot", c:T.cyan },
            { icon:"📊", label:"View Patterns", c:T.magenta },
            { icon:"📁", label:"Archive", c:T.text2 },
            { icon:"⚙️", label:"Settings", c:T.text3 },
          ].map(a=>(
            <button key={a.label} style={{
              display:"flex", alignItems:"center", gap:8, padding:"10px 12px",
              background:T.surface, border:`1px solid ${T.border}`, borderRadius:10,
              color:T.text, cursor:"pointer", fontSize:11, fontFamily:fontMono,
              textAlign:"left", transition:"all 0.15s", outline:"none",
            }}
            onMouseOver={e=>{e.currentTarget.style.borderColor=a.c;e.currentTarget.style.background=T.surfaceHot;}}
            onMouseOut={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.surface;}}
            >{a.icon} {a.label}</button>
          ))}
        </div>
        <Section icon="📋" title="Recent Objects" sub="Last 6 snapshots · dual-lens analyzed" noPad>
          <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, overflow:"hidden" }}>
            {RECENT_OBJ.map((o,i)=>(
              <div key={o.id} style={{
                display:"grid", gridTemplateColumns:"62px 1fr 36px 36px 40px",
                alignItems:"center", padding:"11px 14px",
                borderBottom:i<RECENT_OBJ.length-1?`1px solid ${T.border}`:"none",
                fontSize:11, fontFamily:fontMono, cursor:"pointer",
                transition:"background 0.15s",
              }}
              onMouseOver={e=>e.currentTarget.style.background=T.surfaceHot}
              onMouseOut={e=>e.currentTarget.style.background="transparent"}
              >
                <span style={{ color:T.accent, fontWeight:700, fontSize:10 }}>{o.id}</span>
                <span style={{ color:T.text2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", paddingRight:8 }}>{o.txt}</span>
                <Badge color={T.magenta} bg={T.magentaGlow}>{o.p}p</Badge>
                <Badge color={T.accent} bg={T.accentGlow}>DL</Badge>
                <span style={{ color:T.text4, fontSize:9, textAlign:"right" }}>{o.t}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section icon="📈" title="Pattern Trends" sub="Structural patterns over time">
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={OBJ_WEEKLY}>
            <XAxis dataKey="w" stroke={T.text4} fontSize={9} tickLine={false} axisLine={false}/>
            <YAxis stroke={T.text4} fontSize={9} tickLine={false} axisLine={false}/>
            <Tooltip content={<ChartTip/>}/>
            <Line type="monotone" dataKey="patterns" stroke={T.magenta} strokeWidth={2} dot={{ fill:T.magenta, r:3 }} name="Patterns"/>
            <Line type="monotone" dataKey="analyzed" stroke={T.accent} strokeWidth={1} strokeDasharray="4 3" dot={false} name="Analyzed"/>
          </LineChart>
        </ResponsiveContainer>
      </Section>
    </div>
  );
}

/* ═══════════════════════════════════════
   VIEW 4: PATTERNSLAB — B2B
   ═══════════════════════════════════════ */

function PLabView() {
  const workspaces = [
    { name:"Practice Alpha", members:6, obj:234, rev:"1,740", st:"live" },
    { name:"Research Beta", members:4, obj:156, rev:"1,160", st:"live" },
    { name:"Clinical Gamma", members:5, obj:89, rev:"1,450", st:"live" },
    { name:"Training Program", members:3, obj:45, rev:"870", st:"build" },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
        <Stat label="Workspaces" value="4" icon="🏢" color={T.amber} glow={T.amberGlow}/>
        <Stat label="Team Members" value="18" delta={28} icon="👥" color={T.cyan} glow={T.cyanGlow}/>
        <Stat label="Sessions/Week" value="34" delta={15} icon="📊" color={T.accent} glow={T.accentGlow}/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Section icon="🏢" title="Workspaces" sub="Multi-tenant isolation (RLS enforced)">
          {workspaces.map(w=>(
            <div key={w.name} style={{ display:"grid", gridTemplateColumns:"1fr 60px 50px 60px 50px", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${T.border}`, fontSize:11, fontFamily:fontMono }}>
              <span style={{ color:T.text2 }}>{w.name}</span>
              <span style={{ color:T.text4, fontSize:9 }}>{w.members} mbrs</span>
              <span style={{ color:T.text4, fontSize:9 }}>{w.obj} obj</span>
              <span style={{ color:T.green, fontSize:10, fontWeight:700 }}>{w.rev} PLN</span>
              <span style={{ textAlign:"right" }}><Badge color={w.st==="live"?T.green:T.amber} bg={w.st==="live"?T.greenGlow:T.amberGlow}>{w.st==="live"?"LIVE":"BUILD"}</Badge></span>
            </div>
          ))}
        </Section>
        <Section icon="⚙️" title="B2B Features" sub="Institutional-only capabilities">
          {[
            { f:"Parallel Processing (Couples)", st:"live" },
            { f:"Communication Translation Layer", st:"live" },
            { f:"PDF Session Export", st:"live" },
            { f:"Audit Trail (GDPR Art.28/32)", st:"live" },
            { f:"Advanced Analytics", st:"build" },
            { f:"REST API + Webhooks", st:"prep" },
          ].map(f=>(
            <div key={f.f} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:`1px solid ${T.border}`, fontSize:11, fontFamily:fontMono }}>
              <span style={{ color:T.text2 }}>{f.f}</span>
              <Badge color={f.st==="live"?T.green:f.st==="build"?T.amber:T.cyan} bg={f.st==="live"?T.greenGlow:f.st==="build"?T.amberGlow:T.cyanGlow}>{f.st.toUpperCase()}</Badge>
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   VIEW 5: OPEN SOURCE
   ═══════════════════════════════════════ */

function OSSView() {
  const openPct = 60;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      {/* Hero Banner */}
      <div style={{
        background:`linear-gradient(135deg, ${T.surfaceAlt}, ${T.surface})`,
        border:`1px solid ${T.green}33`, borderRadius:20, padding:"28px 32px",
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute",top:-50,right:-30,width:200,height:200,background:`radial-gradient(circle,${T.greenGlow},transparent 60%)`,pointerEvents:"none" }}/>
        <div style={{ position:"relative" }}>
          <div style={{ fontSize:22, fontWeight:900, fontFamily:fontDisplay, color:T.green }}>SILENCE.OBJECTS</div>
          <div style={{ fontSize:12, color:T.text2, marginTop:4, fontFamily:fontMono }}>Structural interpretation framework for behavioral pattern analysis</div>
          <div style={{ display:"flex", gap:10, marginTop:14, flexWrap:"wrap" }}>
            {["MIT License","TypeScript","Framework-agnostic","NOT therapy","npm ready"].map(t=>(
              <Badge key={t} color={T.green} bg={T.greenGlow}>{t}</Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Packages */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {OSS_PKGS.map(p=>(
          <div key={p.name} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, padding:18 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <code style={{ color:T.green, fontSize:12, fontWeight:700, fontFamily:fontMono }}>{p.name}</code>
              <Badge color={p.st==="published"?T.green:T.cyan} bg={p.st==="published"?T.greenGlow:T.cyanGlow}>{p.st.toUpperCase()}</Badge>
            </div>
            <p style={{ color:T.text2, fontSize:10, margin:"8px 0 10px", fontFamily:fontMono }}>{p.desc}</p>
            <div style={{ display:"flex", gap:12, fontSize:9, fontFamily:fontMono, color:T.text4 }}>
              <span>📜 {p.license}</span>
              <span>📏 {p.loc} LOC</span>
            </div>
          </div>
        ))}
      </div>

      {/* Open/Prop Visual */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Section icon="📊" title="Open vs. Proprietary" sub={`${openPct}% of core logic is open-source`}>
          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={[{v:openPct},{v:100-openPct}]} dataKey="v" cx="50%" cy="50%" innerRadius={35} outerRadius={52} startAngle={90} endAngle={-270} paddingAngle={3}>
                  <Cell fill={T.green}/>
                  <Cell fill={T.red}/>
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ fontSize:11, fontFamily:fontMono }}>
              <div style={{ color:T.green, fontWeight:700, marginBottom:6 }}>● {openPct}% Open (MIT)</div>
              <div style={{ color:T.text4, fontSize:10 }}>Core engine, safety, language, linter</div>
              <div style={{ color:T.red, fontWeight:700, marginTop:10, marginBottom:6 }}>● {100-openPct}% Proprietary</div>
              <div style={{ color:T.text4, fontSize:10 }}>UI, prompts, billing, analytics</div>
            </div>
          </div>
        </Section>
        <Section icon="🔄" title="Contributing Flow" sub="PR → CI → npm publish">
          {["1. Fork → branch → implement","2. Contract validator CI check","3. Language compliance lint","4. Unit tests (95%+ required)","5. PR review by maintainer","6. Merge → auto npm publish"].map((s,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"5px 0", borderBottom:`1px solid ${T.border}`, fontSize:11, fontFamily:fontMono }}>
              <span style={{ color:T.accent, fontWeight:700, fontSize:10, minWidth:20 }}>{i+1}.</span>
              <span style={{ color:T.text2 }}>{s.split('. ')[1]}</span>
              {i<5 && <span style={{ marginLeft:"auto", color:T.text4, fontSize:10 }}>→</span>}
              {i===5 && <span style={{ marginLeft:"auto" }}><Badge color={T.green} bg={T.greenGlow}>AUTO</Badge></span>}
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN SHELL — 5-Tab Navigation
   ═══════════════════════════════════════════ */

const TABS = [
  { id:"investor", label:"Investor", icon:"💼", domain:"patternslab.work" },
  { id:"portal", label:"Portal Admin", icon:"🏠", domain:"admin.patternslab.app" },
  { id:"pl", label:"PatternLens", icon:"🔍", domain:"patternlens.app" },
  { id:"plab", label:"PatternsLab", icon:"🔬", domain:"patternslab.app" },
  { id:"oss", label:"Open Source", icon:"🌍", domain:"silence-objects.dev" },
];

export default function PatternLensPortal() {
  const [tab, setTab] = useState("investor");
  const [now, setNow] = useState(new Date());
  const [sideHover, setSideHover] = useState(null);

  useEffect(()=>{
    const t=setInterval(()=>setNow(new Date()),60000);
    return()=>clearInterval(t);
  },[]);

  const views = { investor:InvestorView, portal:PortalView, pl:PLView, plab:PLabView, oss:OSSView };
  const View = views[tab];
  const current = TABS.find(t=>t.id===tab);

  return (
    <div style={{ minHeight:"100vh", background:T.bg, color:T.text, fontFamily:fontDisplay }}>
      {/* Subtle grain overlay */}
      <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:999,opacity:0.015,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}/>

      {/* Header */}
      <header style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"10px 20px", borderBottom:`1px solid ${T.border}`,
        background:T.bgSubtle, position:"relative", zIndex:10,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:30, height:30, borderRadius:8,
            background:`linear-gradient(135deg, ${T.accent}, ${T.magenta})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:14, fontWeight:900, color:"#fff", fontFamily:fontDisplay,
          }}>P</div>
          <span style={{ fontWeight:800, fontSize:15, fontFamily:fontDisplay, color:T.text, letterSpacing:"-0.02em" }}>PatternLens</span>
          <Badge color={T.text3} bg={T.white04}>v4.1</Badge>
          <span style={{ width:1, height:16, background:T.border, margin:"0 4px" }}/>
          <Badge color={T.accent} bg={T.accentGlow2}>ECOSYSTEM</Badge>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:14, fontSize:10, fontFamily:fontMono }}>
          <span style={{ color:T.text4 }}>{current?.domain}</span>
          <span style={{ display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:T.green, display:"inline-block", boxShadow:`0 0 8px ${T.green}` }}/>
            <span style={{ color:T.green }}>live</span>
          </span>
          <span style={{ color:T.text4 }}>{now.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}</span>
        </div>
      </header>

      <div style={{ display:"flex" }}>
        {/* Sidebar */}
        <nav style={{
          width:210, minHeight:"calc(100vh - 51px)",
          borderRight:`1px solid ${T.border}`,
          background:T.bgSubtle, padding:"14px 8px",
          display:"flex", flexDirection:"column", gap:3,
          position:"sticky", top:51, alignSelf:"flex-start",
        }}>
          {TABS.map(t=>{
            const active = tab===t.id;
            const hover = sideHover===t.id;
            return (
              <button
                key={t.id}
                onClick={()=>setTab(t.id)}
                onMouseEnter={()=>setSideHover(t.id)}
                onMouseLeave={()=>setSideHover(null)}
                style={{
                  display:"flex", alignItems:"center", gap:10,
                  padding:"11px 14px", borderRadius:10,
                  background:active?T.surfaceHot:hover?T.surface:"transparent",
                  border:`1px solid ${active?T.borderAccent:hover?T.border:"transparent"}`,
                  color:active?T.text:T.text2,
                  cursor:"pointer", fontSize:12, fontFamily:fontMono,
                  textAlign:"left", width:"100%", outline:"none",
                  transition:"all 0.12s ease",
                }}
              >
                <span style={{ fontSize:15 }}>{t.icon}</span>
                <div>
                  <div style={{ fontWeight:active?700:500, fontFamily:fontDisplay, fontSize:13 }}>{t.label}</div>
                  <div style={{ fontSize:9, color:T.text4, marginTop:1, fontFamily:fontMono }}>{t.domain}</div>
                </div>
                {t.id==="investor" && (
                  <span style={{ marginLeft:"auto", fontSize:8, color:T.green, fontWeight:800, fontFamily:fontMono, letterSpacing:"0.05em" }}>DEFAULT</span>
                )}
              </button>
            );
          })}

          {/* Framework badge */}
          <div style={{ marginTop:"auto", padding:"14px 12px", borderTop:`1px solid ${T.border}`, marginTop:20 }}>
            <div style={{ fontSize:9, color:T.text4, fontFamily:fontMono, lineHeight:1.7 }}>
              <div style={{ color:T.accent, fontWeight:700 }}>SILENCE.OBJECTS</div>
              <div>Framework v1.0.0</div>
              <div style={{ marginTop:4 }}>Constitutional layer</div>
              <div>governs all 5 apps</div>
              <div style={{ marginTop:6 }}>
                <Badge color={T.green} bg={T.greenGlow}>147 CHECKS</Badge>
              </div>
            </div>
          </div>
        </nav>

        {/* Main */}
        <main style={{
          flex:1, padding:"24px 28px",
          maxHeight:"calc(100vh - 51px)", overflowY:"auto",
          scrollbarWidth:"thin", scrollbarColor:`${T.border} transparent`,
        }}>
          <View/>
        </main>
      </div>
    </div>
  );
}
