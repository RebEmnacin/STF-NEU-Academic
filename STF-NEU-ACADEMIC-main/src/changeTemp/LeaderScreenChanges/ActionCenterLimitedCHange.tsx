import { usePortal } from "./PortalContext";
import { useState, useEffect, useRef, Fragment } from "react";
import {
  X, Download, Copy, RefreshCw, Search, Plus, Edit3, Save,
  Users, QrCode, ScanLine, ClipboardList, Thermometer, Library,
  ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Lock,
  GripVertical, MapPin, Calendar, Send, Pencil, Trash2, Link,
  Upload, FileText, Megaphone, CheckSquare, BarChart2, CalendarCheck,
  BookOpen, CalendarDays, CalendarPlus,
} from "lucide-react";



//2. [ActionCenterLimited] - Make the audience scope layout more enhanced (like same as the ActionCenter)
// Methods to be changed: ActionCenterLimited()
// Methods for referencing: ActionCenter()



export function ActionCenterLimited({ scope = "Group" }: { scope?: string }) {
  const [activeTab, setActiveTab] = useState<LimitedTab>("announcement");
  const [sent, setSent] = useState(false);

  const [annTitle, setAnnTitle] = useState("");
  const [annBody, setAnnBody] = useState("");
  const [annScope, setAnnScope] = useState("All Members");
  const [annEffStart, setAnnEffStart] = useState("2026-06-08");
  const [annEffEnd, setAnnEffEnd] = useState("2026-06-30");
  const [annPriority, setAnnPriority] = useState("Normal");

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskScope, setTaskScope] = useState("All Members");
  const [taskDeadline, setTaskDeadline] = useState("2026-06-15T23:59");
  const [taskPriority, setTaskPriority] = useState("Normal");
  const [taskGraded, setTaskGraded] = useState(false);
  const [taskPoints, setTaskPoints] = useState("100");
  const [taskEffStart, setTaskEffStart] = useState("2026-06-08");
  const [taskEffEnd, setTaskEffEnd] = useState("2026-06-30");

  const inputCls = "w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:ring-2 focus:ring-teal/30 text-foreground";
  const selectCls = inputCls;

  const TABS: { id: LimitedTab; label: string }[] = [
    { id: "announcement", label: "ANNOUNCEMENT" },
    { id: "task",         label: "TASK" },
  ];

  return (
    <div className="p-7">
      <FadeUp>
        <div className="mb-1">
          <h1 className="font-serif text-3xl font-bold text-teal-dark">Action Center</h1>
          <p className="text-sm text-muted-text mt-1">Compose and dispatch · Scope: {scope}</p>
        </div>
      </FadeUp>

      <FadeUp delay={30}>
        <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-xl px-4 py-2.5 text-xs font-medium text-foreground mt-4">
          <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          Your scope is limited to: <strong className="text-teal-dark ml-0.5">{scope}</strong>
        </div>
      </FadeUp>

      <FadeUp delay={60}>
        <div className="flex border-b border-border mt-5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 -mb-px transition-all whitespace-nowrap ${
                activeTab === t.id ? "border-teal-dark text-teal-dark" : "border-transparent text-foreground/50 hover:text-teal-dark hover:border-teal/40"
              }`}>
              <span className={activeTab === t.id ? "text-teal-dark" : "text-muted-text"}>
                {SVG_ICONS[t.id]}
              </span>
              {t.label}
            </button>
          ))}
        </div>
      </FadeUp>

      <FadeUp delay={100}>
        <div className="bg-card border border-border rounded-2xl mt-5 overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <span className="text-sm font-semibold text-foreground capitalize">{activeTab}</span>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-muted-text hover:bg-secondary transition">
                <BookOpen className="w-3.5 h-3.5" /> Load Template
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-muted-text hover:bg-secondary transition">
                <Save className="w-3.5 h-3.5" /> Save as Template
              </button>
            </div>
          </div>

          <div className="px-6 py-5 space-y-5">
            {activeTab === "announcement" && (<>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">Title</label>
                <input value={annTitle} onChange={e => setAnnTitle(e.target.value)} placeholder="Announcement title…" className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">Body</label>
                <textarea value={annBody} onChange={e => setAnnBody(e.target.value)} rows={4} placeholder="Write your announcement…" className={inputCls + " resize-none"} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">Audience / Scope</label>
                  <select value={annScope} onChange={e => setAnnScope(e.target.value)} className={selectCls}>
                    <option>All Members</option>
                    <option>{scope}</option>
                  </select>
                  <div className="text-[11px] text-muted-text flex items-center gap-1">
                    <Users className="w-3 h-3" /> Reaches members of <strong className="ml-0.5">{scope}</strong>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">Priority</label>
                  <select value={annPriority} onChange={e => setAnnPriority(e.target.value)} className={selectCls}>
                    <option>Normal</option><option>High</option><option>Low</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">Effectivity Start</label>
                  <input type="date" value={annEffStart} onChange={e => setAnnEffStart(e.target.value)} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">Effectivity End</label>
                  <input type="date" value={annEffEnd} onChange={e => setAnnEffEnd(e.target.value)} className={inputCls} />
                </div>
              </div>
            </>)}

            {activeTab === "task" && (<>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">Task Title</label>
                <input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="Task title…" className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">Description</label>
                <textarea value={taskDesc} onChange={e => setTaskDesc(e.target.value)} rows={4} placeholder="Describe the task…" className={inputCls + " resize-none"} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">Audience / Scope</label>
                  <select value={taskScope} onChange={e => setTaskScope(e.target.value)} className={selectCls}>
                    <option>All Members</option>
                    <option>{scope}</option>
                  </select>
                  <div className="text-[11px] text-muted-text flex items-center gap-1">
                    <Users className="w-3 h-3" /> Reaches members of <strong className="ml-0.5">{scope}</strong>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">Priority</label>
                  <select value={taskPriority} onChange={e => setTaskPriority(e.target.value)} className={selectCls}>
                    <option>Normal</option><option>High</option><option>Low</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">Deadline</label>
                  <input type="datetime-local" value={taskDeadline} onChange={e => setTaskDeadline(e.target.value)} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">Effectivity Start</label>
                  <input type="date" value={taskEffStart} onChange={e => setTaskEffStart(e.target.value)} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">Effectivity End</label>
                  <input type="date" value={taskEffEnd} onChange={e => setTaskEffEnd(e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">Graded?</label>
                <div className="flex items-center gap-3 px-3 py-2.5 border border-border rounded-xl bg-background w-fit">
                  <input type="checkbox" checked={taskGraded} onChange={e => setTaskGraded(e.target.checked)} className="accent-teal w-4 h-4" />
                  <span className="text-sm text-foreground">Graded</span>
                  {taskGraded && (
                    <input value={taskPoints} onChange={e => setTaskPoints(e.target.value)}
                      className="w-16 px-2 py-1 border border-border rounded-lg text-sm bg-card focus:outline-none ml-1" />
                  )}
                </div>
              </div>
            </>)}
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-secondary/20">
            {sent && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-500/10 border border-green-300 px-3 py-1.5 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5" /> Sent successfully!
              </span>
            )}
            <button className="px-4 py-2 text-sm border border-border rounded-xl font-semibold hover:bg-secondary transition">Preview</button>
            <button onClick={() => { setSent(true); setTimeout(() => setSent(false), 3000); }}
              className="flex items-center gap-2 px-5 py-2 text-sm bg-teal text-white rounded-xl font-bold hover:bg-teal-dark transition"
              style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.14)" }}>
              <Send className="w-4 h-4" />
              {activeTab === "announcement" ? "Send Announcement" : "Send / Assign"}
            </button>
          </div>
        </div>
      </FadeUp>
    </div>
  );
}


// ─── ACTION CENTER — Full standalone page (matching screenshots) ───────────────
type ActionTab = "announcement" | "task" | "survey" | "event";

const ACTION_TAB_ICONS: Record<ActionTab, React.ReactNode> = {
  announcement: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>,
  task:         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  survey:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="9" y="11" width="13" height="13"/><path d="M5 7H3v14h14v-2"/><path d="M14 3H3v14"/></svg>,
  event:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
};

const ACTION_TABS: { id: ActionTab; label: string }[] = [
  { id: "announcement", label: "ANNOUNCEMENT" },
  { id: "task",         label: "TASK" },
  { id: "survey",       label: "SURVEY" },
  { id: "event",        label: "EVENT SETTER" },
];

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function SurveyQuestion({ idx, question, type, onRemove }: {
  idx: number; question: string; type: string; onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border border-border rounded-xl bg-card hover:border-teal/40 transition group">
      <span className="text-xs font-bold text-muted-text shrink-0">Q{idx}.</span>
      <span className="flex-1 text-sm text-foreground">{question}</span>
      <span className="text-[11px] font-semibold text-muted-text shrink-0 border border-border px-2 py-0.5 rounded-lg">{type}</span>
      <button onClick={onRemove} className="opacity-0 group-hover:opacity-100 transition text-muted-text hover:text-red-500 ml-1">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ActionCenter({ global = false }: { global?: boolean }) {
  const [activeTab, setActiveTab] = useState<ActionTab>("announcement");
  const [saved, setSaved] = useState(false);
  const [sent, setSent] = useState(false);

  // Announcement state
  const [annTitle, setAnnTitle] = useState("Reminder: Pulong Panata");
  const [annBody, setAnnBody] = useState("Magandang araw mga kapatid! Please be reminded that this week's Pulong Panata has been scheduled.");
  const [annScope, setAnnScope] = useState("All Members");
  const [annRecurrence, setAnnRecurrence] = useState("Does not repeat");
  const [annEffStart, setAnnEffStart] = useState("2026-06-08");
  const [annEffEnd, setAnnEffEnd] = useState("2026-06-30");
  const [annPriority, setAnnPriority] = useState("Normal");
  const [annSchedule, setAnnSchedule] = useState("");

  // Task state
  const [taskTitle, setTaskTitle] = useState("Submit Choir Concert Batch");
  const [taskDesc, setTaskDesc] = useState("Upload your raw BTS footage (min. 30s, max 5min) to the shared drive.");
  const [taskScope, setTaskScope] = useState("All Members");
  const [taskRecurrence, setTaskRecurrence] = useState("Does not repeat");
  const [taskEffStart, setTaskEffStart] = useState("2026-06-08");
  const [taskEffEnd, setTaskEffEnd] = useState("2026-06-30");
  const [taskDeadline, setTaskDeadline] = useState("2026-06-15T23:59");
  const [taskPriority, setTaskPriority] = useState("Normal");
  const [taskGraded, setTaskGraded] = useState(true);
  const [taskPoints, setTaskPoints] = useState("100");
  const [taskFile, setTaskFile] = useState<File | null>(null);

  // Survey state
  const [surveyTitle, setSurveyTitle] = useState("Choir Concert Batch 3 — Dry Run Poll");
  const [surveyDesc, setSurveyDesc] = useState("Quick poll to confirm member availability for Dec 28 dry run.");
  const [surveyScope, setSurveyScope] = useState("All Members");
  const [surveyRecurrence, setSurveyRecurrence] = useState("Does not repeat");
  const [surveyEffStart, setSurveyEffStart] = useState("2026-06-08");
  const [surveyEffEnd, setSurveyEffEnd] = useState("2026-06-30");
  const [questions, setQuestions] = useState([
    { q: "Are you available for Choir Concert dry run on Dec 28?", type: "Multiple Choice" },
    { q: "Which equipment can you bring?", type: "Selectable Options" },
    { q: "Any conflicts to flag?", type: "Text Area" },
  ]);
  const [newQ, setNewQ] = useState("");
  const [newQType, setNewQType] = useState("Multiple Choice");

  // Event state
  const [evtTitle, setEvtTitle] = useState("STF-NEU Choir Concert B");
  const [evtType, setEvtType] = useState("Team Activity");
  const [evtVenue, setEvtVenue] = useState("UHall - Main Stage");
  const [evtStart, setEvtStart] = useState("2026-06-20T18:00");
  const [evtEnd, setEvtEnd] = useState("2026-06-20T21:00");
  const [evtDesc, setEvtDesc] = useState("Annual choir concert featuring STF-NEU Music Team batch 3.");
  const [evtScope, setEvtScope] = useState("All Members");
  const [evtRecurrence, setEvtRecurrence] = useState("Does not repeat");
  const [evtEffStart, setEvtEffStart] = useState("2026-06-08");
  const [evtEffEnd, setEvtEffEnd] = useState("2026-06-30");

  function handleSend() {
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  const inputCls = "w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:ring-2 focus:ring-teal/30 text-foreground";
  const selectCls = "w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:ring-2 focus:ring-teal/30 text-foreground";

  const sendLabel = activeTab === "announcement" ? "Send Announcement"
    : activeTab === "task" ? "Send / Assign"
    : activeTab === "survey" ? "Send Survey"
    : "Publish Event";

  return (
    <div className="p-7">
      <FadeUp>
        <div className="mb-1">
          <h1 className="font-serif text-3xl font-bold text-teal-dark">Action Center</h1>
          <p className="text-sm text-muted-text mt-1">{global ? "Full organizational dispatch" : "Compose, schedule and dispatch · Scope: Group"}</p>
        </div>
      </FadeUp>

      {/* Scope lock banner */}
      {!global && (
      <FadeUp delay={30}>
        <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-xl px-4 py-2.5 text-xs font-medium text-foreground mt-4">
          <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          As Student Leader, you can only target your assigned group:
          <strong className="text-teal-dark ml-0.5">Video Team / CICS2 / GE Sec A</strong>
        </div>
      </FadeUp>
      )}
      {global && (
      <FadeUp delay={30}>
        <div className="flex items-center gap-2 bg-teal-soft border border-teal/30 rounded-xl px-4 py-2.5 text-xs font-medium text-foreground mt-4">
          Full organizational dispatch — target any department, team, or panata group.
        </div>
      </FadeUp>
      )}

      {/* Tab bar — underline style matching screenshots */}
      <FadeUp delay={60}>
        <div className="flex border-b border-border mt-5 mb-0">
          {ACTION_TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 -mb-px transition-all whitespace-nowrap ${
                activeTab === t.id
                  ? "border-teal-dark text-teal-dark"
                  : "border-transparent text-foreground/50 hover:text-teal-dark hover:border-teal/40"
              }`}>
                            <span className={activeTab === t.id ? "text-teal-dark" : "text-muted-text"}>
                {ACTION_TAB_ICONS[t.id]}
              </span>
              {t.label}
            </button>
          ))}
        </div>
      </FadeUp>

      {/* Form card */}
      <FadeUp delay={100}>
        <div className="bg-card border border-border rounded-2xl mt-5 overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <span className="text-sm font-semibold text-foreground capitalize">
              {activeTab === "event" ? "Event Setter" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </span>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-muted-text hover:bg-secondary transition">
                <BookOpen className="w-3.5 h-3.5" /> Load Template
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-muted-text hover:bg-secondary transition">
                <Save className="w-3.5 h-3.5" /> Save as Template
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-5 p-5">
            <div className="col-span-4 space-y-3">
              <div className="text-xs font-bold text-muted-text uppercase tracking-wider">Audience / Scope</div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-sm space-y-2 max-h-80 overflow-y-auto">
                <label className="flex items-center gap-2 font-semibold">
                  <input type="checkbox" defaultChecked className="accent-teal"/> Video Team / CICS2 / GE Sec A
                </label>
                <div className="pl-5 space-y-1.5 text-xs">
                  <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="accent-teal"/> All Members</label>
                  <label className="flex items-center gap-2"><input type="checkbox" className="accent-teal"/> Leads Only</label>
                  <label className="flex items-center gap-2"><input type="checkbox" className="accent-teal"/> Monitors Only</label>
                  <div className="text-muted-text font-bold mt-2 pt-1 border-t border-border">Specific People</div>
                  {["Natalie Portman", "Alex Ammin", "Ben Affleck", "Maria Santos"].map(n => (
                    <label key={n} className="flex items-center gap-2"><input type="checkbox" className="accent-teal"/> {n}</label>
                  ))}
                </div>
              </div>
              <div className="bg-teal-soft border border-teal/30 rounded-xl p-3 text-xs">
                <strong>Reach preview:</strong> this will be sent to <strong>55</strong> members.
              </div>
              <div className="space-y-2">
                <div className="text-xs font-bold text-muted-text uppercase tracking-wider">Recurrence & Effectivity</div>
                <select className={selectCls}>
                  <option>Does not repeat</option><option>Daily</option><option>Weekly</option><option>Bi-weekly</option><option>Monthly</option>
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-[10px] text-muted-text">Start</label><input type="date" defaultValue="2026-06-08" className="w-full mt-0.5 px-2 py-1.5 border border-border rounded-lg text-xs bg-background"/></div>
                  <div><label className="text-[10px] text-muted-text">End</label><input type="date" defaultValue="2026-07-08" className="w-full mt-0.5 px-2 py-1.5 border border-border rounded-lg text-xs bg-background"/></div>
                </div>
              </div>
            </div>
            <div className="col-span-8 space-y-5">

            {/* ── ANNOUNCEMENT ── */}
            {activeTab === "announcement" && (
              <>
                <FormField label="Title">
                  <input value={annTitle} onChange={e => setAnnTitle(e.target.value)} className={inputCls} />
                </FormField>
                <FormField label="Body">
                  <textarea value={annBody} onChange={e => setAnnBody(e.target.value)} rows={4}
                    className={inputCls + " resize-none"} />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Audience / Scope">
                    <select value={annScope} onChange={e => setAnnScope(e.target.value)} className={selectCls}>
                      <option>All Members</option>
                      <option>CICS2 Only</option>
                      <option>GE Sec A</option>
                    </select>
                    <div className="text-[11px] text-muted-text mt-1 flex items-center gap-1">
                      <Users className="w-3 h-3" /> This will reach: <strong>55 members of Video Team</strong>
                    </div>
                  </FormField>
                  <FormField label="Recurrence">
                    <select value={annRecurrence} onChange={e => setAnnRecurrence(e.target.value)} className={selectCls}>
                      <option>Does not repeat</option>
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </FormField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Effectivity Start">
                    <input type="date" value={annEffStart} onChange={e => setAnnEffStart(e.target.value)} className={inputCls} />
                  </FormField>
                  <FormField label="Effectivity End">
                    <input type="date" value={annEffEnd} onChange={e => setAnnEffEnd(e.target.value)} className={inputCls} />
                  </FormField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Priority">
                    <select value={annPriority} onChange={e => setAnnPriority(e.target.value)} className={selectCls}>
                      <option>Normal</option><option>High</option><option>Low</option>
                    </select>
                  </FormField>
                  <FormField label="Schedule Send (Optional)">
                    <input type="datetime-local" value={annSchedule} onChange={e => setAnnSchedule(e.target.value)} className={inputCls} />
                  </FormField>
                </div>
              </>
            )}

            {/* ── TASK ── */}
            {activeTab === "task" && (
              <>
                <FormField label="Task Title">
                  <input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} className={inputCls} />
                </FormField>
                <FormField label="Description">
                  <textarea value={taskDesc} onChange={e => setTaskDesc(e.target.value)} rows={4}
                    className={inputCls + " resize-none"} />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Audience / Scope">
                    <select value={taskScope} onChange={e => setTaskScope(e.target.value)} className={selectCls}>
                      <option>All Members</option><option>CICS2 Only</option><option>GE Sec A</option>
                    </select>
                    <div className="text-[11px] text-muted-text mt-1 flex items-center gap-1">
                      <Users className="w-3 h-3" /> This will reach: <strong>55 members of Video Team</strong>
                    </div>
                  </FormField>
                  <FormField label="Recurrence">
                    <select value={taskRecurrence} onChange={e => setTaskRecurrence(e.target.value)} className={selectCls}>
                      <option>Does not repeat</option><option>Weekly</option><option>Monthly</option>
                    </select>
                  </FormField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Effectivity Start">
                    <input type="date" value={taskEffStart} onChange={e => setTaskEffStart(e.target.value)} className={inputCls} />
                  </FormField>
                  <FormField label="Effectivity End">
                    <input type="date" value={taskEffEnd} onChange={e => setTaskEffEnd(e.target.value)} className={inputCls} />
                  </FormField>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <FormField label="Deadline">
                    <input type="datetime-local" value={taskDeadline} onChange={e => setTaskDeadline(e.target.value)} className={inputCls} />
                  </FormField>
                  <FormField label="Priority">
                    <select value={taskPriority} onChange={e => setTaskPriority(e.target.value)} className={selectCls}>
                      <option>Normal</option><option>High</option><option>Low</option>
                    </select>
                  </FormField>
                  <FormField label="Graded?">
                    <div className="flex items-center gap-3 px-3 py-2.5 border border-border rounded-xl bg-background">
                      <input type="checkbox" checked={taskGraded} onChange={e => setTaskGraded(e.target.checked)} className="accent-teal w-4 h-4" />
                      <span className="text-sm text-foreground">Graded</span>
                      {taskGraded && (
                        <input value={taskPoints} onChange={e => setTaskPoints(e.target.value)}
                          className="w-16 px-2 py-1 border border-border rounded-lg text-sm bg-card focus:outline-none" />
                      )}
                    </div>
                  </FormField>
                </div>
                <FormField label="File Attachment">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm bg-background cursor-pointer hover:bg-secondary transition">
                      <Upload className="w-4 h-4 text-muted-text" />
                      <span className="text-muted-text">{taskFile ? taskFile.name : "Choose File"}</span>
                      <span className="text-muted-text text-xs">{!taskFile && "No file chosen"}</span>
                      <input type="file" className="hidden" onChange={e => setTaskFile(e.target.files?.[0] ?? null)} />
                    </label>
                    {taskFile && <button onClick={() => setTaskFile(null)} className="text-muted-text hover:text-foreground"><X className="w-4 h-4" /></button>}
                  </div>
                </FormField>
              </>
            )}

            {/* ── SURVEY ── */}
            {activeTab === "survey" && (
              <>
                <FormField label="Survey Title">
                  <input value={surveyTitle} onChange={e => setSurveyTitle(e.target.value)} className={inputCls} />
                </FormField>
                <FormField label="Description">
                  <textarea value={surveyDesc} onChange={e => setSurveyDesc(e.target.value)} rows={3}
                    className={inputCls + " resize-none"} />
                </FormField>
                <FormField label="Questions">
                  <div className="space-y-2">
                    {questions.map((q, i) => (
                      <SurveyQuestion key={i} idx={i + 1} question={q.q} type={q.type}
                        onRemove={() => setQuestions(prev => prev.filter((_, j) => j !== i))} />
                    ))}
                    <div className="flex gap-2 mt-2">
                      <input value={newQ} onChange={e => setNewQ(e.target.value)} placeholder="Add a question…"
                        className={inputCls + " flex-1"} onKeyDown={e => {
                          if (e.key === "Enter" && newQ.trim()) {
                            setQuestions(prev => [...prev, { q: newQ.trim(), type: newQType }]);
                            setNewQ("");
                          }
                        }} />
                      <select value={newQType} onChange={e => setNewQType(e.target.value)}
                        className="px-3 py-2.5 border border-border rounded-xl text-xs bg-background focus:outline-none shrink-0">
                        <option>Multiple Choice</option>
                        <option>Selectable Options</option>
                        <option>Text Area</option>
                        <option>Rating Scale</option>
                      </select>
                      <button
                        onClick={() => { if (newQ.trim()) { setQuestions(prev => [...prev, { q: newQ.trim(), type: newQType }]); setNewQ(""); } }}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-teal text-teal text-xs font-semibold hover:bg-teal hover:text-white transition shrink-0">
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                  </div>
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Audience / Scope">
                    <select value={surveyScope} onChange={e => setSurveyScope(e.target.value)} className={selectCls}>
                      <option>All Members</option><option>CICS2 Only</option><option>GE Sec A</option>
                    </select>
                    <div className="text-[11px] text-muted-text mt-1 flex items-center gap-1">
                      <Users className="w-3 h-3" /> This will reach: <strong>55 members</strong>
                    </div>
                  </FormField>
                  <FormField label="Recurrence">
                    <select value={surveyRecurrence} onChange={e => setSurveyRecurrence(e.target.value)} className={selectCls}>
                      <option>Does not repeat</option><option>Weekly</option><option>Monthly</option>
                    </select>
                  </FormField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Effectivity Start">
                    <input type="date" value={surveyEffStart} onChange={e => setSurveyEffStart(e.target.value)} className={inputCls} />
                  </FormField>
                  <FormField label="Effectivity End">
                    <input type="date" value={surveyEffEnd} onChange={e => setSurveyEffEnd(e.target.value)} className={inputCls} />
                  </FormField>
                </div>
              </>
            )}

            {/* ── EVENT SETTER ── */}
            {activeTab === "event" && (
              <>
                <FormField label="Event Title">
                  <input value={evtTitle} onChange={e => setEvtTitle(e.target.value)} className={inputCls} />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Event Type">
                    <select value={evtType} onChange={e => setEvtType(e.target.value)} className={selectCls}>
                      <option>Team Activity</option><option>GE Class</option><option>Panata</option><option>STF Practice</option><option>Major Event</option>
                    </select>
                  </FormField>
                  <FormField label="Venue (Nullable)">
                    <input value={evtVenue} onChange={e => setEvtVenue(e.target.value)} className={inputCls} placeholder="e.g. UHall - Main Stage" />
                    {evtVenue && <div className="text-[11px] text-muted-text mt-1">📍 Sonic GPS TBD</div>}
                  </FormField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Scheduled Start">
                    <input type="datetime-local" value={evtStart} onChange={e => setEvtStart(e.target.value)} className={inputCls} />
                  </FormField>
                  <FormField label="Scheduled End">
                    <input type="datetime-local" value={evtEnd} onChange={e => setEvtEnd(e.target.value)} className={inputCls} />
                  </FormField>
                </div>
                <FormField label="Description">
                  <textarea value={evtDesc} onChange={e => setEvtDesc(e.target.value)} rows={3}
                    className={inputCls + " resize-none"} />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Audience / Scope">
                    <select value={evtScope} onChange={e => setEvtScope(e.target.value)} className={selectCls}>
                      <option>All Members</option><option>CICS2 Only</option><option>GE Sec A</option>
                    </select>
                    <div className="text-[11px] text-muted-text mt-1 flex items-center gap-1">
                      <Users className="w-3 h-3" /> This will reach: <strong>55 members</strong>
                    </div>
                  </FormField>
                  <FormField label="Recurrence">
                    <select value={evtRecurrence} onChange={e => setEvtRecurrence(e.target.value)} className={selectCls}>
                      <option>Does not repeat</option><option>Weekly</option><option>Monthly</option>
                    </select>
                  </FormField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Effectivity Start">
                    <input type="date" value={evtEffStart} onChange={e => setEvtEffStart(e.target.value)} className={inputCls} />
                  </FormField>
                  <FormField label="Effectivity End">
                    <input type="date" value={evtEffEnd} onChange={e => setEvtEffEnd(e.target.value)} className={inputCls} />
                  </FormField>
                </div>
                <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl px-4 py-2.5 text-xs text-muted-text">
                  📌 Publishing auto-adds to Institutional Calendar · dispatches announcement
                </div>
              </>
            )}

            </div>
          </div>

          {/* Card footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-secondary/20">
            <div className="flex items-center gap-2 text-xs text-muted-text">
              {/* Rich text toolbar hint */}
              <span className="flex items-center gap-1 px-2 py-1 border border-border rounded-lg bg-card">T</span>
              <span className="flex items-center gap-1 px-2 py-1 border border-border rounded-lg bg-card"><Pencil className="w-3 h-3" /></span>
            </div>
            <div className="flex items-center gap-2">
              {sent && (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-500/10 border border-green-300 px-3 py-1.5 rounded-lg">
                  <CheckCircle className="w-3.5 h-3.5" /> {activeTab === "event" ? "Event published!" : "Sent successfully!"}
                </span>
              )}
              <button className="px-4 py-2 text-sm border border-border rounded-xl font-semibold hover:bg-secondary transition">Preview</button>
              <button onClick={handleSend}
                className="flex items-center gap-2 px-5 py-2 text-sm bg-teal text-white rounded-xl font-bold hover:bg-teal-dark transition"
                style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.14)" }}>
                <Send className="w-4 h-4" />
                {sendLabel}
              </button>
            </div>
          </div>
        </div>
      </FadeUp>
    </div>
  );
}














