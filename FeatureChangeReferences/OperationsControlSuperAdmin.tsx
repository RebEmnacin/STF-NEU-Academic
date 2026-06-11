


/* ───────────── Super Admin: Operations Control (tabs) ───────────── */
export function OperationsControl() {
  const tabs = ["Student Assigner", "Pending Request Approver", "Task Evaluator", "New Group Creation", "Departments / Venues"];
  const [tab, setTab] = useState(tabs[0]);
  return (
    <>
      <PageHeader title="Operations Control"
                  subtitle="Semi-automated controls: drag-drop assignment, request approval, group creation, evaluation." />
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      {tab === "Student Assigner" && <StudentAssigner />}
      {tab === "Pending Request Approver" && <RequestApprover />}
      {tab === "Task Evaluator" && <TaskEvaluator />}
      {tab === "New Group Creation" && <NewGroupCreation />}
      {tab === "Departments / Venues" && <DeptVenues />}
    </>
  );
}

function StudentAssigner() {
  const [target, setTarget] = useState("CICS3 Panata");
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  return (
    <>
      <div className="mb-4 grid gap-4 md:grid-cols-4">
        <StatCard label="Unassigned Students" value={UNASSIGNED_STUDENTS.length} accent="var(--warning-amber)" />
        <StatCard label="Selected" value={selected.length} accent="var(--teal-dark)" />
        <StatCard label="Open GE Slots" value={42} />
        <StatCard label="Open Panata Slots" value={18} accent="#B58A12" />
      </div>
      <Banner tone="info">
        Drag-and-drop (multi-select): pick students on the left, choose a target on the right, then Assign.
        Suggestions are weighted using the Availability Heatmap. Panata assignment respects student department vs. panata-assigned department.
      </Banner>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Unassigned Students">
          <ul className="space-y-1.5">
            {UNASSIGNED_STUDENTS.map((u) => {
              const on = selected.includes(u.id);
              return (
                <li key={u.id}>
                  <button onClick={() => toggle(u.id)}
                          className="flex w-full items-center justify-between rounded border px-3 py-2 text-sm"
                          style={{ borderColor: on ? "var(--teal-dark)" : "var(--border)",
                                   background: on ? "color-mix(in oklab, var(--teal-dark) 10%, white)" : "white" }}>
                    <div className="text-left">
                      <div className="font-semibold">{u.name}</div>
                      <div className="text-[11px] text-muted-foreground">{u.id} · {u.dept} · Yr {u.year}</div>
                    </div>
                    <Pill variant={u.scope === "GE" ? "info" : u.scope === "Panata" ? "gold" : "neutral"}>{u.scope}</Pill>
                  </button>
                </li>
              );
            })}
          </ul>
        </Section>
        <Section title="Target & Action">
          <Field label="Assign To">
            <select value={target} onChange={(e) => setTarget(e.target.value)} className="input">
              <optgroup label="Panata Groups">{PANATA_GROUPS.slice(0, 8).map((g) => <option key={g}>{g} Panata</option>)}</optgroup>
              <optgroup label="GE Subject Groups">{GE_SUBJECT_GROUPS.map((g) => <option key={g.groupName}>{g.groupName}</option>)}</optgroup>
              <optgroup label="Teams">{STF_TEAMS.map((t) => <option key={t.id}>{t.name}</option>)}</optgroup>
              <optgroup label="Event Duties"><option>Choir Concert B4 — Usher</option><option>Choir Concert B4 — Stage Crew</option><option>Snapseed Seminar — Photographer</option></optgroup>
            </select>
          </Field>
          <div className="mt-3 rounded-md border border-border bg-muted/30 p-3 text-xs">
            <div className="font-semibold mb-1">Heatmap suggestion</div>
            Best window: <strong>Sun 7AM–10AM</strong> (avg 89% available)
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" full onClick={() => setSelected([])}>Clear</Button>
            <Button variant="primary" full onClick={() => setSelected([])}>Assign {selected.length} → {target}</Button>
          </div>
          <div className="mt-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Suguan Masterlist Generation</div>
            <Button variant="gold" full>Generate Suguan Masterlist</Button>
          </div>
        </Section>
      </div>
    </>
  );
}

