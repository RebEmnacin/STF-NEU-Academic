// 5. Changes in OperationControl() superadmin
//   - StudentAssigner (apply subtabs (for ge subject group, team, panata group, event(additional)))
//     - GE Subject 
//       - show GE subject as a card (shows how many enrolled there, with view button that shows the list of students))
//       - the target assignment dropdown depends on subject card selected and existing groups in that ge subject (for future feature: add an indicator if the existing groups isnt enough to cater all enrolled students)
//     - Team
//       - show team as a card (shows how many members there, with view button that shows the list of students))
//     - Panata Group
//       - show students' departments as a card (shows how many students were in that department to determine which panata group department they belong)
//       - the target assignment dropdown depends on the department card selected and existing panata groups in that department (for future feature: add an indicator if the existing panata groups in that department isnt enough to cater all students from that department)
//     - Event Manager (additional)
//       - show events (special events) as a card (show how many students that are going to be attendees)
//       - show targets (individual, team, by year level)
//   - PendingRequests (remove small tabs of request type in requests and just make it a list of cards with some details remained)
//   - NewGroupCreation (separate tabs for creating new ge subject group, team, panata group)
//     - Dropdown input for GE subject selection (available GE subject within the current semester) and Teacher (available admin teachers)
//   - Algorithms (merge with new group creation and assigner tabs)
//     - new group creation (with algorithm suggestions for optimal student distribution) and 
//     - assigner (with algorithm suggestions for optimal student-group assignment based on heatmap data/ student availability) 

//   - ADD [FUTURE implementation] Event Manager tab (additional)
//      - determine the roles (generic, unique) needed for such event
// Method to change: Operations()


