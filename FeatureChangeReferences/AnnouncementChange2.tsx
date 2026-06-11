// clickable cards and with follow up feature for announcements




/* ─────────────────────────── Announcements ─────────────────────────── */
export function StudentAnnouncements({ hideNew = false }: { hideNew?: boolean }) {
  const tabs = ["All", "Team", "Panata", "GE Subjects", "Institutional"];
  const [tab, setTab] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const rows = tab === "All" ? ANNOUNCEMENTS : ANNOUNCEMENTS.filter((a) => a.tab === tab);

  return (
    <>
      <PageHeader title="Announcements" subtitle="Sorted by urgency then recency."
                  actions={!hideNew ? <Button variant="primary">+ New Announcement</Button> : undefined} />
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      <div className="grid gap-3">
        {rows.map((a, i) => (
          <button key={i} onClick={() => setOpen(i)}
                  className="rounded-xl border border-border bg-white p-5 text-left shadow-sm transition hover:border-[var(--teal-medium)] hover:shadow-md">
            <div className="mb-2 flex items-center gap-2">
              <Pill variant={a.tab === "Panata" ? "gold" : a.tab === "Institutional" ? "warning" : "info"}>{a.badge}</Pill>
              <span className="text-xs text-muted-foreground">{a.audience}</span>
            </div>
            <h3 className="text-base font-bold">{a.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{a.body}</p>
            <div className="mt-3 text-xs text-muted-foreground">Posted by {a.postedBy} · 2h ago · <span className="font-semibold text-[var(--teal-dark)]">View →</span></div>
          </button>
        ))}
      </div>
      {open !== null && (
        <Modal title={rows[open].title} subtitle={rows[open].audience} onClose={() => setOpen(null)}
               footer={<Button variant="primary" onClick={() => setOpen(null)}>Close</Button>}>
          <div className="mb-3 flex flex-wrap gap-2">
            <Pill variant="info">{rows[open].badge}</Pill>
            <Pill variant="neutral">Posted by {rows[open].postedBy}</Pill>
          </div>
          <p className="text-sm leading-relaxed text-foreground">{rows[open].body}</p>
          <div className="mt-5 border-t border-border pt-4">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--teal-dark)]">
              💬 Clarifications &amp; Follow-ups
            </div>
            <div className="space-y-3">
              {[
                { name: "Maria Santos", role: "Student", time: "2h ago", msg: "Will attendance still be counted if I arrive at 3:10 PM?" },
                { name: "Jofrell Garcia", role: "Coordinator", time: "1h ago", msg: "Yes, late attendance is counted up to 3:15. After that it's marked Excused only with valid reason.", admin: true },
                { name: "Juan Dela Cruz", role: "Student", time: "32m ago", msg: "Salamat sa clarification kapatid!" },
              ].map((m, k) => (
                <div key={k} className={`rounded-md border p-3 text-sm ${m.admin ? "border-[var(--teal-medium)] bg-[color-mix(in_oklab,var(--teal-medium)_8%,white)]" : "border-border bg-muted/30"}`}>
                  <div className="mb-1 flex items-center gap-2 text-xs">
                    <span className="font-semibold">{m.name}</span>
                    <Pill variant={m.admin ? "info" : "neutral"}>{m.role}</Pill>
                    <span className="text-muted-foreground">· {m.time}</span>
                  </div>
                  <div className="text-foreground">{m.msg}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input className="input flex-1" placeholder="Ask a question or follow up…" />
              <Button variant="primary">Send</Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
