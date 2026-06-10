import { usePortal } from "./PortalContext";
import { useState, useEffect, useRef, Fragment } from "react";
import {
  X, Download, Copy, RefreshCw, Search, Plus, Edit3, Save,
  Users, QrCode, ScanLine, ClipboardList, Thermometer, Library,
  ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Lock,
  GripVertical, MapPin, Calendar, Send, Pencil, Trash2, Link,
  Upload, FileText, Megaphone, CheckSquare, BarChart2, CalendarCheck,
  BookOpen,
} from "lucide-react";

// ─── Shared animation primitives ──────────────────────────────────────────────
function useFadeUp(delay = 0) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay + 40);
    return () => clearTimeout(t);
  }, [delay]);
  return visible;
}

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const visible = useFadeUp(delay);
  return (
    <div className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(18px)",
      transition: "opacity 0.45s ease, transform 0.45s ease",
    }}>
      {children}
    </div>
  );
}

function SectionCard({ icon: Icon, title, children, action }: {
  icon: React.ElementType; title: string; children: React.ReactNode; action?: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
      <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-teal-soft flex items-center justify-center text-teal">
            <Icon className="w-4 h-4" />
          </div>
          <h2 className="font-semibold text-sm text-foreground">{title}</h2>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </div>
  );
}

function StatCard({ label, value, sub, accent = false }: { label: string; value: string | number; sub?: string; accent?: boolean }) {
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3.5" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
      <div className="text-xs text-muted-text font-medium">{label}</div>
      <div className={`font-serif text-2xl font-bold mt-0.5 ${accent ? "text-red-status" : "text-teal-dark"}`}>{value}</div>
      {sub && <div className="text-[11px] text-muted-text mt-0.5">{sub}</div>}
    </div>
  );
}

// ─── Roster data ──────────────────────────────────────────────────────────────
type Member = {
  initials: string; name: string; id: string; course: string; year: string;
  attendance: string; tasks: string; status: string;
  dept: string; panata: string; email: string; bio: string;
  tasksDone: number; tasksTotal: number; attendancePct: number;
  recentActivity: string;
};

const roster: Member[] = [
  { initials:"NP", name:"Natalie Portman",  id:"STF-2022-0101", course:"BS Nursing",        year:"Junior",    attendance:"95%", tasks:"88%", status:"Active",   dept:"CICS",  panata:"CICS2",  email:"natalie.portman@neu.edu.ph",  bio:"Visual storyteller and camera operator. 3-year STF member.",        tasksDone:22, tasksTotal:25, attendancePct:95, recentActivity:"Submitted Week 8 video footage" },
  { initials:"AA", name:"Alex Ammin",       id:"STF-2022-0102", course:"BS IT",             year:"Sophomore", attendance:"87%", tasks:"72%", status:"Active",   dept:"CICS",  panata:"CICS2",  email:"alex.ammin@neu.edu.ph",       bio:"Backend developer and motion graphics editor.",                     tasksDone:18, tasksTotal:25, attendancePct:87, recentActivity:"Edited promo reel for AEVM Week" },
  { initials:"BA", name:"Ben Affleck",      id:"STF-2021-0088", course:"BS Civil Eng",      year:"Senior",    attendance:"91%", tasks:"95%", status:"Active",   dept:"CEA",   panata:"CEA1",   email:"ben.affleck@neu.edu.ph",      bio:"Senior videographer, specializes in event coverage.",               tasksDone:24, tasksTotal:25, attendancePct:91, recentActivity:"Led direction for November gala" },
  { initials:"MS", name:"Maria Santos",     id:"STF-2023-0103", course:"BA Communication", year:"Freshman",  attendance:"76%", tasks:"60%", status:"Active",   dept:"CAS",   panata:"CAS2",   email:"maria.santos@neu.edu.ph",     bio:"Scriptwriter and social media content creator.",                    tasksDone:15, tasksTotal:25, attendancePct:76, recentActivity:"Drafted script for orientation video" },
  { initials:"JR", name:"Jose Reyes",       id:"STF-2023-0104", course:"BS Psychology",    year:"Freshman",  attendance:"82%", tasks:"55%", status:"Active",   dept:"CAS",   panata:"CAS3",   email:"jose.reyes@neu.edu.ph",       bio:"Drone operator and color grading assistant.",                       tasksDone:14, tasksTotal:25, attendancePct:82, recentActivity:"Submitted color grading output" },
  { initials:"AC", name:"Ana Cruz",         id:"STF-2022-0105", course:"BS Accountancy",   year:"Junior",    attendance:"65%", tasks:"40%", status:"On Leave", dept:"COA",   panata:"COA1",   email:"ana.cruz@neu.edu.ph",         bio:"On approved leave since Oct 2023. Documentary editor.",             tasksDone:10, tasksTotal:25, attendancePct:65, recentActivity:"Last active: Oct 12, 2023" },
  { initials:"DL", name:"Diego Luna",       id:"STF-2022-0106", course:"BS Criminology",   year:"Sophomore", attendance:"88%", tasks:"79%", status:"Active",   dept:"COC",   panata:"COC1",   email:"diego.luna@neu.edu.ph",       bio:"Audio-visual technician and live stream operator.",                  tasksDone:20, tasksTotal:25, attendancePct:88, recentActivity:"Set up livestream for Panata night" },
  { initials:"RG", name:"Rosa Gomez",       id:"STF-2023-0107", course:"BS Midwifery",     year:"Freshman",  attendance:"92%", tasks:"83%", status:"Active",   dept:"CMT",   panata:"CMT1",   email:"rosa.gomez@neu.edu.ph",       bio:"Photography lead and video team archivist.",                        tasksDone:21, tasksTotal:25, attendancePct:92, recentActivity:"Uploaded photo archive for Nov events" },
];

