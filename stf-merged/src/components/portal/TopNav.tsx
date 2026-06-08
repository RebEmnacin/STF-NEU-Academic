import { usePortal, type Role } from "./PortalContext";
import { Mail, Search, Sun } from "lucide-react";
import { NotificationBell } from "./NotificationBell";

const roles: { id: Role; label: string }[] = [
  { id: "guest",      label: "Guest" },
  { id: "student",    label: "Student" },
  { id: "leader",     label: "Team Leader" },
  { id: "admin",      label: "GE Monitor / Admin" },
  { id: "superadmin", label: "Super Admin" },
];

export function TopNav() {
  const { role, setRole, setView } = usePortal();

  const searchPlaceholder =
    role === "student"    ? "Search my schedule, tasks, announcements…" :
    role === "leader"     ? "Search team members, sessions, tasks…" :
    role === "admin"      ? "Search section students, tasks, grades…" :
    role === "superadmin" ? "Search all students, events, sessions…" :
    "Search…";

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
      <div className="h-16 flex items-center px-6 gap-5">

        {/* Logo + wordmark */}
        <div className="flex items-center gap-3 min-w-[300px]">
          <div className="relative w-10 h-10 rounded-md bg-gradient-to-br from-teal-dark to-teal grid place-items-center shadow">
            <Sun className="w-6 h-6 text-gold" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-serif font-bold text-teal-dark text-[15px]">STF-NEU AEVM Portal</div>
            <div className="text-[10px] tracking-widest text-muted-text uppercase">
              Special Task Force · New Era University
            </div>
          </div>
          <div
            className="ml-2 w-9 h-9 rounded-full border-2 border-gold grid place-items-center text-[8px] font-bold text-teal-dark bg-card"
            title="NEU Seal"
          >
            NEU
          </div>
        </div>

        {/* Scope-aware search */}
        {role !== "guest" ? (
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-text" />
              <input
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md bg-secondary focus:bg-card focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
            </div>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* Right side */}
        <div className="flex items-center gap-3 min-w-[200px] justify-end">
          {role === "guest" ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("signup")}
                className="text-teal-dark border border-teal/40 px-3 py-2 rounded-md font-semibold text-sm hover:bg-teal-soft"
              >
                Sign Up
              </button>
              <button
                onClick={() => setView("login")}
                className="bg-gold text-teal-dark px-4 py-2 rounded-md font-bold text-sm hover:brightness-105 shadow-sm"
              >
                Member Login →
              </button>
            </div>
          ) : (
            <>
              <NotificationBell />
              <button className="p-1.5 hover:bg-secondary rounded">
                <Mail className="w-5 h-5 text-teal-dark" />
              </button>
              <button className="flex items-center gap-2 ml-1">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-amber-status grid place-items-center text-xs font-bold text-teal-dark border-2 border-card shadow-sm">
                  AJ
                </div>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Prototype role switcher bar */}
      <div className="px-6 pb-2 flex items-center gap-3 border-t border-border bg-secondary/40">
        <span className="text-[10px] font-bold tracking-[0.18em] text-muted-text py-1.5">
          PROTOTYPE VIEW:
        </span>
        <div className="inline-flex rounded-md border border-border bg-card p-0.5 shadow-sm">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={`px-4 py-1.5 text-xs font-bold rounded transition-all duration-200 ${
                role === r.id
                  ? "bg-teal text-white shadow"
                  : "text-foreground/70 hover:text-teal hover:bg-secondary"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
