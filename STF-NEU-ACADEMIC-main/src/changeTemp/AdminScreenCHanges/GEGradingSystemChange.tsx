


// SA6: Grade Manager
export function Endoar() {
  const [tab, setTab] = useState<"ge" | "team" | "final">("ge");
  const [geView, setGeView] = useState<"cards" | "all">("cards");
  const [openSubject, setOpenSubject] = useState<string | null>(null);
  const [openTeam, setOpenTeam] = useState<string | null>(null);

  const geSubjects = ["Art Appreciation", "Sosyedad at Literatura", "Ethics", "PE 3"];
  const teams = [
    { name: "Video Team 104", members: 55, avgAevm: "B+" },
    { name: "DGA Team", members: 25, avgAevm: "A-" },
    { name: "Writers Team", members: 18, avgAevm: "B" },
    { name: "Music Team", members: 30, avgAevm: "A" },
  ];
  const geGroups: Record<string, { group: string; teacher: string; members: number; attendance: number }[]> = {
    "Art Appreciation": [{ group: "Art App — M414B", teacher: "Prof. Reyes", members: 32, attendance: 91 }],
    "Sosyedad at Literatura": [{ group: "SosLit — IS233B", teacher: "Prof. Sandoval", members: 28, attendance: 84 }, { group: "SosLit — IS234A", teacher: "Prof. Sandoval", members: 30, attendance: 88 }],
    "Ethics": [{ group: "Ethics — M210A", teacher: "Prof. Mariano", members: 35, attendance: 93 }],
    "PE 3": [{ group: "PE 3 — G2", teacher: "Coach Lim", members: 40, attendance: 78 }],
  };

  const gradeRows = [
    { student: "Natalie Portman", group: "Art App — M414B", attendance: 94, tasks: 92, grade: 1.4 },
    { student: "Alex Ammin", group: "SosLit — IS233B", attendance: 81, tasks: 78, grade: 1.7 },
    { student: "Ben Affleck", group: "Ethics — M210A", attendance: 100, tasks: 96, grade: 1.1 },
    { student: "Maria Santos", group: "PE 3 — G2", attendance: 70, tasks: 65, grade: 2.3 },
  ];

  const gradeChip = (g: number) => g <= 1.5 ? "bg-green-status text-white" : g <= 2.0 ? "bg-teal text-white" : g <= 2.5 ? "bg-amber-status text-white" : "bg-red-status text-white";

  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-teal-dark mb-1">Grade Manager</h1>
      <p className="text-sm text-muted-text mb-4">GE grading by subject group · Team AEVM scores · Final grade by GE subject.</p>
      <div className="border-b border-border flex gap-1 mb-4">
        {[["ge", "GE Subject"], ["team", "Team"], ["final", "Final Grade"]].map(([id, l]) => (
          <button key={id} onClick={() => setTab(id as typeof tab)} className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px ${tab === id ? "border-teal text-teal-dark" : "border-transparent text-muted-text"}`}>{l}</button>
        ))}
      </div>

      {tab === "ge" && (
        <>
          <div className="flex gap-2 mb-4">
            <button onClick={() => setGeView("cards")} className={`px-3 py-1.5 text-xs font-bold rounded-lg ${geView === "cards" ? "bg-teal text-white" : "bg-card border border-border"}`}>Subject Cards</button>
            <button onClick={() => setGeView("all")} className={`px-3 py-1.5 text-xs font-bold rounded-lg ${geView === "all" ? "bg-teal text-white" : "bg-card border border-border"}`}>All View</button>
          </div>
          {geView === "cards" ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {geSubjects.map(s => (
                <button key={s} onClick={() => setOpenSubject(s)} className="text-left p-4 rounded-xl border border-border bg-card hover:border-teal/40 transition card-soft">
                  <div className="font-serif font-bold text-teal-dark">{s}</div>
                  <div className="text-xs text-muted-text mt-1">{(geGroups[s] ?? []).length} subgroup(s)</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-hidden card-soft mb-4">
              <table className="w-full text-sm">
                <thead className="bg-teal-dark text-white text-xs uppercase"><tr>{["Student", "GE Subject Group", "Attendance %", "Task %", "Grade"].map(h => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
                <tbody>
                  {gradeRows.map((r, i) => (
                    <tr key={i} className="row-alt border-b border-border">
                      <td className="px-3 py-2 font-semibold">{r.student}</td>
                      <td className="px-3 py-2">{r.group}</td>
                      <td className="px-3 py-2">{r.attendance}%</td>
                      <td className="px-3 py-2">{r.tasks}%</td>
                      <td className="px-3 py-2"><span className={`chip ${gradeChip(r.grade)}`}>{r.grade.toFixed(2)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {openSubject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpenSubject(null)}>
              <div className="bg-card rounded-xl max-w-lg w-full p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
                <h3 className="font-serif font-bold text-teal-dark mb-3">{openSubject} · Subgroups</h3>
                <div className="space-y-2">
                  {(geGroups[openSubject] ?? []).map(g => (
                    <div key={g.group} className="p-3 border border-border rounded-lg">
                      <div className="font-semibold">{g.group}</div>
                      <div className="text-xs text-muted-text">Teacher: {g.teacher} · {g.members} members · {g.attendance}% attendance</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setOpenSubject(null)} className="mt-4 w-full py-2 bg-teal text-white rounded font-semibold text-sm">Close</button>
              </div>
            </div>
          )}
        </>
      )}

      {tab === "team" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {teams.map(t => (
            <button key={t.name} onClick={() => setOpenTeam(t.name)} className="text-left p-4 rounded-xl border border-border bg-card hover:border-teal/40 transition card-soft">
              <div className="font-serif font-bold text-teal-dark">{t.name}</div>
              <div className="text-xs text-muted-text mt-1">{t.members} members</div>
              <div className="mt-2"><span className="chip bg-teal text-white">Avg AEVM: {t.avgAevm}</span></div>
            </button>
          ))}
          {openTeam && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpenTeam(null)}>
              <div className="bg-card rounded-xl max-w-2xl w-full p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
                <h3 className="font-serif font-bold text-teal-dark mb-3">{openTeam} · AEVM Scores</h3>
                <table className="w-full text-sm">
                  <thead><tr className="text-xs uppercase text-muted-text border-b"><th className="py-2 text-left">Student</th><th className="py-2 text-left">Attendance</th><th className="py-2 text-left">Tasks</th><th className="py-2 text-left">AEVM</th></tr></thead>
                  <tbody>
                    {gradeRows.slice(0, 3).map((r, i) => (
                      <tr key={i} className="border-b border-border"><td className="py-2 font-semibold">{r.student}</td><td>{r.attendance}%</td><td>{r.tasks}%</td><td><span className="chip bg-teal text-white">{["A-", "B+", "A"][i]}</span></td></tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={() => setOpenTeam(null)} className="mt-4 w-full py-2 bg-teal text-white rounded font-semibold text-sm">Close</button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "final" && (
        <>
          <div className="bg-teal-soft/40 border border-teal/20 rounded-lg px-4 py-2 text-xs mb-4">
            Final Grade = average of GE subject group score and AEVM score · drill down by GE subject.
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {geSubjects.map(s => (
              <button key={s} onClick={() => setOpenSubject(s)} className="text-left p-4 rounded-xl border border-border bg-card hover:border-teal/40 transition card-soft">
                <div className="font-serif font-bold text-teal-dark">{s}</div>
                <div className="text-xs text-muted-text mt-1">View final grades</div>
              </button>
            ))}
          </div>
          <div className="bg-card border border-border rounded-lg overflow-hidden card-soft">
            <table className="w-full text-sm">
              <thead className="bg-teal-dark text-white text-xs uppercase"><tr>{["Student", "GE Score", "AEVM", "Final Grade"].map(h => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
              <tbody>
                {[{ s: "Natalie Portman", ge: 1.4, aevm: "A-", final: 1.33 }, { s: "Alex Ammin", ge: 1.7, aevm: "B+", final: 1.6 }, { s: "Ben Affleck", ge: 1.1, aevm: "A", final: 1.05 }].map((r, i) => (
                  <tr key={i} className="row-alt border-b border-border">
                    <td className="px-3 py-2 font-semibold">{r.s}</td>
                    <td className="px-3 py-2"><span className={`chip ${gradeChip(r.ge)}`}>{r.ge.toFixed(2)}</span></td>
                    <td className="px-3 py-2"><span className="chip bg-teal text-white">{r.aevm}</span></td>
                    <td className="px-3 py-2"><span className={`chip ${gradeChip(r.final)}`}>{r.final.toFixed(2)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <button className="bg-gold text-teal-dark px-5 py-2 rounded font-bold text-sm hover:brightness-105">Compute Final Grades</button>
        <button className="bg-teal text-white px-5 py-2 rounded font-semibold text-sm hover:bg-teal-dark">Save Grades</button>
      </div>
    </div>
  );
}