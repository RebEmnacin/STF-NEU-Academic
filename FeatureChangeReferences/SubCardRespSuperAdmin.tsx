


/* ───────────── Admin: Responsibilities (uses shared component, with GE drill-down) ───────────── */
export function AdminResponsibilities() {
  const [openSubject, setOpenSubject] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const subjects = Array.from(new Set(GE_SUBJECT_GROUPS.map((g) => g.subject)));
  const groupsForSubject = openSubject ? GE_SUBJECT_GROUPS.filter((g) => g.subject === openSubject) : [];

  return (
    <>
      <Responsibilities data={ADMIN_RESPONSIBILITIES} who="admin" />
      <section className="mt-8 rounded-xl border border-border bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">GE Subject Drill-Down</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {subjects.map((s) => (
            <button key={s} onClick={() => setOpenSubject(s)}
                    className="rounded-xl border border-border bg-white p-4 text-left shadow-sm hover:border-[var(--teal-medium)]">
              <div className="text-sm font-bold">{s}</div>
              <div className="text-xs text-muted-foreground">{GE_SUBJECT_GROUPS.filter((g) => g.subject === s).length} subgroup(s)</div>
            </button>
          ))}
        </div>
      </section>

      {openSubject && (
        <Modal title={`${openSubject} · Subgroups`} onClose={() => setOpenSubject(null)} size="xl"
               footer={<Button variant="primary" onClick={() => setOpenSubject(null)}>Close</Button>}>
          <div className="grid gap-3 md:grid-cols-2">
            {groupsForSubject.map((g) => (
              <button key={g.groupName} onClick={() => setOpenGroup(g.groupName)}
                      className="rounded-xl border border-border bg-white p-4 text-left shadow-sm hover:border-[var(--teal-medium)]">
                <div className="text-sm font-bold">{g.groupName}</div>
                <div className="text-xs text-muted-foreground">Teacher: {g.teacher} · Monitor: {g.monitor}</div>
                <div className="mt-2 flex gap-2"><Pill variant="info">{g.members} members</Pill><Pill variant="success">{g.attendance}%</Pill></div>
              </button>
            ))}
          </div>
        </Modal>
      )}
      {openGroup && (
        <Modal title={`${openGroup} · Masterlist`} onClose={() => setOpenGroup(null)} size="xl"
               footer={<><Button variant="secondary">Export CSV</Button><Button variant="primary" onClick={() => setOpenGroup(null)}>Close</Button></>}>
          <div className="mb-3 grid grid-cols-3 gap-3">
            <StatCard label="Members" value={32} />
            <StatCard label="Avg Attendance" value="91%" accent="var(--success-green)" />
            <StatCard label="Monitors" value={2} />
          </div>
          <Table rows={GROUP_MEMBERS} columns={[
            { key: "name", label: "Name", render: (v) => <span className="font-semibold">{v}</span> },
            { key: "id", label: "ID" }, { key: "course", label: "Course" }, { key: "year", label: "Yr" },
            { key: "status", label: "Role",
              render: (v) => <Pill variant={v === "Watchlist" ? "warning" : "info"}>{v === "Watchlist" ? "Student" : "Student"}</Pill> },
          ]} />
        </Modal>
      )}
    </>
  );
}

