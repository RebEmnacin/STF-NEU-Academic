import { usePortal } from "./PortalContext";
import {
  X, Lock, Plus, Search, ChevronLeft, ChevronRight,
  Pencil, Trash2, ExternalLink, GripVertical,
  BookOpen, BookMarked, Users, Tv2, Calendar,
  Home, School, Clock, MapPin,
  CheckCircle2, FileText, MessageCircle, Send,
  Bell, Shield, Eye, EyeOff, Save, Sun, Moon, Monitor,
  Mail, Hash, Star, AlertCircle, Info, CheckCircle, XCircle,
  UserCircle, Building2, Activity
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

// ─── Deep-link signal for dashboard → schedule navigation ─────────────────────
export const scheduleDeepLink: {
  scheduleTab?: "manage" | "comprehensive";
  comprehensiveTab?: "major" | "ge" | "panata" | "stf" | "personal" | "institutional";
} = {};

// ─── Fade-up animation hook ───────────────────────────────────────────────────
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
      transform: visible ? "translateY(0)" : "translateY(18px)",
      transition: "opacity 0.45s ease, transform 0.45s ease",
    }}>
      {children}
    </div>
  );
}

// ─── Calendar data (November 2023) ────────────────────────────────────────────
type DayEvt = { label: string; color: string };
const calData: Record<number, { events: DayEvt[]; deadline?: boolean }> = {
  1:  { events:[{label:"MS Lab 10AM",color:"major"},{label:"Panata Prep",color:"panata"},{label:"Personal Study",color:"personal"}]},
  2:  { events:[{label:"Art Appreciation",color:"ge"},{label:"Panata Sync 1PM",color:"panata"}], deadline:true},
  3:  { events:[{label:"OOP Lecture 7PM",color:"major"},{label:"Personal Study",color:"personal"}], deadline:true},
  4:  { events:[{label:"Adv Statistics 7AM",color:"major"},{label:"OOP Lab 10AM",color:"major"},{label:"Sosyedad 1:30PM",color:"ge"}], deadline:true},
  5:  { events:[{label:"PE4 3PM",color:"ge"},{label:"Personal Study",color:"personal"}]},
  6:  { events:[{label:"Networking Lab 7AM",color:"major"},{label:"DGA Training 5:30PM",color:"team"}]},
  7:  { events:[{label:"MS Lab",color:"major"},{label:"Komiti 4PM",color:"panata"},{label:"Video Team",color:"team"}]},
  8:  { events:[{label:"Art Appreciation",color:"ge"},{label:"Panata Sync 1PM",color:"panata"}], deadline:true},
  9:  { events:[{label:"OOP Lecture",color:"major"},{label:"Panata Prep",color:"panata"}]},
  10: { events:[{label:"Adv Statistics",color:"major"},{label:"OOP Lab",color:"major"}]},
  11: { events:[{label:"PE4",color:"ge"}]},
  12: { events:[{label:"Networking Lab",color:"major"},{label:"DGA Training",color:"team"}]},
  13: { events:[{label:"Tupad 6:45AM",color:"panata"},{label:"Pulong Panata 2:30PM",color:"panata"}]},
  14: { events:[{label:"MS Lab",color:"major"},{label:"Personal Study",color:"personal"}]},
  15: { events:[{label:"Art Appreciation",color:"ge"}]},
  16: { events:[{label:"OOP Lecture",color:"major"}]},
  17: { events:[{label:"Adv Statistics",color:"major"},{label:"OOP Lab",color:"major"},{label:"Sosyedad",color:"ge"}]},
  18: { events:[{label:"PE4",color:"ge"},{label:"Video Team",color:"team"},{label:"Personal Time",color:"personal"}]},
  19: { events:[{label:"DGA Training",color:"team"},{label:"Panata Prep",color:"panata"}], deadline:true},
  20: { events:[{label:"Tupad",color:"panata"},{label:"Pulong Panata",color:"panata"}]},
  21: { events:[{label:"MS Lab",color:"major"},{label:"Panata Prep",color:"panata"},{label:"Personal Study",color:"personal"}], deadline:true},
  22: { events:[{label:"Art Appreciation",color:"ge"},{label:"Panata Sync",color:"panata"},{label:"Personal Study",color:"personal"}], deadline:true},
  23: { events:[{label:"OOP Lecture",color:"major"},{label:"Panata Prep",color:"panata"}], deadline:true},
  24: { events:[{label:"Adv Statistics",color:"major"},{label:"Engineering Lab",color:"team"},{label:"Personal Time",color:"personal"}], deadline:true},
  25: { events:[{label:"PE4",color:"ge"},{label:"Panata Prep",color:"panata"},{label:"Personal Study",color:"personal"}]},
  26: { events:[{label:"DGA Training",color:"team"}]},
  27: { events:[{label:"MS Lab",color:"major"},{label:"Panata Prep",color:"panata"},{label:"Personal Study",color:"personal"}]},
  28: { events:[{label:"Art Appreciation",color:"ge"}]},
  29: { events:[{label:"OOP Lecture",color:"major"},{label:"Panata Prep",color:"panata"},{label:"Personal Study",color:"personal"}], deadline:true},
  30: { events:[{label:"Adv Statistics",color:"major"},{label:"Library Study",color:"personal"}], deadline:true},
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// ─── Student Dashboard ────────────────────────────────────────────────────────
export function StudentDashboard() {
  const { setDrawerDay, setView } = usePortal();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const summaryCards = [
    { count: 2, period: "today",     category: "Major Subjects",  Icon: BookOpen,   bg: "bg-teal",         scheduleTab: "comprehensive" as const, comprehensiveTab: "major"       as const },
    { count: 3, period: "this week", category: "GE Subjects",     Icon: BookMarked, bg: "bg-teal-light",   scheduleTab: "comprehensive" as const, comprehensiveTab: "ge"          as const },
    { count: 2, period: "upcoming",  category: "Panata Duties",   Icon: Users,      bg: "bg-gold",         scheduleTab: "comprehensive" as const, comprehensiveTab: "panata"      as const },
    { count: 1, period: "practice",  category: "STF Activities",  Icon: Tv2,        bg: "bg-slate-blue",   scheduleTab: "comprehensive" as const, comprehensiveTab: "stf"         as const },
    { count: 3, period: "this week", category: "Upcoming Events", Icon: Calendar,   bg: "bg-amber-status", scheduleTab: "comprehensive" as const, comprehensiveTab: "institutional" as const },
  ];

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">Dashboard</h1>
            <p className="text-sm text-muted-text mt-1">{MONTHS[month]} {year} — Calendar View</p>
          </div>
          <span className="chip bg-teal-soft text-teal text-sm px-3 py-1">Student View</span>
        </div>
      </FadeUp>

      {/* Summary strip — clickable, links to relevant tabs */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {summaryCards.map((c, i) => (
          <FadeUp key={c.category} delay={i * 60}>
            <button
              onClick={() => {
                scheduleDeepLink.scheduleTab = c.scheduleTab;
                scheduleDeepLink.comprehensiveTab = c.comprehensiveTab;
                setView("schedule");
              }}
              className={`${c.bg} rounded-xl px-4 py-3 flex items-center gap-3 w-full text-left hover:opacity-90 active:scale-95 transition-all`}
              style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.14)" }}
            >
              <c.Icon className="w-7 h-7 text-white/80 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif font-bold text-white text-2xl leading-none">{c.count}</span>
                  <span className="text-white/80 text-xs font-medium">{c.period}</span>
                </div>
                <div className="text-white/70 text-[11px] font-medium mt-0.5 truncate">{c.category}</div>
              </div>
            </button>
          </FadeUp>
        ))}
      </div>

      {/* Calendar nav */}
      <FadeUp delay={350}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            className="p-2 border border-border rounded-lg hover:bg-secondary transition">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-serif font-bold text-teal-dark text-lg min-w-[180px] text-center">
            {MONTHS[month]} {year}
          </span>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            className="p-2 border border-border rounded-lg hover:bg-secondary transition">
            <ChevronRight className="w-4 h-4" />
          </button>
          <select value={month} onChange={e => setCurrentDate(new Date(year, Number(e.target.value), 1))}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-card">
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select value={year} onChange={e => setCurrentDate(new Date(Number(e.target.value), month, 1))}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-card">
            {Array.from({ length: 11 }, (_, i) => 2020 + i).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button onClick={() => setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1))}
            className="ml-auto text-sm font-semibold text-teal border border-teal/40 px-4 py-1.5 rounded-lg hover:bg-teal hover:text-white transition">
            Today
          </button>
        </div>

        <div className="educ-calendar-grid">
          {DAYS_SHORT.map(d => <div key={d} className="educ-day-label">{d}</div>)}
          {Array.from({ length: totalCells }).map((_, i) => {
            const day = i - startOffset + 1;
            const valid = day >= 1 && day <= daysInMonth;
            const data = valid ? calData[day] : undefined;
            const isToday = valid && day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            return (
              <div key={i}
                onClick={() => valid && setDrawerDay(`${MONTHS[month]} ${day}, ${year}`)}
                className={`educ-date-cell${!valid ? " empty" : ""}${isToday ? " today" : ""}`}>
                {valid && (<>
                  {data?.deadline && <span className="educ-deadline-dot" />}
                  <div className="educ-day-num">{day}</div>
                  <div className="space-y-0.5">
                    {(data?.events ?? []).map((e, j) => (
                      <span key={j} className={`educ-chip ${e.color}`}>{e.label}</span>
                    ))}
                  </div>
                </>)}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-5 mt-4 text-sm text-muted-text">
          {[
            { label: "Major", cls: "bg-teal" }, { label: "GE", cls: "bg-teal-light" },
            { label: "Panata", cls: "bg-gold" }, { label: "STF Team", cls: "bg-slate-blue" },
            { label: "Personal", cls: "bg-muted" },
          ].map(l => (
            <span key={l.label} className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded ${l.cls} inline-block`} /> {l.label}
            </span>
          ))}
          <span className="ml-auto flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-status inline-block" /> Pending task deadline
          </span>
        </div>
      </FadeUp>
    </div>
  );
}

// ─── Day Drawer ────────────────────────────────────────────────────────────────
const dayScheduleMap: Record<string, { start: number; time: string; label: string; venue: string; locked: boolean }[]> = {
  Monday:    [
    { start:10, time:"10:00–13:00", label:"MS Lab",                venue:"M415 A",        locked:true  },
    { start:16, time:"16:00–16:30", label:"Komiti",                venue:"Sagana Condo",  locked:true  },
    { start:19, time:"19:00–21:00", label:"MS Lecture",            venue:"M415 A",        locked:true  },
  ],
  Tuesday:   [
    { start:11, time:"11:30–13:00", label:"Art Appreciation",      venue:"M414 B",        locked:true  },
    { start:15, time:"15:00–16:30", label:"Video Team Practice",   venue:"Main Studio",   locked:true  },
  ],
  Wednesday: [
    { start:15, time:"15:00–16:00", label:"Library Study Block",   venue:"Library Pod 4", locked:false },
    { start:19, time:"19:00–21:00", label:"OOP Lecture",           venue:"M411 A",        locked:true  },
  ],
  Thursday:  [
    { start:7,  time:"07:00–10:00", label:"Advanced Statistics",   venue:"M413 B",        locked:true  },
    { start:10, time:"10:00–13:00", label:"OOP Lab",               venue:"M102",          locked:true  },
    { start:13, time:"13:30–15:00", label:"Sosyedad at Literatura", venue:"IS 233 B",     locked:true  },
    { start:17, time:"17:00–18:00", label:"Church Prep Block",     venue:"Home",          locked:false },
  ],
  Friday:    [
    { start:7,  time:"07:00–10:00", label:"Advanced Statistics",   venue:"M413 B",        locked:true  },
    { start:10, time:"10:00–11:00", label:"Personal Review",       venue:"Room 101",      locked:false },
    { start:15, time:"15:00–17:00", label:"PE4",                   venue:"IS 234 B",      locked:true  },
  ],
  Saturday:  [
    { start:7,  time:"07:00–10:00", label:"Networking Concepts Lab",venue:"M106",         locked:true  },
    { start:10, time:"10:00–11:30", label:"DAA",                   venue:"M414 B",        locked:true  },
    { start:17, time:"17:30–19:00", label:"DGA Multimedia Training",venue:"M411 A",       locked:true  },
  ],
  Sunday:    [
    { start:7,  time:"06:45–10:00", label:"Tupad",                 venue:"Sagana Homes 1",locked:true  },
    { start:14, time:"14:30–15:00", label:"Pulong Panata",         venue:"Church",        locked:true  },
  ],
};
const DOW_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

export function DayDrawer() {
  const { drawerDay, setDrawerDay, setView } = usePortal();
  if (!drawerDay) return null;
  const parsed = new Date(drawerDay);
  const dowName = DOW_NAMES[parsed.getDay()];
  const blocks = dayScheduleMap[dowName] ?? [];
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setDrawerDay(null)}>
      <div className="absolute inset-0 bg-black/30" />
      <div onClick={e => e.stopPropagation()}
        className="relative bg-background w-[55%] max-w-4xl h-full overflow-y-auto shadow-2xl border-l border-border animate-in slide-in-from-right">
        <div className="grid grid-cols-12 h-full">
          <div className="col-span-8 border-r border-border p-6">
            <h3 className="font-serif font-bold text-teal-dark mb-4 text-lg">Hourly Timeline · {drawerDay}</h3>
            <div className="space-y-1">
              {Array.from({ length: 17 }).map((_, i) => {
                const hour = 6 + i;
                const block = blocks.find(b => b.start === hour);
                return (
                  <div key={i} className="flex gap-3 min-h-[48px] border-t border-border/40 pt-1.5">
                    <div className="w-16 text-xs text-muted-text font-mono shrink-0 pt-0.5">{String(hour).padStart(2,"0")}:00</div>
                    {block && (
                      <div className={`flex-1 rounded-lg p-2.5 text-sm ${block.locked ? "bg-teal/10 border border-teal/30" : "bg-gold/10 border border-gold/50"}`}>
                        <div className="font-semibold flex items-center justify-between gap-2">
                          <span className="flex items-center gap-2">
                            {block.label}
                            {block.locked && <Lock className="w-3.5 h-3.5 text-teal" />}
                          </span>
                          <button onClick={() => { setDrawerDay(null); setView("schedule"); }}
                            className="flex items-center gap-1 text-xs text-teal font-semibold hover:underline shrink-0">
                            <ExternalLink className="w-3 h-3" /> View
                          </button>
                        </div>
                        <div className="text-muted-text text-xs mt-0.5 flex items-center gap-1.5">
                          <MapPin className="w-3 h-3" />{block.venue} · {block.time}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-span-4 p-6 bg-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-serif font-bold text-teal-dark">{drawerDay}</h3>
                <p className="text-sm text-muted-text">{dowName}</p>
              </div>
              <button onClick={() => setDrawerDay(null)} className="hover:bg-secondary rounded-lg p-1.5">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-5">
              <div className="text-sm text-muted-text mb-2">{blocks.length} scheduled</div>
              <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-status rounded-full" style={{ width: "65%" }} />
              </div>
            </div>
            <div className="space-y-3">
              {blocks.length === 0
                ? <p className="text-sm text-muted-text">No scheduled items for this day.</p>
                : blocks.map(b => (
                  <div key={b.label} className="border-b border-border pb-3">
                    <div className="text-sm font-semibold">{b.label}</div>
                    <div className="text-xs text-muted-text mt-0.5">{b.venue} · {b.time}</div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className={`chip text-xs ${b.locked ? "bg-teal text-white" : "bg-gold text-teal-dark"}`}>
                        {b.locked ? "System" : "Manual"}
                      </span>
                      <button onClick={() => { setDrawerDay(null); setView("schedule"); }}
                        className="text-xs text-teal font-semibold hover:underline flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> Comprehensive
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Schedule Management ──────────────────────────────────────────────────────
const HOURS = Array.from({ length: 16 }, (_, i) => i + 6);
const BLOCK_COLORS = ["#1B6B8F","#4A8FA8","#F5C518","#2ECC71","#9B59B6","#E74C3C","#F39C12","#5A6C7D"];
const BLOCK_TYPES  = ["major","ge","duty","personal","church","team"];
type Block = { id: number; title: string; day: number; start: string; end: string; type: string; color: string; location: string };

const initialBlocks: Block[] = [
  { id:1, title:"Advanced Statistics", day:4, start:"07:00", end:"10:00", type:"major",  color:"#1B6B8F", location:"M413 B" },
  { id:2, title:"OOP Lab",             day:4, start:"10:00", end:"13:00", type:"major",  color:"#1B6B8F", location:"M102" },
  { id:3, title:"Art Appreciation",    day:2, start:"09:00", end:"10:30", type:"ge",     color:"#4A8FA8", location:"IS 233 B" },
  { id:4, title:"Panata Sync",         day:0, start:"14:00", end:"15:00", type:"church", color:"#F5C518", location:"Church" },
  { id:5, title:"Video Team Practice", day:2, start:"15:00", end:"16:30", type:"team",   color:"#5A6C7D", location:"Main Studio" },
  { id:6, title:"PE4",                 day:5, start:"15:00", end:"16:30", type:"ge",     color:"#4A8FA8", location:"Gym" },
];

function fmtHour(h: number) { return h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h-12} PM`; }
function toMins(t: string)  { const [h,m] = t.split(":").map(Number); return h*60+m; }

export function ScheduleView() {
  const today = new Date();
  const [calView, setCalView] = useState<"week"|"month">("week");
  const [blocks, setBlocks]   = useState<Block[]>(initialBlocks);
  const [open, setOpen]       = useState(false);
  const [dragId, setDragId]   = useState<number|null>(null);
  const [longPressId, setLongPressId] = useState<number|null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [form, setForm] = useState({ title:"", day:1, start:"08:00", end:"09:30", type:"major", color:"#1B6B8F", location:"" });
  const [scheduleTab, setScheduleTab] = useState<"manage"|"comprehensive">(() => {
    const t = scheduleDeepLink.scheduleTab ?? "manage";
    scheduleDeepLink.scheduleTab = undefined;
    return t;
  });

  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handleDrop = (dow: number, hour: number) => {
    if (dragId === null) return;
    setBlocks(prev => prev.map(b => {
      if (b.id !== dragId) return b;
      const dur = toMins(b.end) - toMins(b.start);
      const newStart = `${String(hour).padStart(2,"0")}:00`;
      const endTotalMins = hour * 60 + dur;
      const newEnd = `${String(Math.floor(endTotalMins/60)).padStart(2,"0")}:${String(endTotalMins%60).padStart(2,"0")}`;
      return { ...b, day: dow, start: newStart, end: newEnd };
    }));
    setDragId(null);
  };

  const addBlock = () => {
    if (!form.title) return;
    setBlocks(b => [...b, { ...form, id: Date.now() }]);
    setOpen(false);
    setForm({ title:"", day:1, start:"08:00", end:"09:30", type:"major", color:"#1B6B8F", location:"" });
  };

  const WeekView = () => (
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="grid" style={{ gridTemplateColumns:"72px repeat(7,1fr)", background:"var(--color-border)", gap:"1px" }}>
        <div className="bg-teal-dark" />
        {DAYS_SHORT.map((d, i) => {
          const isTod = i === today.getDay() && month === today.getMonth() && year === today.getFullYear();
          return (
            <div key={d} className={`text-white text-xs font-bold uppercase text-center py-3 tracking-widest ${isTod ? "bg-gold text-teal-dark" : "bg-teal-dark"}`}>{d}</div>
          );
        })}
      </div>
      <div className="overflow-y-auto" style={{ maxHeight:520 }}>
        {HOURS.map(hour => (
          <div key={hour} className="grid border-b border-border/40" style={{ gridTemplateColumns:"72px repeat(7,1fr)", minHeight:56 }}>
            <div className="text-right pr-3 pt-1.5 text-xs text-muted-text font-mono border-r border-border">{fmtHour(hour)}</div>
            {DAYS_SHORT.map((_, dow) => {
              const evts = blocks.filter(b => b.day === dow && parseInt(b.start) === hour);
              return (
                <div key={dow}
                  className="border-r border-border/30 p-0.5 transition-colors"
                  onDragOver={e => { e.preventDefault(); e.currentTarget.style.background="rgba(27,107,143,0.07)"; }}
                  onDragLeave={e => { e.currentTarget.style.background=""; }}
                  onDrop={e => { e.currentTarget.style.background=""; handleDrop(dow, hour); }}
                >
                  {evts.map(ev => (
                    <div key={ev.id}
                      draggable={longPressId === ev.id}
                      onPointerDown={() => {
                        longPressTimer.current = setTimeout(() => {
                          setLongPressId(ev.id);
                          setDragId(ev.id);
                        }, 400);
                      }}
                      onPointerUp={() => {
                        if (longPressTimer.current) clearTimeout(longPressTimer.current);
                      }}
                      onPointerCancel={() => {
                        if (longPressTimer.current) clearTimeout(longPressTimer.current);
                      }}
                      onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; setDragId(ev.id); }}
                      onDragEnd={() => { setDragId(null); setLongPressId(null); }}
                      className={`rounded-lg px-2 py-1 mb-0.5 group relative select-none ${dragId===ev.id?"opacity-50 cursor-grabbing":"cursor-pointer"} ${longPressId===ev.id?"cursor-grab":""}`}
                      style={{ background: ev.color }}
                    >
                      <div className="flex items-center gap-1">
                        <GripVertical className="w-3 h-3 text-white/60 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold text-white leading-tight truncate">{ev.title}</div>
                          <div className="text-[10px] text-white/80">{ev.start}–{ev.end}</div>
                        </div>
                      </div>
                      <button onClick={() => setBlocks(b=>b.filter(x=>x.id!==ev.id))}
                        className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  const MonthView = () => {
    const startOffset = new Date(year,month,1).getDay();
    const daysInMonth = new Date(year,month+1,0).getDate();
    const totalCells  = Math.ceil((startOffset+daysInMonth)/7)*7;
    return (
      <div className="educ-calendar-grid">
        {DAYS_SHORT.map(d=><div key={d} className="educ-day-label">{d}</div>)}
        {Array.from({length:totalCells}).map((_,i)=>{
          const day = i-startOffset+1;
          const valid = day>=1&&day<=daysInMonth;
          const dow = i%7;
          const isToday = valid&&day===today.getDate()&&month===today.getMonth()&&year===today.getFullYear();
          const dayBlocks = valid ? blocks.filter(b=>b.day===dow) : [];
          return (
            <div key={i}
              className={`educ-date-cell${!valid?" empty":""}${isToday?" today":""}`}
              onDragOver={e=>{if(valid)e.preventDefault();}}
              onDrop={()=>{if(valid)handleDrop(dow,8);}}>
              {valid&&(<>
                <div className="educ-day-num">{day}</div>
                {dayBlocks.slice(0,2).map(b=>(
                  <span key={b.id}
                    draggable={longPressId === b.id}
                    onPointerDown={()=>{
                      longPressTimer.current = setTimeout(()=>{ setLongPressId(b.id); setDragId(b.id); }, 400);
                    }}
                    onPointerUp={()=>{ if(longPressTimer.current) clearTimeout(longPressTimer.current); }}
                    onPointerCancel={()=>{ if(longPressTimer.current) clearTimeout(longPressTimer.current); }}
                    onDragStart={()=>setDragId(b.id)} onDragEnd={()=>{ setDragId(null); setLongPressId(null); }}
                    className="educ-chip cursor-pointer select-none" style={{background:b.color,color:"#fff"}}>{b.title}</span>
                ))}
                {dayBlocks.length>2&&<span className="text-[10px] text-muted-text">+{dayBlocks.length-2} more</span>}
              </>)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-7">
      <FadeUp>
        {/* Sub-tabs */}
        <div className="flex gap-0 border-b border-border mb-6 overflow-x-auto">
          {([
            { id:"manage" as const, label:"Schedule" },
            { id:"comprehensive" as const, label:"Comprehensive View" },
          ]).map(t => (
            <button key={t.id} onClick={() => setScheduleTab(t.id)}
              className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${
                scheduleTab === t.id ? "border-teal-dark text-teal-dark" : "border-transparent text-foreground/50 hover:text-teal-dark hover:border-teal/40"
              }`}>{t.label}</button>
          ))}
        </div>
      </FadeUp>

      {scheduleTab === "comprehensive" && <ScheduleViewComprehensive />}

      {scheduleTab === "manage" && (<>
      <FadeUp>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">Schedule Management</h1>
            <p className="text-sm text-muted-text mt-1 flex items-center gap-1.5">
              <GripVertical className="w-4 h-4" /> Drag events to reschedule · Click <strong>Add Block</strong> to create new entries
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border border-border rounded-xl overflow-hidden text-sm font-bold">
              {(["month","week"] as const).map(v=>(
                <button key={v} onClick={()=>setCalView(v)}
                  className={`px-5 py-2 capitalize transition-colors ${calView===v?"bg-teal text-white":"bg-card text-foreground/70 hover:bg-secondary"}`}>
                  {v}
                </button>
              ))}
            </div>
            <button onClick={()=>setCurrentDate(new Date(today.getFullYear(),today.getMonth(),1))}
              className="text-sm font-semibold text-teal border border-teal/40 px-4 py-2 rounded-xl hover:bg-teal hover:text-white transition">
              Today
            </button>
            <button onClick={()=>setOpen(true)}
              className="flex items-center gap-2 bg-teal text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-teal-dark transition">
              <Plus className="w-4 h-4" /> Add Block
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <button onClick={()=>setCurrentDate(new Date(year,month-1,1))} className="p-2 border border-border rounded-lg hover:bg-secondary">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-serif font-bold text-teal-dark min-w-[160px] text-center text-base">{MONTHS[month]} {year}</span>
          <button onClick={()=>setCurrentDate(new Date(year,month+1,1))} className="p-2 border border-border rounded-lg hover:bg-secondary">
            <ChevronRight className="w-4 h-4" />
          </button>
          <select value={month} onChange={e=>setCurrentDate(new Date(year,Number(e.target.value),1))} className="text-sm border border-border rounded-lg px-3 py-1.5 bg-card ml-2">
            {MONTHS.map((m,i)=><option key={m} value={i}>{m}</option>)}
          </select>
          <select value={year} onChange={e=>setCurrentDate(new Date(Number(e.target.value),month,1))} className="text-sm border border-border rounded-lg px-3 py-1.5 bg-card">
            {Array.from({length:11},(_,i)=>2020+i).map(y=><option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {calView === "week" ? <WeekView /> : <MonthView />}

        <div className="flex flex-wrap gap-5 mt-4 text-sm text-muted-text">
          {[["Major","#1B6B8F"],["GE Subject","#4A8FA8"],["Church","#F5C518"],["Team","#5A6C7D"],["Personal","#9B59B6"]].map(([l,c])=>(
            <span key={l} className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded inline-block" style={{background:c}}/>{l}</span>
          ))}
        </div>
      </FadeUp>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={()=>setOpen(false)}>
          <div className="bg-card rounded-2xl border border-border p-7 w-[460px] shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-serif font-bold text-teal-dark text-xl">Add Schedule Block</h2>
              <button onClick={()=>setOpen(false)} className="hover:bg-secondary rounded-lg p-1.5"><X className="w-5 h-5"/></button>
            </div>
            <div className="space-y-3.5">
              <input placeholder="Title *" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-teal/30 outline-none"/>
              <div className="grid grid-cols-2 gap-3">
                <select value={form.day} onChange={e=>setForm(f=>({...f,day:Number(e.target.value)}))} className="border border-border rounded-xl px-4 py-2.5 text-sm bg-background">
                  {["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map((d,i)=><option key={d} value={i}>{d}</option>)}
                </select>
                <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} className="border border-border rounded-xl px-4 py-2.5 text-sm bg-background">
                  {BLOCK_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-text mb-1 block font-medium">Start</label>
                  <input type="time" value={form.start} onChange={e=>setForm(f=>({...f,start:e.target.value}))} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background"/></div>
                <div><label className="text-xs text-muted-text mb-1 block font-medium">End</label>
                  <input type="time" value={form.end} onChange={e=>setForm(f=>({...f,end:e.target.value}))} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background"/></div>
              </div>
              <input placeholder="Location (optional)" value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))}
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background"/>
              <div>
                <div className="text-xs text-muted-text mb-2 font-medium">Color</div>
                <div className="flex gap-2 flex-wrap">
                  {BLOCK_COLORS.map(c=>(
                    <button key={c} onClick={()=>setForm(f=>({...f,color:c}))} className="w-8 h-8 rounded-full transition-transform hover:scale-110"
                      style={{background:c, outline:form.color===c?"3px solid #0D4A6B":"2px solid transparent", outlineOffset:"2px"}}/>
                  ))}
                </div>
              </div>
              <button onClick={addBlock} disabled={!form.title}
                className="w-full bg-teal text-white py-3 rounded-xl font-bold text-sm hover:bg-teal-dark transition disabled:opacity-50">
                Save Block
              </button>
            </div>
          </div>
        </div>
      )}
      </>)}
    </div>
  );
}

export function ScheduleModal() { return null; }

// ─── Comprehensive Schedule View ──────────────────────────────────────────────
type ScheduleEntry = { day: string; timeSlot: string; label: string; venue: string; sourceType: string; editable?: boolean };
type TabId = "major"|"ge"|"panata"|"stf"|"personal"|"institutional";
type PanataCategory = "lokal"|"stf"|"pulong";
const PAGE_SIZE = 7;

const allScheduleEntries: Record<string, ScheduleEntry[]> = {
  major: [
    {day:"MON",timeSlot:"10:00–13:00",label:"MS Lab",venue:"M415 A",sourceType:"System (MAJOR)"},
    {day:"MON",timeSlot:"19:00–21:00",label:"MS Lecture",venue:"M415 A",sourceType:"System (MAJOR)"},
    {day:"THU",timeSlot:"07:00–10:00",label:"Advanced Statistics",venue:"M413 B",sourceType:"System (MAJOR)"},
    {day:"THU",timeSlot:"10:00–13:00",label:"OOP Lab",venue:"M102",sourceType:"System (MAJOR)"},
    {day:"WED",timeSlot:"19:00–21:00",label:"OOP Lecture",venue:"M411 A",sourceType:"System (MAJOR)"},
    {day:"SAT",timeSlot:"07:00–10:00",label:"Networking Concepts Lab",venue:"M106",sourceType:"System (MAJOR)"},
    {day:"SAT",timeSlot:"19:00–21:00",label:"Networking Concepts Lec",venue:"M413 A",sourceType:"System (MAJOR)"},
    {day:"TUE",timeSlot:"10:00–13:00",label:"Info Management Lab",venue:"M415 B",sourceType:"System (MAJOR)"},
    {day:"TUE",timeSlot:"13:00–15:00",label:"Info Management Lec",venue:"M411 B",sourceType:"System (MAJOR)"},
    {day:"FRI",timeSlot:"07:00–10:00",label:"Advanced Calculus",venue:"M41B",sourceType:"System (MAJOR)"},
    {day:"FRI",timeSlot:"10:00–11:00",label:"Discrete Structures",venue:"M41-B",sourceType:"System (MAJOR)"},
    {day:"WED",timeSlot:"14:30–16:00",label:"Filipino sa Ibat Ibang Disiplina",venue:"M412",sourceType:"System (MAJOR)"},
  ],
  ge: [
    {day:"TUE",timeSlot:"11:30–13:00",label:"Art Appreciation",venue:"M414 B",sourceType:"System (GE)"},
    {day:"THU",timeSlot:"13:30–15:00",label:"Sosyedad at Literatura",venue:"IS 233 B",sourceType:"System (GE)"},
    {day:"FRI",timeSlot:"15:00–17:00",label:"PE4",venue:"IS 234 B",sourceType:"System (GE)"},
    {day:"SAT",timeSlot:"10:00–11:30",label:"DAA",venue:"M414 B",sourceType:"System (GE)"},
    {day:"MON",timeSlot:"16:00–17:30",label:"The Life & Works of Rizal",venue:"TBA",sourceType:"System (GE)"},
    {day:"WED",timeSlot:"08:30–10:00",label:"Science, Tech & Society",venue:"TBA",sourceType:"System (GE)"},
    {day:"THU",timeSlot:"13:00–16:00",label:"The Contemporary World",venue:"TBA",sourceType:"System (GE)"},
    {day:"WED",timeSlot:"10:00–12:00",label:"Individual/Dual Sports",venue:"TBA",sourceType:"System (GE)"},
  ],
  panata: [
    {day:"SUN",timeSlot:"06:45–10:00",label:"Tupad",venue:"Sagana Homes 1",sourceType:"System (PANATA)"},
    {day:"SUN",timeSlot:"14:30–15:00",label:"Pulong Panata",venue:"Church",sourceType:"System (PANATA)"},
    {day:"MON",timeSlot:"16:00–16:30",label:"Komiti",venue:"Sagana Condo Bldg 1",sourceType:"System (PANATA)"},
    {day:"FRI",timeSlot:"16:00–17:30",label:"CICS1 Panata",venue:"Sagana Homes 1",sourceType:"System (PANATA)"},
    {day:"SAT",timeSlot:"06:45–10:00",label:"CICS2 Panata",venue:"Sagana Condo Bldg 1",sourceType:"System (PANATA)"},
    {day:"SAT",timeSlot:"10:00–12:00",label:"CICS3 Panata",venue:"Church Main Hall",sourceType:"System (PANATA)"},
  ],
  stf: [
    {day:"SAT",timeSlot:"17:30–19:00",label:"DGA Multimedia Training",venue:"M411 A",sourceType:"System (TEAM)"},
    {day:"TUE",timeSlot:"15:00–16:30",label:"Video Team Practice",venue:"Main Studio",sourceType:"System (TEAM)"},
    {day:"THU",timeSlot:"15:00–16:30",label:"Video Team Practice",venue:"Main Studio",sourceType:"System (TEAM)"},
  ],
  personal: [
    {day:"WED",timeSlot:"15:00–16:00",label:"Library Study Block",venue:"Library Pod 4",sourceType:"Manual (PERSONAL)",editable:true},
    {day:"FRI",timeSlot:"10:00–11:00",label:"Personal Review Session",venue:"Room 101",sourceType:"Manual (PERSONAL)",editable:true},
    {day:"THU",timeSlot:"17:00–18:00",label:"Church Prep Block",venue:"Home",sourceType:"Manual (PERSONAL)",editable:true},
    {day:"MON",timeSlot:"18:00–19:00",label:"Personal Reading Block",venue:"Library Pod 2",sourceType:"Manual (PERSONAL)",editable:true},
  ],
  institutional: [
    {day:"Nov 2",timeSlot:"13:00–15:00",label:"STF-NEU Choir Orientation Batch 1",venue:"IS Bldg B, Room 234",sourceType:"System (EVENT)"},
    {day:"Nov 8",timeSlot:"09:00–10:30",label:"CBI Peer Counseling Seminar",venue:"Google Meet",sourceType:"System (EVENT)"},
    {day:"Nov 12",timeSlot:"14:00–15:30",label:"DGA Sync Meeting",venue:"IS Bldg B, 236",sourceType:"System (EVENT)"},
  ],
};

const panataCategories: { id: PanataCategory; title: string; subtitle: string; Icon: any; color: string }[] = [
  { id:"lokal",  title:"Panata sa Lokal",           subtitle:"Barangay-level nga mga panata",     Icon:Home,   color:"from-teal-dark to-teal" },
  { id:"stf",    title:"STF Panata Groups",          subtitle:"CICS1, CICS2 & CICS3 group duties", Icon:Users,  color:"from-teal to-teal-light" },
  { id:"pulong", title:"Organization Pulong Panata", subtitle:"Broader school organization duties",Icon:School, color:"from-slate-blue to-teal" },
];

const panataTableEntries: Record<PanataCategory, { day:string; timeSlot:string; label:string; venue:string; editable?:boolean }[]> = {
  lokal: [
    {day:"SUN",timeSlot:"06:45–10:00",label:"Tupad",venue:"Sagana Homes 1"},
    {day:"MON",timeSlot:"16:00–16:30",label:"Komiti",venue:"Sagana Condo Bldg 1"},
  ],
  stf: [
    {day:"FRI",timeSlot:"16:00–17:30",label:"CICS1 Panata",venue:"Sagana Homes 1"},
    {day:"SAT",timeSlot:"06:45–10:00",label:"CICS2 Panata",venue:"Sagana Condo Bldg 1"},
    {day:"SAT",timeSlot:"10:00–12:00",label:"CICS3 Panata",venue:"Church Main Hall"},
    {day:"TUE",timeSlot:"15:00–16:30",label:"Video Team Worship Prep",venue:"Main Studio"},
    {day:"THU",timeSlot:"15:00–16:30",label:"Video Team Panata Sync",venue:"Main Studio"},
    {day:"SAT",timeSlot:"17:30–19:00",label:"DGA Group Panata Meeting",venue:"M411 A"},
  ],
  pulong: [
    {day:"SUN",timeSlot:"14:30–15:00",label:"Pulong Panata",venue:"Church"},
    {day:"MON",timeSlot:"14:00–15:30",label:"General Org Pulong",venue:"IS Bldg B, Room 234"},
    {day:"WED",timeSlot:"12:00–13:00",label:"School Org Coordination",venue:"Google Meet"},
  ],
};

type AddScheduleForm = { day:string; timeSlot:string; label:string; venue:string };
const DAYS_OF_WEEK = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

function AddScheduleModal({ onClose, onSave }: { onClose:()=>void; onSave:(e:AddScheduleForm)=>void }) {
  const [form, setForm] = useState<AddScheduleForm>({day:"MON",timeSlot:"08:00–09:00",label:"",venue:""});
  const valid = form.label.trim() && form.venue.trim();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-card rounded-2xl border border-border p-7 w-[460px] shadow-2xl" onClick={e=>e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-serif font-bold text-teal-dark text-xl">Add Schedule</h2>
          <button onClick={onClose} className="hover:bg-secondary rounded-lg p-1.5"><X className="w-5 h-5"/></button>
        </div>
        <div className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-muted-text uppercase tracking-wider mb-1.5 block">Day</label>
            <select value={form.day} onChange={e=>setForm(f=>({...f,day:e.target.value}))}
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background outline-none">
              {DAYS_OF_WEEK.map(d=><option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-text uppercase tracking-wider mb-1.5 block">Time Slot</label>
            <input value={form.timeSlot} onChange={e=>setForm(f=>({...f,timeSlot:e.target.value}))} placeholder="e.g. 08:00–10:00"
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-teal/30 outline-none"/>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-text uppercase tracking-wider mb-1.5 block">Schedule Label *</label>
            <input value={form.label} onChange={e=>setForm(f=>({...f,label:e.target.value}))} placeholder="e.g. Advanced Statistics"
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-teal/30 outline-none"/>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-text uppercase tracking-wider mb-1.5 block">Venue *</label>
            <input value={form.venue} onChange={e=>setForm(f=>({...f,venue:e.target.value}))} placeholder="e.g. M415 A"
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-teal/30 outline-none"/>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition">Cancel</button>
            <button onClick={()=>valid&&onSave(form)} disabled={!valid}
              className="flex-1 py-2.5 rounded-xl bg-teal-dark text-white text-sm font-semibold hover:bg-teal transition disabled:opacity-40">
              Save Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const COURSE_CODE_MAP: Record<string, string> = {
  "MS Lab":"IT331","MS Lecture":"IT331","OOP Lab":"IT312","OOP Lecture":"IT312L",
  "Networking Concepts Lab":"IT321","Networking Concepts Lec":"IT321L",
  "Advanced Statistics":"MATH31","Advanced Calculus":"MATH21",
  "Info Management Lab":"IT315","Info Management Lec":"IT315L",
  "Discrete Structures":"CS201","Filipino sa Ibat Ibang Disiplina":"FIL101",
  "Art Appreciation":"GE101","Sosyedad at Literatura":"GE102","PE4":"PE4",
  "DAA":"GE201","The Life & Works of Rizal":"GE301","Science, Tech & Society":"GE302",
  "The Contemporary World":"GE303","Individual/Dual Sports":"PE5",
  "DGA Multimedia Training":"STF-DGA","Video Team Practice":"STF-VT",
  "Tupad":"PAN-TUP","Pulong Panata":"PAN-PUL","Komiti":"PAN-KOM",
  "CICS1 Panata":"PAN-C1","CICS2 Panata":"PAN-C2","CICS3 Panata":"PAN-C3",
};

function ScheduleTable({ rows, showSourceType=true, showCode=true, onDelete }: {
  rows: (ScheduleEntry&{id?:number})[]; showSourceType?:boolean; showCode?:boolean; onDelete?:(i:number)=>void;
}) {
  const colSpan = [4, showCode?1:0, showSourceType?1:0, 1].reduce((a,b)=>a+b, 0);
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden" style={{boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-teal-dark text-white text-xs uppercase tracking-wider">
            <th className="px-5 py-3.5 text-left font-semibold w-20">Day</th>
            <th className="px-5 py-3.5 text-left font-semibold w-36">Time Slot</th>
            {showCode && <th className="px-5 py-3.5 text-left font-semibold w-24">Code</th>}
            <th className="px-5 py-3.5 text-left font-semibold">Schedule Label</th>
            <th className="px-5 py-3.5 text-left font-semibold">Venue</th>
            {showSourceType && <th className="px-5 py-3.5 text-left font-semibold">Source/Type</th>}
            <th className="px-5 py-3.5 text-left font-semibold w-28">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0
            ? <tr><td colSpan={colSpan} className="px-5 py-12 text-center text-muted-text">No schedules found.</td></tr>
            : rows.map((r,i) => (
              <tr key={i} className={`border-b border-border last:border-0 transition-colors ${i%2===0?"bg-card":"bg-secondary/20"} hover:bg-teal-soft/20`}>
                <td className="px-5 py-3.5">
                  {r.day.length <= 3
                    ? <span className="font-bold text-xs text-teal-dark bg-teal-soft px-2.5 py-1 rounded-lg">{r.day}</span>
                    : <div className="text-center leading-tight">
                        <div className="font-bold text-[10px] text-teal-dark uppercase">{r.day.split(" ")[0]}</div>
                        <div className="font-bold text-sm text-teal-dark leading-none">{r.day.split(" ")[1]}</div>
                      </div>
                  }
                </td>
                <td className="px-5 py-3.5 text-sm text-muted-text font-mono">{r.timeSlot}</td>
                {showCode && (
                  <td className="px-5 py-3.5">
                    {COURSE_CODE_MAP[r.label]
                      ? <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-soft text-teal-dark border border-teal/20 font-mono">{COURSE_CODE_MAP[r.label]}</span>
                      : <span className="text-[11px] text-muted-text/50">—</span>
                    }
                  </td>
                )}
                <td className="px-5 py-3.5 font-medium text-foreground text-sm">{r.label}</td>
                <td className="px-5 py-3.5 text-sm text-muted-text">{r.venue}</td>
                {showSourceType && <td className="px-5 py-3.5 text-xs text-muted-text">{r.sourceType}</td>}
                <td className="px-5 py-3.5">
                  {r.editable
                    ? <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg border border-teal/40 text-teal hover:bg-teal hover:text-white transition" title="Edit"><Pencil className="w-4 h-4"/></button>
                        <button onClick={()=>onDelete?.(i)} className="p-2 rounded-lg border border-red-status/40 text-red-status hover:bg-red-status hover:text-white transition" title="Delete"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    : <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-muted-text hover:border-teal hover:text-teal transition">
                        <Lock className="w-3.5 h-3.5"/> View
                      </button>
                  }
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

export function ScheduleViewComprehensive() {
  const [tab, setTab] = useState<TabId>(() => {
    const t = scheduleDeepLink.comprehensiveTab ?? "major";
    scheduleDeepLink.comprehensiveTab = undefined;
    return t;
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [panataView, setPanataView] = useState<PanataCategory|null>(null);
  const [showModal, setShowModal] = useState(false);
  const [extraRows, setExtraRows] = useState<Record<string,ScheduleEntry[]>>({
    major:[],ge:[],panata:[],stf:[],personal:[],institutional:[],lokal:[],stfPanata:[],pulong:[],
  });

  const handleSave = (form: AddScheduleForm) => {
    const key = panataView ? (panataView==="stf"?"stfPanata":panataView) : tab;
    setExtraRows(prev => ({...prev,[key]:[...(prev[key]||[]),{...form,sourceType:"Manual (PERSONAL)",editable:true}]}));
    setShowModal(false);
  };

  const tabs: {id:TabId;label:string}[] = [
    {id:"major",label:"Major Subjects"},{id:"ge",label:"GE / Minor Subjects"},
    {id:"panata",label:"Panata Groups"},{id:"stf",label:"STF Teams"},
    {id:"personal",label:"Personal Responsibilities"},{id:"institutional",label:"Institutional Events"},
  ];

  const baseRows = tab!=="panata" ? allScheduleEntries[tab] : [];
  const allRows  = [...baseRows,...(extraRows[tab]||[])];
  const filtered = allRows.filter(r =>
    r.label.toLowerCase().includes(search.toLowerCase())||
    r.venue.toLowerCase().includes(search.toLowerCase())||
    r.day.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));
  const pageRows   = filtered.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);

  const handleTabChange = (t:TabId) => { setTab(t); setSearch(""); setPage(1); setPanataView(null); };

  const panataKey = panataView==="stf"?"stfPanata":panataView??"lokal";
  const basePanata = panataView ? panataTableEntries[panataView] : [];
  const allPanata  = [...basePanata,...(extraRows[panataKey]||[])];
  const filtPanata = allPanata.filter(r =>
    r.label.toLowerCase().includes(search.toLowerCase())||
    r.venue.toLowerCase().includes(search.toLowerCase())||
    r.day.toLowerCase().includes(search.toLowerCase())
  );
  const panataPages   = Math.max(1,Math.ceil(filtPanata.length/PAGE_SIZE));
  const panataPageRows = filtPanata.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
  const activeCat = panataCategories.find(c=>c.id===panataView);

  const handleDeleteMain = (i:number) => {
    const row = filtered[(page-1)*PAGE_SIZE+i];
    const baseFiltered = baseRows.filter(r =>
      r.label.toLowerCase().includes(search.toLowerCase())||r.venue.toLowerCase().includes(search.toLowerCase())||r.day.toLowerCase().includes(search.toLowerCase())
    );
    if ((page-1)*PAGE_SIZE+i >= baseFiltered.length)
      setExtraRows(prev=>({...prev,[tab]:prev[tab].filter(r=>r!==row)}));
  };
  const handleDeletePanata = (i:number) => {
    const row = filtPanata[(page-1)*PAGE_SIZE+i];
    const baseFiltered = basePanata.filter(r =>
      r.label.toLowerCase().includes(search.toLowerCase())||r.venue.toLowerCase().includes(search.toLowerCase())||r.day.toLowerCase().includes(search.toLowerCase())
    );
    if ((page-1)*PAGE_SIZE+i >= baseFiltered.length)
      setExtraRows(prev=>({...prev,[panataKey]:prev[panataKey].filter(r=>r!==row)}));
  };

  function Pagination({total,cur,set}:{total:number;cur:number;set:(n:number)=>void}) {
    if (total<=1) return null;
    return (
      <div className="flex items-center justify-end gap-1.5 mt-5">
        <button onClick={()=>set(Math.max(1,cur-1))} disabled={cur===1}
          className="w-8 h-8 rounded-lg border border-border text-sm flex items-center justify-center hover:bg-secondary disabled:opacity-40">
          <ChevronLeft className="w-4 h-4"/>
        </button>
        {Array.from({length:total},(_,i)=>i+1).map(n=>(
          <button key={n} onClick={()=>set(n)}
            className={`w-8 h-8 rounded-lg border text-sm font-semibold transition ${cur===n?"bg-teal-dark text-white border-teal-dark":"border-border hover:bg-secondary"}`}>
            {n}
          </button>
        ))}
        <button onClick={()=>set(Math.min(total,cur+1))} disabled={cur===total}
          className="w-8 h-8 rounded-lg border border-border text-sm flex items-center justify-center hover:bg-secondary disabled:opacity-40">
          <ChevronRight className="w-4 h-4"/>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <FadeUp>
        <div className="mb-2">
          <h1 className="font-serif text-3xl font-bold text-teal-dark">Schedule Management</h1>
          <p className="text-sm text-muted-text mt-1">Date updated: November 2, 2023</p>
        </div>
        <div className="flex gap-0 border-b border-border mb-6 mt-5 overflow-x-auto">
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>handleTabChange(t.id)}
              className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${
                tab===t.id?"border-teal-dark text-teal-dark":"border-transparent text-foreground/50 hover:text-teal-dark hover:border-teal/40"
              }`}>{t.label}</button>
          ))}
        </div>
      </FadeUp>

      {tab==="panata" && (<>
        {!panataView && (
          <FadeUp delay={80}>
            <div className="grid grid-cols-3 gap-5 mt-2" style={{gridAutoRows:"1fr"}}>
              {panataCategories.map((cat,i)=>(
                <FadeUp key={cat.id} delay={i*80}>
                  <button onClick={()=>{setPanataView(cat.id);setSearch("");setPage(1);}}
                    className="w-full aspect-square text-left bg-card border-2 border-border rounded-2xl overflow-hidden hover:border-teal hover:shadow-lg transition-all group flex flex-col"
                    style={{boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
                    <div className={`bg-gradient-to-br ${cat.color} flex-1 flex flex-col items-center justify-center gap-3 p-5`}>
                      <cat.Icon className="w-12 h-12 text-white" strokeWidth={1.5}/>
                      <span className="text-white font-serif font-bold text-lg text-center leading-snug">{cat.title}</span>
                    </div>
                    <div className="px-5 py-3 bg-card">
                      <p className="text-sm text-muted-text">{cat.subtitle}</p>
                      <p className="text-sm text-teal font-semibold mt-1 group-hover:underline">View schedules →</p>
                    </div>
                  </button>
                </FadeUp>
              ))}
            </div>
          </FadeUp>
        )}
        {panataView && (
          <FadeUp>
            <div className="flex items-center gap-2 mb-5">
              <button onClick={()=>{setPanataView(null);setSearch("");setPage(1);}}
                className="flex items-center gap-1.5 text-sm font-semibold text-teal-dark hover:underline">
                <ChevronLeft className="w-4 h-4"/> Panata Groups
              </button>
              <span className="text-muted-text text-sm">/</span>
              <span className="text-sm font-semibold text-foreground">{activeCat?.title}</span>
            </div>
            <div className="flex items-center justify-between mb-5 gap-3">
              <div className="relative w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-text"/>
                <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search schedules..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-teal/30"/>
              </div>
              <button onClick={()=>setShowModal(true)}
                className="flex items-center gap-2 bg-teal-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal transition-colors">
                <Plus className="w-4 h-4"/> Add Schedule
              </button>
            </div>
            <ScheduleTable rows={panataPageRows as ScheduleEntry[]} showSourceType={false} showCode={false} onDelete={handleDeletePanata}/>
            <Pagination total={panataPages} cur={page} set={setPage}/>
          </FadeUp>
        )}
      </>)}

      {tab!=="panata" && (
        <FadeUp delay={60}>
          <div className="flex items-center justify-between mb-5 gap-3">
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-text"/>
              <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search schedules..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-teal/30"/>
            </div>
            <button onClick={()=>setShowModal(true)}
              className="flex items-center gap-2 bg-teal-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal transition-colors">
              <Plus className="w-4 h-4"/> Add Schedule
            </button>
          </div>
          <ScheduleTable rows={pageRows} showSourceType onDelete={handleDeleteMain} showCode={tab==="major"||tab==="ge"}/>
          <Pagination total={totalPages} cur={page} set={setPage}/>
        </FadeUp>
      )}

      {showModal && <AddScheduleModal onClose={()=>setShowModal(false)} onSave={handleSave}/>}
    </div>
  );
}

// ─── Tasks View — redesigned to match boss reference ─────────────────────────
type TaskStatus = "ALL"|"PENDING"|"SUBMITTED"|"GRADED"|"MISSING"|"OVERDUE";

type TaskItem = {
  title: string;
  contextTarget: string;
  deadline: string;
  assignedBy: string;
  priority: "High"|"Medium"|"Low";
  status: Exclude<TaskStatus,"ALL">;
};

const taskData: TaskItem[] = [
  { title:"Task Progress Submissions",      contextTarget:"Video Team 104",  deadline:"Jun 22 2025 1PM",  assignedBy:"Super admin", priority:"High",   status:"PENDING"   },
  { title:"Task Peer Submissions",          contextTarget:"Video Team 104",  deadline:"Jun 21 2025 1PM",  assignedBy:"Super admin", priority:"High",   status:"SUBMITTED" },
  { title:"Task Subjects Choir Orientation",contextTarget:"GE 101-Sec A",    deadline:"Jun 25 2025 1PM",  assignedBy:"Super admin", priority:"High",   status:"SUBMITTED" },
  { title:"Task Progress Choir Meeting",    contextTarget:"GE 101-Sec A",    deadline:"Aug 25 2025 1PM",  assignedBy:"Super admin", priority:"High",   status:"GRADED"    },
  { title:"Task Title Orientation",         contextTarget:"GE 101-Sec A",    deadline:"Jun 21 2025 1PM",  assignedBy:"Super admin", priority:"Medium", status:"GRADED"    },
  { title:"Task Entmancer Barnta",          contextTarget:"GE 101-Sec A",    deadline:"Aug 18 2025 1PM",  assignedBy:"Super admin", priority:"High",   status:"GRADED"    },
  { title:"Task Parents Orientation",       contextTarget:"GE 101-Sec A",    deadline:"Aug 27 2025 1PM",  assignedBy:"Super admin", priority:"Medium", status:"GRADED"    },
  { title:"Task Subjects Choir Meeting",    contextTarget:"GE 101-Sec A",    deadline:"Aug 21 2025 1PM",  assignedBy:"Super admin", priority:"High",   status:"MISSING"   },
  { title:"Task Progress Choir Meeting",    contextTarget:"GE 101-Sec A",    deadline:"Aug 21 2025 1PM",  assignedBy:"Super admin", priority:"High",   status:"MISSING"   },
  { title:"Task Proprets Choir Meeting",    contextTarget:"GE 101-Sec A",    deadline:"Aug 27 2025 1PM",  assignedBy:"Super admin", priority:"High",   status:"OVERDUE"   },
  { title:"Task Proprets Choir Meeting",    contextTarget:"GE 101-Sec A",    deadline:"Jun 22 2025 1PM",  assignedBy:"Super admin", priority:"Medium", status:"OVERDUE"   },
];

const TASKS_PER_PAGE = 6;

const statusStyle: Record<Exclude<TaskStatus,"ALL">, { pill: string; badge: string }> = {
  PENDING:   { pill:"bg-amber-500/15 text-amber-600 border border-amber-300",   badge:"bg-amber-500 text-white" },
  SUBMITTED: { pill:"bg-teal/15 text-teal border border-teal/40",               badge:"bg-teal text-white" },
  GRADED:    { pill:"bg-green-500/15 text-green-700 border border-green-300",    badge:"bg-green-600 text-white" },
  MISSING:   { pill:"bg-red-500/15 text-red-600 border border-red-300",          badge:"bg-red-500 text-white" },
  OVERDUE:   { pill:"bg-red-600/90 text-white border border-red-600",            badge:"bg-red-700 text-white" },
};
const priorityStyle: Record<string, string> = {
  High:   "bg-red-100 text-red-600 border border-red-200",
  Medium: "bg-amber-100 text-amber-600 border border-amber-200",
  Low:    "bg-green-100 text-green-700 border border-green-200",
};

// Donut chart SVG — 2-point linear snake: Point A (green) → Point B (red), linear easing
function DonutChart({ completed, pending, missing }: { completed: number; pending: number; missing: number }) {
  // 2-point linear snake: Point A (green start) draws to Point B (red end), color changes at each segment boundary
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 120); return () => clearTimeout(t); }, []);

  const total = completed + pending + missing;
  const r = 54; const cx = 70; const cy = 70;
  const circ = 2 * Math.PI * r;
  const GAP = 3;
  const compArc = (completed / total) * circ;
  const pendArc = (pending  / total) * circ;
  const missArc = (missing  / total) * circ;
  // Offsets position each segment so they follow each other around the ring
  const compOff = -circ * 0.25;
  const pendOff = compOff - compArc - GAP;
  const missOff = pendOff - pendArc - GAP;

  // Linear easing — no ease-in/out, pure constant speed snake draw from A to B
  const snake = (arc: number, off: number, delay: number) => ({
    strokeDasharray: go ? `${arc - GAP} ${circ - arc + GAP}` : `0 ${circ}`,
    strokeDashoffset: off,
    transition: `stroke-dasharray 0.75s linear ${delay}ms`,
  });

  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      {/* Track ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="18"/>
      {/* Point A — green (completed), draws first */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#22c55e" strokeWidth="18"
        strokeLinecap="round" style={snake(compArc, compOff, 0)}/>
      {/* Colour change — gold (pending), linear continuation */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F5C518" strokeWidth="18"
        strokeLinecap="round" style={snake(pendArc, pendOff, 300)}/>
      {/* Point B — red (missing), final linear draw */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ef4444" strokeWidth="18"
        strokeLinecap="round" style={snake(missArc, missOff, 600)}/>
      {/* Centre label */}
      <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="middle" fontSize="22" fontWeight="bold" fill="#1B6B8F" fontFamily="Sora, sans-serif">{Math.round((completed/total)*100)}%</text>
      <text x={cx} y={cy + 16} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#6b7280" fontFamily="Plus Jakarta Sans, sans-serif">completion</text>
    </svg>
  );
}

export function TasksView({ showAssign = false }: { showAssign?: boolean }) {
  const [activeFilter, setActiveFilter] = useState<TaskStatus>("ALL");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"deadline"|"priority"|"status">("deadline");
  const [page, setPage] = useState(1);
  const [submitted, setSubmitted] = useState<Set<string>>(new Set());
  const [detailTask, setDetailTask] = useState<TaskItem|null>(null);
  const [commentTask, setCommentTask] = useState<TaskItem|null>(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Record<string,string[]>>({});

  const filters: TaskStatus[] = ["ALL","PENDING","SUBMITTED","GRADED","MISSING","OVERDUE"];

  const completed = taskData.filter(t => t.status === "GRADED" || t.status === "SUBMITTED").length;
  const pending   = taskData.filter(t => t.status === "PENDING").length;
  const missing   = taskData.filter(t => t.status === "MISSING" || t.status === "OVERDUE").length;
  const total     = taskData.length;

  const filteredTasks = taskData.filter(t => {
    const matchFilter = activeFilter === "ALL" || t.status === activeFilter;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                        t.contextTarget.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  }).sort((a, b) => {
    if (sortBy === "priority") {
      const pOrder = { High: 0, Medium: 1, Low: 2 };
      return pOrder[a.priority] - pOrder[b.priority];
    }
    if (sortBy === "status") return a.status.localeCompare(b.status);
    return a.deadline.localeCompare(b.deadline);
  });

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / TASKS_PER_PAGE));
  const pageTasks  = filteredTasks.slice((page - 1) * TASKS_PER_PAGE, page * TASKS_PER_PAGE);

  const handleFilterChange = (f: TaskStatus) => { setActiveFilter(f); setPage(1); };

  const handleSubmit = (title: string) => {
    setSubmitted(prev => new Set([...prev, title]));
  };

  const getEffectiveStatus = (t: TaskItem): Exclude<TaskStatus,"ALL"> => {
    if (t.status === "PENDING" && submitted.has(t.title)) return "SUBMITTED";
    return t.status;
  };

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl font-bold text-teal-dark">My Tasks</h1>
          {showAssign && (
            <button className="flex items-center gap-2 bg-teal text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-teal-dark">
              <Plus className="w-4 h-4"/> Assign Task
            </button>
          )}
        </div>
      </FadeUp>

      <div className="flex gap-7">
        {/* ── Left: Task Matrix ── */}
        <FadeUp delay={60} className="shrink-0">
          <div className="bg-card border border-border rounded-2xl p-5 w-60" style={{boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
            <div className="text-xs font-bold text-muted-text uppercase tracking-widest mb-5">Task Matrix</div>

            {/* Donut chart */}
            <div className="flex justify-center mb-4">
              <DonutChart completed={completed} pending={pending} missing={missing}/>
            </div>

            {/* Legend */}
            <div className="space-y-2 mb-5">
              {[
                { label:`COMPLETED (${Math.round((completed/total)*100)}%)`, color:"#22c55e" },
                { label:`PENDING (${Math.round((pending/total)*100)}%)`,     color:"#F5C518" },
                { label:`MISSING (${Math.round((missing/total)*100)}%)`,     color:"#ef4444" },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-2 text-xs text-foreground font-medium">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{background:l.color}}/>
                  {l.label}
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="space-y-1.5 border-t border-border pt-4">
              {[
                { label:"Total Tasks",    value: total  },
                { label:"Due This Week",  value: 15     },
                { label:"Overdue",        value: missing },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-text">{s.label}</span>
                  <span className="text-sm font-bold text-teal-dark">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* ── Right: Task table ── */}
        <div className="flex-1 min-w-0">
          <FadeUp delay={80}>
            {/* Filter tabs */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => handleFilterChange(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                    activeFilter === f
                      ? "bg-teal-dark text-white border-teal-dark"
                      : "bg-card border-border text-foreground/60 hover:border-teal hover:text-teal"
                  }`}
                >
                  {f}
                </button>
              ))}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="ml-auto text-sm border border-border rounded-lg px-3 py-2 bg-card font-medium focus:outline-none focus:ring-2 focus:ring-teal/30"
              >
                <option value="deadline">Sort by Deadline</option>
                <option value="priority">Sort by Priority</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-text"/>
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
            </div>
          </FadeUp>

          {/* Table */}
          <FadeUp delay={120}>
            <div className="bg-card border border-border rounded-xl overflow-hidden" style={{boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-teal-dark text-white text-[11px] uppercase tracking-wider">
                    <th className="px-4 py-3.5 text-left font-semibold">Task Title</th>
                    <th className="px-4 py-3.5 text-left font-semibold w-36">Context Target</th>
                    <th className="px-4 py-3.5 text-left font-semibold w-36">Deadline</th>
                    <th className="px-4 py-3.5 text-left font-semibold w-28">Assigned By</th>
                    <th className="px-4 py-3.5 text-left font-semibold w-24">Priority</th>
                    <th className="px-4 py-3.5 text-left font-semibold w-28">Status</th>
                    <th className="px-4 py-3.5 text-left font-semibold w-32">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageTasks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-muted-text">No tasks found.</td>
                    </tr>
                  ) : pageTasks.map((t, i) => {
                    const effStatus = getEffectiveStatus(t);
                    return (
                      <tr key={i} className={`border-b border-border last:border-0 transition-colors hover:bg-teal-soft/20 ${i%2===0?"bg-card":"bg-secondary/10"}`}>
                        <td className="px-4 py-3.5 font-semibold text-foreground">{t.title}</td>
                        <td className="px-4 py-3.5 text-muted-text text-sm">{t.contextTarget}</td>
                        <td className="px-4 py-3.5 text-muted-text text-sm font-mono">{t.deadline}</td>
                        <td className="px-4 py-3.5 text-sm">{t.assignedBy}</td>
                        <td className="px-4 py-3.5">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${priorityStyle[t.priority]}`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusStyle[effStatus].badge}`}>
                            {effStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setDetailTask(t)}
                              className="p-1.5 rounded-lg border border-border text-muted-text hover:border-teal hover:text-teal hover:bg-teal-soft/20 transition" title="View details">
                              <FileText className="w-3.5 h-3.5"/>
                            </button>
                            <button
                              onClick={() => { setCommentTask(t); setCommentText(""); }}
                              className="p-1.5 rounded-lg border border-border text-muted-text hover:border-slate-blue hover:text-slate-blue hover:bg-slate-blue/10 transition relative" title="Comments">
                              <MessageCircle className="w-3.5 h-3.5"/>
                              {(comments[t.title]?.length ?? 0) > 0 && (
                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-teal text-white text-[9px] font-bold flex items-center justify-center leading-none">
                                  {comments[t.title].length}
                                </span>
                              )}
                            </button>
                            {effStatus === "PENDING" && (
                              <button
                                onClick={() => handleSubmit(t.title)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-dark text-white text-xs font-bold hover:bg-teal transition"
                              >
                                <Send className="w-3 h-3"/> Submit
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-end gap-1.5 mt-4">
                <button onClick={() => setPage(1)} disabled={page===1} className="w-8 h-8 rounded-lg border border-border text-xs font-bold flex items-center justify-center hover:bg-secondary disabled:opacity-40">|&lt;</button>
                <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary disabled:opacity-40">
                  <ChevronLeft className="w-4 h-4"/>
                </button>
                {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
                  <button key={n} onClick={()=>setPage(n)}
                    className={`w-8 h-8 rounded-lg border text-sm font-semibold transition ${page===n?"bg-teal-dark text-white border-teal-dark":"border-border hover:bg-secondary"}`}>
                    {n}
                  </button>
                ))}
                <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary disabled:opacity-40">
                  <ChevronRight className="w-4 h-4"/>
                </button>
                <button onClick={() => setPage(totalPages)} disabled={page===totalPages} className="w-8 h-8 rounded-lg border border-border text-xs font-bold flex items-center justify-center hover:bg-secondary disabled:opacity-40">&gt;|</button>
              </div>
            )}
          </FadeUp>
        </div>
      </div>

      {/* ── Task Detail Modal ── */}
      {detailTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDetailTask(null)}>
          <div className="bg-card rounded-2xl border border-border p-7 w-[500px] shadow-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusStyle[getEffectiveStatus(detailTask)].badge}`}>
                    {getEffectiveStatus(detailTask)}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${priorityStyle[detailTask.priority]}`}>
                    {detailTask.priority}
                  </span>
                </div>
                <h2 className="font-serif font-bold text-teal-dark text-xl">{detailTask.title}</h2>
              </div>
              <button onClick={() => setDetailTask(null)} className="hover:bg-secondary rounded-lg p-1.5 ml-3 shrink-0"><X className="w-5 h-5"/></button>
            </div>
            <div className="space-y-3">
              {[
                { label:"Context / Target",   value: detailTask.contextTarget },
                { label:"Deadline",           value: detailTask.deadline },
                { label:"Assigned By",        value: detailTask.assignedBy },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-3 border-b border-border/60 last:border-0 gap-4">
                  <span className="text-sm text-muted-text shrink-0">{label}</span>
                  <span className="text-sm font-semibold text-foreground text-right">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 p-4 bg-secondary/30 rounded-xl text-sm text-muted-text leading-relaxed">
              Submit your completed task output through the portal link or directly attach a file. Reach out to your assigned coordinator for questions before the deadline.
            </div>
            <div className="flex gap-3 mt-5">
              {getEffectiveStatus(detailTask) === "PENDING" && (
                <button onClick={() => { handleSubmit(detailTask.title); setDetailTask(null); }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-teal-dark text-white rounded-xl text-sm font-bold hover:bg-teal transition">
                  <Send className="w-4 h-4"/> Submit Task
                </button>
              )}
              <button onClick={() => setDetailTask(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Comment Modal ── */}
      {commentTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setCommentTask(null)}>
          <div className="bg-card rounded-2xl border border-border p-7 w-[460px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif font-bold text-teal-dark text-lg">Comments</h2>
              <button onClick={() => setCommentTask(null)} className="hover:bg-secondary rounded-lg p-1.5"><X className="w-5 h-5"/></button>
            </div>
            <p className="text-xs text-muted-text mb-4 font-medium truncate">Task: {commentTask.title}</p>
            {/* Existing comments */}
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {(comments[commentTask.title] ?? []).length === 0
                ? <div className="text-center text-muted-text text-sm py-6">No comments yet. Be the first!</div>
                : (comments[commentTask.title] ?? []).map((c, i) => (
                    <div key={i} className="bg-secondary/40 rounded-xl px-4 py-3 text-sm text-foreground">{c}</div>
                  ))
              }
            </div>
            {/* New comment input */}
            <div className="flex gap-2">
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && commentText.trim()) {
                    setComments(prev => ({ ...prev, [commentTask.title]: [...(prev[commentTask.title] ?? []), commentText.trim()] }));
                    setCommentText("");
                  }
                }}
                placeholder="Add a comment..."
                className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-teal/30 outline-none"
              />
              <button
                onClick={() => {
                  if (commentText.trim()) {
                    setComments(prev => ({ ...prev, [commentTask.title]: [...(prev[commentTask.title] ?? []), commentText.trim()] }));
                    setCommentText("");
                  }
                }}
                disabled={!commentText.trim()}
                className="px-4 py-2.5 bg-teal-dark text-white rounded-xl text-sm font-bold hover:bg-teal transition disabled:opacity-40">
                <Send className="w-4 h-4"/>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export function AnnouncementsView({ canCreate = false }: { canCreate?: boolean }) {
  const [activeCategory, setActiveCategory] = useState<"ALL"|"TEAM"|"PANATA"|"GE SUBJECT GROUP"|"INSTITUTIONAL">("ALL");
  const [annPage, setAnnPage] = useState(0);
  const [evtPage, setEvtPage] = useState(0);

  const anns = [
    {
      title:"URGENT: Choir Orientation Tonight CANCELLED",
      date:"2026-06-06",
      scope:"All STF Members",
      author:"Super Admin",
      category:"INSTITUTIONAL" as const,
      urgency:"URGENT" as const,
      content:"Venue conflict — re-scheduling within 48 hours. Watch for follow-up announcement.",
    },
    {
      title:"Video Team Practice Rescheduled — Week 3",
      date:"2026-06-05",
      scope:"Video Team",
      author:"@CoordinatorJerald",
      category:"TEAM" as const,
      urgency:"HIGH" as const,
      content:"This week's practice moves to Thursday 4PM. Confirm attendance via QR scan on arrival.",
    },
    {
      title:"GE 101 Section A — Quiz Postponed",
      date:"Nov 6, 2023",
      scope:"GE Section A",
      author:"GE Monitor",
      category:"GE SUBJECT GROUP" as const,
      urgency:null,
      content:"The quiz originally scheduled for Thursday has been moved to Monday next week. Review chapters 4–6.",
    },
    {
      title:"Pulong Panata This Sunday — Attendance Required",
      date:"Nov 4, 2023",
      scope:"CICS2",
      author:"Panata Leader",
      category:"PANATA" as const,
      urgency:"HIGH" as const,
      content:"Sunday Pulong Panata at 2:30 PM. All CICS2 members are expected to attend.",
    },
    {
      title:"General Assembly this Saturday",
      date:"Nov 4, 2023",
      scope:"All Students",
      author:"Super Admin",
      category:"INSTITUTIONAL" as const,
      urgency:null,
      content:"Please attend the general assembly this Saturday at 8AM, NEU Gymnasium. Attendance is mandatory for all registered members.",
    },
  ];

  const upcomingEvents = [
    { month:"MAY", day:"7",  title:"Hunnybear Dance Team Auditions", time:"04:30 PM", color:"bg-slate-blue" },
    { month:"MAY", day:"11", title:"Senior Breakfast",               time:"08:00 AM", color:"bg-teal" },
    { month:"MAY", day:"16", title:"Graduation Practice",            time:"09:00 AM", color:"bg-gold" },
    { month:"JUN", day:"2",  title:"STF-NEU Choir Orientation",      time:"01:00 PM", color:"bg-teal-dark" },
    { month:"JUN", day:"8",  title:"CBI Peer Counseling Seminar",    time:"09:00 AM", color:"bg-teal" },
    { month:"JUN", day:"12", title:"DGA Sync Meeting",               time:"02:00 PM", color:"bg-slate-blue" },
  ];

  const EVT_PER_PAGE = 3;
  const ANN_PER_PAGE = 3;

  const categories = ["ALL","TEAM","PANATA","GE SUBJECT GROUP","INSTITUTIONAL"] as const;

  const urgencyStyle: Record<string,string> = {
    URGENT: "bg-red-status text-white",
    HIGH:   "bg-amber-status text-white",
  };
  const categoryStyle: Record<string,string> = {
    INSTITUTIONAL: "bg-teal-dark text-white",
    TEAM:          "bg-slate-blue text-white",
    PANATA:        "bg-gold text-teal-dark",
    "GE SUBJECT GROUP": "bg-teal-light text-white",
  };

  const filtered = activeCategory === "ALL" ? anns : anns.filter(a => a.category === activeCategory);
  const annTotalPages = Math.max(1, Math.ceil(filtered.length / ANN_PER_PAGE));
  const pageAnns = filtered.slice(annPage * ANN_PER_PAGE, (annPage + 1) * ANN_PER_PAGE);
  const evtTotalPages = Math.max(1, Math.ceil(upcomingEvents.length / EVT_PER_PAGE));
  const pageEvts = upcomingEvents.slice(evtPage * EVT_PER_PAGE, (evtPage + 1) * EVT_PER_PAGE);

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">Announcements</h1>
            <p className="text-sm text-muted-text mt-1">Sorted by urgency, then most recent. Click a card to view details.</p>
          </div>
          {canCreate && (
            <button className="flex items-center gap-2 bg-teal text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-teal-dark">
              <Plus className="w-4 h-4"/> Create
            </button>
          )}
        </div>

        {/* Category filter buttons */}
        <div className="flex gap-2 mt-4 mb-6 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setAnnPage(0); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                activeCategory === cat
                  ? "bg-teal-dark text-white border-teal-dark"
                  : "bg-card border-border text-foreground/60 hover:border-teal hover:text-teal"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </FadeUp>

      {/* Two-column layout: Announcements left, Events right — like the screenshot */}
      <div className="flex gap-6 items-start">
        {/* ── Announcements Column ── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif font-bold text-teal-dark text-lg">Latest Announcements</h2>
            <span className="text-xs text-muted-text font-medium">{filtered.length} total</span>
          </div>
          <div className="space-y-3">
            {pageAnns.map((a, i) => (
              <FadeUp key={i} delay={i * 60}>
                <div className={`bg-card border rounded-xl p-5 cursor-pointer hover:shadow-md transition-shadow ${
                  a.urgency === "URGENT" ? "border-l-4 border-red-status border-r border-t border-b" : "border-border"
                }`}>
                  <div className="flex items-start gap-2 mb-2 flex-wrap">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${categoryStyle[a.category] ?? "bg-muted text-foreground"}`}>
                      {a.category}
                    </span>
                    {a.urgency && (
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${urgencyStyle[a.urgency]}`}>
                        {a.urgency}
                      </span>
                    )}
                    <h3 className="font-bold text-foreground text-sm leading-snug flex-1 min-w-0">{a.title}</h3>
                  </div>
                  <p className="text-sm text-muted-text leading-relaxed line-clamp-2 mb-3">{a.content}</p>
                  <p className="text-xs text-muted-text">
                    Posted by: <strong>{a.author}</strong> · {a.date} · Target: <strong>{a.scope}</strong>
                  </p>
                </div>
              </FadeUp>
            ))}
            {pageAnns.length === 0 && (
              <div className="py-16 text-center text-muted-text text-sm">No announcements in this category.</div>
            )}
          </div>
          {/* Announcements pagination */}
          {annTotalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-muted-text font-medium uppercase tracking-wider">ALL ANNOUNCEMENTS →</span>
              <div className="flex gap-1">
                <button onClick={() => setAnnPage(p => Math.max(0, p - 1))} disabled={annPage === 0}
                  className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-secondary disabled:opacity-40">
                  <ChevronLeft className="w-3.5 h-3.5"/>
                </button>
                <button onClick={() => setAnnPage(p => Math.min(annTotalPages - 1, p + 1))} disabled={annPage === annTotalPages - 1}
                  className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-secondary disabled:opacity-40">
                  <ChevronRight className="w-3.5 h-3.5"/>
                </button>
              </div>
            </div>
          )}
          {annTotalPages <= 1 && (
            <div className="mt-4">
              <span className="text-xs text-muted-text font-medium uppercase tracking-wider">ALL ANNOUNCEMENTS →</span>
            </div>
          )}
        </div>

        {/* ── Events Column ── */}
        <div className="w-72 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif font-bold text-teal-dark text-lg">Events</h2>
            <span className="text-xs text-muted-text font-medium">{upcomingEvents.length} upcoming</span>
          </div>
          <div className="space-y-2.5">
            {pageEvts.map((e, i) => (
              <FadeUp key={i} delay={i * 50}>
                <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:shadow-sm transition-shadow cursor-pointer">
                  <div className={`${e.color} rounded-lg w-12 h-14 flex flex-col items-center justify-center shrink-0`}>
                    <span className="text-white/80 text-[10px] font-bold uppercase leading-none">{e.month}</span>
                    <span className="text-white font-serif font-bold text-xl leading-tight">{e.day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-foreground leading-snug line-clamp-2">{e.title}</div>
                    <div className="text-xs text-muted-text mt-0.5">{e.time}</div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
          {/* Events pagination */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-muted-text font-medium uppercase tracking-wider">ALL EVENTS →</span>
            {evtTotalPages > 1 && (
              <div className="flex gap-1">
                <button onClick={() => setEvtPage(p => Math.max(0, p - 1))} disabled={evtPage === 0}
                  className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-secondary disabled:opacity-40">
                  <ChevronLeft className="w-3.5 h-3.5"/>
                </button>
                <button onClick={() => setEvtPage(p => Math.min(evtTotalPages - 1, p + 1))} disabled={evtPage === evtTotalPages - 1}
                  className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-secondary disabled:opacity-40">
                  <ChevronRight className="w-3.5 h-3.5"/>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Attendance Logs ──────────────────────────────────────────────────────────
export function AttendanceLogsView() {
  const [activeFilter, setActiveFilter] = useState<"ALL"|"MAJOR SUBJECTS"|"GE SUBJECTS"|"PANATA"|"STF TEAMS"|"EVENTS">("ALL");

  const logs = [
    {event:"MS Lab — OOP",              category:"Major" as const, date:"Aug 11, 2025", time:"10AM–1PM",    status:"Present" as const, remarks:""},
    {event:"Advanced Statistics",       category:"Major" as const, date:"Aug 14, 2025", time:"7–10AM",      status:"Present" as const, remarks:""},
    {event:"Art Appreciation",          category:"GE" as const,    date:"Aug 15, 2025", time:"11:30AM–1PM", status:"Present" as const, remarks:""},
    {event:"Sosyedad at Literatura",    category:"GE" as const,    date:"Aug 18, 2025", time:"1:30–3PM",    status:"Present" as const, remarks:""},
    {event:"Tupad - Panata",            category:"Panata" as const,date:"Aug 1, 2025",  time:"6:45–10AM",   status:"Present" as const, remarks:""},
    {event:"Pulong Panata",             category:"Panata" as const,date:"Aug 4, 2025",  time:"2:30–3PM",    status:"Late" as const,    remarks:"Arrived 2:45 PM"},
    {event:"DGA Multimedia Training",   category:"STF Team" as const,date:"Aug 18, 2025",time:"5:30–7PM",   status:"Present" as const, remarks:""},
    {event:"Video Team Practice",       category:"STF Team" as const,date:"Aug 14, 2025",time:"3–4:30PM",   status:"Absent" as const,  remarks:"No show"},
    {event:"STF Choir Orientation",     category:"Event" as const, date:"Aug 25, 2025", time:"1–3PM",       status:"Excused" as const, remarks:"Medical"},
    {event:"CBI Peer Counseling",       category:"Event" as const, date:"Aug 2025",     time:"9–10:30AM",   status:"Present" as const, remarks:""},
  ];

  const filters = ["ALL","MAJOR SUBJECTS","GE SUBJECTS","PANATA","STF TEAMS","EVENTS"] as const;
  const filterMap: Record<string,string[]> = {
    "MAJOR SUBJECTS":["Major"], "GE SUBJECTS":["GE"],
    "PANATA":["Panata"], "STF TEAMS":["STF Team"], "EVENTS":["Event"],
  };

  const statusStyle: Record<string,string> = {
    Present: "bg-green-status text-white",
    Late:    "bg-amber-status text-white",
    Absent:  "bg-red-status text-white",
    Excused: "bg-slate-blue text-white",
  };

  const filtered = activeFilter === "ALL"
    ? logs
    : logs.filter(l => filterMap[activeFilter]?.includes(l.category));

  return (
    <div className="p-7">
      <FadeUp>
        <h1 className="font-serif text-3xl font-bold text-teal-dark mb-2">My Attendance Records</h1>

        {/* Filter buttons */}
        <div className="flex gap-2 mt-4 mb-5 flex-wrap">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                activeFilter === f
                  ? "bg-teal-dark text-white border-teal-dark"
                  : "bg-card border-border text-foreground/60 hover:border-teal hover:text-teal"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden" style={{boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
          <table className="w-full text-sm">
            <thead className="bg-teal-dark text-white text-xs uppercase tracking-wider">
              <tr>
                {["Session/Event Name","Category","Date","Time","Status","Remarks"].map(h=>(
                  <th key={h} className="px-5 py-3.5 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={6} className="px-5 py-12 text-center text-muted-text">No records found.</td></tr>
                : filtered.map((l,i) => (
                  <tr key={i} className={`border-b border-border last:border-0 hover:bg-teal-soft/10 transition-colors ${i%2===0?"bg-card":"bg-secondary/20"}`}>
                    <td className="px-5 py-4 font-medium">{l.event}</td>
                    <td className="px-5 py-4 text-muted-text text-sm">{l.category}</td>
                    <td className="px-5 py-4 text-muted-text text-sm">{l.date}</td>
                    <td className="px-5 py-4 text-muted-text text-sm font-mono">{l.time}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusStyle[l.status]}`}>{l.status}</span>
                    </td>
                    <td className="px-5 py-4 text-muted-text text-sm">{l.remarks || "—"}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </FadeUp>
    </div>
  );
}

// ─── Radar / Spider Chart — expands from centre outward ─────────────────────
function RadarChart() {
  // JS-driven progress state (0 → 1) so SVG polygon points animate correctly.
  // CSS `transition: points` doesn't work across browsers; we drive it ourselves.
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const DURATION = 900; // ms

  useEffect(() => {
    const delay = setTimeout(() => {
      const animate = (now: number) => {
        if (startRef.current === null) startRef.current = now;
        const elapsed = now - startRef.current;
        const t = Math.min(elapsed / DURATION, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - t, 3);
        setProgress(eased);
        if (t < 1) rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
    }, 200);
    return () => {
      clearTimeout(delay);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // 6-axis stats: Attendance, Task Completion, Panata, Team, Consistency, Engagement
  const axes = [
    { label: "Attendance",   value: 0.87 },
    { label: "Tasks",        value: 0.72 },
    { label: "Panata",       value: 0.95 },
    { label: "Team",         value: 0.80 },
    { label: "Consistency",  value: 0.78 },
    { label: "Engagement",   value: 0.85 },
  ];
  const n = axes.length;
  const cx = 130; const cy = 130; const maxR = 96;
  const rings = [0.25, 0.5, 0.75, 1.0];

  function polarToXY(i: number, r: number) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  // Build polygon points for the filled data area — driven by animated progress
  const dataPoints = axes.map((a, i) => polarToXY(i, a.value * maxR * progress));
  const polyStr = dataPoints.map(p => `${p.x},${p.y}`).join(" ");

  // Ring grid polygons
  const ringPolys = rings.map(frac => {
    const pts = axes.map((_, i) => polarToXY(i, frac * maxR));
    return pts.map(p => `${p.x},${p.y}`).join(" ");
  });

  // Label positions pushed slightly further out
  const labelPositions = axes.map((a, i) => {
    const pos = polarToXY(i, maxR + 26);
    return { ...pos, label: a.label, value: a.value };
  });

  return (
    <svg viewBox="0 0 260 280" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"auto"}}>
      {/* Ring grid */}
      {ringPolys.map((pts, ri) => (
        <polygon key={ri} points={pts}
          fill="none" stroke="#1B6B8F" strokeOpacity={0.12 + ri * 0.04} strokeWidth="1"/>
      ))}
      {/* Axis spokes */}
      {axes.map((_, i) => {
        const end = polarToXY(i, maxR);
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y}
          stroke="#1B6B8F" strokeOpacity="0.18" strokeWidth="1"/>;
      })}
      {/* Data polygon — JS-animated points */}
      <polygon points={polyStr}
        fill="rgba(27,107,143,0.18)" stroke="#1B6B8F" strokeWidth="2"/>
      {/* Data dots */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4.5"
          fill="#1B6B8F" stroke="white" strokeWidth="1.5"/>
      ))}
      {/* Labels */}
      {labelPositions.map((l, i) => (
        <g key={i}>
          <text x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle"
            fontSize="9.5" fill="#6b7280" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600">
            {l.label.toUpperCase()}
          </text>
          <text x={l.x} y={l.y + 12} textAnchor="middle" dominantBaseline="middle"
            fontSize="9.5" fill="#1B6B8F" fontFamily="Sora, sans-serif" fontWeight="700">
            {Math.round(l.value * 100)}%
          </text>
        </g>
      ))}
      {/* Centre dot */}
      <circle cx={cx} cy={cy} r="3" fill="#1B6B8F" opacity="0.4"/>
    </svg>
  );
}

// ─── Profile View — redesigned to match boss reference ───────────────────────
export function ProfileView() {
  const [profileTab, setProfileTab] = useState<"overview"|"academic"|"membership"|"preferences"|"responsibilities">("overview");
  const [editMode, setEditMode] = useState(false);
  const [telegramHandle, setTelegramHandle] = useState("@reb_emnacin");
  const [tempTelegram, setTempTelegram] = useState(telegramHandle);
  const [saved, setSaved] = useState(false);
  const [prefNote, setPrefNote] = useState("Open to switching to DGA full-time if needed for upcoming animation projects.");

  const handleSave = () => {
    setTelegramHandle(tempTelegram);
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const profileTabs = [
    { id:"overview" as const,         label:"Overview",         Icon: UserCircle },
    { id:"academic" as const,         label:"Academic",         Icon: BookOpen },
    { id:"membership" as const,       label:"Academic History",       Icon: Star },
    { id:"preferences" as const,      label:"STF-Team Preferences",      Icon: Activity },
    { id:"responsibilities" as const, label:"Responsibilities", Icon: Shield },
  ];

  // SVG icons for stat cards (no emojis)
  const StatIcons = {
    Attendance: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/80"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M9 16l2 2 4-4"/></svg>,
    TasksDone:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/80"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    ActiveDays: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/80"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
    YearLevel:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/80"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  };

  const statCards = [
    { label:"Attendance",  value:"87%", sub:"this semester",  color:"from-teal to-teal-light",             IconComp: StatIcons.Attendance },
    { label:"Tasks Done",  value:"72%", sub:"of all tasks",   color:"from-teal-light to-[#5A8FA8]",        IconComp: StatIcons.TasksDone  },
    { label:"Active Days", value:"7",   sub:"days per week",  color:"from-[#4A7A8A] to-[#3D6B7A]",        IconComp: StatIcons.ActiveDays },
    { label:"Year Level",  value:"3rd", sub:"BS Comp. Sci.",  color:"from-slate-blue to-[#3D5466]",        IconComp: StatIcons.YearLevel  },
  ];

  // SVG icons for overview info cards
  const InfoIcons = {
    Team:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-teal shrink-0"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    Panata:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-teal shrink-0"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Major:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-teal shrink-0"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    GE:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-teal shrink-0"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    Calendar:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-teal shrink-0"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    Telegram:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-teal shrink-0"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  };

  return (
    <div className="p-0 pb-7">
      <FadeUp>
        {/* ── Hero Banner — taller so avatar doesn't cover text ── */}
        <div className="relative overflow-hidden mb-0"
          style={{height:160, background:"linear-gradient(135deg, #0D4A6B 0%, #1B6B8F 50%, #4A8FA8 80%, #5A8FA8 100%)"}}>
          {/* Decorative circles */}
          <div style={{position:"absolute",top:-30,right:-30,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
          <div style={{position:"absolute",bottom:-40,left:"30%",width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
          <div style={{position:"absolute",top:10,left:"60%",width:60,height:60,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
          {/* Banner text anchored to top-left so avatar doesn't overlap */}
          <div className="absolute top-5 left-7">
            <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Student Profile</div>
            <div className="text-white font-serif font-bold text-2xl">REB EMNACIN</div>
          </div>
          <div className="absolute top-5 right-7 flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white/90 border border-white/30"
              style={{background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)"}}>
              Currently Enrolled
            </span>
          </div>
        </div>
      </FadeUp>

      <div className="px-7">
        {/* ── Profile card + stat strip ── */}
        <FadeUp delay={60}>
          <div className="flex gap-5 items-start -mt-8 mb-6">
            {/* Avatar floats over banner — SVG UserCircle icon, no initials */}
            <div className="shrink-0 relative">
              <div className="w-24 h-24 rounded-2xl border-4 border-background shadow-2xl grid place-items-center overflow-hidden"
                style={{background:"linear-gradient(135deg, #1B6B8F, #4A8FA8)"}}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
                  <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.9)"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="rgba(255,255,255,0.9)"/>
                </svg>
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-background block flex items-center justify-center">
                <svg viewBox="0 0 10 10" className="w-2.5 h-2.5"><circle cx="5" cy="5" r="3" fill="white"/></svg>
              </span>
            </div>

            {/* Name + meta */}
            <div className="pt-10 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="font-serif font-bold text-teal-dark text-2xl leading-tight">Reb Emnacin</h1>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-sm text-muted-text">3rd Year · BSCS · CICS</span>
                    <span className="text-muted-text/40">·</span>
                    <span className="text-sm font-mono text-muted-text">24-10374-486</span>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal/10 text-teal border border-teal/20">Video Team</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gold/15 text-yellow-700 border border-gold/30">CICS1 Panata</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-blue/10 text-slate-blue border border-slate-blue/20">Prayer Leader</span>
                  </div>
                </div>
                <button
                  onClick={() => setEditMode(e => !e)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all mt-1"
                  style={editMode
                    ? {background:"var(--teal-dark)", color:"#fff", borderColor:"var(--teal-dark)"}
                    : {borderColor:"var(--border)", color:"var(--muted-text)"}}
                >
                  <Pencil className="w-3.5 h-3.5"/> {editMode ? "Editing…" : "Edit Profile"}
                </button>
              </div>
            </div>
          </div>

          {/* Stat strip — SVG icons, no emojis */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {statCards.map((s, i) => (
              <FadeUp key={s.label} delay={i * 50}>
                <div className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white shadow-md`}
                  style={{boxShadow:"0 4px 14px rgba(0,0,0,0.12)"}}>
                  <div className="mb-1.5"><s.IconComp/></div>
                  <div className="font-serif font-bold text-3xl leading-none">{s.value}</div>
                  <div className="text-white/80 text-xs font-semibold mt-1 uppercase tracking-wide">{s.label}</div>
                  <div className="text-white/60 text-[10px] mt-0.5">{s.sub}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </FadeUp>

        {/* ── Tabbed Panel ── */}
        <FadeUp delay={120}>
          <div className="bg-card border border-border rounded-2xl overflow-hidden" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.08)"}}>
            {/* Pill-style tab bar */}
            <div className="flex gap-1 p-2 border-b border-border bg-secondary/20 overflow-x-auto">
              {profileTabs.map(t => (
                <button key={t.id} onClick={() => setProfileTab(t.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
                  style={profileTab === t.id
                    ? {background:"var(--teal-dark)", color:"#fff", boxShadow:"0 2px 8px rgba(13,74,107,0.3)"}
                    : {color:"var(--muted-text)", background:"transparent"}
                  }>
                  <t.Icon className="w-3.5 h-3.5"/>{t.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {profileTab === "overview" && (
                <div className="flex gap-5 items-start">
                  {/* Left: info cards + radar */}
                  <div className="flex-1 min-w-0">
                    {/* Quick info grid — SVG icons, no emojis */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {[
                        {label:"STF Team",            value:"Video Team 104 (DGA Multimedia)",               IconC: InfoIcons.Team     },
                        {label:"Panata Group",         value:"CICS2 — Prayer Leader",                        IconC: InfoIcons.Panata   },
                        {label:"Major Subjects",       value:"OOP · MS Lab · Networking · Adv. Statistics",  IconC: InfoIcons.Major    },
                        {label:"GE Subjects",          value:"Art Appreciation · Sosyedad at Lit · PE4 · DAA",IconC: InfoIcons.GE       },
                        {label:"Active Schedule Days", value:"Mon · Tue · Wed · Thu · Fri · Sat · Sun",      IconC: InfoIcons.Calendar },
                        {label:"Telegram",      value: editMode ? undefined : telegramHandle,          IconC: InfoIcons.Telegram, edit: editMode },
                      ].map(({label, value, IconC, edit}) => (
                        <div key={label} className="bg-secondary/30 hover:bg-secondary/50 rounded-xl p-4 transition-colors border border-border/30">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <IconC/>
                            <div className="text-xs text-muted-text font-semibold uppercase tracking-wide">{label}</div>
                          </div>
                          {edit
                            ? <div className="flex gap-2">
                                <input value={tempTelegram} onChange={e => setTempTelegram(e.target.value)}
                                  className="flex-1 text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:ring-2 focus:ring-teal/30 outline-none font-mono"/>
                                <button onClick={handleSave}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition"
                                  style={{background: saved ? "var(--green-status)" : "var(--teal-dark)"}}>
                                  {saved ? <CheckCircle className="w-4 h-4"/> : "Save"}
                                </button>
                              </div>
                            : <div className="font-semibold text-sm text-foreground">{value}</div>
                          }
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Radar / Spider chart — animates outward from centre */}
                  <div className="shrink-0 w-96">
                    <div className="rounded-2xl border border-border p-6 bg-secondary/10">
                      <div className="text-xs font-bold text-muted-text uppercase tracking-widest mb-1">Performance Overview</div>
                      <p className="text-[11px] text-muted-text mb-4">This semester at a glance</p>
                      <RadarChart/>
                    </div>
                  </div>
                </div>
              )}

              {/* Academic Subjects Tab — linked to schedule data */}
              {profileTab === "academic" && (
                <div className="overflow-x-auto">
                  <p className="text-xs text-muted-text mb-3 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5"/> Schedule linked — data synced from your Comprehensive Schedule.
                  </p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-teal-dark text-white text-xs uppercase tracking-wider">
                        {["Course Code","Subject","Type","Schedule","Venue","Professor","Status"].map(h => (
                          <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {code:"IT312",  subject:"OOP Lab",                    type:"Major", schedule:"THU 10:00–13:00", venue:"M102",     professor:"Prof. Reyes",      status:"Enrolled"},
                        {code:"IT312L", subject:"OOP Lecture",                type:"Major", schedule:"WED 19:00–21:00", venue:"M411 A",   professor:"Prof. Reyes",      status:"Enrolled"},
                        {code:"IT321",  subject:"Networking Concepts Lab",    type:"Major", schedule:"SAT 07:00–10:00", venue:"M106",     professor:"Prof. Santos",     status:"Enrolled"},
                        {code:"MATH31", subject:"Advanced Statistics",        type:"Major", schedule:"THU 07:00–10:00", venue:"M413 B",   professor:"Prof. Garcia",     status:"Enrolled"},
                        {code:"IT331",  subject:"MS Lab",                     type:"Major", schedule:"MON 10:00–13:00", venue:"M415 A",   professor:"Prof. Cruz",       status:"Enrolled"},
                        {code:"GE101",  subject:"Art Appreciation",           type:"GE",    schedule:"TUE 11:30–13:00", venue:"M414 B",   professor:"Prof. De Leon",    status:"Enrolled"},
                        {code:"GE102",  subject:"Sosyedad at Literatura",     type:"GE",    schedule:"THU 13:30–15:00", venue:"IS 233 B", professor:"Prof. Villanueva", status:"Enrolled"},
                        {code:"PE4",    subject:"PE4",                        type:"GE",    schedule:"FRI 15:00–17:00", venue:"IS 234 B", professor:"Coach Mendoza",    status:"Enrolled"},
                        {code:"GE201",  subject:"DAA",                        type:"GE",    schedule:"SAT 10:00–11:30", venue:"M414 B",   professor:"Prof. Aquino",     status:"Enrolled"},
                      ].map((r,i) => (
                        <tr key={i} className={`border-b border-border last:border-0 ${i%2===0?"bg-card":"bg-secondary/20"}`}>
                          <td className="px-4 py-3">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-teal-soft text-teal-dark border border-teal/20 font-mono">{r.code}</span>
                          </td>
                          <td className="px-4 py-3 font-medium">{r.subject}</td>
                          <td className="px-4 py-3 text-muted-text">{r.type}</td>
                          <td className="px-4 py-3 text-muted-text font-mono text-xs">{r.schedule}</td>
                          <td className="px-4 py-3 text-muted-text text-xs">{r.venue}</td>
                          <td className="px-4 py-3 text-muted-text">{r.professor}</td>
                          <td className="px-4 py-3"><span className="text-xs font-semibold text-teal">{r.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Membership History Tab */}
              {profileTab === "membership" && (
                <div className="space-y-3">
                  {[
                    {sem:"AY 2023–2024 S1",status:"Active",team:"Video Team",panata:"CICS2",approvedBy:"Super admin"},
                    {sem:"AY 2022–2023 S2",status:"Active",team:"Video Team",panata:"CICS2",approvedBy:"Super admin"},
                    {sem:"AY 2022–2023 S1",status:"Active",team:"Rotation",  panata:"CICS1",approvedBy:"Super admin"},
                    {sem:"AY 2021–2022 S2",status:"Active",team:"Rotation",  panata:"CICS1",approvedBy:"Super admin"},
                  ].map((r, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal to-teal-light grid place-items-center text-white font-bold text-sm shrink-0">
                        {r.sem.slice(-2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-foreground">{r.sem}</div>
                        <div className="text-xs text-muted-text mt-0.5">Team: <strong>{r.team}</strong> · Panata: <strong>{r.panata}</strong></div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal/10 text-teal border border-teal/20 shrink-0">{r.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Team Preferences Tab */}
              {profileTab === "preferences" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-teal to-teal-light rounded-2xl p-5 text-white">
                      <div className="text-xs uppercase tracking-wider text-white/70 font-bold mb-2">Primary Team</div>
                      <div className="font-serif font-bold text-xl">Video Team</div>
                      <div className="text-white/70 text-sm mt-1">Multimedia / Livestream</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-blue to-[#3D5466] rounded-2xl p-5 text-white">
                      <div className="text-xs uppercase tracking-wider text-white/70 font-bold mb-2">Secondary Team</div>
                      <div className="font-serif font-bold text-xl">DGA Team</div>
                      <div className="text-white/70 text-sm mt-1">Design & Graphics</div>
                    </div>
                  </div>
                  <div className="bg-secondary/30 rounded-xl p-4 text-sm flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-teal shrink-0"/>
                    <div><span className="font-bold">Survey status:</span> Submitted (AY 2022–2023)</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-text uppercase tracking-wider mb-2 block">Notes / Open to Changes</label>
                    <textarea
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:ring-2 focus:ring-teal/30 outline-none resize-none"
                      rows={4}
                      value={prefNote}
                      onChange={e => setPrefNote(e.target.value)}
                    />
                  </div>
                  <button className="px-5 py-2.5 rounded-xl bg-teal-dark text-white text-sm font-semibold hover:bg-teal transition">
                    Update Preference
                  </button>
                </div>
              )}

              {/* Responsibilities Tab */}
              {profileTab === "responsibilities" && (
                <div className="space-y-3">
                  {[
                    {type:"STF TEAM",   detail:"Video Team Member — Weekly practice attendance, multimedia submissions",    color:"bg-teal/10 border-teal/20 text-teal-dark",        badge:"bg-teal text-white"},
                    {type:"PANATA",     detail:"CICS2 Prayer Leader — Leads weekly Tupad and Pulong Panata sessions",       color:"bg-gold/10 border-gold/20 text-yellow-800",       badge:"bg-gold text-teal-dark"},
                    {type:"EVENT ROLE", detail:"Choir Orientation Documenter — Assigned Nov 2, 2023",                       color:"bg-slate-blue/10 border-slate-blue/20 text-slate-blue", badge:"bg-slate-blue text-white"},
                    {type:"KOMITI",     detail:"Sagana Condo Bldg 1 — Weekly Monday 4PM coordination",                      color:"bg-secondary/60 border-border text-foreground",   badge:"bg-muted text-foreground"},
                  ].map((r, i) => (
                    <div key={i} className={`rounded-xl border p-4 ${r.color}`}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${r.badge}`}>{r.type}</span>
                      </div>
                      <div className="text-sm font-medium">{r.detail}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}

// ─── Settings View — redesigned to match boss reference ──────────────────────
function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label?: string }) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      aria-label={label}
      style={{
        width: 48, height: 26, borderRadius: 13,
        background: on ? "var(--teal)" : "oklch(0.80 0.006 240)",
        border: "none", cursor: "pointer",
        position: "relative", flexShrink: 0,
        transition: "background 0.25s ease",
      }}
    >
      <span style={{
        position: "absolute", top: 4, left: 4,
        width: 18, height: 18, borderRadius: "50%",
        background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
        transition: "transform 0.25s ease",
        transform: on ? "translateX(22px)" : "translateX(0)",
        display: "block",
      }}/>
    </button>
  );
}

export function SettingsView() {
  const [theme, setTheme]   = useState<"light"|"dark"|"system">("light");
  const [fontSize, setFontSize] = useState(14);
  const [accentColor, setAccentColor] = useState("#1B6B8F");
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("Asia/Manila");
  const [saved, setSaved]   = useState(false);

  const [notifs, setNotifs] = useState({
    announcements: true, tasks: true, attendance: true,
    deadlines: true, teamUpdates: false, emailDigest: true,
  });
  const [privacy, setPrivacy] = useState({
    showProfile: true, showAttendance: false, twoFactor: true,
  });
  const [calSettings, setCalSettings] = useState({
    showWeekNumbers: false, startMonday: false, defaultWeekView: true, calendarSync: true,
  });
  const [showPw, setShowPw] = useState(false);

  const toggleNotif   = (k: keyof typeof notifs)    => setNotifs(p   => ({ ...p, [k]: !p[k] }));
  const togglePrivacy = (k: keyof typeof privacy)   => setPrivacy(p  => ({ ...p, [k]: !p[k] }));
  const toggleCal     = (k: keyof typeof calSettings) => setCalSettings(p => ({ ...p, [k]: !p[k] }));

  const applyTheme = (t: "light"|"dark"|"system") => {
    setTheme(t);
    const isDark = t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const ACCENTS = [
    { label:"Ocean",   value:"#1B6B8F" },
    { label:"Forest",  value:"#2E8B57" },
    { label:"Royal",   value:"#4B3F72" },
    { label:"Crimson", value:"#B33A3A" },
    { label:"Amber",   value:"#C87A1A" },
    { label:"Slate",   value:"#3D5A80" },
  ];

  // Simple toggle row matching boss reference style
  const SettingRow = ({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
      <div>
        <div className="text-sm font-semibold text-foreground">{label}</div>
        {sub && <div className="text-xs text-muted-text mt-0.5">{sub}</div>}
      </div>
      <div className="shrink-0 ml-6">{children}</div>
    </div>
  );

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">Settings</h1>
            <p className="text-sm text-muted-text mt-1">Manage your portal preferences</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow"
            style={{ background: saved ? "var(--green-status)" : "var(--teal-dark)" }}
          >
            <Save className="w-4 h-4"/>
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </FadeUp>

      <div className="grid grid-cols-2 gap-5 items-start">
        {/* LEFT COLUMN */}
        <div className="space-y-5">
        {/* Main toggle settings — boss reference style */}
        <FadeUp delay={40}>
          <div className="bg-card border border-border rounded-2xl px-6 py-2" style={{boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
            <SettingRow label="Email Notifications" sub="Receive alerts for new tasks and announcements">
              <Toggle on={notifs.announcements} onToggle={() => toggleNotif("announcements")} label="Email Notifications"/>
            </SettingRow>
            <SettingRow label="Calendar Sync" sub="Sync your schedule with Google Calendar">
              <Toggle on={calSettings.calendarSync} onToggle={() => toggleCal("calendarSync")} label="Calendar Sync"/>
            </SettingRow>
            <SettingRow label="Two-Factor Authentication" sub="Add an extra layer of security">
              <Toggle on={privacy.twoFactor} onToggle={() => togglePrivacy("twoFactor")} label="Two-Factor Authentication"/>
            </SettingRow>
            <SettingRow label="Dark Mode" sub="Toggle dark interface theme">
              <Toggle on={theme === "dark"} onToggle={() => applyTheme(theme === "dark" ? "light" : "dark")} label="Dark Mode"/>
            </SettingRow>
            <SettingRow label="Weekly Digest" sub="Email summary of upcoming responsibilities">
              <Toggle on={notifs.emailDigest} onToggle={() => toggleNotif("emailDigest")} label="Weekly Digest"/>
            </SettingRow>
          </div>
        </FadeUp>

        {/* Appearance */}
        <FadeUp delay={80}>
          <div className="bg-card border border-border rounded-2xl overflow-hidden" style={{boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border bg-secondary/30">
              <div className="w-7 h-7 rounded-lg bg-teal-soft flex items-center justify-center text-teal">
                <Sun className="w-4 h-4"/>
              </div>
              <h2 className="font-semibold text-sm text-foreground">Appearance</h2>
            </div>
            <div className="px-6 py-2">
              <SettingRow label="Theme" sub="Light, dark or follow your system">
                <div className="flex gap-1.5">
                  {([
                    { id:"light" as const,  Icon: Sun,     label:"Light" },
                    { id:"dark"  as const,  Icon: Moon,    label:"Dark" },
                    { id:"system"as const,  Icon: Monitor, label:"System" },
                  ]).map(({ id, Icon, label }) => (
                    <button
                      key={id}
                      onClick={() => applyTheme(id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                      style={theme === id
                        ? { background:"var(--teal)", color:"#fff", border:"1px solid var(--teal)" }
                        : { background:"transparent", borderColor:"var(--border)", color:"var(--muted-text)" }
                      }
                    >
                      <Icon className="w-3 h-3"/> {label}
                    </button>
                  ))}
                </div>
              </SettingRow>
              <SettingRow label="Font Size" sub={`Currently ${fontSize}px — affects body text`}>
                <div className="flex items-center gap-2 w-44">
                  <span className="text-xs text-muted-text font-bold">A</span>
                  <input type="range" min={12} max={18} value={fontSize}
                    onChange={e => setFontSize(Number(e.target.value))}
                    className="flex-1" style={{accentColor:"var(--teal)"}}/>
                  <span className="text-base text-muted-text font-bold">A</span>
                </div>
              </SettingRow>
              <SettingRow label="Accent Color" sub="Portal highlight and button color">
                <div className="flex gap-2">
                  {ACCENTS.map(c => (
                    <button key={c.value} onClick={() => setAccentColor(c.value)} title={c.label}
                      className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                      style={{ background:c.value, outline:accentColor===c.value?`3px solid ${c.value}`:"none", outlineOffset:2 }}/>
                  ))}
                </div>
              </SettingRow>
              <SettingRow label="Language">
                <select value={language} onChange={e => setLanguage(e.target.value)}
                  className="text-xs border border-border rounded-lg px-3 py-1.5 bg-card focus:outline-none focus:ring-2 focus:ring-teal/30">
                  {["English","Filipino","Tagalog"].map(l=><option key={l}>{l}</option>)}
                </select>
              </SettingRow>
            </div>
          </div>
        </FadeUp>

        {/* Notifications */}
        <FadeUp delay={100}>
          <div className="bg-card border border-border rounded-2xl overflow-hidden" style={{boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border bg-secondary/30">
              <div className="w-7 h-7 rounded-lg bg-teal-soft flex items-center justify-center text-teal">
                <Bell className="w-4 h-4"/>
              </div>
              <h2 className="font-semibold text-sm text-foreground">Notifications</h2>
            </div>
            <div className="px-6 py-2">
              <SettingRow label="Task reminders" sub="Reminders before task deadlines">
                <Toggle on={notifs.tasks} onToggle={() => toggleNotif("tasks")} label="Task reminders"/>
              </SettingRow>
              <SettingRow label="Attendance warnings" sub="When attendance drops below threshold">
                <Toggle on={notifs.attendance} onToggle={() => toggleNotif("attendance")} label="Attendance warnings"/>
              </SettingRow>
              <SettingRow label="Upcoming deadlines" sub="24h and 1h alerts before due date">
                <Toggle on={notifs.deadlines} onToggle={() => toggleNotif("deadlines")} label="Upcoming deadlines"/>
              </SettingRow>
              <SettingRow label="Team activity updates" sub="When teammates complete tasks">
                <Toggle on={notifs.teamUpdates} onToggle={() => toggleNotif("teamUpdates")} label="Team activity updates"/>
              </SettingRow>
            </div>
          </div>
        </FadeUp>

        </div>{/* END LEFT COLUMN */}

        {/* RIGHT COLUMN */}
        <div className="space-y-5">

        {/* Calendar */}
        <FadeUp delay={140}>
          <div className="bg-card border border-border rounded-2xl overflow-hidden" style={{boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border bg-secondary/30">
              <div className="w-7 h-7 rounded-lg bg-teal-soft flex items-center justify-center text-teal">
                <Calendar className="w-4 h-4"/>
              </div>
              <h2 className="font-semibold text-sm text-foreground">Calendar & Schedule</h2>
            </div>
            <div className="px-6 py-2">
              <SettingRow label="Default week view" sub="Open schedule in week view by default">
                <Toggle on={calSettings.defaultWeekView} onToggle={() => toggleCal("defaultWeekView")} label="Default week view"/>
              </SettingRow>
              <SettingRow label="Start week on Monday" sub="First column of calendar">
                <Toggle on={calSettings.startMonday} onToggle={() => toggleCal("startMonday")} label="Start week on Monday"/>
              </SettingRow>
              <SettingRow label="Show week numbers" sub="ISO week numbers on calendar">
                <Toggle on={calSettings.showWeekNumbers} onToggle={() => toggleCal("showWeekNumbers")} label="Show week numbers"/>
              </SettingRow>
              <SettingRow label="Timezone">
                <select value={timezone} onChange={e => setTimezone(e.target.value)}
                  className="text-xs border border-border rounded-lg px-3 py-1.5 bg-card focus:outline-none focus:ring-2 focus:ring-teal/30">
                  {["Asia/Manila","Asia/Singapore","UTC","America/New_York"].map(t=><option key={t}>{t}</option>)}
                </select>
              </SettingRow>
            </div>
          </div>
        </FadeUp>

        {/* Privacy & Security */}
        <FadeUp delay={180}>
          <div className="bg-card border border-border rounded-2xl overflow-hidden" style={{boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border bg-secondary/30">
              <div className="w-7 h-7 rounded-lg bg-teal-soft flex items-center justify-center text-teal">
                <Shield className="w-4 h-4"/>
              </div>
              <h2 className="font-semibold text-sm text-foreground">Privacy & Security</h2>
            </div>
            <div className="px-6 py-2">
              <SettingRow label="Public profile" sub="Other students can see your profile card">
                <Toggle on={privacy.showProfile} onToggle={() => togglePrivacy("showProfile")} label="Public profile"/>
              </SettingRow>
              <SettingRow label="Visible attendance record" sub="Leaders can see your attendance">
                <Toggle on={privacy.showAttendance} onToggle={() => togglePrivacy("showAttendance")} label="Visible attendance record"/>
              </SettingRow>
              <SettingRow label="Change password" sub="Update your portal login password">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      placeholder="New password"
                      className="border border-border rounded-lg px-3 py-1.5 text-sm bg-background focus:ring-2 focus:ring-teal/30 outline-none w-36 pr-8"
                    />
                    <button onClick={() => setShowPw(p => !p)} className="absolute right-2 top-1.5 text-muted-text hover:text-foreground">
                      {showPw ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                    </button>
                  </div>
                  <button className="px-3 py-1.5 bg-teal text-white rounded-lg text-xs font-semibold hover:bg-teal-dark transition">
                    Update
                  </button>
                </div>
              </SettingRow>
            </div>
          </div>
        </FadeUp>

        {/* Danger Zone */}
        <FadeUp delay={220}>
          <div className="bg-card rounded-2xl overflow-hidden" style={{border:"1px solid var(--red-status)", boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
            <div className="flex items-center gap-3 px-5 py-3.5 border-b" style={{borderColor:"var(--red-status)", background:"oklch(0.98 0.010 25)"}}>
              <div className="w-7 h-7 rounded-lg bg-red-status/10 flex items-center justify-center text-red-status">
                <Shield className="w-4 h-4"/>
              </div>
              <h2 className="font-semibold text-sm" style={{color:"var(--red-status)"}}>Danger Zone</h2>
            </div>
            <div className="p-5 space-y-0.5">
              <div className="flex items-center justify-between py-3 border-b border-border/60 gap-4">
                <div>
                  <div className="text-sm font-medium">Export my data</div>
                  <div className="text-xs text-muted-text mt-0.5">Download all your portal data as JSON</div>
                </div>
                <button className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-border text-muted-text hover:bg-secondary transition">
                  Export
                </button>
              </div>
              <div className="flex items-center justify-between py-3 gap-4">
                <div>
                  <div className="text-sm font-medium">Deactivate account</div>
                  <div className="text-xs text-muted-text mt-0.5">Temporarily disable your portal access</div>
                </div>
                <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition hover:brightness-110"
                  style={{background:"var(--red-status)"}}>
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        </FadeUp>

        </div>{/* END RIGHT COLUMN */}

      </div>{/* END GRID */}
    </div>
  );
}