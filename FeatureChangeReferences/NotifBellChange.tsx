export type Notif = {
  id: string;
  type: "urgent" | "cancellation" | "postpone" | "reminder" | "info";
  title: string;
  body: string;
  date: string; // ISO-ish
  hoursUntilEvent?: number; // for event-proximity ranking
};

// Sample notifications. Priority algorithm: urgency > recency > event proximity > cancellation/postpone.
const notifs: Notif[] = [
  { id: "n1", type: "cancellation", title: "Choir Orientation CANCELLED", body: "Tonight's 7PM session is cancelled due to venue conflict. Re-scheduling soon.", date: "2026-06-06T10:15:00", hoursUntilEvent: 8 },
  { id: "n2", type: "urgent", title: "URGENT: Video Team call-time moved", body: "Practice now starts 3:00 PM (was 4:30 PM). Confirm via QR on arrival.", date: "2026-06-06T09:40:00", hoursUntilEvent: 5 },
  { id: "n3", type: "postpone", title: "GE 101 Subject Group A — Postponed", body: "Friday lecture moved to next Tuesday, same time.", date: "2026-06-06T08:00:00", hoursUntilEvent: 48 },
  { id: "n4", type: "reminder", title: "Panata CICS2 sync in 2 hours", body: "Bring reflection journal. Google Meet link in your calendar.", date: "2026-06-06T07:30:00", hoursUntilEvent: 2 },
  { id: "n5", type: "info", title: "Task graded: Multimedia Training", body: "Score: 92/100 by @AdminAbella.", date: "2026-06-05T18:20:00" },
  { id: "n6", type: "reminder", title: "Weekly Panata attendance recap", body: "You attended 4/4 this week. Streak: 6 weeks.", date: "2026-06-05T12:00:00" },
];

function priorityScore(n: Notif): number {
  let s = 0;
  // urgency tier
  if (n.type === "urgent") s += 1000;
  else if (n.type === "cancellation") s += 800;
  else if (n.type === "postpone") s += 600;
  else if (n.type === "reminder") s += 300;
  else s += 100;
  // event proximity (closer = higher)
  if (n.hoursUntilEvent != null) s += Math.max(0, 200 - n.hoursUntilEvent * 4);
  // recency (newer = higher)
  s += Math.min(150, (Date.now() - new Date(n.date).getTime()) / 36e5 * -1 + 150);
  return s;
}

const iconFor = (t: Notif["type"]) => {
  switch (t) {
    case "urgent": return <AlertTriangle className="w-4 h-4 text-red-status" />;
    case "cancellation": return <CalendarX className="w-4 h-4 text-red-status" />;
    case "postpone": return <Clock className="w-4 h-4 text-amber-status" />;
    case "reminder": return <Clock className="w-4 h-4 text-teal" />;
    default: return <CheckCircle2 className="w-4 h-4 text-green-status" />;
  }
};

const ringFor = (t: Notif["type"]) =>
  t === "urgent" || t === "cancellation" ? "border-l-4 border-l-red-status bg-red-status/5"
  : t === "postpone" ? "border-l-4 border-l-amber-status bg-amber-status/5"
  : "border-l-4 border-l-transparent";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const sorted = [...notifs].sort((a, b) => priorityScore(b) - priorityScore(a));
  const urgentCount = sorted.filter(n => n.type === "urgent" || n.type === "cancellation").length;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)} className="relative p-1.5 hover:bg-secondary rounded">
        <Bell className="w-5 h-5 text-teal-dark" />
        {sorted.length > 0 && (
          <span className={`absolute -top-0.5 -right-0.5 ${urgentCount > 0 ? "bg-red-status animate-pulse" : "bg-teal"} text-white text-[9px] w-4 h-4 grid place-items-center rounded-full font-bold`}>
            {sorted.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="bg-teal-dark text-white px-4 py-3 flex items-center justify-between">
            <div>
              <div className="font-serif font-bold text-sm">Notifications</div>
              <div className="text-[10px] text-white/70">Sorted by urgency · recency · event proximity</div>
            </div>
            {urgentCount > 0 && (
              <span className="bg-red-status text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{urgentCount} URGENT</span>
            )}
          </div>
          <div className="max-h-[420px] overflow-y-auto">
            {sorted.map(n => (
              <div key={n.id} className={`px-4 py-3 border-b border-border last:border-0 hover:bg-secondary cursor-pointer ${ringFor(n.type)}`}>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">{iconFor(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${
                        n.type === "urgent" || n.type === "cancellation" ? "text-red-status" :
                        n.type === "postpone" ? "text-amber-status" : "text-teal-dark"
                      }`}>{n.type}</span>
                      {n.hoursUntilEvent != null && n.hoursUntilEvent < 24 && (
                        <span className="text-[9px] bg-gold text-teal-dark font-bold px-1.5 rounded">in {n.hoursUntilEvent}h</span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-teal-dark leading-tight">{n.title}</div>
                    <div className="text-xs text-muted-text mt-0.5 leading-snug">{n.body}</div>
                    <div className="text-[10px] text-muted-text mt-1">{new Date(n.date).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-secondary px-4 py-2 text-center text-[11px] font-semibold text-teal-dark hover:bg-teal-soft cursor-pointer">
            View all announcements →
          </div>
        </div>
      )}
    </div>
  );
}
