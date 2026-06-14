import { usePortal } from "./PortalContext";
import { useState, useEffect, useRef, Fragment } from "react";
import { 
  Shield, Building2, Mail, Hash, Activity, Award, CheckCircle, 
  Users, SlidersHorizontal, AlertCircle, Clock, BookOpen, BookMarked, 
  Calendar, ChevronLeft, ChevronRight, Tv2, Info, Library, UserCircle
} from "lucide-react";
import {
  Download, Search, 
ClipboardList,
  Send, CalendarCheck, X
} from "lucide-react";

import { roster, SectionCard, AvatarSVG, MiniBar, ProfileModal, MessageModal, SubmissionsModal,
        StatCard, geSessions, AttendanceLogger, SessionAttendanceModal
} from './LeaderScreens';


/*
CHANGES
1. Added AdminProfile() - just needs linking to view the look of it (right now it just links into admin dashboard)
2. Deprecate the old regular admin design (MyStudents()) and old super admin design (StudentManagement())
  - MyStudents() for regular admin
    - add more subjects responsibility for showcasing a ge group monitor handling 2 or more GE subject groups (multiple rosters)
  - StudentManagement() [masterlist of all students (for super admin)] (with search bar function and sorting)
    - View all students, all existing GE subject groups, team ,panata groups
    - subtabs for filtering by GE subjects groups, team, panata groups
3. Changes in OperationControl() superadmin
  - StudentAssigner (apply subtabs (for ge subject group, team, panata group, event(additional)))
    - GE Subject 
      - show GE subject as a card (shows how many enrolled there, with view button that shows the list of students))
      - the target assignment dropdown depends on subject card selected and existing groups in that ge subject (for future feature: add an indicator if the existing groups isnt enough to cater all enrolled students)
    - Team
      - show team as a card (shows how many members there, with view button that shows the list of students))
    - Panata Group
      - show students' departments as a card (shows how many students were in that department to determine which panata group department they belong)
      - the target assignment dropdown depends on the department card selected and existing panata groups in that department (for future feature: add an indicator if the existing panata groups in that department isnt enough to cater all students from that department)
    - Event Manager (additional)
      - show events (special events) as a card (show how many students that are going to be attendees)
      - show targets (individual, team, by year level)
  - PendingRequests (remove small tabs of request type in requests and just make it a list of cards with some details remained)
  - NewGroupCreation (separate tabs for creating new ge subject group, team, panata group)
    - Dropdown input for GE subject selection (available GE subject within the current semester) and Teacher (available admin teachers)
  - Algorithms (merge with new group creation and assigner tabs)
    - new group creation (with algorithm suggestions for optimal student distribution) and 
    - assigner (with algorithm suggestions for optimal student-group assignment based on heatmap data/ student availability) 
  - ADD [FUTURE implementation] Event Manager tab (additional)
     - determine the roles (generic, unique) needed for such event

TO BE CHANGED/ TO DO:
  6. Changes in Grading System
  - View all existing GE Subject groups (view performance, attendance rate), panata groups (attendance rate), teams (attendance rate)
    - 

*/



// AD2: My Students (section)

