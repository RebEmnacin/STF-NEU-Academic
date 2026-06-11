import { createFileRoute } from "@tanstack/react-router";
import { PortalProvider, usePortal } from "@/components/portal/PortalContext";
import { TopNav } from "@/components/portal/TopNav";
import { Sidebar } from "@/components/portal/Sidebar";
import { GuestHome, GuestTeamPage } from "@/components/portal/GuestScreens";
import { LoginPage, SignUpPage } from "@/components/portal/AuthScreens";
import {
  StudentDashboard, DayDrawer, ScheduleView, ScheduleModal, ScheduleViewComprehensive,
  TasksView, AnnouncementsView, ProfileView, SettingsView, AttendanceLogsView,
} from "@/components/portal/StudentScreens";
import {
  Roster, QRGenerator, TeamAttendance, HeatmapView, Dispatcher,
  AttendanceLogger, TemplateLibrary,   GEAttendance, PanataAttendance, ActionCenterLimited,
} from "@/components/portal/LeaderScreens";
import {
  AdminDashboard, EventDetail, SessionLogs, Operations, Endoar, StudentGroups,
  SectionDashboard, MyStudents, TaskGrader, SectionAttendance,
} from "@/components/portal/AdminScreens";

export const Route = createFileRoute("/")(({
  head: () => ({
    meta: [
      { title: "STF-NEU AEVM Portal" },
      { name: "description", content: "Special Task Force — New Era University AEVM portal prototype." },
    ],
  }),
  component: () => (
    <PortalProvider>
      <Shell />
    </PortalProvider>
  ),
}));

function Shell() {
  const { role } = usePortal();
  const dispatcherScope =
    role === "leader"          ? { locked: true,  label: "Video Team 104" } :
    role === "ge-monitor"      ? { locked: true,  label: "GE 101 - Sec A" } :
    role === "panata-monitor"  ? { locked: true,  label: "CICS2 — Panata Group" } :
    role === "admin"           ? { locked: true,  label: "GE 101 - Sec A" } :
                                 { locked: false, label: "All AEVM" };
  return (
    <div className="min-h-screen text-foreground" style={{ background: "var(--background)" }}>
      <TopNav />
      <div className="flex">
        <Sidebar />
        {/* Main content with dot pattern bg */}
        <main className="flex-1 min-w-0 stf-main-bg">
          <Content />
        </main>
      </div>
      <DayDrawer />
      <ScheduleModal />
      <Dispatcher scopeLocked={dispatcherScope.locked} scopeLabel={dispatcherScope.label} />
    </div>
  );
}

function Content() {
  const { role, view, setModal } = usePortal();

  if (role === "guest") {
    if (view === "login") return <LoginPage />;
    if (view === "signup") return <SignUpPage />;
    if (view === "home") return <GuestHome />;
    if (view.startsWith("team-")) return <GuestTeamPage teamName={view.replace("team-", "")} />;
    return <GuestHome />;
  }

  if (role === "student") {
    switch (view) {
      case "dashboard": return <StudentDashboard />;
      case "schedule": return <ScheduleView />;
      case "schedule-full": return <ScheduleViewComprehensive />;
      case "tasks": return <TasksView />;
      case "announcements": return <AnnouncementsView />;
      case "attendance-logs": return <AttendanceLogsView />;
      case "profile": return <ProfileView />;
      case "settings": return <SettingsView />;
      default: return <StudentDashboard />;
    }
  }

  if (role === "leader") {
    switch (view) {
      case "dashboard": return <StudentDashboard />;
      case "schedule": return <ScheduleView />;
      case "roster": return <Roster />;
      case "qr": return <QRGenerator />;
      case "team-attendance": return <TeamAttendance />;
      case "team-heatmap": return <HeatmapView scope="Video Team 104" banner="Scoped View Only — Showing Video Team 104 members" />;
      case "tasks": return <TasksView showAssign />;
      case "announcements": return <AnnouncementsView canCreate />;
      case "templates": return <TemplateLibrary />;
      case "settings": return <SettingsView />;
      default: return <StudentDashboard />;
      case "attendance-logs": return <AttendanceLogsView />;
      case "profile": return <ProfileView />;
    }
  }
  // ADD after the leader block (after its closing brace), before the DispatcherCTA function:

  if (role === "ge-monitor") {
    switch (view) {
      case "dashboard":      return <StudentDashboard />;
      case "schedule":       return <ScheduleView />;
      case "tasks":          return <TasksView showAssign />;
      case "announcements":  return <AnnouncementsView canCreate />;
      case "attendance-logs":return <AttendanceLogsView />;
      case "profile":        return <ProfileView />;
      case "ge-attendance":  return <GEAttendance />;
      case "templates":      return <ActionCenterLimited scope="GE 101 — Section A" />;
      case "settings":       return <SettingsView />;
      default:               return <StudentDashboard />;
    }
  }


  if (role === "panata-monitor") {
    switch (view) {
      case "dashboard":          return <StudentDashboard />;
      case "schedule":           return <ScheduleView />;
      case "tasks":              return <TasksView showAssign />;
      case "announcements":      return <AnnouncementsView canCreate />;
      case "attendance-logs":    return <AttendanceLogsView />;
      case "profile":            return <ProfileView />;
      case "panata-attendance":  return <PanataAttendance />;
      case "templates":          return <ActionCenterLimited scope="CICS2 — Panata Group" />;
      case "settings":           return <SettingsView />;
      default:                   return <StudentDashboard />;
    }
  }

  function DispatcherCTA({ scope }: { scope: string }) {
    return (
      <div className="p-6">
        <h1 className="font-serif text-2xl font-bold text-teal-dark mb-4">Dispatcher</h1>
        <div className="bg-card border border-border rounded-lg p-8 text-center card-soft">
          <p className="text-muted-text mb-2">Create announcements, tasks, or surveys.</p>
          <p className="text-xs text-muted-text mb-4">Scope: <strong className="text-teal-dark">{scope}</strong></p>
          <button onClick={() => setModal("dispatcher")} className="bg-teal text-white px-6 py-3 rounded-md font-semibold hover:bg-teal-dark">
            Open Unified Dispatcher
          </button>
        </div>
      </div>
    );
  }

  if (role === "admin") {
    switch (view) {
      case "dashboard": return <SectionDashboard />;
      case "students": return <MyStudents />;
      case "schedule": return <ScheduleView />;
      case "heatmap": return <HeatmapView scope="GE 101 Sec A" banner="Scoped View — GE 101 Sec A Only" />;
      case "dispatcher": return <DispatcherCTA scope="GE 101 - Sec A" />;
      case "attendance": return <SectionAttendance />;
      case "grader": return <TaskGrader />;
      case "templates": return <TemplateLibrary />;
      case "settings": return <SettingsView />;
      default: return <SectionDashboard />;
    }
  }

  // superadmin
  switch (view) {
    case "dashboard": return <AdminDashboard />;
    case "event-detail": return <EventDetail />;
    case "groups": return <StudentGroups />;
    case "schedule": return <ScheduleView />;
    case "heatmap": return <HeatmapView scope="ALL STUDENTS (4,500)" />;
    case "dispatcher": return <DispatcherCTA scope="Full Organization (4,500)" />;
    case "sessions": return <SessionLogs />;
    case "endoar": return <Endoar />;
    case "templates": return <TemplateLibrary global />;
    case "operations": return <Operations />;
    case "settings": return <SettingsView />;
    default: return <AdminDashboard />;
  }
}
