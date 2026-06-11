// clickable cards for announcements 



export function AnnouncementsView({ canCreate = false }: { canCreate?: boolean }) {
  const [tab, setTab] = useState<"ALL"|Ann["badge"]>("ALL");
  const [openId, setOpenId] = useState<number | null>(null);
  const { setModal } = usePortal();
  // Sort: urgency desc, then date desc
  const sorted = [...anns].sort((a, b) => b.urgency - a.urgency || +new Date(b.date) - +new Date(a.date));
  const rows = tab==="ALL" ? sorted : sorted.filter(a => a.badge === tab);
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-teal-dark">Announcements</h1>
          <p className="text-xs text-muted-text mt-0.5">Sorted by urgency, then most recent. Click a card to view details.</p>
        </div>
        {canCreate && <button onClick={() => setModal("dispatcher")} className="bg-teal text-white px-4 py-2 text-sm font-semibold rounded-md flex items-center gap-2 hover:bg-teal-dark"><Plus className="w-4 h-4"/> New Announcement</button>}
      </div>
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {(["ALL","TEAM","PANATA","GE SUBJECT GROUP","INSTITUTIONAL"] as const).map(t => (
          <button key={t} onClick={() => setTab(t as any)}
            className={`px-3 py-1.5 text-xs font-bold rounded-md whitespace-nowrap ${tab===t?"bg-teal text-white":"bg-card border border-border hover:bg-secondary"}`}>{t}</button>
        ))}
      </div>
      <div className="space-y-3">
        {rows.map((a,i) => (
          <button key={i} onClick={() => setOpenId(i)} className={`w-full text-left bg-card border border-border rounded-lg p-5 card-soft hover:shadow-md hover:border-teal/40 transition ${a.urgency===3 ? "border-l-4 border-l-red-status" : a.urgency===2 ? "border-l-4 border-l-amber-status" : ""}`}>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`chip ${annChip[a.badge]}`}>{a.badge}</span>
              {a.urgency > 0 && <span className={`chip ${urgencyChip[a.urgency]}`}>{urgencyLabel[a.urgency]}</span>}
              <h3 className="font-serif font-bold text-teal-dark">{a.title}</h3>
            </div>
            <p className="text-sm text-foreground/80 mb-3">{a.body}</p>
            <div className="text-xs text-muted-text">Posted by: <strong className="text-foreground">{a.by}</strong> · {a.date} · Target: <strong className="text-foreground">{a.target}</strong></div>
          </button>
        ))}
      </div>

      {openId !== null && rows[openId] && (
        <div onClick={() => setOpenId(null)} className="fixed inset-0 bg-black/50 z-50 grid place-items-center p-4">
          <div onClick={e => e.stopPropagation()} className="bg-card rounded-lg max-w-2xl w-full shadow-2xl overflow-hidden">
            <div className={`px-6 py-4 ${rows[openId].urgency===3 ? "bg-red-status text-white" : rows[openId].urgency===2 ? "bg-amber-status text-white" : "bg-teal-dark text-white"}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`chip ${annChip[rows[openId].badge]} bg-white/20 text-white`}>{rows[openId].badge}</span>
                {rows[openId].urgency > 0 && <span className="text-[10px] font-bold tracking-wider">{urgencyLabel[rows[openId].urgency]}</span>}
              </div>
              <h2 className="font-serif text-xl font-bold">{rows[openId].title}</h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-foreground leading-relaxed">{rows[openId].body}</p>
              <div className="border-t border-border pt-4 text-xs text-muted-text grid grid-cols-2 gap-2">
                <div><span className="font-bold text-foreground">Posted by:</span> {rows[openId].by}</div>
                <div><span className="font-bold text-foreground">Date:</span> {rows[openId].date}</div>
                <div className="col-span-2"><span className="font-bold text-foreground">Target audience:</span> {rows[openId].target}</div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setOpenId(null)} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-secondary">Close</button>
                <button className="px-4 py-2 text-sm bg-teal text-white rounded-md hover:bg-teal-dark">Mark as Read</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}