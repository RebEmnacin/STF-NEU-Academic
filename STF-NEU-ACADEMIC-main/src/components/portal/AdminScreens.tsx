import { usePortal } from "./PortalContext";
import { useState, useEffect, useRef, Fragment } from "react";
import { 
  Shield, Building2, Mail, Hash, Activity, Award, CheckCircle, 
  Users, SlidersHorizontal, AlertCircle, Clock, BookOpen, BookMarked, 
  Calendar, ChevronLeft, ChevronRight, Tv2, Info
} from "lucide-react";

// ─── Shared Animation Primitives ──────────────────────────────────────────────
function useFadeUp(delay = 0) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay + 40);
    return () => clearTimeout(t);
  }, [delay]);
  return visible;
}

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const visible = useFadeUp(delay);
  return (
    <div className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(14px)",
      transition: "opacity 0.4s ease, transform 0.4s ease",
    }}>
      {children}
    </div>
  );
}

// ─── Animated Table Row ────────────────────────────────────────────────────────
const rowStyle = (i: number): React.CSSProperties => ({
  opacity: 0,
  animation: "fadeInRow 0.35s ease forwards",
  animationDelay: `${i * 40}ms`,
});

// Inject keyframes once
if (typeof document !== "undefined" && !document.getElementById("admin-anim-styles")) {
  const style = document.createElement("style");
  style.id = "admin-anim-styles";
  style.textContent = `
    @keyframes fadeInRow {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

// ─── Animated Ring ─────────────────────────────────────────────────────────────
function AnimatedRing({ pct, color = "var(--green-status)", size = 80 }: { pct: number; color?: string; size?: number }) {
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 200); return () => clearTimeout(t); }, []);
  const r = 36; const circ = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="-rotate-90" style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r={r} stroke="var(--muted)" strokeWidth="14" fill="none" />
        <circle cx="50" cy="50" r={r} stroke={color} strokeWidth="14" fill="none" strokeLinecap="round"
          style={{
            strokeDasharray: go ? `${(pct / 100) * circ} ${circ}` : `0 ${circ}`,
            strokeDashoffset: -circ * 0.25,
            transition: "stroke-dasharray 0.75s linear",
          }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-serif font-bold text-teal-dark" style={{ fontSize: size * 0.2 }}>{pct}%</span>
      </div>
    </div>
  );
}

// ============ Section Admin (Professor) Screens ============

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const teacherCalData: Record<number, { events: { label: string; color: string }[]; deadline?: boolean }> = {
  2:  { events: [{ label: "Choir Orientation", color: "bg-amber-status text-white" }] },
  6:  { events: [{ label: "GE 101 Sec A (8 AM)", color: "bg-teal text-white" }, { label: "Office Hours", color: "bg-teal-light text-white" }] },
  8:  { events: [{ label: "GE 101 Sec A (8 AM)", color: "bg-teal text-white" }, { label: "Section Workshop", color: "bg-gold text-teal-dark" }] },
  9:  { events: [{ label: "Office Hours", color: "bg-teal-light text-white" }] },
  13: { events: [{ label: "GE 101 Sec A (8 AM)", color: "bg-teal text-white" }] }
};

export function SectionDashboard() {
  const { setDrawerDay } = usePortal();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
  const [sectionFilter, setSectionFilter] = useState<"all" | "lectures" | "tasks">("all");

  const summaryCards = [
    { count: "30",  period: "enrolled",  category: "Students in Sec", Icon: Users,      bg: "bg-teal" },
    { count: "84%", period: "average",   category: "Attendance Rate",  Icon: BookOpen,   bg: "bg-teal-light" },
    { count: "12",  period: "pending",   category: "Awaiting Grading", Icon: BookMarked, bg: "bg-amber-status" },
    { count: "2",   period: "upcoming",  category: "Section Events",   Icon: Calendar,   bg: "bg-gold text-teal-dark" },
  ];

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">Section Dashboard — GE 101, Sec A</h1>
            <p className="text-sm text-muted-text mt-1">{MONTHS[month]} {year} — GE Subject Group Teacher View</p>
          </div>
          <span className="chip bg-gold text-teal-dark text-sm px-3 py-1">Admin · Section Scoped</span>
        </div>
      </FadeUp>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {summaryCards.map((c, i) => (
          <FadeUp key={c.category} delay={i * 70}>
            <button className={`${c.bg} rounded-xl px-4 py-3 flex items-center gap-3 w-full text-left hover:opacity-90 active:scale-95 transition-all`}>
              <c.Icon className={`w-7 h-7 shrink-0 ${c.bg.includes("text-teal-dark") ? "text-teal-dark/70" : "text-white/80"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className={`font-serif font-bold text-2xl leading-none ${c.bg.includes("text-teal-dark") ? "text-teal-dark" : "text-white"}`}>{c.count}</span>
                  <span className={`text-xs font-medium ${c.bg.includes("text-teal-dark") ? "text-teal-dark/80" : "text-white/80"}`}>{c.period}</span>
                </div>
                <div className={`text-[11px] font-medium mt-0.5 truncate ${c.bg.includes("text-teal-dark") ? "text-teal-dark/70" : "text-white/70"}`}>{c.category}</div>
              </div>
            </button>
          </FadeUp>
        ))}
      </div>

      <FadeUp delay={340}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 border border-border rounded-lg hover:bg-secondary"><ChevronLeft className="w-4 h-4" /></button>
          <span className="font-serif font-bold text-teal-dark text-lg min-w-[180px] text-center">{MONTHS[month]} {year}</span>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 border border-border rounded-lg hover:bg-secondary"><ChevronRight className="w-4 h-4" /></button>
          <div className="ml-auto flex border border-border bg-secondary p-0.5 rounded-lg text-xs font-medium">
            <button onClick={() => setSectionFilter("all")} className={`px-3 py-1 rounded-md transition ${sectionFilter === "all" ? "bg-card text-teal-dark shadow-sm font-semibold" : "text-muted-text"}`}>All Entries</button>
            <button onClick={() => setSectionFilter("lectures")} className={`px-3 py-1 rounded-md transition ${sectionFilter === "lectures" ? "bg-card text-teal-dark shadow-sm font-semibold" : "text-muted-text"}`}>Lectures</button>
            <button onClick={() => setSectionFilter("tasks")} className={`px-3 py-1 rounded-md transition ${sectionFilter === "tasks" ? "bg-card text-teal-dark shadow-sm font-semibold" : "text-muted-text"}`}>Tasks/Hours</button>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={400}>
        <div className="educ-calendar-grid">
          {DAYS_SHORT.map(d => <div key={d} className="educ-day-label">{d}</div>)}
          {Array.from({ length: totalCells }).map((_, i) => {
            const day = i - startOffset + 1;
            const valid = day >= 1 && day <= daysInMonth;
            const data = valid ? teacherCalData[day] : undefined;
            const filteredEvents = (data?.events ?? []).filter(e => {
              if (sectionFilter === "lectures") return e.label.includes("GE 101");
              if (sectionFilter === "tasks") return !e.label.includes("GE 101");
              return true;
            });
            return (
              <div key={i}
                onClick={() => valid && setDrawerDay(`${MONTHS[month]} ${day}, ${year}`)}
                className={`educ-date-cell${!valid ? " empty" : ""}`}
                style={valid ? { opacity: 0, animation: "fadeInRow 0.3s ease forwards", animationDelay: `${400 + i * 8}ms` } : undefined}>
                {valid && (
                  <>
                    <div className="educ-day-num">{day}</div>
                    <div className="space-y-0.5">
                      {filteredEvents.map((e, j) => (
                        <span key={j} className={`educ-chip text-[10px] p-1 rounded font-semibold leading-tight block truncate ${e.color}`}>{e.label}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </FadeUp>
    </div>
  );
}

// AD2: My Students
export function MyStudents() {
  const statCards = [["Students","30"],["Active","28"],["On Leave","2"],["Avg Task Completion","78%"]];
  const rows = [
    ["AJ","Alex Johnson","STF-2021-0042","BS IT","Sophomore","87%","72%","Active"],
    ["NP","Natalie Portman","STF-2022-0101","BS Nursing","Junior","95%","88%","Active"],
    ["BA","Ben Affleck","STF-2021-0088","BS Civil Eng","Senior","91%","95%","Active"],
    ["MS","Maria Santos","STF-2023-0103","BA Communication","Freshman","76%","60%","Active"],
    ["JR","Jose Reyes","STF-2023-0104","BS Psychology","Freshman","82%","55%","Active"],
    ["AC","Ana Cruz","STF-2022-0105","BS Accountancy","Junior","65%","40%","On Leave"],
    ["DL","Diego Luna","STF-2022-0106","BS Criminology","Sophomore","88%","79%","Active"],
    ["RG","Rosa Gomez","STF-2023-0107","BS Midwifery","Freshman","92%","83%","Active"],
  ];

  return (
    <div className="p-6">
      <FadeUp>
        <h1 className="font-serif text-2xl font-bold text-teal-dark mb-1">My Students — GE 101, Sec A</h1>
      </FadeUp>

      <div className="flex gap-3 mt-4 mb-4">
        {statCards.map(([k, v], i) => (
          <FadeUp key={k} delay={i * 60} className="flex-1">
            <div className="bg-card border border-border rounded-lg p-3 card-soft h-full">
              <div className="text-xs text-muted-text">{k}</div>
              <div className="font-serif text-xl font-bold text-teal-dark">{v}</div>
            </div>
          </FadeUp>
        ))}
      </div>

      <FadeUp delay={280}>
        <div className="flex gap-2 mb-3">
          <input placeholder="Search students…" className="flex-1 px-3 py-2 border border-border rounded text-sm bg-card"/>
          <select className="px-3 py-2 border border-border rounded text-sm bg-card"><option>All Departments</option><option>Computer Studies</option><option>Nursing</option><option>Engineering and Architecture</option></select>
          <select className="px-3 py-2 border border-border rounded text-sm bg-card"><option>All Years</option><option>Freshman</option><option>Sophomore</option><option>Junior</option><option>Senior</option></select>
        </div>
      </FadeUp>

      <FadeUp delay={340}>
        <div className="bg-card border border-border rounded-lg overflow-hidden card-soft">
          <table className="w-full text-sm">
            <thead className="bg-teal-dark text-white text-xs uppercase">
              <tr>{["","Name","Student ID","Course","Year","Attendance","Task Completion","Status","Actions"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="row-alt border-b border-border" style={rowStyle(i)}>
                  <td className="px-2 py-2"><div className="w-8 h-8 rounded-full bg-gold grid place-items-center text-xs font-bold text-teal-dark">{r[0]}</div></td>
                  <td className="px-2 py-2 font-semibold">{r[1]}</td>
                  <td className="px-2 py-2 font-mono text-xs">{r[2]}</td>
                  <td className="px-2 py-2">{r[3]}</td>
                  <td className="px-2 py-2">{r[4]}</td>
                  <td className="px-2 py-2">{r[5]}</td>
                  <td className="px-2 py-2">{r[6]}</td>
                  <td className="px-2 py-2"><span className={`chip ${r[7]==="Active"?"bg-green-status text-white":"bg-amber-status text-white"}`}>{r[7]}</span></td>
                  <td className="px-2 py-2"><div className="flex gap-1"><button className="chip border border-teal text-teal">View</button><button className="chip border border-border">Message</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeUp>
    </div>
  );
}

// AD3: Task Evaluator & Grader
export function TaskGrader() {
  const [scoreA, setScoreA] = useState("92.50");
  const [scoreB, setScoreB] = useState("105");

  return (
    <div className="p-6">
      <FadeUp>
        <h1 className="font-serif text-2xl font-bold text-teal-dark mb-4">Task Evaluator & Grade Entry</h1>
      </FadeUp>

      <FadeUp delay={60}>
        <div className="flex gap-3 mb-4">
          <select className="px-3 py-2 border border-border rounded text-sm bg-card"><option>GE 101 - Sec A</option><option>GE 101 - Sec B</option></select>
          <select className="px-3 py-2 border border-border rounded text-sm bg-card"><option>GRADED</option><option>PENDING</option><option>SUBMITTED</option></select>
        </div>
      </FadeUp>

      <FadeUp delay={120}>
        <div className="bg-card border border-border rounded-lg overflow-hidden card-soft">
          <table className="w-full text-sm">
            <thead className="bg-teal-dark text-white text-xs uppercase">
              <tr>{["Student Name","Student ID","Submitted File","Max Score","Score Input","Status","Progress"].map(h => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr>
            </thead>
            <tbody>
              <tr className="row-alt border-b border-border" style={rowStyle(0)}>
                <td className="px-3 py-3 font-semibold">⭕ Jane Smith</td>
                <td className="px-3 py-3 font-mono text-xs">ID 543</td>
                <td className="px-3 py-3 text-teal">essay_v2.pdf 📥</td>
                <td className="px-3 py-3">/100</td>
                <td className="px-3 py-3">
                  <input value={scoreA} onChange={e=>setScoreA(e.target.value)} className="w-20 px-2 py-1 border-2 border-green-status/60 rounded text-sm"/>
                  <div className="text-[10px] text-green-status mt-1">✓ SCORE INPUT VALIDATED</div>
                </td>
                <td className="px-3 py-3"><button className="bg-teal text-white px-3 py-1 rounded text-xs hover:bg-teal-dark">Save Grade</button></td>
                <td className="px-3 py-3"><AnimatedRing pct={70} size={40} /></td>
              </tr>
              <tr className="row-alt border-b border-border" style={rowStyle(1)}>
                <td className="px-3 py-3 font-semibold">○ Tom King</td>
                <td className="px-3 py-3 font-mono text-xs">ID 544</td>
                <td className="px-3 py-3 text-teal">essay_v2.pdf 📥</td>
                <td className="px-3 py-3">/100</td>
                <td className="px-3 py-3">
                  <input value={scoreB} onChange={e=>setScoreB(e.target.value)} className={`w-20 px-2 py-1 border-2 rounded text-sm ${Number(scoreB)>100?"border-red-status":"border-border"}`}/>
                  {Number(scoreB)>100 && <div className="text-[10px] text-red-status mt-1 font-bold">⚠ ERROR: SCORE OUT OF RANGE (MAX 100)</div>}
                </td>
                <td className="px-3 py-3"><select className="px-2 py-1 border border-border rounded text-xs"><option>GRADED</option><option>PENDING</option></select></td>
                <td className="px-3 py-3"><AnimatedRing pct={55} size={40} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </FadeUp>
    </div>
  );
}

// AD4: Section Attendance Tracker
export function SectionAttendance() {
  const sessionRows = [
    ["GE 101 Lecture - Sec A","Nov 1, 2023","8–9:30 AM",28,1,1,0,93],
    ["GE 101 Lecture - Sec A","Nov 3, 2023","8–9:30 AM",26,2,2,0,87],
    ["GE 101 Lecture - Sec A","Nov 6, 2023","8–9:30 AM",27,2,1,0,90],
    ["Choir Orientation Batch 1","Nov 2, 2023","1–3 PM",24,4,2,0,80],
    ["Section Workshop","Nov 8, 2023","1–3 PM",28,1,0,1,93],
  ];

  return (
    <div className="p-6">
      <FadeUp>
        <h1 className="font-serif text-2xl font-bold text-teal-dark mb-4">Section Attendance Tracker — GE 101 Sec A</h1>
      </FadeUp>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {[
          { label: "Total Sessions", value: "24", bg: "bg-teal text-white", ring: false },
          { label: "Section Avg Attendance", value: 84, bg: "bg-card border border-border", ring: true },
          { label: "Students Needing Attention", value: "3", bg: "bg-card border border-border", accent: "text-red-status", ring: false },
        ].map((c, i) => (
          <FadeUp key={c.label} delay={i * 80}>
            <div className={`${c.bg} rounded-lg p-4 card-soft flex items-center gap-4`}>
              {c.ring ? (
                <AnimatedRing pct={c.value as number} size={72} />
              ) : (
                <div>
                  <div className="text-xs opacity-80">{c.label}</div>
                  <div className={`font-serif text-3xl font-bold mt-1 ${c.accent ?? (c.bg.includes("teal") ? "text-white" : "text-teal-dark")}`}>{c.value}</div>
                </div>
              )}
              {c.ring && (
                <div>
                  <div className="text-xs text-muted-text">{c.label}</div>
                  <div className="font-serif text-2xl font-bold text-teal-dark mt-0.5">{c.value}%</div>
                </div>
              )}
            </div>
          </FadeUp>
        ))}
      </div>

      <FadeUp delay={280}>
        <div className="bg-card border border-border rounded-lg overflow-hidden card-soft">
          <table className="w-full text-xs">
            <thead className="bg-teal-dark text-white uppercase">
              <tr>{["Session","Date","Time","Present","Absent","Late","Excused","Rate %"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr>
            </thead>
            <tbody>
              {sessionRows.map((r, i) => (
                <tr key={i} className="row-alt border-b border-border" style={rowStyle(i)}>
                  {r.map((c, j) => <td key={j} className="px-2 py-2">{j===7?`${c}%`:c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeUp>
    </div>
  );
}

// ============ Super Admin Screens ============

const adminCalData: Record<number, { events: { label: string; color: string }[] }> = {
  1:  { events: [{ label: "Weekly Panata (Wk3)", color: "bg-teal text-white" }] },
  4:  { events: [{ label: "Parents Orientation", color: "bg-teal text-white" }, { label: "Photo Profiling", color: "bg-gold text-teal-dark" }] },
  5:  { events: [{ label: "CBI Weekly Panata", color: "bg-teal-light text-white" }, { label: "Panata Sync", color: "bg-slate-blue text-white" }] },
  6:  { events: [{ label: "Choir Orientation B1", color: "bg-gold text-teal-dark" }] },
  7:  { events: [{ label: "Peer Counsel Seminar", color: "bg-amber-status text-white" }] },
  8:  { events: [{ label: "DGA Team Sync", color: "bg-gold text-teal-dark" }] }
};

export function AdminDashboard() {
  const { setDrawerDay, setView } = usePortal();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
  const [adminFilter, setAdminFilter] = useState<"all" | "panata" | "teams" | "events">("all");

  const summaryCards = [
    { count: "3 Total",    period: "active",    category: "Church Events",           Icon: Calendar,   bg: "bg-teal" },
    { count: "4 Total",    period: "mandatory", category: "Mandatory Activities",     Icon: Tv2,        bg: "bg-gold text-teal-dark" },
    { count: "2 Critical", period: "urgent",    category: "Institutional Deadlines",  Icon: Info,       bg: "bg-slate-blue" },
    { count: "28 Total",   period: "assigned",  category: "Total GE Subject Groups",  Icon: BookMarked, bg: "bg-card border border-border !text-teal-dark" },
  ];

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">Admin Dashboard</h1>
            <p className="text-sm text-muted-text mt-1">{MONTHS[month]} {year} — Comprehensive Institutional Control Overview</p>
          </div>
          <span className="chip bg-teal-soft text-teal text-sm px-3 py-1">Super Admin View</span>
        </div>
      </FadeUp>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {summaryCards.map((c, i) => (
          <FadeUp key={c.category} delay={i * 70}>
            <button className={`${c.bg} rounded-xl px-4 py-3 flex items-center gap-3 w-full text-left hover:opacity-90 transition-all shadow-sm`}>
              <c.Icon className={`w-7 h-7 shrink-0 ${c.bg.includes("text-teal-dark") ? "text-teal-dark/70" : "text-white/80"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className={`font-serif font-bold text-2xl leading-none ${c.bg.includes("text-teal-dark") ? "text-teal-dark" : "text-white"}`}>{c.count}</span>
                  <span className={`text-xs font-medium ${c.bg.includes("text-teal-dark") ? "text-teal-dark/80" : "text-white/80"}`}>{c.period}</span>
                </div>
                <div className={`text-[11px] font-medium mt-0.5 truncate ${c.bg.includes("text-teal-dark") ? "text-teal-dark/70" : "text-white/70"}`}>{c.category}</div>
              </div>
            </button>
          </FadeUp>
        ))}
      </div>

      <FadeUp delay={340}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 border border-border rounded-lg hover:bg-secondary"><ChevronLeft className="w-4 h-4" /></button>
          <span className="font-serif font-bold text-teal-dark text-lg min-w-[180px] text-center">{MONTHS[month]} {year}</span>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 border border-border rounded-lg hover:bg-secondary"><ChevronRight className="w-4 h-4" /></button>
          <div className="ml-auto flex border border-border bg-secondary p-0.5 rounded-lg text-xs font-medium">
            <button onClick={() => setAdminFilter("all")} className={`px-3 py-1 rounded-md transition ${adminFilter === "all" ? "bg-card text-teal-dark shadow-sm font-semibold" : "text-muted-text"}`}>All Schedules</button>
            <button onClick={() => setAdminFilter("panata")} className={`px-3 py-1 rounded-md transition ${adminFilter === "panata" ? "bg-card text-teal-dark shadow-sm font-semibold" : "text-muted-text"}`}>Panata Overseer</button>
            <button onClick={() => setAdminFilter("teams")} className={`px-3 py-1 rounded-md transition ${adminFilter === "teams" ? "bg-card text-teal-dark shadow-sm font-semibold" : "text-muted-text"}`}>Team Overseer</button>
            <button onClick={() => setAdminFilter("events")} className={`px-3 py-1 rounded-md transition ${adminFilter === "events" ? "bg-card text-teal-dark shadow-sm font-semibold" : "text-muted-text"}`}>Clear view of Events</button>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={400}>
        <div className="educ-calendar-grid">
          {DAYS_SHORT.map(d => <div key={d} className="educ-day-label">{d}</div>)}
          {Array.from({ length: totalCells }).map((_, i) => {
            const day = i - startOffset + 1;
            const valid = day >= 1 && day <= daysInMonth;
            const data = valid ? adminCalData[day] : undefined;
            const filteredEvents = (data?.events ?? []).filter(e => {
              if (adminFilter === "panata") return e.label.toLowerCase().includes("panata");
              if (adminFilter === "teams") return e.label.toLowerCase().includes("team") || e.label.includes("Profiling");
              if (adminFilter === "events") return e.label.toLowerCase().includes("orientation") || e.label.includes("Seminar");
              return true;
            });
            return (
              <div key={i}
                onClick={() => valid && setView("event-detail")}
                className={`educ-date-cell${!valid ? " empty" : ""} cursor-pointer hover:bg-teal-soft/10 transition-colors`}
                style={valid ? { opacity: 0, animation: "fadeInRow 0.3s ease forwards", animationDelay: `${400 + i * 8}ms` } : undefined}>
                {valid && (
                  <>
                    <div className="educ-day-num">{day}</div>
                    <div className="space-y-0.5">
                      {filteredEvents.map((e, j) => (
                        <span key={j} className={`educ-chip text-[10px] p-1 rounded font-semibold leading-tight block truncate ${e.color}`}>{e.label}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </FadeUp>
    </div>
  );
}

// SA2: Event Detail
export function EventDetail() {
  const { setView } = usePortal();
  return (
    <div className="p-6">
      <FadeUp>
        <button onClick={() => setView("dashboard")} className="text-xs text-teal mb-2 hover:underline">← Dashboard / Calendar / Event Detail</button>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-teal-dark">🎵 STF-NEU Choir Orientation (Batch 1)</h1>
            <span className="chip bg-gold text-teal-dark mt-1">Published · In Progress</span>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 text-xs border border-teal text-teal rounded font-semibold hover:bg-teal-soft">✏️ Edit Event</button>
            <button className="px-3 py-2 text-xs bg-teal text-white rounded font-semibold hover:bg-teal-dark">Record Attendance</button>
            <button className="px-3 py-2 text-xs bg-gold text-teal-dark rounded font-semibold">Manage Audience</button>
          </div>
        </div>
      </FadeUp>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4 space-y-3">
          {[
            ["TIME & DURATION","Thursday, Nov 2, 2023 · 1:00–3:00 PM (2 Hours)"],
            ["TARGET AUDIENCE","STF Choir Candidates · 55 Registered"],
            ["VENUE & SETUP","IS Bldg B, Room 234 · Capacity: 70"],
            ["ORGANIZER","@CoordinatorJerald"],
          ].map(([k, v], i) => (
            <FadeUp key={k} delay={i * 60}>
              <div className="bg-card border border-border rounded-lg p-3 card-soft">
                <div className="text-[10px] font-bold text-muted-text tracking-wider">{k}</div>
                <div className="text-sm mt-1">{v}</div>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={100} className="col-span-5">
          <div className="bg-card border border-border rounded-lg p-4 card-soft">
            <div className="text-xs font-bold text-muted-text mb-2">DAILY TIMELINE (THU, NOV 2)</div>
            {[11,12,13,14,15,16].map(h => (
              <div key={h} className="flex gap-2 border-t border-border py-1">
                <div className="w-12 text-xs text-muted-text font-mono">{h}:00</div>
                {h===13 && (
                  <div className="flex-1 bg-gold rounded p-2 text-xs text-teal-dark" style={{minHeight: 90}}>
                    <div className="font-bold">STF-NEU Choir Orientation (Batch 1)</div>
                    <div>IS Bldg B, Room 234</div>
                    <div className="flex gap-1 mt-2">{["A","M","J","K"].map(x => <span key={x} className="w-5 h-5 rounded-full bg-teal text-white grid place-items-center text-[9px]">{x}</span>)}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={140} className="col-span-3">
          <div className="bg-card border border-border rounded-lg p-4 card-soft">
            <div className="text-xs font-bold text-muted-text mb-2">LIVE ATTENDANCE FEED</div>
            <ul className="text-xs space-y-1.5">
              {[["Alice Cooper","1:05 PM"],["Michael Chen","1:07 PM"],["Alicea Gliies","1:07 PM"],["Michael Beus","1:07 PM"]].map(([n,t], i) => (
                <li key={n} className="flex justify-between border-b border-border pb-1" style={rowStyle(i)}><span>{n}</span><span className="text-muted-text">{t}</span></li>
              ))}
            </ul>
            <div className="mt-3 text-center">
              <div className="font-serif text-3xl font-bold text-teal-dark">10</div>
              <div className="text-xs text-muted-text">checked in</div>
              <div className="flex justify-center mt-2">
                <AnimatedRing pct={18} size={72} />
              </div>
            </div>
          </div>
        </FadeUp>

        {[
          { span: 4, title: "FULL DESCRIPTION", content: <p className="text-sm text-foreground/80">Orientation session for Batch 1 of new STF-NEU Choir members. Covers attendance expectations, weekly rehearsal cadence, and uniform requirements.</p> },
          { span: 4, title: "RESOURCE CHECKLIST", content: <ul className="text-sm space-y-1">{["Sound System ✓","Piano/Keyboard ✓","Attendance Forms ✓","Team Vests ◯"].map(x => <li key={x}>{x}</li>)}</ul> },
          { span: 4, title: "ASSOCIATED CONTENT", content: <div className="flex flex-wrap gap-1"><span className="chip bg-teal-soft text-teal">Multimedia training (Wk3)</span><span className="chip bg-gold-soft text-amber-status">Choir orientation task</span></div> },
        ].map(({ span, title, content }, i) => (
          <FadeUp key={title} delay={200 + i * 60} className={`col-span-${span}`}>
            <div className="bg-card border border-border rounded-lg p-4 card-soft">
              <div className="text-xs font-bold text-muted-text mb-2">{title}</div>
              {content}
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  );
}

// SA5: Session & Attendance Analytics
const adminSessions = [
  ["GE 101 - Online Launch Meeting","Class","Aug 11 2025","10–11:30 AM","Online (Webex)",450,390,87],
  ["Video Team Practice - DGA Studio","Team","Aug 14 2025","1–3 PM","Studio B",55,50,91],
  ["Choir Orientation - Batch 1","Team","Aug 18 2025","1–2 PM","IS Bldg B, 234",120,112,93],
  ["CBI Hour - Panata (Week 1)","Panata","Aug 1 2025","8:30–9:30 PM","Google Meet",450,345,77],
  ["AEVM Task - Multimedia Meeting","Task","Aug 25 2025","3–4 PM","IS Bldg B, 234",450,90,20],
  ["Engineering Gear - Team Sync","Team","Sep 1 2025","11–12 PM","Engineering Lab",30,28,93],
  ["GE Subjects - Parents Orientation","Task","Aug 8 2025","9–10:30 AM","Online",450,315,70],
  ["Engineering Practice - Meeting","Team","Sep 1 2025","9 AM–12 PM","Google Meet",450,312,69],
  ["GE Subjects - Team Orientation","Task","Aug 8 2025","9–10:30 AM","Online",450,315,70],
];

export function SessionLogs() {
  const [selected, setSelected] = useState(4);

  return (
    <div className="p-6">
      <FadeUp>
        <h1 className="font-serif text-2xl font-bold text-teal-dark mb-4">Session & Attendance Logs Tracker</h1>
      </FadeUp>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <FadeUp delay={60}>
          <div className="bg-teal text-white rounded-lg p-4 card-soft">
            <div className="text-xs opacity-85">Total Sessions</div>
            <div className="font-serif text-4xl font-bold mt-1">185</div>
          </div>
        </FadeUp>

        <FadeUp delay={120}>
          <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4 card-soft">
            <AnimatedRing pct={78} size={80} />
            <div>
              <div className="text-xs text-muted-text">Global Attendance</div>
              <div className="text-xs">Registered: 4,500</div>
              <div className="text-xs">Present: 3,510</div>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={180}>
          <div className="bg-card border border-border rounded-lg p-4 card-soft">
            <div className="text-xs text-muted-text mb-2">Sessions by Context</div>
            {[["GE Subjects",35,"bg-teal"],["Team Practices",24,"bg-gold"],["Panata Groups",21,"bg-slate-blue"],["Tasks/Anns",20,"bg-amber-status"]].map(([k,v,c], i) => (
              <div key={k as string} className="text-xs flex items-center gap-2 mb-1"
                style={{ opacity: 0, animation: "fadeInRow 0.35s ease forwards", animationDelay: `${180 + i * 60}ms` }}>
                <span className={`w-3 h-3 rounded ${c}`}/> {k} <strong className="ml-auto">{v}%</strong>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>

      <FadeUp delay={300}>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8 bg-card border border-border rounded-lg overflow-hidden card-soft">
            <div className="p-3 flex gap-2 border-b border-border">
              <input placeholder="Search sessions..." className="flex-1 px-3 py-1.5 border border-border rounded text-sm"/>
              <select className="px-2 py-1.5 border border-border rounded text-sm"><option>All Contexts</option><option>Class</option><option>Team</option><option>Panata</option><option>Task</option></select>
              <select className="px-2 py-1.5 border border-border rounded text-sm"><option>All Dates</option></select>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-teal-dark text-white uppercase">
                <tr>{["Session","Type","Date","Time","Location","Reg","Present","Rate %"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr>
              </thead>
              <tbody>
                {adminSessions.map((s, i) => (
                  <tr key={i} onClick={() => setSelected(i)}
                    className={`row-alt border-b border-border cursor-pointer ${selected===i?"!bg-green-status/15 border-l-4 border-l-green-status":""} ${(s[7] as number)<50?"border-l-4 border-l-red-status":""}`}
                    style={rowStyle(i)}>
                    <td className="px-2 py-2 font-semibold">{s[0]}</td>
                    <td className="px-2 py-2"><span className={`chip ${s[1]==="Panata"?"bg-gold text-teal-dark":s[1]==="Task"?"bg-amber-status text-white":"bg-teal text-white"}`}>{s[1]}</span></td>
                    <td className="px-2 py-2">{s[2]}</td>
                    <td className="px-2 py-2">{s[3]}</td>
                    <td className="px-2 py-2 text-muted-text">{s[4]}</td>
                    <td className="px-2 py-2">{s[5]}</td>
                    <td className="px-2 py-2">{s[6]}</td>
                    <td className="px-2 py-2 font-bold">{s[7]}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="col-span-4 bg-card border border-border rounded-lg p-4 card-soft">
            <h3 className="font-serif font-bold text-teal-dark text-sm mb-2">{adminSessions[selected][0]}</h3>
            <div className="text-xs text-muted-text mb-3">{adminSessions[selected][2]} · {adminSessions[selected][3]} · Present: {adminSessions[selected][6]}/{adminSessions[selected][5]} ({adminSessions[selected][7]}%)</div>
            {(adminSessions[selected][7] as number) < 50 && <div className="chip bg-amber-status text-white mb-3">⚠ Requires Attention</div>}
            <div className="flex gap-1 mb-3 text-xs">
              {["Present","Absent","Late","Excused"].map((t, i) => <button key={t} className={`px-2 py-1 rounded ${i===0?"bg-teal text-white":"bg-secondary"}`}>{t}</button>)}
            </div>
            <table className="w-full text-xs">
              <thead><tr className="border-b border-border"><th className="text-left py-1">Name</th><th className="text-left">Group</th><th className="text-center">Status</th></tr></thead>
              <tbody>
                {[
                  ["Natalie Portman","Video Team","✓"],
                  ["Alex Ammin","Video Team","✓"],
                  ["Ben Affleck","Design Team","✓"],
                  ["Maria Santos","Video Team","✕"],
                  ["Jose Reyes","Video Team","🅴"],
                  ["Ana Cruz","Music Team","✕"],
                  ["Diego Luna","Writers","✓"],
                  ["Rosa Gomez","DGA","✓"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-border" style={rowStyle(i)}>
                    <td className="py-1">{r[0]}</td><td className="text-muted-text">{r[1]}</td><td className="text-center font-bold">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeUp>
    </div>
  );
}

// SA7: Operations Control
export function Operations() {
  const [tab, setTab] = useState<"assigner" | "requests" | "groups" | "algorithms">("assigner");
  const [reqType, setReqType] = useState("All");
  const [selected, setSelected] = useState<string[]>([]);
  const [geStudents, setGeStudents] = useState(120);
  const [gePerGroup, setGePerGroup] = useState(30);
  const [panataStudents, setPanataStudents] = useState(75);
  const [panataPerGroup, setPanataPerGroup] = useState(15);
  const [requests, setRequests] = useState([
    { id: "r1", type: "Guest Request", requester: "David Lee", details: "Join Video Team", date: "Jun 2, 2026" },
    { id: "r2", type: "Schedule Switch", requester: "Michael Chen", details: "Switch Panata Group to CICS3", date: "Jun 2, 2026" },
    { id: "r3", type: "GE Switch", requester: "Jane Cooper", details: "Drop GE 101-B", date: "Jun 2, 2026" },
    { id: "r4", type: "Team Joining", requester: "Pedro Ramos", details: "Join Writers Team", date: "Jun 3, 2026" },
    { id: "r5", type: "New Group Creation", requester: "Maria Cruz", details: "Create CICS6 Panata Group", date: "Jun 3, 2026" },
  ]);

  const unassigned = [
    { id: "u1", name: "Alice Brown", dept: "CICS", scope: "GE" },
    { id: "u2", name: "Michael Chen", dept: "CICS", scope: "Panata" },
    { id: "u3", name: "Jane Cooper", dept: "CAS", scope: "GE" },
    { id: "u4", name: "Pedro Ramos", dept: "CEA", scope: "Team" },
  ];
  const reqTypes = ["All", "Guest Request", "Schedule Switch", "GE Switch", "Panata Switch", "Team Joining", "New Group Creation"];
  const filteredReqs = reqType === "All" ? requests : requests.filter(r => r.type === reqType || (reqType === "Schedule Switch" && r.type.includes("Switch")));
  const geGroupsNeeded = Math.max(1, Math.ceil(geStudents / gePerGroup));
  const panataGroupsNeeded = Math.max(1, Math.ceil(panataStudents / panataPerGroup));

  const tabs = [
    { id: "assigner" as const, label: "Student Assigner" },
    { id: "requests" as const, label: "Pending Requests" },
    { id: "groups" as const, label: "New Group Creation" },
    { id: "algorithms" as const, label: "Algorithms" },
  ];

  return (
    <div className="p-6 space-y-5">
      <FadeUp>
        <div>
          <h1 className="font-serif text-2xl font-bold text-teal-dark">Operations Control</h1>
          <p className="text-sm text-muted-text mt-1">Student assignment, request approval, group creation, and semi-automated algorithms.</p>
        </div>
      </FadeUp>

      <FadeUp delay={60}>
        <div className="flex gap-0 border-b border-border overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition ${tab === t.id ? "border-teal-dark text-teal-dark" : "border-transparent text-muted-text hover:text-teal-dark"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </FadeUp>

      {tab === "assigner" && (
        <FadeUp delay={100}>
          <section className="bg-card border border-border rounded-xl p-5 card-soft space-y-4">
            <div className="grid grid-cols-4 gap-3">
              {[["Unassigned","65","bg-amber-status text-white"],["Selected",String(selected.length),"bg-teal text-white"],["Open GE Slots","42","bg-teal-light text-white"],["Open Panata Slots","18","bg-gold text-teal-dark"]].map(([k,v,c], i) => (
                <div key={k} className={`${c} rounded-lg p-4`} style={{ opacity: 0, animation: "fadeInRow 0.35s ease forwards", animationDelay: `${i * 60}ms` }}>
                  <div className="text-xs opacity-85">{k}</div>
                  <div className="font-serif text-2xl font-bold mt-1">{v}</div>
                </div>
              ))}
            </div>
            <div className="bg-teal-soft/40 border border-teal/20 rounded-lg px-4 py-2 text-xs">
              Multi-select students, choose a target group, then assign. Suggestions weighted by Availability Heatmap.
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="border border-border rounded-lg p-3">
                <div className="text-xs font-bold text-muted-text mb-2">UNASSIGNED STUDENTS</div>
                <ul className="space-y-1.5">
                  {unassigned.map((u, i) => {
                    const on = selected.includes(u.id);
                    return (
                      <li key={u.id} style={{ opacity: 0, animation: "fadeInRow 0.35s ease forwards", animationDelay: `${i * 50}ms` }}>
                        <button onClick={() => setSelected(s => s.includes(u.id) ? s.filter(x => x !== u.id) : [...s, u.id])}
                          className={`w-full p-2 rounded text-sm text-left flex justify-between ${on ? "bg-teal-soft border border-teal/40" : "bg-secondary hover:bg-teal-soft/30"}`}>
                          <span><strong>{u.name}</strong> · {u.dept}</span>
                          <span className="chip bg-teal-soft text-teal text-[10px]">{u.scope}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="border border-border rounded-lg p-3 space-y-3">
                <div>
                  <label className="text-xs font-bold text-muted-text">Assign To</label>
                  <select className="w-full mt-1 px-3 py-2 border border-border rounded text-sm bg-card">
                    <optgroup label="Panata Groups"><option>CICS3 Panata</option><option>CICS4 Panata</option></optgroup>
                    <optgroup label="GE Subject Groups"><option>Sosyedad — IS234A</option><option>Art App — M414B</option></optgroup>
                    <optgroup label="Teams"><option>Video Team 104</option><option>Writers Team</option></optgroup>
                    <optgroup label="Event Duties"><option>Choir Concert — Usher</option><option>Choir Concert — Stage Crew</option></optgroup>
                  </select>
                </div>
                <div className="bg-secondary/50 rounded p-3 text-xs">Heatmap suggestion: Best window <strong>Sun 7AM–10AM</strong> (89% available)</div>
                <div className="flex gap-2">
                  <button onClick={() => setSelected([])} className="flex-1 py-2 border border-border rounded text-sm font-semibold hover:bg-secondary">Clear</button>
                  <button onClick={() => setSelected([])} className="flex-1 py-2 bg-teal text-white rounded text-sm font-semibold hover:bg-teal-dark">Assign {selected.length}</button>
                </div>
              </div>
            </div>
          </section>
        </FadeUp>
      )}

      {tab === "requests" && (
        <FadeUp delay={100}>
          <section className="bg-card border border-border rounded-xl p-5 card-soft space-y-4">
            <div className="flex flex-wrap gap-1.5">
              {reqTypes.map(t => (
                <button key={t} onClick={() => setReqType(t)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${reqType === t ? "bg-teal text-white border-teal" : "bg-card border-border hover:bg-secondary"}`}>{t}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { type: "Guest Request", count: 2, desc: "New member onboarding" },
                { type: "Schedule Switch", count: 3, desc: "GE or Panata group changes" },
                { type: "Team Joining", count: 1, desc: "STF team membership" },
                { type: "New Group Creation", count: 1, desc: "Panata, GE section, or team" },
              ].map((c, i) => (
                <button key={c.type} onClick={() => setReqType(c.type)}
                  className="text-left p-4 rounded-xl border border-border bg-card hover:border-teal/40 transition"
                  style={{ opacity: 0, animation: "fadeInRow 0.35s ease forwards", animationDelay: `${i * 60}ms` }}>
                  <div className="text-xs font-bold text-teal-dark">{c.type}</div>
                  <div className="font-serif text-2xl font-bold mt-1">{c.count}</div>
                  <div className="text-[11px] text-muted-text mt-1">{c.desc}</div>
                </button>
              ))}
            </div>
            <table className="w-full text-sm">
              <thead className="bg-teal-dark text-white text-xs uppercase">
                <tr>{["Submitted","Type","Requester","Details","Actions"].map(h => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr>
              </thead>
              <tbody>
                {filteredReqs.map((r, i) => (
                  <tr key={r.id} className="row-alt border-b border-border" style={rowStyle(i)}>
                    <td className="px-3 py-2 text-muted-text">{r.date}</td>
                    <td className="px-3 py-2"><span className="chip bg-teal-soft text-teal">{r.type}</span></td>
                    <td className="px-3 py-2 font-semibold">{r.requester}</td>
                    <td className="px-3 py-2">{r.details}</td>
                    <td className="px-3 py-2 flex gap-2">
                      <button onClick={() => setRequests(q => q.filter(x => x.id !== r.id))} className="bg-gold text-teal-dark px-3 py-1 rounded text-xs font-bold">Approve</button>
                      <button onClick={() => setRequests(q => q.filter(x => x.id !== r.id))} className="bg-teal-dark text-white px-3 py-1 rounded text-xs font-bold">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </FadeUp>
      )}

      {tab === "groups" && (
        <FadeUp delay={100}>
          <section className="grid grid-cols-3 gap-4">
            {[
              { title: "Create GE Subject Group", fields: ["GE Subject", "Group Name", "Teacher"] },
              { title: "Create Team", fields: ["Team Name", "Lead", "Overseer"] },
              { title: "Create Panata Group", fields: ["Group Code", "Assigned Department", "Monitor"] },
            ].map((g, i) => (
              <div key={g.title} className="bg-card border border-border rounded-xl p-5 card-soft"
                style={{ opacity: 0, animation: "fadeInRow 0.4s ease forwards", animationDelay: `${i * 80}ms` }}>
                <h3 className="font-serif font-bold text-teal-dark mb-3">{g.title}</h3>
                {g.fields.map(f => (
                  <div key={f} className="mb-2">
                    <label className="text-xs text-muted-text">{f}</label>
                    <input className="w-full mt-0.5 px-3 py-2 border border-border rounded text-sm bg-card"/>
                  </div>
                ))}
                <button className="w-full mt-2 py-2 bg-teal text-white rounded text-sm font-semibold hover:bg-teal-dark">+ Create</button>
              </div>
            ))}
          </section>
        </FadeUp>
      )}

      {tab === "algorithms" && (
        <FadeUp delay={100}>
          <section className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  title: "GE Subject Group Calculator",
                  desc: "Based on enrolled students per GE subject — editable split.",
                  students: geStudents, setStudents: setGeStudents,
                  perGroup: gePerGroup, setPerGroup: setGePerGroup,
                  groupsNeeded: geGroupsNeeded,
                  bg: "bg-teal-soft",
                },
                {
                  title: "Panata Group Calculator",
                  desc: "Based on students in a department — editable split.",
                  students: panataStudents, setStudents: setPanataStudents,
                  perGroup: panataPerGroup, setPerGroup: setPanataPerGroup,
                  groupsNeeded: panataGroupsNeeded,
                  bg: "bg-gold-soft",
                },
              ].map((c, i) => (
                <div key={c.title} className="bg-card border border-border rounded-xl p-5 card-soft"
                  style={{ opacity: 0, animation: "fadeInRow 0.4s ease forwards", animationDelay: `${i * 80}ms` }}>
                  <h3 className="font-serif font-bold text-teal-dark mb-2">{c.title}</h3>
                  <p className="text-xs text-muted-text mb-3">{c.desc}</p>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className="text-xs text-muted-text">Enrolled Students</label>
                      <input type="number" value={c.students} onChange={e => c.setStudents(Number(e.target.value))} className="w-full mt-1 px-3 py-2 border border-border rounded text-sm"/></div>
                    <div><label className="text-xs text-muted-text">Students per Group</label>
                      <input type="number" value={c.perGroup} onChange={e => c.setPerGroup(Number(e.target.value))} className="w-full mt-1 px-3 py-2 border border-border rounded text-sm"/></div>
                  </div>
                  <div className={`${c.bg} rounded-lg p-3 text-sm`}><strong>{c.groupsNeeded}</strong> group(s) needed · ~{Math.ceil(c.students / c.groupsNeeded)} students each</div>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-xl p-5 card-soft"
              style={{ opacity: 0, animation: "fadeInRow 0.4s ease forwards", animationDelay: "180ms" }}>
              <h3 className="font-serif font-bold text-teal-dark mb-2">Event Duty Assignment (Heatmap-based)</h3>
              <p className="text-xs text-muted-text mb-3">Assign individual students or teams to event duties based on availability heatmap.</p>
              <div className="grid grid-cols-3 gap-3">
                <select className="px-3 py-2 border border-border rounded text-sm bg-card"><option>Choir Concert B4</option><option>Snapseed Seminar</option></select>
                <select className="px-3 py-2 border border-border rounded text-sm bg-card"><option>Ushering</option><option>Stage Crew</option><option>Photographer</option></select>
                <button className="py-2 bg-teal text-white rounded text-sm font-semibold hover:bg-teal-dark">Auto-Assign from Heatmap</button>
              </div>
            </div>
          </section>
        </FadeUp>
      )}
    </div>
  );
}

// SA6: Grade Manager
export function Endoar() {
  const [tab, setTab] = useState<"ge" | "team" | "final">("ge");
  const [geView, setGeView] = useState<"cards" | "all">("cards");
  const [openSubject, setOpenSubject] = useState<string | null>(null);
  const [openTeam, setOpenTeam] = useState<string | null>(null);

  const geSubjects = ["Art Appreciation", "Sosyedad at Literatura", "Ethics", "PE 3"];
  const teams = [
    { name: "Video Team 104", members: 55, avgAevm: "B+" },
    { name: "DGA Team", members: 25, avgAevm: "A-" },
    { name: "Writers Team", members: 18, avgAevm: "B" },
    { name: "Music Team", members: 30, avgAevm: "A" },
  ];
  const geGroups: Record<string, { group: string; teacher: string; members: number; attendance: number }[]> = {
    "Art Appreciation": [{ group: "Art App — M414B", teacher: "Prof. Reyes", members: 32, attendance: 91 }],
    "Sosyedad at Literatura": [{ group: "SosLit — IS233B", teacher: "Prof. Sandoval", members: 28, attendance: 84 }, { group: "SosLit — IS234A", teacher: "Prof. Sandoval", members: 30, attendance: 88 }],
    "Ethics": [{ group: "Ethics — M210A", teacher: "Prof. Mariano", members: 35, attendance: 93 }],
    "PE 3": [{ group: "PE 3 — G2", teacher: "Coach Lim", members: 40, attendance: 78 }],
  };
  const gradeRows = [
    { student: "Natalie Portman", group: "Art App — M414B", attendance: 94, tasks: 92, grade: 1.4 },
    { student: "Alex Ammin", group: "SosLit — IS233B", attendance: 81, tasks: 78, grade: 1.7 },
    { student: "Ben Affleck", group: "Ethics — M210A", attendance: 100, tasks: 96, grade: 1.1 },
    { student: "Maria Santos", group: "PE 3 — G2", attendance: 70, tasks: 65, grade: 2.3 },
  ];
  const gradeChip = (g: number) => g <= 1.5 ? "bg-green-status text-white" : g <= 2.0 ? "bg-teal text-white" : g <= 2.5 ? "bg-amber-status text-white" : "bg-red-status text-white";

  return (
    <div className="p-6">
      <FadeUp>
        <h1 className="font-serif text-2xl font-bold text-teal-dark mb-1">Grade Manager</h1>
        <p className="text-sm text-muted-text mb-4">GE grading by subject group · Team AEVM scores · Final grade by GE subject.</p>
      </FadeUp>

      <FadeUp delay={60}>
        <div className="border-b border-border flex gap-1 mb-4">
          {[["ge","GE Subject"],["team","Team"],["final","Final Grade"]].map(([id, l]) => (
            <button key={id} onClick={() => setTab(id as typeof tab)} className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px ${tab === id ? "border-teal text-teal-dark" : "border-transparent text-muted-text"}`}>{l}</button>
          ))}
        </div>
      </FadeUp>

      {tab === "ge" && (
        <FadeUp delay={100}>
          <div className="flex gap-2 mb-4">
            <button onClick={() => setGeView("cards")} className={`px-3 py-1.5 text-xs font-bold rounded-lg ${geView === "cards" ? "bg-teal text-white" : "bg-card border border-border"}`}>Subject Cards</button>
            <button onClick={() => setGeView("all")} className={`px-3 py-1.5 text-xs font-bold rounded-lg ${geView === "all" ? "bg-teal text-white" : "bg-card border border-border"}`}>All View</button>
          </div>
          {geView === "cards" ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {geSubjects.map((s, i) => (
                <button key={s} onClick={() => setOpenSubject(s)}
                  className="text-left p-4 rounded-xl border border-border bg-card hover:border-teal/40 transition card-soft"
                  style={{ opacity: 0, animation: "fadeInRow 0.35s ease forwards", animationDelay: `${i * 60}ms` }}>
                  <div className="font-serif font-bold text-teal-dark">{s}</div>
                  <div className="text-xs text-muted-text mt-1">{(geGroups[s] ?? []).length} subgroup(s)</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-hidden card-soft mb-4">
              <table className="w-full text-sm">
                <thead className="bg-teal-dark text-white text-xs uppercase">
                  <tr>{["Student","GE Subject Group","Attendance %","Task %","Grade"].map(h => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {gradeRows.map((r, i) => (
                    <tr key={i} className="row-alt border-b border-border" style={rowStyle(i)}>
                      <td className="px-3 py-2 font-semibold">{r.student}</td>
                      <td className="px-3 py-2">{r.group}</td>
                      <td className="px-3 py-2">{r.attendance}%</td>
                      <td className="px-3 py-2">{r.tasks}%</td>
                      <td className="px-3 py-2"><span className={`chip ${gradeChip(r.grade)}`}>{r.grade.toFixed(2)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {openSubject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpenSubject(null)}>
              <div className="bg-card rounded-xl max-w-lg w-full p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
                <h3 className="font-serif font-bold text-teal-dark mb-3">{openSubject} · Subgroups</h3>
                <div className="space-y-2">
                  {(geGroups[openSubject] ?? []).map((g, i) => (
                    <div key={g.group} className="p-3 border border-border rounded-lg" style={rowStyle(i)}>
                      <div className="font-semibold">{g.group}</div>
                      <div className="text-xs text-muted-text">Teacher: {g.teacher} · {g.members} members · {g.attendance}% attendance</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setOpenSubject(null)} className="mt-4 w-full py-2 bg-teal text-white rounded font-semibold text-sm">Close</button>
              </div>
            </div>
          )}
        </FadeUp>
      )}

      {tab === "team" && (
        <FadeUp delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {teams.map((t, i) => (
              <button key={t.name} onClick={() => setOpenTeam(t.name)}
                className="text-left p-4 rounded-xl border border-border bg-card hover:border-teal/40 transition card-soft"
                style={{ opacity: 0, animation: "fadeInRow 0.35s ease forwards", animationDelay: `${i * 60}ms` }}>
                <div className="font-serif font-bold text-teal-dark">{t.name}</div>
                <div className="text-xs text-muted-text mt-1">{t.members} members</div>
                <div className="mt-2"><span className="chip bg-teal text-white">Avg AEVM: {t.avgAevm}</span></div>
              </button>
            ))}
            {openTeam && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpenTeam(null)}>
                <div className="bg-card rounded-xl max-w-2xl w-full p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
                  <h3 className="font-serif font-bold text-teal-dark mb-3">{openTeam} · AEVM Scores</h3>
                  <table className="w-full text-sm">
                    <thead><tr className="text-xs uppercase text-muted-text border-b"><th className="py-2 text-left">Student</th><th className="py-2 text-left">Attendance</th><th className="py-2 text-left">Tasks</th><th className="py-2 text-left">AEVM</th></tr></thead>
                    <tbody>
                      {gradeRows.slice(0, 3).map((r, i) => (
                        <tr key={i} className="border-b border-border" style={rowStyle(i)}>
                          <td className="py-2 font-semibold">{r.student}</td><td>{r.attendance}%</td><td>{r.tasks}%</td>
                          <td><span className="chip bg-teal text-white">{["A-","B+","A"][i]}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button onClick={() => setOpenTeam(null)} className="mt-4 w-full py-2 bg-teal text-white rounded font-semibold text-sm">Close</button>
                </div>
              </div>
            )}
          </div>
        </FadeUp>
      )}

      {tab === "final" && (
        <FadeUp delay={100}>
          <div className="bg-teal-soft/40 border border-teal/20 rounded-lg px-4 py-2 text-xs mb-4">
            Final Grade = average of GE subject group score and AEVM score · drill down by GE subject.
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {geSubjects.map((s, i) => (
              <button key={s} onClick={() => setOpenSubject(s)}
                className="text-left p-4 rounded-xl border border-border bg-card hover:border-teal/40 transition card-soft"
                style={{ opacity: 0, animation: "fadeInRow 0.35s ease forwards", animationDelay: `${i * 60}ms` }}>
                <div className="font-serif font-bold text-teal-dark">{s}</div>
                <div className="text-xs text-muted-text mt-1">View final grades</div>
              </button>
            ))}
          </div>
          <div className="bg-card border border-border rounded-lg overflow-hidden card-soft">
            <table className="w-full text-sm">
              <thead className="bg-teal-dark text-white text-xs uppercase">
                <tr>{["Student","GE Score","AEVM","Final Grade"].map(h => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr>
              </thead>
              <tbody>
                {[
                  { s:"Natalie Portman", ge:1.4, aevm:"A-", final:1.33 },
                  { s:"Alex Ammin", ge:1.7, aevm:"B+", final:1.6 },
                  { s:"Ben Affleck", ge:1.1, aevm:"A", final:1.05 },
                ].map((r, i) => (
                  <tr key={i} className="row-alt border-b border-border" style={rowStyle(i)}>
                    <td className="px-3 py-2 font-semibold">{r.s}</td>
                    <td className="px-3 py-2"><span className={`chip ${gradeChip(r.ge)}`}>{r.ge.toFixed(2)}</span></td>
                    <td className="px-3 py-2"><span className="chip bg-teal text-white">{r.aevm}</span></td>
                    <td className="px-3 py-2"><span className={`chip ${gradeChip(r.final)}`}>{r.final.toFixed(2)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeUp>
      )}

      <FadeUp delay={160}>
        <div className="flex justify-end gap-2 mt-4">
          <button className="bg-gold text-teal-dark px-5 py-2 rounded font-bold text-sm hover:brightness-105">Compute Final Grades</button>
          <button className="bg-teal text-white px-5 py-2 rounded font-semibold text-sm hover:bg-teal-dark">Save Grades</button>
        </div>
      </FadeUp>
    </div>
  );
}

// SA: Student Management
export function StudentGroups() {
  const [openCard, setOpenCard] = useState<string | null>(null);
  const respCards = [
    { id: "ge",     scope: "GE",     title: "GE Subject Groups", count: 87, attendance: 84 },
    { id: "team",   scope: "Team",   title: "STF Teams",         count: 6,  attendance: 89 },
    { id: "panata", scope: "Panata", title: "Panata Groups",     count: 25, attendance: 91 },
  ];
  const mainRows = [
    ["Alex Johnson","STF-2021-0042","Sophomore","Computer Studies","Video Team 104","CICS2","GE 101-A","Active","green"],
    ["Natalie Portman","STF-2022-0101","Junior","Nursing","Video Team 104","CON-CRT","GE 101-A","Active","green"],
    ["Ben Affleck","STF-2021-0088","Senior","Engineering and Architecture","Photography Team","CEA1","GE 102-B","Active","green"],
    ["Maria Santos","STF-2023-0103","Freshman","Communication","Writers Team","CAS2","GE 101-A","Active","green"],
    ["Ana Cruz","STF-2022-0105","Junior","Accountancy","Music Team","COA1","GE 102-A","On Leave","amber"],
    ["Jose Reyes","STF-2023-0104","Freshman","Arts and Sciences","Writers Team","CAS3","GE 101-B","Active","green"],
    ["David Lee","STF-2024-0701","Freshman","Criminology","—","—","—","Unassigned","red"],
    ["Diego Luna","STF-2022-0106","Sophomore","Criminology","Livestream Team","COC1","GE 102-A","Active","green"],
    ["Rosa Gomez","STF-2023-0107","Freshman","Midwifery","DGA Team","CMT1","GE 101-B","Active","green"],
  ];

  return (
    <div className="p-6">
      <FadeUp>
        <h1 className="font-serif text-2xl font-bold text-teal-dark mb-1">Student Management — Masterlist</h1>
        <p className="text-sm text-muted-text mb-4">Responsibility sub-cards with searchable masterlists across the organization.</p>
      </FadeUp>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {respCards.map((c, i) => (
          <FadeUp key={c.id} delay={i * 70}>
            <button onClick={() => setOpenCard(c.id)} className="text-left bg-card border border-border rounded-xl p-4 card-soft hover:border-teal/40 transition w-full">
              <span className="chip bg-teal-soft text-teal text-[10px]">{c.scope}</span>
              <div className="font-serif font-bold text-teal-dark mt-2">{c.title}</div>
              <div className="text-xs text-muted-text mt-1">{c.count} active · {c.attendance}% avg attendance</div>
              <div className="text-xs text-teal font-semibold mt-2">View Masterlist →</div>
            </button>
          </FadeUp>
        ))}
      </div>

      {openCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpenCard(null)}>
          <div className="bg-card rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 bg-teal-dark text-white">
              <h3 className="font-serif font-bold">{respCards.find(c => c.id === openCard)?.title} · Masterlist</h3>
            </div>
            <div className="p-4 border-b flex gap-2">
              <input placeholder="Search students…" className="flex-1 px-3 py-2 border border-border rounded text-sm"/>
              <select className="px-3 py-2 border border-border rounded text-sm"><option>Sort: Name</option><option>Sort: Attendance</option><option>Sort: Year</option></select>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-muted-text border-b">
                  <tr>{["Name","Student ID","Department","Team","Panata","Status"].map(h => <th key={h} className="py-2 text-left">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {[
                    ["Alex Johnson","STF-2021-0042","Computer Studies","Video Team 104","CICS2","Active"],
                    ["Natalie Portman","STF-2022-0101","Nursing","Video Team 104","CON-CRT","Active"],
                    ["David Lee","STF-2024-0701","Criminology","—","—","Unassigned"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-border" style={rowStyle(i)}>
                      <td className="py-2 font-semibold">{r[0]}</td>
                      {r.slice(1).map((c, j) => <td key={j} className="py-2 text-xs">{c}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button className="px-4 py-2 text-sm border border-teal text-teal rounded font-semibold">Export CSV</button>
              <button onClick={() => setOpenCard(null)} className="px-4 py-2 text-sm bg-teal text-white rounded font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          ["Total Students","4,500","bg-teal text-white"],
          ["Active Teams","6","bg-gold text-teal-dark"],
          ["Panata Groups","25","bg-slate-blue text-white"],
          ["18 Departments","18","bg-teal-light text-white"],
        ].map(([k, v, c], i) => (
          <FadeUp key={k} delay={i * 60}>
            <div className={`${c} rounded-lg p-4 card-soft`}>
              <div className="text-xs opacity-85">{k}</div>
              <div className="font-serif text-3xl font-bold mt-1">{v}</div>
            </div>
          </FadeUp>
        ))}
      </div>

      <FadeUp delay={280}>
        <div className="flex gap-2 mb-3">
          <input placeholder="Search students…" className="flex-1 px-3 py-2 border border-border rounded text-sm bg-card"/>
          <select className="px-3 py-2 border border-border rounded text-sm bg-card"><option>All Departments</option><option>Computer Studies</option><option>Nursing</option><option>Engineering and Architecture</option><option>Communication</option></select>
          <select className="px-3 py-2 border border-border rounded text-sm bg-card"><option>All Teams</option><option>Video Team</option><option>Music Team</option></select>
        </div>
      </FadeUp>

      <FadeUp delay={340}>
        <div className="bg-card border border-border rounded-lg overflow-hidden card-soft">
          <table className="w-full text-sm">
            <thead className="bg-teal-dark text-white text-xs uppercase">
              <tr>{["Name","Student ID","Year","Department","Team","Panata","GE Subject Group","Status"].map(h => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr>
            </thead>
            <tbody>
              {mainRows.map((r, i) => (
                <tr key={i} className="row-alt border-b border-border" style={rowStyle(i)}>
                  <td className="px-3 py-2 font-semibold">{r[0]}</td>
                  <td className="px-3 py-2 font-mono text-xs">{r[1]}</td>
                  <td className="px-3 py-2">{r[2]}</td>
                  <td className="px-3 py-2">{r[3]}</td>
                  <td className="px-3 py-2">{r[4]}</td>
                  <td className="px-3 py-2">{r[5]}</td>
                  <td className="px-3 py-2">{r[6]}</td>
                  <td className="px-3 py-2">
                    <span className={`chip ${r[8]==="green"?"bg-green-status text-white":r[8]==="amber"?"bg-amber-status text-white":"bg-red-status text-white"}`}>{r[7]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeUp>
    </div>
  );
}

// Admin Profile
export function AdminProfile() {
  const { role } = usePortal();

  if (role !== "admin" && role !== "superadmin") {
    return (
      <div className="p-7 text-center text-red-status font-semibold flex items-center gap-2 justify-center">
        <AlertCircle className="w-5 h-5" /> Access Denied: Administrative Scope Required.
      </div>
    );
  }

  const isAdmin = role === "admin";
  const adminTabs = [
    { id: "overview", label: "Overview Metrics" },
    { id: "assigned-scope", label: "Class Section Control" },
    { id: "audit", label: "Monitor Logs" },
  ];
  const superAdminTabs = [
    { id: "overview", label: "Institutional Overview" },
    { id: "org-control", label: "Global Operations Control" },
    { id: "audit", label: "System Security Logs" },
  ];
  const activeTabs = isAdmin ? adminTabs : superAdminTabs;
  const [currentTab, setCurrentTab] = useState("overview");

  const profileData = {
    name: isAdmin ? "Prof. Eleanor Vance" : "Dr. Alistair Sterling",
    title: isAdmin ? "Academic Course Monitor" : "Chief Institutional Admin",
    employeeId: isAdmin ? "EMP-2023-8841" : "EMP-2018-0001",
    email: isAdmin ? "e.vance@stf-neu.edu.ph" : "a.sterling@stf-neu.edu.ph",
    department: isAdmin ? "College of Information and Computer Studies" : "Office of Institutional Operations",
    scopeLabel: isAdmin ? "GE 101 — Section A" : "Full Organization (All STF-NEU)",
    status: "Active Duty",
  };

  return (
    <div className="p-7 max-w-6xl">
      <FadeUp>
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-dark flex items-center justify-center shadow-md">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-teal-dark">{profileData.name}</h1>
                <span className={`chip text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${isAdmin ? "bg-teal-soft text-teal-dark" : "bg-gold/20 text-teal-dark border border-gold/40"}`}>
                  {isAdmin ? "Admin" : "Super Admin"}
                </span>
              </div>
              <p className="text-sm font-medium text-muted-text mt-0.5">{profileData.title} · {profileData.department}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-text font-mono">
                <span className="flex items-center gap-1"><Hash className="w-3.5 h-3.5" /> {profileData.employeeId}</span>
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {profileData.email}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col text-left md:text-right border-l md:border-l-0 md:border-r border-border pl-4 md:pl-0 md:pr-6 gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-text">Managed Scope Target</span>
            <span className="text-sm font-bold text-teal-dark flex items-center gap-1.5 justify-start md:justify-end">
              <Building2 className="w-4 h-4 text-teal" /> {profileData.scopeLabel}
            </span>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={60}>
        <div className="flex gap-0 border-b border-border mb-6 overflow-x-auto">
          {activeTabs.map(tab => (
            <button key={tab.id} onClick={() => setCurrentTab(tab.id)}
              className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${currentTab === tab.id ? "border-teal-dark text-teal-dark font-bold" : "border-transparent text-foreground/50 hover:text-teal-dark"}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </FadeUp>

      <div className="space-y-6">
        {currentTab === "overview" && (
          <FadeUp delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {isAdmin ? (
                <>
                  {[
                    { Icon: Users, color: "text-teal", value: "42", label: "Monitored Students" },
                    { Icon: CheckCircle, color: "text-green-status", value: "94.2%", label: "Average Attendance Sync" },
                    { Icon: BookOpen, color: "text-gold", value: "8 Pending", label: "Tasks Awaiting Grading Evaluation" },
                  ].map(({ Icon, color, value, label }, i) => (
                    <div key={label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3"
                      style={{ opacity: 0, animation: "fadeInRow 0.35s ease forwards", animationDelay: `${i * 80}ms` }}>
                      <Icon className={`w-8 h-8 ${color} shrink-0`} />
                      <div>
                        <div className="text-2xl font-serif font-bold text-teal-dark">{value}</div>
                        <div className="text-xs font-semibold text-muted-text">{label}</div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {[
                    { Icon: Building2, color: "text-teal", value: "1,480", label: "Total Active Institutional Enrolments" },
                    { Icon: SlidersHorizontal, color: "text-slate-blue", value: "24 Clusters", label: "Active Operations Command Nodes" },
                    { Icon: Activity, color: "text-gold", value: "99.98%", label: "Portal Engine System Uptime Logs" },
                  ].map(({ Icon, color, value, label }, i) => (
                    <div key={label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3"
                      style={{ opacity: 0, animation: "fadeInRow 0.35s ease forwards", animationDelay: `${i * 80}ms` }}>
                      <Icon className={`w-8 h-8 ${color} shrink-0`} />
                      <div>
                        <div className="text-2xl font-serif font-bold text-teal-dark">{value}</div>
                        <div className="text-xs font-semibold text-muted-text">{label}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            <div className="bg-card border border-border rounded-xl p-5"
              style={{ opacity: 0, animation: "fadeInRow 0.4s ease forwards", animationDelay: "280ms" }}>
              <h3 className="font-serif font-bold text-teal-dark text-base mb-3">System Access Profile Parameters</h3>
              <div className="text-sm text-muted-text leading-relaxed space-y-2">
                <p>This administrative profile sheet controls access tokens routing automated verification pipelines.</p>
                <div className="p-3 bg-secondary/40 border border-border rounded-xl text-xs font-mono text-foreground space-y-1">
                  <div>Security Matrix Clearances: Tier-{isAdmin ? "2 (Course Monitor)" : "1 (Global Root)"}</div>
                  <div>Assigned Signature Node: {isAdmin ? "STF-NEU-SEC-MON-ALPHA" : "STF-NEU-SEC-ROOT-SYSTEM"}</div>
                  <div>Terminal Session IP Clearance: Authorized via Single Sign On Proxy Protocol</div>
                </div>
              </div>
            </div>
          </FadeUp>
        )}

        {currentTab === "assigned-scope" && isAdmin && (
          <FadeUp delay={100}>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-serif font-bold text-teal-dark text-base mb-2">Class Section Assignments control</h3>
              <p className="text-sm text-muted-text mb-4">The master parameters below delineate your explicit tracking jurisdictions over course nodes.</p>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <tr className="bg-teal-dark text-white text-xs font-semibold uppercase">
                    <th className="p-3">Section Code</th><th className="p-3">Course Description</th><th className="p-3">Schedule Slot</th><th className="p-3">Status</th>
                  </tr>
                  <tr className="border-b border-border text-xs" style={rowStyle(0)}>
                    <td className="p-3 font-bold text-teal-dark">GE101-SECA</td>
                    <td className="p-3">Art Appreciation</td>
                    <td className="p-3 font-mono">TUE/THU 11:30-13:00</td>
                    <td className="p-3"><span className="text-green-700 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 font-semibold">Track Active</span></td>
                  </tr>
                </table>
              </div>
            </div>
          </FadeUp>
        )}

        {currentTab === "org-control" && !isAdmin && (
          <FadeUp delay={100}>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-serif font-bold text-teal-dark text-base mb-2">Global Operations Control Parameters</h3>
              <p className="text-sm text-muted-text mb-4">Super-Admin architectural controls to override master tracking matrix synchronization intervals.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Global Lock-out Triggers", desc: "Enforces a global read-only freeze context across all student profiles.", btn: "Deploy Master Freeze", btnCls: "bg-red-status text-white" },
                  { title: "COM Scheduling Integration", desc: "Triggers automated background cron compilation tasks matching COM master records.", btn: "Force COM Sync", btnCls: "bg-teal-dark text-white" },
                ].map((c, i) => (
                  <div key={c.title} className="p-4 border border-border bg-secondary/20 rounded-xl"
                    style={{ opacity: 0, animation: "fadeInRow 0.35s ease forwards", animationDelay: `${i * 80}ms` }}>
                    <div className="text-sm font-bold text-teal-dark mb-1">{c.title}</div>
                    <div className="text-xs text-muted-text mb-3">{c.desc}</div>
                    <button className={`px-3 py-1.5 ${c.btnCls} text-xs font-bold rounded-lg hover:opacity-90`}>{c.btn}</button>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        )}

        {currentTab === "audit" && (
          <FadeUp delay={100}>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-serif font-bold text-teal-dark text-base mb-3">Recent Security Access & Mutation Logs</h3>
              <div className="space-y-2 font-mono text-xs">
                {[
                  "[2026-06-12 14:22:01] Verified session tokens via Single Sign On proxy pipeline protocol.",
                  "[2026-06-11 09:15:34] Compiled tracking node sheets for matching session metrics.",
                ].map((log, i) => (
                  <div key={i} className="flex items-start gap-2 text-muted-text py-1.5 border-b border-border/40"
                    style={{ opacity: 0, animation: "fadeInRow 0.35s ease forwards", animationDelay: `${i * 80}ms` }}>
                    <Clock className="w-3.5 h-3.5 mt-0.5 text-teal shrink-0" />
                    <div><span className="text-foreground font-semibold">{log.split("]")[0]}]</span>{log.split("]")[1]}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        )}
      </div>
    </div>
  );
}