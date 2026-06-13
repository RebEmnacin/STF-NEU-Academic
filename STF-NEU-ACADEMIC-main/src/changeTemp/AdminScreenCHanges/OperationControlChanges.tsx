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