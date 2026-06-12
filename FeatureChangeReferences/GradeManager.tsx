// Grade manager more tabs





import { useState } from "react";
import {
  INSTITUTIONAL_EVENTS, DEPARTMENTS, PANATA_GROUPS, STF_TEAMS, GROUP_MEMBERS,
  GE_SUBJECT_GROUPS, ADMIN_RESPONSIBILITIES, PENDING_REQUESTS, UNASSIGNED_STUDENTS,
  SURVEY_TEMPLATES,
} from "@/lib/portal-data";
import {
  PageHeader, Section, StatCard, Pill, Button, Tabs, Table, Banner,
  Modal, Field,
} from "./ui";
import { Responsibilities } from "./LeaderScreens";

/* ───────────── Super Admin: Grade Manager ───────────── */
export function GradeManager() {
  const tabs = ["GE", "AEVM", "Final Grade"];
  const [tab, setTab] = useState(tabs[0]);
  const [openSubject, setOpenSubject] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const subjects = Array.from(new Set(GE_SUBJECT_GROUPS.map((g) => g.subject)));
  const groupsForSubject = openSubject ? GE_SUBJECT_GROUPS.filter((g) => g.subject === openSubject) : [];
  return (
    <>
      <PageHeader title="Grade Manager"
                  subtitle="GE grading by subject group · AEVM grading per team/panata · Final balance is Super Admin-defined." />
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      {tab === "GE" && (
        <>
          <Banner tone="info">GE grade = weighted blend of <strong>attendance rate</strong> and <strong>gradable tasks</strong>, computed per GE subject group.</Banner>
          <Table rows={[
            { student: "Allyssa Reyes", group: "Art App — M414B", attendance: 94, tasks: 92, grade: 1.4 },
            { student: "Jerico Tan",    group: "SosLit — IS233B", attendance: 81, tasks: 78, grade: 1.7 },
            { student: "Krisha Valdez", group: "Ethics — M210A",  attendance: 100, tasks: 96, grade: 1.1 },
            { student: "Mark Diaz",     group: "MMW — M306C",     attendance: 70, tasks: 65, grade: 2.3 },
          ]} columns={[
            { key: "student", label: "Student", render: (v) => <span className="font-semibold">{v}</span> },
            { key: "group",   label: "GE Subject Group" },
            { key: "attendance", label: "Attendance %" },
            { key: "tasks",   label: "Task %" },
            { key: "grade",   label: "Final Grade", render: (v: any) =>
              <Pill variant={v <= 1.5 ? "success" : v <= 2.0 ? "info" : v <= 2.5 ? "warning" : "error"}>{(v as number).toFixed(2)}</Pill> },
          ]} />
        </>
      )}
      {tab === "AEVM" && (
        <>
          <Banner tone="gold">
            One AEVM grade applies to ALL of a student's enrolled GE subjects. Super Admin sets the GE↔AEVM balance ratio.
          </Banner>
          <Table rows={[
            { student: "Allyssa Reyes", scope: "DGA Team",        attendance: 94, tasks: 92, aevm: "A-" },
            { student: "Jerico Tan",    scope: "DGA Team",        attendance: 88, tasks: 84, aevm: "B+" },
            { student: "Trisha Santos", scope: "Writers Team",    attendance: 94, tasks: 91, aevm: "A" },
            { student: "Sean Garcia",   scope: "Video Team",      attendance: 68, tasks: 70, aevm: "C" },
            { student: "Krisha Valdez", scope: "CICS3 Panata",    attendance: 100, tasks: 95, aevm: "A" },
          ]} columns={[
            { key: "student", label: "Student", render: (v) => <span className="font-semibold">{v}</span> },
            { key: "scope",   label: "Team / Panata" },
            { key: "attendance", label: "Attendance %" },
            { key: "tasks",   label: "Task %" },
            { key: "aevm",    label: "AEVM Score",
              render: (v) => <Pill variant={String(v).startsWith("A") ? "success" : String(v).startsWith("B") ? "info" : "warning"}>{v}</Pill> },
          ]} />
        </>
      )}
      {tab === "Final Grade" && (
        <>
          <Banner tone="info">
            Final Grade = average of the student's <strong>GE subject group score</strong> and their <strong>AEVM score</strong>.
            Drill down: GE Subject → Subgroup → Masterlist (with computed final grade per student).
          </Banner>
          <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">GE Subject Drill-Down</h3>
            <div className="grid gap-3 md:grid-cols-3">
              {subjects.map((s) => (
                <button key={s} onClick={() => setOpenSubject(s)}
                        className="rounded-xl border border-border bg-white p-4 text-left shadow-sm hover:border-[var(--teal-medium)]">
                  <div className="text-sm font-bold">{s}</div>
                  <div className="text-xs text-muted-foreground">
                    {GE_SUBJECT_GROUPS.filter((g) => g.subject === s).length} subgroup(s)
                  </div>
                </button>
              ))}
            </div>
          </section>

          {openSubject && (
            <Modal title={`${openSubject} · Subgroups`} onClose={() => setOpenSubject(null)} size="xl"
                   footer={<Button variant="primary" onClick={() => setOpenSubject(null)}>Close</Button>}>
              <div className="grid gap-3 md:grid-cols-2">
                {groupsForSubject.map((g) => (
                  <button key={g.groupName} onClick={() => setOpenGroup(g.groupName)}
                          className="rounded-xl border border-border bg-white p-4 text-left shadow-sm hover:border-[var(--teal-medium)]">
                    <div className="text-sm font-bold">{g.groupName}</div>
                    <div className="text-xs text-muted-foreground">Teacher: {g.teacher} · Monitor: {g.monitor}</div>
                    <div className="mt-2 flex gap-2"><Pill variant="info">{g.members} members</Pill><Pill variant="success">{g.attendance}%</Pill></div>
                  </button>
                ))}
              </div>
            </Modal>
          )}
          {openGroup && (() => {
            const aevmToNum = (s: string) => ({ "A":1.0,"A-":1.25,"B+":1.5,"B":1.75,"B-":2.0,"C+":2.25,"C":2.5,"D":3.0 } as Record<string, number>)[s] ?? 2.0;
            const rows = GROUP_MEMBERS.map((m, i) => {
              const geScore = [1.4, 1.7, 1.1, 2.3, 1.5, 1.9][i % 6];
              const aevm = ["A-","B+","A","C","A","B"][i % 6];
              const aevmNum = aevmToNum(aevm);
              const final = +((geScore + aevmNum) / 2).toFixed(2);
              return { ...m, geScore, aevm, aevmNum, final };
            });
            return (
              <Modal title={`${openGroup} · Final Grades`} subtitle="Average of GE Subject Group score and AEVM score"
                     onClose={() => setOpenGroup(null)} size="xl"
                     footer={<><Button variant="secondary">Export CSV</Button><Button variant="primary" onClick={() => setOpenGroup(null)}>Close</Button></>}>
                <div className="mb-3 grid grid-cols-3 gap-3">
                  <StatCard label="Members" value={rows.length} />
                  <StatCard label="Avg Final Grade"
                            value={(rows.reduce((a, r) => a + r.final, 0) / rows.length).toFixed(2)}
                            accent="var(--teal-dark)" />
                  <StatCard label="At Risk (>2.5)"
                            value={rows.filter((r) => r.final > 2.5).length}
                            accent="var(--warning-amber)" />
                </div>
                <Table rows={rows} columns={[
                  { key: "name", label: "Student", render: (v) => <span className="font-semibold">{v}</span> },
                  { key: "id",   label: "ID" },
                  { key: "geScore" as any, label: "GE Score",
                    render: (v: any) => <Pill variant={v <= 1.5 ? "success" : v <= 2.0 ? "info" : v <= 2.5 ? "warning" : "error"}>{Number(v).toFixed(2)}</Pill> },
                  { key: "aevm" as any, label: "AEVM",
                    render: (v: any) => <Pill variant={String(v).startsWith("A") ? "success" : String(v).startsWith("B") ? "info" : "warning"}>{v}</Pill> },
                  { key: "aevmNum" as any, label: "AEVM (num)",
                    render: (v: any) => <span className="text-xs text-muted-foreground">{Number(v).toFixed(2)}</span> },
                  { key: "final" as any, label: "Final Grade",
                    render: (v: any) => <Pill variant={v <= 1.5 ? "success" : v <= 2.0 ? "info" : v <= 2.5 ? "warning" : "error"}>{Number(v).toFixed(2)}</Pill> },
                ]} />
              </Modal>
            );
          })()}
        </>
      )}
    </>
  );
}
