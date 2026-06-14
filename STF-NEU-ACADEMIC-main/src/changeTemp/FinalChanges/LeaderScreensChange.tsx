import { usePortal } from "./PortalContext";
import { useState, useEffect, useRef, Fragment } from "react";
import {
  X, Download, Copy, RefreshCw, Search, Plus, Edit3, Save,
  Users, QrCode, ScanLine, ClipboardList, Thermometer, Library,
  ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Lock,
  GripVertical, MapPin, Calendar, Send, Pencil, Trash2, Link,
  Upload, FileText, Megaphone, CheckSquare, BarChart2, CalendarCheck,
  BookOpen, CalendarDays, CalendarPlus, User, UserCircle, Activity
} from "lucide-react";

/*
CHANGES
1. [Attendance()] Attendance logger added in GE and Panata group monitor
2. Enhanced heatmap view coloring (either: shades of blue (brightness) or standard shades of yellow green red)
3. [Roster() ] 
  - Add panata group members in panata monitor and ge subject group members in ge monitor
    - Sidebar changes
    - linked to team members or make a new function with different list of students
  - add more subjects responsibility for showcasing a ge group monitor handling 2 or more GE subject groups (multiple rosters)
  - add more sample students, change table formatting: student name, yr level, attendance rate, actions
  - change view as list of long cards per handled monitored groups with stats (no. of students, avg. attendance rate. etc.) and view masterlist button to proceed to the students table
4. [ActionCenterLimited] - Make the audience scope layout more enhanced (like same as the ActionCenter)
5. Add QRGenerator in GE Monitor role
6. Heatmap view - add chevrons to navigate to next/previous week

*/


// ROSTER
// ─── Roster data ──────────────────────────────────────────────────────────────
// 🌟 HIGHLIGHTED CHANGE: Expanded Member type and Mock Data for multi-group support
type Member = {
  initials: string; name: string; id: string; course: string; year: string;
  attendance: string; tasks: string; status: string;
  dept: string; team: string; panata: string; ge: string; email: string; bio: string;
  tasksDone: number; tasksTotal: number; attendancePct: number;
  recentActivity: string;
};

export const roster: Member[] = [
  { initials:"NP", name:"Natalie Portman",  id:"STF-2022-0101", course:"BS Nursing",       year:"Junior",    attendance:"95%", tasks:"88%", status:"Active",   dept:"CICS", team:"Video Team 104", panata:"CICS2 - Panata", ge:"GE 101 - Sec A",  email:"natalie.portman@neu.edu.ph",  bio:"Visual storyteller.", tasksDone:22, tasksTotal:25, attendancePct:95, recentActivity:"Submitted Week 8 footage" },
  { initials:"AA", name:"Alex Ammin",       id:"STF-2022-0102", course:"BS IT",            year:"Sophomore", attendance:"87%", tasks:"72%", status:"Active",   dept:"CICS", team:"Video Team 104", panata:"CICS2 - Panata", ge:"GE 101 - Sec A",  email:"alex.ammin@neu.edu.ph",       bio:"Backend dev.", tasksDone:18, tasksTotal:25, attendancePct:87, recentActivity:"Edited promo reel" },
  { initials:"BA", name:"Ben Affleck",      id:"STF-2021-0088", course:"BS Civil Eng",     year:"Senior",    attendance:"91%", tasks:"95%", status:"Active",   dept:"CEA",  team:"Video Team 104", panata:"CEA1 - Panata",  ge:"GE 102 - Sec B",  email:"ben.affleck@neu.edu.ph",      bio:"Senior videographer.", tasksDone:24, tasksTotal:25, attendancePct:91, recentActivity:"Led direction" },
  { initials:"MS", name:"Maria Santos",     id:"STF-2023-0103", course:"BA Comm",          year:"Freshman",  attendance:"76%", tasks:"60%", status:"Active",   dept:"CAS",  team:"Creative Team A",panata:"CAS2 - Panata",  ge:"GE 101 - Sec A",  email:"maria.santos@neu.edu.ph",     bio:"Scriptwriter.", tasksDone:15, tasksTotal:25, attendancePct:76, recentActivity:"Drafted script" },
  { initials:"JR", name:"Jose Reyes",       id:"STF-2023-0104", course:"BS Psychology",    year:"Freshman",  attendance:"82%", tasks:"55%", status:"Active",   dept:"CAS",  team:"Video Team 104", panata:"CAS2 - Panata",  ge:"LIT 101 - Sec C", email:"jose.reyes@neu.edu.ph",       bio:"Drone operator.", tasksDone:14, tasksTotal:25, attendancePct:82, recentActivity:"Submitted output" },
  { initials:"AC", name:"Ana Cruz",         id:"STF-2022-0105", course:"BS Accountancy",   year:"Junior",    attendance:"65%", tasks:"40%", status:"On Leave", dept:"COA",  team:"Creative Team A",panata:"COA1 - Panata",  ge:"GE 102 - Sec B",  email:"ana.cruz@neu.edu.ph",         bio:"Documentary editor.", tasksDone:10, tasksTotal:25, attendancePct:65, recentActivity:"Last active: Oct 12" },
  { initials:"DL", name:"Diego Luna",       id:"STF-2022-0106", course:"BS Criminology",   year:"Sophomore", attendance:"88%", tasks:"79%", status:"Active",   dept:"COC",  team:"Video Team 104", panata:"COC1 - Panata",  ge:"GE 101 - Sec A",  email:"diego.luna@neu.edu.ph",       bio:"AV tech.", tasksDone:20, tasksTotal:25, attendancePct:88, recentActivity:"Set up livestream" },
  { initials:"RG", name:"Rosa Gomez",       id:"STF-2023-0107", course:"BS Midwifery",     year:"Freshman",  attendance:"92%", tasks:"83%", status:"Active",   dept:"CMT",  team:"Video Team 104", panata:"CMT1 - Panata",  ge:"LIT 101 - Sec C", email:"rosa.gomez@neu.edu.ph",       bio:"Photography lead.", tasksDone:21, tasksTotal:25, attendancePct:92, recentActivity:"Uploaded photo archive" },
  { initials:"EJ", name:"Elijah Jones",     id:"STF-2022-0201", course:"BS Architecture",  year:"Junior",    attendance:"80%", tasks:"85%", status:"Active",   dept:"CEA",  team:"Creative Team A",panata:"CEA1 - Panata",  ge:"GE 102 - Sec B",  email:"elijah.jones@neu.edu.ph",     bio:"Set designer.", tasksDone:20, tasksTotal:25, attendancePct:80, recentActivity:"Reviewed set layout" },
  { initials:"KP", name:"Kevin Park",       id:"STF-2023-0205", course:"BS IT",            year:"Freshman",  attendance:"98%", tasks:"90%", status:"Active",   dept:"CICS", team:"Creative Team A",panata:"CICS2 - Panata", ge:"GE 101 - Sec A",  email:"kevin.park@neu.edu.ph",       bio:"Motion graphics.", tasksDone:23, tasksTotal:25, attendancePct:98, recentActivity:"Exported lower thirds" },
];