function RequestApprover() {
  const [type, setType] = useState<string>("All");
  const types = ["All", "MD Membership", "GE Switch", "GE Drop", "Panata Switch", "Team Join"];
  const rows = type === "All" ? PENDING_REQUESTS : PENDING_REQUESTS.filter((r) => r.type === type);
  const counts = PENDING_REQUESTS.reduce<Record<string, number>>((acc, r) => { acc[r.type] = (acc[r.type] ?? 0) + 1; return acc; }, {});
  return (
    <>
      <div className="mb-4 grid gap-3 md:grid-cols-5">
        <StatCard label="Pending Total" value={PENDING_REQUESTS.length} accent="var(--warning-amber)" />
        {Object.entries(counts).map(([k, v]) => <StatCard key={k} label={k} value={v} />)}
      </div>
      <div className="mb-3 inline-flex flex-wrap gap-1">
        {types.map((t) => (
          <button key={t} onClick={() => setType(t)}
                  className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold"
                  style={{ background: type === t ? "color-mix(in oklab, var(--teal-dark) 12%, white)" : "white",
                           color: type === t ? "var(--teal-dark)" : "var(--foreground)" }}>{t}</button>
        ))}
      </div>
      <Table rows={rows} columns={[
        { key: "date", label: "Submitted" },
        { key: "type", label: "Type", render: (v) => <Pill variant="info">{v}</Pill> },
        { key: "requester", label: "Requester", render: (v) => <span className="font-semibold">{v}</span> },
        { key: "details", label: "Details" },
        { key: "id" as any, label: "Actions",
          render: () => <div className="flex gap-1.5">
            <button className="rounded border border-border px-2 py-1 text-xs">Approve</button>
            <button className="rounded border border-border px-2 py-1 text-xs">Reject</button>
          </div> },
      ]} />
      <Banner tone="info">Expired requests are auto-removed after the mid-midterms cut-off.</Banner>
    </>
  );
}

function NewGroupCreation() {
  return (
    <>
      <Banner tone="gold">
        Semi-automated by design: when PE1 G1 fills, create PE1 G2; when CICS5 fills, create CICS6.
        Many situations are subject to change, so manual intervention is intentional.
      </Banner>
      <div className="grid gap-4 md:grid-cols-3">
        <Section title="Create GE Subject Group">
          <Field label="GE Subject"><select className="input"><option>PE 1</option><option>Art Appreciation</option><option>Ethics</option></select></Field>
          <Field label="Group Name"><input className="input" placeholder="e.g. PE 1 — Group 3" /></Field>
          <Field label="Teacher"><input className="input" placeholder="Prof. ..." /></Field>
          <div className="mt-3"><Button variant="primary" full>+ Create GE Group</Button></div>
        </Section>
        <Section title="Create Team">
          <Field label="Team Name"><input className="input" placeholder="e.g. Backup Music Team" /></Field>
          <Field label="Lead"><input className="input" placeholder="Kuya ..." /></Field>
          <Field label="Overseer"><input className="input" placeholder="Ate ..." /></Field>
          <div className="mt-3"><Button variant="primary" full>+ Create Team</Button></div>
        </Section>
        <Section title="Create Panata Group">
          <Field label="Group Code"><input className="input" placeholder="e.g. CICS6" /></Field>
          <Field label="Assigned Department"><input className="input" placeholder="Computer Studies" /></Field>
          <Field label="Monitor"><input className="input" placeholder="Kuya ..." /></Field>
          <div className="mt-3"><Button variant="primary" full>+ Create Panata Group</Button></div>
        </Section>
      </div>
    </>
  );
}