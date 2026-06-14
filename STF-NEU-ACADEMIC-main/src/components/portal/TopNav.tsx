import { usePortal, type Role } from "./PortalContext";
import { Mail, Search, UserCircle2, Settings, LogOut, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import AEVMlogo from "../../assets/AEVMlogo.png";
import { NotificationBell } from "./NotificationBell";
import topnavBg from "../../assets/topnav-bg.png";

const roles: { id: Role; label: string }[] = [
  { id: "guest",           label: "Guest" },
  { id: "student",         label: "Student" },
  { id: "leader",          label: "Team Leader" },
  { id: "ge-monitor",      label: "GE Monitor" },
  { id: "panata-monitor",  label: "Panata Monitor" },
  { id: "admin",           label: "Admin" },
  { id: "superadmin",      label: "Super Admin" },
];

// ─── User Menu (profile / settings / logout) ──────────────────────────────────
function UserMenu() {
  const { setView, setRole } = usePortal();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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

  const goTo = (view: string) => {
    setOpen(false);
    setView(view);
  };

  const handleLogout = () => {
    setOpen(false);
    setRole("guest");
    setView("home");
  };

  const menuItems = [
    { label: "My Profile", sub: "View your profile & responsibilities", Icon: UserCircle2, action: () => goTo("profile") },
    { label: "Settings",   sub: "Preferences, privacy & notifications", Icon: Settings,    action: () => goTo("settings") },
  ];

  return (
    <div className="relative">
      <button ref={btnRef} onClick={toggleOpen} className="flex items-center gap-2 ml-2">
        <div
          className="w-9 h-9 rounded-full grid place-items-center border-2 shadow hover:scale-105 transition-transform"
          style={{
            background: "rgba(255,255,255,0.08)",
            borderColor: open ? "var(--gold)" : "rgba(255,255,255,0.25)",
          }}
        >
          <UserCircle2 className="w-6 h-6" style={{ color: "var(--gold)" }} />
        </div>
      </button>

      {open && createPortal(
        <div
          ref={panelRef}
          className="fixed w-72 rounded-lg overflow-hidden"
          style={{
            top: coords.top,
            right: coords.right,
            background: "var(--teal-dark, #0d4a6b)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 20px 48px rgba(0,0,0,0.35)",
            zIndex: 9999,
          }}
        >
          {/* Identity header */}
          <div
            className="px-4 py-3 flex items-center gap-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.10)" }}
          >
            <div
              className="w-10 h-10 rounded-xl grid place-items-center shrink-0"
              style={{ background: "linear-gradient(135deg, #1B6B8F, #4A8FA8)" }}
            >
              <UserCircle2 className="w-6 h-6 text-white/90" />
            </div>
            <div className="min-w-0">
              <div className="font-serif font-bold text-sm text-white truncate">Reb Emnacin</div>
              <div className="text-[11px] text-white/55 truncate">3rd Year · BSCS · CICS</div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {menuItems.map(({ label, sub, Icon, action }) => (
              <button
                key={label}
                onClick={action}
                className="w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors hover:bg-white/[0.06]"
              >
                <div
                  className="w-8 h-8 rounded-lg grid place-items-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <Icon className="w-4 h-4" style={{ color: "var(--gold)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white">{label}</div>
                  <div className="text-[11px] text-white/45 truncate">{sub}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30 shrink-0" />
              </button>
            ))}
          </div>

          {/* Logout */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.10)" }}>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 flex items-center gap-3 text-left transition-colors hover:bg-red-500/10"
            >
              <div className="w-8 h-8 rounded-lg grid place-items-center shrink-0 bg-red-500/15">
                <LogOut className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-sm font-semibold text-red-400">Log Out</div>
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// ─── Top Nav ────────────────────────────────────────────────────────────────
export function TopNav() {
  const { role, setRole, setView } = usePortal();

  const searchPlaceholder =
    role === "student"        ? "Search schedule, tasks, announcements…" :
    role === "leader"         ? "Search team members, sessions, tasks…" :
    role === "ge-monitor"     ? "Search GE section students, tasks, grades…" :
    role === "panata-monitor" ? "Search Panata members, sessions, duties…" :
    role === "admin"          ? "Search section students, tasks, grades…" :
    role === "superadmin"     ? "Search all students, events, sessions…" :
    "Search…";

  return (
    <header
      className="stf-topnav sticky top-0 z-40 shadow-lg"
      style={{
        backgroundImage: `url(${topnavBg})`,
        backgroundSize: "100% 64px",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center top",
      }}
    >
      {/* ── Main Navbar ── */}
      <div className="h-16 flex items-center justify-between px-6 gap-4">

        {/* Left Side: Logo + Wordmark */}
        <div className="flex items-center gap-3 shrink-0 w-[280px]">
          <img
            src={AEVMlogo}
            alt="AEVM Logo"
            className="h-10 w-auto shrink-0 object-contain"
          />
          <div className="leading-tight flex-1">
            <div
              className="nav-title font-display font-bold text-base tracking-tight truncate"
              style={{ color: "var(--gold)", fontFamily: "var(--font-display-val)" }}
            >
              STF-NEU ASTRA
            </div>
            <div
              className="nav-subtitle text-[10px] tracking-[0.12em] uppercase font-semibold truncate"
              style={{ color: "rgba(255,255,255,0.40)" }}
            >
              Special Task Force · New Era
            </div>
          </div>
        </div>

        {/* Center: Search */}
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

        {/* Right Side: Profile/Actions */}
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
              <UserMenu />
            </>
          )}
        </div>

      </div>

      {/* ── Role switcher bar sits below the image naturally ── */}
      <div
        className="px-6 py-2 flex items-center gap-3"
        style={{ background: "rgba(0,0,0,0.18)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span
          className="text-[10px] font-bold tracking-[0.20em] uppercase"
          style={{ color: "rgba(255,255,255,0.30)" }}
        >
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