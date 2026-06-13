import {
  X, Download, Copy, RefreshCw, Search, Plus, Edit3, Save,
  Users, QrCode, ScanLine, ClipboardList, Thermometer, Library,
  ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Lock,
  GripVertical, MapPin, Calendar, Send, Pencil, Trash2, Link,
  Upload, FileText, Megaphone, CheckSquare, BarChart2, CalendarCheck,
  BookOpen, CalendarDays, CalendarPlus,
} from "lucide-react";

// 2. Deprecate the old regular admin design (MyStudents()) and old super admin design (StudentManagement())
//   - MyStudents() for regular admin
//     - add more subjects responsibility for showcasing a ge group monitor handling 2 or more GE subject groups (multiple rosters)
//   - StudentManagement() [masterlist of all students (for super admin)] (with search bar function and sorting)
//     - View all students, all existing GE subject groups, team ,panata groups
//     - subtabs for filtering by GE subjects groups, team, panata groups
// Methods to be changed: MyStudents(), SectionAttendance(), StudentGroups(), SessionLogs()
// Methods for referencing: Roster(), AttendanceLogger(), SessionAttendanceModal(),TeamAttendance()
    

// AD2: My Students (section)
export function MyStudents() {
  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-teal-dark mb-1">My Students — GE 101, Sec A</h1>
      <div className="flex gap-3 mt-4 mb-4">
        {[["Students","30"],["Active","28"],["On Leave","2"],["Avg Task Completion","78%"]].map(([k,v]) => (
          <div key={k} className="bg-card border border-border rounded-lg p-3 flex-1 card-soft">
            <div className="text-xs text-muted-text">{k}</div>
            <div className="font-serif text-xl font-bold text-teal-dark">{v}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mb-3">
        <input placeholder="Search students…" className="flex-1 px-3 py-2 border border-border rounded text-sm bg-card"/>
        <select className="px-3 py-2 border border-border rounded text-sm bg-card"><option>All Departments</option><option>Computer Studies</option><option>Nursing</option><option>Engineering and Architecture</option></select>
        <select className="px-3 py-2 border border-border rounded text-sm bg-card"><option>All Years</option><option>Freshman</option><option>Sophomore</option><option>Junior</option><option>Senior</option></select>
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden card-soft">
        <table className="w-full text-sm">
          <thead className="bg-teal-dark text-white text-xs uppercase"><tr>{["","Name","Student ID","Course","Year","Attendance","Task Completion","Status","Actions"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["AJ","Alex Johnson","STF-2021-0042","BS IT","Sophomore","87%","72%","Active"],
              ["NP","Natalie Portman","STF-2022-0101","BS Nursing","Junior","95%","88%","Active"],
              ["BA","Ben Affleck","STF-2021-0088","BS Civil Eng","Senior","91%","95%","Active"],
              ["MS","Maria Santos","STF-2023-0103","BA Communication","Freshman","76%","60%","Active"],
              ["JR","Jose Reyes","STF-2023-0104","BS Psychology","Freshman","82%","55%","Active"],
              ["AC","Ana Cruz","STF-2022-0105","BS Accountancy","Junior","65%","40%","On Leave"],
              ["DL","Diego Luna","STF-2022-0106","BS Criminology","Sophomore","88%","79%","Active"],
              ["RG","Rosa Gomez","STF-2023-0107","BS Midwifery","Freshman","92%","83%","Active"],
            ].map((r,i) => (
              <tr key={i} className="row-alt border-b border-border">
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
    </div>
  );
}

export function SectionAttendance() {
  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-teal-dark mb-4">Section Attendance Tracker — GE 101 Sec A</h1>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-teal text-white rounded-lg p-4 card-soft"><div className="text-xs opacity-80">Total Sessions</div><div className="font-serif text-3xl font-bold mt-1">24</div></div>
        <div className="bg-card border border-border rounded-lg p-4 card-soft"><div className="text-xs text-muted-text">Section Avg Attendance</div><div className="font-serif text-3xl font-bold text-teal-dark">84%</div></div>
        <div className="bg-card border border-border rounded-lg p-4 card-soft"><div className="text-xs text-muted-text">Students Needing Attention</div><div className="font-serif text-3xl font-bold text-red-status">3</div></div>
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden card-soft">
        <table className="w-full text-xs">
          <thead className="bg-teal-dark text-white uppercase"><tr>{["Session","Date","Time","Present","Absent","Late","Excused","Rate %"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["GE 101 Lecture - Sec A","Nov 1, 2023","8–9:30 AM",28,1,1,0,93],
              ["GE 101 Lecture - Sec A","Nov 3, 2023","8–9:30 AM",26,2,2,0,87],
              ["GE 101 Lecture - Sec A","Nov 6, 2023","8–9:30 AM",27,2,1,0,90],
              ["Choir Orientation Batch 1","Nov 2, 2023","1–3 PM",24,4,2,0,80],
              ["Section Workshop","Nov 8, 2023","1–3 PM",28,1,0,1,93],
            ].map((r,i) => (
              <tr key={i} className="row-alt border-b border-border">{r.map((c,j) => <td key={j} className="px-2 py-2">{j===7?`${c}%`:c}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// SA-Student Management (org-wide)
export function StudentGroups() {
  const [openCard, setOpenCard] = useState<string | null>(null);
  const respCards = [
    { id: "ge", scope: "GE", title: "GE Subject Groups", count: 87, attendance: 84 },
    { id: "team", scope: "Team", title: "STF Teams", count: 6, attendance: 89 },
    { id: "panata", scope: "Panata", title: "Panata Groups", count: 25, attendance: 91 },
  ];

  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-teal-dark mb-1">Student Management — Masterlist</h1>
      <p className="text-sm text-muted-text mb-4">Responsibility sub-cards with searchable masterlists across the organization.</p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {respCards.map(c => (
          <button key={c.id} onClick={() => setOpenCard(c.id)} className="text-left bg-card border border-border rounded-xl p-4 card-soft hover:border-teal/40 transition">
            <span className="chip bg-teal-soft text-teal text-[10px]">{c.scope}</span>
            <div className="font-serif font-bold text-teal-dark mt-2">{c.title}</div>
            <div className="text-xs text-muted-text mt-1">{c.count} active · {c.attendance}% avg attendance</div>
            <div className="text-xs text-teal font-semibold mt-2">View Masterlist →</div>
          </button>
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
                <thead className="text-xs uppercase text-muted-text border-b"><tr>{["Name", "Student ID", "Department", "Team", "Panata", "Status"].map(h => <th key={h} className="py-2 text-left">{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["Alex Johnson", "STF-2021-0042", "Computer Studies", "Video Team 104", "CICS2", "Active"],
                    ["Natalie Portman", "STF-2022-0101", "Nursing", "Video Team 104", "CON-CRT", "Active"],
                    ["David Lee", "STF-2024-0701", "Criminology", "—", "—", "Unassigned"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-border"><td className="py-2 font-semibold">{r[0]}</td>{r.slice(1).map((c, j) => <td key={j} className="py-2 text-xs">{c}</td>)}</tr>
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
        ].map(([k,v,c]) => (
          <div key={k} className={`${c} rounded-lg p-4 card-soft`}><div className="text-xs opacity-85">{k}</div><div className="font-serif text-3xl font-bold mt-1">{v}</div></div>
        ))}
      </div>
      <div className="flex gap-2 mb-3">
        <input placeholder="Search students…" className="flex-1 px-3 py-2 border border-border rounded text-sm bg-card"/>
        <select className="px-3 py-2 border border-border rounded text-sm bg-card"><option>All Departments</option><option>Computer Studies</option><option>Nursing</option><option>Engineering and Architecture</option><option>Communication</option></select>
        <select className="px-3 py-2 border border-border rounded text-sm bg-card"><option>All Teams</option><option>Video Team</option><option>Music Team</option></select>
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden card-soft">
        <table className="w-full text-sm">
          <thead className="bg-teal-dark text-white text-xs uppercase"><tr>{["Name","Student ID","Year","Department","Team","Panata","GE Subject Group","Status"].map(h => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["Alex Johnson","STF-2021-0042","Sophomore","Computer Studies","Video Team 104","CICS2","GE 101-A","Active","green"],
              ["Natalie Portman","STF-2022-0101","Junior","Nursing","Video Team 104","CON-CRT-CPT-CMW","GE 101-A","Active","green"],
              ["Ben Affleck","STF-2021-0088","Senior","Engineering and Architecture","Photography Team","CEA1","GE 102-B","Active","green"],
              ["Maria Santos","STF-2023-0103","Freshman","Communication","Writers Team","CAS2","GE 101-A","Active","green"],
              ["Ana Cruz","STF-2022-0105","Junior","Accountancy","Music Team","COA1","GE 102-A","On Leave","amber"],
              ["Jose Reyes","STF-2023-0104","Freshman","Arts and Sciences","Writers Team","CAS3","GE 101-B","Active","green"],
              ["David Lee","STF-2024-0701","Freshman","Criminology","—","—","—","Unassigned","red"],
              ["Diego Luna","STF-2022-0106","Sophomore","Criminology","Livestream Team","COC1","GE 102-A","Active","green"],
              ["Rosa Gomez","STF-2023-0107","Freshman","Midwifery","DGA Team","CMT1","GE 101-B","Active","green"],
            ].map((r,i) => (
              <tr key={i} className="row-alt border-b border-border">
                <td className="px-3 py-2 font-semibold">{r[0]}</td>
                <td className="px-3 py-2 font-mono text-xs">{r[1]}</td>
                <td className="px-3 py-2">{r[2]}</td>
                <td className="px-3 py-2">{r[3]}</td>
                <td className="px-3 py-2">{r[4]}</td>
                <td className="px-3 py-2">{r[5]}</td>
                <td className="px-3 py-2">{r[6]}</td>
                <td className="px-3 py-2"><span className={`chip ${r[8]==="green"?"bg-green-status text-white":r[8]==="amber"?"bg-amber-status text-white":"bg-red-status text-white"}`}>{r[7]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



export function SessionLogs() {
  const [selected, setSelected] = useState(4);
  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-teal-dark mb-4">Session & Attendance Logs Tracker</h1>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-teal text-white rounded-lg p-4 card-soft"><div className="text-xs opacity-85">Total Sessions</div><div className="font-serif text-4xl font-bold mt-1">185</div></div>
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4 card-soft">
          <div className="relative w-20 h-20"><svg viewBox="0 0 100 100" className="-rotate-90"><circle cx="50" cy="50" r="40" stroke="var(--muted)" strokeWidth="14" fill="none"/><circle cx="50" cy="50" r="40" stroke="var(--green-status)" strokeWidth="14" fill="none" strokeDasharray="196 251"/></svg><div className="absolute inset-0 grid place-items-center font-bold">78%</div></div>
          <div><div className="text-xs text-muted-text">Global Attendance</div><div className="text-xs">Registered: 4,500</div><div className="text-xs">Present: 3,510</div></div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 card-soft">
          <div className="text-xs text-muted-text mb-2">Sessions by Context</div>
          {[["GE Subjects",35,"bg-teal"],["Team Practices",24,"bg-gold"],["Panata Groups",21,"bg-slate-blue"],["Tasks/Anns",20,"bg-amber-status"]].map(([k,v,c]) => (
            <div key={k as string} className="text-xs flex items-center gap-2 mb-1"><span className={`w-3 h-3 rounded ${c}`}/> {k} <strong className="ml-auto">{v}%</strong></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 bg-card border border-border rounded-lg overflow-hidden card-soft">
          <div className="p-3 flex gap-2 border-b border-border">
            <input placeholder="Search sessions..." className="flex-1 px-3 py-1.5 border border-border rounded text-sm"/>
            <select className="px-2 py-1.5 border border-border rounded text-sm"><option>All Contexts</option><option>Class</option><option>Team</option><option>Panata</option><option>Task</option></select>
            <select className="px-2 py-1.5 border border-border rounded text-sm"><option>All Dates</option></select>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-teal-dark text-white uppercase"><tr>{["Session","Type","Date","Time","Location","Reg","Present","Rate %"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>
              {adminSessions.map((s,i) => (
                <tr key={i} onClick={() => setSelected(i)}
                  className={`row-alt border-b border-border cursor-pointer ${selected===i?"!bg-green-status/15 border-l-4 border-l-green-status":""} ${(s[7] as number)<50?"border-l-4 border-l-red-status":""}`}>
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
            {["Present","Absent","Late","Excused"].map((t,i) => <button key={t} className={`px-2 py-1 rounded ${i===0?"bg-teal text-white":"bg-secondary"}`}>{t}</button>)}
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
              ].map((r,i) => (
                <tr key={i} className="border-b border-border"><td className="py-1">{r[0]}</td><td className="text-muted-text">{r[1]}</td><td className="text-center font-bold">{r[2]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// --------------------------
//   - Attendance Session Record (Design Change)
// --------------------------

// ─── Roster ───────────────────────────────────────────────────────────────────
export function Roster() {
  const [search, setSearch]       = useState("");
  const [viewMode, setViewMode]   = useState<"list" | "grid">("list");
  const [viewMember, setViewMember]   = useState<Member | null>(null);
  const [msgMember, setMsgMember]     = useState<Member | null>(null);
  const [subsMember, setSubsMember]   = useState<Member | null>(null);

  const filtered = roster.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.id.includes(search) ||
    r.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">Team Members</h1>
            <p className="text-sm text-muted-text mt-1">Video Team 104 — Roster</p>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-teal-soft text-teal border border-teal/20">Leader View</span>
        </div>
      </FadeUp>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Members", value: "55" },
          { label: "Active", value: "52" },
          { label: "On Leave", value: "3", accent: true },
          { label: "Avg Attendance", value: "89%" },
        ].map((s, i) => (
          <FadeUp key={s.label} delay={i * 60}><StatCard {...s} /></FadeUp>
        ))}
      </div>
      <FadeUp delay={260}>
        <SectionCard
          icon={Users}
          title="Member List"
          action={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-text" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members…"
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
                    {["","Name","Student ID","Course","Year","Attendance","Tasks","Status","Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id} className={`border-b border-border last:border-0 transition-colors ${i % 2 === 0 ? "bg-card" : "bg-secondary/20"} hover:bg-teal-soft/20`}>
                      <td className="px-4 py-3"><AvatarSVG initials={r.initials} size={32} isOnLeave={r.status !== "Active"} className="rounded-full" /></td>
                      <td className="px-4 py-3 font-semibold">{r.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-text">{r.id}</td>
                      <td className="px-4 py-3 text-sm">{r.course}</td>
                      <td className="px-4 py-3 text-sm">{r.year}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold ${r.attendancePct >= 80 ? "text-green-700" : "text-red-status"}`}>{r.attendance}</span>
                        <MiniBar pct={r.attendancePct} color={r.attendancePct >= 80 ? "var(--green-status)" : "var(--red-status)"} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-teal-dark">{r.tasksDone}/{r.tasksTotal}</span>
                        <MiniBar pct={(r.tasksDone / r.tasksTotal) * 100} />
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${r.status === "Active" ? "bg-green-500/10 text-green-700 border-green-300" : "bg-amber-400/10 text-amber-600 border-amber-300"}`}>{r.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button onClick={() => setViewMember(r)} className="px-2.5 py-1 rounded-lg border border-teal text-teal text-xs font-semibold hover:bg-teal hover:text-white transition">View</button>
                          <button onClick={() => setMsgMember(r)} className="px-2.5 py-1 rounded-lg border border-border text-muted-text text-xs font-semibold hover:bg-secondary transition flex items-center gap-1"><Send className="w-3 h-3" />Message</button>
                          <button onClick={() => setSubsMember(r)} className="px-2.5 py-1 rounded-lg border border-border text-muted-text text-xs font-semibold hover:bg-secondary transition flex items-center gap-1"><ClipboardList className="w-3 h-3" />{r.tasksDone}/{r.tasksTotal}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {viewMode === "grid" && (
            <div className="p-5 grid grid-cols-3 gap-3">
              {filtered.map(r => (
                <MemberCard key={r.id} member={r} onView={() => setViewMember(r)} onMessage={() => setMsgMember(r)} onSubmissions={() => setSubsMember(r)} />
              ))}
              {filtered.length === 0 && <div className="col-span-3 text-center text-muted-text py-16 text-sm">No members match your search.</div>}
            </div>
          )}
          <div className="flex justify-between items-center px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-text">Showing {filtered.length} of 55 members</span>
            <div className="flex gap-1">
              {["‹","1","2","3","›"].map(p => (
                <button key={p} className="w-7 h-7 rounded-lg border border-border bg-card text-xs hover:bg-secondary transition">{p}</button>
              ))}
            </div>
          </div>
        </SectionCard>
      </FadeUp>
      {viewMember && <ProfileModal member={viewMember} onClose={() => setViewMember(null)} onMessage={() => { setViewMember(null); setMsgMember(viewMember); }} />}
      {msgMember && <MessageModal member={msgMember} onClose={() => setMsgMember(null)} />}
      {subsMember && <SubmissionsModal member={subsMember} onClose={() => setSubsMember(null)} />}
    </div>
  );
}




export function AttendanceLogger() {
  const [saved, setSaved] = useState(false);
  const [method, setMethod] = useState<"qr" | "manual" | "csv">("manual");
  const [statuses, setStatuses] = useState<Record<number, string>>(
    Object.fromEntries(loggerRoster.map((r, i) => [i, r[6]]))
  );
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvDragOver, setCsvDragOver] = useState(false);

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">Attendance Logger</h1>
            <p className="text-sm text-muted-text mt-1">Record session attendance for your team</p>
          </div>
          <span className="chip bg-teal-soft text-teal text-sm px-3 py-1">Leader View</span>
        </div>
      </FadeUp>
      <div className="grid grid-cols-2 gap-5 mb-5">
        <FadeUp delay={60}>
          <SectionCard icon={Calendar} title="Session">
            <div className="p-5 space-y-3">
              <select className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-card focus:outline-none focus:ring-2 focus:ring-teal/30">
                <option>Video Team Practice</option><option>Panata Session</option><option>GE Attendance Check</option>
              </select>
              <div className="bg-teal-soft rounded-xl p-4">
                <div className="font-semibold text-teal-dark text-sm">Video Team Practice</div>
                <div className="text-xs text-muted-text mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Nov 8, 2023 · 3:00–4:30 PM · Main Studio · Expected: 55
                </div>
              </div>
            </div>
          </SectionCard>
        </FadeUp>
        <FadeUp delay={100}>
          <SectionCard icon={ScanLine} title="Attendance Method">
            <div className="p-5 space-y-2">
              {[
                { id: "qr" as const, icon: QrCode, label: "QR Code Scan", desc: "Students scan a generated QR code" },
                { id: "manual" as const, icon: Pencil, label: "Manual Entry", desc: "Mark attendance manually below" },
                { id: "csv" as const, icon: Upload, label: "CSV Upload", desc: "Upload a CSV attendance sheet" },
              ].map(({ id, icon: Icon, label, desc }) => (
                <div key={id} onClick={() => setMethod(id)}
                  className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition select-none ${
                    method === id ? "border-teal bg-teal-soft/40" : "border-border hover:bg-teal-soft/20"
                  }`}>
                  <input type="radio" name="att-method" checked={method === id} onChange={() => setMethod(id)} className="accent-teal pointer-events-none" />
                  <Icon className="w-4 h-4 text-teal shrink-0" />
                  <div>
                    <div className="text-sm font-semibold">{label}</div>
                    <div className="text-[11px] text-muted-text">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </FadeUp>
      </div>
      {method === "qr" && (
        <FadeUp delay={120}>
          <SectionCard icon={QrCode} title="Step 3 — QR Code Attendance">
            <div className="p-8 flex flex-col items-center gap-5">
              <div className="w-52 h-52 bg-white border-2 border-teal/30 rounded-2xl grid place-items-center p-3 shadow-inner">
                <div className="w-full h-full grid grid-cols-12 gap-px p-1">
                  {Array.from({ length: 144 }).map((_, i) => (
                    <div key={i} className={((i * 7 + i % 5) % 3) === 0 ? "bg-teal-dark" : "bg-white"} style={{ borderRadius: 1 }} />
                  ))}
                </div>
              </div>
              <div className="w-full max-w-sm bg-teal-soft rounded-xl px-4 py-3 text-center">
                <span className="text-sm font-semibold text-teal-dark">12 / 55 scanned</span>
              </div>
            </div>
          </SectionCard>
        </FadeUp>
      )}
      {method === "manual" && (
        <FadeUp delay={160}>
          <SectionCard icon={ClipboardList} title="Step 3 — Mark Attendance">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-teal-dark text-white text-xs uppercase tracking-wider">
                    {["#","Student Name","Student ID","Department","Course","Group","Status","Notes"].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loggerRoster.map((r, i) => (
                    <tr key={i} className={`border-b border-border last:border-0 transition-colors ${i % 2 === 0 ? "bg-card" : "bg-secondary/20"} hover:bg-teal-soft/20`}>
                      <td className="px-4 py-3 font-mono text-xs text-muted-text">{r[0]}</td>
                      <td className="px-4 py-3 font-semibold">{r[1]}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-text">{r[2]}</td>
                      <td className="px-4 py-3 text-xs text-muted-text">{r[3]}</td>
                      <td className="px-4 py-3 text-xs">{r[4]}</td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-soft text-teal-dark border border-teal/20 font-mono">{r[5]}</span>
                      </td>
                      <td className="px-4 py-3">
                        <select value={statuses[i]} onChange={e => setStatuses(prev => ({ ...prev, [i]: e.target.value }))}
                          className={`px-2.5 py-1 border rounded-lg text-xs bg-card focus:outline-none focus:ring-2 focus:ring-teal/30 font-semibold ${statusColor[statuses[i]] ?? ""}`}>
                          <option>Present</option><option>Late</option><option>Excused</option><option>Absent</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input placeholder="Add note…" className="px-3 py-1.5 border border-border rounded-xl text-xs bg-card w-36 focus:outline-none focus:ring-2 focus:ring-teal/30" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-border items-center">
              {saved && (
                <span className="flex items-center gap-1.5 text-sm font-semibold text-green-700 bg-green-500/10 border border-green-300 px-3 py-1.5 rounded-lg">
                  <CheckCircle className="w-4 h-4" /> Attendance saved
                </span>
              )}
              <button onClick={() => setStatuses(Object.fromEntries(loggerRoster.map((_, i) => [i, "Present"])))}
                className="px-4 py-2 text-sm border border-teal text-teal rounded-xl font-semibold hover:bg-teal hover:text-white transition">
                Mark All Present
              </button>
              <button className="px-4 py-2 text-sm border border-teal text-teal rounded-xl font-semibold hover:bg-teal hover:text-white transition">Export Log</button>
              <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
                className="flex items-center gap-2 px-5 py-2 text-sm bg-teal text-white rounded-xl font-bold hover:bg-teal-dark transition"
                style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.14)" }}>
                <Save className="w-4 h-4" /> Save Attendance
              </button>
            </div>
          </SectionCard>
        </FadeUp>
      )}
      {method === "csv" && (
        <FadeUp delay={120}>
          <SectionCard icon={Upload} title="Step 3 — Upload CSV">
            <div className="p-8 flex flex-col items-center gap-5">
              <div
                onDragOver={e => { e.preventDefault(); setCsvDragOver(true); }}
                onDragLeave={() => setCsvDragOver(false)}
                onDrop={e => { e.preventDefault(); setCsvDragOver(false); const f = e.dataTransfer.files[0]; if (f) setCsvFile(f); }}
                className={`w-full max-w-lg border-2 border-dashed rounded-2xl px-8 py-12 flex flex-col items-center gap-3 cursor-pointer transition-all ${
                  csvDragOver ? "border-teal bg-teal-soft/40" : "border-border hover:border-teal/50 hover:bg-teal-soft/10"
                }`}
                onClick={() => document.getElementById("csv-input")?.click()}
              >
                <div className="w-14 h-14 rounded-2xl bg-teal-soft flex items-center justify-center">
                  <FileText className="w-7 h-7 text-teal-dark" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-foreground text-sm">Drop your CSV here</div>
                  <div className="text-xs text-muted-text mt-1">or click to browse — .csv files only</div>
                </div>
                {csvFile ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-teal-soft rounded-xl border border-teal/30">
                    <FileText className="w-4 h-4 text-teal-dark" />
                    <span className="text-sm font-semibold text-teal-dark">{csvFile.name}</span>
                    <button onClick={e => { e.stopPropagation(); setCsvFile(null); }} className="text-muted-text hover:text-foreground ml-1"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ) : (
                  <span className="text-[11px] text-muted-text">Max 10 MB · UTF-8 encoded</span>
                )}
              </div>
              <input id="csv-input" type="file" accept=".csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setCsvFile(f); }} />
            </div>
          </SectionCard>
        </FadeUp>
      )}
    </div>
  );
}

// ─── Session Attendance Sheet Modal ───────────────────────────────────────────
type SessionRow = {
  name: string; id: string; dept: string; course: string; group: string; status: string;
};

function SessionAttendanceModal({ session, onClose }: { session: any[]; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 20); return () => clearTimeout(t); }, []);

  // Generate attendance data for all roster members for this session
  const sessionName = session[0] as string;
  const sessionDate = session[2] as string;
  const sessionTime = session[3] as string;
  const presentCount = session[4] as number;
  const absentCount = session[5] as number;
  const lateCount = session[6] as number;
  const excusedCount = session[7] as number;
  const rate = session[8] as number;

  // Build mock full attendance sheet from loggerRoster extended
  const allMembers: SessionRow[] = [
    ...loggerRoster.map(r => ({ name: r[1], id: r[2], dept: r[3], course: r[4], group: r[5], status: r[6] })),
    { name: "John Narvasa",    id: "STF-2022-0001", dept: "CICS",      course: "BS IT",         group: "CICS2", status: "Present" },
    { name: "Lea Salonga",     id: "STF-2023-0201", dept: "CAS",       course: "BA Comm",       group: "CAS1",  status: "Present" },
    { name: "Carlo Reyes",     id: "STF-2023-0202", dept: "CEA",       course: "BS EE",         group: "CEA2",  status: "Absent" },
    { name: "Mara Santos",     id: "STF-2022-0203", dept: "COA",       course: "BS Acctg",      group: "COA2",  status: "Late" },
    { name: "Kevin Park",      id: "STF-2021-0090", dept: "CICS",      course: "BS CS",         group: "CICS1", status: "Present" },
  ];

  const statCounts = { Present: 0, Late: 0, Excused: 0, Absent: 0 };
  allMembers.forEach(m => { if (m.status in statCounts) statCounts[m.status as keyof typeof statCounts]++; });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        className="bg-background border border-border rounded-2xl w-full max-w-4xl flex flex-col overflow-hidden"
        style={{
          maxHeight: "88vh",
          boxShadow: "0 20px 70px rgba(0,0,0,0.3)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}>
        {/* Header */}
        <div className="px-6 py-5 flex items-start justify-between gap-4"
          style={{ background: "linear-gradient(135deg, #0D4A6B, #1B6B8F)" }}>
          <div className="text-white">
            <div className="font-serif text-xl font-bold">{sessionName}</div>
            <div className="text-xs text-white/60 mt-0.5 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" /> {sessionDate} · {sessionTime}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-white">
              <div className="text-2xl font-bold font-serif">{rate}%</div>
              <div className="text-[11px] text-white/60">attendance rate</div>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white transition ml-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 divide-x divide-border border-b border-border">
          {[
            { label: "Present", count: statCounts.Present, color: "text-green-700", bg: "bg-green-50" },
            { label: "Late",    count: statCounts.Late,    color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Excused", count: statCounts.Excused, color: "text-slate-600", bg: "" },
            { label: "Absent",  count: statCounts.Absent,  color: "text-red-600",   bg: "bg-red-50" },
          ].map(({ label, count, color, bg }) => (
            <div key={label} className={`px-5 py-3 text-center ${bg}`}>
              <div className={`text-xl font-bold font-serif ${color}`}>{count}</div>
              <div className="text-[11px] text-muted-text font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-sm">
            <thead className="sticky top-0">
              <tr className="bg-teal-dark text-white text-xs uppercase tracking-wider">
                {["#", "Name", "Student ID", "Department", "Course", "Group", "Status"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allMembers.map((m, i) => (
                <tr key={m.id} className={`border-b border-border last:border-0 transition-colors ${
                  i % 2 === 0 ? "bg-card" : "bg-secondary/20"
                } hover:bg-teal-soft/10`}>
                  <td className="px-4 py-3 font-mono text-xs text-muted-text">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold">{m.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-text">{m.id}</td>
                  <td className="px-4 py-3 text-xs text-muted-text">{m.dept}</td>
                  <td className="px-4 py-3 text-xs">{m.course}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-soft text-teal-dark border border-teal/20 font-mono">{m.group}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusColor[m.status] ?? ""}`}>{m.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-card flex justify-between items-center">
          <span className="text-xs text-muted-text">Showing {allMembers.length} members</span>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm border border-teal text-teal rounded-xl font-semibold hover:bg-teal hover:text-white transition">
              <Download className="w-3.5 h-3.5" /> Export Sheet
            </button>
            <button onClick={onClose} className="px-5 py-2 text-sm bg-teal text-white rounded-xl font-bold hover:bg-teal-dark transition">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Team Attendance ───────────────────────────────────────────────────────────
const sessions = [
  ["Choir Voice Audition Batch 1 - DGA Studio","Team","Aug 14, 2025","1–3 PM",50,3,2,0,91],
  ["Choir Orientation - Batch 1","Team","Aug 18, 2025","1–2 PM",112,5,2,1,93],
  ["AEVM Task - Multimedia Meeting","Task","Aug 25, 2025","3–4 PM",90,340,10,10,20],
];

export function TeamAttendance() {
  const [mainTab, setMainTab] = useState<"records" | "logger">("records");
  const [tab, setTab] = useState("ALL SESSIONS");
  const [viewSession, setViewSession] = useState<any[] | null>(null);
  const pct = 89;
  const r = 36; const circ = 2 * Math.PI * r;
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 200); return () => clearTimeout(t); }, []);

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">Team Attendance</h1>
            <p className="text-sm text-muted-text mt-1">Video Team 104 — Session Records</p>
          </div>
          <span className="chip bg-teal-soft text-teal text-sm px-3 py-1">Leader View</span>
        </div>
      </FadeUp>
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

      {mainTab === "records" && (<>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <FadeUp delay={60}>
            <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
              <div className="relative w-20 h-20 shrink-0">
                <svg viewBox="0 0 100 100" className="-rotate-90 w-20 h-20">
                  <circle cx="50" cy="50" r={r} stroke="var(--muted)" strokeWidth="14" fill="none" />
                  <circle cx="50" cy="50" r={r} stroke="var(--green-status)" strokeWidth="14" fill="none" strokeLinecap="round"
                    style={{ strokeDasharray: go ? `${(pct / 100) * circ} ${circ}` : `0 ${circ}`, strokeDashoffset: -circ * 0.25, transition: "stroke-dasharray 0.75s linear" }} />
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <span className="font-serif font-bold text-teal-dark text-lg">{pct}%</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-text">Overall Attendance</div>
                <div className="font-serif text-2xl font-bold text-teal-dark">{pct}%</div>
                <div className="text-xs text-muted-text mt-0.5">24 sessions</div>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={100}><StatCard label="Sessions Tracked" value="24" sub="All time" /></FadeUp>
          <FadeUp delay={140}><StatCard label="Members with Issues" value="3 ⚠" accent sub="Below 60% threshold" /></FadeUp>
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
                  {sessions.map((s, i) => (
                    <tr key={i}
                      className={`border-b border-border transition-colors ${
                        (s[8] as number) < 50 ? "bg-red-status/10 hover:bg-red-status/15" : i % 2 === 0 ? "bg-card hover:bg-teal-soft/20" : "bg-secondary/20 hover:bg-teal-soft/20"
                      }`}>
                      {s.map((c, j) => (
                        <td key={j} className={`px-4 py-3.5 ${j === 8 ? `font-bold ${(s[8] as number) < 50 ? "text-red-status" : "text-green-700"}` : ""}`}>
                          {j === 1
                            ? <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-soft text-teal-dark border border-teal/20">{c}</span>
                            : j === 8 ? `${c}%` : c}
                        </td>
                      ))}
                      {/* Attendance Sheet button */}
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => setViewSession(s)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal text-teal text-[11px] font-semibold hover:bg-teal hover:text-white transition whitespace-nowrap"
                        >
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

      {mainTab === "logger" && <AttendanceLogger />}

      {viewSession && (
        <SessionAttendanceModal session={viewSession} onClose={() => setViewSession(null)} />
      )}
    </div>
  );
}



roster
avatarsvg
minibar
sectioncard
profilemodal
submissionmodal

//--- CHANGES

export function MyStudents({ roster }: { roster: any[] }) {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  
  const [viewMember, setViewMember] = useState<any | null>(null);
  const [msgMember, setMsgMember] = useState<any | null>(null);
  const [subsMember, setSubsMember] = useState<any | null>(null);

  // Admin handling multiple GE Subjects
  const myGroups = ["GE 101 - Sec A", "GE 102 - Sec B"];

  if (!activeGroup) {
    return (
      <div className="p-7">
        <FadeUp>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="font-serif text-3xl font-bold text-teal-dark">My Students</h1>
              <p className="text-sm text-muted-text mt-1">Select a GE Subject Group to view its roster</p>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-teal-soft text-teal border border-teal/20">
              Admin View
            </span>
          </div>
        </FadeUp>

        <div className="space-y-4">
          {myGroups.map((group, i) => {
            const groupMembers = roster.filter(r => r.ge === group);
            const total = groupMembers.length;
            const avgAtt = total > 0 ? Math.round(groupMembers.reduce((acc, curr) => acc + curr.attendancePct, 0) / total) : 0;

            return (
              <FadeUp key={group} delay={i * 60}>
                <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between hover:border-teal/50 transition-all shadow-sm group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-soft flex items-center justify-center text-teal-dark shrink-0">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{group}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-text font-medium">
                        <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-teal" /> {total} Students</span>
                        <span className="flex items-center gap-1.5"><CalendarCheck className="w-4 h-4 text-teal" /> {avgAtt}% Avg. Attendance</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setActiveGroup(group)} className="bg-teal text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-teal-dark transition flex items-center gap-2">
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

  const groupRoster = roster.filter(r => r.ge === activeGroup);
  const filtered = groupRoster.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search));

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => { setActiveGroup(null); setSearch(""); }} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition">
            <ChevronLeft className="w-4 h-4" /> Groups
          </button>
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">{activeGroup}</h1>
            <p className="text-sm text-muted-text mt-0.5">Masterlist · {groupRoster.length} enrolled students</p>
          </div>
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
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students…" className="pl-9 pr-3 py-2 text-sm border border-border rounded-xl bg-card w-52 focus:outline-none focus:ring-2 focus:ring-teal/30" />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-teal text-teal rounded-xl font-semibold hover:bg-teal hover:text-white transition">
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-teal-dark text-white text-xs uppercase tracking-wider">
                  {["", "Student Name", "Yr Level", "Attendance Rate", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>)}
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
                {filtered.length === 0 && <tr><td colSpan={5} className="text-center text-muted-text py-12 text-sm">No students found.</td></tr>}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </FadeUp>

      {viewMember && <ProfileModal member={viewMember} onClose={() => setViewMember(null)} onMessage={() => { setViewMember(null); setMsgMember(viewMember); }} />}
      {msgMember && <MessageModal member={msgMember} onClose={() => setMsgMember(null)} />}
      {subsMember && <SubmissionsModal member={subsMember} onClose={() => setSubsMember(null)} />}
    </div>
  );
}


StatCard
geSessions
AttendanceLogger
SessionAttendanceModal
export function SectionAttendance() {
  const [mainTab, setMainTab] = useState<"records" | "logger">("records");
  const [viewSession, setViewSession] = useState<any[] | null>(null);
  
  const pct = 84;
  const r = 36; const circ = 2 * Math.PI * r;
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 200); return () => clearTimeout(t); }, []);

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">Section Attendance</h1>
            <p className="text-sm text-muted-text mt-1">GE 101 Sec A — Session Records</p>
          </div>
          <span className="chip bg-teal-soft text-teal text-sm px-3 py-1">Admin View</span>
        </div>
      </FadeUp>

      <FadeUp delay={40}>
        <div className="flex gap-0 border-b border-border mb-6">
          {([["records","Session Records"],["logger","Attendance Logger"]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setMainTab(key)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-all ${mainTab === key ? "border-teal-dark text-teal-dark" : "border-transparent text-foreground/50 hover:text-teal-dark hover:border-teal/40"}`}>
              {label}
            </button>
          ))}
        </div>
      </FadeUp>

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
                <div className="text-xs text-muted-text">Section Avg Attendance</div>
                <div className="font-serif text-2xl font-bold text-teal-dark">{pct}%</div>
                <div className="text-xs text-muted-text mt-0.5">24 sessions</div>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={100}><StatCard label="Total Sessions" value="24" sub="This semester" /></FadeUp>
          <FadeUp delay={140}><StatCard label="Students Needing Attention" value="3 ⚠" accent sub="Below 75% threshold" /></FadeUp>
        </div>

        <FadeUp delay={220}>
          <SectionCard icon={ClipboardList} title="Session Log">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-teal-dark text-white uppercase tracking-wider">
                    {["Session Name","Type","Date","Time","Present","Absent","Late","Excused","Rate %","Sheet"].map(h => <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {geSessions.map((s, i) => (
                    <tr key={i} className={`border-b border-border transition-colors ${i%2===0?"bg-card hover:bg-teal-soft/20":"bg-secondary/20 hover:bg-teal-soft/20"}`}>
                      {s.map((c, j) => (
                        <td key={j} className={`px-4 py-3.5 ${j===8?"font-bold text-green-700":""}`}>
                          {j===1 ? <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-soft text-teal-dark border border-teal/20">{c}</span> : j===8 ? `${c}%` : c}
                        </td>
                      ))}
                      <td className="px-4 py-3.5">
                        <button onClick={() => setViewSession(s)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal text-teal text-[11px] font-semibold hover:bg-teal hover:text-white transition whitespace-nowrap">
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

      {mainTab === "logger" && <AttendanceLogger />}
      {viewSession && <SessionAttendanceModal session={viewSession} onClose={() => setViewSession(null)} />}
    </div>
  );
}


export function StudentGroups() {
  const [mainTab, setMainTab] = useState<"all" | "ge" | "team" | "panata">("all");
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const groupsData = {
    ge: [{ id: "GE 101-A", title: "GE 101 - Sec A", count: 30, attendance: 93 }, { id: "GE 102-B", title: "GE 102 - Sec B", count: 28, attendance: 87 }],
    team: [{ id: "VT-104", title: "Video Team 104", count: 55, attendance: 89 }, { id: "MT-101", title: "Music Team", count: 42, attendance: 92 }],
    panata: [{ id: "CICS2", title: "CICS2 Panata Group", count: 18, attendance: 96 }, { id: "CAS1", title: "CAS1 Panata Group", count: 15, attendance: 88 }]
  };

  const filteredStudents = roster.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">Student Management</h1>
            <p className="text-sm text-muted-text mt-1">Masterlist & Organizational Groups Overview</p>
          </div>
          <span className="chip bg-teal-soft text-teal text-sm px-3 py-1">Super Admin View</span>
        </div>
      </FadeUp>

      <FadeUp delay={40}>
        <div className="flex gap-0 border-b border-border mb-6">
          {([["all", "All Students"], ["ge", "GE Subjects"], ["team", "STF Teams"], ["panata", "Panata Groups"]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setMainTab(key)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-all ${mainTab === key ? "border-teal-dark text-teal-dark" : "border-transparent text-foreground/50 hover:text-teal-dark hover:border-teal/40"}`}>
              {label}
            </button>
          ))}
        </div>
      </FadeUp>

      {mainTab === "all" ? (
        <FadeUp delay={60}>
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[["Total Students","4,500","bg-teal text-white"], ["Active Teams","6","bg-gold text-teal-dark"], ["Panata Groups","25","bg-slate-blue text-white"], ["18 Departments","18","bg-teal-light text-white"]].map(([k,v,c]) => (
              <div key={k} className={`${c} rounded-lg p-4 card-soft`}><div className="text-xs opacity-85">{k}</div><div className="font-serif text-3xl font-bold mt-1">{v}</div></div>
            ))}
          </div>
          
          <SectionCard icon={Users} title="Global Masterlist" action={
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-text" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search any student…" className="pl-9 pr-3 py-2 text-sm border border-border rounded-xl bg-card w-64 focus:outline-none focus:ring-2 focus:ring-teal/30" />
            </div>
          }>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-teal-dark text-white text-xs uppercase">
                  <tr>{["Name","Student ID","Department","Team","Panata","GE Subject Group","Status"].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filteredStudents.map((r, i) => (
                    <tr key={i} className={`border-b border-border transition-colors ${i % 2 === 0 ? "bg-card" : "bg-secondary/20"} hover:bg-teal-soft/20`}>
                      <td className="px-4 py-3 font-semibold">{r.name}</td>
                      <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                      <td className="px-4 py-3">{r.dept}</td>
                      <td className="px-4 py-3"><span className="chip bg-secondary">{r.team}</span></td>
                      <td className="px-4 py-3"><span className="chip bg-secondary">{r.panata}</span></td>
                      <td className="px-4 py-3"><span className="chip bg-secondary">{r.ge}</span></td>
                      <td className="px-4 py-3"><span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${r.status === "Active" ? "bg-green-500/10 text-green-700 border-green-300" : "bg-amber-400/10 text-amber-600 border-amber-300"}`}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </FadeUp>
      ) : (
        <FadeUp delay={60}>
          <div className="grid grid-cols-3 gap-4">
            {groupsData[mainTab].map(c => (
              <button key={c.id} onClick={() => setOpenCard(c.id)} className="text-left bg-card border border-border rounded-xl p-5 card-soft hover:border-teal/40 transition">
                <span className="chip bg-teal-soft text-teal text-[10px] uppercase tracking-wider">{mainTab}</span>
                <div className="font-serif text-xl font-bold text-teal-dark mt-2">{c.title}</div>
                <div className="text-sm text-muted-text mt-1">{c.count} active members · {c.attendance}% avg attendance</div>
                <div className="text-xs text-teal font-semibold mt-4 flex items-center gap-1">View Masterlist <ChevronRight className="w-3.5 h-3.5" /></div>
              </button>
            ))}
          </div>
        </FadeUp>
      )}

      {openCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpenCard(null)}>
          <div className="bg-card rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 bg-teal-dark text-white flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold">{openCard} · Associated Masterlist</h3>
              <button onClick={() => setOpenCard(null)} className="hover:bg-white/10 rounded-lg p-1.5 transition"><X className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-0">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-xs uppercase text-muted-text border-b border-border sticky top-0">
                  <tr>{["Name", "Student ID", "Department", "Status"].map(h => <th key={h} className="px-6 py-3 text-left font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {roster.slice(0, 5).map((r, i) => (
                    <tr key={i} className="border-b border-border hover:bg-teal-soft/10">
                      <td className="px-6 py-3 font-semibold">{r.name}</td>
                      <td className="px-6 py-3 font-mono text-xs">{r.id}</td>
                      <td className="px-6 py-3">{r.dept}</td>
                      <td className="px-6 py-3"><span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-green-500/10 text-green-700 border-green-300">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
              <button className="px-5 py-2 text-sm border border-teal text-teal rounded-xl font-semibold hover:bg-teal hover:text-white transition">Export Data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export function SessionLogs() {
  const [viewSession, setViewSession] = useState<any[] | null>(null);
  
  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">System Session Logs</h1>
            <p className="text-sm text-muted-text mt-1">Global attendance oversight and log auditing</p>
          </div>
          <span className="chip bg-teal-soft text-teal text-sm px-3 py-1">Super Admin View</span>
        </div>
      </FadeUp>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <FadeUp delay={40}>
          <div className="bg-teal text-white rounded-xl p-5 card-soft" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
            <div className="text-sm opacity-85">Total Tracked Sessions</div>
            <div className="font-serif text-4xl font-bold mt-2">185</div>
          </div>
        </FadeUp>
        <FadeUp delay={80}>
          <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 card-soft">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 100 100" className="-rotate-90">
                <circle cx="50" cy="50" r="40" stroke="var(--muted)" strokeWidth="14" fill="none" />
                <circle cx="50" cy="50" r="40" stroke="var(--green-status)" strokeWidth="14" fill="none" strokeDasharray="196 251" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 grid place-items-center font-bold text-teal-dark">78%</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-teal-dark">Global Attendance</div>
              <div className="text-xs text-muted-text mt-1">Registered: 4,500</div>
              <div className="text-xs text-muted-text">Present: 3,510</div>
            </div>
          </div>
        </FadeUp>
        <FadeUp delay={120}>
          <div className="bg-card border border-border rounded-xl p-5 card-soft">
            <div className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-3">Sessions by Context</div>
            {[["GE Subjects",35,"bg-teal"],["Team Practices",24,"bg-gold"],["Panata Groups",21,"bg-slate-blue"],["Tasks/Anns",20,"bg-amber-status"]].map(([k,v,c]) => (
              <div key={k as string} className="text-xs flex items-center gap-2 mb-2">
                <span className={`w-3 h-3 rounded ${c}`} /> 
                <span className="font-medium text-foreground">{k}</span>
                <strong className="ml-auto text-teal-dark">{v}%</strong>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>

      <FadeUp delay={160}>
        <SectionCard icon={Library} title="Complete Audit Log" action={
          <div className="flex gap-2">
            <select className="px-3 py-1.5 border border-border rounded-lg text-xs bg-card"><option>All Contexts</option><option>Class</option><option>Team</option><option>Panata</option></select>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-semibold hover:bg-secondary transition"><Download className="w-3.5 h-3.5" /> Export DB</button>
          </div>
        }>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-teal-dark text-white uppercase tracking-wider">
                  {["Session Name","Type","Date","Time","Location","Reg","Present","Rate %","Action"].map(h => <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {adminSessions.map((s,i) => (
                  <tr key={i} className={`border-b border-border transition-colors ${i % 2 === 0 ? "bg-card" : "bg-secondary/20"} hover:bg-teal-soft/20 ${(s[7] as number)<50?"border-l-4 border-l-red-status":""}`}>
                    <td className="px-4 py-3.5 font-semibold text-foreground">{s[0]}</td>
                    <td className="px-4 py-3.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${s[1]==="Panata"?"bg-gold/20 text-yellow-800 border-gold/40":s[1]==="Task"?"bg-amber-status/20 text-amber-700 border-amber-status/40":"bg-teal-soft text-teal-dark border-teal/20"}`}>{s[1]}</span></td>
                    <td className="px-4 py-3.5 text-muted-text">{s[2]}</td>
                    <td className="px-4 py-3.5 font-mono">{s[3]}</td>
                    <td className="px-4 py-3.5 text-muted-text">{s[4]}</td>
                    <td className="px-4 py-3.5">{s[5]}</td>
                    <td className="px-4 py-3.5">{s[6]}</td>
                    <td className="px-4 py-3.5 font-bold">{s[7]}%</td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => setViewSession(s)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal text-teal text-[11px] font-semibold hover:bg-teal hover:text-white transition whitespace-nowrap">
                        <ClipboardList className="w-3 h-3" /> Audit Sheet
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </FadeUp>

      {viewSession && <SessionAttendanceModal session={viewSession} onClose={() => setViewSession(null)} />}
    </div>
  );
}



//----ATTEMPT 2 CHANGES

export function MyStudents({ roster }: { roster: any[] }) {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  
  const [viewMember, setViewMember] = useState<any | null>(null);
  const [msgMember, setMsgMember] = useState<any | null>(null);
  const [subsMember, setSubsMember] = useState<any | null>(null);

  // Admin handling multiple GE Subjects
  const myGroups = ["GE 101 - Sec A", "GE 102 - Sec B"];

  if (!activeGroup) {
    return (
      <div className="p-7">
        <FadeUp>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="font-serif text-3xl font-bold text-teal-dark">My Students</h1>
              <p className="text-sm text-muted-text mt-1">Select a GE Subject Group to view its roster</p>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-teal-soft text-teal border border-teal/20">
              Admin View
            </span>
          </div>
        </FadeUp>

        <div className="space-y-4">
          {myGroups.map((group, i) => {
            const groupMembers = roster.filter(r => r.ge === group);
            const total = groupMembers.length;
            const avgAtt = total > 0 ? Math.round(groupMembers.reduce((acc, curr) => acc + curr.attendancePct, 0) / total) : 0;

            return (
              <FadeUp key={group} delay={i * 60}>
                <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between hover:border-teal/50 transition-all shadow-sm group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-soft flex items-center justify-center text-teal-dark shrink-0">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{group}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-text font-medium">
                        <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-teal" /> {total} Students</span>
                        <span className="flex items-center gap-1.5"><CalendarCheck className="w-4 h-4 text-teal" /> {avgAtt}% Avg. Attendance</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setActiveGroup(group)} className="bg-teal text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-teal-dark transition flex items-center gap-2">
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

  const groupRoster = roster.filter(r => r.ge === activeGroup);
  const filtered = groupRoster.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search));

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => { setActiveGroup(null); setSearch(""); }} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition">
            <ChevronLeft className="w-4 h-4" /> Groups
          </button>
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">{activeGroup}</h1>
            <p className="text-sm text-muted-text mt-0.5">Masterlist · {groupRoster.length} enrolled students</p>
          </div>
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
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students…" className="pl-9 pr-3 py-2 text-sm border border-border rounded-xl bg-card w-52 focus:outline-none focus:ring-2 focus:ring-teal/30" />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-teal text-teal rounded-xl font-semibold hover:bg-teal hover:text-white transition">
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-teal-dark text-white text-xs uppercase tracking-wider">
                  {["", "Student Name", "Yr Level", "Attendance Rate", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>)}
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
                {filtered.length === 0 && <tr><td colSpan={5} className="text-center text-muted-text py-12 text-sm">No students found.</td></tr>}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </FadeUp>

      {viewMember && <ProfileModal member={viewMember} onClose={() => setViewMember(null)} onMessage={() => { setViewMember(null); setMsgMember(viewMember); }} />}
      {msgMember && <MessageModal member={msgMember} onClose={() => setMsgMember(null)} />}
      {subsMember && <SubmissionsModal member={subsMember} onClose={() => setSubsMember(null)} />}
    </div>
  );
}


import { useState } from "react";
import { Users, Search, ChevronRight, X } from "lucide-react";
// Assumes FadeUp, SectionCard, and roster data are imported/available

export function StudentGroups() {
  const [mainTab, setMainTab] = useState<"all" | "ge" | "team" | "panata">("all");
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const groupsData = {
    ge: [
      { id: "GE 101-A", title: "GE 101 - Sec A", count: 30, attendance: 93 }, 
      { id: "GE 102-B", title: "GE 102 - Sec B", count: 28, attendance: 87 }
    ],
    team: [
      { id: "VT-104", title: "Video Team 104", count: 55, attendance: 89 }, 
      { id: "MT-101", title: "Music Team", count: 42, attendance: 92 }
    ],
    panata: [
      { id: "CICS2", title: "CICS2 Panata Group", count: 18, attendance: 96 }, 
      { id: "CAS1", title: "CAS1 Panata Group", count: 15, attendance: 88 }
    ]
  };

  const filteredStudents = roster.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">Student Management</h1>
            <p className="text-sm text-muted-text mt-1">Masterlist & Organizational Groups Overview</p>
          </div>
          <span className="chip bg-teal-soft text-teal text-sm px-3 py-1">Super Admin View</span>
        </div>
      </FadeUp>

      <FadeUp delay={40}>
        <div className="flex gap-0 border-b border-border mb-6">
          {([["all", "All Students"], ["ge", "GE Subjects"], ["team", "STF Teams"], ["panata", "Panata Groups"]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setMainTab(key)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-all ${mainTab === key ? "border-teal-dark text-teal-dark" : "border-transparent text-foreground/50 hover:text-teal-dark hover:border-teal/40"}`}>
              {label}
            </button>
          ))}
        </div>
      </FadeUp>

      {mainTab === "all" ? (
        <FadeUp delay={60}>
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              ["Total Students","4,500","bg-teal text-white"], 
              ["Active Teams","6","bg-gold text-teal-dark"], 
              ["Panata Groups","25","bg-slate-blue text-white"], 
              ["18 Departments","18","bg-teal-light text-white"]
            ].map(([k,v,c]) => (
              <div key={k} className={`${c} rounded-lg p-4 card-soft`}>
                <div className="text-xs opacity-85">{k}</div>
                <div className="font-serif text-3xl font-bold mt-1">{v}</div>
              </div>
            ))}
          </div>
          
          <SectionCard icon={Users} title="Global Masterlist" action={
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-text" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search any student…" className="pl-9 pr-3 py-2 text-sm border border-border rounded-xl bg-card w-64 focus:outline-none focus:ring-2 focus:ring-teal/30" />
            </div>
          }>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-teal-dark text-white text-xs uppercase">
                  <tr>{["Name","Student ID","Department","Team","Panata","GE Subject Group","Status"].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filteredStudents.map((r, i) => (
                    <tr key={i} className={`border-b border-border transition-colors ${i % 2 === 0 ? "bg-card" : "bg-secondary/20"} hover:bg-teal-soft/20`}>
                      <td className="px-4 py-3 font-semibold">{r.name}</td>
                      <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                      <td className="px-4 py-3">{r.dept}</td>
                      <td className="px-4 py-3"><span className="chip bg-secondary">{r.team}</span></td>
                      <td className="px-4 py-3"><span className="chip bg-secondary">{r.panata}</span></td>
                      <td className="px-4 py-3"><span className="chip bg-secondary">{r.ge}</span></td>
                      <td className="px-4 py-3"><span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${r.status === "Active" ? "bg-green-500/10 text-green-700 border-green-300" : "bg-amber-400/10 text-amber-600 border-amber-300"}`}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </FadeUp>
      ) : (
        <FadeUp delay={60}>
          <div className="grid grid-cols-3 gap-4">
            {groupsData[mainTab].map(c => (
              <button key={c.id} onClick={() => setOpenCard(c.id)} className="text-left bg-card border border-border rounded-xl p-5 card-soft hover:border-teal/40 transition">
                <span className="chip bg-teal-soft text-teal text-[10px] uppercase tracking-wider">{mainTab}</span>
                <div className="font-serif text-xl font-bold text-teal-dark mt-2">{c.title}</div>
                <div className="text-sm text-muted-text mt-1">{c.count} active members · {c.attendance}% avg attendance</div>
                <div className="text-xs text-teal font-semibold mt-4 flex items-center gap-1">View Masterlist <ChevronRight className="w-3.5 h-3.5" /></div>
              </button>
            ))}
          </div>
        </FadeUp>
      )}

      {openCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpenCard(null)}>
          <div className="bg-card rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 bg-teal-dark text-white flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold">{openCard} · Associated Masterlist</h3>
              <button onClick={() => setOpenCard(null)} className="hover:bg-white/10 rounded-lg p-1.5 transition"><X className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-0">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-xs uppercase text-muted-text border-b border-border sticky top-0">
                  <tr>{["Name", "Student ID", "Department", "Status"].map(h => <th key={h} className="px-6 py-3 text-left font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {roster.slice(0, 5).map((r, i) => (
                    <tr key={i} className="border-b border-border hover:bg-teal-soft/10">
                      <td className="px-6 py-3 font-semibold">{r.name}</td>
                      <td className="px-6 py-3 font-mono text-xs">{r.id}</td>
                      <td className="px-6 py-3">{r.dept}</td>
                      <td className="px-6 py-3"><span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-green-500/10 text-green-700 border-green-300">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
              <button className="px-5 py-2 text-sm border border-teal text-teal rounded-xl font-semibold hover:bg-teal hover:text-white transition">Export Data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}