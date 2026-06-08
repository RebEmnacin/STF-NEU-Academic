import { usePortal } from "./PortalContext";
import { useState, Fragment } from "react";

// ============ Section Admin (Professor) Screens ============

// AD1: Section Dashboard (scoped)
export function SectionDashboard() {
  return (
    <div className="p-6">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-teal-dark">Section Dashboard — GE 101, Sec A</h1>
          <p className="text-xs text-muted-text">Updated November 2, 2023</p>
        </div>
        <span className="chip bg-gold text-teal-dark">Admin · Section Scoped</span>
      </div>
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          ["Students in Section","30","bg-teal text-white"],
          ["Avg Attendance","84%","bg-teal-light text-white"],
          ["Pending Tasks","12","bg-amber-status text-white"],
          ["Upcoming Events","2","bg-gold text-teal-dark"],
        ].map(([k,v,c]) => (
          <div key={k} className={`${c} rounded-lg p-4 card-soft`}>
            <div className="text-xs uppercase opacity-85 tracking-wider">{k}</div>
            <div className="font-serif text-3xl font-bold mt-1">{v}</div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden card-soft">
        <div className="px-4 py-2.5 bg-teal-dark text-white text-xs font-bold uppercase">Week of Nov 6 — Section Calendar</div>
        <table className="w-full text-sm">
          <thead className="bg-secondary text-xs uppercase">
            <tr>{["Time","Mon","Tue","Wed","Thu","Fri"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr>
          </thead>
          <tbody>
            {[
              ["08:00–09:30","GE 101 Sec A","—","GE 101 Sec A","—","GE 101 Sec A"],
              ["10:00–11:30","—","Office Hours","—","Office Hours","—"],
              ["13:00–15:00","—","—","Section Workshop","—","Choir Orientation (Nov 2)"],
            ].map((r,i) => (
              <tr key={i} className="row-alt border-b border-border">
                {r.map((c,j) => <td key={j} className={`px-2 py-2 ${j===0?"font-mono text-xs":""} ${c.includes("GE 101")?"text-teal-dark font-semibold":c.includes("Choir")?"text-amber-status font-semibold":""}`}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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

// AD3: Task Evaluator & Grader
export function TaskGrader() {
  const [scoreA, setScoreA] = useState("92.50");
  const [scoreB, setScoreB] = useState("105");
  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-teal-dark mb-4">Task Evaluator & Grade Entry</h1>
      <div className="flex gap-3 mb-4">
        <select className="px-3 py-2 border border-border rounded text-sm bg-card"><option>GE 101 - Sec A</option><option>GE 101 - Sec B</option></select>
        <select className="px-3 py-2 border border-border rounded text-sm bg-card"><option>GRADED</option><option>PENDING</option><option>SUBMITTED</option></select>
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden card-soft">
        <table className="w-full text-sm">
          <thead className="bg-teal-dark text-white text-xs uppercase"><tr>{["Student Name","Student ID","Submitted File","Max Score","Score Input","Status","Progress"].map(h => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
          <tbody>
            <tr className="row-alt border-b border-border">
              <td className="px-3 py-3 font-semibold">⭕ Jane Smith</td>
              <td className="px-3 py-3 font-mono text-xs">ID 543</td>
              <td className="px-3 py-3 text-teal">essay_v2.pdf 📥</td>
              <td className="px-3 py-3">/100</td>
              <td className="px-3 py-3">
                <input value={scoreA} onChange={e=>setScoreA(e.target.value)} className="w-20 px-2 py-1 border-2 border-green-status/60 rounded text-sm"/>
                <div className="text-[10px] text-green-status mt-1">✓ SCORE INPUT VALIDATED</div>
              </td>
              <td className="px-3 py-3"><button className="bg-teal text-white px-3 py-1 rounded text-xs hover:bg-teal-dark">Save Grade</button></td>
              <td className="px-3 py-3"><div className="relative w-10 h-10"><svg viewBox="0 0 100 100" className="-rotate-90"><circle cx="50" cy="50" r="40" stroke="var(--muted)" strokeWidth="14" fill="none"/><circle cx="50" cy="50" r="40" stroke="var(--green-status)" strokeWidth="14" fill="none" strokeDasharray="176 251"/></svg></div></td>
            </tr>
            <tr className="row-alt border-b border-border">
              <td className="px-3 py-3 font-semibold">○ Tom King</td>
              <td className="px-3 py-3 font-mono text-xs">ID 544</td>
              <td className="px-3 py-3 text-teal">essay_v2.pdf 📥</td>
              <td className="px-3 py-3">/100</td>
              <td className="px-3 py-3">
                <input value={scoreB} onChange={e=>setScoreB(e.target.value)} className={`w-20 px-2 py-1 border-2 rounded text-sm ${Number(scoreB)>100?"border-red-status":"border-border"}`}/>
                {Number(scoreB)>100 && <div className="text-[10px] text-red-status mt-1 font-bold">⚠ ERROR: SCORE OUT OF RANGE (MAX 100)</div>}
              </td>
              <td className="px-3 py-3"><select className="px-2 py-1 border border-border rounded text-xs"><option>GRADED</option><option>PENDING</option></select></td>
              <td className="px-3 py-3"><div className="relative w-10 h-10"><svg viewBox="0 0 100 100" className="-rotate-90"><circle cx="50" cy="50" r="40" stroke="var(--muted)" strokeWidth="14" fill="none"/><circle cx="50" cy="50" r="40" stroke="var(--green-status)" strokeWidth="14" fill="none" strokeDasharray="176 251"/></svg></div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// AD4: Section Attendance Tracker (reuse Super Admin session list scoped)
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

// ============ Super Admin Screens ============

// SA1: Institutional Dashboard
const adminEvents = [
  { day: 0, hour: 9, label: "Weekly Panata (Wk3)", color: "bg-teal text-white" },
  { day: 1, hour: 9, label: "STF-NEU Parents Orientation", color: "bg-teal text-white" },
  { day: 1, hour: 10, label: "STF Photo Team Profiling", color: "bg-gold text-teal-dark" },
  { day: 2, hour: 8, label: "CBI Weekly Panata Prep", color: "bg-teal-light text-white" },
  { day: 3, hour: 13, label: "STF-NEU Choir Orientation Batch 1", color: "bg-gold text-teal-dark", span: 2 },
  { day: 4, hour: 14, label: "CBI Peer Counseling Seminar", color: "bg-amber-status text-white" },
  { day: 2, hour: 20, label: "Weekly Panata Prep Sync", color: "bg-slate-blue text-white" },
  { day: 5, hour: 9, label: "DGA Team Sync", color: "bg-gold text-teal-dark" },
];

export function AdminDashboard() {
  const { setView } = usePortal();
  const hours = [8,9,10,11,12,13,14,15,16,17,18,19,20];
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  return (
    <div className="p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="font-serif text-2xl font-bold text-teal-dark">Admin Dashboard: Institutional Calendar View</h1>
        <span className="text-xs text-muted-text">Updated November 6, 2023</span>
      </div>
      <div className="grid grid-cols-4 gap-3 mb-5">
        <div className="bg-teal text-white rounded-lg p-4 card-soft">
          <div className="text-xs uppercase opacity-85 tracking-wider">Upcoming Church Events</div>
          <div className="text-xs mt-2 opacity-90">Weekly Panata (Wk3) - Google Meet · Monthly Pulong Panalangin - UHall</div>
          <div className="font-serif text-2xl font-bold mt-2">3 Total</div>
        </div>
        <div className="bg-gold text-teal-dark rounded-lg p-4 card-soft">
          <div className="text-xs uppercase opacity-85 tracking-wider">Mandatory Team Activities</div>
          <div className="text-xs mt-2">STF Photo Team Profiling - IS Bldg B, 233 · DGA Team Sync - IS Bldg B, 236</div>
          <div className="font-serif text-2xl font-bold mt-2">4 Total</div>
        </div>
        <div className="bg-slate-blue text-white rounded-lg p-4 card-soft">
          <div className="text-xs uppercase opacity-85 tracking-wider">Institutional Deadlines</div>
          <div className="text-xs mt-2 opacity-90">STF-NEU Choir Concert Batch 3 Jan 2 · Research Fieldwork QC Jan 24</div>
          <div className="font-serif text-2xl font-bold mt-2">2 Critical</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 card-soft">
          <div className="text-xs uppercase text-muted-text tracking-wider">Total GE Subject Groups</div>
          <div className="text-xs mt-2">GE 101 - 8 Sections · PE 1 - 10 Sections</div>
          <div className="font-serif text-2xl font-bold mt-2 text-teal-dark">28 Total</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden card-soft">
        <div className="grid bg-teal-dark text-white text-xs font-bold" style={{gridTemplateColumns:"60px repeat(7,1fr)"}}>
          <div className="px-2 py-2"/>
          {days.map(d => <div key={d} className="px-2 py-2 text-center">{d}</div>)}
        </div>
        <div className="grid relative" style={{gridTemplateColumns:"60px repeat(7,1fr)"}}>
          {hours.map(h => (
            <Fragment key={"hrow"+h}>
              <div className="text-xs text-muted-text px-2 py-3 font-mono border-t border-border">{h}:00</div>
              {days.map((_,di) => {
                const evt = adminEvents.find(e => e.day === di && e.hour === h);
                return (
                  <div key={di+"-"+h} className="border-t border-l border-border min-h-[44px] p-0.5">
                    {evt && (
                      <button onClick={() => setView("event-detail")}
                        className={`w-full text-left text-[10px] p-1.5 rounded ${evt.color} font-semibold leading-tight hover:brightness-105`}
                        style={evt.span?{minHeight: evt.span*44}:undefined}>
                        {evt.label}
                      </button>
                    )}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// SA2: Event Detail
export function EventDetail() {
  const { setView } = usePortal();
  return (
    <div className="p-6">
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
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4 space-y-3">
          {[
            ["TIME & DURATION","Thursday, Nov 2, 2023 · 1:00–3:00 PM (2 Hours)"],
            ["TARGET AUDIENCE","STF Choir Candidates · 55 Registered"],
            ["VENUE & SETUP","IS Bldg B, Room 234 · Capacity: 70"],
            ["ORGANIZER","@CoordinatorJerald"],
          ].map(([k,v]) => (
            <div key={k} className="bg-card border border-border rounded-lg p-3 card-soft">
              <div className="text-[10px] font-bold text-muted-text tracking-wider">{k}</div>
              <div className="text-sm mt-1">{v}</div>
            </div>
          ))}
        </div>
        <div className="col-span-5 bg-card border border-border rounded-lg p-4 card-soft">
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
        <div className="col-span-3 bg-card border border-border rounded-lg p-4 card-soft">
          <div className="text-xs font-bold text-muted-text mb-2">LIVE ATTENDANCE FEED</div>
          <ul className="text-xs space-y-1.5">
            {[["Alice Cooper","1:05 PM"],["Michael Chen","1:07 PM"],["Alicea Gliies","1:07 PM"],["Michael Beus","1:07 PM"]].map(([n,t]) => (
              <li key={n} className="flex justify-between border-b border-border pb-1"><span>{n}</span><span className="text-muted-text">{t}</span></li>
            ))}
          </ul>
          <div className="mt-3 text-center">
            <div className="font-serif text-3xl font-bold text-teal-dark">10</div>
            <div className="text-xs text-muted-text">checked in</div>
            <div className="relative w-20 h-20 mx-auto mt-2">
              <svg viewBox="0 0 100 100" className="-rotate-90"><circle cx="50" cy="50" r="40" stroke="var(--muted)" strokeWidth="14" fill="none"/><circle cx="50" cy="50" r="40" stroke="var(--green-status)" strokeWidth="14" fill="none" strokeDasharray="45 251"/></svg>
            </div>
          </div>
        </div>
        <div className="col-span-4 bg-card border border-border rounded-lg p-4 card-soft">
          <div className="text-xs font-bold text-muted-text mb-2">FULL DESCRIPTION</div>
          <p className="text-sm text-foreground/80">Orientation session for Batch 1 of new STF-NEU Choir members. Covers attendance expectations, weekly rehearsal cadence, and uniform requirements.</p>
        </div>
        <div className="col-span-4 bg-card border border-border rounded-lg p-4 card-soft">
          <div className="text-xs font-bold text-muted-text mb-2">RESOURCE CHECKLIST</div>
          <ul className="text-sm space-y-1">{["Sound System ✓","Piano/Keyboard ✓","Attendance Forms ✓","Team Vests ◯"].map(x => <li key={x}>{x}</li>)}</ul>
        </div>
        <div className="col-span-4 bg-card border border-border rounded-lg p-4 card-soft">
          <div className="text-xs font-bold text-muted-text mb-2">ASSOCIATED CONTENT</div>
          <div className="flex flex-wrap gap-1">
            <span className="chip bg-teal-soft text-teal">Multimedia training (Wk3)</span>
            <span className="chip bg-gold-soft text-amber-status">Choir orientation task</span>
          </div>
        </div>
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

// SA7: Operations Control
export function Operations() {
  const [requests, setRequests] = useState([
    ["David Lee, ID 701","Join Video Team","Jun 2, 2026"],
    ["Michael Chen, ID 612","Switch Panata Group to CICS3","Jun 2, 2026"],
    ["Jane Cooper, ID 613","Drop GE 101-B","Jun 2, 2026"],
  ]);
  const [flash, setFlash] = useState<{i:number, kind:"a"|"r"}|null>(null);
  const act = (i:number, kind:"a"|"r") => {
    setFlash({i, kind});
    setTimeout(() => { setRequests(r => r.filter((_,j) => j!==i)); setFlash(null); }, 350);
  };
  return (
    <div className="p-6 space-y-6">
      <h1 className="font-serif text-2xl font-bold text-teal-dark">Administrative Operations Control Panel</h1>

      {/* Section 1 */}
      <section className="bg-card border border-border rounded-lg p-5 card-soft">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-serif text-lg font-bold text-teal-dark">Student Assigner Workspace</h2>
          <span className="chip bg-teal text-white">65 Unassigned</span>
          <span className="chip bg-gold text-teal-dark">21 Categories</span>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="border border-border rounded p-3">
            <div className="text-xs font-bold text-muted-text mb-2">UNASSIGNED STUDENTS (65)</div>
            <ul className="space-y-1 text-sm">
              {[
                "Alice Brown, ID 611 · GE Class Request",
                "Michael Chen, ID 612 · Panata Group Request",
                "Jane Cooper, ID 613 · GE Class Request",
                "Jose Mendoza, ID 614 · Panata Group",
                "Maria Cruz, ID 615 · Team Preference",
                "Pedro Ramos, ID 616 · STF Team Preference",
              ].map(s => (
                <li key={s} className="p-2 bg-secondary rounded cursor-grab flex justify-between hover:bg-teal-soft"><span>{s}</span><span>⠿</span></li>
              ))}
            </ul>
          </div>
          <div className="border border-border rounded p-3 space-y-4">
            <div>
              <div className="text-xs font-bold text-muted-text mb-2">GE CLASSES</div>
              {[["GE 101 - Sec A",24,30,"bg-gold"],["GE 102 - Sec B",18,30,"bg-teal"]].map(([n,c,m,col]) => (
                <div key={n as string} className="mb-2">
                  <div className="flex justify-between text-xs"><span>{n}</span><span>{c}/{m}</span></div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden"><div className={`h-full ${col}`} style={{width:`${(c as number)/(m as number)*100}%`}}/></div>
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs font-bold text-muted-text mb-2">PANATA GROUPS</div>
              {[["CICS1",12,15],["CICS2",14,15],["CAS1-CCR",10,15]].map(([n,c,m]) => (
                <div key={n as string} className="mb-2">
                  <div className="flex justify-between text-xs"><span>{n}</span><span>{c}/{m}</span></div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-teal" style={{width:`${(c as number)/(m as number)*100}%`}}/></div>
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs font-bold text-muted-text mb-2">STF TEAMS</div>
              {[["Video Team 104",19,25],["DGA Team",22,25],["Music Team",18,25]].map(([n,c,m]) => (
                <div key={n as string} className="mb-2">
                  <div className="flex justify-between text-xs"><span>{n}</span><span>{c}/{m}</span></div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-gold" style={{width:`${(c as number)/(m as number)*100}%`}}/></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="bg-card border border-border rounded-lg p-5 card-soft">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-serif text-lg font-bold text-teal-dark">Pending Request Approver</h2>
          <span className="chip bg-teal-soft text-teal">Queue-based data List</span>
          <span className="chip bg-amber-status text-white">Pending ({requests.length})</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-teal-dark text-white text-xs uppercase"><tr>{["Applicant","Requested Action","Date","Controls"].map(h => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
          <tbody>
            {requests.map((r,i) => (
              <tr key={i} className={`row-alt border-b border-border transition-colors ${flash?.i===i?(flash.kind==="a"?"!bg-green-status/30":"!bg-red-status/30"):""}`}>
                <td className="px-3 py-2 font-semibold">{r[0]}</td>
                <td className="px-3 py-2">{r[1]}</td>
                <td className="px-3 py-2 text-muted-text">{r[2]}</td>
                <td className="px-3 py-2 flex gap-2">
                  <button onClick={() => act(i,"a")} className="bg-gold text-teal-dark px-3 py-1 rounded text-xs font-bold hover:brightness-105">APPROVE</button>
                  <button onClick={() => act(i,"r")} className="bg-teal-dark text-white px-3 py-1 rounded text-xs font-bold hover:bg-teal">REJECT</button>
                </td>
              </tr>
            ))}
            {requests.length===0 && <tr><td colSpan={4} className="p-4 text-center text-muted-text text-xs">All requests processed.</td></tr>}
          </tbody>
        </table>
      </section>

      {/* Section 3 — Task Grader (org-wide) */}
      <section className="bg-card border border-border rounded-lg p-5 card-soft">
        <h2 className="font-serif text-lg font-bold text-teal-dark mb-3">Task Evaluator & Eval Grader (Org-wide)</h2>
        <div className="flex gap-3 mb-3">
          <input placeholder="Search students…" className="flex-1 px-3 py-1.5 border border-border rounded text-sm"/>
          <select className="px-2 py-1.5 border border-border rounded text-sm"><option>All Sections</option><option>GE 101 - Sec A</option><option>GE 101 - Sec B</option><option>GE 102 - Sec A</option></select>
          <select className="px-2 py-1.5 border border-border rounded text-sm"><option>GRADED</option><option>PENDING</option></select>
        </div>
        <TaskGrader />
      </section>
    </div>
  );
}

// SA6: Grade Manager Grade Manager
export function Endoar() {
  const [tab, setTab] = useState<"ge"|"aevm">("ge");
  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-teal-dark mb-1">Grade Manager — Grade Entry & Score Management</h1>
      <div className="border-b border-border flex gap-1 mb-4 mt-3">
        {[["ge","GE Subject Grades"],["aevm","AEVM Performance Scores"]].map(([id,l]) => (
          <button key={id} onClick={() => setTab(id as any)} className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px ${tab===id?"border-teal text-teal-dark":"border-transparent text-muted-text"}`}>{l}</button>
        ))}
      </div>

      {tab==="ge" && <>
        <div className="mb-3"><select className="px-3 py-2 border border-border rounded text-sm bg-card"><option>GE 101 - Sec A</option><option>GE 101 - Sec B</option></select></div>
        <div className="bg-card border border-border rounded-lg overflow-hidden card-soft">
          <table className="w-full text-sm">
            <thead className="bg-teal-dark text-white text-xs uppercase"><tr>{["Student","Student ID","Written Works","Performance Tasks","Quarterly","Computed","Status"].map(h => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>
              {[
                ["Natalie Portman","STF-2022-0101",88,91,85,88.2,"Passing","green"],
                ["Alex Ammin","STF-2022-0102",75,80,72,76.1,"Passing","green"],
                ["Ben Affleck","STF-2021-0088",95,93,90,92.8,"Passing","green"],
                ["Maria Santos","STF-2023-0103",60,65,58,61.4,"At Risk","amber"],
                ["Jose Reyes","STF-2023-0104",45,50,42,45.8,"Failing","red"],
              ].map((r,i) => (
                <tr key={i} className="row-alt border-b border-border">
                  <td className="px-3 py-2 font-semibold">{r[0]}</td>
                  <td className="px-3 py-2 font-mono text-xs">{r[1]}</td>
                  <td className="px-3 py-2">{r[2]}</td>
                  <td className="px-3 py-2">{r[3]}</td>
                  <td className="px-3 py-2">{r[4]}</td>
                  <td className="px-3 py-2 font-bold">{r[5]}</td>
                  <td className="px-3 py-2"><span className={`chip ${r[7]==="green"?"bg-green-status text-white":r[7]==="amber"?"bg-amber-status text-white":"bg-red-status text-white"}`}>{r[6]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4"><button className="bg-teal text-white px-5 py-2 rounded font-semibold text-sm hover:bg-teal-dark">Save Grades</button></div>
      </>}

      {tab==="aevm" && <>
        <div className="bg-card border border-border rounded-lg overflow-hidden card-soft">
          <table className="w-full text-sm">
            <thead className="bg-teal-dark text-white text-xs uppercase"><tr>{["Student","Student ID","Attendance","Task Completion","Participation","AEVM Final","Status"].map(h => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>
              {[
                ["Natalie Portman","STF-2022-0101",95,88,90,91.0,"Excellent","green"],
                ["Alex Ammin","STF-2022-0102",87,72,80,79.7,"Good","teal"],
                ["Ben Affleck","STF-2021-0088",91,95,93,93.0,"Excellent","green"],
                ["Maria Santos","STF-2023-0103",76,60,65,67.0,"Needs Improvement","amber"],
                ["Jose Reyes","STF-2023-0104",82,55,60,65.7,"Needs Improvement","amber"],
              ].map((r,i) => (
                <tr key={i} className="row-alt border-b border-border">
                  <td className="px-3 py-2 font-semibold">{r[0]}</td>
                  <td className="px-3 py-2 font-mono text-xs">{r[1]}</td>
                  <td className="px-3 py-2">{r[2]}</td>
                  <td className="px-3 py-2">{r[3]}</td>
                  <td className="px-3 py-2">{r[4]}</td>
                  <td className="px-3 py-2 font-bold">{r[5]}</td>
                  <td className="px-3 py-2"><span className={`chip ${r[7]==="green"?"bg-green-status text-white":r[7]==="teal"?"bg-teal text-white":"bg-amber-status text-white"}`}>{r[6]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="bg-gold text-teal-dark px-5 py-2 rounded font-bold text-sm hover:brightness-105">Compute Final Grades</button>
          <button className="bg-teal text-white px-5 py-2 rounded font-semibold text-sm hover:bg-teal-dark">Save AEVM Scores</button>
        </div>
      </>}
    </div>
  );
}

// SA-Student Management (org-wide)
export function StudentGroups() {
  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-teal-dark mb-4">Student Management — Masterlist</h1>
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
