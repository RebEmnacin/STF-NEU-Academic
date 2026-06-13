
//3. Add QRGenerator in GE Monitor role

// ─── QR Generator ─────────────────────────────────────────────────────────────
export function QRGenerator() {
  const [generated, setGenerated] = useState(true);
  const [event, setEvent] = useState("Video Team Practice (Nov 8)");
  const [timeLimited, setTimeLimited] = useState(true);
  const [attendanceType, setAttendanceType] = useState<"Present" | "Late" | "Excused">("Present");
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [dateMode, setDateMode] = useState<"single" | "range">("single");
  const [singleDate, setSingleDate] = useState("2023-11-08");
  const [singleTime, setSingleTime] = useState("15:00");
  const [rangeStart, setRangeStart] = useState("2023-11-08T15:00");
  const [rangeEnd, setRangeEnd]     = useState("2023-11-08T16:30");
  const [linkCopied, setLinkCopied] = useState(false);
  const placeholderLink = `https://stf-attend.neu.edu.ph/qr/${event.replace(/\s+/g,"_").toLowerCase().slice(0,20)}_${singleDate}`;

  useEffect(() => {
    if (!generated || !timeLimited) return;
    const interval = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(interval);
  }, [generated, timeLimited]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timerPct = (timeLeft / (30 * 60)) * 100;

  function handleCopyLink() {
    navigator.clipboard.writeText(placeholderLink).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  function handleReset() {
    setTimeLeft(30 * 60);
    setGenerated(false);
    setTimeout(() => setGenerated(true), 150);
  }

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">QR Code Generator</h1>
            <p className="text-sm text-muted-text mt-1">Generate time-limited QR codes for attendance</p>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-teal-soft text-teal border border-teal/20">Leader View</span>
        </div>
      </FadeUp>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-7 space-y-4">
          <FadeUp delay={60}>
            <SectionCard icon={Calendar} title="Step 1 — Select Event">
              <div className="p-5 space-y-3">
                <select value={event} onChange={e => setEvent(e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-card focus:outline-none focus:ring-2 focus:ring-teal/30">
                  <option>Video Team Practice (Nov 8)</option>
                  <option>AEVM Multimedia Meeting (Aug 25)</option>
                  <option>Choir Orientation Batch 1 (Nov 2)</option>
                </select>
                <div className="flex items-start gap-3 bg-teal-soft rounded-xl p-4">
                  <div className="w-9 h-9 rounded-lg bg-teal/20 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-teal-dark" />
                  </div>
                  <div>
                    <div className="font-semibold text-teal-dark text-sm">Video Team Practice</div>
                    <div className="text-xs text-muted-text mt-1">Expected: 55 members</div>
                  </div>
                </div>
              </div>
            </SectionCard>
          </FadeUp>
          <FadeUp delay={100}>
            <SectionCard icon={CalendarCheck} title="Step 2 — Date & Time">
              <div className="p-5 space-y-4">
                <div className="flex rounded-xl overflow-hidden border border-border">
                  {(["single", "range"] as const).map(mode => (
                    <button key={mode} onClick={() => setDateMode(mode)}
                      className={`flex-1 py-2 text-xs font-bold transition ${
                        dateMode === mode ? "bg-teal text-white" : "bg-card text-muted-text hover:bg-secondary"
                      }`}>
                      {mode === "single" ? "Single Day" : "Date Range"}
                    </button>
                  ))}
                </div>
                {dateMode === "single" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-text block mb-1.5">Date</label>
                      <input type="date" value={singleDate} onChange={e => setSingleDate(e.target.value)}
                        className="w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-card focus:outline-none focus:ring-2 focus:ring-teal/30" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-text block mb-1.5">Time</label>
                      <input type="time" value={singleTime} onChange={e => setSingleTime(e.target.value)}
                        className="w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-card focus:outline-none focus:ring-2 focus:ring-teal/30" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-text block mb-1.5">Start</label>
                      <input type="datetime-local" value={rangeStart} onChange={e => setRangeStart(e.target.value)}
                        className="w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-card focus:outline-none focus:ring-2 focus:ring-teal/30" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-text block mb-1.5">End</label>
                      <input type="datetime-local" value={rangeEnd} onChange={e => setRangeEnd(e.target.value)}
                        className="w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-card focus:outline-none focus:ring-2 focus:ring-teal/30" />
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>
          </FadeUp>
          <FadeUp delay={180}>
            <button onClick={() => { setGenerated(true); setTimeLeft(30 * 60); }}
              className="w-full bg-teal text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-teal-dark transition flex items-center justify-center gap-2"
              style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.14)" }}>
              <QrCode className="w-5 h-5" /> Generate QR Code
            </button>
          </FadeUp>
        </div>
        <div className="col-span-5">
          <FadeUp delay={80}>
            <SectionCard icon={QrCode} title="Generated QR Code">
              <div className="p-5 flex flex-col items-center gap-4">
                {generated ? (
                  <>
                    <div className="relative">
                      <div className="w-52 h-52 bg-white border-2 border-teal/30 rounded-2xl grid place-items-center p-3 shadow-inner">
                        <div className="w-full h-full grid grid-cols-12 gap-px p-1">
                          {Array.from({ length: 144 }).map((_, i) => (
                            <div key={i} className={((i * 7 + i % 5) % 3) === 0 ? "bg-teal-dark" : "bg-white"} style={{ borderRadius: 1 }} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-center w-full">
                      <div className="font-bold text-teal-dark text-sm">{event.split("(")[0].trim()}</div>
                      <div className="text-xs text-muted-text mt-0.5">
                        {dateMode === "single" ? `${singleDate} · ${singleTime}` : `${rangeStart.replace("T"," ")} → ${rangeEnd.replace("T"," ")}`}
                        {" "}· <span className="font-semibold text-teal-dark">{attendanceType}</span>
                      </div>
                    </div>
                    {timeLimited && (
                      <div className="w-full">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-muted-text font-medium">Time remaining</span>
                          <span className={`font-bold font-mono ${timeLeft < 300 ? "text-red-status" : "text-teal-dark"}`}>{String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}</span>
                        </div>
                        <div className="h-2 rounded-full bg-border overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${timerPct}%`, background: timeLeft < 300 ? "var(--red-status)" : "var(--teal)", transition: "width 1s linear, background 0.3s ease" }} />
                        </div>
                        {timeLeft === 0 && <div className="mt-2 text-xs text-red-status font-semibold text-center">⚠ QR code expired — regenerate to continue</div>}
                      </div>
                    )}
                    <div className="w-full bg-teal-soft rounded-xl px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-teal-dark font-medium">Scanned</span>
                        <span className="text-lg font-bold font-serif text-teal-dark">12 <span className="text-sm font-normal text-muted-text">/ 55</span></span>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-teal/20 overflow-hidden">
                        <div className="h-full rounded-full bg-teal" style={{ width: `${(12/55)*100}%` }} />
                      </div>
                    </div>
                    <div className="flex gap-2 w-full">
                      <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-teal text-teal text-xs font-semibold hover:bg-teal hover:text-white transition">
                        <Download className="w-3.5 h-3.5" /> PNG
                      </button>
                      <button onClick={handleCopyLink}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
                          linkCopied ? "border-teal bg-teal text-white" : "border-border text-muted-text hover:bg-secondary"
                        }`}>
                        {linkCopied ? <CheckCircle className="w-3.5 h-3.5" /> : <Link className="w-3.5 h-3.5" />}
                        {linkCopied ? "Copied!" : "Link"}
                      </button>
                      <button onClick={handleReset}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border text-muted-text text-xs font-semibold hover:bg-secondary transition">
                        <RefreshCw className="w-3.5 h-3.5" /> Reset
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-16 text-center text-muted-text text-sm">Configure settings and click <strong>Generate QR Code</strong></div>
                )}
              </div>
            </SectionCard>
          </FadeUp>
        </div>
      </div>
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