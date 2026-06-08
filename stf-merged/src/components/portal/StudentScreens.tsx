import { usePortal } from "./PortalContext";
import {
  X, Lock, Plus, Search, ChevronLeft, ChevronRight,
  Pencil, Trash2, ExternalLink, GripVertical,
  BookOpen, BookMarked, Users, Tv2, User, Calendar,
  Home, Cross, School, Megaphone, Clock, MapPin,
  CheckCircle2, AlertCircle, Loader2
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

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
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: "opacity 0.45s ease, transform 0.45s ease",
      }}
    >
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
  const { setDrawerDay } = usePortal();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const summaryCards = [
    { count: 2, period: "today",     category: "Major Subjects",   Icon: BookOpen,   bg: "bg-teal" },
    { count: 3, period: "this week", category: "GE Subjects",      Icon: BookMarked, bg: "bg-teal-light" },
    { count: 2, period: "upcoming",  category: "Panata Duties",    Icon: Cross,      bg: "bg-gold" },
    { count: 1, period: "practice",  category: "STF Activities",   Icon: Tv2,        bg: "bg-slate-blue" },
    { count: 3, period: "this week", category: "Upcoming Events",  Icon: Calendar,   bg: "bg-amber-status" },
  ];

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">Academic & Responsibility Dashboard</h1>
            <p className="text-sm text-muted-text mt-1">{MONTHS[month]} {year} — Calendar View</p>
          </div>
          <span className="chip bg-teal-soft text-teal text-sm px-3 py-1">Student View</span>
        </div>
      </FadeUp>

      {/* Summary strip */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {summaryCards.map((c, i) => (
          <FadeUp key={c.category} delay={i * 60}>
            <div className={`${c.bg} rounded-xl px-4 py-3 flex items-center gap-3`}
                 style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.14)" }}>
              <c.Icon className="w-7 h-7 text-white/80 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif font-bold text-white text-2xl leading-none">{c.count}</span>
                  <span className="text-white/80 text-xs font-medium">{c.period}</span>
                </div>
                <div className="text-white/70 text-[11px] font-medium mt-0.5 truncate">{c.category}</div>
              </div>
            </div>
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

        {/* Calendar grid — view only */}
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
                {valid && (
                  <>
                    {data?.deadline && <span className="educ-deadline-dot" />}
                    <div className="educ-day-num">{day}</div>
                    <div className="space-y-0.5">
                      {(data?.events ?? []).map((e, j) => (
                        <span key={j} className={`educ-chip ${e.color}`}>{e.label}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
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
                          <button onClick={() => { setDrawerDay(null); setView("schedule-full"); }}
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
                      <button onClick={() => { setDrawerDay(null); setView("schedule-full"); }}
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

// ─── Schedule Management (drag & drop) ───────────────────────────────────────
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
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [form, setForm] = useState({ title:"", day:1, start:"08:00", end:"09:30", type:"major", color:"#1B6B8F", location:"" });

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
                      draggable
                      onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; setDragId(ev.id); }}
                      onDragEnd={() => setDragId(null)}
                      className={`rounded-lg px-2 py-1 mb-0.5 group relative cursor-grab active:cursor-grabbing select-none ${dragId===ev.id?"opacity-50":""}`}
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
                  <span key={b.id} draggable onDragStart={()=>setDragId(b.id)} onDragEnd={()=>setDragId(null)}
                    className="educ-chip cursor-grab" style={{background:b.color,color:"#fff"}}>{b.title}</span>
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
  { id:"stf",    title:"STF Group Panata",           subtitle:"Special Task Force group duties",   Icon:Cross,  color:"from-teal to-teal-light" },
  { id:"pulong", title:"Organization Pulong Panata", subtitle:"Broader school organization duties",Icon:School, color:"from-slate-blue to-teal" },
];

const panataTableEntries: Record<PanataCategory, { day:string; timeSlot:string; label:string; venue:string; editable?:boolean }[]> = {
  lokal: [
    {day:"SUN",timeSlot:"06:45–10:00",label:"Tupad",venue:"Sagana Homes 1"},
    {day:"MON",timeSlot:"16:00–16:30",label:"Komiti",venue:"Sagana Condo Bldg 1"},
    {day:"FRI",timeSlot:"16:00–17:30",label:"CICS1 Panata",venue:"Sagana Homes 1"},
    {day:"SAT",timeSlot:"06:45–10:00",label:"CICS2 Panata",venue:"Sagana Condo Bldg 1"},
    {day:"SAT",timeSlot:"10:00–12:00",label:"CICS3 Panata",venue:"Church Main Hall"},
  ],
  stf: [
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

function ScheduleTable({ rows, showSourceType=true, onDelete }: {
  rows: (ScheduleEntry&{id?:number})[]; showSourceType?:boolean; onDelete?:(i:number)=>void;
}) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden" style={{boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-teal-dark text-white text-xs uppercase tracking-wider">
            <th className="px-5 py-3.5 text-left font-semibold w-20">Day</th>
            <th className="px-5 py-3.5 text-left font-semibold w-36">Time Slot</th>
            <th className="px-5 py-3.5 text-left font-semibold">Schedule Label</th>
            <th className="px-5 py-3.5 text-left font-semibold">Venue</th>
            {showSourceType && <th className="px-5 py-3.5 text-left font-semibold">Source/Type</th>}
            <th className="px-5 py-3.5 text-left font-semibold w-28">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0
            ? <tr><td colSpan={showSourceType?6:5} className="px-5 py-12 text-center text-muted-text">No schedules found.</td></tr>
            : rows.map((r,i) => (
              <tr key={i} className={`border-b border-border last:border-0 transition-colors ${i%2===0?"bg-card":"bg-secondary/20"} hover:bg-teal-soft/20`}>
                <td className="px-5 py-3.5">
                  <span className="font-bold text-xs text-teal-dark bg-teal-soft px-2.5 py-1 rounded-lg">{r.day}</span>
                </td>
                <td className="px-5 py-3.5 text-sm text-muted-text font-mono">{r.timeSlot}</td>
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
  const [tab, setTab] = useState<TabId>("major");
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
    <div className="p-7 max-w-6xl">
      <FadeUp>
        <div className="mb-2">
          <h1 className="font-serif text-3xl font-bold text-teal-dark">Comprehensive Schedule View</h1>
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

      {/* PANATA TAB */}
      {tab==="panata" && (
        <>
          {!panataView && (
            <FadeUp delay={80}>
              {/* 3 equal squares */}
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
              <ScheduleTable rows={panataPageRows as ScheduleEntry[]} showSourceType={false} onDelete={handleDeletePanata}/>
              <Pagination total={panataPages} cur={page} set={setPage}/>
            </FadeUp>
          )}
        </>
      )}

      {/* ALL OTHER TABS */}
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
          <ScheduleTable rows={pageRows} showSourceType onDelete={handleDeleteMain}/>
          <Pagination total={totalPages} cur={page} set={setPage}/>
        </FadeUp>
      )}

      {showModal && <AddScheduleModal onClose={()=>setShowModal(false)} onSave={handleSave}/>}
    </div>
  );
}

// ─── Tasks View ───────────────────────────────────────────────────────────────
export function TasksView({ showAssign = false }: { showAssign?: boolean }) {
  const [submitted, setSubmitted] = useState<Record<number,boolean>>({});

  const tasks = [
    {title:"Submit GE 101 Reflection Paper",      due:"Nov 18, 2023",priority:"High",  status:"Todo",       isAttendance:false},
    {title:"Video Team Practice Documentation",   due:"Nov 8, 2023", priority:"Medium",status:"In Progress",isAttendance:false},
    {title:"Attend General Assembly",             due:"Nov 15, 2023",priority:"High",  status:"Todo",       isAttendance:true },
    {title:"Panata Attendance Report",            due:"Nov 20, 2023",priority:"Low",   status:"Done",       isAttendance:false},
  ];

  const priorityStyle: Record<string,string> = {
    High:   "bg-red-500/10 text-red-600 border border-red-300",
    Medium: "bg-amber-500/10 text-amber-600 border border-amber-300",
    Low:    "bg-green-500/10 text-green-700 border border-green-300",
  };
  const statusStyle: Record<string,string> = {
    "Todo":        "bg-slate-100 text-slate-600 border border-slate-200",
    "In Progress": "bg-teal/10 text-teal border border-teal/40",
    "Done":        "bg-green-500/10 text-green-700 border border-green-300",
  };

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl font-bold text-teal-dark">Tasks</h1>
          {showAssign && (
            <button className="flex items-center gap-2 bg-teal text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-teal-dark">
              <Plus className="w-4 h-4"/> Assign Task
            </button>
          )}
        </div>
      </FadeUp>

      {/* Table header */}
      <FadeUp delay={60}>
        <div className="bg-teal-dark text-white rounded-t-xl grid text-xs font-bold uppercase tracking-wider"
          style={{gridTemplateColumns:"1fr 140px 130px 140px 160px"}}>
          <div className="px-5 py-3.5">Task</div>
          <div className="px-5 py-3.5">Due Date</div>
          <div className="px-5 py-3.5">Priority</div>
          <div className="px-5 py-3.5">Status</div>
          <div className="px-5 py-3.5">Action</div>
        </div>
      </FadeUp>

      <div className="border border-border border-t-0 rounded-b-xl overflow-hidden">
        {tasks.map((t,i)=>(
          <FadeUp key={i} delay={80 + i*80}>
            <div
              className={`grid items-center border-b border-border last:border-0 transition-colors hover:bg-secondary/30 ${i%2===0?"bg-card":"bg-secondary/10"}`}
              style={{gridTemplateColumns:"1fr 140px 130px 140px 160px"}}
            >
              {/* Task name */}
              <div className="px-5 py-4 flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${t.status==="Done"?"border-green-500 bg-green-500":"border-border"}`}>
                  {t.status==="Done" && <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span className={`font-semibold text-sm ${t.status==="Done"?"line-through text-muted-text":"text-foreground"}`}>{t.title}</span>
              </div>
              {/* Due date */}
              <div className="px-5 py-4 text-sm text-muted-text">{t.due}</div>
              {/* Priority */}
              <div className="px-5 py-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${priorityStyle[t.priority]}`}>{t.priority}</span>
              </div>
              {/* Status */}
              <div className="px-5 py-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle[t.status]}`}>{t.status}</span>
              </div>
              {/* Action */}
              <div className="px-5 py-4">
                {!t.isAttendance && t.status!=="Done" ? (
                  <button
                    onClick={()=>setSubmitted(s=>({...s,[i]:true}))}
                    disabled={submitted[i]}
                    className={`text-sm font-semibold px-4 py-2 rounded-xl border transition ${
                      submitted[i]
                        ? "bg-green-500/10 text-green-700 border-green-300 cursor-default"
                        : "bg-teal-dark text-white border-teal-dark hover:bg-teal"
                    }`}>
                    {submitted[i] ? "✓ Submitted" : "Submit Task"}
                  </button>
                ) : (
                  <span className="text-sm text-muted-text">—</span>
                )}
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  );
}

// ─── Announcements View ───────────────────────────────────────────────────────
export function AnnouncementsView({ canCreate = false }: { canCreate?: boolean }) {
  const anns = [
    {title:"General Assembly this Saturday",       date:"Nov 4, 2023", scope:"All Students", author:"Super Admin", time:"2h ago",
     content:"Please attend the general assembly this Saturday at 8AM, NEU Gymnasium. Attendance is mandatory for all registered members."},
    {title:"GE 101 Section A — Quiz Postponed",    date:"Nov 6, 2023", scope:"GE Section A", author:"GE Monitor",   time:"5h ago",
     content:"The quiz originally scheduled for Thursday has been moved to Monday next week. Review chapters 4–6."},
    {title:"Video Team Practice Reminder",         date:"Nov 3, 2023", scope:"Video Team",   author:"Team Lead",    time:"1d ago",
     content:"Practice this Wednesday at 5:30PM, Main Studio. Attendance is mandatory. Please bring your equipment."},
  ];

  const events = [
    {month:"NOV", day:"02", title:"STF-NEU Choir Orientation Batch 1", time:"1:00 PM"},
    {month:"NOV", day:"08", title:"CBI Peer Counseling Seminar",        time:"9:00 AM"},
    {month:"NOV", day:"12", title:"DGA Sync Meeting",                   time:"2:00 PM"},
  ];

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-center justify-between mb-7">
          <h1 className="font-serif text-3xl font-bold text-teal-dark">Announcements</h1>
          {canCreate && (
            <button className="flex items-center gap-2 bg-teal text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-teal-dark">
              <Plus className="w-4 h-4"/> Create
            </button>
          )}
        </div>
      </FadeUp>

      <div className="grid grid-cols-5 gap-8">
        {/* Announcements column — 3 out of 5 */}
        <div className="col-span-3">
          <FadeUp delay={60}>
            <h2 className="text-base font-bold text-foreground mb-4 pb-2 border-b border-border">Latest Announcements</h2>
          </FadeUp>
          <div className="space-y-0 divide-y divide-border">
            {anns.map((a,i)=>(
              <FadeUp key={i} delay={80+i*80}>
                <div className="py-5 hover:bg-secondary/20 rounded-lg px-3 -mx-3 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div>
                      <p className="text-xs text-muted-text uppercase tracking-wide font-medium mb-1">{a.date} · {a.author}</p>
                      <h3 className="font-bold text-foreground text-base leading-snug">{a.title}</h3>
                    </div>
                    <span className="text-xs bg-teal-soft text-teal px-2.5 py-1 rounded-full font-medium shrink-0">{a.scope}</span>
                  </div>
                  <p className="text-sm text-muted-text mt-2 leading-relaxed line-clamp-2">{a.content}</p>
                  <p className="text-xs text-muted-text mt-2">{a.time}</p>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={400}>
            <button className="text-sm text-teal font-semibold hover:underline mt-4 flex items-center gap-1">
              All Announcements <ChevronRight className="w-4 h-4"/>
            </button>
          </FadeUp>
        </div>

        {/* Events column — 2 out of 5 */}
        <div className="col-span-2">
          <FadeUp delay={60}>
            <h2 className="text-base font-bold text-foreground mb-4 pb-2 border-b border-border">Upcoming Events</h2>
          </FadeUp>
          <div className="space-y-3">
            {events.map((ev,i)=>(
              <FadeUp key={i} delay={80+i*80}>
                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/30 transition-colors cursor-pointer">
                  {/* Date block */}
                  <div className="bg-teal-dark text-white rounded-xl w-14 h-14 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-wide opacity-80">{ev.month}</span>
                    <span className="text-2xl font-serif font-bold leading-none">{ev.day}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground leading-snug">{ev.title}</p>
                    <p className="text-xs text-muted-text mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3"/>{ev.time}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={400}>
            <button className="text-sm text-teal font-semibold hover:underline mt-4 flex items-center gap-1">
              All Events <ChevronRight className="w-4 h-4"/>
            </button>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}

// ─── Attendance Logs ──────────────────────────────────────────────────────────
export function AttendanceLogsView() {
  const logs = [
    {event:"General Assembly Nov 2023",    date:"Nov 4, 2023",  status:"Present"  as const},
    {event:"GE 101 Class — Week 3",        date:"Nov 8, 2023",  status:"Present"  as const},
    {event:"Video Team Practice",          date:"Nov 8, 2023",  status:"Late"     as const},
    {event:"Panata CICS2 — Nov 11",        date:"Nov 11, 2023", status:"Absent"   as const},
    {event:"Institutional Prayer Session", date:"Nov 15, 2023", status:"Excused"  as const},
  ];
  const s: Record<string,string> = {
    Present:"bg-green-status text-white", Late:"bg-amber-status text-white",
    Absent:"bg-red-status text-white",    Excused:"bg-slate-blue text-white",
  };
  return (
    <div className="p-7">
      <FadeUp>
        <h1 className="font-serif text-3xl font-bold text-teal-dark mb-6">Attendance Logs</h1>
        <div className="bg-card border border-border rounded-xl overflow-hidden" style={{boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
          <table className="w-full text-sm">
            <thead className="bg-teal-dark text-white text-xs uppercase tracking-wider">
              <tr>{["Event","Date","Status"].map(h=><th key={h} className="px-5 py-3.5 text-left font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {logs.map((l,i)=>(
                <tr key={i} className={`border-b border-border last:border-0 ${i%2===0?"bg-card":"bg-secondary/20"}`}>
                  <td className="px-5 py-4 font-medium">{l.event}</td>
                  <td className="px-5 py-4 text-muted-text text-sm">{l.date}</td>
                  <td className="px-5 py-4"><span className={`chip ${s[l.status]}`}>{l.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeUp>
    </div>
  );
}

// ─── Profile View ─────────────────────────────────────────────────────────────
export function ProfileView() {
  return (
    <div className="p-7">
      <FadeUp>
        <h1 className="font-serif text-3xl font-bold text-teal-dark mb-6">My Profile</h1>
        <div className="bg-card border border-border rounded-2xl p-7 max-w-lg" style={{boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
          <div className="flex items-center gap-5 mb-7">
            <div className="w-18 h-18 w-[72px] h-[72px] rounded-full bg-gradient-to-br from-gold to-amber-status grid place-items-center text-2xl font-bold text-teal-dark">AJ</div>
            <div>
              <div className="font-serif font-bold text-teal-dark text-xl">Reb Quinoa Emnacin</div>
              <div className="text-sm text-muted-text mt-0.5">STF-2024-0042 · BS Computer Science · Year 2</div>
            </div>
          </div>
          {[["Email","reb.emnacin@neu.edu.ph"],["Student Number","24-10374-486"],["Course","BS Computer Science"],["Year Level","2nd Year"],["Religion","Iglesia Ni Cristo"]].map(([l,v])=>(
            <div key={l} className="flex justify-between py-3 border-b border-border text-sm last:border-0">
              <span className="text-muted-text font-medium">{l}</span>
              <span className="font-semibold">{v}</span>
            </div>
          ))}
        </div>
      </FadeUp>
    </div>
  );
}

// ─── Settings View ────────────────────────────────────────────────────────────
export function SettingsView() {
  return (
    <div className="p-7">
      <FadeUp>
        <h1 className="font-serif text-3xl font-bold text-teal-dark mb-6">Settings</h1>
        <div className="max-w-lg space-y-5">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-base mb-4">Notifications</h2>
            {["Announcement alerts","Task reminders","Attendance warnings"].map(l=>(
              <div key={l} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <span className="text-sm">{l}</span>
                <button className="w-11 h-6 rounded-full bg-teal relative">
                  <span className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow"/>
                </button>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-base mb-4">Theme</h2>
            <div className="flex gap-3">
              {["Light","Dark","System"].map(t=>(
                <button key={t} className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition ${t==="Light"?"bg-teal text-white border-teal":"border-border hover:bg-secondary"}`}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </FadeUp>
    </div>
  );
}