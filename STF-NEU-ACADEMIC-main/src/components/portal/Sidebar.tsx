// 🌟 HIGHLIGHTED CHANGE: Profile view for admin / superadmin linking within the sidebar to open the profile
import { usePortal, type Role } from "./PortalContext";
import {
  LayoutDashboard, Calendar, CheckSquare, Megaphone, User, Settings,
  Users, QrCode, ClipboardList, Thermometer, Library, Send,
  SlidersHorizontal, ListChecks, BookOpen, GraduationCap, Database,
  UserCircle // 🌟 HIGHLIGHTED CHANGE: Added UserCircle icon for AdminProfile link
} from "lucide-react";

/*
CHANGES
1. menuDefs - re arrange sidebar items, added admin profile
  - Added amin profile
  - Removed dispatches (useless, its all in action center now)

TO BE CHANGED/ TO DO:
1. to apply admin profile linking in sidebar, need to update setView logic in PortalContext to recognize "admin-profile" and route to AdminProfile screen
2. Put numbering in the announcement sidebar tab depending how many unread announcements there are (can be done by adding a new state in PortalContext to track unread announcements, and then displaying that count as a badge on the "Announcements" nav item in the sidebar)
*/


interface Item { id: string; label: string; icon: any; }
interface MenuDef { shared: Item[]; roleLabel: string; roleTools: Item[]; footer: Item[]; }

const menuDefs: Record<Exclude<Role, "guest">, MenuDef> = {
  student: {
    shared: [
      { id: "dashboard",       label: "Dashboard",           icon: LayoutDashboard },
      { id: "schedule",        label: "Schedule Management", icon: Calendar },
      { id: "tasks",           label: "Tasks",               icon: CheckSquare },
      { id: "announcements",   label: "Announcements",       icon: Megaphone },
      { id: "attendance-logs", label: "Attendance Logs",     icon: ClipboardList },
    ],
    roleLabel: "Student Tools",
    roleTools: [],
    footer: [
      { id: "profile",         label: "My Profile",          icon: User },
      { id: "settings",        label: "Settings",            icon: Settings },
    ],
  },
  leader: {
    shared: [
      { id: "dashboard",     label: "Dashboard",           icon: LayoutDashboard },
      { id: "schedule",      label: "Schedule Management", icon: Calendar },
      { id: "tasks",         label: "Tasks",               icon: CheckSquare },
      { id: "announcements", label: "Announcements",       icon: Megaphone },
      { id: "attendance-logs", label: "Attendance Logs",   icon: ClipboardList },
    ],
    roleLabel: "Leader Tools",
    roleTools: [
      { id: "roster",          label: "Team Members",      icon: Users },
      { id: "qr",              label: "QR Generator",      icon: QrCode },
      { id: "team-attendance", label: "Team Attendance",   icon: ClipboardList },
      { id: "team-heatmap",    label: "Team Heatmap",      icon: Thermometer },
      { id: "templates",       label: "Action Center",     icon: Library },
    ],
    footer: [
      { id: "profile",       label: "My Profile",          icon: User },
      { id: "settings",      label: "Settings",            icon: Settings },
    ],
  },
  "ge-monitor": {
    shared: [
      { id: "dashboard",       label: "Dashboard",           icon: LayoutDashboard },
      { id: "schedule",        label: "Schedule Management", icon: Calendar },
      { id: "tasks",           label: "Tasks",               icon: CheckSquare },
      { id: "announcements",   label: "Announcements",       icon: Megaphone },
      { id: "attendance-logs", label: "Attendance Logs",     icon: ClipboardList },
    ],
    roleLabel: "GE Monitor Tools",
    roleTools: [
      { id: "ge-attendance", label: "Course Attendance",    icon: ClipboardList },
      { id: "templates",     label: "Action Center",        icon: Library },
    ],
    footer: [
      { id: "profile",         label: "My Profile",          icon: User },
      { id: "settings",        label: "Settings",            icon: Settings },
    ],
  },
  "panata-monitor": {
    shared: [
      { id: "dashboard",       label: "Dashboard",           icon: LayoutDashboard },
      { id: "schedule",        label: "Schedule Management", icon: Calendar },
      { id: "tasks",           label: "Tasks",               icon: CheckSquare },
      { id: "announcements",   label: "Announcements",       icon: Megaphone },
      { id: "attendance-logs", label: "Attendance Logs",     icon: ClipboardList },
    ],
    roleLabel: "Panata Monitor Tools",
    roleTools: [
      { id: "panata-attendance", label: "Panata Attendance", icon: ClipboardList },
      { id: "templates",         label: "Action Center",     icon: Library },
    ],
    footer: [
      { id: "profile",         label: "My Profile",          icon: User },
      { id: "settings",        label: "Settings",            icon: Settings },
    ],
  },
  admin: {
    shared: [
      { id: "dashboard",     label: "Dashboard",           icon: LayoutDashboard },
      { id: "schedule",      label: "Schedule Management", icon: Calendar },
      { id: "announcements", label: "Announcements",       icon: Megaphone },
      { id: "attendance-logs", label: "Attendance Logs",   icon: ClipboardList },
    ],
    roleLabel: "Monitor Tools",
    roleTools: [
      { id: "students",   label: "My Students",             icon: GraduationCap },
      { id: "heatmap",    label: "Section Heatmap",         icon: Thermometer },
      { id: "attendance", label: "Attendance Tracker",      icon: ClipboardList },
      { id: "grader",     label: "Task Evaluator & Grader", icon: ListChecks },
      { id: "templates",  label: "Action Center",           icon: Library },
    ],
    footer: [
      // 🌟 HIGHLIGHTED CHANGE: Rerouted profile item ID targeting for admin to trigger AdminProfile
      { id: "admin-profile",   label: "Admin Profile",       icon: UserCircle },
      { id: "settings",        label: "Settings",            icon: Settings },
    ],
  },
  superadmin: {
    shared: [
      { id: "dashboard",     label: "Institutional Dashboard",  icon: LayoutDashboard },
      { id: "schedule",      label: "Institutional Scheduling", icon: Calendar },
      { id: "announcements", label: "Announcements",        icon: Megaphone },
    ],
    roleLabel: "Admin Tools",
    roleTools: [
      { id: "groups",     label: "Student Management",              icon: Database },
      { id: "heatmap",    label: "Global Heatmap",                  icon: Thermometer },
      { id: "sessions",   label: "Session & Attendance Analytics",  icon: ClipboardList },
      { id: "operations", label: "Operations Control",              icon: SlidersHorizontal },
      { id: "templates",  label: "Action Centers",                  icon: Library },
      { id: "endoar",     label: "Grade Manager",                   icon: BookOpen },
    ],
    footer: [
      // 🌟 HIGHLIGHTED CHANGE: Rerouted profile item ID targeting for superadmin to trigger AdminProfile
      { id: "admin-profile",   label: "SuperAdmin Profile",  icon: UserCircle },
      { id: "settings",        label: "System Settings",     icon: Settings },
    ],
  },
};

