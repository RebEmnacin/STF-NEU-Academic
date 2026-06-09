import { usePortal, type Role } from "./PortalContext";
import { Mail, Search, Sun } from "lucide-react";
import { NotificationBell } from "./NotificationBell";

const roles: { id: Role; label: string }[] = [
  { id: "guest",      label: "Guest" },
  { id: "student",    label: "Student" },
  { id: "leader",     label: "Team Leader" },
  { id: "admin",      label: "GE Monitor" },
  { id: "superadmin", label: "Super Admin" },
];

export function TopNav() {
  const { role, setRole, setView } = usePortal();

  const searchPlaceholder =
    role === "student"    ? "Search schedule, tasks, announcements…" :
    role === "leader"     ? "Search team members, sessions, tasks…" :
    role === "admin"      ? "Search section students, tasks, grades…" :
    role === "superadmin" ? "Search all students, events, sessions…" :
    "Search…";

  return (
    <header className="stf-topnav sticky top-0 z-40 shadow-lg" style={{ background: "var(--nav-bg)" }}>
      {/* ── Main Navbar: Increased height to h-16 and adjusted padding ── */}
      <div className="h-16 flex items-center justify-between px-6 gap-4">

        {/* Left Side: Logo + Wordmark (Fixed width to align with sidebar) */}
        <div className="flex items-center gap-3 shrink-0 w-[280px]">
          <div
            className="relative w-10 h-10 rounded-xl grid place-items-center shadow-lg shrink-0"
            style={{ background: "linear-gradient(135deg, var(--teal-light), var(--teal-dark))" }}
          >
            <Sun className="w-6 h-6" style={{ color: "var(--gold)" }} strokeWidth={2.5} />
          </div>
          <div className="leading-tight flex-1">
            <div className="nav-title font-display font-bold text-base tracking-tight truncate" style={{ color: "var(--gold)", fontFamily: "var(--font-display-val)" }}>
              STF-NEU AEVM
            </div>
            <div className="nav-subtitle text-[10px] tracking-[0.12em] uppercase font-semibold truncate" style={{ color: "rgba(255,255,255,0.40)" }}>
              Special Task Force · New Era
            </div>
          </div>
          {/* NEU seal */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[7px] font-bold border shrink-0"
            style={{ borderColor: "rgba(245,197,24,0.4)", color: "var(--gold)", background: "rgba(245,197,24,0.08)" }}
            title="NEU Seal"
          >
            NEU
          </div>
        </div>

        {/* Center: Search (Fluid width, maxed out, forced center) */}
        <div className="flex-1 flex justify-center max-w-3xl">
          {role !== "guest" ? (
            <div className="w-full relative">
              <Search className="w-4 h-4 absolute left-3.5 top-2.5" style={{ color: "rgba(255,255,255,0.35)" }} />
              <input
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 transition-all"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.85)",
                  caretColor: "var(--gold)",
                }}
              />
            </div>
          ) : (
            <div className="w-full" />
          )}
        </div>

        {/* Right Side: Profile/Actions (Fixed width matching left side for perfect centering) */}
        <div className="flex items-center justify-end gap-3 shrink-0 w-[280px]">
          {role === "guest" ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setView("signup")}
                className="px-4 py-2 rounded-lg text-sm font-semibold border transition-all hover:bg-white/5"
                style={{ border: "1px solid rgba(255,255,255,0.20)", color: "rgba(255,255,255,0.80)" }}
              >
                Sign Up
              </button>
              <button
                onClick={() => setView("login")}
                className="px-5 py-2 rounded-lg text-sm font-bold shadow transition-all hover:brightness-110"
                style={{ background: "var(--gold)", color: "var(--sidebar-bg)" }}
              >
                Login →
              </button>
            </div>
          ) : (
            <>
              <div className="relative">
                <NotificationBell />
              </div>
              <button className="p-2 rounded-lg transition-all hover:bg-white/10">
                <Mail className="w-5 h-5" style={{ color: "rgba(255,255,255,0.60)" }} />
              </button>
              <button className="flex items-center gap-2 ml-2">
                <div
                  className="w-9 h-9 rounded-full grid place-items-center text-sm font-bold border-2 shadow hover:scale-105 transition-transform"
                  style={{
                    background: "linear-gradient(135deg, var(--gold), var(--amber-status))",
                    borderColor: "rgba(255,255,255,0.25)",
                    color: "var(--sidebar-bg)",
                  }}
                >
                  AJ
                </div>
              </button>
            </>
          )}
        </div>

      </div>

      {/* ── Role switcher bar: Increased padding to align with header ── */}
      <div className="px-6 py-2 flex items-center gap-3" style={{ background: "rgba(0,0,0,0.18)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <span className="text-[10px] font-bold tracking-[0.20em] uppercase" style={{ color: "rgba(255,255,255,0.30)" }}>
          PROTOTYPE VIEW:
        </span>
        <div className="inline-flex rounded-lg p-1 gap-1" style={{ background: "rgba(0,0,0,0.25)" }}>
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className="px-3 py-1 text-xs font-bold rounded-md transition-all duration-200"
              style={
                role === r.id
                  ? { background: "var(--teal)", color: "#fff", boxShadow: "0 2px 8px rgba(27,107,143,0.4)" }
                  : { color: "rgba(255,255,255,0.45)" }
              }
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}