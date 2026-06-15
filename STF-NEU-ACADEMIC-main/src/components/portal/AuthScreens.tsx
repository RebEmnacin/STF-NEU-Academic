import { useState } from "react";
import { usePortal } from "./PortalContext";
import { Sun, FileText, Upload, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

const departments = ["CICS", "COE", "COA", "COB", "COED", "CON", "CAS"];
const courses = ["BSCS", "BSIT", "BSIS", "BSCE", "BSEE", "BSA", "BSBA", "BSEd", "BSN"];
const yearLevels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const panataGroups = ["CICS1", "CICS2", "CICS3", "CICS4", "CICS5", "COE1", "COE2", "COA1", "COB1"];

function AuthShell({ children, title, sub }: { children: React.ReactNode; title: string; sub: string }) {
  const { setView } = usePortal();
  return (
    <div className="min-h-[calc(100vh-7rem)] bg-gradient-to-br from-teal-soft/30 via-background to-gold-soft/20 py-10 px-6">
      <div className="max-w-xl mx-auto">
        <button onClick={() => setView("home")} className="text-xs text-teal-dark font-semibold flex items-center gap-1 mb-4 hover:underline">
          <ArrowLeft className="w-3 h-3" /> Back to STF Chronicles
        </button>
        <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden card-soft">
          <div className="bg-gradient-to-br from-teal-dark to-teal text-white p-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-md bg-card/15 grid place-items-center mb-2 border border-white/30">
              <Sun className="w-8 h-8 text-gold" strokeWidth={2.5} />
            </div>
            <h1 className="font-serif text-2xl font-bold">{title}</h1>
            <p className="text-xs text-white/75 mt-1">{sub}</p>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function LoginPage() {
  const { setRole, setView } = usePortal();
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  const validate = (e: string) => /^[a-z0-9._%+-]+@neu\.edu\.ph$/i.test(e.trim());

  const submit = (mockRole: "student" | "leader" | "admin" | "superadmin") => {
    if (!validate(email)) {
      setErr("Login restricted to @neu.edu.ph institutional email only.");
      return;
    }
    setRole(mockRole);
  };

  return (
    <AuthShell title="Member Login" sub="OAuth · @neu.edu.ph only">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-teal-dark uppercase tracking-wider">Institutional Email</label>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setErr(""); }}
            placeholder="firstname.lastname@neu.edu.ph"
            className="mt-1 w-full px-3 py-2.5 text-sm border border-border rounded-md bg-secondary focus:bg-card focus:outline-none focus:ring-2 focus:ring-teal/30"
          />
          {err && (
            <div className="mt-2 flex items-start gap-1.5 text-xs text-red-status font-medium">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> {err}
            </div>
          )}
          <p className="mt-2 text-[11px] text-muted-text">Non-NEU emails will be rejected. OAuth via Google SSO.</p>
        </div>

        <button
          onClick={() => submit("student")}
          className="w-full bg-card border-2 border-border hover:border-teal text-foreground px-4 py-2.5 rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition"
        >
          <span className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 via-red-500 to-yellow-400" /> Continue with Google
        </button>

        <div className="border-t border-border pt-4">
          <p className="text-[10px] font-bold tracking-widest text-muted-text mb-2">PROTOTYPE — DEMO AS:</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["student", "Regular Student"],
              ["leader", "Student Leader"],
              ["admin", "Admin"],
              ["superadmin", "Super Admin"],
            ].map(([r, l]) => (
              <button
                key={r}
                onClick={() => submit(r as any)}
                className="bg-teal-soft hover:bg-teal text-teal-dark hover:text-white text-xs font-semibold px-3 py-2 rounded transition"
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center text-xs text-muted-text">
          New member?{" "}
          <button onClick={() => setView("signup")} className="text-teal-dark font-bold hover:underline">
            Sign up here →
          </button>
        </div>
      </div>
    </AuthShell>
  );
}

export function SignUpPage() {
  const { setRole, setView } = usePortal();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "", fullName: "", studentId: "", dept: "CICS", course: "BSCS",
    year: "2nd Year", panata: "CICS2", isMD: false, mdFile: null as File | null,
  });
  const [err, setErr] = useState("");
  const deadlineMet = true; // mock: semester ongoing

  const next = () => {
    if (step === 1) {
      if (!/^[a-z0-9._%+-]+@neu\.edu\.ph$/i.test(form.email.trim())) {
        setErr("Must be a @neu.edu.ph institutional email.");
        return;
      }
      setErr(""); setStep(2);
    } else if (step === 2) {
      if (!form.fullName || !form.studentId) { setErr("Fill all fields."); return; }
      setErr(""); setStep(3);
    } else if (step === 3) {
      if (form.isMD && !form.mdFile) { setErr("Upload MD certification PDF."); return; }
      setStep(4);
    }
  };

  if (!deadlineMet) {
    return (
      <AuthShell title="Survey Closed" sub="Submission deadline passed">
        <div className="text-center py-6">
          <AlertCircle className="w-12 h-12 text-amber-status mx-auto mb-3" />
          <p className="text-sm text-foreground/80 mb-2">The sign-up survey is only available <strong>while a semester is ongoing</strong>.</p>
          <p className="text-xs text-muted-text">Next window opens <strong>Aug 5, 2026</strong> (Sem 1).</p>
        </div>
      </AuthShell>
    );
  }

  if (step === 4) {
    return (
      <AuthShell title="Account Created" sub="Welcome to STF-NEU AEVM">
        <div className="text-center py-4">
          <CheckCircle2 className="w-14 h-14 text-green-status mx-auto mb-3" />
          <p className="text-sm text-foreground/80 mb-1">Survey submitted for <strong>Sem 1 · 2026–2027</strong>.</p>
          <p className="text-xs text-muted-text mb-5">You will re-fill this survey at the start of every semester. If skipped, your account moves to <strong>On Hold</strong> until you re-submit — your progress, history, and org records are retained.</p>
          <button onClick={() => setRole("student")} className="bg-gold text-teal-dark px-6 py-2.5 rounded-md font-bold text-sm hover:brightness-105">
            Enter Portal →
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Member Sign Up" sub={`Step ${step} of 3 · Semestral Survey`}>
      <div className="flex gap-1 mb-5">
        {[1, 2, 3].map(s => (
          <div key={s} className={`h-1.5 flex-1 rounded ${s <= step ? "bg-gold" : "bg-border"}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-teal-dark">Institutional Email</h3>
          <input type="email" value={form.email}
            onChange={e => { setForm({ ...form, email: e.target.value }); setErr(""); }}
            placeholder="firstname.lastname@neu.edu.ph"
            className="w-full px-3 py-2.5 text-sm border border-border rounded-md" />
          <p className="text-[11px] text-muted-text">OAuth authentication only. Restricted to <strong>@neu.edu.ph</strong>.</p>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-teal-dark">General Information Survey</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <label className="col-span-2">Full Name
              <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm" />
            </label>
            <label>Student ID
              <input value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })}
                placeholder="2023-01234" className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm" />
            </label>
            <label>Department
              <select value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm">
                {departments.map(d => <option key={d}>{d}</option>)}
              </select>
            </label>
            <label>Course
              <select value={form.course} onChange={e => setForm({ ...form, course: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm">
                {courses.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>Year Level
              <select value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm">
                {yearLevels.map(y => <option key={y}>{y}</option>)}
              </select>
            </label>
            <label className="col-span-2">Panata Group
              <select value={form.panata} onChange={e => setForm({ ...form, panata: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm">
                {panataGroups.map(p => <option key={p}>{p}</option>)}
              </select>
            </label>
          </div>
          <p className="text-[11px] text-muted-text bg-secondary p-2 rounded">📅 Deadline: <strong>Aug 31, 2026</strong>. Re-required every semester.</p>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-teal-dark">MD Certification (Optional)</h3>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isMD}
              onChange={e => setForm({ ...form, isMD: e.target.checked, mdFile: e.target.checked ? form.mdFile : null })} />
            I am a <strong>Minister's Dependent</strong> (requires PDF upload)
          </label>
          {form.isMD && (
            <label className="block border-2 border-dashed border-border rounded-md p-5 text-center cursor-pointer hover:border-teal hover:bg-teal-soft/30 transition">
              <input type="file" accept="application/pdf" className="hidden"
                onChange={e => setForm({ ...form, mdFile: e.target.files?.[0] ?? null })} />
              <Upload className="w-7 h-7 text-teal-dark mx-auto mb-2" />
              <div className="text-xs text-foreground/80">
                {form.mdFile ? (
                  <span className="flex items-center justify-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {form.mdFile.name}</span>
                ) : "Click to upload MD certification (PDF only)"}
              </div>
            </label>
          )}
          {!form.isMD && (
            <p className="text-[11px] text-muted-text">Skip this step if you are not an MD. You can upload later from Profile.</p>
          )}
        </div>
      )}

      {err && <div className="mt-3 flex items-start gap-1.5 text-xs text-red-status font-medium"><AlertCircle className="w-3.5 h-3.5 mt-0.5" /> {err}</div>}

      <div className="flex gap-2 mt-5">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-secondary">Back</button>
        )}
        <button onClick={next} className="flex-1 bg-teal text-white px-4 py-2 text-sm font-semibold rounded-md hover:bg-teal-dark">
          {step === 3 ? "Submit Survey" : "Continue"}
        </button>
      </div>

      <div className="text-center text-xs text-muted-text mt-4 pt-4 border-t border-border">
        Already a member?{" "}
        <button onClick={() => setView("login")} className="text-teal-dark font-bold hover:underline">Log in →</button>
      </div>
    </AuthShell>
  );
}