// ─── Roster ───────────────────────────────────────────────────────────────────
// 🌟 HIGHLIGHTED CHANGE: Completely refactored Roster component to support Long Cards / Overview state 
// and dynamic groupings based on role (GE Monitor handles multiple subjects, etc.)
export function Roster() {
  const { role } = usePortal(); // Fetch role to determine which groups to show
  
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [search, setSearch]           = useState("");
  const [viewMode, setViewMode]       = useState<"list" | "grid">("list");
  
  const [viewMember, setViewMember]   = useState<Member | null>(null);
  const [msgMember, setMsgMember]     = useState<Member | null>(null);
  const [subsMember, setSubsMember]   = useState<Member | null>(null);

  // 1. Determine Groups based on Role
  const myGroups = (() => {
    if (role === "ge-monitor") return ["GE 101 - Sec A", "GE 102 - Sec B", "LIT 101 - Sec C"];
    if (role === "panata-monitor") return ["CICS2 - Panata", "CAS2 - Panata"];
    return ["Video Team 104", "Creative Team A"]; // default/leader
  })();

  const filterKey = role === "ge-monitor" ? "ge" : role === "panata-monitor" ? "panata" : "team";

  // ─── STATE 1: GROUP OVERVIEW (Long Cards) ─────────────────────────────────
  if (!activeGroup) {
    return (
      <div className="p-7">
        <FadeUp>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="font-serif text-3xl font-bold text-teal-dark">Rosters & Masterlists</h1>
              <p className="text-sm text-muted-text mt-1">Select a group to view its members</p>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-teal-soft text-teal border border-teal/20">
              {role === "ge-monitor" ? "GE Monitor View" : role === "panata-monitor" ? "Panata View" : "Leader View"}
            </span>
          </div>
        </FadeUp>

        <div className="space-y-4">
          {myGroups.map((group, i) => {
            // Aggregate stats per group
            const groupMembers = roster.filter(r => r[filterKey] === group);
            const total = groupMembers.length;
            const avgAtt = total > 0 
              ? Math.round(groupMembers.reduce((acc, curr) => acc + curr.attendancePct, 0) / total) 
              : 0;

            return (
              <FadeUp key={group} delay={i * 60}>
                <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between hover:border-teal/50 transition-all shadow-sm group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-soft flex items-center justify-center text-teal-dark shrink-0">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{group}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-text font-medium">
                        <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-teal" /> {total} Students</span>
                        <span className="flex items-center gap-1.5"><CalendarCheck className="w-4 h-4 text-teal" /> {avgAtt}% Avg. Attendance</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveGroup(group)} 
                    className="bg-teal text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-teal-dark transition flex items-center gap-2"
                  >
                    View Masterlist <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── STATE 2: DETAILED MASTERLIST (Table/Grid) ────────────────────────────
  // Filter members by the selected group, then by search query
  const groupRoster = roster.filter(r => r[filterKey] === activeGroup);
  const filtered = groupRoster.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.id.includes(search) ||
    r.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => { setActiveGroup(null); setSearch(""); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition"
          >
            <ChevronLeft className="w-4 h-4" /> Groups
          </button>
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">{activeGroup}</h1>
            <p className="text-sm text-muted-text mt-0.5">Masterlist · {groupRoster.length} total members</p>
          </div>
          <span className="ml-auto text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-teal-soft text-teal border border-teal/20">
            Filtered View
          </span>
        </div>
      </FadeUp>
      
      <FadeUp delay={60}>
        <SectionCard
          icon={Users}
          title="Student Roster"
          action={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-text" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students…"
                  className="pl-9 pr-3 py-2 text-sm border border-border rounded-xl bg-card w-52 focus:outline-none focus:ring-2 focus:ring-teal/30" />
              </div>
              <div className="flex border border-border rounded-xl overflow-hidden">
                <button onClick={() => setViewMode("list")} title="List view"
                  className={`px-3 py-2 text-xs transition flex items-center gap-1.5 font-semibold ${viewMode === "list" ? "bg-teal text-white" : "bg-card text-muted-text hover:bg-secondary"}`}>
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3" width="12" height="2" rx="1"/><rect x="2" y="7" width="12" height="2" rx="1"/><rect x="2" y="11" width="12" height="2" rx="1"/></svg>
                  List
                </button>
                <button onClick={() => setViewMode("grid")} title="Card view"
                  className={`px-3 py-2 text-xs transition flex items-center gap-1.5 font-semibold border-l border-border ${viewMode === "grid" ? "bg-teal text-white" : "bg-card text-muted-text hover:bg-secondary"}`}>
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></svg>
                  Cards
                </button>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-teal text-teal rounded-xl font-semibold hover:bg-teal hover:text-white transition">
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            </div>
          }
        >
          {viewMode === "list" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-teal-dark text-white text-xs uppercase tracking-wider">
                    {/* 🌟 HIGHLIGHTED CHANGE: Simplified table columns as requested */}
                    {["","Student Name","Yr Level","Attendance Rate","Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id} className={`border-b border-border last:border-0 transition-colors ${i % 2 === 0 ? "bg-card" : "bg-secondary/20"} hover:bg-teal-soft/20`}>
                      <td className="px-4 py-3 w-12"><AvatarSVG initials={r.initials} size={32} isOnLeave={r.status !== "Active"} className="rounded-full" /></td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-foreground">{r.name}</div>
                        <div className="text-[11px] font-mono text-muted-text mt-0.5">{r.id} · {r.course}</div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{r.year}</td>
                      <td className="px-4 py-3 w-48">
                        <span className={`text-sm font-bold ${r.attendancePct >= 80 ? "text-green-700" : "text-red-status"}`}>{r.attendance}</span>
                        <MiniBar pct={r.attendancePct} color={r.attendancePct >= 80 ? "var(--green-status)" : "var(--red-status)"} />
                      </td>
                      <td className="px-4 py-3 w-56">
                        <div className="flex gap-1.5">
                          <button onClick={() => setViewMember(r)} className="px-2.5 py-1.5 rounded-lg border border-teal text-teal text-xs font-semibold hover:bg-teal hover:text-white transition">View</button>
                          <button onClick={() => setMsgMember(r)} className="px-2.5 py-1.5 rounded-lg border border-border text-muted-text text-xs font-semibold hover:bg-secondary transition flex items-center gap-1"><Send className="w-3 h-3" />Msg</button>
                          <button onClick={() => setSubsMember(r)} className="px-2.5 py-1.5 rounded-lg border border-border text-muted-text text-xs font-semibold hover:bg-secondary transition flex items-center gap-1"><ClipboardList className="w-3 h-3" />Tasks</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                     <tr><td colSpan={5} className="text-center text-muted-text py-12 text-sm">No students found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {viewMode === "grid" && (
            <div className="p-5 grid grid-cols-3 gap-3">
              {filtered.map(r => (
                <MemberCard key={r.id} member={r} onView={() => setViewMember(r)} onMessage={() => setMsgMember(r)} onSubmissions={() => setSubsMember(r)} />
              ))}
              {filtered.length === 0 && <div className="col-span-3 text-center text-muted-text py-16 text-sm">No students match your search.</div>}
            </div>
          )}
          
          <div className="flex justify-between items-center px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-text">Showing {filtered.length} of {groupRoster.length} students</span>
            <div className="flex gap-1">
              {["‹","1","2","3","›"].map(p => (
                <button key={p} className="w-7 h-7 rounded-lg border border-border bg-card text-xs hover:bg-secondary transition">{p}</button>
              ))}
            </div>
          </div>
        </SectionCard>
      </FadeUp>

      {/* Modals remain structurally identical, just called from the refactored view */}
      {viewMember && <ProfileModal member={viewMember} onClose={() => setViewMember(null)} onMessage={() => { setViewMember(null); setMsgMember(viewMember); }} />}
      {msgMember && <MessageModal member={msgMember} onClose={() => setMsgMember(null)} />}
      {subsMember && <SubmissionsModal member={subsMember} onClose={() => setSubsMember(null)} />}
    </div>
  );
}

// --- GE ATTENDANCE ---

export const geSessions = [
  ["Sosyedad at Literatura Group 1 Class","Class","Aug 3, 2025","6:45–10AM",14,0,1,0,96],
  ["PE 4 Group 3 Class","Class","Aug 10, 2025","2:30–3PM",13,0,1,1,96]
];

export function GEAttendance() {
  // HIGHLIGHT: Added mainTab switcher state to toggle between Records and Logger
  const [mainTab, setMainTab] = useState<"records" | "logger">("records");
  const [viewSession, setViewSession] = useState<any[] | null>(null);
  const [tab, setTab] = useState("ALL");
  const pct = 93;
  const r = 36; const circ = 2 * Math.PI * r;
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 200); return () => clearTimeout(t); }, []);

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">Course Attendance</h1>
            <p className="text-sm text-muted-text mt-1">GE 101 — Section A · Course Records</p>
          </div>
          <span className="chip bg-teal-soft text-teal text-sm px-3 py-1">GE Monitor View</span>
        </div>
      </FadeUp>


      {/* HIGHLIGHT: Added standard Sub-Tabs layout switcher navigation */}
      <FadeUp delay={40}>
        <div className="flex gap-0 border-b border-border mb-6">
          {([["records","Session Records"],["logger","Attendance Logger"]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setMainTab(key)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-all ${
                mainTab === key ? "border-teal-dark text-teal-dark" : "border-transparent text-foreground/50 hover:text-teal-dark hover:border-teal/40"
              }`}>{label}</button>
          ))}
        </div>
      </FadeUp>


      {/* HIGHLIGHT: Wrapped interactive visual board into conditions checking for "records" */}
      {mainTab === "records" && (<>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <FadeUp delay={60}>
            <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
              <div className="relative w-20 h-20 shrink-0">
                <svg viewBox="0 0 100 100" className="-rotate-90 w-20 h-20">
                  <circle cx="50" cy="50" r={r} stroke="var(--muted)" strokeWidth="14" fill="none" />
                  <circle cx="50" cy="50" r={r} stroke="var(--green-status)" strokeWidth="14" fill="none" strokeLinecap="round"
                    style={{ strokeDasharray: go ? `${(pct/100)*circ} ${circ}` : `0 ${circ}`, strokeDashoffset: -circ*0.25, transition: "stroke-dasharray 0.75s linear" }} />
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <span className="font-serif font-bold text-teal-dark text-lg">{pct}%</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-text">Overall Attendance</div>
                <div className="font-serif text-2xl font-bold text-teal-dark">{pct}%</div>
                <div className="text-xs text-muted-text mt-0.5">5 sessions</div>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={100}><StatCard label="Sessions Tracked" value="5" sub="This semester" /></FadeUp>
          <FadeUp delay={140}><StatCard label="Students at Risk" value="1 ⚠" accent sub="Below 75% threshold" /></FadeUp>
        </div>


        <FadeUp delay={220}>
          <SectionCard icon={ClipboardList} title="Session Log">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-teal-dark text-white uppercase tracking-wider">
                    {["Session Name","Type","Date","Time","Present","Absent","Late","Excused","Rate %","Sheet"].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {geSessions.map((s, i) => (
                    <tr key={i} className={`border-b border-border transition-colors ${i%2===0?"bg-card hover:bg-teal-soft/20":"bg-secondary/20 hover:bg-teal-soft/20"}`}>
                      {s.map((c, j) => (
                        <td key={j} className={`px-4 py-3.5 ${j===8?"font-bold text-green-700":""}`}>
                          {j===1
                            ? <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-soft text-teal-dark border border-teal/20">{c}</span>
                            : j===8 ? `${c}%` : c}
                        </td>
                      ))}
                      <td className="px-4 py-3.5">
                        <button onClick={() => setViewSession(s)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal text-teal text-[11px] font-semibold hover:bg-teal hover:text-white transition whitespace-nowrap">
                          <ClipboardList className="w-3 h-3" /> View Sheet
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </FadeUp>
      </>)}


      {/* HIGHLIGHT: Added layout integration hooks for attendance registration module fallback */}
      {mainTab === "logger" && <AttendanceLogger />}


      {viewSession && <SessionAttendanceModal session={viewSession} onClose={() => setViewSession(null)} />}
    </div>
  );
}

// ─── Panata Attendance (Refactored to match TeamAttendance) ────────────────────
// NEED to add venue
const panataSessions = [
  ["Panata — CICS1","Panata","Aug 3, 2025","9PM–9:30PM",14,0,1,0,96],
  ["Panata — CICS1","Panata","Aug 24, 2025","12:45NN–1:15PM",12,1,1,0,89],
];


export function PanataAttendance() {
  // HIGHLIGHT: Added mainTab switcher state to toggle between Records and Logger
  const [mainTab, setMainTab] = useState<"records" | "logger">("records");
  const [viewSession, setViewSession] = useState<any[] | null>(null);
  const [tab, setTab] = useState("ALL");
  const pct = 95;
  const r = 36; const circ = 2 * Math.PI * r;
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 200); return () => clearTimeout(t); }, []);


  const filters = ["ALL","TUPAD","PULONG PANATA","KOMITI"];


  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">Panata Attendance</h1>
            <p className="text-sm text-muted-text mt-1">CICS2 — Panata Group · Session Records</p>
          </div>
          <span className="chip bg-teal-soft text-teal text-sm px-3 py-1">Panata Monitor View</span>
        </div>
      </FadeUp>


      {/* HIGHLIGHT: Added standard Sub-Tabs layout switcher navigation */}
      <FadeUp delay={40}>
        <div className="flex gap-0 border-b border-border mb-6">
          {([["records","Session Records"],["logger","Attendance Logger"]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setMainTab(key)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-all ${
                mainTab === key ? "border-teal-dark text-teal-dark" : "border-transparent text-foreground/50 hover:text-teal-dark hover:border-teal/40"
              }`}>{label}</button>
          ))}
        </div>
      </FadeUp>


      {/* HIGHLIGHT: Wrapped interactive visual board into conditions checking for "records" */}
      {mainTab === "records" && (<>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <FadeUp delay={60}>
            <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
              <div className="relative w-20 h-20 shrink-0">
                <svg viewBox="0 0 100 100" className="-rotate-90 w-20 h-20">
                  <circle cx="50" cy="50" r={r} stroke="var(--muted)" strokeWidth="14" fill="none" />
                  <circle cx="50" cy="50" r={r} stroke="var(--green-status)" strokeWidth="14" fill="none" strokeLinecap="round"
                    style={{ strokeDasharray: go ? `${(pct/100)*circ} ${circ}` : `0 ${circ}`, strokeDashoffset: -circ*0.25, transition: "stroke-dasharray 0.75s linear" }} />
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <span className="font-serif font-bold text-teal-dark text-lg">{pct}%</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-text">Overall Attendance</div>
                <div className="font-serif text-2xl font-bold text-teal-dark">{pct}%</div>
                <div className="text-xs text-muted-text mt-0.5">5 sessions</div>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={100}><StatCard label="Sessions Tracked" value="5" sub="This semester" /></FadeUp>
          <FadeUp delay={140}><StatCard label="Members at Risk" value="0" sub="All above threshold" /></FadeUp>
        </div>


        <FadeUp delay={180}>
          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
            {filters.map(f => (
              <button key={f} onClick={() => setTab(f)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition ${tab === f ? "bg-teal text-white" : "bg-card border border-border hover:bg-secondary"}`}>
                {f}
              </button>
            ))}
          </div>
        </FadeUp>


        <FadeUp delay={220}>
          <SectionCard icon={ClipboardList} title="Panata Session Log">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-teal-dark text-white uppercase tracking-wider">
                    {["Session Name","Type","Date","Time","Present","Absent","Late","Excused","Rate %","Sheet"].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {panataSessions.map((s, i) => (
                    <tr key={i} className={`border-b border-border transition-colors ${i%2===0?"bg-card hover:bg-teal-soft/20":"bg-secondary/20 hover:bg-teal-soft/20"}`}>
                      {s.map((c, j) => (
                        <td key={j} className={`px-4 py-3.5 ${j===8?"font-bold text-green-700":""}`}>
                          {j===1
                            ? <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-soft text-teal-dark border border-teal/20">{c}</span>
                            : j===8 ? `${c}%` : c}
                        </td>
                      ))}
                      <td className="px-4 py-3.5">
                        <button onClick={() => setViewSession(s)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal text-teal text-[11px] font-semibold hover:bg-teal hover:text-white transition whitespace-nowrap">
                          <ClipboardList className="w-3 h-3" /> View Sheet
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </FadeUp>
      </>)}


      {/* HIGHLIGHT: Added layout integration hooks for attendance registration module fallback */}
      {mainTab === "logger" && <AttendanceLogger />}


      {viewSession && <SessionAttendanceModal session={viewSession} onClose={() => setViewSession(null)} />}
    </div>
  );
}


export function HeatmapView({ scope = "Video Team 104", banner }: { scope?: string; banner?: string }) {
  const [selected, setSelected] = useState<{ dayIdx: number; hourIdx: number } | null>(null);
  const [viewMember, setViewMember] = useState<Member | null>(null);
  const [msgMember, setMsgMember]   = useState<Member | null>(null);
  
  // 🌟 HIGHLIGHTED CHANGE: New state variable for navigating weeks
  const [weekOffset, setWeekOffset] = useState(0);

  if (selected !== null) {
    const { dayIdx, hourIdx } = selected;
    const day = HEATMAP_DAYS[dayIdx];
    const hour = HEATMAP_HOURS[hourIdx];
    
    // 🌟 HIGHLIGHTED CHANGE: Pass weekOffset to data functions
    const availableInitials = getAvailableInitialsForCell(dayIdx, hourIdx, weekOffset);
    const cell = heatCell(dayIdx, hourIdx, weekOffset);

    return (
      <div className="p-7">
        <FadeUp>
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setSelected(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition">
              <ChevronLeft className="w-4 h-4" /> Back to Heatmap
            </button>
            <div>
              <h1 className="font-serif text-3xl font-bold text-teal-dark">{day} · {hour}</h1>
              <p className="text-sm text-muted-text mt-0.5">{scope} — Member Availability</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-teal-soft border border-teal/20 text-sm font-bold text-teal-dark">
                {availableInitials.length} / {roster.length} available
              </div>
              <span className="text-sm font-bold px-3 py-1.5 rounded-xl text-white"
                style={{ background: cell.pct >= 80 ? "var(--teal-dark)" : cell.pct >= 50 ? "var(--teal)" : cell.pct >= 30 ? "#d97706" : "#ef4444" }}>
                {cell.pct}% availability
              </span>
            </div>
          </div>
        </FadeUp>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Available", value: availableInitials.length, color: "text-green-700" },
            { label: "Unavailable", value: roster.length - availableInitials.length, color: "text-red-status" },
            { label: "Availability Rate", value: `${cell.pct}%`, color: "text-teal-dark" },
          ].map(({ label, value, color }, i) => (
            <FadeUp key={label} delay={i * 60}>
              <div className="bg-card border border-border rounded-xl px-4 py-3.5">
                <div className="text-xs text-muted-text font-medium">{label}</div>
                <div className={`font-serif text-2xl font-bold mt-0.5 ${color}`}>{value}</div>
              </div>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={180}>
          <SectionCard icon={CheckCircle} title={`Available (${availableInitials.length})`}>
            <div className="p-5 grid grid-cols-3 gap-3">
              {availableInitials.map(initials => {
                const member = INITIALS_MAP[initials];
                if (!member) return null;
                return (
                  <MemberCard key={initials} member={member}
                    onView={() => setViewMember(member)}
                    onMessage={() => setMsgMember(member)}
                    onSubmissions={() => {}} />
                );
              })}
            </div>
          </SectionCard>
        </FadeUp>
        {viewMember && <ProfileModal member={viewMember} onClose={() => setViewMember(null)} onMessage={() => { setViewMember(null); setMsgMember(viewMember); }} />}
        {msgMember && <MessageModal member={msgMember} onClose={() => setMsgMember(null)} />}
      </div>
    );
  }

  return (
    <div className="p-7">
      <FadeUp>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-teal-dark">Availability Heatmap</h1>
                  <p className="text-sm text-muted-text mt-1">{scope} — Click any cell to see member availability</p>
                </div>
                <div className="flex items-center gap-4">
                  
                  {/* 🌟 HIGHLIGHTED CHANGE: The new Chevron Navigation Controls */}
                  <div className="flex items-center gap-2 bg-card border border-border rounded-xl p-1 shadow-sm">
                    <button 
                      onClick={() => setWeekOffset(w => w - 1)} 
                      title="Previous Week"
                      className="p-1.5 rounded-lg text-muted-text hover:bg-secondary hover:text-foreground transition active:scale-95"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold w-24 text-center text-teal-dark select-none tracking-wide">
                      {weekOffset === 0 ? "Current Week" : weekOffset === 1 ? "Next Week" : weekOffset === -1 ? "Last Week" : `Week ${weekOffset > 0 ? '+' : ''}${weekOffset}`}
                    </span>
                    <button 
                      onClick={() => setWeekOffset(w => w + 1)} 
                      title="Next Week"
                      className="p-1.5 rounded-lg text-muted-text hover:bg-secondary hover:text-foreground transition active:scale-95"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Original filters */}
                  <div className="flex items-center gap-2">
                    {["All Departments","All Courses","All Panata Groups","All STF Teams"].map(opt => (
                      <select key={opt} className="text-xs border border-border rounded-xl px-3 py-2 bg-card focus:outline-none focus:ring-2 focus:ring-teal/30">
                        <option>{opt}</option>
                      </select>
                    ))}
                  </div>
                </div>
              </div>
      </FadeUp>

      {banner && (
        <FadeUp delay={40}>
          <div className="bg-amber-status/10 border border-amber-status/40 rounded-xl p-3 text-xs font-medium text-foreground mb-5">⚠ {banner}</div>
        </FadeUp>
      )}

      <div className="grid grid-cols-12 gap-5">
        <FadeUp delay={80} className="col-span-9">
          <SectionCard icon={Thermometer} title="Weekly Availability Grid — click a cell to view members">
            <div className="p-4">
              <div className="grid" style={{ gridTemplateColumns: "56px repeat(7, 1fr)" }}>
                <div />
                {HEATMAP_DAYS.map(d => (
                  <div key={d} className="text-center text-xs font-bold text-teal-dark py-2 uppercase tracking-wider">{d}</div>
                ))}
                {HEATMAP_HOURS.map((h, hi) => (
                  <Fragment key={"row" + hi}>
                    <div className="text-xs text-muted-text py-2 font-mono flex items-center">{h}</div>
                    {HEATMAP_DAYS.map((_, di) => {
                      
                      // 🌟 HIGHLIGHTED CHANGE: Pass weekOffset to loops calculating grid values
                      const c = heatCell(di, hi, weekOffset);
                      const availCount = getAvailableInitialsForCell(di, hi, weekOffset).length;
                      const cellBg = heatCellColor(c.pct);

                      return (
                        <div key={`${di}-${hi}`} className="group relative" style={{ isolation: "isolate" }}>
                          <div
                            onClick={() => setSelected({ dayIdx: di, hourIdx: hi })}
                            className="h-8 m-0.5 rounded-lg cursor-pointer transition-all hover:scale-105 hover:ring-2 hover:ring-teal/50"
                            style={{ background: cellBg }}
                          />
                          <div className="hidden group-hover:block pointer-events-none"
                            style={{ position: "absolute", zIndex: 9999, bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)" }}>
                            <div className="bg-teal-dark text-white text-[10px] p-2.5 rounded-xl whitespace-nowrap shadow-xl"
                              style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                              
                              {/* 🌟 HIGHLIGHTED CHANGE: Tooltip shows the modified percentage */}
                              <div className="font-bold mb-1.5">{HEATMAP_DAYS[di]}, {h} — {c.pct}% available</div>
                              
                              <div className="flex gap-1 flex-wrap max-w-[140px] mb-1.5">
                                {getAvailableInitialsForCell(di, hi, weekOffset).slice(0, 6).map(x => (
                                  <span key={x} className="w-5 h-5 rounded-full bg-white/20 grid place-items-center text-[8px] font-bold">{x.slice(0,2)}</span>
                                ))}
                                {availCount > 6 && <span className="text-[9px] text-white/70 self-center ml-0.5">+{availCount - 6}</span>}
                              </div>
                              <div className="text-white/60 text-[9px]">Click to view all</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </Fragment>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-xs flex-wrap">
                <span className="text-muted-text font-semibold">Members available:</span>
                {[
                  { bg: "#8A151B", border: "1px solid var(--border)", label: "0–20%" },   // Dark Red
                    { bg: "#F28B8B", border: "none", label: "20–40%" },                  // Salmon
                    { bg: "#FDE073", border: "none", label: "40–60%" },                  // Yellow
                    { bg: "#8BCC7A", border: "none", label: "60–80%" },                  // Light Green
                    { bg: "#1E7145", border: "none", label: "80–100%" }                  // Dark Green
                ].map(({ bg, border, label }) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded inline-block" style={{ background: bg, border }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </SectionCard>
        </FadeUp>

        <div className="col-span-3 space-y-4">
          <FadeUp delay={100}>
            <SectionCard icon={CheckCircle} title="Most Available">
              <ul className="px-5 py-3 space-y-2.5">
                {[["Wed 2 PM","90%"],["Thu 1 PM","88%"],["Fri 3 PM","82%"]].map(([slot, pct]) => (
                  <li key={slot} className="flex justify-between items-center text-sm border-b border-border last:border-0 pb-2.5 last:pb-0">
                    <button className="text-muted-text hover:text-teal-dark transition text-left"
                      onClick={() => {
                        const dMap: Record<string, number> = { Mon:0, Tue:1, Wed:2, Thu:3, Fri:4, Sat:5, Sun:6 };
                        const hMap: Record<string, number> = { "8 AM":0, "9 AM":1, "10 AM":2, "11 AM":3, "12 PM":4, "1 PM":5, "2 PM":6, "3 PM":7, "4 PM":8, "5 PM":9, "6 PM":10, "7 PM":11, "8 PM":12 };
                        const parts = slot.split(" ");
                        const d = parts[0]; const hh = parts.slice(1).join(" ");
                        setSelected({ dayIdx: dMap[d] ?? 0, hourIdx: hMap[hh] ?? 0 });
                      }}>{slot}</button>
                    <strong className="text-green-700">{pct}</strong>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </FadeUp>
          <FadeUp delay={140}>
            <SectionCard icon={AlertCircle} title="Least Available">
              <ul className="px-5 py-3 space-y-2.5">
                {[["Mon 8 AM","15%"],["Tue 9 AM","22%"],["Sat 6 PM","18%"]].map(([slot, pct]) => (
                  <li key={slot} className="flex justify-between items-center text-sm border-b border-border last:border-0 pb-2.5 last:pb-0">
                    <span className="text-muted-text">{slot}</span>
                    <strong className="text-red-status">{pct}</strong>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}


// ─── Action Center Limited (Announcement + Task only, SVG icons) ──────────────
type LimitedTab = "announcement" | "task";

const SVG_ICONS = {
  announcement: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M3 11l19-9-9 19-2-8-8-2z"/>
    </svg>
  ),
  task: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="9 11 12 14 22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
};

export function ActionCenterLimited({ scope = "Group" }: { scope?: string }) {
  const [activeTab, setActiveTab] = useState<LimitedTab>("announcement");
  const [sent, setSent] = useState(false);

  const [annTitle, setAnnTitle] = useState("");
  const [annBody, setAnnBody] = useState("");
  const [annScope, setAnnScope] = useState("All Members");
  const [annEffStart, setAnnEffStart] = useState("2026-06-08");
  const [annEffEnd, setAnnEffEnd] = useState("2026-06-30");
  const [annPriority, setAnnPriority] = useState("Normal");

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskScope, setTaskScope] = useState("All Members");
  const [taskDeadline, setTaskDeadline] = useState("2026-06-15T23:59");
  const [taskPriority, setTaskPriority] = useState("Normal");
  const [taskGraded, setTaskGraded] = useState(false);
  const [taskPoints, setTaskPoints] = useState("100");
  const [taskEffStart, setTaskEffStart] = useState("2026-06-08");
  const [taskEffEnd, setTaskEffEnd] = useState("2026-06-30");

  const inputCls = "w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:ring-2 focus:ring-teal/30 text-foreground";
  const selectCls = inputCls;

  const TABS: { id: LimitedTab; label: string }[] = [
    { id: "announcement", label: "ANNOUNCEMENT" },
    { id: "task",         label: "TASK" },
  ];

  return (
    <div className="p-7">
      <FadeUp>
        <div className="mb-1">
          <h1 className="font-serif text-3xl font-bold text-teal-dark">Action Center</h1>
          <p className="text-sm text-muted-text mt-1">Compose and dispatch · Scope: {scope}</p>
        </div>
      </FadeUp>

      <FadeUp delay={30}>
        <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-xl px-4 py-2.5 text-xs font-medium text-foreground mt-4">
          <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          Your scope is limited to: <strong className="text-teal-dark ml-0.5">{scope}</strong>
        </div>
      </FadeUp>

      <FadeUp delay={60}>
        <div className="flex border-b border-border mt-5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 -mb-px transition-all whitespace-nowrap ${
                activeTab === t.id ? "border-teal-dark text-teal-dark" : "border-transparent text-foreground/50 hover:text-teal-dark hover:border-teal/40"
              }`}>
              <span className={activeTab === t.id ? "text-teal-dark" : "text-muted-text"}>
                {SVG_ICONS[t.id]}
              </span>
              {t.label}
            </button>
          ))}
        </div>
      </FadeUp>

      <FadeUp delay={100}>
        <div className="bg-card border border-border rounded-2xl mt-5 overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <span className="text-sm font-semibold text-foreground capitalize">{activeTab}</span>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-muted-text hover:bg-secondary transition">
                <BookOpen className="w-3.5 h-3.5" /> Load Template
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-muted-text hover:bg-secondary transition">
                <Save className="w-3.5 h-3.5" /> Save as Template
              </button>
            </div>
          </div>

          {/* HIGHLIGHT: Transformed to 12-column grid layout identical to ActionCenter */}
          <div className="grid grid-cols-12 gap-5 p-5">
            
            {/* HIGHLIGHT: NEW Left Sidebar for Scope & Effectivity */}
            <div className="col-span-4 space-y-3">
              <div className="text-xs font-bold text-muted-text uppercase tracking-wider">Audience / Scope</div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-sm space-y-2 max-h-80 overflow-y-auto">
                <label className="flex items-center gap-2 font-semibold">
                  <input type="checkbox" defaultChecked className="accent-teal"/> {scope}
                </label>
                <div className="pl-5 space-y-1.5 text-xs">
                  <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="accent-teal"/> All Members</label>
                  <label className="flex items-center gap-2"><input type="checkbox" className="accent-teal"/> Leads Only</label>
                  <label className="flex items-center gap-2"><input type="checkbox" className="accent-teal"/> Monitors Only</label>
                  <div className="text-muted-text font-bold mt-2 pt-1 border-t border-border">Specific People</div>
                  {["Natalie Portman", "Alex Ammin", "Ben Affleck", "Maria Santos"].map(n => (
                    <label key={n} className="flex items-center gap-2"><input type="checkbox" className="accent-teal"/> {n}</label>
                  ))}
                </div>
              </div>
              <div className="bg-teal-soft border border-teal/30 rounded-xl p-3 text-xs">
                <strong>Reach preview:</strong> this will be sent to <strong>55</strong> members in <strong>{scope}</strong>.
              </div>
              
              <div className="space-y-2">
                <div className="text-xs font-bold text-muted-text uppercase tracking-wider">Effectivity</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-muted-text">Start</label>
                    {/* HIGHLIGHT: Automatically switches bound state based on Active Tab */}
                    <input type="date" 
                      value={activeTab === "announcement" ? annEffStart : taskEffStart} 
                      onChange={e => activeTab === "announcement" ? setAnnEffStart(e.target.value) : setTaskEffStart(e.target.value)} 
                      className="w-full mt-0.5 px-2 py-1.5 border border-border rounded-lg text-xs bg-background"/>
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-text">End</label>
                    <input type="date" 
                      value={activeTab === "announcement" ? annEffEnd : taskEffEnd} 
                      onChange={e => activeTab === "announcement" ? setAnnEffEnd(e.target.value) : setTaskEffEnd(e.target.value)} 
                      className="w-full mt-0.5 px-2 py-1.5 border border-border rounded-lg text-xs bg-background"/>
                  </div>
                </div>
              </div>
            </div>

            {/* HIGHLIGHT: Right column containing the composed fields for forms */}
            <div className="col-span-8 space-y-5">
              {activeTab === "announcement" && (<>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">Title</label>
                  <input value={annTitle} onChange={e => setAnnTitle(e.target.value)} placeholder="Announcement title…" className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">Body</label>
                  <textarea value={annBody} onChange={e => setAnnBody(e.target.value)} rows={4} placeholder="Write your announcement…" className={inputCls + " resize-none"} />
                </div>
                {/* HIGHLIGHT: Simplified Priority input block since Scope/Effectivity are now on the left */}
                <div className="w-1/2 space-y-1.5">
                  <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">Priority</label>
                  <select value={annPriority} onChange={e => setAnnPriority(e.target.value)} className={selectCls}>
                    <option>Normal</option><option>High</option><option>Low</option>
                  </select>
                </div>
              </>)}

              {activeTab === "task" && (<>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">Task Title</label>
                  <input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="Task title…" className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">Description</label>
                  <textarea value={taskDesc} onChange={e => setTaskDesc(e.target.value)} rows={4} placeholder="Describe the task…" className={inputCls + " resize-none"} />
                </div>
                {/* HIGHLIGHT: Adjusted grid layout to hold Deadline & Priority side-by-side */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">Deadline</label>
                    <input type="datetime-local" value={taskDeadline} onChange={e => setTaskDeadline(e.target.value)} className={inputCls} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">Priority</label>
                    <select value={taskPriority} onChange={e => setTaskPriority(e.target.value)} className={selectCls}>
                      <option>Normal</option><option>High</option><option>Low</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">Graded?</label>
                  <div className="flex items-center gap-3 px-3 py-2.5 border border-border rounded-xl bg-background w-fit">
                    <input type="checkbox" checked={taskGraded} onChange={e => setTaskGraded(e.target.checked)} className="accent-teal w-4 h-4" />
                    <span className="text-sm text-foreground">Graded</span>
                    {taskGraded && (
                      <input value={taskPoints} onChange={e => setTaskPoints(e.target.value)}
                        className="w-16 px-2 py-1 border border-border rounded-lg text-sm bg-card focus:outline-none ml-1" />
                    )}
                  </div>
                </div>
              </>)}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-secondary/20">
            {sent && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-500/10 border border-green-300 px-3 py-1.5 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5" /> Sent successfully!
              </span>
            )}
            <button className="px-4 py-2 text-sm border border-border rounded-xl font-semibold hover:bg-secondary transition">Preview</button>
            <button onClick={() => { setSent(true); setTimeout(() => setSent(false), 3000); }}
              className="flex items-center gap-2 px-5 py-2 text-sm bg-teal text-white rounded-xl font-bold hover:bg-teal-dark transition"
              style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.14)" }}>
              <Send className="w-4 h-4" />
              {activeTab === "announcement" ? "Send Announcement" : "Send / Assign"}
            </button>
          </div>
        </div>
      </FadeUp>
    </div>
  );
}