/* ───────────── Admin Attendance Tracker ───────────── */
export function AttendanceTracker() {
  const tabs = ["All", "GE Subject Groups", "Panata Groups", "Team Activities", "Events"];
  const [tab, setTab] = useState(tabs[0]);
  const all = [
    { session: "DGA Multimedia Training", date: "Nov 29", group: "DGA Team",     rate: 88, kind: "Team Activities" },
    { session: "Pulong Panata",            date: "Nov 24", group: "CICS3 Panata", rate: 93, kind: "Panata Groups" },
    { session: "Sosyedad at Literatura",   date: "Nov 22", group: "IS233 B",      rate: 71, kind: "GE Subject Groups" },
    { session: "Komiti",                   date: "Nov 24", group: "BSCS-3A",      rate: 94, kind: "Team Activities" },
    { session: "PE 3 G2",                  date: "Nov 21", group: "Court A",      rate: 62, kind: "GE Subject Groups" },
    { session: "Snapseed Seminar",         date: "Dec 03", group: "Photo + DGA",  rate: 81, kind: "Events" },
  ];
  const rows = tab === "All" ? all : all.filter((r) => r.kind === tab);
  return (
    <>
      <PageHeader title="Attendance Tracker" subtitle="Sessions across your coordinated groups." />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Sessions Recorded" value={14} />
        <StatCard label="Avg Rate" value="84%" accent="var(--teal-medium)" />
        <StatCard label="Below Target (<75%)" value={2} accent="var(--error-red)" />
        <StatCard label="Above Target (>90%)" value={6} accent="var(--success-green)" />
      </div>
      <div className="mt-6"><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>
      <Table rows={rows} columns={[
        { key: "session", label: "Session", render: (v) => <span className="font-semibold">{v}</span> },
        { key: "group",   label: "Group" },
        { key: "kind",    label: "Type" },
        { key: "date",    label: "Date" },
        { key: "rate",    label: "Rate",
          render: (v: any) => {
            const tone = v >= 90 ? "var(--success-green)" : v >= 75 ? "var(--warning-amber)" : "var(--error-red)";
            return <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-semibold"
                          style={{ background: `color-mix(in oklab, ${tone} 16%, white)`, color: tone }}>
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: tone }} />{v}%
            </span>;
          } },
        { key: "session" as any, label: "", render: () => <button className="rounded border border-border px-2 py-1 text-xs font-semibold">View</button> },
      ]} />
    </>
  );
}