const SCOPE_LABELS: Record<string, string> = {
  leader:          "Music · Writing · Video · Photo · DGA",
  "ge-monitor":    "GE 101 — Section A",
  "panata-monitor":"CICS2 — Panata Group",
  admin:           "GE 101 — Section A",
  superadmin:      "Full Organization · All STF-NEU",
};

function NavItem({ item, active, onClick }: { item: Item; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left w-full ${
        active ? "sidebar-active" : ""
      }`}
    >
      <Icon className="w-4 h-4 shrink-0 opacity-80" />
      <span className="truncate flex-1">{item.label}</span>
      <span className="sidebar-dot" />
    </button>
  );
}

export function Sidebar() {
  const { role, view, setView } = usePortal();
  if (role === "guest") return null;
  const { shared, roleLabel, roleTools, footer } = menuDefs[role];
  const hasRoleTools = roleTools.length > 0;

  return (
    <aside
      className="stf-sidebar w-60 shrink-0 min-h-[calc(100vh-6rem)] flex flex-col"
      style={{ background: "var(--sidebar-bg)" }}
    >
      {/* Scope badge */}
      {role !== "student" && (
        <div className="mx-3 mt-3 mb-2 px-3 py-2.5 scope-badge">
          <div className="scope-label text-[9px] font-bold uppercase tracking-[0.16em] mb-0.5">Scope</div>
          <div className="text-xs font-semibold leading-snug">{SCOPE_LABELS[role] ?? ""}</div>
        </div>
      )}

      {/* Role badge pill */}
      <div className="mx-3 mb-3 mt-1 flex items-center gap-2">
        <span
          className="text-[9px] font-bold uppercase tracking-[0.18em] px-2 py-1 rounded-full"
          style={{ background: "rgba(245,197,24,0.18)", color: "var(--gold)" }}
        >
          {role === "student"         ? "Student" :
           role === "leader"          ? "Team Leader" :
           role === "ge-monitor"      ? "GE Monitor" :
           role === "panata-monitor"  ? "Panata Monitor" :
           role === "admin"           ? "Admin" :
                                        "Super Admin"}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-2.5 flex-1">
        {/* Shared items */}
        {shared.map(item => {
          // Ensure "dashboard" isn't accidentally highlighted when admin-profile is live
          const isItemActive = view === item.id;
          return (
            <NavItem 
              key={item.id} 
              item={item} 
              active={isItemActive} 
              onClick={() => setView(item.id)} 
            />
          );
        })}
        {/* Role-specific divider + tools */}
        {hasRoleTools && (<>
          <div className="flex items-center gap-2 px-1 pt-3 pb-1">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.10)" }} />
            <span
              className="text-[9px] font-bold uppercase tracking-[0.18em] shrink-0"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {roleLabel}
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.10)" }} />
          </div>
          {roleTools.map(item => (
            <NavItem key={item.id} item={item} active={view === item.id} onClick={() => setView(item.id)} />
          ))}
        </>)}

        {/* Footer items (Settings / Profile) */}
        <div className="flex-1" />
        <div className="h-px mx-1 mb-1" style={{ background: "rgba(255,255,255,0.08)" }} />
        {footer.map(item => (
          <NavItem key={item.id} item={item} active={view === item.id} onClick={() => setView(item.id)} />
        ))}
      </nav>

      {/* Version tag */}
      <div className="px-4 py-3 mt-1 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.25)" }}>
          STF-NEU AEVM · v2.1 · Prototype
        </div>
      </div>
    </aside>
  );
}