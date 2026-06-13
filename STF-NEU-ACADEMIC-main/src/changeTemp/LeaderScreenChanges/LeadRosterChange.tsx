import { usePortal } from "../../components/portal/PortalContext";
import { useState, useEffect, useRef, Fragment } from "react";
import {
  X, Download, Copy, RefreshCw, Search, Plus, Edit3, Save,
  Users, QrCode, ScanLine, ClipboardList, Thermometer, Library,
  ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Lock,
  GripVertical, MapPin, Calendar, Send, Pencil, Trash2, Link,
  Upload, FileText, Megaphone, CheckSquare, BarChart2, CalendarCheck,
  BookOpen, CalendarDays, CalendarPlus,
} from "lucide-react";


// TO BE CHANGED/TO DO:
// 1. [Roster() ] 
//   - Add panata group members in panata monitor role tab sidebar and ge subject group members in ge monitor role tab sidebar
//     - Sidebar changes
//     - linked to team members or make a new function with different list of students
//   - add more subjects responsibility for showcasing a ge group monitor handling 2 or more GE subject groups (multiple rosters)
//   - add more sample students, change table formatting: student name, yr level, attendance rate, actions
//   - change view as list of long cards per handled monitored groups with stats (no. of students, avg. attendance rate. etc.) and view masterlist button to proceed to the students table
// Methods to be changed: Roster()
// Methods for referencing: Responsibilities(), Sidebar()

// ─── Old Roster ───────────────────────────────────────────────────────────────────
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




// PORTAL CONTEXT
interface Ctx {
  role: Role;
  setRole: (r: Role) => void;
  view: View;
  setView: (v: View) => void;
  drawerDay: string | null;
  setDrawerDay: (d: string | null) => void;
  modal: string | null;
  setModal: (m: string | null) => void;
}

const PortalCtx = createContext<Ctx | null>(null);

export function PortalProvider({ children }: { children: ReactNode }) {
  const [role, setRoleRaw] = useState<Role>("guest");
  const [view, setView] = useState<View>("home");
  const [drawerDay, setDrawerDay] = useState<string | null>(null);
  const [modal, setModal] = useState<string | null>(null);

  const setRole = (r: Role) => {
    setRoleRaw(r);
    setDrawerDay(null);
    setModal(null);
    if (r === "guest") setView("home");
    else setView("dashboard");
  };

  return (
    <PortalCtx.Provider value={{ role, setRole, view, setView, drawerDay, setDrawerDay, modal, setModal }}>
      {children}
    </PortalCtx.Provider>
  );
}

export const usePortal = () => {
  const c = useContext(PortalCtx);
  if (!c) throw new Error("usePortal outside provider");
  return c;
};

