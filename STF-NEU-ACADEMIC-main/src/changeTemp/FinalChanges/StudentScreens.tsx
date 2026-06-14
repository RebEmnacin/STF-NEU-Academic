import { usePortal } from "./PortalContext";
import {
  X, Lock, Plus, Search, ChevronLeft, ChevronRight,
  Pencil, Trash2, ExternalLink, GripVertical,
  BookOpen, BookMarked, Users, Tv2, Calendar,
  Home, School, Clock, MapPin,
  CheckCircle2, FileText, MessageCircle, Send,
  Bell, Shield, Eye, EyeOff, Save, Sun, Moon, Monitor,
  Mail, Hash, Star, AlertCircle, AlertTriangle, Info, CheckCircle, XCircle,
  UserCircle, Building2, Activity
} from "lucide-react";
import { useState, useEffect, useRef } from "react";


/*
CHANGES
1. StudentDashboard - more sensible sample data
2. Notification modal with "follow up" functionality
3. Sensible sample data, Add more colors in piechart in tasks view (Pending, Submitted, Graded, Missing, Overdue)
TO BE CHANGED/ TO DO :
2. Each Students should have their own QR code in their profile (For future QR system implementation)
*/


// ─── Tasks View — redesigned to match boss reference ─────────────────────────
type TaskStatus = "ALL"|"PENDING"|"SUBMITTED"|"GRADED"|"MISSING"|"OVERDUE";

type TaskItem = {
  title: string;
  contextTarget: string;
  deadline: string;
  assignedBy: string;
  priority: "High"|"Medium"|"Low";
  status: Exclude<TaskStatus,"ALL">;
};

// 🌟 HIGHLIGHTED CHANGE: Sensible task data with 5 distinct statuses mapping to the chart 🌟
export const taskData: TaskItem[] = [
  { title:"Submit Final Video Cut",         contextTarget:"Video Team 104",  deadline:"Nov 15 2023 1PM",  assignedBy:"Team Leader", priority:"High",   status:"PENDING"   },
  { title:"Ethics Reflection Paper",        contextTarget:"GE 101-Sec A",    deadline:"Nov 12 2023 5PM",  assignedBy:"Prof. Reyes", priority:"Medium", status:"SUBMITTED" },
  { title:"Art App Critique Essay",         contextTarget:"GE 102-Sec B",    deadline:"Nov 10 2023 1PM",  assignedBy:"Prof. Santos",priority:"Medium", status:"GRADED"    },
  { title:"Panata Attendance Form",         contextTarget:"CICS2 Panata",    deadline:"Nov 18 2023 8AM",  assignedBy:"Panata Lead", priority:"High",   status:"PENDING"   },
  { title:"Multimedia Storyboard v1",       contextTarget:"Video Team 104",  deadline:"Nov 05 2023 1PM",  assignedBy:"Team Leader", priority:"High",   status:"OVERDUE"   },
  { title:"Peer Evaluation Form",           contextTarget:"GE 101-Sec A",    deadline:"Nov 08 2023 5PM",  assignedBy:"Prof. Reyes", priority:"Low",    status:"MISSING"   },
  { title:"Camera Equipment Checkout",      contextTarget:"Video Team 104",  deadline:"Nov 02 2023 9AM",  assignedBy:"Coordinator", priority:"Medium", status:"GRADED"    },
];

const TASKS_PER_PAGE = 6;

const statusStyle: Record<Exclude<TaskStatus,"ALL">, { pill: string; badge: string }> = {
  PENDING:   { pill:"bg-amber-500/15 text-amber-600 border border-amber-300",   badge:"bg-amber-500 text-white" },
  SUBMITTED: { pill:"bg-teal/15 text-teal border border-teal/40",               badge:"bg-teal text-white" },
  GRADED:    { pill:"bg-green-500/15 text-green-700 border border-green-300",    badge:"bg-green-600 text-white" },
  MISSING:   { pill:"bg-red-500/15 text-red-600 border border-red-300",          badge:"bg-red-500 text-white" },
  OVERDUE:   { pill:"bg-red-600/90 text-white border border-red-600",            badge:"bg-red-700 text-white" },
};
const priorityStyle: Record<string, string> = {
  High:   "bg-red-100 text-red-600 border border-red-200",
  Medium: "bg-amber-100 text-amber-600 border border-amber-200",
  Low:    "bg-green-100 text-green-700 border border-green-200",
};

