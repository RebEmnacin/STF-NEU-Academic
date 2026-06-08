import { usePortal } from "./PortalContext";
import { useState, Fragment } from "react";
import { X, Download, Copy, RefreshCw, Search, Plus, Edit3, Save } from "lucide-react";

// ============ Group Members (TL1) ============
const roster = [
  ["NP","Natalie Portman","STF-2022-0101","BS Nursing","Junior","95%","88%","Active"],
  ["AA","Alex Ammin","STF-2022-0102","BS IT","Sophomore","87%","72%","Active"],
  ["BA","Ben Affleck","STF-2021-0088","BS Civil Eng","Senior","91%","95%","Active"],
  ["MS","Maria Santos","STF-2023-0103","BA Communication","Freshman","76%","60%","Active"],
  ["JR","Jose Reyes","STF-2023-0104","BS Psychology","Freshman","82%","55%","Active"],
  ["AC","Ana Cruz","STF-2022-0105","BS Accountancy","Junior","65%","40%","On Leave"],
  ["DL","Diego Luna","STF-2022-0106","BS Criminology","Sophomore","88%","79%","Active"],
  ["RG","Rosa Gomez","STF-2023-0107","BS Midwifery","Freshman","92%","83%","Active"],
];

export function Roster() {
  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-teal-dark mb-1">My Group — Video Team 104</h1>
      <div className="flex gap-3 mt-4 mb-4">
        {[["Total Members","55"],["Active","52"],["On Leave","3"],["Avg Attendance","89%"]].map(([k,v]) => (
          <div key={k} className="bg-card border border-border rounded-lg p-3 flex-1 card-soft">
            <div className="text-xs text-muted-text">{k}</div>
            <div className="font-serif text-xl font-bold text-teal-dark">{v}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mb-3">
        <div className="relative w-64"><Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-text"/><input placeholder="Search members..." className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md bg-card"/></div>
        <button className="px-4 py-2 text-sm border border-teal text-teal rounded-md font-semibold hover:bg-teal-soft">Export</button>
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden card-soft">
        <table className="w-full text-sm">
          <thead className="bg-teal-dark text-white text-xs uppercase"><tr>{["","Name","Student ID","Course","Year","Attendance","Tasks","Status","Actions"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
          <tbody>
            {roster.map((r,i) => (
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
      <div className="flex justify-end gap-1 mt-3 text-xs">
        {["<","1","2","3",">"].map(p => <button key={p} className="w-7 h-7 rounded border border-border bg-card hover:bg-secondary">{p}</button>)}
      </div>
    </div>
  );
}

// ============ QR Generator (TL2) ============
export function QRGenerator() {
  const [generated, setGenerated] = useState(true);
  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-teal-dark mb-4">QR Code Generator</h1>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-7 bg-card border border-border rounded-lg p-5 space-y-5 card-soft">
          <div>
            <div className="text-xs font-bold text-muted-text mb-2">STEP 1 — SELECT EVENT</div>
            <select className="w-full px-3 py-2 border border-border rounded-md text-sm">
              <option>Video Team Practice (Nov 8)</option>
              <option>AEVM Multimedia Meeting (Aug 25)</option>
              <option>Choir Orientation Batch 1 (Nov 2)</option>
            </select>
            <div className="mt-3 bg-teal-soft p-3 rounded text-sm">
              <div className="font-semibold text-teal-dark">Video Team Practice</div>
              <div className="text-xs text-muted-text mt-1">Nov 8, 2023 · 3:00–4:30 PM · Main Studio · Expected: 55</div>
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-muted-text mb-2">STEP 2 — QR SETTINGS</div>
            {[["Single Scan per Student",true],["Time-Limited QR (30 min)",true]].map(([l,v]) => (
              <div key={l as string} className="flex items-center justify-between py-2 border-t border-border">
                <span className="text-sm">{l}</span>
                <button className={`w-10 h-5 rounded-full relative ${v?"bg-teal":"bg-muted"}`}><span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full ${v?"right-0.5":"left-0.5"}`}/></button>
              </div>
            ))}
            <div className="py-2 border-t border-border">
              <label className="text-sm">Attendance Type</label>
              <select className="w-full mt-1 px-3 py-1.5 border border-border rounded-md text-sm"><option>Present</option><option>Late</option><option>Excused</option></select>
            </div>
          </div>
          <button onClick={() => setGenerated(true)} className="w-full bg-teal text-white py-3 rounded-md font-semibold hover:bg-teal-dark">Generate QR Code</button>
        </div>
        <div className="col-span-5 bg-card border border-border rounded-lg p-5 text-center card-soft">
          {generated && (
            <>
              <div className="w-56 h-56 mx-auto bg-teal-dark grid place-items-center rounded p-2">
                <div className="w-full h-full grid grid-cols-12 gap-px bg-white/10 p-1">
                  {Array.from({length:144}).map((_,i) => <div key={i} className={((i*7+i%5)%3)===0?"bg-white":"bg-teal-dark"}/>)}
                </div>
              </div>
              <div className="mt-4 font-bold text-teal-dark">Video Team Practice — Nov 8, 2023</div>
              <div className="text-xs text-muted-text">Scan within 30 minutes of generation</div>
              <div className="flex justify-center gap-2 mt-4">
                <button className="chip border border-teal text-teal flex items-center gap-1"><Download className="w-3 h-3"/> PNG</button>
                <button className="chip border border-teal text-teal flex items-center gap-1"><Copy className="w-3 h-3"/> Link</button>
                <button className="chip border border-teal text-teal flex items-center gap-1"><RefreshCw className="w-3 h-3"/> Regenerate</button>
              </div>
              <div className="mt-4 p-3 bg-secondary rounded text-sm"><strong>Scanned: 12 / 55</strong> students</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ Attendance Session Logger (TL3) ============
const loggerRoster = [
  ["1","Natalie Portman","STF-2022-0101","Nursing","BS Nursing","CICS2","Present"],
  ["2","Alex Ammin","STF-2022-0102","Computer Studies","BS IT","CICS2","Present"],
  ["3","Ben Affleck","STF-2021-0088","Engineering","BS Civil Eng","CEA1","Late"],
  ["4","Maria Santos","STF-2023-0103","Communication","BA Communication","CAS2","Present"],
  ["5","Jose Reyes","STF-2023-0104","Arts and Sciences","BS Psychology","CAS3","Excused"],
  ["6","Ana Cruz","STF-2022-0105","Accountancy","BS Accountancy","COA1","Absent"],
  ["7","Diego Luna","STF-2022-0106","Criminology","BS Criminology","COC1","Present"],
  ["8","Rosa Gomez","STF-2023-0107","Midwifery","BS Midwifery","CMT1","Present"],
];

export function AttendanceLogger() {
  const [saved, setSaved] = useState(false);
  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-teal-dark mb-4">Attendance Session Logger</h1>
      <div className="bg-card border border-border rounded-lg p-5 mb-4 card-soft">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <div className="text-xs font-bold text-muted-text mb-2">STEP 1 — SELECT SESSION</div>
            <select className="w-full px-3 py-2 border border-border rounded-md text-sm">
              <option>Video Team Practice</option>
              <option>Panata Session</option>
              <option>GE Attendance Check</option>
              <option>DGA Training</option>
              <option>Choir Orientation</option>
              <option>Komiti Meeting</option>
            </select>
            <div className="mt-3 bg-teal-soft p-3 rounded text-sm">
              <div className="font-semibold text-teal-dark">Video Team Practice</div>
              <div className="text-xs text-muted-text mt-1">Nov 8, 2023 · 3:00–4:30 PM · Main Studio · Expected: 55</div>
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-muted-text mb-2">STEP 2 — ATTENDANCE METHOD</div>
            <div className="space-y-2 text-sm">
              {[
                ["manual","Manual Check (mark each student individually)",true],
                ["batch","Batch Present (mark all present, then exceptions)",false],
                ["csv","CSV Upload",false],
                ["form","Attendance Form Import",false],
              ].map(([id,label,checked]) => (
                <label key={id as string} className="flex items-center gap-2 p-2 border border-border rounded hover:bg-secondary">
                  <input type="radio" name="method" defaultChecked={checked as boolean}/> {label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden card-soft">
        <div className="px-4 py-2.5 bg-teal-dark text-white text-xs font-bold uppercase">Step 3 — Mark Attendance</div>
        <table className="w-full text-sm">
          <thead className="bg-secondary text-xs uppercase">
            <tr>{["#","Student Name","Student ID","Department","Course","Panata Group","Status","Notes"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr>
          </thead>
          <tbody>
            {loggerRoster.map((r,i) => (
              <tr key={i} className="row-alt border-b border-border">
                <td className="px-2 py-2 font-mono text-xs">{r[0]}</td>
                <td className="px-2 py-2 font-semibold">{r[1]}</td>
                <td className="px-2 py-2 font-mono text-xs">{r[2]}</td>
                <td className="px-2 py-2 text-xs">{r[3]}</td>
                <td className="px-2 py-2 text-xs">{r[4]}</td>
                <td className="px-2 py-2 text-xs">{r[5]}</td>
                <td className="px-2 py-2">
                  <select defaultValue={r[6]} className="px-2 py-1 border border-border rounded text-xs bg-card">
                    <option>Present</option><option>Late</option><option>Excused</option><option>Absent</option>
                  </select>
                </td>
                <td className="px-2 py-2"><input placeholder="Add note…" className="px-2 py-1 border border-border rounded text-xs w-32"/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end gap-2 mt-4 items-center">
        {saved && <span className="chip bg-green-status text-white">✓ Attendance saved</span>}
        <button className="px-4 py-2 text-sm border border-teal text-teal rounded-md font-semibold">Export Log</button>
        <button onClick={() => { setSaved(true); setTimeout(()=>setSaved(false),3000); }} className="px-5 py-2 text-sm bg-teal text-white rounded-md font-semibold hover:bg-teal-dark flex items-center gap-2">
          <Save className="w-4 h-4"/> Save Attendance
        </button>
      </div>
    </div>
  );
}

// ============ Group Attendance Records (TL4) ============
const sessions = [
  ["Video Team Practice - DGA Studio","Team","Aug 14, 2025","1–3 PM",50,3,2,0,91],
  ["Choir Orientation - Batch 1","Team","Aug 18, 2025","1–2 PM",112,5,2,1,93],
  ["AEVM Task - Multimedia Meeting","Task","Aug 25, 2025","3–4 PM",90,340,10,10,20],
  ["Engineering Gear - Team Sync","Team","Sep 1, 2025","11–12 PM",28,1,1,0,93],
  ["Komiti - Panata CICS2","Panata","Sep 3, 2025","4–4:30 PM",14,1,0,0,93],
];

export function TeamAttendance() {
  const [tab, setTab] = useState("ALL SESSIONS");
  const [expanded, setExpanded] = useState<number|null>(null);
  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-teal-dark mb-4">Group Attendance — Video Team 104</h1>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4 card-soft">
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 100 100" className="-rotate-90"><circle cx="50" cy="50" r="40" stroke="var(--muted)" strokeWidth="14" fill="none"/><circle cx="50" cy="50" r="40" stroke="var(--green-status)" strokeWidth="14" fill="none" strokeDasharray="223.6 251.33"/></svg>
            <div className="absolute inset-0 grid place-items-center font-bold text-teal-dark">89%</div>
          </div>
          <div><div className="text-xs text-muted-text">Overall Attendance</div><div className="font-serif text-lg font-bold">89%</div></div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 card-soft"><div className="text-xs text-muted-text">Sessions Tracked</div><div className="font-serif text-3xl font-bold text-teal-dark">24</div></div>
        <div className="bg-card border border-border rounded-lg p-4 card-soft"><div className="text-xs text-muted-text">Students with Issues</div><div className="font-serif text-3xl font-bold text-red-status flex items-center gap-2">3 <span className="chip bg-red-status text-white">!</span></div></div>
      </div>
      <div className="flex gap-2 mb-3 overflow-x-auto">
        {["ALL SESSIONS","MAJOR SUBJECTS","GE CLASSES","PANATA","STF PRACTICES","EVENTS"].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 text-xs font-bold rounded-md whitespace-nowrap ${tab===t?"bg-teal text-white":"bg-card border border-border hover:bg-secondary"}`}>{t}</button>
        ))}
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden card-soft">
        <table className="w-full text-xs">
          <thead className="bg-teal-dark text-white uppercase"><tr>{["Session Name","Type","Date","Time","Present","Absent","Late","Excused","Rate %"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
          <tbody>
            {sessions.map((s,i) => (
              <Fragment key={i}>
                <tr onClick={() => setExpanded(expanded===i?null:i)} className={`row-alt border-b border-border cursor-pointer ${(s[8] as number)<50?"bg-red-status/10":""}`}>
                  {s.map((c,j) => <td key={j} className="px-2 py-2">{j===8?`${c}%`:c}</td>)}
                </tr>
                {expanded===i && (
                  <tr><td colSpan={9} className="p-3 bg-teal-soft/40">
                    <div className="text-xs font-bold mb-2 text-teal-dark">Student-level breakdown</div>
                    <table className="w-full text-xs">
                      <thead><tr className="border-b border-border"><th className="text-left py-1">Name</th><th className="text-left">ID</th><th className="text-center">Status</th></tr></thead>
                      <tbody>
                        {loggerRoster.slice(0,5).map((r,k) => (
                          <tr key={k} className="border-b border-border"><td className="py-1">{r[1]}</td><td className="font-mono">{r[2]}</td><td className="text-center"><span className={`chip ${r[6]==="Present"?"bg-green-status text-white":r[6]==="Late"?"bg-amber-status text-white":r[6]==="Absent"?"bg-red-status text-white":"bg-slate-blue text-white"}`}>{r[6]}</span></td></tr>
                        ))}
                      </tbody>
                    </table>
                  </td></tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============ Heatmap (TL5 / Admin / SA) ============
export function HeatmapView({ scope = "Video Team 104", banner }: { scope?: string; banner?: string }) {
  const hours = ["8 AM","9 AM","10 AM","11 AM","12 PM","1 PM","2 PM","3 PM","4 PM","5 PM","6 PM","7 PM","8 PM"];
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const cell = (d:number, h:number) => {
    const seed = (d*7 + h*3) % 100;
    if (h<2) return { color:"bg-card border border-border", pct: 15 };
    if (h>=10) return { color:"bg-gold-soft", pct: 35 };
    if (d===2 && h>=4 && h<=6) return { color:"bg-teal-dark text-white", pct: 90 };
    if (d===3 && h>=4 && h<=7) return { color:"bg-teal-dark text-white", pct: 88 };
    if (seed < 20) return { color:"bg-slate-blue/30", pct: 22 };
    if (seed < 45) return { color:"bg-gold", pct: 50 };
    if (seed < 70) return { color:"bg-teal-light", pct: 72 };
    return { color:"bg-teal", pct: 85 };
  };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-serif text-2xl font-bold text-teal-dark">Availability Heatmap — {scope}</h1>
        <div className="flex gap-2">
          <select className="px-3 py-2 border border-border rounded-md text-sm bg-card"><option>All Departments</option></select>
          <select className="px-3 py-2 border border-border rounded-md text-sm bg-card"><option>All Courses</option></select>
          <select className="px-3 py-2 border border-border rounded-md text-sm bg-card"><option>All Panata Groups</option></select>
          <select className="px-3 py-2 border border-border rounded-md text-sm bg-card"><option>All STF Teams</option></select>
        </div>
      </div>
      {banner && <div className="bg-gold-soft border border-gold rounded p-2.5 text-xs text-foreground mb-4 font-medium">{banner}</div>}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-9 bg-card border border-border rounded-lg p-4 card-soft">
          <div className="grid" style={{ gridTemplateColumns: "60px repeat(7, 1fr)" }}>
            <div/>
            {days.map(d => <div key={d} className="text-center text-xs font-bold text-teal-dark py-2">{d}</div>)}
            {hours.map((h,hi) => (
              <Fragment key={"row"+hi}>
                <div className="text-xs text-muted-text py-2 font-mono">{h}</div>
                {days.map((_,di) => {
                  const c = cell(di,hi);
                  return (
                    <div key={di+"-"+hi} className={`h-8 m-0.5 rounded ${c.color} relative group cursor-pointer`}>
                      <div className="hidden group-hover:block absolute z-20 top-full left-1/2 -translate-x-1/2 mt-1 bg-teal-dark text-white text-[10px] p-2 rounded whitespace-nowrap shadow-lg">
                        {days[di]}, {h}: {c.pct}% available
                        <div className="flex gap-0.5 mt-1">{["NP","AA","BA","MS"].map(x => <span key={x} className="w-4 h-4 rounded-full bg-gold grid place-items-center text-[8px] text-teal-dark">{x}</span>)}</div>
                      </div>
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-4 text-xs flex-wrap">
            <span className="text-muted-text font-semibold">Availability:</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-card border border-border rounded"/> 0–20%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-slate-blue/30 rounded"/> 10–30%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gold rounded"/> 30–60%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-teal-light rounded"/> 60–85%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-teal-dark rounded"/> 80–100%</span>
          </div>
        </div>
        <aside className="col-span-3 space-y-4">
          <div className="bg-card border border-border rounded-lg p-4 card-soft">
            <h4 className="font-serif font-bold text-teal-dark text-sm mb-2">Most Available</h4>
            <ul className="text-xs space-y-1">
              <li className="flex justify-between"><span>Wed 2 PM</span><strong>90%</strong></li>
              <li className="flex justify-between"><span>Thu 1 PM</span><strong>88%</strong></li>
              <li className="flex justify-between"><span>Fri 3 PM</span><strong>82%</strong></li>
            </ul>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 card-soft">
            <h4 className="font-serif font-bold text-teal-dark text-sm mb-2">Least Available</h4>
            <ul className="text-xs space-y-1">
              <li className="flex justify-between"><span>Mon 8 AM</span><strong>15%</strong></li>
              <li className="flex justify-between"><span>Tue 9 AM</span><strong>22%</strong></li>
              <li className="flex justify-between"><span>Sat 6 PM</span><strong>18%</strong></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ============ Template Library (TL7) ============
type Tmpl = { name: string; uses: number; lastUsed: string; createdBy?: string; scope?: string };
const templates: Record<"ann"|"task"|"survey", Tmpl[]> = {
  ann: [
    { name:"Practice Rescheduled Notice", uses:8, lastUsed:"Nov 1, 2023", createdBy:"@JeraldC", scope:"Video Team" },
    { name:"Weekly Panata Sync Reminder", uses:12, lastUsed:"Oct 28, 2023", createdBy:"Monitor J.", scope:"CICS2" },
    { name:"Task Deadline Reminder", uses:6, lastUsed:"Sep 15, 2023", createdBy:"Dr. Abella", scope:"GE 101-A" },
  ],
  task: [
    { name:"Weekly Training Submission", uses:4, lastUsed:"Aug 25, 2025", createdBy:"@JeraldC", scope:"Video Team" },
    { name:"Multimedia Documentation Task", uses:3, lastUsed:"Aug 18, 2025", createdBy:"@JeraldC", scope:"Video Team" },
    { name:"Choir Orientation Output", uses:2, lastUsed:"Aug 10, 2025", createdBy:"Super admin", scope:"Org-wide" },
  ],
  survey: [
    { name:"Post-Event Sentiment Survey", uses:5, lastUsed:"Aug 28, 2025", createdBy:"Super admin", scope:"Org-wide" },
    { name:"Team Availability Check", uses:7, lastUsed:"Aug 22, 2025", createdBy:"@JeraldC", scope:"Video Team" },
    { name:"Semester Team Preference Form", uses:3, lastUsed:"Jun 1, 2025", createdBy:"Super admin", scope:"Org-wide" },
  ],
};

export function TemplateLibrary({ global=false }: { global?: boolean }) {
  const [tab, setTab] = useState<"ann"|"task"|"survey">("ann");
  const rows = templates[tab];
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-serif text-2xl font-bold text-teal-dark">{global?"Global Template Library":"Template Library"}</h1>
        <div className="flex gap-2">
          {global && <select className="px-3 py-2 border border-border rounded text-sm bg-card"><option>Filter by Role/Scope</option><option>All Teams</option><option>All Sections</option></select>}
          <button className="bg-teal text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 hover:bg-teal-dark"><Plus className="w-4 h-4"/> Create New Template</button>
        </div>
      </div>
      <div className="border-b border-border flex gap-1 mb-4">
        {[["ann","Announcement Templates"],["task","Task Templates"],["survey","Survey Templates"]].map(([id,l]) => (
          <button key={id} onClick={() => setTab(id as any)} className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px ${tab===id?"border-teal text-teal-dark":"border-transparent text-muted-text"}`}>{l}</button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {rows.map((t,i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-4 card-soft hover:shadow-md transition">
            <h4 className="font-serif font-bold text-teal-dark mb-2">{t.name}</h4>
            <div className="text-xs text-muted-text space-y-0.5 mb-3">
              <div>Used <strong className="text-foreground">{t.uses}</strong> times</div>
              <div>Last used: {t.lastUsed}</div>
              {global && <>
                <div>Created by: <strong className="text-foreground">{t.createdBy}</strong></div>
                <div>Scope: <span className="chip bg-teal-soft text-teal">{t.scope}</span></div>
              </>}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <button className="chip bg-teal text-white">Use Template</button>
              <button className="chip border border-border"><Edit3 className="w-3 h-3 mr-1"/>Edit</button>
              <button className="chip border border-border">Duplicate</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Dispatcher Modal (all roles) ============
export function Dispatcher({ scopeLocked = true, scopeLabel = "Video Team 104" }: { scopeLocked?: boolean; scopeLabel?: string }) {
  const { modal, setModal } = usePortal();
  const [tab, setTab] = useState<"ann"|"task"|"survey">("task");
  if (modal !== "dispatcher") return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-6" onClick={() => setModal(null)}>
      <div onClick={e => e.stopPropagation()} className="bg-background w-full max-w-5xl rounded-lg border border-border overflow-hidden max-h-[92vh] flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-border bg-teal-dark text-white flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold tracking-wider">NEW ACTION: UNIFIED DISPATCHER</h3>
          <button onClick={() => setModal(null)}><X className="w-5 h-5"/></button>
        </div>
        <div className="flex gap-1 border-b border-border bg-card px-6">
          {[["ann","📢 ANNOUNCEMENT"],["task","✅ TASK"],["survey","📋 SURVEY"]].map(([id,l]) => (
            <button key={id} onClick={() => setTab(id as any)} className={`px-4 py-3 text-xs font-bold border-b-2 -mb-px ${tab===id?"border-gold text-teal-dark":"border-transparent text-muted-text"}`}>{l}</button>
          ))}
        </div>
        {scopeLocked && (
          <div className="bg-gold-soft border-y border-gold text-xs px-6 py-2 text-foreground font-medium">
            🔒 As {scopeLabel.includes("Sec")?"Admin":"Student Leader"}, you can only target your assigned group: <strong>{scopeLabel}</strong>
          </div>
        )}
        <div className="grid grid-cols-12 gap-5 p-6 overflow-y-auto">
          <div className="col-span-4 space-y-3">
            <div className="text-xs font-bold text-muted-text">{scopeLocked?"Target Scope (Limited)":"Target Scope (Full Organization)"}</div>
            <div className="bg-card border border-border rounded p-3 text-sm space-y-2 max-h-72 overflow-y-auto">
              <label className="flex items-center gap-2 font-semibold"><input type="checkbox" defaultChecked/> {scopeLocked?`${scopeLabel} (55)`:"ALL AEVM USERS (4,500)"}</label>
              <div className="pl-5 space-y-1 text-xs">
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked/> All Members</label>
                {!scopeLocked && <>
                  <label className="flex items-center gap-2"><input type="checkbox"/> All 18 Departments</label>
                  <label className="flex items-center gap-2"><input type="checkbox"/> All 6 STF Teams</label>
                  <label className="flex items-center gap-2"><input type="checkbox"/> All Panata Groups (CAS1-CCR, CAS2…)</label>
                  <label className="flex items-center gap-2"><input type="checkbox"/> All GE Subject Groups</label>
                </>}
                {["Natalie Portman","Alex Ammin","Ben Affleck","Maria Santos","Jose Reyes"].map(n => (
                  <label key={n} className="flex items-center gap-2"><input type="checkbox"/> {n}</label>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-1"><span className="chip bg-teal text-white">{scopeLocked?scopeLabel:"All AEVM"} ✕</span></div>
          </div>
          <div className="col-span-8 space-y-3">
            {tab==="task" && <>
              <input className="w-full px-3 py-2 border border-border rounded-md text-sm bg-card" defaultValue="TASK: AEVM Multimedia Training Submissions (Week 3)"/>
              <div className="border border-border rounded-md bg-card">
                <div className="flex gap-2 px-3 py-2 border-b border-border text-xs"><b>B</b><i>I</i><span>≡ List</span></div>
                <textarea className="w-full p-3 text-sm bg-card" rows={4} defaultValue="Recording a reliable concentration to record multimedia training as part of the team requirements."/>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs text-muted-text">Due Date</label><input type="datetime-local" defaultValue="2025-08-25T23:59" className="w-full mt-1 px-2 py-1.5 border border-border rounded-md text-sm bg-card"/></div>
                <div><label className="text-xs text-muted-text">Priority</label><select className="w-full mt-1 px-2 py-1.5 border border-border rounded-md text-sm bg-card"><option>High</option><option>Medium</option><option>Low</option></select></div>
                <div><label className="text-xs text-muted-text">Assigner Role</label><select className="w-full mt-1 px-2 py-1.5 border border-border rounded-md text-sm bg-card"><option>{scopeLocked?"Student Leader":"Super Admin"}</option></select></div>
              </div>
              <button className="bg-teal text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-teal-dark">+ ADD NEW TASK</button>
            </>}
            {tab==="ann" && <>
              <input className="w-full px-3 py-2 border border-border rounded-md text-sm bg-card" defaultValue="Announcement Title"/>
              <div className="border border-border rounded-md bg-card">
                <div className="flex gap-2 px-3 py-2 border-b border-border text-xs"><b>B</b><i>I</i><span>≡</span></div>
                <textarea className="w-full p-3 text-sm bg-card" rows={5} defaultValue="Write your announcement body here..."/>
              </div>
              <div className="flex items-center justify-between bg-secondary p-3 rounded">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox"/> Schedule send</label>
                <input type="datetime-local" className="px-2 py-1 border border-border rounded text-sm bg-card"/>
              </div>
              <div className="flex gap-2"><button className="chip bg-teal text-white">Normal</button><button className="chip border border-red-status text-red-status">Urgent</button></div>
            </>}
            {tab==="survey" && <>
              <input className="w-full px-3 py-2 border border-border rounded-md text-sm bg-card" defaultValue="Post-Practice Sentiment Survey"/>
              <textarea className="w-full p-3 border border-border rounded-md text-sm bg-card" rows={2} defaultValue="Quick check on how this week's practice went."/>
              <div className="space-y-2">
                {[1,2].map(i => (
                  <div key={i} className="border border-border rounded p-3 bg-card space-y-2">
                    <select className="px-2 py-1 border border-border rounded text-xs"><option>Multiple Choice</option><option>Short Answer</option><option>Rating (1–5)</option><option>Yes/No</option></select>
                    <input placeholder={`Question ${i}`} className="w-full px-2 py-1 border border-border rounded text-sm" defaultValue={i===1?"How would you rate this week's session?":"What can we improve?"}/>
                    {i===1 && <><input placeholder="Option 1" className="w-full px-2 py-1 border border-border rounded text-sm" defaultValue="Excellent"/>
                    <input placeholder="Option 2" className="w-full px-2 py-1 border border-border rounded text-sm" defaultValue="Needs work"/></>}
                  </div>
                ))}
              </div>
              <button className="bg-teal text-white px-4 py-2 rounded-md text-sm hover:bg-teal-dark">+ Add Question</button>
            </>}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border bg-card flex justify-between gap-2">
          <button className="px-4 py-2 text-sm border border-border rounded-md hover:bg-secondary">Load Template</button>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm border border-border rounded-md hover:bg-secondary">Preview</button>
            <button className="px-4 py-2 text-sm border border-gold text-teal-dark bg-gold-soft rounded-md font-semibold">Save as Template</button>
            <button onClick={() => setModal(null)} className="px-5 py-2 text-sm bg-teal text-white rounded-md font-semibold hover:bg-teal-dark">Send / Assign</button>
          </div>
        </div>
      </div>
    </div>
  );
}
