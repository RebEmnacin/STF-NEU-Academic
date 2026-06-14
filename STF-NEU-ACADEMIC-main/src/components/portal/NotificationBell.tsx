import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Bell, AlertTriangle, CalendarX, Clock, CheckCircle2 } from "lucide-react";

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
    case "reminder": return <Clock className="w-4 h-4" style={{ color: "var(--gold)" }} />;
    default: return <CheckCircle2 className="w-4 h-4 text-green-status" />;
  }
};

const ringFor = (t: Notif["type"]) =>
  t === "urgent" || t === "cancellation" ? "border-l-4 border-l-red-status"
  : t === "postpone" ? "border-l-4 border-l-amber-status"
  : "border-l-4 border-l-transparent";

const rowTintFor = (t: Notif["type"]) =>
  t === "urgent" || t === "cancellation" ? "rgba(239,68,68,0.08)"
  : t === "postpone" ? "rgba(245,158,11,0.08)"
  : "transparent";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const sorted = [...notifs].sort((a, b) => priorityScore(b) - priorityScore(a));
  const urgentCount = sorted.filter(n => n.type === "urgent" || n.type === "cancellation").length;

  const toggleOpen = () => {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setCoords({ top: r.bottom + 8, right: window.innerWidth - r.right });
    }
    setOpen(o => !o);
  };

  useEffect(() => {
    if (!open) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        btnRef.current && !btnRef.current.contains(target) &&
        panelRef.current && !panelRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    const onReposition = () => {
      if (btnRef.current) {
        const r = btnRef.current.getBoundingClientRect();
        setCoords({ top: r.bottom + 8, right: window.innerWidth - r.right });
      }
    };

    document.addEventListener("mousedown", onClick);
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      document.removeEventListener("mousedown", onClick);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open]);

  return (
    <div className="relative">
      <button ref={btnRef} onClick={toggleOpen} className="relative p-2 rounded-lg hover:bg-white/10 transition-all">
        <Bell className="w-5 h-5" style={{ color: "rgba(255,255,255,0.60)" }} />
        {sorted.length > 0 && (
          <span className={`absolute top-1 right-1 ${urgentCount > 0 ? "bg-red-status animate-pulse" : "bg-teal"} text-white text-[9px] w-4 h-4 grid place-items-center rounded-full font-bold border border-white/20`}>
            {sorted.length}
          </span>
        )}
      </button>

      {open && createPortal(
        <div
          ref={panelRef}
          className="fixed w-96 rounded-lg overflow-hidden"
          style={{
            top: coords.top,
            right: coords.right,
            background: "var(--teal-dark, #0d4a6b)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 20px 48px rgba(0,0,0,0.35)",
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.10)" }}
          >
            <div>
              <div className="font-serif font-bold text-sm text-white">Notifications</div>
              <div className="text-[10px] text-white/60">Sorted by urgency · recency · event proximity</div>
            </div>
            {urgentCount > 0 && (
              <span className="bg-red-status text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">{urgentCount} URGENT</span>
            )}
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto">
            {sorted.map(n => (
              <div
                key={n.id}
                className={`px-4 py-3 last:border-0 cursor-pointer transition-colors hover:bg-white/[0.06] ${ringFor(n.type)}`}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                  background: rowTintFor(n.type),
                }}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">{iconFor(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${
                        n.type === "urgent" || n.type === "cancellation" ? "text-red-status" :
                        n.type === "postpone" ? "text-amber-status" : ""
                      }`} style={n.type === "reminder" || n.type === "info" ? { color: "var(--gold)" } : undefined}>
                        {n.type}
                      </span>
                      {n.hoursUntilEvent != null && n.hoursUntilEvent < 24 && (
                        <span className="text-[9px] bg-gold text-teal-dark font-bold px-1.5 rounded">in {n.hoursUntilEvent}h</span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-white leading-tight">{n.title}</div>
                    <div className="text-xs mt-0.5 leading-snug text-white/60">{n.body}</div>
                    <div className="text-[10px] mt-1 text-white/35">{new Date(n.date).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            className="px-4 py-2 text-center text-[11px] font-bold cursor-pointer transition-colors hover:bg-white/10"
            style={{ background: "rgba(0,0,0,0.18)", color: "var(--gold)" }}
          >
            View all announcements →
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}