// SA7: Operations Control (tabbed)
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
      <div>
        <h1 className="font-serif text-2xl font-bold text-teal-dark">Operations Control</h1>
        <p className="text-sm text-muted-text mt-1">Student assignment, request approval, group creation, and semi-automated algorithms.</p>
      </div>

      <div className="flex gap-0 border-b border-border overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition ${tab === t.id ? "border-teal-dark text-teal-dark" : "border-transparent text-muted-text hover:text-teal-dark"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "assigner" && (
        <section className="bg-card border border-border rounded-xl p-5 card-soft space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {[["Unassigned", "65", "bg-amber-status text-white"], ["Selected", String(selected.length), "bg-teal text-white"], ["Open GE Slots", "42", "bg-teal-light text-white"], ["Open Panata Slots", "18", "bg-gold text-teal-dark"]].map(([k,v,c]) => (
              <div key={k} className={`${c} rounded-lg p-4`}><div className="text-xs opacity-85">{k}</div><div className="font-serif text-2xl font-bold mt-1">{v}</div></div>
            ))}
          </div>
          <div className="bg-teal-soft/40 border border-teal/20 rounded-lg px-4 py-2 text-xs">
            Multi-select students, choose a target group, then assign. Suggestions weighted by Availability Heatmap.
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="border border-border rounded-lg p-3">
              <div className="text-xs font-bold text-muted-text mb-2">UNASSIGNED STUDENTS</div>
              <ul className="space-y-1.5">
                {unassigned.map(u => {
                  const on = selected.includes(u.id);
                  return (
                    <li key={u.id}>
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
      )}

      {tab === "requests" && (
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
            ].map(c => (
              <button key={c.type} onClick={() => setReqType(c.type)}
                className="text-left p-4 rounded-xl border border-border bg-card hover:border-teal/40 transition">
                <div className="text-xs font-bold text-teal-dark">{c.type}</div>
                <div className="font-serif text-2xl font-bold mt-1">{c.count}</div>
                <div className="text-[11px] text-muted-text mt-1">{c.desc}</div>
              </button>
            ))}
          </div>
          <table className="w-full text-sm">
            <thead className="bg-teal-dark text-white text-xs uppercase"><tr>{["Submitted", "Type", "Requester", "Details", "Actions"].map(h => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>
              {filteredReqs.map(r => (
                <tr key={r.id} className="row-alt border-b border-border">
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
      )}

      {tab === "groups" && (
        <section className="grid grid-cols-3 gap-4">
          {[
            { title: "Create GE Subject Group", fields: ["GE Subject", "Group Name", "Teacher"] },
            { title: "Create Team", fields: ["Team Name", "Lead", "Overseer"] },
            { title: "Create Panata Group", fields: ["Group Code", "Assigned Department", "Monitor"] },
          ].map(g => (
            <div key={g.title} className="bg-card border border-border rounded-xl p-5 card-soft">
              <h3 className="font-serif font-bold text-teal-dark mb-3">{g.title}</h3>
              {g.fields.map(f => (
                <div key={f} className="mb-2"><label className="text-xs text-muted-text">{f}</label>
                  <input className="w-full mt-0.5 px-3 py-2 border border-border rounded text-sm bg-card"/></div>
              ))}
              <button className="w-full mt-2 py-2 bg-teal text-white rounded text-sm font-semibold hover:bg-teal-dark">+ Create</button>
            </div>
          ))}
        </section>
      )}

      {tab === "algorithms" && (
        <section className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-5 card-soft">
              <h3 className="font-serif font-bold text-teal-dark mb-2">GE Subject Group Calculator</h3>
              <p className="text-xs text-muted-text mb-3">Based on enrolled students per GE subject — editable split.</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><label className="text-xs text-muted-text">Enrolled Students</label>
                  <input type="number" value={geStudents} onChange={e => setGeStudents(Number(e.target.value))} className="w-full mt-1 px-3 py-2 border border-border rounded text-sm"/></div>
                <div><label className="text-xs text-muted-text">Students per Group</label>
                  <input type="number" value={gePerGroup} onChange={e => setGePerGroup(Number(e.target.value))} className="w-full mt-1 px-3 py-2 border border-border rounded text-sm"/></div>
              </div>
              <div className="bg-teal-soft rounded-lg p-3 text-sm"><strong>{geGroupsNeeded}</strong> group(s) needed · ~{Math.ceil(geStudents / geGroupsNeeded)} students each</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 card-soft">
              <h3 className="font-serif font-bold text-teal-dark mb-2">Panata Group Calculator</h3>
              <p className="text-xs text-muted-text mb-3">Based on students in a department — editable split.</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><label className="text-xs text-muted-text">Dept Students</label>
                  <input type="number" value={panataStudents} onChange={e => setPanataStudents(Number(e.target.value))} className="w-full mt-1 px-3 py-2 border border-border rounded text-sm"/></div>
                <div><label className="text-xs text-muted-text">Students per Group</label>
                  <input type="number" value={panataPerGroup} onChange={e => setPanataPerGroup(Number(e.target.value))} className="w-full mt-1 px-3 py-2 border border-border rounded text-sm"/></div>
              </div>
              <div className="bg-gold-soft rounded-lg p-3 text-sm"><strong>{panataGroupsNeeded}</strong> group(s) needed · ~{Math.ceil(panataStudents / panataGroupsNeeded)} students each</div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 card-soft">
            <h3 className="font-serif font-bold text-teal-dark mb-2">Event Duty Assignment (Heatmap-based)</h3>
            <p className="text-xs text-muted-text mb-3">Assign individual students or teams to event duties based on availability heatmap.</p>
            <div className="grid grid-cols-3 gap-3">
              <select className="px-3 py-2 border border-border rounded text-sm bg-card"><option>Choir Concert B4</option><option>Snapseed Seminar</option></select>
              <select className="px-3 py-2 border border-border rounded text-sm bg-card"><option>Ushering</option><option>Stage Crew</option><option>Photographer</option></select>
              <button className="py-2 bg-teal text-white rounded text-sm font-semibold hover:bg-teal-dark">Auto-Assign from Heatmap</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// CHANGES
import { useState } from "react";
// Assumes standard Lucide icons and existing context are imported at the top of your file.

export function Operations() {
  // 🟢 HIGHLIGHT: 1. Updated main tabs - Removed 'algorithms', added 'events'
  const [tab, setTab] = useState<"assigner" | "requests" | "groups" | "events">("assigner");
  
  // 🟢 HIGHLIGHT: 2. Added sub-tab states for Assigner and New Group Creation
  const [assignerSubTab, setAssignerSubTab] = useState<"ge" | "team" | "panata" | "event">("ge");
  const [groupSubTab, setGroupSubTab] = useState<"ge" | "team" | "panata">("ge");

  const [selected, setSelected] = useState<string[]>([]);
  
  // Algorithm States
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

  // 🟢 HIGHLIGHT: 3. Removed `reqTypes` filter array and `reqType` state logic for pending requests.
  
  const geGroupsNeeded = Math.max(1, Math.ceil(geStudents / gePerGroup));
  const panataGroupsNeeded = Math.max(1, Math.ceil(panataStudents / panataPerGroup));

  // 🟢 HIGHLIGHT: 4. Refined main tabs structure
  const tabs = [
    { id: "assigner" as const, label: "Student Assigner" },
    { id: "requests" as const, label: "Pending Requests" },
    { id: "groups" as const, label: "New Group Creation" },
    { id: "events" as const, label: "Event Manager" }, 
  ];

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="font-serif text-2xl font-bold text-teal-dark">Operations Control</h1>
        <p className="text-sm text-muted-text mt-1">Student assignment, request approval, group creation, and semi-automated algorithms.</p>
      </div>

      <div className="flex gap-0 border-b border-border overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition ${tab === t.id ? "border-teal-dark text-teal-dark" : "border-transparent text-muted-text hover:text-teal-dark"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* 🟢 HIGHLIGHT: 5. Student Assigner Redesign */}
      {tab === "assigner" && (
        <section className="bg-card border border-border rounded-xl p-5 card-soft space-y-4">
          
          {/* Sub-tabs for Assigner Context */}
          <div className="flex gap-2 border-b border-border pb-3">
            {[
              { id: "ge", label: "GE Subjects" },
              { id: "team", label: "Teams" },
              { id: "panata", label: "Panata Groups" },
              { id: "event", label: "Events (Duties)" }
            ].map(sub => (
              <button key={sub.id} onClick={() => setAssignerSubTab(sub.id as any)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg ${assignerSubTab === sub.id ? "bg-teal text-white" : "bg-secondary text-muted-text hover:bg-teal-soft/50"}`}>
                {sub.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Contextual Cards based on Sub-tab */}
            <div className="border border-border rounded-lg p-3">
              <div className="text-xs font-bold text-muted-text mb-3 uppercase tracking-wider">
                {assignerSubTab === "panata" ? "DEPARTMENTS" : assignerSubTab.toUpperCase() + " SELECTION"}
              </div>
              
              <div className="space-y-2">
                {/* Simulated Context Cards */}
                {assignerSubTab === "ge" && (
                  <div className="p-3 border border-teal/40 bg-teal-soft/20 rounded cursor-pointer">
                    <div className="font-bold text-teal-dark">Sosyedad at Literatura</div>
                    <div className="text-xs text-muted-text mt-1">120 Enrolled Students</div>
                    <button className="text-xs text-teal font-semibold mt-2 hover:underline">View Roster</button>
                  </div>
                )}
                {assignerSubTab === "panata" && (
                  <div className="p-3 border border-border bg-card rounded cursor-pointer hover:border-teal/40">
                    <div className="font-bold text-teal-dark">College of Information (CICS)</div>
                    <div className="text-xs text-muted-text mt-1">350 Students in Department</div>
                  </div>
                )}
                {assignerSubTab === "team" && (
                  <div className="p-3 border border-border bg-card rounded cursor-pointer hover:border-teal/40">
                    <div className="font-bold text-teal-dark">Video Team</div>
                    <div className="text-xs text-muted-text mt-1">45 Active Members</div>
                  </div>
                )}
                {assignerSubTab === "event" && (
                  <div className="p-3 border border-border bg-card rounded cursor-pointer hover:border-teal/40">
                    <div className="font-bold text-teal-dark">Choir Concert Orientation</div>
                    <div className="text-xs text-muted-text mt-1">Expected Attendees: 200</div>
                  </div>
                )}
              </div>
            </div>

            {/* Assignment & Heatmap Engine */}
            <div className="border border-border rounded-lg p-3 space-y-3">
              <div>
                <label className="text-xs font-bold text-muted-text">Target Group / Role</label>
                {/* 🟢 HIGHLIGHT: Target dropdown adapts to selected context card */}
                <select className="w-full mt-1 px-3 py-2 border border-border rounded text-sm bg-card">
                  {assignerSubTab === "ge" && <><option>SosLit — IS234A</option><option>SosLit — IS234B</option></>}
                  {assignerSubTab === "panata" && <><option>CICS3 Panata</option><option>CICS4 Panata</option></>}
                  {assignerSubTab === "team" && <><option>Video Team 104</option></>}
                  {assignerSubTab === "event" && <><option>Event Usher</option><option>Stage Crew</option></>}
                </select>
              </div>

              {/* 🟢 HIGHLIGHT: Algorithms merged directly into Assigner tools */}
              <div className="bg-secondary/50 rounded p-3 text-xs border border-border">
                <span className="font-semibold text-teal-dark">⚡ Algorithm Suggestion:</span><br />
                Based on Availability Heatmaps, the optimal common window for selected students is <strong>Sun 7AM–10AM</strong> (89% overlap).
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 py-2 border border-border rounded text-sm font-semibold hover:bg-secondary">Manual Assign</button>
                <button className="flex-1 py-2 bg-teal text-white rounded text-sm font-semibold hover:bg-teal-dark">Auto-Assign (Heatmap)</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 🟢 HIGHLIGHT: 6. Pending Requests Redesign */}
      {tab === "requests" && (
        <section className="space-y-4">
          {/* Removed small request type filter tabs, shifted immediately to Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.map(r => (
              <div key={r.id} className="bg-card border border-border rounded-xl p-5 card-soft hover:border-teal/40 transition">
                <div className="flex justify-between items-start mb-3">
                  <span className="chip bg-teal-soft text-teal font-semibold text-[10px] uppercase tracking-wider">{r.type}</span>
                  <span className="text-[11px] text-muted-text">{r.date}</span>
                </div>
                <div className="font-serif text-lg font-bold text-foreground">{r.requester}</div>
                <div className="text-sm text-muted-text mt-1 mb-4 h-10">{r.details}</div>
                
                <div className="flex gap-2">
                  <button onClick={() => setRequests(q => q.filter(x => x.id !== r.id))} className="flex-1 bg-gold text-teal-dark py-2 rounded-lg text-xs font-bold hover:brightness-105 transition">Approve</button>
                  <button onClick={() => setRequests(q => q.filter(x => x.id !== r.id))} className="flex-1 bg-secondary text-muted-text border border-border py-2 rounded-lg text-xs font-bold hover:bg-red-status hover:text-white hover:border-red-status transition">Reject</button>
                </div>
              </div>
            ))}
            {requests.length === 0 && <div className="col-span-3 text-center py-10 text-muted-text text-sm">No pending requests at this time.</div>}
          </div>
        </section>
      )}

      {/* 🟢 HIGHLIGHT: 7. New Group Creation Redesign (Merged with Algorithms) */}
      {tab === "groups" && (
        <section className="bg-card border border-border rounded-xl p-5 card-soft space-y-4">
          
          <div className="flex gap-2 border-b border-border pb-3 mb-4">
            {[
              { id: "ge", label: "GE Subject Group" },
              { id: "team", label: "Team" },
              { id: "panata", label: "Panata Group" },
            ].map(sub => (
              <button key={sub.id} onClick={() => setGroupSubTab(sub.id as any)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg ${groupSubTab === sub.id ? "bg-teal text-white" : "bg-secondary text-muted-text hover:bg-teal-soft/50"}`}>
                {sub.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-teal-dark text-lg">Create New {groupSubTab.toUpperCase()} Record</h3>
              
              {/* 🟢 HIGHLIGHT: Dropdown specifically requested for GE Context */}
              {groupSubTab === "ge" && (
                <>
                  <div>
                    <label className="text-xs font-bold text-muted-text">Target GE Subject (Current Semester)</label>
                    <select className="w-full mt-1 px-3 py-2 border border-border rounded text-sm bg-card">
                      <option>Art Appreciation</option>
                      <option>Sosyedad at Literatura</option>
                      <option>Ethics</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-text">Assign Admin Teacher</label>
                    <select className="w-full mt-1 px-3 py-2 border border-border rounded text-sm bg-card">
                      <option>Prof. Sandoval</option>
                      <option>Prof. Reyes</option>
                    </select>
                  </div>
                </>
              )}

              {/* Generic Inputs for Panata and Team */}
              {groupSubTab !== "ge" && (
                <div>
                  <label className="text-xs font-bold text-muted-text">Group/Team Name</label>
                  <input className="w-full mt-1 px-3 py-2 border border-border rounded text-sm bg-card" placeholder="Enter identifier..."/>
                </div>
              )}

              <button className="w-full py-2.5 bg-teal text-white rounded-lg text-sm font-semibold hover:bg-teal-dark transition shadow-sm">+ Provision Group</button>
            </div>

            {/* 🟢 HIGHLIGHT: Algorithms merged directly into creation flows */}
            <div className="bg-secondary/30 border border-border rounded-xl p-5">
              {groupSubTab === "ge" && (
                <>
                  <h3 className="font-serif font-bold text-teal-dark mb-2">GE Optimal Split Calculator</h3>
                  <p className="text-xs text-muted-text mb-4">Determine how many sub-groups are required based on active enrollment numbers.</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="text-xs text-muted-text">Total Enrolled</label>
                      <input type="number" value={geStudents} onChange={e => setGeStudents(Number(e.target.value))} className="w-full mt-1 px-3 py-2 border border-border rounded text-sm"/>
                    </div>
                    <div>
                      <label className="text-xs text-muted-text">Cap per Group</label>
                      <input type="number" value={gePerGroup} onChange={e => setGePerGroup(Number(e.target.value))} className="w-full mt-1 px-3 py-2 border border-border rounded text-sm"/>
                    </div>
                  </div>
                  <div className="bg-teal-soft/50 border border-teal/20 rounded-lg p-3 text-sm text-teal-dark">
                    Suggestion: Create <strong>{geGroupsNeeded}</strong> group(s) with ~{Math.ceil(geStudents / geGroupsNeeded)} students each.
                  </div>
                </>
              )}

              {groupSubTab === "panata" && (
                <>
                  <h3 className="font-serif font-bold text-teal-dark mb-2">Panata Dept Split Calculator</h3>
                  <p className="text-xs text-muted-text mb-4">Calculate required Panata groups for a given department size.</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="text-xs text-muted-text">Dept Students</label>
                      <input type="number" value={panataStudents} onChange={e => setPanataStudents(Number(e.target.value))} className="w-full mt-1 px-3 py-2 border border-border rounded text-sm"/>
                    </div>
                    <div>
                      <label className="text-xs text-muted-text">Cap per Group</label>
                      <input type="number" value={panataPerGroup} onChange={e => setPanataPerGroup(Number(e.target.value))} className="w-full mt-1 px-3 py-2 border border-border rounded text-sm"/>
                    </div>
                  </div>
                  <div className="bg-gold/20 border border-gold/30 rounded-lg p-3 text-sm text-teal-dark">
                    Suggestion: Create <strong>{panataGroupsNeeded}</strong> group(s) with ~{Math.ceil(panataStudents / panataGroupsNeeded)} students each.
                  </div>
                </>
              )}

              {groupSubTab === "team" && (
                <div className="text-sm text-muted-text italic flex items-center justify-center h-full">
                  No distribution algorithms required for open Team structures.
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 🟢 HIGHLIGHT: 8. Future Event Manager Implementation */}
      {tab === "events" && (
        <section className="bg-card border border-border rounded-xl p-8 card-soft text-center">
          <div className="w-16 h-16 bg-teal-soft text-teal rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
          </div>
          <h3 className="font-serif font-bold text-teal-dark text-xl mb-2">Event Manager Module</h3>
          <p className="text-sm text-muted-text max-w-md mx-auto mb-6">
            This module is slated for a future update. It will allow you to construct specialized events, define generic/unique roles, and structure audience targets by year level or team.
          </p>
          <button disabled className="px-6 py-2 bg-secondary text-muted-text rounded-lg text-sm font-semibold cursor-not-allowed">
            Coming Soon
          </button>
        </section>
      )}
    </div>
  );
}
