// RESPONSIBILITY CARDS + ATTENDANCE (can mark all present)


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



/* ───────────── Attendance Manager (Logger + Attendance tabs) ───────────── */
export function AttendanceManager() {
  const tabs = ["Attendance Logger", "Attendance"];
  const [tab, setTab] = useState(tabs[0]);
  return (
    <>
      <PageHeader title="Attendance Manager" subtitle="Combined logger and session attendance table." />
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      {tab === "Attendance Logger" ? <SessionLogger /> : <AttendanceTable />}
    </>
  );
}

function SessionLogger() {
  const [session, setSession] = useState(SESSION_OPTIONS[0]);
  const [method, setMethod] = useState("Manual Check");
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(GROUP_MEMBERS.map((m) => [m.id, "Present"])),
  );

  return (
    <>
      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <Section title="Step 1 — Select Session">
          <select value={session} onChange={(e) => setSession(e.target.value)} className="input">
            {SESSION_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
          <div className="mt-2 text-xs text-muted-foreground">Date: Dec 02, 2025 · Venue: M411 A</div>
        </Section>
        <Section title="Step 2 — Method">
          <div className="grid grid-cols-2 gap-2">
            {["Manual Check", "Batch Present", "CSV Upload", "QR Scan"].map((m) => (
              <button key={m} onClick={() => setMethod(m)}
                      className="rounded-md border px-3 py-2 text-xs font-semibold"
                      style={{ borderColor: method === m ? "var(--teal-dark)" : "var(--border)",
                               backgroundColor: method === m ? "color-mix(in oklab, var(--teal-dark) 10%, white)" : "white",
                               color: method === m ? "var(--teal-dark)" : "var(--foreground)" }}>
                {m}
              </button>
            ))}
          </div>
        </Section>
        <Section title="Quick Actions">
          <div className="space-y-2">
            <Button variant="secondary" full onClick={() => setStatuses(Object.fromEntries(GROUP_MEMBERS.map((m) => [m.id, "Present"])))}>Mark All Present</Button>
            <Button variant="primary" full>Save Session</Button>
          </div>
        </Section>
      </div>

      <Banner tone="info">Step 3 — Logging <strong>{session}</strong> via <strong>{method}</strong></Banner>

      <Table rows={GROUP_MEMBERS} columns={[
        { key: "name", label: "Student", render: (v) => <span className="font-semibold">{v}</span> },
        { key: "id",   label: "Student ID" },
        { key: "course", label: "Course" },
        { key: "id" as any, label: "Status",
          render: (id) => (
            <select value={statuses[id]} onChange={(e) => setStatuses((s) => ({ ...s, [id]: e.target.value }))}
                    className="h-8 rounded border border-border bg-white px-2 text-xs">
              {["Present", "Late", "Excused", "Absent"].map((s) => <option key={s}>{s}</option>)}
            </select>
          ) },
      ]} />
    </>
  );
}