// Donut chart SVG — 2-point linear snake: Point A (green) → Point B (red), linear easing
// 🌟 HIGHLIGHTED CHANGE: DonutChart rebuilt to support 5 dynamic segments with distinct colors 🌟
function DonutChart({ counts }: { counts: Record<string, number> }) {
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 120); return () => clearTimeout(t); }, []);

  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const r = 54; const cx = 70; const cy = 70;
  const circ = 2 * Math.PI * r;
  const GAP = counts.GRADED === total ? 0 : 2; // Remove gap if 100% complete

  const segments = [
    { key: "GRADED",    color: "#16a34a" }, // Green
    { key: "SUBMITTED", color: "#0d9488" }, // Teal
    { key: "PENDING",   color: "#F5C518" }, // Gold/Amber
    { key: "MISSING",   color: "#ef4444" }, // Red
    { key: "OVERDUE",   color: "#991b1b" }  // Dark Red
  ];

  let currentOffset = -circ * 0.25;

  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="18"/>
      {segments.map((seg, i) => {
        const val = counts[seg.key] || 0;
        if (val === 0) return null;
        const arc = (val / total) * circ;
        const off = currentOffset;
        currentOffset -= (arc); // advance offset for next segment
        return (
          <circle key={seg.key} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth="18"
            strokeLinecap="round"
            style={{
              strokeDasharray: go ? `${arc > GAP ? arc - GAP : arc} ${circ}` : `0 ${circ}`,
              strokeDashoffset: off,
              transition: `stroke-dasharray 0.75s linear ${i * 100}ms`
            }} 
          />
        );
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="middle" fontSize="22" fontWeight="bold" fill="#1B6B8F" fontFamily="Sora, sans-serif">
        {Math.round(((counts.GRADED + counts.SUBMITTED) / total) * 100)}%
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#6b7280" fontFamily="Plus Jakarta Sans, sans-serif">completed</text>
    </svg>
  );
}

export function TasksView({ showAssign = false }: { showAssign?: boolean }) {
  const [activeFilter, setActiveFilter] = useState<TaskStatus>("ALL");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"deadline"|"priority"|"status">("deadline");
  const [page, setPage] = useState(1);
  const [submitted, setSubmitted] = useState<Set<string>>(new Set());
  const [detailTask, setDetailTask] = useState<TaskItem|null>(null);
  const [commentTask, setCommentTask] = useState<TaskItem|null>(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Record<string,string[]>>({});

  const filters: TaskStatus[] = ["ALL","PENDING","SUBMITTED","GRADED","MISSING","OVERDUE"];

// 🌟 HIGHLIGHTED CHANGE: Count aggregation updated to support all 5 metrics for the new chart 🌟
  const counts = {
    GRADED:    taskData.filter(t => t.status === "GRADED").length,
    SUBMITTED: taskData.filter(t => t.status === "SUBMITTED").length,
    PENDING:   taskData.filter(t => t.status === "PENDING").length,
    MISSING:   taskData.filter(t => t.status === "MISSING").length,
    OVERDUE:   taskData.filter(t => t.status === "OVERDUE").length,
  };
  const total     = taskData.length;

  const filteredTasks = taskData.filter(t => {
    const matchFilter = activeFilter === "ALL" || t.status === activeFilter;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                        t.contextTarget.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  }).sort((a, b) => {
    if (sortBy === "priority") {
      const pOrder = { High: 0, Medium: 1, Low: 2 };
      return pOrder[a.priority] - pOrder[b.priority];
    }
    if (sortBy === "status") return a.status.localeCompare(b.status);
    return a.deadline.localeCompare(b.deadline);
  });

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / TASKS_PER_PAGE));
  const pageTasks  = filteredTasks.slice((page - 1) * TASKS_PER_PAGE, page * TASKS_PER_PAGE);

  const handleFilterChange = (f: TaskStatus) => { setActiveFilter(f); setPage(1); };

  const handleSubmit = (title: string) => {
    setSubmitted(prev => new Set([...prev, title]));
  };

  const getEffectiveStatus = (t: TaskItem): Exclude<TaskStatus,"ALL"> => {
    if (t.status === "PENDING" && submitted.has(t.title)) return "SUBMITTED";
    return t.status;
  };

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl font-bold text-teal-dark">My Tasks</h1>
          {showAssign && (
            <button className="flex items-center gap-2 bg-teal text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-teal-dark">
              <Plus className="w-4 h-4"/> Assign Task
            </button>
          )}
        </div>
      </FadeUp>

      <div className="flex gap-7">
        {/* ── Left: Task Matrix ── */}
        <FadeUp delay={60} className="shrink-0">
          <div className="bg-card border border-border rounded-2xl p-5 w-60" style={{boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
            <div className="text-xs font-bold text-muted-text uppercase tracking-widest mb-5">Task Matrix</div>

            {/* 🌟 HIGHLIGHTED CHANGE: Passing explicit 5-count object to DonutChart 🌟 */}
            <div className="flex justify-center mb-4">
              <DonutChart counts={counts} />
            </div>

            {/* 🌟 HIGHLIGHTED CHANGE: Legend updated to match 5 colors 🌟 */}
            <div className="space-y-2 mb-5">
              {[
                { label:`GRADED (${counts.GRADED})`,       color:"#16a34a" },
                { label:`SUBMITTED (${counts.SUBMITTED})`, color:"#0d9488" },
                { label:`PENDING (${counts.PENDING})`,     color:"#F5C518" },
                { label:`MISSING (${counts.MISSING})`,     color:"#ef4444" },
                { label:`OVERDUE (${counts.OVERDUE})`,     color:"#991b1b" },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-2 text-xs text-foreground font-medium">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{background:l.color}}/>
                  {l.label}
                </div>
              ))}
            </div>

            <div className="space-y-1.5 border-t border-border pt-4">
              {[
                { label:"Total Tasks",    value: total  },
                { label:"Action Needed",  value: counts.PENDING + counts.MISSING + counts.OVERDUE }
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-text">{s.label}</span>
                  <span className="text-sm font-bold text-teal-dark">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* ── Right: Task table ── */}
        <div className="flex-1 min-w-0">
          <FadeUp delay={80}>
            {/* Filter tabs */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => handleFilterChange(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                    activeFilter === f
                      ? "bg-teal-dark text-white border-teal-dark"
                      : "bg-card border-border text-foreground/60 hover:border-teal hover:text-teal"
                  }`}
                >
                  {f}
                </button>
              ))}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="ml-auto text-sm border border-border rounded-lg px-3 py-2 bg-card font-medium focus:outline-none focus:ring-2 focus:ring-teal/30"
              >
                <option value="deadline">Sort by Deadline</option>
                <option value="priority">Sort by Priority</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-text"/>
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
            </div>
          </FadeUp>

          {/* Table */}
          <FadeUp delay={120}>
            <div className="bg-card border border-border rounded-xl overflow-hidden" style={{boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-teal-dark text-white text-[11px] uppercase tracking-wider">
                    <th className="px-4 py-3.5 text-left font-semibold">Task Title</th>
                    <th className="px-4 py-3.5 text-left font-semibold w-36">Context Target</th>
                    <th className="px-4 py-3.5 text-left font-semibold w-36">Deadline</th>
                    <th className="px-4 py-3.5 text-left font-semibold w-28">Assigned By</th>
                    <th className="px-4 py-3.5 text-left font-semibold w-24">Priority</th>
                    <th className="px-4 py-3.5 text-left font-semibold w-28">Status</th>
                    <th className="px-4 py-3.5 text-left font-semibold w-32">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageTasks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-muted-text">No tasks found.</td>
                    </tr>
                  ) : pageTasks.map((t, i) => {
                    const effStatus = getEffectiveStatus(t);
                    return (
                      <tr key={i} className={`border-b border-border last:border-0 transition-colors hover:bg-teal-soft/20 ${i%2===0?"bg-card":"bg-secondary/10"}`}>
                        <td className="px-4 py-3.5 font-semibold text-foreground">{t.title}</td>
                        <td className="px-4 py-3.5 text-muted-text text-sm">{t.contextTarget}</td>
                        <td className="px-4 py-3.5 text-muted-text text-sm font-mono">{t.deadline}</td>
                        <td className="px-4 py-3.5 text-sm">{t.assignedBy}</td>
                        <td className="px-4 py-3.5">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${priorityStyle[t.priority]}`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusStyle[effStatus].badge}`}>
                            {effStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setDetailTask(t)}
                              className="p-1.5 rounded-lg border border-border text-muted-text hover:border-teal hover:text-teal hover:bg-teal-soft/20 transition" title="View details">
                              <FileText className="w-3.5 h-3.5"/>
                            </button>
                            <button
                              onClick={() => { setCommentTask(t); setCommentText(""); }}
                              className="p-1.5 rounded-lg border border-border text-muted-text hover:border-slate-blue hover:text-slate-blue hover:bg-slate-blue/10 transition relative" title="Comments">
                              <MessageCircle className="w-3.5 h-3.5"/>
                              {(comments[t.title]?.length ?? 0) > 0 && (
                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-teal text-white text-[9px] font-bold flex items-center justify-center leading-none">
                                  {comments[t.title].length}
                                </span>
                              )}
                            </button>
                            {effStatus === "PENDING" && (
                              <button
                                onClick={() => handleSubmit(t.title)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-dark text-white text-xs font-bold hover:bg-teal transition"
                              >
                                <Send className="w-3 h-3"/> Submit
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-end gap-1.5 mt-4">
                <button onClick={() => setPage(1)} disabled={page===1} className="w-8 h-8 rounded-lg border border-border text-xs font-bold flex items-center justify-center hover:bg-secondary disabled:opacity-40">|&lt;</button>
                <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary disabled:opacity-40">
                  <ChevronLeft className="w-4 h-4"/>
                </button>
                {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
                  <button key={n} onClick={()=>setPage(n)}
                    className={`w-8 h-8 rounded-lg border text-sm font-semibold transition ${page===n?"bg-teal-dark text-white border-teal-dark":"border-border hover:bg-secondary"}`}>
                    {n}
                  </button>
                ))}
                <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary disabled:opacity-40">
                  <ChevronRight className="w-4 h-4"/>
                </button>
                <button onClick={() => setPage(totalPages)} disabled={page===totalPages} className="w-8 h-8 rounded-lg border border-border text-xs font-bold flex items-center justify-center hover:bg-secondary disabled:opacity-40">&gt;|</button>
              </div>
            )}
          </FadeUp>
        </div>
      </div>

      {/* ── Task Detail Modal ── */}
      {detailTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDetailTask(null)}>
          <div className="bg-card rounded-2xl border border-border p-7 w-[500px] shadow-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusStyle[getEffectiveStatus(detailTask)].badge}`}>
                    {getEffectiveStatus(detailTask)}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${priorityStyle[detailTask.priority]}`}>
                    {detailTask.priority}
                  </span>
                </div>
                <h2 className="font-serif font-bold text-teal-dark text-xl">{detailTask.title}</h2>
              </div>
              <button onClick={() => setDetailTask(null)} className="hover:bg-secondary rounded-lg p-1.5 ml-3 shrink-0"><X className="w-5 h-5"/></button>
            </div>
            <div className="space-y-3">
              {[
                { label:"Context / Target",   value: detailTask.contextTarget },
                { label:"Deadline",           value: detailTask.deadline },
                { label:"Assigned By",        value: detailTask.assignedBy },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-3 border-b border-border/60 last:border-0 gap-4">
                  <span className="text-sm text-muted-text shrink-0">{label}</span>
                  <span className="text-sm font-semibold text-foreground text-right">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 p-4 bg-secondary/30 rounded-xl text-sm text-muted-text leading-relaxed">
              Submit your completed task output through the portal link or directly attach a file. Reach out to your assigned coordinator for questions before the deadline.
            </div>
            <div className="flex gap-3 mt-5">
              {getEffectiveStatus(detailTask) === "PENDING" && (
                <button onClick={() => { handleSubmit(detailTask.title); setDetailTask(null); }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-teal-dark text-white rounded-xl text-sm font-bold hover:bg-teal transition">
                  <Send className="w-4 h-4"/> Submit Task
                </button>
              )}
              <button onClick={() => setDetailTask(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Comment Modal ── */}
      {commentTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setCommentTask(null)}>
          <div className="bg-card rounded-2xl border border-border p-7 w-[460px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif font-bold text-teal-dark text-lg">Comments</h2>
              <button onClick={() => setCommentTask(null)} className="hover:bg-secondary rounded-lg p-1.5"><X className="w-5 h-5"/></button>
            </div>
            <p className="text-xs text-muted-text mb-4 font-medium truncate">Task: {commentTask.title}</p>
            {/* Existing comments */}
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {(comments[commentTask.title] ?? []).length === 0
                ? <div className="text-center text-muted-text text-sm py-6">No comments yet. Be the first!</div>
                : (comments[commentTask.title] ?? []).map((c, i) => (
                    <div key={i} className="bg-secondary/40 rounded-xl px-4 py-3 text-sm text-foreground">{c}</div>
                  ))
              }
            </div>
            {/* New comment input */}
            <div className="flex gap-2">
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && commentText.trim()) {
                    setComments(prev => ({ ...prev, [commentTask.title]: [...(prev[commentTask.title] ?? []), commentText.trim()] }));
                    setCommentText("");
                  }
                }}
                placeholder="Add a comment..."
                className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:ring-2 focus:ring-teal/30 outline-none"
              />
              <button
                onClick={() => {
                  if (commentText.trim()) {
                    setComments(prev => ({ ...prev, [commentTask.title]: [...(prev[commentTask.title] ?? []), commentText.trim()] }));
                    setCommentText("");
                  }
                }}
                disabled={!commentText.trim()}
                className="px-4 py-2.5 bg-teal-dark text-white rounded-xl text-sm font-bold hover:bg-teal transition disabled:opacity-40">
                <Send className="w-4 h-4"/>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}