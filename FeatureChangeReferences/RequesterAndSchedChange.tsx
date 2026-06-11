// SCHEDULE Requester and add Schedule and view all schedules for students





/* ─────────────────────────── Schedule Mgmt ─────────────────────────── */
export function StudentSchedule() {
  const tabs = ["All", "Major Subjects", "GE Subject Groups", "Panata Groups", "STF Teams", "Personal", "Institutional Events"];
  const [tab, setTab] = useState(tabs[0]);
  const [showCreate, setShowCreate] = useState(false);
  const [showRequest, setShowRequest] = useState(false);

  const all: ScheduleItem[] = [
    ...WEEK_SCHEDULE,
    { day: "Mon", start: "06:00", end: "07:00", title: "Morning Devotion", venue: "Home",            category: "personal" },
    { day: "Wed", start: "16:00", end: "17:30", title: "Thesis Reading",  venue: "Library 2F",       category: "personal" },
    { day: "Sun", start: "14:30", end: "17:00", title: "STF Choir Concert", venue: "Cathedral of Faith", category: "event" },
  ];
  const map: Record<string, ScheduleCategory[]> = {
    "All": ["major","ge","panata","stf","personal","event"],
    "Major Subjects": ["major"],
    "GE Subject Groups": ["ge"],
    "Panata Groups": ["panata"],
    "STF Teams": ["stf"],
    "Personal": ["personal"],
    "Institutional Events": ["event"],
  };
  const rows = all.filter((r) => map[tab].includes(r.category));
  const allowCreate = tab === "All" || tab === "Major Subjects" || tab === "Personal";

  return (
    <>
      <PageHeader title="Comprehensive Schedule Management"
                  subtitle="GE, Panata, STF and Events are managed by your monitors. Majors and personal items are editable."
                  actions={
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => setShowRequest(true)}>⚠ Request Change</Button>
                      {allowCreate && (
                        <Button variant="primary" onClick={() => setShowCreate(true)}>
                          + Add {tab === "Major Subjects" ? "Major" : "Personal"} Schedule
                        </Button>
                      )}
                    </div>
                  } />
      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {!allowCreate && tab !== "All" && (
        <Banner tone="info">Add-schedule is disabled for {tab}. Use <strong>Request Change</strong> for switch/drop/join requests.</Banner>
      )}

      <Table rows={rows} columns={[
        { key: "day",   label: "Day" },
        { key: "title", label: "Title", render: (v, r) => <span className="font-semibold" style={{ color: CATEGORY_META[r.category].color }}>{v}</span> },
        { key: "category", label: "Category", render: (_, r) => <Pill variant="info">{CATEGORY_META[r.category].label}</Pill> },
        { key: "venue", label: "Venue", render: (v) => v || <span className="text-muted-foreground">—</span> },
        { key: "start", label: "Start" },
        { key: "end",   label: "End" },
      ]} />

      {showCreate && <CreateScheduleModal majorOnly={tab === "Major Subjects"} onClose={() => setShowCreate(false)} />}
      {showRequest && <RequesterModal onClose={() => setShowRequest(false)} />}
    </>
  );
}

function CreateScheduleModal({ majorOnly, onClose }: { majorOnly: boolean; onClose: () => void }) {
  const [conflict, setConflict] = useState(false);
  return (
    <Modal title={majorOnly ? "Add Major Subject Schedule" : "Add Personal Schedule"}
           subtitle="Conflicts with existing locked sessions will be flagged automatically."
           onClose={onClose}
           footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant="primary" onClick={onClose}>Save</Button></>}>
      <div className="space-y-3">
        {conflict && <Banner tone="warning">⚠ Potential conflict: OOP Lab (Thu 10:00–13:00). Save anyway or adjust time.</Banner>}
        <Field label="Title"><input className="input" placeholder={majorOnly ? "e.g. OOP Lecture" : "e.g. Thesis Reading"} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <select className="input">
              {majorOnly
                ? <><option>Major Subject</option><option>Major Lab</option></>
                : <><option>Personal</option><option>Group Study</option><option>Devotion</option><option>Errand</option></>}
            </select>
          </Field>
          <Field label="Recurrence">
            <select className="input"><option>One-time</option><option>Weekly</option><option>Bi-weekly</option></select>
          </Field>
        </div>
        <Field label="Venue (optional)"><input className="input" placeholder="Leave blank if not applicable" /></Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Day">
            <select className="input">{DAYS.map((d) => <option key={d}>{d}</option>)}</select>
          </Field>
          <Field label="Start"><input type="time" className="input" defaultValue="10:30" onFocus={() => setConflict(true)} /></Field>
          <Field label="End"><input type="time" className="input" defaultValue="12:00" /></Field>
        </div>
        {majorOnly && (
          <Banner tone="info">
            Majors are student-input because the system does not yet integrate the COM master schedule.
            Your monitor may flag inconsistencies during evaluation.
          </Banner>
        )}
        <Field label="Notes"><textarea className="input" placeholder="Optional notes" /></Field>
      </div>
    </Modal>
  );
}

/* ─────────────────────────── Requester Modal ─────────────────────────── */
function RequesterModal({ onClose }: { onClose: () => void }) {
  const [context, setContext] = useState<"Team" | "Panata Group" | "GE Subject Group">("GE Subject Group");
  const actions =
    context === "Team" ? ["Join"] :
    context === "Panata Group" ? ["Switch"] :
    ["Switch", "Drop"];
  const [action, setAction] = useState(actions[0]);

  return (
    <Modal title="Request Schedule Change" subtitle="Routed to Super Admin for review. Expires mid-midterms."
           onClose={onClose} size="lg"
           footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant="primary" onClick={onClose}>Submit Request</Button></>}>
      <Banner tone="warning">
        ⏳ Request window closes <strong>Oct 14, 2025</strong> (middle of midterms). Submissions after the deadline are auto-rejected.
      </Banner>
      <div className="space-y-3">
        <Field label="1 — Context (required)">
          <select className="input" value={context}
                  onChange={(e) => { const v = e.target.value as typeof context; setContext(v); setAction(v === "Team" ? "Join" : "Switch"); }}>
            <option>GE Subject Group</option>
            <option>Panata Group</option>
            <option>Team</option>
          </select>
        </Field>
        <Field label="2 — Action (required)">
          <select className="input" value={action} onChange={(e) => setAction(e.target.value)}>
            {actions.map((a) => <option key={a}>{a}</option>)}
          </select>
        </Field>
        <Field label="3 — Target">
          <input className="input" placeholder={context === "Team" ? "e.g. Writers Team" : context === "Panata Group" ? "e.g. CICS4" : "e.g. Sosyedad at Literatura — IS234A"} />
        </Field>
        {context === "GE Subject Group" && action === "Switch" && (
          <Field label="Current Group"><input className="input" placeholder="e.g. Sosyedad at Literatura — IS233B" /></Field>
        )}
        <Field label="Reason (required)"><textarea className="input" placeholder="Explain the schedule conflict and why this change is necessary." /></Field>
        <Field label="Attach evidence (optional, screenshots / files)">
          <input type="file" className="input" />
        </Field>
      </div>
    </Modal>
  );
}


