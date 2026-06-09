import { usePortal, type Role } from "./PortalContext";
import {
  LayoutDashboard, Calendar, CheckSquare, Megaphone, User, Settings,
  Users, QrCode, ClipboardList, Thermometer, Library, Send, FileText,
  SlidersHorizontal, ListChecks, BookOpen, GraduationCap, Database, ScanLine,
} from "lucide-react";

interface Item { id: string; label: string; icon: any; }

const menus: Record<Exclude<Role, "guest">, Item[]> = {
  student: [
    { id: "dashboard",       label: "Dashboard",            icon: LayoutDashboard },
    { id: "schedule",        label: "Schedule Management",  icon: Calendar },
    { id: "schedule-full",   label: "Comprehensive Schedule", icon: FileText },
    { id: "tasks",           label: "Tasks",                icon: CheckSquare },
    { id: "announcements",   label: "Announcements",        icon: Megaphone },
    { id: "attendance-logs", label: "Attendance Logs",      icon: ClipboardList },
    { id: "profile",         label: "My Profile",           icon: User },
    { id: "settings",        label: "Settings",             icon: Settings },
  ],
  leader: [
    { id: "dashboard",       label: "Dashboard",            icon: LayoutDashboard },
    { id: "schedule",        label: "Schedule Management",  icon: Calendar },
    { id: "roster",          label: "Team Members",         icon: Users },
    { id: "qr",              label: "QR Generator",         icon: QrCode },
    { id: "logger",          label: "Attendance Logger",    icon: ScanLine },
    { id: "team-attendance", label: "Team Attendance",      icon: ClipboardList },
    { id: "team-heatmap",    label: "Team Heatmap",         icon: Thermometer },
    { id: "tasks",           label: "Tasks",                icon: CheckSquare },
    { id: "announcements",   label: "Announcements",        icon: Megaphone },
    { id: "templates",       label: "Template Library",     icon: Library },
    { id: "settings",        label: "Settings",             icon: Settings },
  ],
  admin: [
    { id: "dashboard",   label: "Dashboard",               icon: LayoutDashboard },
    { id: "students",    label: "My Students",             icon: GraduationCap },
    { id: "schedule",    label: "Schedule Management",     icon: Calendar },
    { id: "heatmap",     label: "Section Heatmap",         icon: Thermometer },
    { id: "dispatcher",  label: "Dispatcher",              icon: Send },
    { id: "attendance",  label: "Attendance Tracker",      icon: ClipboardList },
    { id: "grader",      label: "Task Evaluator & Grader", icon: ListChecks },
    { id: "templates",   label: "Template Library",        icon: Library },
    { id: "settings",    label: "Settings",                icon: Settings },
  ],
  superadmin: [
    { id: "dashboard",  label: "Institutional Dashboard",       icon: LayoutDashboard },
    { id: "groups",     label: "Student Management",             icon: Database },
    { id: "schedule",   label: "Institutional Scheduling",      icon: Calendar },
    { id: "heatmap",    label: "Global Heatmap",                icon: Thermometer },
    { id: "dispatcher", label: "Dispatcher (Full Org)",         icon: Send },
    { id: "sessions",   label: "Session & Attendance Analytics",icon: ClipboardList },
    { id: "endoar",     label: "Grade Manager",                 icon: BookOpen },
    { id: "templates",  label: "Global Template Library",       icon: Library },
    { id: "operations", label: "Operations Control",            icon: SlidersHorizontal },
    { id: "settings",   label: "System Settings",               icon: Settings },
  ],
};

const SCOPE_LABELS: Record<string, string> = {
  leader:     "Music · Writing · Video · Photo · DGA",
  admin:      "GE 101 — Section A",
  superadmin: "Full Organization · All STF-NEU",
};

export function Sidebar() {
  const { role, view, setView } = usePortal();
  if (role === "guest") return null;
  const items = menus[role];

  return (
    <aside
      className="stf-sidebar w-60 shrink-0 min-h-[calc(100vh-6rem)] flex flex-col"
      style={{ background: "var(--sidebar-bg)" }}
    >
      {/* Scope badge */}
      {role !== "student" && (
        <div className="mx-3 mt-3 mb-2 px-3 py-2.5 scope-badge">
          <div className="scope-label text-[9px] font-bold uppercase tracking-[0.16em] mb-0.5">
            Scope
          </div>
          <div className="text-xs font-semibold leading-snug">
            {SCOPE_LABELS[role] ?? ""}
          </div>
        </div>
      )}

      {/* Role badge pill */}
      <div className="mx-3 mb-3 mt-1 flex items-center gap-2">
        <span
          className="text-[9px] font-bold uppercase tracking-[0.18em] px-2 py-1 rounded-full"
          style={{ background: "rgba(245,197,24,0.18)", color: "var(--gold)" }}
        >
          {role === "student" ? "Student" : role === "leader" ? "Team Leader" : role === "admin" ? "GE Monitor" : "Super Admin"}
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5 px-2.5 flex-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left w-full ${
                active ? "sidebar-active" : ""
              }`}
            >
              <Icon className="w-4 h-4 shrink-0 opacity-80" />
              <span className="truncate flex-1">{item.label}</span>
              <span className="sidebar-dot" />
            </button>
          );
        })}
      </nav>

      {/* Bottom version tag */}
      <div className="px-4 py-3 mt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.25)" }}>
          STF-NEU AEVM · v2.1 · Prototype
        </div>
      </div>
    </aside>
  );
}