export function MyStudents() {
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


// AD4: Section Attendance Tracker (reuse Super Admin session list scoped)
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

// SA7: Operations Control (tabbed)
// SA7: Operations Control (tabbed)
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


function AdminRadarChart({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const DURATION = 900;

  useEffect(() => {
    const delay = setTimeout(() => {
      const animate = (now: number) => {
        if (startRef.current === null) startRef.current = now;
        const elapsed = now - startRef.current;
        const t = Math.min(elapsed / DURATION, 1);
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

  // 🌟 HIGHLIGHTED CHANGE: Custom axes based on Admin vs SuperAdmin
  const axes = isSuperAdmin 
    ? [
        { label: "System Uptime", value: 0.99 },
        { label: "Data Integrity",value: 0.98 },
        { label: "Resolution",    value: 0.85 },
        { label: "Global Sync",   value: 0.95 },
        { label: "Access Control",value: 1.0 },
        { label: "Compliance",    value: 0.96 },
      ]
    : [
        { label: "Class Sync",    value: 0.94 },
        { label: "Grading TAT",   value: 0.88 },
        { label: "Student Comm",  value: 0.82 },
        { label: "Dispute Mgmt",  value: 0.90 },
        { label: "Audit Accuracy",value: 0.95 },
        { label: "Compliance",    value: 0.92 },
      ];
      
  const n = axes.length;
  const cx = 130; const cy = 130; const maxR = 96;
  const rings = [0.25, 0.5, 0.75, 1.0];

  function polarToXY(i: number, r: number) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  const dataPoints = axes.map((a, i) => polarToXY(i, a.value * maxR * progress));
  const polyStr = dataPoints.map(p => `${p.x},${p.y}`).join(" ");
  const ringPolys = rings.map(frac => axes.map((_, i) => polarToXY(i, frac * maxR)).map(p => `${p.x},${p.y}`).join(" "));
  const labelPositions = axes.map((a, i) => ({ ...polarToXY(i, maxR + 26), label: a.label, value: a.value }));

  return (
    <svg viewBox="0 0 260 280" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"auto"}}>
      {ringPolys.map((pts, ri) => <polygon key={ri} points={pts} fill="none" stroke={isSuperAdmin ? "#F5C518" : "#1B6B8F"} strokeOpacity={0.2} strokeWidth="1"/>)}
      {axes.map((_, i) => <line key={i} x1={cx} y1={cy} x2={polarToXY(i, maxR).x} y2={polarToXY(i, maxR).y} stroke={isSuperAdmin ? "#F5C518" : "#1B6B8F"} strokeOpacity="0.25" strokeWidth="1"/>)}
      <polygon points={polyStr} fill={isSuperAdmin ? "rgba(245,197,24,0.18)" : "rgba(27,107,143,0.18)"} stroke={isSuperAdmin ? "#F5C518" : "#1B6B8F"} strokeWidth="2"/>
      {dataPoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4.5" fill={isSuperAdmin ? "#F5C518" : "#1B6B8F"} stroke="white" strokeWidth="1.5"/>)}
      {labelPositions.map((l, i) => (
        <g key={i}>
          <text x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle" fontSize="9.5" fill="#6b7280" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600">{l.label.toUpperCase()}</text>
          <text x={l.x} y={l.y + 12} textAnchor="middle" dominantBaseline="middle" fontSize="9.5" fill={isSuperAdmin ? "#d97706" : "#1B6B8F"} fontFamily="Sora, sans-serif" fontWeight="700">{Math.round(l.value * 100)}%</text>
        </g>
      ))}
      <circle cx={cx} cy={cy} r="3" fill={isSuperAdmin ? "#F5C518" : "#1B6B8F"} opacity="0.4"/>
    </svg>
  );
}

// ─── Admin Profile ────────────────────────────────────────────────────────────
export function AdminProfile() {
  const { role } = usePortal();
  
  const [currentTab, setCurrentTab] = useState("overview");
  if (role !== "admin" && role !== "superadmin") {
    return (
      <div className="p-7 text-center text-red-status font-semibold flex items-center gap-2 justify-center">
        <AlertCircle className="w-5 h-5" /> Access Denied: Administrative Scope Required.
      </div>
    );
  }

  const isAdmin = role === "admin";
  const isSuperAdmin = role === "superadmin";
  
  const adminTabs = [
    { id: "overview",       label: "Overview",       Icon: UserCircle },
    { id: "assigned-scope", label: "Class Sections", Icon: Building2 },
    { id: "audit",          label: "Monitor Logs",   Icon: Clock }
  ];

  const superAdminTabs = [
    { id: "overview",       label: "Overview",            Icon: UserCircle },
    { id: "org-control",    label: "Global Operations",   Icon: SlidersHorizontal },
    { id: "audit",          label: "System Audit Logs",   Icon: Shield }
  ];

  const activeTabs = isAdmin ? adminTabs : superAdminTabs;

  const profileData = {
    name: isAdmin ? "Prof. Eleanor Vance" : "Dr. Alistair Sterling",
    title: isAdmin ? "Academic Course Monitor" : "Chief Institutional Admin",
    employeeId: isAdmin ? "EMP-2023-8841" : "EMP-2018-0001",
    email: isAdmin ? "e.vance@stf-neu.edu.ph" : "a.sterling@stf-neu.edu.ph",
    department: isAdmin ? "College of Information and Computer Studies" : "Office of Institutional Operations",
    scopeLabel: isAdmin ? "GE 101 — Section A" : "Full Organization (All STF-NEU)",
  };

  // 🌟 HIGHLIGHTED CHANGE: SVG Icons mapping Admin/SuperAdmin capabilities
  const StatIcons = {
    Students: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/80"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Sync:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/80"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    Tasks:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/80"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    Nodes:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/80"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  };

  const adminStats = [
    { label:"Students",      value:"42",     sub:"monitored currently", color:"from-teal to-teal-light",      IconComp: StatIcons.Students },
    { label:"Att Sync",      value:"94.2%",  sub:"average sync rate",   color:"from-teal-light to-[#5A8FA8]", IconComp: StatIcons.Sync     },
    { label:"Pending Eval",  value:"8",      sub:"tasks to grade",      color:"from-[#4A7A8A] to-[#3D6B7A]",  IconComp: StatIcons.Tasks    },
    { label:"Active Secs",   value:"1",      sub:"GE 101-A",            color:"from-slate-blue to-[#3D5466]", IconComp: StatIcons.Nodes    },
  ];

  const superAdminStats = [
    { label:"Enrolments",    value:"1,480",  sub:"active students",     color:"from-[#b45309] to-[#d97706]",  IconComp: StatIcons.Students },
    { label:"Command Nodes", value:"24",     sub:"active clusters",     color:"from-[#ca8a04] to-[#eab308]",  IconComp: StatIcons.Nodes    },
    { label:"System Uptime", value:"99.9%",  sub:"engine logs",         color:"from-[#047857] to-[#10b981]",  IconComp: StatIcons.Sync     },
    { label:"Global Flags",  value:"0",      sub:"issues detected",     color:"from-[#1e3a8a] to-[#047857]",  IconComp: Shield           },
  ];

  const statCards = isAdmin ? adminStats : superAdminStats;

  return (
    <div className="p-0 pb-7">
      <FadeUp>
        {/* 🌟 HIGHLIGHTED CHANGE: Tall gradient hero banner mirroring Student Profile */}
        <div className="relative overflow-hidden mb-0" style={{height:160, background: isSuperAdmin ? "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 80%, #f59e0b 100%)" : "linear-gradient(135deg, #0D4A6B 0%, #1B6B8F 50%, #4A8FA8 80%, #5A8FA8 100%)"}}>
          <div style={{position:"absolute",top:-30,right:-30,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
          <div style={{position:"absolute",bottom:-40,left:"30%",width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
          <div className="absolute top-5 left-7">
            <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Administrative Profile</div>
            <div className="text-white font-serif font-bold text-2xl">{profileData.name.toUpperCase()}</div>
          </div>
          <div className="absolute top-5 right-7">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white/90 border border-white/30" style={{background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)"}}>
              Security Clearance: Tier-{isAdmin ? "2" : "1"}
            </span>
          </div>
        </div>
      </FadeUp>

      <div className="px-7">
        <FadeUp delay={60}>
          {/* 🌟 HIGHLIGHTED CHANGE: Floating Avatar and Data block */}
          <div className="flex gap-5 items-start -mt-8 mb-6">
            <div className="shrink-0 relative">
              <div className="w-24 h-24 rounded-2xl border-4 border-background shadow-2xl grid place-items-center overflow-hidden" style={{background: isSuperAdmin ? "linear-gradient(135deg, #b45309, #f59e0b)" : "linear-gradient(135deg, #1B6B8F, #4A8FA8)"}}>
                <Shield className="w-12 h-12 text-white/90" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                <svg viewBox="0 0 10 10" className="w-2.5 h-2.5"><circle cx="5" cy="5" r="3" fill="white"/></svg>
              </span>
            </div>

            <div className="pt-10 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="font-serif font-bold text-teal-dark text-2xl leading-tight">{profileData.name}</h1>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-sm text-muted-text">{profileData.title}</span>
                    <span className="text-muted-text/40">·</span>
                    <span className="text-sm font-mono text-muted-text">{profileData.employeeId}</span>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${isSuperAdmin ? "bg-gold/15 text-yellow-700 border-gold/30" : "bg-teal/10 text-teal border-teal/20"}`}>
                      Scope: {profileData.scopeLabel}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-secondary text-muted-text border border-border">
                      {profileData.department}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🌟 HIGHLIGHTED CHANGE: Gradient stat cards mirroring Student Profile */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {statCards.map((s, i) => (
              <FadeUp key={s.label} delay={i * 50}>
                <div className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white shadow-md`} style={{boxShadow:"0 4px 14px rgba(0,0,0,0.12)"}}>
                  <div className="mb-1.5"><s.IconComp/></div>
                  <div className="font-serif font-bold text-3xl leading-none">{s.value}</div>
                  <div className="text-white/80 text-xs font-semibold mt-1 uppercase tracking-wide">{s.label}</div>
                  <div className="text-white/60 text-[10px] mt-0.5">{s.sub}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </FadeUp>

        {/* 🌟 HIGHLIGHTED CHANGE: Pill-style Tabbed Panel */}
        <FadeUp delay={120}>
          <div className="bg-card border border-border rounded-2xl overflow-hidden" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.08)"}}>
            <div className="flex gap-1 p-2 border-b border-border bg-secondary/20 overflow-x-auto">
              {activeTabs.map(t => (
                <button key={t.id} onClick={() => setCurrentTab(t.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
                  style={currentTab === t.id ? {background:"var(--teal-dark)", color:"#fff", boxShadow:"0 2px 8px rgba(13,74,107,0.3)"} : {color:"var(--muted-text)", background:"transparent"}}>
                  <t.Icon className="w-3.5 h-3.5"/>{t.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {currentTab === "overview" && (
                <div className="flex gap-5 items-start">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-muted-text uppercase tracking-widest mb-3">System Access Profile Parameters</div>
                    <div className="bg-secondary/30 rounded-xl p-4 transition-colors border border-border/30 mb-5">
                      <p className="text-sm text-muted-text leading-relaxed mb-3">This administrative profile sheet controls access tokens routing automated verification pipelines.</p>
                      <div className="p-3 bg-card border border-border rounded-xl text-xs font-mono text-foreground space-y-1">
                        <div>Security Matrix Clearances: Tier-{isAdmin ? "2 (Course Monitor)" : "1 (Global Root)"}</div>
                        <div>Assigned Signature Node: {isAdmin ? "STF-NEU-SEC-MON-ALPHA" : "STF-NEU-SEC-ROOT-SYSTEM"}</div>
                        <div>Terminal Session IP Clearance: Authorized via Single Sign On Proxy Protocol</div>
                      </div>
                    </div>
                    
                    <div className="text-xs font-bold text-muted-text uppercase tracking-widest mb-3">Contact routing</div>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {[
                        {label:"Primary Work Email", value: profileData.email},
                        {label:"Employee Registry",  value: profileData.employeeId},
                      ].map(({label, value}) => (
                        <div key={label} className="bg-secondary/30 rounded-xl p-4 transition-colors border border-border/30">
                          <div className="text-xs text-muted-text font-semibold uppercase tracking-wide mb-1.5">{label}</div>
                          <div className="font-semibold text-sm text-foreground">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 🌟 HIGHLIGHTED CHANGE: Admin/SuperAdmin Radar Chart */}
                  <div className="shrink-0 w-96">
                    <div className="rounded-2xl border border-border p-6 bg-secondary/10">
                      <div className="text-xs font-bold text-muted-text uppercase tracking-widest mb-1">System Health & Metrics</div>
                      <p className="text-[11px] text-muted-text mb-4">Core vitals for current semester operations</p>
                      <AdminRadarChart isSuperAdmin={isSuperAdmin} />
                    </div>
                  </div>
                </div>
              )}

              {currentTab === "assigned-scope" && isAdmin && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-teal-dark text-base mb-2">Class Section Assignments control</h3>
                  <p className="text-sm text-muted-text mb-4">The master parameters below delineate your explicit tracking jurisdictions over course nodes.</p>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-teal-dark text-white text-xs font-semibold uppercase">
                        <tr><th className="p-3">Section Code</th><th className="p-3">Course Description</th><th className="p-3">Schedule Slot</th><th className="p-3">Status</th></tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border text-xs bg-card">
                          <td className="p-3 font-bold text-teal-dark">GE101-SECA</td><td className="p-3">Art Appreciation</td><td className="p-3 font-mono">TUE/THU 11:30-13:00</td>
                          <td className="p-3"><span className="text-green-700 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 font-semibold">Track Active</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {currentTab === "org-control" && !isAdmin && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-teal-dark text-base mb-2">Global Operations Control Parameters</h3>
                  <p className="text-sm text-muted-text mb-4">Super-Admin architectural controls to override master tracking matrix synchronization intervals.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 border border-border bg-secondary/20 rounded-xl hover:border-red-status/40 transition">
                      <div className="text-sm font-bold text-teal-dark mb-1">Global Lock-out Triggers</div>
                      <div className="text-xs text-muted-text mb-4">Enforces a global read-only freeze context across all student profiles.</div>
                      <button className="px-4 py-2 bg-red-status text-white text-xs font-bold rounded-lg hover:opacity-90 transition">Deploy Master Freeze</button>
                    </div>
                    <div className="p-5 border border-border bg-secondary/20 rounded-xl hover:border-teal/40 transition">
                      <div className="text-sm font-bold text-teal-dark mb-1">COM Scheduling Integration</div>
                      <div className="text-xs text-muted-text mb-4">Triggers automated background cron compilation tasks matching COM master records.</div>
                      <button className="px-4 py-2 bg-teal-dark text-white text-xs font-bold rounded-lg hover:opacity-90 transition">Force COM Sync</button>
                    </div>
                  </div>
                </div>
              )}

              {currentTab === "audit" && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-teal-dark text-base mb-3">Recent Security Access & Mutation Logs</h3>
                  <div className="bg-secondary/20 border border-border rounded-xl p-4">
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex items-start gap-3 text-muted-text py-2 border-b border-border/40">
                        <Clock className="w-4 h-4 mt-0.5 text-teal shrink-0" />
                        <div><span className="text-foreground font-semibold">[2026-06-12 14:22:01]</span> Verified session tokens via Single Sign On proxy pipeline protocol.</div>
                      </div>
                      <div className="flex items-start gap-3 text-muted-text py-2 border-b border-border/40">
                        <Clock className="w-4 h-4 mt-0.5 text-teal shrink-0" />
                        <div><span className="text-foreground font-semibold">[2026-06-11 09:15:34]</span> Compiled tracking node sheets for matching session metrics.</div>
                      </div>
                      <div className="flex items-start gap-3 text-muted-text py-2">
                        <Clock className="w-4 h-4 mt-0.5 text-teal shrink-0" />
                        <div><span className="text-foreground font-semibold">[2026-06-10 18:02:11]</span> Administrative policy payload updated successfully.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}