/* ───────────── Admin / Super Admin Profile (shared) ───────────── */
export function AdminProfile({ tier = "admin" }: { tier?: "admin" | "superadmin" }) {
  const name = tier === "superadmin" ? "Dr. E. Mariano" : "Ate M. Sandoval";
  return (
    <>
      <PageHeader title="My Profile" />
      <div className="mb-6 flex flex-wrap items-center gap-5 rounded-xl border border-border bg-white p-5 shadow-sm">
        <div className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white"
             style={{ background: "linear-gradient(135deg,#0D5B7F,#1B7B9F)" }}>
          {name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
        </div>
        <div className="flex-1 min-w-[260px]">
          <h2 className="text-xl font-bold">{name}</h2>
          <div className="text-sm text-muted-foreground">{tier === "superadmin" ? "Super Admin · Institution-wide" : "Admin · Computer Studies cluster"}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Pill variant="info">{tier === "superadmin" ? "Super Admin" : "Admin"}</Pill>
            <Pill variant="success">Student-role Promoter</Pill>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Section title="Assigned Subjects">
          <ul className="space-y-1.5 text-sm">
            <li>Sosyedad at Literatura — IS233 B</li>
            {tier === "superadmin" && <li>Ethics — M210 A</li>}
          </ul>
        </Section>
        <Section title="Assigned GE Subject Groups">
          <ul className="space-y-1.5 text-sm">
            <li>SosLit — IS233 B (Teacher)</li>
            <li>SosLit — IS234 A (Coordinator)</li>
          </ul>
        </Section>
        <Section title="Assigned Teams">
          <ul className="space-y-1.5 text-sm"><li>Video Team — Overseer</li>{tier === "superadmin" && <li>DGA Team — Overseer</li>}</ul>
        </Section>
        <Section title="Assigned Panata Groups">
          <ul className="space-y-1.5 text-sm"><li>CICS2 Panata — Overseer</li>{tier === "superadmin" && <li>CICS3 Panata — Overseer</li>}</ul>
        </Section>
      </div>
    </>
  );
}

/* ───────────── Super Admin: Institutional Dashboard ───────────── */
export function InstitutionalDashboard() {
  return (
    <>
      <PageHeader title="Institutional Dashboard" subtitle="STF-NEU AEVM · University-wide" />
      <div className="grid gap-4 md:grid-cols-5">
        <StatCard label="Upcoming Church Events" value={4} />
        <StatCard label="Institutional Deadlines" value={9} accent="var(--warning-amber)" />
        <StatCard label="Active STF Activities"   value={12} />
        <StatCard label="GE Subject Groups"       value={87} />
        <StatCard label="Active Students"         value="4,318" accent="var(--teal-medium)" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Section title="Institutional Calendar — December 2025">
            <Table rows={INSTITUTIONAL_EVENTS} columns={[
              { key: "date", label: "Date" }, { key: "title", label: "Event", render: (v) => <span className="font-semibold">{v}</span> },
              { key: "venue", label: "Venue" }, { key: "audience", label: "Audience" }, { key: "lead", label: "Lead" },
            ]} />
          </Section>
        </div>
        <div className="space-y-6">
          <Section title="STF Teams">
            <ul className="space-y-1 text-sm">
              {STF_TEAMS.map((t) => <li key={t.id} className="flex justify-between"><span>{t.icon} {t.name}</span><Pill variant="info">active</Pill></li>)}
            </ul>
          </Section>
        </div>
      </div>
    </>
  );
}

/* ───────────── Super Admin: Student Management (w/ Availability Heatmap tab) ───────────── */
export function StudentManagement() {
  const tabs = ["Cards", "All Students Masterlist", "Availability Heatmap"];
  const [tab, setTab] = useState(tabs[0]);
  const [openTotal, setOpenTotal] = useState(false);

  return (
    <>
      <PageHeader title="Student Management" subtitle="All masterlists, availability, and grouping context." />
      <div className="grid gap-4 md:grid-cols-3">
        <button onClick={() => setOpenTotal(true)}
                className="rounded-xl border border-border bg-white p-5 text-left shadow-sm hover:border-[var(--teal-medium)]">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total Students</div>
          <div className="mt-1 text-4xl font-bold" style={{ color: "var(--teal-dark)" }}>4,318</div>
          <div className="mt-1 text-xs text-muted-foreground">Click to open full masterlist</div>
        </button>
        <StatCard label="Active Teams"        value={STF_TEAMS.length} />
        <StatCard label="Active Panata Groups" value={PANATA_GROUPS.length} accent="#B58A12" />
      </div>

      <div className="mt-6"><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>

      {tab === "Cards" && <AdminResponsibilities />}
      {tab === "All Students Masterlist" && (
        <Table rows={GROUP_MEMBERS} columns={[
          { key: "name", label: "Name", render: (v) => <span className="font-semibold">{v}</span> },
          { key: "id", label: "ID" }, { key: "course", label: "Course" }, { key: "year", label: "Yr" },
          { key: "attendance", label: "Attendance", render: (v) => <Pill variant={v >= 90 ? "success" : "warning"}>{v}%</Pill> },
          { key: "status", label: "Status" },
        ]} />
      )}
      {tab === "Availability Heatmap" && <Banner tone="info">Switch to the Heatmap inside Responsibilities for the full interactive view.</Banner>}

      {openTotal && (
        <Modal title="All Active Students" subtitle="Personal info · enumerated responsibilities · enumerated memberships"
               onClose={() => setOpenTotal(false)} size="xl"
               footer={<Button variant="primary" onClick={() => setOpenTotal(false)}>Close</Button>}>
          <Table rows={GROUP_MEMBERS.concat(GROUP_MEMBERS).map((m, i) => ({ ...m, id: `${m.id}-${i}` }))} columns={[
            { key: "name", label: "Name", render: (v) => <span className="font-semibold">{v}</span> },
            { key: "course", label: "Course" }, { key: "year", label: "Yr" },
            { key: "name" as any, label: "Responsibility", render: () => "Monitor · CICS3 Panata" },
            { key: "name" as any, label: "Team Membership", render: () => "DGA Team" },
            { key: "name" as any, label: "Panata", render: () => "CICS3" },
          ]} />
        </Modal>
      )}
    </>
  );
}

/* ───────────── Super Admin: Institutional Scheduling (placeholder list) ───────────── */
export function InstitutionalScheduling() {
  const tabs = ["All", "Events", "Personal"];
  const [tab, setTab] = useState(tabs[0]);
  return (
    <>
      <PageHeader title="Institutional Scheduling"
                  subtitle="Create event schedules — auto-announced to target audiences. Add personal schedules too."
                  actions={<Button variant="primary">+ Schedule Event</Button>} />
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      <Banner tone="info">Add Schedule modal includes a conflict notifier and nullable venue field, identical to the student flow.</Banner>
      <Table rows={INSTITUTIONAL_EVENTS} columns={[
        { key: "date", label: "Date" }, { key: "title", label: "Event", render: (v) => <span className="font-semibold">{v}</span> },
        { key: "venue", label: "Venue" }, { key: "audience", label: "Audience" }, { key: "lead", label: "Lead" },
      ]} />
    </>
  );
}

/* ───────────── Super Admin: Session & Attendance Log ───────────── */
export function SessionAttendanceLog() {
  return (
    <>
      <PageHeader title="Session & Attendance Log Tracker" subtitle="Sessions and attendees, scoped by context." />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Sessions" value={418} />
        <StatCard label="GE Sessions"    value={186} accent="var(--teal-medium)" />
        <StatCard label="Panata Sessions" value={92} accent="#B58A12" />
        <StatCard label="Event Sessions"  value={56} accent="var(--warning-amber)" />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Section title="Session Events">
          <Table rows={INSTITUTIONAL_EVENTS.slice(0, 5)} columns={[
            { key: "date", label: "Date" }, { key: "title", label: "Event" }, { key: "audience", label: "Audience" },
          ]} />
        </Section>
        <Section title="Session Attendees">
          <Table rows={[
            { who: "Allyssa Reyes",  kind: "Student",        session: "Choir Concert B3", role: "Regular" },
            { who: "Mark Diaz",      kind: "Student w/ duty", session: "Choir Concert B3", role: "Ushering" },
            { who: "Trisha Santos",  kind: "Student w/ duty", session: "Snapseed Seminar", role: "Photographer" },
            { who: "Jerico Tan",     kind: "Student",        session: "Pulong Panata",    role: "Regular" },
          ]} columns={[
            { key: "who", label: "Attendee", render: (v) => <span className="font-semibold">{v}</span> },
            { key: "kind", label: "Type" }, { key: "session", label: "Session" }, { key: "role", label: "Role" },
          ]} />
        </Section>
      </div>
    </>
  );
}

/* ───────────── Super Admin: Grade Manager ───────────── */
export function GradeManager() {
  const tabs = ["GE", "AEVM", "Final Grade"];
  const [tab, setTab] = useState(tabs[0]);
  const [openSubject, setOpenSubject] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const subjects = Array.from(new Set(GE_SUBJECT_GROUPS.map((g) => g.subject)));
  const groupsForSubject = openSubject ? GE_SUBJECT_GROUPS.filter((g) => g.subject === openSubject) : [];
  return (
    <>
      <PageHeader title="Grade Manager"
                  subtitle="GE grading by subject group · AEVM grading per team/panata · Final balance is Super Admin-defined." />
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      {tab === "GE" && (
        <>
          <Banner tone="info">GE grade = weighted blend of <strong>attendance rate</strong> and <strong>gradable tasks</strong>, computed per GE subject group.</Banner>
          <Table rows={[
            { student: "Allyssa Reyes", group: "Art App — M414B", attendance: 94, tasks: 92, grade: 1.4 },
            { student: "Jerico Tan",    group: "SosLit — IS233B", attendance: 81, tasks: 78, grade: 1.7 },
            { student: "Krisha Valdez", group: "Ethics — M210A",  attendance: 100, tasks: 96, grade: 1.1 },
            { student: "Mark Diaz",     group: "MMW — M306C",     attendance: 70, tasks: 65, grade: 2.3 },
          ]} columns={[
            { key: "student", label: "Student", render: (v) => <span className="font-semibold">{v}</span> },
            { key: "group",   label: "GE Subject Group" },
            { key: "attendance", label: "Attendance %" },
            { key: "tasks",   label: "Task %" },
            { key: "grade",   label: "Final Grade", render: (v: any) =>
              <Pill variant={v <= 1.5 ? "success" : v <= 2.0 ? "info" : v <= 2.5 ? "warning" : "error"}>{(v as number).toFixed(2)}</Pill> },
          ]} />
        </>
      )}
      {tab === "AEVM" && (
        <>
          <Banner tone="gold">
            One AEVM grade applies to ALL of a student's enrolled GE subjects. Super Admin sets the GE↔AEVM balance ratio.
          </Banner>
          <Table rows={[
            { student: "Allyssa Reyes", scope: "DGA Team",        attendance: 94, tasks: 92, aevm: "A-" },
            { student: "Jerico Tan",    scope: "DGA Team",        attendance: 88, tasks: 84, aevm: "B+" },
            { student: "Trisha Santos", scope: "Writers Team",    attendance: 94, tasks: 91, aevm: "A" },
            { student: "Sean Garcia",   scope: "Video Team",      attendance: 68, tasks: 70, aevm: "C" },
            { student: "Krisha Valdez", scope: "CICS3 Panata",    attendance: 100, tasks: 95, aevm: "A" },
          ]} columns={[
            { key: "student", label: "Student", render: (v) => <span className="font-semibold">{v}</span> },
            { key: "scope",   label: "Team / Panata" },
            { key: "attendance", label: "Attendance %" },
            { key: "tasks",   label: "Task %" },
            { key: "aevm",    label: "AEVM Score",
              render: (v) => <Pill variant={String(v).startsWith("A") ? "success" : String(v).startsWith("B") ? "info" : "warning"}>{v}</Pill> },
          ]} />
        </>
      )}
      {tab === "Final Grade" && (
        <>
          <Banner tone="info">
            Final Grade = average of the student's <strong>GE subject group score</strong> and their <strong>AEVM score</strong>.
            Drill down: GE Subject → Subgroup → Masterlist (with computed final grade per student).
          </Banner>
          <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">GE Subject Drill-Down</h3>
            <div className="grid gap-3 md:grid-cols-3">
              {subjects.map((s) => (
                <button key={s} onClick={() => setOpenSubject(s)}
                        className="rounded-xl border border-border bg-white p-4 text-left shadow-sm hover:border-[var(--teal-medium)]">
                  <div className="text-sm font-bold">{s}</div>
                  <div className="text-xs text-muted-foreground">
                    {GE_SUBJECT_GROUPS.filter((g) => g.subject === s).length} subgroup(s)
                  </div>
                </button>
              ))}
            </div>
          </section>

          {openSubject && (
            <Modal title={`${openSubject} · Subgroups`} onClose={() => setOpenSubject(null)} size="xl"
                   footer={<Button variant="primary" onClick={() => setOpenSubject(null)}>Close</Button>}>
              <div className="grid gap-3 md:grid-cols-2">
                {groupsForSubject.map((g) => (
                  <button key={g.groupName} onClick={() => setOpenGroup(g.groupName)}
                          className="rounded-xl border border-border bg-white p-4 text-left shadow-sm hover:border-[var(--teal-medium)]">
                    <div className="text-sm font-bold">{g.groupName}</div>
                    <div className="text-xs text-muted-foreground">Teacher: {g.teacher} · Monitor: {g.monitor}</div>
                    <div className="mt-2 flex gap-2"><Pill variant="info">{g.members} members</Pill><Pill variant="success">{g.attendance}%</Pill></div>
                  </button>
                ))}
              </div>
            </Modal>
          )}
          {openGroup && (() => {
            const aevmToNum = (s: string) => ({ "A":1.0,"A-":1.25,"B+":1.5,"B":1.75,"B-":2.0,"C+":2.25,"C":2.5,"D":3.0 } as Record<string, number>)[s] ?? 2.0;
            const rows = GROUP_MEMBERS.map((m, i) => {
              const geScore = [1.4, 1.7, 1.1, 2.3, 1.5, 1.9][i % 6];
              const aevm = ["A-","B+","A","C","A","B"][i % 6];
              const aevmNum = aevmToNum(aevm);
              const final = +((geScore + aevmNum) / 2).toFixed(2);
              return { ...m, geScore, aevm, aevmNum, final };
            });
            return (
              <Modal title={`${openGroup} · Final Grades`} subtitle="Average of GE Subject Group score and AEVM score"
                     onClose={() => setOpenGroup(null)} size="xl"
                     footer={<><Button variant="secondary">Export CSV</Button><Button variant="primary" onClick={() => setOpenGroup(null)}>Close</Button></>}>
                <div className="mb-3 grid grid-cols-3 gap-3">
                  <StatCard label="Members" value={rows.length} />
                  <StatCard label="Avg Final Grade"
                            value={(rows.reduce((a, r) => a + r.final, 0) / rows.length).toFixed(2)}
                            accent="var(--teal-dark)" />
                  <StatCard label="At Risk (>2.5)"
                            value={rows.filter((r) => r.final > 2.5).length}
                            accent="var(--warning-amber)" />
                </div>
                <Table rows={rows} columns={[
                  { key: "name", label: "Student", render: (v) => <span className="font-semibold">{v}</span> },
                  { key: "id",   label: "ID" },
                  { key: "geScore" as any, label: "GE Score",
                    render: (v: any) => <Pill variant={v <= 1.5 ? "success" : v <= 2.0 ? "info" : v <= 2.5 ? "warning" : "error"}>{Number(v).toFixed(2)}</Pill> },
                  { key: "aevm" as any, label: "AEVM",
                    render: (v: any) => <Pill variant={String(v).startsWith("A") ? "success" : String(v).startsWith("B") ? "info" : "warning"}>{v}</Pill> },
                  { key: "aevmNum" as any, label: "AEVM (num)",
                    render: (v: any) => <span className="text-xs text-muted-foreground">{Number(v).toFixed(2)}</span> },
                  { key: "final" as any, label: "Final Grade",
                    render: (v: any) => <Pill variant={v <= 1.5 ? "success" : v <= 2.0 ? "info" : v <= 2.5 ? "warning" : "error"}>{Number(v).toFixed(2)}</Pill> },
                ]} />
              </Modal>
            );
          })()}
        </>
      )}
    </>
  );
}

/* ───────────── Super Admin: Dispatcher (richer) ───────────── */
export function SuperDispatcher() {
  const [open, setOpen] = useState<"Announcement" | "Task" | "Survey" | null>(null);
  return (
    <>
      <PageHeader title="Dispatcher" subtitle="Compose institution-wide announcements, tasks, surveys, and event schedules."
                  actions={<>
                    <Button variant="secondary" onClick={() => setOpen("Announcement")}>+ Announcement</Button>
                    <Button variant="secondary" onClick={() => setOpen("Task")}>+ Task</Button>
                    <Button variant="primary"   onClick={() => setOpen("Survey")}>+ Survey</Button>
                  </>} />
      <Section title="Templated Surveys & Schedules">
        <Table rows={SURVEY_TEMPLATES} columns={[
          { key: "name", label: "Template", render: (v) => <span className="font-semibold">{v}</span> },
          { key: "desc", label: "Description" },
          { key: "name" as any, label: "Sharable With",
            render: () => <span className="text-xs text-muted-foreground">Admins · Monitors · Team Leads</span> },
          { key: "name" as any, label: "Actions",
            render: () => <div className="flex gap-1.5">
              <button className="rounded border border-border px-2 py-1 text-xs">Use</button>
              <button className="rounded border border-border px-2 py-1 text-xs">Share</button>
            </div> },
        ]} />
      </Section>
      {open && (
        <Modal title={`Add ${open}`} subtitle="Institution-wide scope" onClose={() => setOpen(null)} size="xl"
               footer={<><Button variant="secondary" onClick={() => setOpen(null)}>Cancel</Button><Button variant="primary" onClick={() => setOpen(null)}>Send</Button></>}>
          <div className="space-y-3">
            <Field label="Title"><input className="input" /></Field>
            <Field label="Body"><textarea className="input" /></Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Recurrence"><select className="input"><option>One-time</option><option>Weekly</option><option>Monthly</option></select></Field>
              <Field label="Effectivity Start"><input type="date" className="input" /></Field>
              <Field label="Effectivity End"><input type="date" className="input" /></Field>
            </div>
            <Field label="Audience"><select className="input"><option>Institution-wide</option><option>STF Teams</option><option>All Panata Groups</option><option>Specific GE Subject Group</option></select></Field>
            {open === "Task" && (
              <Field label="Event attendee determination?"><select className="input"><option>Required</option><option>Not required</option></select></Field>
            )}
            <Banner tone="gold">Upcoming events created here are auto-added to every targeted student's calendar.</Banner>
          </div>
        </Modal>
      )}
    </>
  );
}


