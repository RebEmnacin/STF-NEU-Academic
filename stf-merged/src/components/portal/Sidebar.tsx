import { usePortal, type Role } from "./PortalContext";
import {
  LayoutDashboard, Calendar, CheckSquare, Megaphone, User, Settings,
  Users, QrCode, ClipboardList, Thermometer, Library, Send, FileText,
  SlidersHorizontal, ListChecks, BookOpen, GraduationCap, Database, ScanLine,
} from "lucide-react";

interface Item { id: string; label: string; icon: any; }

const menus: Record<Exclude<Role, "guest">, Item[]> = {
  student: [
    { id: "dashboard",       label: "Dashboard",          icon: LayoutDashboard },
    { id: "schedule",        label: "Schedule Management", icon: Calendar },
    { id: "schedule-full", label: "Comprehensive Schedule", icon: FileText },
    { id: "tasks",           label: "Tasks",               icon: CheckSquare },
    { id: "announcements",   label: "Announcements",       icon: Megaphone },
    { id: "attendance-logs", label: "Attendance Logs",     icon: ClipboardList },
    { id: "profile",         label: "My Profile",          icon: User },
    { id: "settings",        label: "Settings",            icon: Settings },
  ],
  leader: [
    { id: "dashboard",       label: "Dashboard",           icon: LayoutDashboard },
    { id: "schedule",        label: "Schedule Management", icon: Calendar },
    { id: "roster",          label: "Team Members",        icon: Users },
    { id: "qr",              label: "QR Generator",        icon: QrCode },
    { id: "logger",          label: "Attendance Logger",   icon: ScanLine },
    { id: "team-attendance", label: "Team Attendance",     icon: ClipboardList },
    { id: "team-heatmap",    label: "Team Heatmap",        icon: Thermometer },
    { id: "tasks",           label: "Tasks",               icon: CheckSquare },
    { id: "announcements",   label: "Announcements",       icon: Megaphone },
    { id: "templates",       label: "Template Library",    icon: Library },
    { id: "settings",        label: "Settings",            icon: Settings },
  ],
  admin: [
    { id: "dashboard",   label: "Dashboard",              icon: LayoutDashboard },
    { id: "students",    label: "My Students",            icon: GraduationCap },
    { id: "schedule",    label: "Schedule Management",    icon: Calendar },
    { id: "heatmap",     label: "Section Heatmap",        icon: Thermometer },
    { id: "dispatcher",  label: "Dispatcher",             icon: Send },
    { id: "attendance",  label: "Attendance Tracker",     icon: ClipboardList },
    { id: "grader",      label: "Task Evaluator & Grader",icon: ListChecks },
    { id: "templates",   label: "Template Library",       icon: Library },
    { id: "settings",    label: "Settings",               icon: Settings },
  ],
  superadmin: [
    { id: "dashboard",  label: "Institutional Dashboard",     icon: LayoutDashboard },
    { id: "groups",     label: "Student Management",          icon: Database },
    { id: "schedule",   label: "Institutional Scheduling",    icon: Calendar },
    { id: "heatmap",    label: "Global Heatmap",              icon: Thermometer },
    { id: "dispatcher", label: "Dispatcher (Full Org)",       icon: Send },
    { id: "sessions",   label: "Session & Attendance Analytics", icon: ClipboardList },
    { id: "endoar",     label: "Grade Manager",               icon: BookOpen },
    { id: "templates",  label: "Global Template Library",     icon: Library },
    { id: "operations", label: "Operations Control",          icon: SlidersHorizontal },
    { id: "settings",   label: "System Settings",             icon: Settings },
  ],
};

// Team label shown in the sidebar header for leaders
const LEADER_TEAM_LABEL = "STF-NEU Team Lead";

export function Sidebar() {
  const { role, view, setView } = usePortal();
  if (role === "guest") return null;
  const items = menus[role];

  return (
    <aside className="w-64 shrink-0 bg-card border-r border-border min-h-[calc(100vh-6rem)] py-4 flex flex-col">
      {/* Scope badge */}
      {role !== "student" && (
        <div className="mx-3 mb-3 px-3 py-2 bg-teal-soft rounded-md">
          <div className="text-[9px] font-bold uppercase tracking-widest text-muted-text">Scope</div>
          <div className="text-xs font-semibold text-teal-dark mt-0.5">
            {role === "leader"     ? "Music / Writing / Video / Photo / DGA / Livestream" :
             role === "admin"      ? "GE 101 — Section A" :
             role === "superadmin" ? "Full Organization (All STF-NEU)" : ""}
          </div>
        </div>
      )}

      <nav className="flex flex-col gap-0.5 px-3 flex-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left ${
                active
                  ? "bg-teal text-white shadow-sm"
                  : "text-foreground/80 hover:bg-secondary"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