function MiniBar({ pct, color = "var(--teal)" }: { pct: number; color?: string }) {
  return (
    <div className="w-full h-1.5 rounded-full bg-border mt-1">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function AvatarSVG({ initials, size = 48, isOnLeave = false, className = "" }: { initials: string; size?: number; isOnLeave?: boolean; className?: string }) {
  const [c1, c2] = isOnLeave ? ["#f59e0b", "#92400e"] : ["#0d9488", "#134e4a"];
  const id = `grad-${initials}-${isOnLeave ? "leave" : "active"}`;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill={`url(#${id})`} />
      <circle cx="24" cy="24" r="20" fill="white" fillOpacity="0.07" />
      <circle cx="24" cy="17" r="8" fill="white" fillOpacity="0.9" />
      <ellipse cx="24" cy="38" rx="12" ry="9" fill="white" fillOpacity="0.9" />
    </svg>
  );
}

function ProfileModal({ member, onClose, onMessage }: { member: Member; onClose: () => void; onMessage: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 20); return () => clearTimeout(t); }, []);
  const isActive = member.status === "Active";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-background border border-border rounded-2xl w-full max-w-lg overflow-hidden"
        style={{
          boxShadow: "0 16px 60px rgba(0,0,0,0.25)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        <div className="bg-teal-dark px-6 pt-6 pb-10 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-end gap-4">
            <AvatarSVG initials={member.initials} size={64} isOnLeave={!isActive} className="shadow-lg rounded-2xl" />
            <div className="text-white pb-1">
              <div className="font-serif text-xl font-bold">{member.name}</div>
              <div className="text-xs text-white/60 font-mono mt-0.5">{member.id}</div>
            </div>
            <span className={`ml-auto mb-1 text-[11px] font-bold px-3 py-1 rounded-full border ${
              isActive ? "bg-green-500/20 text-green-300 border-green-400/30" : "bg-amber-400/20 text-amber-300 border-amber-400/30"
            }`}>{member.status}</span>
          </div>
        </div>
        <div className="-mt-5 mx-5 bg-card border border-border rounded-2xl px-5 pt-4 pb-5 space-y-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Course", value: member.course },
              { label: "Year Level", value: member.year },
              { label: "Department", value: member.dept },
            ].map(({ label, value }) => (
              <div key={label} className="bg-secondary/50 rounded-xl p-2.5">
                <div className="text-[10px] text-muted-text font-semibold uppercase tracking-wider">{label}</div>
                <div className="text-sm font-bold text-foreground mt-0.5 leading-tight">{value}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="text-[10px] font-bold text-muted-text uppercase tracking-wider mb-1">About</div>
            <p className="text-sm text-foreground leading-relaxed">{member.bio}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-text font-medium">Attendance</span>
                <span className={`font-bold ${member.attendancePct >= 80 ? "text-green-700" : "text-red-status"}`}>{member.attendance}</span>
              </div>
              <MiniBar pct={member.attendancePct} color={member.attendancePct >= 80 ? "var(--green-status)" : "var(--red-status)"} />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-text font-medium">Tasks</span>
                <span className="font-bold text-teal-dark">{member.tasksDone}/{member.tasksTotal}</span>
              </div>
              <MiniBar pct={(member.tasksDone / member.tasksTotal) * 100} color="var(--teal)" />
            </div>
          </div>
          <div className="bg-teal-soft/40 rounded-xl px-4 py-3 text-xs">
            <span className="text-muted-text font-semibold">Last activity: </span>
            <span className="text-foreground">{member.recentActivity}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-text">
            <span>📧 {member.email}</span>
            <span className="font-mono font-semibold text-teal-dark">{member.panata}</span>
          </div>
        </div>
        <div className="flex gap-2 px-5 py-4">
          <button
            onClick={() => { onClose(); onMessage(); }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition"
          >
            <Send className="w-4 h-4" /> Message
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal text-white text-sm font-bold hover:bg-teal-dark transition"
            style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.14)" }}
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageModal({ member, onClose }: { member: Member; onClose: () => void }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([
    { from: "them", text: "Hey! Just checking in about the video footage.", time: "10:24 AM" },
    { from: "me",   text: "I'll upload it tonight, almost done with the edit.", time: "10:31 AM" },
    { from: "them", text: "Perfect, thanks! 🎬", time: "10:33 AM" },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 20); return () => clearTimeout(t); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function send() {
    if (!msg.trim()) return;
    setMessages(prev => [...prev, { from: "me", text: msg.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setMsg("");
    setTimeout(() => {
      setMessages(prev => [...prev, { from: "them", text: "Got it, thanks for reaching out! 👍", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }, 1200);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50" style={{ width: 380 }}>
      <div
        className="bg-background border border-border rounded-2xl flex flex-col overflow-hidden"
        style={{
          height: 520,
          boxShadow: "0 16px 60px rgba(0,0,0,0.25)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-card">
          <AvatarSVG initials={member.initials} size={36} isOnLeave={member.status !== "Active"} className="rounded-full shrink-0" />
          <div className="flex-1">
            <div className="font-semibold text-sm">{member.name}</div>
            <div className="text-xs text-muted-text">{member.id} · {member.course}</div>
          </div>
          <button onClick={onClose} className="text-muted-text hover:text-foreground transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[75%]">
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.from === "me" ? "bg-teal text-white rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm border border-border"
                }`}>{m.text}</div>
                <div className={`text-[10px] text-muted-text mt-1 ${m.from === "me" ? "text-right" : "text-left"}`}>{m.time}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="px-4 py-3 border-t border-border bg-card flex items-center gap-2">
          <input
            value={msg}
            onChange={e => setMsg(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
            placeholder={`Message ${member.name.split(" ")[0]}…`}
            className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:ring-2 focus:ring-teal/30"
          />
          <button
            onClick={send}
            disabled={!msg.trim()}
            className="w-10 h-10 rounded-xl bg-teal text-white flex items-center justify-center hover:bg-teal-dark transition disabled:opacity-40 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FIXED: MemberCard — clean layout matching the screenshot reference ────────
function MemberCard({ member, onView, onMessage, onSubmissions }: { member: Member; onView: () => void; onMessage: () => void; onSubmissions: () => void }) {
  const isActive = member.status === "Active";
  const taskPct = Math.round((member.tasksDone / member.tasksTotal) * 100);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg group flex flex-col"
      style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      {/* ── Top tinted banner with avatar + status badge ── */}
      <div className="relative px-4 pt-4 pb-14" style={{ background: isActive ? "rgba(13,148,136,0.07)" : "rgba(245,158,11,0.08)" }}>
        <div className="flex items-start justify-between">
          <AvatarSVG initials={member.initials} size={52} isOnLeave={!isActive} className="rounded-2xl shadow-sm" />
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
            isActive ? "bg-green-500/10 text-green-700 border border-green-300" : "bg-amber-400/10 text-amber-600 border border-amber-300"
          }`}>{member.status}</span>
        </div>
      </div>

      {/* ── Floating info card overlapping the banner ── */}
      <div className="-mt-10 mx-3 mb-3 bg-card rounded-xl px-3 py-2.5 border border-border" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
        <div className="font-bold text-sm text-foreground leading-tight truncate">{member.name}</div>
        <div className="text-[10px] font-mono text-muted-text mt-0.5">{member.id}</div>
        <div className="flex items-center justify-between mt-1.5 gap-1">
          <span className="text-[11px] text-muted-text truncate">{member.course}</span>
          <span className="text-[11px] font-semibold text-foreground shrink-0">{member.year}</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-4 pb-4 flex flex-col gap-3 flex-1">
        {/* Task completion bar */}
        <div>
          <div className="flex justify-between items-center text-[11px] mb-1">
            <span className="text-muted-text font-medium">Task completion</span>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground">{member.tasksDone}/{member.tasksTotal}</span>
              <span
                className="font-bold px-1.5 py-0.5 rounded-md text-[10px]"
                style={{ background: isActive ? "var(--teal-soft)" : "#fef3c7", color: isActive ? "var(--teal-dark)" : "#92400e" }}
              >{taskPct}%</span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${taskPct}%`, background: isActive ? "var(--teal)" : "#f59e0b" }} />
          </div>
        </div>

        {/* Panata badge */}
        <div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-soft text-teal-dark border border-teal/20 font-mono">{member.panata}</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={onView}
            className="flex-1 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90"
            style={{ background: "var(--teal-dark)" }}
          >View Profile</button>
          <button
            onClick={onMessage}
            className="py-2 px-3 rounded-xl border border-border text-muted-text text-xs hover:bg-secondary transition flex items-center"
            title="Message"
          ><Send className="w-3 h-3" /></button>
          <button
            onClick={onSubmissions}
            className="py-2 px-3 rounded-xl border border-border text-muted-text text-xs hover:bg-secondary transition flex items-center"
            title="View Submissions"
          ><ClipboardList className="w-3 h-3" /></button>
        </div>
      </div>
    </div>
  );
}

// ─── File types, tasks, submissions modal (unchanged) ────────────────────────
type FileAttachment = { name: string; type: "pdf" | "sheet" | "doc" | "txt"; size: string; preview: string };
type MockTask = {
  id: number; title: string; due: string; submitted: boolean;
  submittedAt: string | null; grade: string | null; files: FileAttachment[];
};

const MOCK_TASKS: MockTask[] = [
  { id: 1, title: "Week 1 — Raw footage upload", due: "Aug 5", submitted: true, submittedAt: "Aug 4 · 11:42 PM", grade: "100%", files: [{ name: "footage_week1_final.pdf", type: "pdf", size: "4.2 MB", preview: "SHOT LOG — WEEK 1\nDate: August 4, 2024\nOperator: Natalie Portman\n\nClip 001 — EXT Gate Wide.mp4 ✓\nClip 002 — EXT Gate Medium.mp4 ✓" }, { name: "shot_notes.txt", type: "txt", size: "12 KB", preview: "Shot notes for week 1." }] },
  { id: 2, title: "Week 2 — Rough cut review", due: "Aug 12", submitted: true, submittedAt: "Aug 11 · 09:15 AM", grade: "92%", files: [{ name: "rough_cut_feedback.doc", type: "doc", size: "890 KB", preview: "ROUGH CUT REVIEW — WEEK 2\n\nOverall Impression: Solid structural instinct." }] },
  { id: 3, title: "Week 3 — Multimedia training output", due: "Aug 25", submitted: true, submittedAt: "Aug 24 · 11:58 PM", grade: "88%", files: [{ name: "training_output_w3.pdf", type: "pdf", size: "2.1 MB", preview: "MULTIMEDIA TRAINING OUTPUT — WEEK 3" }, { name: "color_grade_log.sheet", type: "sheet", size: "340 KB", preview: "COLOR GRADING LOG" }] },
  { id: 4, title: "Week 4 — Color grading pass", due: "Sep 2", submitted: false, submittedAt: null, grade: null, files: [] },
  { id: 5, title: "Week 5 — Audio sync & mix", due: "Sep 9", submitted: true, submittedAt: "Sep 8 · 03:22 PM", grade: "95%", files: [{ name: "audio_mix_report.doc", type: "doc", size: "520 KB", preview: "AUDIO SYNC & MIX REPORT — WEEK 5" }] },
  { id: 6, title: "Week 6 — Final video export", due: "Sep 16", submitted: false, submittedAt: null, grade: null, files: [] },
  { id: 7, title: "Week 7 — Documentation", due: "Sep 23", submitted: true, submittedAt: "Sep 22 · 10:10 AM", grade: "78%", files: [{ name: "project_documentation.doc", type: "doc", size: "1.4 MB", preview: "PROJECT DOCUMENTATION — WEEK 7" }] },
];

const FILE_CONFIG = {
  pdf:   { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", label: "PDF",   icon: "📄" },
  sheet: { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", label: "Sheet", icon: "📊" },
  doc:   { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", label: "DOC",   icon: "📝" },
  txt:   { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", label: "TXT",   icon: "📃" },
};

function FilePreviewModal({ file, onClose }: { file: FileAttachment; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 20); return () => clearTimeout(t); }, []);
  const cfg = FILE_CONFIG[file.type];
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="bg-background border border-border rounded-2xl w-full max-w-xl flex flex-col overflow-hidden"
        style={{ maxHeight: "80vh", boxShadow: "0 20px 70px rgba(0,0,0,0.3)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)", transition: "opacity 0.25s ease, transform 0.25s ease" }}>
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-card">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>{cfg.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-foreground truncate">{file.name}</div>
            <div className="text-[11px] text-muted-text mt-0.5 flex items-center gap-2">
              <span className="font-bold uppercase" style={{ color: cfg.color }}>{cfg.label}</span>
              <span>·</span><span>{file.size}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-text hover:text-foreground transition shrink-0"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5" style={{ background: "#f8f9fb" }}>
          <pre className="text-[12.5px] text-gray-700 leading-relaxed font-mono whitespace-pre-wrap">{file.preview}</pre>
        </div>
        <div className="px-5 py-3.5 border-t border-border bg-card flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm bg-teal text-white rounded-xl font-bold hover:bg-teal-dark transition">Close</button>
        </div>
      </div>
    </div>
  );
}

function SubmissionsModal({ member, onClose }: { member: Member; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileAttachment | null>(null);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 20); return () => clearTimeout(t); }, []);
  const pct = Math.round((member.tasksDone / member.tasksTotal) * 100);
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }} onClick={onClose}>
        <div onClick={e => e.stopPropagation()} className="bg-background border border-border rounded-2xl w-full max-w-lg overflow-hidden flex flex-col"
          style={{ maxHeight: "88vh", boxShadow: "0 16px 60px rgba(0,0,0,0.25)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)", transition: "opacity 0.3s ease, transform 0.3s ease" }}>
          <div className="bg-teal-dark px-6 py-5 flex items-center gap-4">
            <AvatarSVG initials={member.initials} size={44} isOnLeave={member.status !== "Active"} className="rounded-xl shadow" />
            <div className="flex-1 text-white">
              <div className="font-bold text-base leading-tight">{member.name}</div>
              <div className="text-xs text-white/60 mt-0.5 font-mono">{member.id}</div>
            </div>
            <div className="text-right text-white mr-2">
              <div className="text-2xl font-bold font-serif">{member.tasksDone}<span className="text-base font-normal text-white/60">/{member.tasksTotal}</span></div>
              <div className="text-[11px] text-white/60">tasks submitted</div>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white transition ml-1"><X className="w-5 h-5" /></button>
          </div>
          <div className="px-6 py-3 bg-teal-dark/10 border-b border-border">
            <div className="flex justify-between text-xs text-muted-text mb-1.5">
              <span>Overall completion</span><span className="font-bold text-teal-dark">{pct}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-border overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--teal)" }} />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {MOCK_TASKS.map((task, i) => {
              const done = i < member.tasksDone;
              return (
                <div key={task.id} className={`px-6 py-4 border-b border-border last:border-0 ${done ? "bg-card" : "bg-secondary/20"}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${done ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-red-50 text-red-400 border border-red-200"}`}>
                      {done ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground">{task.title}</div>
                      <div className="text-[11px] text-muted-text mt-0.5">
                        Due: {task.due}
                        {done && task.submittedAt && <span className="ml-2 text-emerald-600">· Submitted {task.submittedAt}</span>}
                        {!done && <span className="ml-2 text-red-400 font-semibold">· Not submitted</span>}
                      </div>
                    </div>
                    {done && task.grade && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-soft text-teal-dark border border-teal/20 shrink-0">{task.grade}</span>}
                  </div>
                  {done && task.files.length > 0 && (
                    <div className="mt-3 ml-11 flex flex-wrap gap-2">
                      {task.files.map(file => {
                        const cfg = FILE_CONFIG[file.type];
                        return (
                          <button key={file.name} onClick={() => setPreviewFile(file)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition hover:shadow-sm"
                            style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.color }}>
                            <span>{cfg.icon}</span><span className="max-w-[140px] truncate">{file.name}</span>
                            <span className="ml-1 text-[10px] underline opacity-70">View</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="px-6 py-4 border-t border-border bg-card flex justify-end gap-2">
            <button onClick={onClose} className="px-5 py-2 text-sm bg-teal text-white rounded-xl font-bold hover:bg-teal-dark transition">Close</button>
          </div>
        </div>
      </div>
      {previewFile && <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />}
    </>
  );
}

// ─── Roster ───────────────────────────────────────────────────────────────────
export function Roster() {
  const [search, setSearch]       = useState("");
  const [viewMode, setViewMode]   = useState<"list" | "grid">("grid");
  const [viewMember, setViewMember]   = useState<Member | null>(null);
  const [msgMember, setMsgMember]     = useState<Member | null>(null);
  const [subsMember, setSubsMember]   = useState<Member | null>(null);

  const filtered = roster.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.id.includes(search) ||
    r.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">Team Members</h1>
            <p className="text-sm text-muted-text mt-1">Video Team 104 — Roster</p>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-teal-soft text-teal border border-teal/20">Leader View</span>
        </div>
      </FadeUp>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Members", value: "55" },
          { label: "Active", value: "52" },
          { label: "On Leave", value: "3", accent: true },
          { label: "Avg Attendance", value: "89%" },
        ].map((s, i) => (
          <FadeUp key={s.label} delay={i * 60}><StatCard {...s} /></FadeUp>
        ))}
      </div>
      <FadeUp delay={260}>
        <SectionCard
          icon={Users}
          title="Member List"
          action={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-text" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members…"
                  className="pl-9 pr-3 py-2 text-sm border border-border rounded-xl bg-card w-52 focus:outline-none focus:ring-2 focus:ring-teal/30" />
              </div>
              <div className="flex border border-border rounded-xl overflow-hidden">
                <button onClick={() => setViewMode("list")} title="List view"
                  className={`px-3 py-2 text-xs transition flex items-center gap-1.5 font-semibold ${viewMode === "list" ? "bg-teal text-white" : "bg-card text-muted-text hover:bg-secondary"}`}>
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3" width="12" height="2" rx="1"/><rect x="2" y="7" width="12" height="2" rx="1"/><rect x="2" y="11" width="12" height="2" rx="1"/></svg>
                  List
                </button>
                <button onClick={() => setViewMode("grid")} title="Card view"
                  className={`px-3 py-2 text-xs transition flex items-center gap-1.5 font-semibold border-l border-border ${viewMode === "grid" ? "bg-teal text-white" : "bg-card text-muted-text hover:bg-secondary"}`}>
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></svg>
                  Cards
                </button>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-teal text-teal rounded-xl font-semibold hover:bg-teal hover:text-white transition">
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            </div>
          }
        >
          {viewMode === "list" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-teal-dark text-white text-xs uppercase tracking-wider">
                    {["","Name","Student ID","Course","Year","Attendance","Tasks","Status","Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id} className={`border-b border-border last:border-0 transition-colors ${i % 2 === 0 ? "bg-card" : "bg-secondary/20"} hover:bg-teal-soft/20`}>
                      <td className="px-4 py-3"><AvatarSVG initials={r.initials} size={32} isOnLeave={r.status !== "Active"} className="rounded-full" /></td>
                      <td className="px-4 py-3 font-semibold">{r.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-text">{r.id}</td>
                      <td className="px-4 py-3 text-sm">{r.course}</td>
                      <td className="px-4 py-3 text-sm">{r.year}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold ${r.attendancePct >= 80 ? "text-green-700" : "text-red-status"}`}>{r.attendance}</span>
                        <MiniBar pct={r.attendancePct} color={r.attendancePct >= 80 ? "var(--green-status)" : "var(--red-status)"} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-teal-dark">{r.tasksDone}/{r.tasksTotal}</span>
                        <MiniBar pct={(r.tasksDone / r.tasksTotal) * 100} />
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${r.status === "Active" ? "bg-green-500/10 text-green-700 border-green-300" : "bg-amber-400/10 text-amber-600 border-amber-300"}`}>{r.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button onClick={() => setViewMember(r)} className="px-2.5 py-1 rounded-lg border border-teal text-teal text-xs font-semibold hover:bg-teal hover:text-white transition">View</button>
                          <button onClick={() => setMsgMember(r)} className="px-2.5 py-1 rounded-lg border border-border text-muted-text text-xs font-semibold hover:bg-secondary transition flex items-center gap-1"><Send className="w-3 h-3" />Message</button>
                          <button onClick={() => setSubsMember(r)} className="px-2.5 py-1 rounded-lg border border-border text-muted-text text-xs font-semibold hover:bg-secondary transition flex items-center gap-1"><ClipboardList className="w-3 h-3" />{r.tasksDone}/{r.tasksTotal}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {viewMode === "grid" && (
            <div className="p-5 grid grid-cols-4 gap-4">
              {filtered.map(r => (
                <MemberCard key={r.id} member={r} onView={() => setViewMember(r)} onMessage={() => setMsgMember(r)} onSubmissions={() => setSubsMember(r)} />
              ))}
              {filtered.length === 0 && <div className="col-span-4 text-center text-muted-text py-16 text-sm">No members match your search.</div>}
            </div>
          )}
          <div className="flex justify-between items-center px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-text">Showing {filtered.length} of 55 members</span>
            <div className="flex gap-1">
              {["‹","1","2","3","›"].map(p => (
                <button key={p} className="w-7 h-7 rounded-lg border border-border bg-card text-xs hover:bg-secondary transition">{p}</button>
              ))}
            </div>
          </div>
        </SectionCard>
      </FadeUp>
      {viewMember && <ProfileModal member={viewMember} onClose={() => setViewMember(null)} onMessage={() => { setViewMember(null); setMsgMember(viewMember); }} />}
      {msgMember && <MessageModal member={msgMember} onClose={() => setMsgMember(null)} />}
      {subsMember && <SubmissionsModal member={subsMember} onClose={() => setSubsMember(null)} />}
    </div>
  );
}

// ─── FIXED: QR Generator — replaced QR Settings with date/date-range config ──
export function QRGenerator() {
  const [generated, setGenerated] = useState(true);
  const [event, setEvent] = useState("Video Team Practice (Nov 8)");
  const [singleScan, setSingleScan] = useState(true);
  const [timeLimited, setTimeLimited] = useState(true);
  const [attendanceType, setAttendanceType] = useState("Present");
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  // Date mode: "single" = one date/time, "range" = start+end
  const [dateMode, setDateMode] = useState<"single" | "range">("single");
  const [singleDate, setSingleDate] = useState("2023-11-08");
  const [singleTime, setSingleTime] = useState("15:00");
  const [rangeStart, setRangeStart] = useState("2023-11-08T15:00");
  const [rangeEnd, setRangeEnd]     = useState("2023-11-08T16:30");

  // Copy link state
  const [linkCopied, setLinkCopied] = useState(false);
  const placeholderLink = `https://stf-attend.neu.edu.ph/qr/${event.replace(/\s+/g,"_").toLowerCase().slice(0,20)}_${singleDate}`;

  useEffect(() => {
    if (!generated || !timeLimited) return;
    const interval = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(interval);
  }, [generated, timeLimited]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timerPct = (timeLeft / (30 * 60)) * 100;

  function handleCopyLink() {
    navigator.clipboard.writeText(placeholderLink).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  function handleReset() {
    setTimeLeft(30 * 60);
    setGenerated(false);
    setTimeout(() => setGenerated(true), 150);
  }

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">QR Code Generator</h1>
            <p className="text-sm text-muted-text mt-1">Generate time-limited QR codes for attendance</p>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-teal-soft text-teal border border-teal/20">Leader View</span>
        </div>
      </FadeUp>

      <div className="grid grid-cols-12 gap-5">
        {/* ── Left: Config ── */}
        <div className="col-span-7 space-y-4">
          {/* Step 1 */}
          <FadeUp delay={60}>
            <SectionCard icon={Calendar} title="Select Event">
              <div className="p-5 space-y-3">
                <select value={event} onChange={e => setEvent(e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-card focus:outline-none focus:ring-2 focus:ring-teal/30">
                  <option>Video Team Practice (Nov 8)</option>
                  <option>AEVM Multimedia Meeting (Aug 25)</option>
                  <option>Choir Orientation Batch 1 (Nov 2)</option>
                </select>
                <div className="flex items-start gap-3 bg-teal-soft rounded-xl p-4">
                  <div className="w-9 h-9 rounded-lg bg-teal/20 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-teal-dark" />
                  </div>
                  <div>
                    <div className="font-semibold text-teal-dark text-sm">Video Team Practice</div>
                    <div className="text-xs text-muted-text mt-1">Expected: 55 members</div>
                  </div>
                </div>
              </div>
            </SectionCard>
          </FadeUp>

          {/* Step 2 — Date & Time (replaces QR Settings) */}
          <FadeUp delay={100}>
            <SectionCard icon={CalendarCheck} title="Date & Time">
              <div className="p-5 space-y-4">
                {/* Single vs Range toggle */}
                <div className="flex rounded-xl overflow-hidden border border-border">
                  {(["single", "range"] as const).map(mode => (
                    <button key={mode} onClick={() => setDateMode(mode)}
                      className={`flex-1 py-2 text-xs font-bold transition capitalize ${
                        dateMode === mode ? "bg-teal text-white" : "bg-card text-muted-text hover:bg-secondary"
                      }`}>
                      {mode === "single" ? "Single Day" : "Date Range"}
                    </button>
                  ))}
                </div>

                {dateMode === "single" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-text block mb-1.5">Date</label>
                      <input type="date" value={singleDate} onChange={e => setSingleDate(e.target.value)}
                        className="w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-card focus:outline-none focus:ring-2 focus:ring-teal/30" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-text block mb-1.5">Time</label>
                      <input type="time" value={singleTime} onChange={e => setSingleTime(e.target.value)}
                        className="w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-card focus:outline-none focus:ring-2 focus:ring-teal/30" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-text block mb-1.5">Start</label>
                      <input type="datetime-local" value={rangeStart} onChange={e => setRangeStart(e.target.value)}
                        className="w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-card focus:outline-none focus:ring-2 focus:ring-teal/30" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-text block mb-1.5">End</label>
                      <input type="datetime-local" value={rangeEnd} onChange={e => setRangeEnd(e.target.value)}
                        className="w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-card focus:outline-none focus:ring-2 focus:ring-teal/30" />
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>
          </FadeUp>

          <FadeUp delay={160}>
            <button onClick={() => { setGenerated(true); setTimeLeft(30 * 60); }}
              className="w-full bg-teal text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-teal-dark transition flex items-center justify-center gap-2"
              style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.14)" }}>
              <QrCode className="w-5 h-5" /> Generate QR Code
            </button>
          </FadeUp>
        </div>

        {/* ── Right: QR Display ── */}
        <div className="col-span-5">
          <FadeUp delay={80}>
            <SectionCard icon={QrCode} title="Generated QR Code">
              <div className="p-5 flex flex-col items-center gap-4">
                {generated ? (
                  <>
                    <div className="relative">
                      <div className="w-52 h-52 bg-white border-2 border-teal/30 rounded-2xl grid place-items-center p-3 shadow-inner">
                        <div className="w-full h-full grid grid-cols-12 gap-px p-1">
                          {Array.from({ length: 144 }).map((_, i) => (
                            <div key={i} className={((i * 7 + i % 5) % 3) === 0 ? "bg-teal-dark" : "bg-white"} style={{ borderRadius: 1 }} />
                          ))}
                        </div>
                      </div>
                      {[{ top: 8, left: 8 }, { top: 8, right: 8 }, { bottom: 8, left: 8 }, { bottom: 8, right: 8 }].map((pos, i) => (
                        <div key={i} className="absolute w-7 h-7 pointer-events-none" style={{
                          ...pos,
                          borderTop: i < 2 ? "3px solid var(--teal)" : "none",
                          borderBottom: i >= 2 ? "3px solid var(--teal)" : "none",
                          borderLeft: (i === 0 || i === 2) ? "3px solid var(--teal)" : "none",
                          borderRight: (i === 1 || i === 3) ? "3px solid var(--teal)" : "none",
                          borderRadius: i === 0 ? "4px 0 0 0" : i === 1 ? "0 4px 0 0" : i === 2 ? "0 0 0 4px" : "0 0 4px 0",
                        }} />
                      ))}
                    </div>

                    <div className="text-center w-full">
                      <div className="font-bold text-teal-dark text-sm">{event.split("(")[0].trim()}</div>
                      <div className="text-xs text-muted-text mt-0.5">
                        {dateMode === "single"
                          ? `${singleDate} · ${singleTime}`
                          : `${rangeStart.replace("T"," ")} → ${rangeEnd.replace("T"," ")}`}
                        {" "}· Type: <span className="font-semibold text-teal-dark">{attendanceType}</span>
                      </div>
                    </div>

                    {timeLimited && (
                      <div className="w-full">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-muted-text font-medium">Time remaining</span>
                          <span className={`font-bold font-mono ${timeLeft < 300 ? "text-red-status" : "text-teal-dark"}`}>{String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}</span>
                        </div>
                        <div className="h-2 rounded-full bg-border overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${timerPct}%`, background: timeLeft < 300 ? "var(--red-status)" : "var(--teal)", transition: "width 1s linear, background 0.3s ease" }} />
                        </div>
                        {timeLeft === 0 && <div className="mt-2 text-xs text-red-status font-semibold text-center">⚠ QR code expired — regenerate to continue</div>}
                      </div>
                    )}

                    <div className="w-full bg-teal-soft rounded-xl px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-teal-dark font-medium">Scanned</span>
                        <span className="text-lg font-bold font-serif text-teal-dark">12 <span className="text-sm font-normal text-muted-text">/ 55</span></span>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-teal/20 overflow-hidden">
                        <div className="h-full rounded-full bg-teal" style={{ width: `${(12/55)*100}%` }} />
                      </div>
                    </div>

                    {/* FIXED action buttons */}
                    <div className="flex gap-2 w-full">
                      <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-teal text-teal text-xs font-semibold hover:bg-teal hover:text-white transition">
                        <Download className="w-3.5 h-3.5" /> PNG
                      </button>
                      <button
                        onClick={handleCopyLink}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
                          linkCopied ? "border-teal bg-teal text-white" : "border-border text-muted-text hover:bg-secondary"
                        }`}
                      >
                        {linkCopied ? <CheckCircle className="w-3.5 h-3.5" /> : <Link className="w-3.5 h-3.5" />}
                        {linkCopied ? "Copied!" : "Link"}
                      </button>
                      <button
                        onClick={handleReset}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border text-muted-text text-xs font-semibold hover:bg-secondary transition"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Reset
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-16 text-center text-muted-text text-sm">Configure settings and click <strong>Generate QR Code</strong></div>
                )}
              </div>
            </SectionCard>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}

// ─── Logger roster data ───────────────────────────────────────────────────────
const loggerRoster = [
  ["1","Natalie Portman","STF-2022-0101","Nursing","BS Nursing","CICS2","Present"],
  ["2","Alex Ammin","STF-2022-0102","Computer Studies","BS IT","CICS2","Present"],
  ["3","Ben Affleck","STF-2021-0088","Engineering","BS Civil Eng","CEA1","Late"],
  ["4","Maria Santos","STF-2023-0103","Communication","BA Communication","CAS2","Present"],
  ["5","Jose Reyes","STF-2023-0104","Arts and Sciences","BS Psychology","CAS3","Excused"],
  ["6","Ana Cruz","STF-2022-0105","Accountancy","BS Accountancy","COA1","Absent"],
  ["7","Diego Luna","STF-2022-0106","Criminology","BS Criminology","COC1","Present"],
  ["8","Rosa Gomez","STF-2023-0107","Midwifery","BS Midwifery","CMT1","Present"],
];

const statusColor: Record<string, string> = {
  Present: "bg-green-500/15 text-green-700 border border-green-300",
  Late:    "bg-amber-500/15 text-amber-600 border border-amber-300",
  Excused: "bg-slate-500/15 text-slate-600 border border-slate-300",
  Absent:  "bg-red-500/15 text-red-600 border border-red-300",
};

// ─── FIXED: AttendanceLogger — method buttons now control UI panels ───────────
export function AttendanceLogger() {
  const [saved, setSaved] = useState(false);
  const [method, setMethod] = useState<"qr" | "manual" | "csv">("manual");
  const [statuses, setStatuses] = useState<Record<number, string>>(
    Object.fromEntries(loggerRoster.map((r, i) => [i, r[6]]))
  );
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvDragOver, setCsvDragOver] = useState(false);

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">Attendance Logger</h1>
            <p className="text-sm text-muted-text mt-1">Record session attendance for your team</p>
          </div>
          <span className="chip bg-teal-soft text-teal text-sm px-3 py-1">Leader View</span>
        </div>
      </FadeUp>
      <div className="grid grid-cols-2 gap-5 mb-5">
        <FadeUp delay={60}>
          <SectionCard icon={Calendar} title="Session">
            <div className="p-5 space-y-3">
              <select className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-card focus:outline-none focus:ring-2 focus:ring-teal/30">
                <option>Video Team Practice</option><option>Panata Session</option><option>GE Attendance Check</option>
                <option>DGA Training</option><option>Choir Orientation</option><option>Komiti Meeting</option>
              </select>
              <div className="bg-teal-soft rounded-xl p-4">
                <div className="font-semibold text-teal-dark text-sm">Video Team Practice</div>
                <div className="text-xs text-muted-text mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Nov 8, 2023 · 3:00–4:30 PM · Main Studio · Expected: 55
                </div>
              </div>
            </div>
          </SectionCard>
        </FadeUp>
        <FadeUp delay={100}>
          <SectionCard icon={ScanLine} title="Attendance Method">
            <div className="p-5 space-y-2">
              {[
                { id: "qr"     as const, icon: QrCode,    label: "QR Code Scan",  desc: "Students scan a generated QR code" },
                { id: "manual" as const, icon: Pencil,    label: "Manual Entry",  desc: "Mark attendance manually below" },
                { id: "csv"    as const, icon: Upload,    label: "CSV Upload",    desc: "Upload a CSV attendance sheet" },
              ].map(({ id, icon: Icon, label, desc }) => (
                <label key={id}
                  onClick={() => setMethod(id)}
                  className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition ${
                    method === id ? "border-teal bg-teal-soft/40" : "border-border hover:bg-teal-soft/20"
                  }`}>
                  <input type="radio" name="att-method" checked={method === id} onChange={() => setMethod(id)} className="accent-teal" />
                  <Icon className="w-4 h-4 text-teal shrink-0" />
                  <div>
                    <div className="text-sm font-semibold">{label}</div>
                    <div className="text-[11px] text-muted-text">{desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </SectionCard>
        </FadeUp>
      </div>

      {/* ── QR method: show QR code preview ── */}
      {method === "qr" && (
        <FadeUp delay={120}>
          <SectionCard icon={QrCode} title="Step 3 — QR Code Attendance">
            <div className="p-8 flex flex-col items-center gap-5">
              <div className="w-52 h-52 bg-white border-2 border-teal/30 rounded-2xl grid place-items-center p-3 shadow-inner">
                <div className="w-full h-full grid grid-cols-12 gap-px p-1">
                  {Array.from({ length: 144 }).map((_, i) => (
                    <div key={i} className={((i * 7 + i % 5) % 3) === 0 ? "bg-teal-dark" : "bg-white"} style={{ borderRadius: 1 }} />
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-teal-dark text-sm">Video Team Practice</div>
                <div className="text-xs text-muted-text mt-0.5">Nov 8, 2023 · Scan to mark attendance</div>
              </div>
              <div className="w-full max-w-sm bg-teal-soft rounded-xl px-4 py-3 text-center">
                <span className="text-sm font-semibold text-teal-dark">12 / 55 scanned</span>
              </div>
              <p className="text-xs text-muted-text text-center max-w-xs">Share this QR code on screen. Students will scan it to mark themselves as present. Configure advanced settings in the QR Generator tab.</p>
            </div>
          </SectionCard>
        </FadeUp>
      )}

      {/* ── Manual method: show attendance table ── */}
      {method === "manual" && (
        <FadeUp delay={160}>
          <SectionCard icon={ClipboardList} title="Step 3 — Mark Attendance">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-teal-dark text-white text-xs uppercase tracking-wider">
                    {["#","Student Name","Student ID","Department","Course","Group","Status","Notes"].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loggerRoster.map((r, i) => (
                    <tr key={i} className={`border-b border-border last:border-0 transition-colors ${i % 2 === 0 ? "bg-card" : "bg-secondary/20"} hover:bg-teal-soft/20`}>
                      <td className="px-4 py-3 font-mono text-xs text-muted-text">{r[0]}</td>
                      <td className="px-4 py-3 font-semibold">{r[1]}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-text">{r[2]}</td>
                      <td className="px-4 py-3 text-xs text-muted-text">{r[3]}</td>
                      <td className="px-4 py-3 text-xs">{r[4]}</td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-soft text-teal-dark border border-teal/20 font-mono">{r[5]}</span>
                      </td>
                      <td className="px-4 py-3">
                        <select value={statuses[i]} onChange={e => setStatuses(prev => ({ ...prev, [i]: e.target.value }))}
                          className={`px-2.5 py-1 border rounded-lg text-xs bg-card focus:outline-none focus:ring-2 focus:ring-teal/30 font-semibold ${statusColor[statuses[i]] ?? ""}`}>
                          <option>Present</option><option>Late</option><option>Excused</option><option>Absent</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input placeholder="Add note…" className="px-3 py-1.5 border border-border rounded-xl text-xs bg-card w-36 focus:outline-none focus:ring-2 focus:ring-teal/30" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-border items-center">
              {saved && (
                <span className="flex items-center gap-1.5 text-sm font-semibold text-green-700 bg-green-500/10 border border-green-300 px-3 py-1.5 rounded-lg">
                  <CheckCircle className="w-4 h-4" /> Attendance saved
                </span>
              )}
              <button className="px-4 py-2 text-sm border border-teal text-teal rounded-xl font-semibold hover:bg-teal hover:text-white transition">Export Log</button>
              <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
                className="flex items-center gap-2 px-5 py-2 text-sm bg-teal text-white rounded-xl font-bold hover:bg-teal-dark transition"
                style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.14)" }}>
                <Save className="w-4 h-4" /> Save Attendance
              </button>
            </div>
          </SectionCard>
        </FadeUp>
      )}

      {/* ── CSV method: show upload UI (no table) ── */}
      {method === "csv" && (
        <FadeUp delay={120}>
          <SectionCard icon={Upload} title="Step 3 — Upload CSV">
            <div className="p-8 flex flex-col items-center gap-5">
              <div
                onDragOver={e => { e.preventDefault(); setCsvDragOver(true); }}
                onDragLeave={() => setCsvDragOver(false)}
                onDrop={e => { e.preventDefault(); setCsvDragOver(false); const f = e.dataTransfer.files[0]; if (f) setCsvFile(f); }}
                className={`w-full max-w-lg border-2 border-dashed rounded-2xl px-8 py-12 flex flex-col items-center gap-3 cursor-pointer transition-all ${
                  csvDragOver ? "border-teal bg-teal-soft/40" : "border-border hover:border-teal/50 hover:bg-teal-soft/10"
                }`}
                onClick={() => document.getElementById("csv-input")?.click()}
              >
                <div className="w-14 h-14 rounded-2xl bg-teal-soft flex items-center justify-center">
                  <FileText className="w-7 h-7 text-teal-dark" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-foreground text-sm">Drop your CSV here</div>
                  <div className="text-xs text-muted-text mt-1">or click to browse — .csv files only</div>
                </div>
                {csvFile ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-teal-soft rounded-xl border border-teal/30">
                    <FileText className="w-4 h-4 text-teal-dark" />
                    <span className="text-sm font-semibold text-teal-dark">{csvFile.name}</span>
                    <button onClick={e => { e.stopPropagation(); setCsvFile(null); }} className="text-muted-text hover:text-foreground ml-1"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ) : (
                  <span className="text-[11px] text-muted-text">Max 10 MB · UTF-8 encoded</span>
                )}
              </div>
              <input id="csv-input" type="file" accept=".csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setCsvFile(f); }} />

              {/* Template hint */}
              <div className="w-full max-w-lg bg-secondary/60 rounded-xl px-4 py-3 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                <div className="text-xs text-muted-text">
                  CSV must include columns: <code className="font-mono bg-card px-1 py-0.5 rounded text-foreground">student_id, name, status</code>.
                  {" "}<button className="text-teal font-semibold hover:underline">Download template</button>
                </div>
              </div>

              {csvFile && (
                <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm bg-teal text-white rounded-xl font-bold hover:bg-teal-dark transition"
                  style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.14)" }}>
                  <Upload className="w-4 h-4" /> Import & Save
                </button>
              )}
              {saved && (
                <span className="flex items-center gap-1.5 text-sm font-semibold text-green-700 bg-green-500/10 border border-green-300 px-3 py-1.5 rounded-lg">
                  <CheckCircle className="w-4 h-4" /> Attendance imported
                </span>
              )}
            </div>
          </SectionCard>
        </FadeUp>
      )}
    </div>
  );
}

// ─── Team Attendance (unchanged session records + logger with fixed method) ───
const sessions = [
  ["Video Team Practice - DGA Studio","Team","Aug 14, 2025","1–3 PM",50,3,2,0,91],
  ["Choir Orientation - Batch 1","Team","Aug 18, 2025","1–2 PM",112,5,2,1,93],
  ["AEVM Task - Multimedia Meeting","Task","Aug 25, 2025","3–4 PM",90,340,10,10,20],
  ["Engineering Gear - Team Sync","Team","Sep 1, 2025","11–12 PM",28,1,1,0,93],
  ["Komiti - Panata CICS2","Panata","Sep 3, 2025","4–4:30 PM",14,1,0,0,93],
];

const SESSION_FILTERS = ["ALL SESSIONS","MAJOR SUBJECTS","GE CLASSES","PANATA","STF PRACTICES","EVENTS"];

export function TeamAttendance() {
  const [mainTab, setMainTab] = useState<"records" | "logger">("records");
  const [tab, setTab] = useState("ALL SESSIONS");
  const [expanded, setExpanded] = useState<number | null>(null);
  const pct = 89;
  const r = 36; const circ = 2 * Math.PI * r;
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 200); return () => clearTimeout(t); }, []);

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">Team Attendance</h1>
            <p className="text-sm text-muted-text mt-1">Video Team 104 — Session Records</p>
          </div>
          <span className="chip bg-teal-soft text-teal text-sm px-3 py-1">Leader View</span>
        </div>
      </FadeUp>
      <FadeUp delay={40}>
        <div className="flex gap-0 border-b border-border mb-6">
          {([["records","Session Records"],["logger","Attendance Logger"]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setMainTab(key)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-all ${
                mainTab === key ? "border-teal-dark text-teal-dark" : "border-transparent text-foreground/50 hover:text-teal-dark hover:border-teal/40"
              }`}>{label}</button>
          ))}
        </div>
      </FadeUp>

      {mainTab === "records" && (<>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <FadeUp delay={60}>
            <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
              <div className="relative w-20 h-20 shrink-0">
                <svg viewBox="0 0 100 100" className="-rotate-90 w-20 h-20">
                  <circle cx="50" cy="50" r={r} stroke="var(--muted)" strokeWidth="14" fill="none" />
                  <circle cx="50" cy="50" r={r} stroke="var(--green-status)" strokeWidth="14" fill="none" strokeLinecap="round"
                    style={{ strokeDasharray: go ? `${(pct / 100) * circ} ${circ}` : `0 ${circ}`, strokeDashoffset: -circ * 0.25, transition: "stroke-dasharray 0.75s linear" }} />
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <span className="font-serif font-bold text-teal-dark text-lg">{pct}%</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-text">Overall Attendance</div>
                <div className="font-serif text-2xl font-bold text-teal-dark">{pct}%</div>
                <div className="text-xs text-muted-text mt-0.5">24 sessions</div>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={100}><StatCard label="Sessions Tracked" value="24" sub="All time" /></FadeUp>
          <FadeUp delay={140}><StatCard label="Members with Issues" value="3 ⚠" accent sub="Below 60% threshold" /></FadeUp>
        </div>
        <FadeUp delay={180}>
          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
            {SESSION_FILTERS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition ${tab === t ? "bg-teal text-white" : "bg-card border border-border hover:bg-secondary"}`}
              >{t}</button>
            ))}
          </div>
        </FadeUp>
        <FadeUp delay={220}>
          <SectionCard icon={ClipboardList} title="Session Log">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-teal-dark text-white uppercase tracking-wider">
                    {["Session Name","Type","Date","Time","Present","Absent","Late","Excused","Rate %"].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s, i) => (
                    <Fragment key={i}>
                      <tr onClick={() => setExpanded(expanded === i ? null : i)}
                        className={`border-b border-border cursor-pointer transition-colors ${
                          (s[8] as number) < 50 ? "bg-red-status/10 hover:bg-red-status/15" : i % 2 === 0 ? "bg-card hover:bg-teal-soft/20" : "bg-secondary/20 hover:bg-teal-soft/20"
                        }`}>
                        {s.map((c, j) => (
                          <td key={j} className={`px-4 py-3 ${j === 8 ? `font-bold ${(s[8] as number) < 50 ? "text-red-status" : "text-green-700"}` : ""}`}>
                            {j === 1
                              ? <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-soft text-teal-dark border border-teal/20">{c}</span>
                              : j === 8 ? `${c}%` : c}
                          </td>
                        ))}
                      </tr>
                      {expanded === i && (
                        <tr><td colSpan={9} className="p-4 bg-teal-soft/20">
                          <div className="text-xs font-bold mb-3 text-teal-dark uppercase tracking-wider">Student-level breakdown</div>
                          <table className="w-full text-xs">
                            <thead><tr className="border-b border-border"><th className="text-left py-1.5 font-semibold">Name</th><th className="text-left font-semibold">ID</th><th className="text-center font-semibold">Status</th></tr></thead>
                            <tbody>
                              {loggerRoster.slice(0, 5).map((r, k) => (
                                <tr key={k} className="border-b border-border/40">
                                  <td className="py-2">{r[1]}</td>
                                  <td className="font-mono text-muted-text">{r[2]}</td>
                                  <td className="text-center py-2"><span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusColor[r[6]] ?? ""}`}>{r[6]}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td></tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </FadeUp>
      </>)}

      {mainTab === "logger" && <AttendanceLogger />}
    </div>
  );
}

// ─── Heatmap data ─────────────────────────────────────────────────────────────
const HEATMAP_HOURS = ["8 AM","9 AM","10 AM","11 AM","12 PM","1 PM","2 PM","3 PM","4 PM","5 PM","6 PM","7 PM","8 PM"];
const HEATMAP_DAYS  = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const INITIALS_MAP: Record<string, Member> = Object.fromEntries(roster.map(m => [m.initials, m]));

function getAvailableInitialsForCell(dayIdx: number, hourIdx: number): string[] {
  const seed = (dayIdx * 7 + hourIdx * 3) % 100;
  let pct: number;
  if (hourIdx < 2) pct = 15;
  else if (hourIdx >= 10) pct = 35;
  else if (dayIdx === 2 && hourIdx >= 4 && hourIdx <= 6) pct = 90;
  else if (dayIdx === 3 && hourIdx >= 4 && hourIdx <= 7) pct = 88;
  else if (seed < 20) pct = 22;
  else if (seed < 45) pct = 50;
  else if (seed < 70) pct = 72;
  else pct = 85;
  const count = Math.max(1, Math.round((pct / 100) * roster.length));
  const shifted = [...roster.slice((dayIdx + hourIdx) % roster.length), ...roster.slice(0, (dayIdx + hourIdx) % roster.length)];
  return shifted.slice(0, count).map(m => m.initials);
}

function heatCell(d: number, h: number) {
  const seed = (d * 7 + h * 3) % 100;
  if (h < 2)                        return { pct: 15 };
  if (h >= 10)                      return { pct: 35 };
  if (d === 2 && h >= 4 && h <= 6) return { pct: 90 };
  if (d === 3 && h >= 4 && h <= 7) return { pct: 88 };
  if (seed < 20)                    return { pct: 22 };
  if (seed < 45)                    return { pct: 50 };
  if (seed < 70)                    return { pct: 72 };
  return                             { pct: 85 };
}

// FIXED: color derived from pct, consistent with legend
function heatCellColor(pct: number): string {
  if (pct < 20)  return "rgba(148,163,184,0.20)";     // slate — 0-20%
  if (pct < 40)  return "rgba(100,116,139,0.30)";     // slate-blue — 20-40%
  if (pct < 60)  return "rgba(234,179,8,0.55)";       // gold — 40-60%
  if (pct < 80)  return "rgba(13,148,136,0.50)";      // teal-light — 60-80%
  return         "rgba(15,78,70,0.85)";               // teal-dark — 80-100%
}

// ─── FIXED HeatmapView: detail panel uses same MemberCard, z-index fixed via
//     absolute→relative approach (detail replaces heatmap, not overlaid) ─────
export function HeatmapView({ scope = "Video Team 104", banner }: { scope?: string; banner?: string }) {
  const [selected, setSelected] = useState<{ dayIdx: number; hourIdx: number } | null>(null);
  const [viewMember, setViewMember] = useState<Member | null>(null);
  const [msgMember, setMsgMember]   = useState<Member | null>(null);

  if (selected !== null) {
    const { dayIdx, hourIdx } = selected;
    const day = HEATMAP_DAYS[dayIdx];
    const hour = HEATMAP_HOURS[hourIdx];
    const availableInitials = getAvailableInitialsForCell(dayIdx, hourIdx);
    const unavailableInitials = roster.filter(m => !availableInitials.includes(m.initials)).map(m => m.initials);
    const cell = heatCell(dayIdx, hourIdx);

    return (
      <div className="p-7">
        <FadeUp>
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setSelected(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition">
              <ChevronLeft className="w-4 h-4" /> Back to Heatmap
            </button>
            <div>
              <h1 className="font-serif text-3xl font-bold text-teal-dark">{day} · {hour}</h1>
              <p className="text-sm text-muted-text mt-0.5">{scope} — Member Availability</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-teal-soft border border-teal/20 text-sm font-bold text-teal-dark">
                {availableInitials.length} / {roster.length} available
              </div>
              <span className="text-sm font-bold px-3 py-1.5 rounded-xl text-white"
                style={{ background: cell.pct >= 80 ? "var(--teal-dark)" : cell.pct >= 50 ? "var(--teal)" : cell.pct >= 30 ? "#d97706" : "#ef4444" }}>
                {cell.pct}% availability
              </span>
            </div>
          </div>
        </FadeUp>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Available", value: availableInitials.length, color: "text-green-700" },
            { label: "Unavailable", value: unavailableInitials.length, color: "text-red-status" },
            { label: "Availability Rate", value: `${cell.pct}%`, color: "text-teal-dark" },
          ].map(({ label, value, color }, i) => (
            <FadeUp key={label} delay={i * 60}>
              <div className="bg-card border border-border rounded-xl px-4 py-3.5">
                <div className="text-xs text-muted-text font-medium">{label}</div>
                <div className={`font-serif text-2xl font-bold mt-0.5 ${color}`}>{value}</div>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* ── Available: using the SAME MemberCard as Team Members ── */}
        <FadeUp delay={180}>
          <SectionCard icon={CheckCircle} title={`Available (${availableInitials.length})`}>
            <div className="p-5 grid grid-cols-4 gap-4">
              {availableInitials.map(initials => {
                const member = INITIALS_MAP[initials];
                if (!member) return null;
                return (
                  <MemberCard key={initials} member={member}
                    onView={() => setViewMember(member)}
                    onMessage={() => setMsgMember(member)}
                    onSubmissions={() => {}} />
                );
              })}
            </div>
          </SectionCard>
        </FadeUp>

        {unavailableInitials.length > 0 && (
          <FadeUp delay={260}>
            <div className="mt-5">
              <SectionCard icon={AlertCircle} title={`Unavailable (${unavailableInitials.length})`}>
                <div className="p-5 grid grid-cols-4 gap-4">
                  {unavailableInitials.map(initials => {
                    const member = INITIALS_MAP[initials];
                    if (!member) return null;
                    return (
                      <div key={initials} className="opacity-60 grayscale">
                        <MemberCard member={member}
                          onView={() => setViewMember(member)}
                          onMessage={() => setMsgMember(member)}
                          onSubmissions={() => {}} />
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            </div>
          </FadeUp>
        )}
        {viewMember && <ProfileModal member={viewMember} onClose={() => setViewMember(null)} onMessage={() => { setViewMember(null); setMsgMember(viewMember); }} />}
        {msgMember && <MessageModal member={msgMember} onClose={() => setMsgMember(null)} />}
      </div>
    );
  }

  // ── HEATMAP GRID (fixed: tooltip z-index handled properly via overflow-visible) ──
  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">Availability Heatmap</h1>
            <p className="text-sm text-muted-text mt-1">{scope} — Click any cell to see member availability</p>
          </div>
          <div className="flex items-center gap-2">
            {["All Departments","All Courses","All Panata Groups","All STF Teams"].map(opt => (
              <select key={opt} className="text-xs border border-border rounded-xl px-3 py-2 bg-card focus:outline-none focus:ring-2 focus:ring-teal/30">
                <option>{opt}</option>
              </select>
            ))}
          </div>
        </div>
      </FadeUp>

      {banner && (
        <FadeUp delay={40}>
          <div className="bg-amber-status/10 border border-amber-status/40 rounded-xl p-3 text-xs font-medium text-foreground mb-5">⚠ {banner}</div>
        </FadeUp>
      )}

      <div className="grid grid-cols-12 gap-5">
        <FadeUp delay={80} className="col-span-9">
          <SectionCard icon={Thermometer} title="Weekly Availability Grid — click a cell to view members">
            <div className="p-4" style={{ overflow: "visible" }}>
              <div className="grid" style={{ gridTemplateColumns: "56px repeat(7, 1fr)" }}>
                <div />
                {HEATMAP_DAYS.map(d => (
                  <div key={d} className="text-center text-xs font-bold text-teal-dark py-2 uppercase tracking-wider">{d}</div>
                ))}
                {HEATMAP_HOURS.map((h, hi) => (
                  <Fragment key={"row" + hi}>
                    <div className="text-xs text-muted-text py-2 font-mono flex items-center">{h}</div>
                    {HEATMAP_DAYS.map((_, di) => {
                      const c = heatCell(di, hi);
                      const availCount = getAvailableInitialsForCell(di, hi).length;
                      const cellBg = heatCellColor(c.pct);
                      return (
                        <div key={`${di}-${hi}`} style={{ position: "relative" }} className="group">
                          <div
                            onClick={() => setSelected({ dayIdx: di, hourIdx: hi })}
                            className="h-8 m-0.5 rounded-lg cursor-pointer transition-all hover:scale-105 hover:ring-2 hover:ring-teal/50"
                            style={{ background: cellBg }}
                            title={`${HEATMAP_DAYS[di]}, ${h}: ${c.pct}% available`}
                          />
                          {/* Tooltip: positioned absolutely, z-50, above surrounding content */}
                          <div
                            className="hidden group-hover:block pointer-events-none"
                            style={{ position: "absolute", zIndex: 50, top: "calc(100% + 4px)", left: "50%", transform: "translateX(-50%)" }}
                          >
                            <div className="bg-teal-dark text-white text-[10px] p-2 rounded-xl whitespace-nowrap shadow-lg">
                              <div className="font-bold mb-1">{HEATMAP_DAYS[di]}, {h} — {c.pct}% available</div>
                              <div className="flex gap-0.5 flex-wrap max-w-[120px]">
                                {getAvailableInitialsForCell(di, hi).slice(0, 5).map(x => (
                                  <span key={x} className="w-4 h-4 rounded-full bg-gold grid place-items-center text-[7px] font-bold text-teal-dark">{x.slice(0,2)}</span>
                                ))}
                                {availCount > 5 && <span className="text-[9px] text-white/70 ml-1">+{availCount - 5}</span>}
                              </div>
                              <div className="text-white/60 mt-1 text-[9px]">Click to view all</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </Fragment>
                ))}
              </div>

              {/* FIXED: color legend with actual descriptive labels matching pct bands */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-xs flex-wrap">
                <span className="text-muted-text font-semibold">Members available:</span>
                {[
                  { bg: "rgba(148,163,184,0.20)", border: "1px solid var(--border)", label: "0–20%" },
                  { bg: "rgba(100,116,139,0.30)", border: "none",                   label: "20–40%" },
                  { bg: "rgba(234,179,8,0.55)",   border: "none",                   label: "40–60%" },
                  { bg: "rgba(13,148,136,0.50)",  border: "none",                   label: "60–80%" },
                  { bg: "rgba(15,78,70,0.85)",    border: "none",                   label: "80–100%" },
                ].map(({ bg, border, label }) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded inline-block" style={{ background: bg, border }} />
                    {label}
                  </span>
                ))}
                <span className="ml-auto text-muted-text italic">Click any cell to see who's available</span>
              </div>
            </div>
          </SectionCard>
        </FadeUp>

        <div className="col-span-3 space-y-4">
          <FadeUp delay={100}>
            <SectionCard icon={CheckCircle} title="Most Available">
              <ul className="px-5 py-3 space-y-2.5">
                {[["Wed 2 PM","90%"],["Thu 1 PM","88%"],["Fri 3 PM","82%"]].map(([slot, pct]) => (
                  <li key={slot} className="flex justify-between items-center text-sm border-b border-border last:border-0 pb-2.5 last:pb-0">
                    <button className="text-muted-text hover:text-teal-dark transition text-left"
                      onClick={() => {
                        const dMap: Record<string, number> = { Mon:0, Tue:1, Wed:2, Thu:3, Fri:4, Sat:5, Sun:6 };
                        const hMap: Record<string, number> = { "8 AM":0, "9 AM":1, "10 AM":2, "11 AM":3, "12 PM":4, "1 PM":5, "2 PM":6, "3 PM":7, "4 PM":8, "5 PM":9, "6 PM":10, "7 PM":11, "8 PM":12 };
                        const parts = slot.split(" ");
                        const d = parts[0]; const hh = parts.slice(1).join(" ");
                        setSelected({ dayIdx: dMap[d] ?? 0, hourIdx: hMap[hh] ?? 0 });
                      }}>{slot}</button>
                    <strong className="text-green-700">{pct}</strong>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </FadeUp>
          <FadeUp delay={140}>
            <SectionCard icon={AlertCircle} title="Least Available">
              <ul className="px-5 py-3 space-y-2.5">
                {[["Mon 8 AM","15%"],["Tue 9 AM","22%"],["Sat 6 PM","18%"]].map(([slot, pct]) => (
                  <li key={slot} className="flex justify-between items-center text-sm border-b border-border last:border-0 pb-2.5 last:pb-0">
                    <span className="text-muted-text">{slot}</span>
                    <strong className="text-red-status">{pct}</strong>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}

// ─── Template Library: FIXED to match Action Center tab style from screenshots ─
type Tmpl = { name: string; uses: number; lastUsed: string; createdBy?: string; scope?: string; type: string };

const ACTION_CENTER_TEMPLATES: Tmpl[] = [
  { name: "Weekly Panata Reminder",   type: "Announcement", uses: 12, lastUsed: "Nov 22, 2025", createdBy: "Kuya J. Ramirez", scope: "Video Team" },
  { name: "STF Training Reschedule",  type: "Announcement", uses: 8,  lastUsed: "Nov 18, 2025", createdBy: "Ate M. Sandoval",  scope: "Video Team" },
  { name: "GE Section Make-up Class", type: "Announcement", uses: 6,  lastUsed: "Nov 10, 2025", createdBy: "Prof. C. Velasco", scope: "GE Sec A" },
  { name: "Reflection Paper Submission", type: "Task",      uses: 4,  lastUsed: "Nov 22, 2025", createdBy: "Kuya J. Ramirez", scope: "Video Team" },
  { name: "Poster Brief — Event",     type: "Task",          uses: 3,  lastUsed: "Nov 19, 2025", createdBy: "Ate M. Sandoval",  scope: "Video Team" },
  { name: "Recap Reel Assignment",    type: "Task",          uses: 3,  lastUsed: "Nov 15, 2025", createdBy: "Kuya R. Lim",     scope: "Video Team" },
  { name: "Event Feedback — Concert", type: "Survey",        uses: 5,  lastUsed: "Nov 23, 2025", createdBy: "STF Operations",  scope: "Org-wide" },
  { name: "Team Availability Check",  type: "Survey",        uses: 7,  lastUsed: "Nov 20, 2025", createdBy: "Ate M. Sandoval",  scope: "Video Team" },
  { name: "GE Class Sentiment Pulse", type: "Survey",        uses: 3,  lastUsed: "Nov 08, 2025", createdBy: "Prof. C. Velasco", scope: "GE Sec A" },
];

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Announcement: { bg: "rgba(239,68,68,0.08)",    text: "#dc2626",  border: "rgba(239,68,68,0.25)" },
  Task:         { bg: "rgba(13,148,136,0.10)",   text: "#0f766e",  border: "rgba(13,148,136,0.25)" },
  Survey:       { bg: "rgba(234,179,8,0.12)",    text: "#a16207",  border: "rgba(234,179,8,0.35)" },
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  Announcement: Megaphone,
  Task:         CheckSquare,
  Survey:       BarChart2,
};

const TEMPLATE_TAB_FILTERS = ["All", "Announcement", "Task", "Survey"];

export function TemplateLibrary({ global = false }: { global?: boolean }) {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = ACTION_CENTER_TEMPLATES.filter(t => {
    const matchTab = activeTab === "All" || t.type === activeTab;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.createdBy?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">
              {global ? "Global Template Library" : "Template Library"}
            </h1>
            <p className="text-sm text-muted-text mt-1">Reusable templates for announcements, tasks &amp; surveys</p>
          </div>
          <div className="flex items-center gap-2">
            {global && (
              <select className="text-sm border border-border rounded-xl px-3 py-2 bg-card focus:outline-none focus:ring-2 focus:ring-teal/30">
                <option>All Scopes</option><option>All Teams</option><option>All Sections</option>
              </select>
            )}
            <button className="flex items-center gap-2 bg-teal text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-teal-dark transition"
              style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.14)" }}>
              <Plus className="w-4 h-4" /> New Template
            </button>
          </div>
        </div>
      </FadeUp>

      {/* Scope notice — mirrors Action Center banner */}
      <FadeUp delay={40}>
        <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl px-4 py-2.5 text-xs font-medium text-foreground mb-5 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          As Student Leader, you can only target your assigned group: <strong className="text-teal-dark ml-1">Video Team / CICS2 / GE Sec A</strong>
        </div>
      </FadeUp>

      {/* Action Center-style tabs (underline) + search */}
      <FadeUp delay={80}>
        <div className="flex items-center justify-between border-b border-border mb-5">
          <div className="flex">
            {TEMPLATE_TAB_FILTERS.map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-all ${
                  activeTab === t ? "border-teal-dark text-teal-dark" : "border-transparent text-foreground/50 hover:text-teal-dark hover:border-teal/40"
                }`}>{t}</button>
            ))}
          </div>
          <div className="relative mb-1">
            <Search className="w-4 h-4 absolute left-3 top-2 text-muted-text" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates…"
              className="pl-9 pr-3 py-1.5 text-xs border border-border rounded-xl bg-card w-44 focus:outline-none focus:ring-2 focus:ring-teal/30" />
          </div>
        </div>
      </FadeUp>

      {/* Reusable hint */}
      <FadeUp delay={100}>
        <div className="bg-secondary/60 rounded-xl px-4 py-2.5 text-xs text-muted-text mb-5">
          Reusable templates for announcements, tasks, surveys, and events. Load into any tab above with one click.
        </div>
      </FadeUp>

      {/* Table — matching Action Center screenshot layout */}
      <FadeUp delay={140}>
        <SectionCard icon={BookOpen} title="Templates">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-teal-dark text-white text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 text-left font-semibold w-[40%]">Template</th>
                  <th className="px-5 py-3 text-left font-semibold">Type</th>
                  <th className="px-5 py-3 text-left font-semibold">Creator</th>
                  <th className="px-5 py-3 text-left font-semibold">Last Used</th>
                  <th className="px-5 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => {
                  const tc = TYPE_COLORS[t.type];
                  const TypeIcon = TYPE_ICONS[t.type];
                  return (
                    <tr key={t.name} className={`border-b border-border last:border-0 transition-colors ${i % 2 === 0 ? "bg-card" : "bg-secondary/20"} hover:bg-teal-soft/20`}>
                      <td className="px-5 py-3.5 font-semibold text-foreground">{t.name}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
                          style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}>
                          <TypeIcon className="w-3 h-3" />
                          {t.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-muted-text">{t.createdBy}</td>
                      <td className="px-5 py-3.5 text-sm text-muted-text">{t.lastUsed}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1.5">
                          <button className="px-3 py-1 rounded-lg bg-teal text-white text-xs font-semibold hover:bg-teal-dark transition">Load</button>
                          <button className="px-3 py-1 rounded-lg border border-border text-muted-text text-xs font-semibold hover:bg-secondary transition flex items-center gap-1">
                            <Edit3 className="w-3 h-3" /> Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-text text-sm">No templates match your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </FadeUp>
    </div>
  );
}

// ─── My Profile (placeholder) ─────────────────────────────────────────────────
export function MyProfile() {
  const me: Member = {
    initials: "JN", name: "John Patrick Narvasa", id: "STF-2022-0001",
    course: "BS Information Technology", year: "Junior", attendance: "94%",
    tasks: "92%", status: "Active", dept: "CICS", panata: "CICS2",
    email: "john.narvasa@neu.edu.ph",
    bio: "Video Team Leader. Manages scheduling, task distribution, and member welfare for Video Team 104.",
    tasksDone: 23, tasksTotal: 25, attendancePct: 94,
    recentActivity: "Sent weekly Panata reminder to all members",
  };

  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState(me.bio);

  return (
    <div className="p-7">
      <FadeUp>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-teal-dark">My Profile</h1>
            <p className="text-sm text-muted-text mt-1">Your personal STF member profile</p>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-teal-soft text-teal border border-teal/20">Leader View</span>
        </div>
      </FadeUp>

      <div className="grid grid-cols-12 gap-5">
        {/* Left profile card */}
        <FadeUp delay={60} className="col-span-4">
          <div className="bg-card border border-border rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <div className="bg-teal-dark px-6 pt-6 pb-12">
              <div className="flex items-start justify-between">
                <AvatarSVG initials={me.initials} size={64} className="rounded-2xl shadow-lg" />
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-400/30">Active</span>
              </div>
              <div className="text-white mt-3">
                <div className="font-serif text-xl font-bold">{me.name}</div>
                <div className="text-xs text-white/60 font-mono mt-0.5">{me.id}</div>
                <div className="text-xs text-white/50 mt-1">Video Team Leader</div>
              </div>
            </div>
            <div className="-mt-5 mx-4 bg-card rounded-xl px-4 py-3 border border-border mb-4" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Course", value: me.course },
                  { label: "Year", value: me.year },
                  { label: "Dept", value: me.dept },
                  { label: "Panata", value: me.panata },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-[10px] text-muted-text font-semibold uppercase tracking-wider">{label}</div>
                    <div className="text-xs font-bold text-foreground mt-0.5 leading-tight">{value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-4 pb-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-text">Attendance</span>
                  <span className="font-bold text-green-700">{me.attendance}</span>
                </div>
                <MiniBar pct={me.attendancePct} color="var(--green-status)" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-text">Task Completion</span>
                  <span className="font-bold text-teal-dark">{me.tasksDone}/{me.tasksTotal}</span>
                </div>
                <MiniBar pct={(me.tasksDone / me.tasksTotal) * 100} color="var(--teal)" />
              </div>
              <div className="text-xs text-muted-text pt-1">📧 {me.email}</div>
            </div>
          </div>
        </FadeUp>

        {/* Right details */}
        <div className="col-span-8 space-y-4">
          <FadeUp delay={80}>
            <SectionCard icon={Pencil} title="About Me"
              action={
                <button onClick={() => setEditMode(v => !v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    editMode ? "bg-teal text-white" : "border border-border text-muted-text hover:bg-secondary"
                  }`}>
                  {editMode ? <><Save className="w-3.5 h-3.5" /> Save</> : <><Pencil className="w-3.5 h-3.5" /> Edit</>}
                </button>
              }
            >
              <div className="p-5">
                {editMode ? (
                  <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4}
                    className="w-full px-4 py-3 border border-teal/40 rounded-xl text-sm bg-card focus:outline-none focus:ring-2 focus:ring-teal/30 resize-none" />
                ) : (
                  <p className="text-sm text-foreground leading-relaxed">{bio}</p>
                )}
              </div>
            </SectionCard>
          </FadeUp>

          <FadeUp delay={120}>
            <SectionCard icon={ClipboardList} title="Recent Activity">
              <div className="divide-y divide-border">
                {[
                  { action: "Sent weekly Panata reminder", time: "2 hours ago",  icon: Send },
                  { action: "Assigned Choir Concert task to 55 members", time: "Yesterday", icon: CheckSquare },
                  { action: "Generated QR code for Video Team Practice", time: "Nov 7", icon: QrCode },
                  { action: "Updated heatmap availability schedule", time: "Nov 5", icon: Calendar },
                ].map(({ action, time, icon: Icon }, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-7 h-7 rounded-lg bg-teal-soft flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-teal-dark" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-foreground truncate">{action}</div>
                    </div>
                    <span className="text-xs text-muted-text shrink-0">{time}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </FadeUp>

          <FadeUp delay={160}>
            <SectionCard icon={Users} title="My Team">
              <div className="p-5">
                <div className="flex items-center gap-3 p-4 bg-teal-soft/40 rounded-xl border border-teal/20">
                  <div className="w-10 h-10 rounded-xl bg-teal flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-teal-dark text-sm">Video Team 104</div>
                    <div className="text-xs text-muted-text mt-0.5">55 members · CICS2 · GE Sec A</div>
                  </div>
                  <span className="ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal text-white">Leader</span>
                </div>
              </div>
            </SectionCard>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}

// ─── Dispatcher Modal (unchanged) ─────────────────────────────────────────────
export function Dispatcher({ scopeLocked = true, scopeLabel = "Video Team 104" }: { scopeLocked?: boolean; scopeLabel?: string }) {
  const { modal, setModal } = usePortal();
  const [tab, setTab] = useState<"ann" | "task" | "survey">("task");
  if (modal !== "dispatcher") return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-6" onClick={() => setModal(null)}>
      <div onClick={e => e.stopPropagation()} className="bg-background w-full max-w-5xl rounded-2xl border border-border overflow-hidden max-h-[92vh] flex flex-col"
        style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.22)" }}>
        <div className="px-6 py-4 border-b border-border bg-teal-dark text-white flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold tracking-wider flex items-center gap-2">
            <Send className="w-5 h-5 opacity-80" /> Unified Dispatcher
          </h3>
          <button onClick={() => setModal(null)} className="hover:bg-white/10 rounded-lg p-1.5 transition"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex gap-0 border-b border-border bg-card px-6">
          {[{ id: "ann" as const, label: "📢 Announcement" }, { id: "task" as const, label: "✅ Task" }, { id: "survey" as const, label: "📋 Survey" }].map(({ id, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-all ${
                tab === id ? "border-teal-dark text-teal-dark" : "border-transparent text-foreground/50 hover:text-teal-dark hover:border-teal/40"
              }`}>{label}</button>
          ))}
        </div>
        {scopeLocked && (
          <div className="bg-amber-status/10 border-b border-amber-status/30 text-xs px-6 py-2.5 text-foreground font-medium flex items-center gap-2">
            🔒 As Student Leader, you can only target your assigned group: <strong className="text-teal-dark">{scopeLabel}</strong>
          </div>
        )}
        <div className="grid grid-cols-12 gap-5 p-6 overflow-y-auto flex-1">
          <div className="col-span-4 space-y-3">
            <div className="text-xs font-bold text-muted-text uppercase tracking-wider">Target Scope</div>
            <div className="bg-card border border-border rounded-xl p-3 text-sm space-y-2">
              <label className="flex items-center gap-2 font-semibold">
                <input type="checkbox" defaultChecked className="accent-teal" /> {scopeLabel} (55)
              </label>
              <div className="pl-5 space-y-1.5 text-xs">
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="accent-teal" /> All Members</label>
                {["Natalie Portman","Alex Ammin","Ben Affleck","Maria Santos","Jose Reyes"].map(n => (
                  <label key={n} className="flex items-center gap-2"><input type="checkbox" className="accent-teal" /> {n}</label>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-8 space-y-3">
            {tab === "task" && <>
              <input className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-card focus:outline-none focus:ring-2 focus:ring-teal/30" defaultValue="Submit Choir Concert Batch" />
              <textarea className="w-full p-4 border border-border rounded-xl text-sm bg-card focus:outline-none" rows={4} defaultValue="Upload your raw BTS footage (min. 30s, max 5min) to the shared drive." />
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs font-semibold text-muted-text block mb-1">Due Date</label><input type="datetime-local" defaultValue="2026-06-15T23:59" className="w-full px-3 py-2 border border-border rounded-xl text-sm bg-card focus:outline-none" /></div>
                <div><label className="text-xs font-semibold text-muted-text block mb-1">Priority</label><select className="w-full px-3 py-2 border border-border rounded-xl text-sm bg-card focus:outline-none"><option>Normal</option><option>High</option><option>Low</option></select></div>
                <div><label className="text-xs font-semibold text-muted-text block mb-1">Graded?</label><div className="flex items-center gap-2 px-3 py-2"><input type="checkbox" defaultChecked className="accent-teal" /><span className="text-sm">Graded</span><input defaultValue="100" className="w-16 px-2 py-1 border border-border rounded-lg text-sm bg-card" /></div></div>
              </div>
            </>}
            {tab === "ann" && <>
              <input className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-card focus:outline-none" defaultValue="Reminder: Pulong Panata" />
              <textarea className="w-full p-4 border border-border rounded-xl text-sm bg-card focus:outline-none" rows={5} defaultValue="Magandang araw mga kapatid! Please be reminded that this week's Pulong Panata has been scheduled." />
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-muted-text block mb-1">Effectivity Start</label><input type="date" defaultValue="2026-06-08" className="w-full px-3 py-2 border border-border rounded-xl text-sm bg-card focus:outline-none" /></div>
                <div><label className="text-xs font-semibold text-muted-text block mb-1">Effectivity End</label><input type="date" defaultValue="2026-06-30" className="w-full px-3 py-2 border border-border rounded-xl text-sm bg-card focus:outline-none" /></div>
              </div>
            </>}
            {tab === "survey" && <>
              <input className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-card focus:outline-none" defaultValue="Choir Concert Batch 3 — Dry Run Poll" />
              <textarea className="w-full p-4 border border-border rounded-xl text-sm bg-card focus:outline-none" rows={2} defaultValue="Quick poll to confirm member availability for Dec 28 dry run." />
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between px-4 py-2.5 border border-border rounded-xl bg-card">
                  <span>Q1. Are you available for Choir Concert dry run on Dec 28?</span>
                  <span className="text-xs text-muted-text">Multiple Choice</span>
                </div>
                <div className="flex items-center justify-between px-4 py-2.5 border border-border rounded-xl bg-card">
                  <span>Q2. Which equipment can you bring?</span>
                  <span className="text-xs text-muted-text">Selectable Options</span>
                </div>
                <div className="flex items-center justify-between px-4 py-2.5 border border-border rounded-xl bg-card">
                  <span>Q3. Any conflicts to flag?</span>
                  <span className="text-xs text-muted-text">Text Area</span>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-teal text-teal text-sm font-semibold hover:bg-teal hover:text-white transition">
                <Plus className="w-4 h-4" /> Add Question
              </button>
            </>}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border bg-card flex justify-between gap-2">
          <button className="px-4 py-2 text-sm border border-border rounded-xl font-semibold hover:bg-secondary transition flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> Load Template</button>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm border border-border rounded-xl font-semibold hover:bg-secondary transition">Preview</button>
            <button className="px-4 py-2 text-sm border border-amber-status/60 text-teal-dark bg-amber-status/10 rounded-xl font-semibold hover:bg-amber-status/20 transition">Save as Template</button>
            <button onClick={() => setModal(null)} className="px-5 py-2 text-sm bg-teal text-white rounded-xl font-bold hover:bg-teal-dark transition" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.14)" }}>
              {tab === "ann" ? "Send Announcement" : tab === "task" ? "Send / Assign" : "Send Survey"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}