// Desired roster format
/* ───────────── Responsibilities (includes Availability Heatmap) ───────────── */
export function Responsibilities({ data = LEADER_RESPONSIBILITIES, who = "leader" }:
  { data?: ResponsibilityCard[]; who?: "leader" | "admin" }) {
  const tabs = ["Cards", "Availability Heatmap"];
  const [tab, setTab] = useState(tabs[0]);
  const [sort, setSort] = useState<"All" | "Team" | "Panata" | "GE">("All");
  const [openMaster, setOpenMaster] = useState<ResponsibilityCard | null>(null);
  const filtered = sort === "All" ? data : data.filter((d) => d.scope === sort);

  function exportCSV() {
    const rows = [["Name","Student ID","Course","Year","Attendance"]]
      .concat(GROUP_MEMBERS.map((m) => [m.name, m.id, m.course, String(m.year), `${m.attendance}%`]));
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "masterlist.csv";
    a.click();
  }

  return (
    <>
      <PageHeader title="Responsibilities"
                  subtitle={who === "admin"
                    ? "Overseer & teaching responsibilities. Drill down through GE → Subgroup → Masterlist."
                    : "Your leadership scopes — teams, panata groups, and GE subject groups you monitor."} />
      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === "Cards" && (
        <>
          <div className="mb-3 inline-flex rounded-md border border-border bg-white p-0.5 text-xs">
            {(["All", "Team", "Panata", "GE"] as const).map((s) => {
              const a = s === sort;
              return (
                <button key={s} onClick={() => setSort(s)} className="rounded px-2.5 py-1 font-semibold"
                        style={{ backgroundColor: a ? "var(--teal-dark)" : "transparent", color: a ? "#fff" : "var(--foreground)" }}>
                  {s === "GE" ? "GE Subject Groups" : s === "All" ? "All" : `${s}s`}
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <article key={r.id} className="rounded-xl border border-border bg-white p-5 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <Pill variant={r.scope === "Panata" ? "gold" : r.scope === "Team" ? "info" : "neutral"}>{r.scope}</Pill>
                  <Pill variant="success">{r.role}</Pill>
                </div>
                <h3 className="text-base font-bold">{r.title}</h3>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <div><div className="font-bold" style={{ color: "var(--teal-dark)" }}>{r.attendance}%</div><div className="text-muted-foreground">Attendance</div></div>
                  <div><div className="font-bold">{r.events}</div><div className="text-muted-foreground">Events</div></div>
                  <div><div className="font-bold">{r.tasks}</div><div className="text-muted-foreground">Tasks</div></div>
                </div>
                <div className="mt-4 flex gap-1.5">
                  <Button variant="primary" full onClick={() => setOpenMaster(r)}>View Masterlist</Button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </>
  );
}




const menuDefs: Record<Exclude<Role, "guest">, MenuDef> = {
  student: {
    shared: [
      { id: "dashboard",       label: "Dashboard",           icon: LayoutDashboard },
      { id: "schedule",        label: "Schedule Management", icon: Calendar },
      { id: "tasks",           label: "Tasks",               icon: CheckSquare },
      { id: "announcements",   label: "Announcements",       icon: Megaphone },
      { id: "attendance-logs", label: "Attendance Logs",     icon: ClipboardList },
    ],
    roleLabel: "Student Tools",
    roleTools: [],
    footer: [
      { id: "profile",         label: "My Profile",          icon: User },
      { id: "settings",        label: "Settings",            icon: Settings },
    ],
  },
  leader: {
    shared: [
      { id: "dashboard",     label: "Dashboard",           icon: LayoutDashboard },
      { id: "schedule",      label: "Schedule Management", icon: Calendar },
      { id: "tasks",         label: "Tasks",               icon: CheckSquare },
      { id: "announcements", label: "Announcements",       icon: Megaphone },
      { id: "attendance-logs", label: "Attendance Logs",   icon: ClipboardList },
    ],
    roleLabel: "Leader Tools",
    roleTools: [
      { id: "roster",          label: "Team Members",      icon: Users },
      { id: "qr",              label: "QR Generator",      icon: QrCode },
      { id: "team-attendance", label: "Team Attendance",   icon: ClipboardList },
      { id: "team-heatmap",    label: "Team Heatmap",      icon: Thermometer },
      { id: "templates",       label: "Action Center",     icon: Library },
    ],
    footer: [
      { id: "profile",       label: "My Profile",          icon: User },
      { id: "settings",      label: "Settings",            icon: Settings },
    ],
  },
  "ge-monitor": {
    shared: [
      { id: "dashboard",       label: "Dashboard",           icon: LayoutDashboard },
      { id: "schedule",        label: "Schedule Management", icon: Calendar },
      { id: "tasks",           label: "Tasks",               icon: CheckSquare },
      { id: "announcements",   label: "Announcements",       icon: Megaphone },
      { id: "attendance-logs", label: "Attendance Logs",     icon: ClipboardList },
    ],
    roleLabel: "GE Monitor Tools",
    roleTools: [
      { id: "ge-attendance", label: "Course Attendance",    icon: ClipboardList },
      { id: "templates",     label: "Action Center",        icon: Library },
    ],
    footer: [
      { id: "profile",         label: "My Profile",          icon: User },
      { id: "settings",        label: "Settings",            icon: Settings },
    ],
  },
  "panata-monitor": {
    shared: [
      { id: "dashboard",       label: "Dashboard",           icon: LayoutDashboard },
      { id: "schedule",        label: "Schedule Management", icon: Calendar },
      { id: "tasks",           label: "Tasks",               icon: CheckSquare },
      { id: "announcements",   label: "Announcements",       icon: Megaphone },
      { id: "attendance-logs", label: "Attendance Logs",     icon: ClipboardList },
    ],
    roleLabel: "Panata Monitor Tools",
    roleTools: [
      { id: "panata-attendance", label: "Panata Attendance", icon: ClipboardList },
      { id: "templates",         label: "Action Center",     icon: Library },
    ],
    footer: [
      { id: "profile",         label: "My Profile",          icon: User },
      { id: "settings",        label: "Settings",            icon: Settings },
    ],
  },
  admin: {
    shared: [
      { id: "dashboard",     label: "Dashboard",           icon: LayoutDashboard },
      { id: "schedule",      label: "Schedule Management", icon: Calendar },
      { id: "announcements", label: "Announcements",       icon: Megaphone },
      { id: "attendance-logs", label: "Attendance Logs",   icon: ClipboardList },
    ],
    roleLabel: "Monitor Tools",
    roleTools: [
      { id: "students",   label: "My Students",             icon: GraduationCap },
      { id: "heatmap",    label: "Section Heatmap",         icon: Thermometer },
      { id: "attendance", label: "Attendance Tracker",      icon: ClipboardList },
      { id: "grader",     label: "Task Evaluator & Grader", icon: ListChecks },
      { id: "templates",  label: "Action Center",           icon: Library },
    ],
    footer: [
      // 🌟 HIGHLIGHTED CHANGE: Rerouted profile item ID targeting for admin to trigger AdminProfile
      { id: "admin-profile",   label: "Admin Profile",       icon: UserCircle },
      { id: "settings",        label: "Settings",            icon: Settings },
    ],
  },
  superadmin: {
    shared: [
      { id: "dashboard",     label: "Institutional Dashboard",  icon: LayoutDashboard },
      { id: "schedule",      label: "Institutional Scheduling", icon: Calendar },
      { id: "announcements", label: "Announcements",        icon: Megaphone },
    ],
    roleLabel: "Admin Tools",
    roleTools: [
      { id: "groups",     label: "Student Management",              icon: Database },
      { id: "heatmap",    label: "Global Heatmap",                  icon: Thermometer },
      { id: "sessions",   label: "Session & Attendance Analytics",  icon: ClipboardList },
      { id: "operations", label: "Operations Control",              icon: SlidersHorizontal },
      { id: "templates",  label: "Action Centers",                  icon: Library },
      { id: "endoar",     label: "Grade Manager",                   icon: BookOpen },
    ],
    footer: [
      // 🌟 HIGHLIGHTED CHANGE: Rerouted profile item ID targeting for superadmin to trigger AdminProfile
      { id: "admin-profile",   label: "SuperAdmin Profile",  icon: UserCircle },
      { id: "settings",        label: "System Settings",     icon: Settings },
    ],
  },
};

// add to this sidebar
export function Sidebar() {
  const { role, view, setView } = usePortal();
  if (role === "guest") return null;
  const { shared, roleLabel, roleTools, footer } = menuDefs[role];
  const hasRoleTools = roleTools.length > 0;

  return (
    <aside
      className="stf-sidebar w-60 shrink-0 min-h-[calc(100vh-6rem)] flex flex-col"
      style={{ background: "var(--sidebar-bg)" }}
    >
      {/* Scope badge */}
      {role !== "student" && (
        <div className="mx-3 mt-3 mb-2 px-3 py-2.5 scope-badge">
          <div className="scope-label text-[9px] font-bold uppercase tracking-[0.16em] mb-0.5">Scope</div>
          <div className="text-xs font-semibold leading-snug">{SCOPE_LABELS[role] ?? ""}</div>
        </div>
      )}

      {/* Role badge pill */}
      <div className="mx-3 mb-3 mt-1 flex items-center gap-2">
        <span
          className="text-[9px] font-bold uppercase tracking-[0.18em] px-2 py-1 rounded-full"
          style={{ background: "rgba(245,197,24,0.18)", color: "var(--gold)" }}
        >
          {role === "student"         ? "Student" :
           role === "leader"          ? "Team Leader" :
           role === "ge-monitor"      ? "GE Monitor" :
           role === "panata-monitor"  ? "Panata Monitor" :
           role === "admin"           ? "Admin" :
                                        "Super Admin"}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-2.5 flex-1">
        {/* Shared items */}
        {shared.map(item => {
          // Ensure "dashboard" isn't accidentally highlighted when admin-profile is live
          const isItemActive = view === item.id;
          return (
            <NavItem 
              key={item.id} 
              item={item} 
              active={isItemActive} 
              onClick={() => setView(item.id)} 
            />
          );
        })}
        {/* Role-specific divider + tools */}
        {hasRoleTools && (<>
          <div className="flex items-center gap-2 px-1 pt-3 pb-1">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.10)" }} />
            <span
              className="text-[9px] font-bold uppercase tracking-[0.18em] shrink-0"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {roleLabel}
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.10)" }} />
          </div>
          {roleTools.map(item => (
            <NavItem key={item.id} item={item} active={view === item.id} onClick={() => setView(item.id)} />
          ))}
        </>)}

        {/* Footer items (Settings / Profile) */}
        <div className="flex-1" />
        <div className="h-px mx-1 mb-1" style={{ background: "rgba(255,255,255,0.08)" }} />
        {footer.map(item => (
          <NavItem key={item.id} item={item} active={view === item.id} onClick={() => setView(item.id)} />
        ))}
      </nav>

      {/* Version tag */}
      <div className="px-4 py-3 mt-1 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.25)" }}>
          STF-NEU AEVM · v2.1 · Prototype
        </div>
      </div>
    </aside>
  );
}


// -------- CHANGES --------
// 🌟 HIGHLIGHTED CHANGE: Added Roster to GE Monitor and Panata Monitor roleTools
const menuDefs: Record<Exclude<Role, "guest">, MenuDef> = {
  // ... student and leader defs remain the same ...

  "ge-monitor": {
    shared: [
      { id: "dashboard",       label: "Dashboard",           icon: LayoutDashboard },
      { id: "schedule",        label: "Schedule Management", icon: Calendar },
      { id: "tasks",           label: "Tasks",               icon: CheckSquare },
      { id: "announcements",   label: "Announcements",       icon: Megaphone },
      { id: "attendance-logs", label: "Attendance Logs",     icon: ClipboardList },
    ],
    roleLabel: "GE Monitor Tools",
    roleTools: [
      // 🌟 ADDED ROSTER
      { id: "roster",        label: "Course Rosters",       icon: Users },
      { id: "ge-attendance", label: "Course Attendance",    icon: ClipboardList },
      { id: "templates",     label: "Action Center",        icon: Library },
    ],
    footer: [
      { id: "profile",         label: "My Profile",          icon: User },
      { id: "settings",        label: "Settings",            icon: Settings },
    ],
  },
  "panata-monitor": {
    shared: [
      { id: "dashboard",       label: "Dashboard",           icon: LayoutDashboard },
      { id: "schedule",        label: "Schedule Management", icon: Calendar },
      { id: "tasks",           label: "Tasks",               icon: CheckSquare },
      { id: "announcements",   label: "Announcements",       icon: Megaphone },
      { id: "attendance-logs", label: "Attendance Logs",     icon: ClipboardList },
    ],
    roleLabel: "Panata Monitor Tools",
    roleTools: [
      // 🌟 ADDED ROSTER
      { id: "roster",            label: "Panata Rosters",    icon: Users },
      { id: "panata-attendance", label: "Panata Attendance", icon: ClipboardList },
      { id: "templates",         label: "Action Center",     icon: Library },
    ],
    footer: [
      { id: "profile",         label: "My Profile",          icon: User },
      { id: "settings",        label: "Settings",            icon: Settings },
    ],
  },
  
  // ... admin and superadmin defs remain the same ...
};

// 🌟 HIGHLIGHTED CHANGE: Expanded Member type and Mock Data for multi-group support
type Member = {
  initials: string; name: string; id: string; course: string; year: string;
  attendance: string; tasks: string; status: string;
  dept: string; team: string; panata: string; ge: string; email: string; bio: string;
  tasksDone: number; tasksTotal: number; attendancePct: number;
  recentActivity: string;
};

const roster: Member[] = [
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