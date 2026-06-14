
// TO CHANGE/ TO DO
// - Make the MyProfile of LeaderScreens.tsx and AdminProfile of AdminScreens.tsx look like the ProfileView of the StudentScreens.tsx but with different data, metrics, tabs because of their respective roles

// Methods to be changed: MyProfile(), AdminProfile()
// Methods for referencing: ProfileView()

export function MyProfile() {
  const me: Member = {
    initials: "JN", name: "John Patrick Narvasa", id: "STF-2022-0001",
    course: "BS Information Technology", year: "Junior",
    attendance: "94%", tasks: "92%", status: "Active",
    dept: "CICS", panata: "CICS2",
    email: "john.narvasa@neu.edu.ph",
    bio: "Video Team Leader. Manages scheduling, task distribution, and member welfare for Video Team 104.",
    tasksDone: 23, tasksTotal: 25, attendancePct: 94,
    recentActivity: "Sent weekly Panata reminder to all members",
  };

  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState(me.bio);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

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

        <div className="col-span-8 space-y-4">
          <FadeUp delay={80}>
            <SectionCard icon={Pencil} title="About Me"
              action={
                <div className="flex items-center gap-2">
                  {saved && <span className="flex items-center gap-1 text-xs font-semibold text-green-700"><CheckCircle className="w-3.5 h-3.5" /> Saved</span>}
                  <button onClick={() => editMode ? handleSave() : setEditMode(true)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${editMode ? "bg-teal text-white" : "border border-border text-muted-text hover:bg-secondary"}`}>
                    {editMode ? <><Save className="w-3.5 h-3.5" /> Save</> : <><Pencil className="w-3.5 h-3.5" /> Edit</>}
                  </button>
                </div>
              }>
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
                  { action: "Sent weekly Panata reminder to all members", time: "2 hours ago", icon: Send },
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


export function ProfileView() {
  const { role } = usePortal();
  const [profileTab, setProfileTab] = useState<"overview"|"academic"|"membership"|"preferences"|"responsibilities">("overview");
  const [editMode, setEditMode] = useState(false);
  const [telegramHandle, setTelegramHandle] = useState("@reb_emnacin");
  const [tempTelegram, setTempTelegram] = useState(telegramHandle);
  const [saved, setSaved] = useState(false);
  const [prefNote, setPrefNote] = useState("Open to switching to DGA full-time if needed for upcoming animation projects.");
  const [respSort, setRespSort] = useState<"All" | "Team" | "Panata" | "GE">("All");
  const [openMaster, setOpenMaster] = useState<ResponsibilityCard | null>(null);

  const responsibilityData = role === "leader" || role === "ge-monitor" || role === "panata-monitor" || role === "admin" || role === "superadmin"
    ? LEADER_RESPONSIBILITIES
    : STUDENT_RESPONSIBILITIES;
  const filteredResp = respSort === "All" ? responsibilityData : responsibilityData.filter(r => r.scope === respSort);

  const handleSave = () => {
    setTelegramHandle(tempTelegram);
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const profileTabs = [
    { id:"overview" as const,         label:"Overview",         Icon: UserCircle },
    { id:"academic" as const,         label:"Academic",         Icon: BookOpen },
    { id:"membership" as const,       label:"Academic History",       Icon: Star },
    { id:"preferences" as const,      label:"STF-Team Preferences",      Icon: Activity },
    { id:"responsibilities" as const, label:"Responsibilities", Icon: Shield },
  ];

  // SVG icons for stat cards (no emojis)
  const StatIcons = {
    Attendance: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/80"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M9 16l2 2 4-4"/></svg>,
    TasksDone:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/80"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    ActiveDays: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/80"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
    YearLevel:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/80"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  };

  const statCards = [
    { label:"Attendance",  value:"87%", sub:"this semester",  color:"from-teal to-teal-light",             IconComp: StatIcons.Attendance },
    { label:"Tasks Done",  value:"72%", sub:"of all tasks",   color:"from-teal-light to-[#5A8FA8]",        IconComp: StatIcons.TasksDone  },
    { label:"Active Days", value:"7",   sub:"days per week",  color:"from-[#4A7A8A] to-[#3D6B7A]",        IconComp: StatIcons.ActiveDays },
    { label:"Year Level",  value:"3rd", sub:"BS Comp. Sci.",  color:"from-slate-blue to-[#3D5466]",        IconComp: StatIcons.YearLevel  },
  ];

  // SVG icons for overview info cards
  const InfoIcons = {
    Team:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-teal shrink-0"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    Panata:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-teal shrink-0"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Major:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-teal shrink-0"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    GE:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-teal shrink-0"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    Calendar:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-teal shrink-0"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    Telegram:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-teal shrink-0"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  };

  return (
    <div className="p-0 pb-7">
      <FadeUp>
        {/* ── Hero Banner — taller so avatar doesn't cover text ── */}
        <div className="relative overflow-hidden mb-0"
          style={{height:160, background:"linear-gradient(135deg, #0D4A6B 0%, #1B6B8F 50%, #4A8FA8 80%, #5A8FA8 100%)"}}>
          {/* Decorative circles */}
          <div style={{position:"absolute",top:-30,right:-30,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
          <div style={{position:"absolute",bottom:-40,left:"30%",width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
          <div style={{position:"absolute",top:10,left:"60%",width:60,height:60,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
          {/* Banner text anchored to top-left so avatar doesn't overlap */}
          <div className="absolute top-5 left-7">
            <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Student Profile</div>
            <div className="text-white font-serif font-bold text-2xl">REB EMNACIN</div>
          </div>
          <div className="absolute top-5 right-7 flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white/90 border border-white/30"
              style={{background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)"}}>
              Currently Enrolled
            </span>
          </div>
        </div>
      </FadeUp>

      <div className="px-7">
        {/* ── Profile card + stat strip ── */}
        <FadeUp delay={60}>
          <div className="flex gap-5 items-start -mt-8 mb-6">
            {/* Avatar floats over banner — SVG UserCircle icon, no initials */}
            <div className="shrink-0 relative">
              <div className="w-24 h-24 rounded-2xl border-4 border-background shadow-2xl grid place-items-center overflow-hidden"
                style={{background:"linear-gradient(135deg, #1B6B8F, #4A8FA8)"}}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
                  <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.9)"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="rgba(255,255,255,0.9)"/>
                </svg>
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-background block flex items-center justify-center">
                <svg viewBox="0 0 10 10" className="w-2.5 h-2.5"><circle cx="5" cy="5" r="3" fill="white"/></svg>
              </span>
            </div>

            {/* Name + meta */}
            <div className="pt-10 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="font-serif font-bold text-teal-dark text-2xl leading-tight">Reb Emnacin</h1>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-sm text-muted-text">3rd Year · BSCS · CICS</span>
                    <span className="text-muted-text/40">·</span>
                    <span className="text-sm font-mono text-muted-text">24-10374-486</span>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal/10 text-teal border border-teal/20">Video Team</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gold/15 text-yellow-700 border border-gold/30">CICS1 Panata</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-blue/10 text-slate-blue border border-slate-blue/20">Prayer Leader</span>
                  </div>
                </div>
                <button
                  onClick={() => setEditMode(e => !e)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all mt-1"
                  style={editMode
                    ? {background:"var(--teal-dark)", color:"#fff", borderColor:"var(--teal-dark)"}
                    : {borderColor:"var(--border)", color:"var(--muted-text)"}}
                >
                  <Pencil className="w-3.5 h-3.5"/> {editMode ? "Editing…" : "Edit Profile"}
                </button>
              </div>
            </div>
          </div>

          {/* Stat strip — SVG icons, no emojis */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {statCards.map((s, i) => (
              <FadeUp key={s.label} delay={i * 50}>
                <div className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white shadow-md`}
                  style={{boxShadow:"0 4px 14px rgba(0,0,0,0.12)"}}>
                  <div className="mb-1.5"><s.IconComp/></div>
                  <div className="font-serif font-bold text-3xl leading-none">{s.value}</div>
                  <div className="text-white/80 text-xs font-semibold mt-1 uppercase tracking-wide">{s.label}</div>
                  <div className="text-white/60 text-[10px] mt-0.5">{s.sub}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </FadeUp>

        {/* ── Tabbed Panel ── */}
        <FadeUp delay={120}>
          <div className="bg-card border border-border rounded-2xl overflow-hidden" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.08)"}}>
            {/* Pill-style tab bar */}
            <div className="flex gap-1 p-2 border-b border-border bg-secondary/20 overflow-x-auto">
              {profileTabs.map(t => (
                <button key={t.id} onClick={() => setProfileTab(t.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
                  style={profileTab === t.id
                    ? {background:"var(--teal-dark)", color:"#fff", boxShadow:"0 2px 8px rgba(13,74,107,0.3)"}
                    : {color:"var(--muted-text)", background:"transparent"}
                  }>
                  <t.Icon className="w-3.5 h-3.5"/>{t.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {profileTab === "overview" && (
                <div className="flex gap-5 items-start">
                  {/* Left: info cards + radar */}
                  <div className="flex-1 min-w-0">
                    {/* Quick info grid — SVG icons, no emojis */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {[
                        {label:"STF Team",            value:"Video Team 104 (DGA Multimedia)",               IconC: InfoIcons.Team     },
                        {label:"Panata Group",         value:"CICS2 — Prayer Leader",                        IconC: InfoIcons.Panata   },
                        {label:"Major Subjects",       value:"OOP · MS Lab · Networking · Adv. Statistics",  IconC: InfoIcons.Major    },
                        {label:"GE Subjects",          value:"Art Appreciation · Sosyedad at Lit · PE4 · DAA",IconC: InfoIcons.GE       },
                        {label:"Active Schedule Days", value:"Mon · Tue · Wed · Thu · Fri · Sat · Sun",      IconC: InfoIcons.Calendar },
                        {label:"Telegram",      value: editMode ? undefined : telegramHandle,          IconC: InfoIcons.Telegram, edit: editMode },
                      ].map(({label, value, IconC, edit}) => (
                        <div key={label} className="bg-secondary/30 hover:bg-secondary/50 rounded-xl p-4 transition-colors border border-border/30">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <IconC/>
                            <div className="text-xs text-muted-text font-semibold uppercase tracking-wide">{label}</div>
                          </div>
                          {edit
                            ? <div className="flex gap-2">
                                <input value={tempTelegram} onChange={e => setTempTelegram(e.target.value)}
                                  className="flex-1 text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:ring-2 focus:ring-teal/30 outline-none font-mono"/>
                                <button onClick={handleSave}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition"
                                  style={{background: saved ? "var(--green-status)" : "var(--teal-dark)"}}>
                                  {saved ? <CheckCircle className="w-4 h-4"/> : "Save"}
                                </button>
                              </div>
                            : <div className="font-semibold text-sm text-foreground">{value}</div>
                          }
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Radar / Spider chart — animates outward from centre */}
                  <div className="shrink-0 w-96">
                    <div className="rounded-2xl border border-border p-6 bg-secondary/10">
                      <div className="text-xs font-bold text-muted-text uppercase tracking-widest mb-1">Performance Overview</div>
                      <p className="text-[11px] text-muted-text mb-4">This semester at a glance</p>
                      <RadarChart/>
                    </div>
                  </div>
                </div>
              )}

              {/* Academic Subjects Tab — linked to schedule data */}
              {profileTab === "academic" && (
                <div className="overflow-x-auto">
                  <p className="text-xs text-muted-text mb-3 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5"/> Schedule linked — data synced from your Comprehensive Schedule.
                  </p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-teal-dark text-white text-xs uppercase tracking-wider">
                        {["Course Code","Subject","Type","Schedule","Venue","Professor","Status"].map(h => (
                          <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {code:"IT312",  subject:"OOP Lab",                    type:"Major", schedule:"THU 10:00–13:00", venue:"M102",     professor:"Prof. Reyes",      status:"Enrolled"},
                        {code:"IT312L", subject:"OOP Lecture",                type:"Major", schedule:"WED 19:00–21:00", venue:"M411 A",   professor:"Prof. Reyes",      status:"Enrolled"},
                        {code:"IT321",  subject:"Networking Concepts Lab",    type:"Major", schedule:"SAT 07:00–10:00", venue:"M106",     professor:"Prof. Santos",     status:"Enrolled"},
                        {code:"MATH31", subject:"Advanced Statistics",        type:"Major", schedule:"THU 07:00–10:00", venue:"M413 B",   professor:"Prof. Garcia",     status:"Enrolled"},
                        {code:"IT331",  subject:"MS Lab",                     type:"Major", schedule:"MON 10:00–13:00", venue:"M415 A",   professor:"Prof. Cruz",       status:"Enrolled"},
                        {code:"GE101",  subject:"Art Appreciation",           type:"GE",    schedule:"TUE 11:30–13:00", venue:"M414 B",   professor:"Prof. De Leon",    status:"Enrolled"},
                        {code:"GE102",  subject:"Sosyedad at Literatura",     type:"GE",    schedule:"THU 13:30–15:00", venue:"IS 233 B", professor:"Prof. Villanueva", status:"Enrolled"},
                        {code:"PE4",    subject:"PE4",                        type:"GE",    schedule:"FRI 15:00–17:00", venue:"IS 234 B", professor:"Coach Mendoza",    status:"Enrolled"},
                        {code:"GE201",  subject:"DAA",                        type:"GE",    schedule:"SAT 10:00–11:30", venue:"M414 B",   professor:"Prof. Aquino",     status:"Enrolled"},
                      ].map((r,i) => (
                        <tr key={i} className={`border-b border-border last:border-0 ${i%2===0?"bg-card":"bg-secondary/20"}`}>
                          <td className="px-4 py-3">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-teal-soft text-teal-dark border border-teal/20 font-mono">{r.code}</span>
                          </td>
                          <td className="px-4 py-3 font-medium">{r.subject}</td>
                          <td className="px-4 py-3 text-muted-text">{r.type}</td>
                          <td className="px-4 py-3 text-muted-text font-mono text-xs">{r.schedule}</td>
                          <td className="px-4 py-3 text-muted-text text-xs">{r.venue}</td>
                          <td className="px-4 py-3 text-muted-text">{r.professor}</td>
                          <td className="px-4 py-3"><span className="text-xs font-semibold text-teal">{r.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Membership History Tab */}
              {profileTab === "membership" && (
                <div className="space-y-3">
                  {[
                    {sem:"AY 2023–2024 S1",status:"Active",team:"Video Team",panata:"CICS2",approvedBy:"Super admin"},
                    {sem:"AY 2022–2023 S2",status:"Active",team:"Video Team",panata:"CICS2",approvedBy:"Super admin"},
                    {sem:"AY 2022–2023 S1",status:"Active",team:"Rotation",  panata:"CICS1",approvedBy:"Super admin"},
                    {sem:"AY 2021–2022 S2",status:"Active",team:"Rotation",  panata:"CICS1",approvedBy:"Super admin"},
                  ].map((r, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal to-teal-light grid place-items-center text-white font-bold text-sm shrink-0">
                        {r.sem.slice(-2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-foreground">{r.sem}</div>
                        <div className="text-xs text-muted-text mt-0.5">Team: <strong>{r.team}</strong> · Panata: <strong>{r.panata}</strong></div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal/10 text-teal border border-teal/20 shrink-0">{r.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Team Preferences Tab */}
              {profileTab === "preferences" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-teal to-teal-light rounded-2xl p-5 text-white">
                      <div className="text-xs uppercase tracking-wider text-white/70 font-bold mb-2">Primary Team</div>
                      <div className="font-serif font-bold text-xl">Video Team</div>
                      <div className="text-white/70 text-sm mt-1">Multimedia / Livestream</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-blue to-[#3D5466] rounded-2xl p-5 text-white">
                      <div className="text-xs uppercase tracking-wider text-white/70 font-bold mb-2">Secondary Team</div>
                      <div className="font-serif font-bold text-xl">DGA Team</div>
                      <div className="text-white/70 text-sm mt-1">Design & Graphics</div>
                    </div>
                  </div>
                  <div className="bg-secondary/30 rounded-xl p-4 text-sm flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-teal shrink-0"/>
                    <div><span className="font-bold">Survey status:</span> Submitted (AY 2022–2023)</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-text uppercase tracking-wider mb-2 block">Notes / Open to Changes</label>
                    <textarea
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:ring-2 focus:ring-teal/30 outline-none resize-none"
                      rows={4}
                      value={prefNote}
                      onChange={e => setPrefNote(e.target.value)}
                    />
                  </div>
                  <button className="px-5 py-2.5 rounded-xl bg-teal-dark text-white text-sm font-semibold hover:bg-teal transition">
                    Update Preference
                  </button>
                </div>
              )}

              {/* Responsibilities Tab */}
              {profileTab === "responsibilities" && (
                <div className="space-y-4">
                  <div className="flex gap-1.5 flex-wrap">
                    {(["All", "Team", "Panata", "GE"] as const).map(s => (
                      <button key={s} onClick={() => setRespSort(s)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${respSort === s ? "bg-teal-dark text-white border-teal-dark" : "bg-card border-border hover:bg-secondary"}`}>
                        {s === "GE" ? "GE Subject Groups" : s === "All" ? "All" : `${s}s`}
                      </button>
                    ))}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredResp.map(r => (
                      <article key={r.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <div className="mb-2 flex items-center justify-between">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${r.scope === "Panata" ? "bg-gold/15 text-yellow-800" : r.scope === "Team" ? "bg-teal/10 text-teal-dark" : "bg-secondary text-foreground"}`}>{r.scope}</span>
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-status/15 text-green-700">{r.role}</span>
                        </div>
                        <h3 className="text-base font-bold text-foreground">{r.title}</h3>
                        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                          <div><div className="font-bold text-teal-dark">{r.attendance}%</div><div className="text-muted-text">Attendance</div></div>
                          <div><div className="font-bold">{r.events}</div><div className="text-muted-text">Events</div></div>
                          <div><div className="font-bold">{r.tasks}</div><div className="text-muted-text">Tasks</div></div>
                        </div>
                        {(role === "leader" || role === "ge-monitor" || role === "panata-monitor" || role === "admin" || role === "superadmin") && (
                          <button onClick={() => setOpenMaster(r)} className="mt-4 w-full py-2.5 rounded-xl bg-teal text-white text-sm font-semibold hover:bg-teal-dark transition">
                            View Masterlist
                          </button>
                        )}
                      </article>
                    ))}
                  </div>
                  {openMaster && <ResponsibilityMasterlistModal card={openMaster} onClose={() => setOpenMaster(null)}/>}
                </div>
              )}
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}


// --- CHANGES

// 🌟 HIGHLIGHTED CHANGE: Added LeaderRadarChart tailored for Team Leaders
function LeaderRadarChart() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const DURATION = 900;

  useEffect(() => {
    const delay = setTimeout(() => {
      const animate = (now: number) => {
        if (startRef.current === null) startRef.current = now;
        const elapsed = now - startRef.current;
        const t = Math.min(elapsed / DURATION, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setProgress(eased);
        if (t < 1) rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
    }, 200);
    return () => {
      clearTimeout(delay);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Leader-specific metrics
  const axes = [
    { label: "Attendance",   value: 0.94 },
    { label: "Task Mgmt",    value: 0.92 },
    { label: "Comms",        value: 0.88 },
    { label: "Team Health",  value: 0.85 },
    { label: "Initiative",   value: 0.90 },
    { label: "Compliance",   value: 0.96 },
  ];
  const n = axes.length;
  const cx = 130; const cy = 130; const maxR = 96;
  const rings = [0.25, 0.5, 0.75, 1.0];

  function polarToXY(i: number, r: number) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  const dataPoints = axes.map((a, i) => polarToXY(i, a.value * maxR * progress));
  const polyStr = dataPoints.map(p => `${p.x},${p.y}`).join(" ");
  const ringPolys = rings.map(frac => axes.map((_, i) => polarToXY(i, frac * maxR)).map(p => `${p.x},${p.y}`).join(" "));
  const labelPositions = axes.map((a, i) => ({ ...polarToXY(i, maxR + 26), label: a.label, value: a.value }));

  return (
    <svg viewBox="0 0 260 280" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"auto"}}>
      {ringPolys.map((pts, ri) => <polygon key={ri} points={pts} fill="none" stroke="#1B6B8F" strokeOpacity={0.12 + ri * 0.04} strokeWidth="1"/>)}
      {axes.map((_, i) => <line key={i} x1={cx} y1={cy} x2={polarToXY(i, maxR).x} y2={polarToXY(i, maxR).y} stroke="#1B6B8F" strokeOpacity="0.18" strokeWidth="1"/>)}
      <polygon points={polyStr} fill="rgba(27,107,143,0.18)" stroke="#1B6B8F" strokeWidth="2"/>
      {dataPoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4.5" fill="#1B6B8F" stroke="white" strokeWidth="1.5"/>)}
      {labelPositions.map((l, i) => (
        <g key={i}>
          <text x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle" fontSize="9.5" fill="#6b7280" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600">{l.label.toUpperCase()}</text>
          <text x={l.x} y={l.y + 12} textAnchor="middle" dominantBaseline="middle" fontSize="9.5" fill="#1B6B8F" fontFamily="Sora, sans-serif" fontWeight="700">{Math.round(l.value * 100)}%</text>
        </g>
      ))}
      <circle cx={cx} cy={cy} r="3" fill="#1B6B8F" opacity="0.4"/>
    </svg>
  );
}

// ─── My Profile ───────────────────────────────────────────────────────────────
export function MyProfile() {
  const me: Member = {
    initials: "JN", name: "John Patrick Narvasa", id: "STF-2022-0001",
    course: "BS Information Technology", year: "Junior",
    attendance: "94%", tasks: "92%", status: "Active",
    dept: "CICS", team: "Video Team 104", panata: "CICS2", ge: "GE 101 - Sec A",
    email: "john.narvasa@neu.edu.ph",
    bio: "Video Team Leader. Manages scheduling, task distribution, and member welfare for Video Team 104.",
    tasksDone: 23, tasksTotal: 25, attendancePct: 94,
    recentActivity: "Sent weekly Panata reminder to all members",
  };

  // 🌟 HIGHLIGHTED CHANGE: Added state for tabs to match Student Profile
  const [profileTab, setProfileTab] = useState<"overview"|"academic"|"membership"|"preferences"|"responsibilities"|"activity"|"teams">("overview");
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState(me.bio);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  // 🌟 HIGHLIGHTED CHANGE: Standardized SVG Icons for Stat Strip
  const StatIcons = {
    Attendance: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/80"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M9 16l2 2 4-4"/></svg>,
    TasksDone:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/80"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    TeamSize:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/80"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Events:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/80"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  };

  const statCards = [
    { label:"Attendance",  value:"94%", sub:"this semester",  color:"from-teal to-teal-light",      IconComp: StatIcons.Attendance },
    { label:"Tasks Done",  value:"92%", sub:"of assigned",    color:"from-teal-light to-[#5A8FA8]", IconComp: StatIcons.TasksDone  },
    { label:"Team Size",   value:"55",  sub:"active members", color:"from-[#4A7A8A] to-[#3D6B7A]",  IconComp: StatIcons.TeamSize   },
    { label:"Events Led",  value:"12",  sub:"this semester",  color:"from-slate-blue to-[#3D5466]", IconComp: StatIcons.Events     },
  ];

  return (
    <div className="p-0 pb-7">
      <FadeUp>
        {/* 🌟 HIGHLIGHTED CHANGE: Tall gradient hero banner mirroring Student Profile */}
        <div className="relative overflow-hidden mb-0" style={{height:160, background:"linear-gradient(135deg, #0D4A6B 0%, #1B6B8F 50%, #4A8FA8 80%, #5A8FA8 100%)"}}>
          <div style={{position:"absolute",top:-30,right:-30,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
          <div style={{position:"absolute",bottom:-40,left:"30%",width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
          <div className="absolute top-5 left-7">
            <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Leader Profile</div>
            <div className="text-white font-serif font-bold text-2xl">{me.name.toUpperCase()}</div>
          </div>
          <div className="absolute top-5 right-7">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white/90 border border-white/30" style={{background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)"}}>
              Active Leader
            </span>
          </div>
        </div>
      </FadeUp>

      <div className="px-7">
        <FadeUp delay={60}>
          {/* 🌟 HIGHLIGHTED CHANGE: Floating Avatar and Data block */}
          <div className="flex gap-5 items-start -mt-8 mb-6">
            <div className="shrink-0 relative">
              <div className="w-24 h-24 rounded-2xl border-4 border-background shadow-2xl grid place-items-center overflow-hidden" style={{background:"linear-gradient(135deg, #1B6B8F, #4A8FA8)"}}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
                  <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.9)"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="rgba(255,255,255,0.9)"/>
                </svg>
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                <svg viewBox="0 0 10 10" className="w-2.5 h-2.5"><circle cx="5" cy="5" r="3" fill="white"/></svg>
              </span>
            </div>

            <div className="pt-10 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="font-serif font-bold text-teal-dark text-2xl leading-tight">{me.name}</h1>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-sm text-muted-text">{me.year} Year · {me.course} · {me.dept}</span>
                    <span className="text-muted-text/40">·</span>
                    <span className="text-sm font-mono text-muted-text">{me.id}</span>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal/10 text-teal border border-teal/20">Video Team Leader</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gold/15 text-yellow-700 border border-gold/30">{me.panata} Panata</span>
                  </div>
                </div>
                <button
                  onClick={() => editMode ? handleSave() : setEditMode(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all mt-1"
                  style={editMode ? {background:"var(--teal-dark)", color:"#fff", borderColor:"var(--teal-dark)"} : {borderColor:"var(--border)", color:"var(--muted-text)"}}>
                  {saved ? <CheckCircle className="w-3.5 h-3.5"/> : <Pencil className="w-3.5 h-3.5"/>} 
                  {editMode ? "Save Changes" : "Edit Profile"}
                </button>
              </div>
            </div>
          </div>

          {/* 🌟 HIGHLIGHTED CHANGE: Gradient stat cards mirroring Student Profile */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {statCards.map((s, i) => (
              <FadeUp key={s.label} delay={i * 50}>
                <div className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white shadow-md`} style={{boxShadow:"0 4px 14px rgba(0,0,0,0.12)"}}>
                  <div className="mb-1.5"><s.IconComp/></div>
                  <div className="font-serif font-bold text-3xl leading-none">{s.value}</div>
                  <div className="text-white/80 text-xs font-semibold mt-1 uppercase tracking-wide">{s.label}</div>
                  <div className="text-white/60 text-[10px] mt-0.5">{s.sub}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </FadeUp>

        {/* 🌟 HIGHLIGHTED CHANGE: Pill-style Tabbed Panel */}
        <FadeUp delay={120}>
          <div className="bg-card border border-border rounded-2xl overflow-hidden" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.08)"}}>
            <div className="flex gap-1 p-2 border-b border-border bg-secondary/20 overflow-x-auto">
              {[
                { id:"overview" as const, label:"Overview",      Icon: UserCircle },
                { id:"activity" as const, label:"Activity Logs", Icon: Activity },
                { id:"teams" as const,    label:"My Teams",      Icon: Users },
              ].map(t => (
                <button key={t.id} onClick={() => setProfileTab(t.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
                  style={profileTab === t.id ? {background:"var(--teal-dark)", color:"#fff", boxShadow:"0 2px 8px rgba(13,74,107,0.3)"} : {color:"var(--muted-text)", background:"transparent"}}>
                  <t.Icon className="w-3.5 h-3.5"/>{t.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {profileTab === "overview" && (
                <div className="flex gap-5 items-start">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-muted-text uppercase tracking-widest mb-3">Leader Biography</div>
                    <div className="bg-secondary/30 rounded-xl p-4 transition-colors border border-border/30 mb-5">
                      {editMode ? (
                        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full px-3 py-2 border border-teal/40 rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-teal/30 resize-none"/>
                      ) : (
                        <p className="text-sm text-foreground leading-relaxed">{bio}</p>
                      )}
                    </div>
                    
                    <div className="text-xs font-bold text-muted-text uppercase tracking-widest mb-3">Quick Info</div>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {[
                        {label:"Managed Team", value: me.team},
                        {label:"Panata Group", value: me.panata},
                        {label:"GE Group",     value: me.ge},
                        {label:"Email",        value: me.email},
                      ].map(({label, value}) => (
                        <div key={label} className="bg-secondary/30 rounded-xl p-4 transition-colors border border-border/30">
                          <div className="text-xs text-muted-text font-semibold uppercase tracking-wide mb-1.5">{label}</div>
                          <div className="font-semibold text-sm text-foreground">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 w-96">
                    <div className="rounded-2xl border border-border p-6 bg-secondary/10">
                      <div className="text-xs font-bold text-muted-text uppercase tracking-widest mb-1">Leadership Metrics</div>
                      <p className="text-[11px] text-muted-text mb-4">Core vitals for current semester</p>
                      <LeaderRadarChart/>
                    </div>
                  </div>
                </div>
              )}

              {profileTab === "activity" && (
                <div className="divide-y divide-border">
                  {[
                    { action: "Sent weekly Panata reminder to all members", time: "2 hours ago", icon: Send },
                    { action: "Assigned Choir Concert task to 55 members", time: "Yesterday", icon: CheckSquare },
                    { action: "Generated QR code for Video Team Practice", time: "Nov 7", icon: QrCode },
                    { action: "Updated heatmap availability schedule", time: "Nov 5", icon: Calendar },
                  ].map(({ action, time, icon: Icon }, i) => (
                    <div key={i} className="flex items-center gap-3 py-4">
                      <div className="w-9 h-9 rounded-xl bg-teal-soft flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-teal-dark" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{action}</div>
                        <div className="text-xs text-muted-text mt-0.5">{time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {profileTab === "teams" && (
                <div className="flex items-center gap-4 p-5 bg-teal-soft/40 rounded-xl border border-teal/20">
                  <div className="w-12 h-12 rounded-xl bg-teal flex items-center justify-center shadow-sm">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-teal-dark text-base">{me.team}</div>
                    <div className="text-xs text-muted-text mt-1">55 Active Members · Supervised under DGA Multimedia</div>
                  </div>
                  <button className="ml-auto px-4 py-2 rounded-lg bg-teal text-white text-xs font-bold hover:bg-teal-dark transition">Manage Team</button>
                </div>
              )}
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}



// 🌟 HIGHLIGHTED CHANGE: Added AdminRadarChart tailored for Admin/SuperAdmin System Metrics
function AdminRadarChart({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const DURATION = 900;

  useEffect(() => {
    const delay = setTimeout(() => {
      const animate = (now: number) => {
        if (startRef.current === null) startRef.current = now;
        const elapsed = now - startRef.current;
        const t = Math.min(elapsed / DURATION, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setProgress(eased);
        if (t < 1) rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
    }, 200);
    return () => {
      clearTimeout(delay);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // 🌟 HIGHLIGHTED CHANGE: Custom axes based on Admin vs SuperAdmin
  const axes = isSuperAdmin 
    ? [
        { label: "System Uptime", value: 0.99 },
        { label: "Data Integrity",value: 0.98 },
        { label: "Resolution",    value: 0.85 },
        { label: "Global Sync",   value: 0.95 },
        { label: "Access Control",value: 1.0 },
        { label: "Compliance",    value: 0.96 },
      ]
    : [
        { label: "Class Sync",    value: 0.94 },
        { label: "Grading TAT",   value: 0.88 },
        { label: "Student Comm",  value: 0.82 },
        { label: "Dispute Mgmt",  value: 0.90 },
        { label: "Audit Accuracy",value: 0.95 },
        { label: "Compliance",    value: 0.92 },
      ];
      
  const n = axes.length;
  const cx = 130; const cy = 130; const maxR = 96;
  const rings = [0.25, 0.5, 0.75, 1.0];

  function polarToXY(i: number, r: number) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  const dataPoints = axes.map((a, i) => polarToXY(i, a.value * maxR * progress));
  const polyStr = dataPoints.map(p => `${p.x},${p.y}`).join(" ");
  const ringPolys = rings.map(frac => axes.map((_, i) => polarToXY(i, frac * maxR)).map(p => `${p.x},${p.y}`).join(" "));
  const labelPositions = axes.map((a, i) => ({ ...polarToXY(i, maxR + 26), label: a.label, value: a.value }));

  return (
    <svg viewBox="0 0 260 280" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"auto"}}>
      {ringPolys.map((pts, ri) => <polygon key={ri} points={pts} fill="none" stroke={isSuperAdmin ? "#F5C518" : "#1B6B8F"} strokeOpacity={0.2} strokeWidth="1"/>)}
      {axes.map((_, i) => <line key={i} x1={cx} y1={cy} x2={polarToXY(i, maxR).x} y2={polarToXY(i, maxR).y} stroke={isSuperAdmin ? "#F5C518" : "#1B6B8F"} strokeOpacity="0.25" strokeWidth="1"/>)}
      <polygon points={polyStr} fill={isSuperAdmin ? "rgba(245,197,24,0.18)" : "rgba(27,107,143,0.18)"} stroke={isSuperAdmin ? "#F5C518" : "#1B6B8F"} strokeWidth="2"/>
      {dataPoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4.5" fill={isSuperAdmin ? "#F5C518" : "#1B6B8F"} stroke="white" strokeWidth="1.5"/>)}
      {labelPositions.map((l, i) => (
        <g key={i}>
          <text x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle" fontSize="9.5" fill="#6b7280" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600">{l.label.toUpperCase()}</text>
          <text x={l.x} y={l.y + 12} textAnchor="middle" dominantBaseline="middle" fontSize="9.5" fill={isSuperAdmin ? "#d97706" : "#1B6B8F"} fontFamily="Sora, sans-serif" fontWeight="700">{Math.round(l.value * 100)}%</text>
        </g>
      ))}
      <circle cx={cx} cy={cy} r="3" fill={isSuperAdmin ? "#F5C518" : "#1B6B8F"} opacity="0.4"/>
    </svg>
  );
}

// ─── Admin Profile ────────────────────────────────────────────────────────────
export function AdminProfile() {
  const { role } = usePortal();
  
  if (role !== "admin" && role !== "superadmin") {
    return (
      <div className="p-7 text-center text-red-status font-semibold flex items-center gap-2 justify-center">
        <AlertCircle className="w-5 h-5" /> Access Denied: Administrative Scope Required.
      </div>
    );
  }

  const isAdmin = role === "admin";
  const isSuperAdmin = role === "superadmin";
  
  const adminTabs = [
    { id: "overview",       label: "Overview",       Icon: UserCircle },
    { id: "assigned-scope", label: "Class Sections", Icon: Building2 },
    { id: "audit",          label: "Monitor Logs",   Icon: Clock }
  ];

  const superAdminTabs = [
    { id: "overview",       label: "Overview",            Icon: UserCircle },
    { id: "org-control",    label: "Global Operations",   Icon: SlidersHorizontal },
    { id: "audit",          label: "System Audit Logs",   Icon: Shield }
  ];

  const activeTabs = isAdmin ? adminTabs : superAdminTabs;
  const [currentTab, setCurrentTab] = useState("overview");

  const profileData = {
    name: isAdmin ? "Prof. Eleanor Vance" : "Dr. Alistair Sterling",
    title: isAdmin ? "Academic Course Monitor" : "Chief Institutional Admin",
    employeeId: isAdmin ? "EMP-2023-8841" : "EMP-2018-0001",
    email: isAdmin ? "e.vance@stf-neu.edu.ph" : "a.sterling@stf-neu.edu.ph",
    department: isAdmin ? "College of Information and Computer Studies" : "Office of Institutional Operations",
    scopeLabel: isAdmin ? "GE 101 — Section A" : "Full Organization (All STF-NEU)",
  };

  // 🌟 HIGHLIGHTED CHANGE: SVG Icons mapping Admin/SuperAdmin capabilities
  const StatIcons = {
    Students: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/80"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Sync:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/80"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    Tasks:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/80"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    Nodes:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/80"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  };

  const adminStats = [
    { label:"Students",      value:"42",     sub:"monitored currently", color:"from-teal to-teal-light",      IconComp: StatIcons.Students },
    { label:"Att Sync",      value:"94.2%",  sub:"average sync rate",   color:"from-teal-light to-[#5A8FA8]", IconComp: StatIcons.Sync     },
    { label:"Pending Eval",  value:"8",      sub:"tasks to grade",      color:"from-[#4A7A8A] to-[#3D6B7A]",  IconComp: StatIcons.Tasks    },
    { label:"Active Secs",   value:"1",      sub:"GE 101-A",            color:"from-slate-blue to-[#3D5466]", IconComp: StatIcons.Nodes    },
  ];

  const superAdminStats = [
    { label:"Enrolments",    value:"1,480",  sub:"active students",     color:"from-[#b45309] to-[#d97706]",  IconComp: StatIcons.Students },
    { label:"Command Nodes", value:"24",     sub:"active clusters",     color:"from-[#ca8a04] to-[#eab308]",  IconComp: StatIcons.Nodes    },
    { label:"System Uptime", value:"99.9%",  sub:"engine logs",         color:"from-[#047857] to-[#10b981]",  IconComp: StatIcons.Sync     },
    { label:"Global Flags",  value:"0",      sub:"issues detected",     color:"from-[#1e3a8a] to-[#047857]",  IconComp: Shield           },
  ];

  const statCards = isAdmin ? adminStats : superAdminStats;

  return (
    <div className="p-0 pb-7">
      <FadeUp>
        {/* 🌟 HIGHLIGHTED CHANGE: Tall gradient hero banner mirroring Student Profile */}
        <div className="relative overflow-hidden mb-0" style={{height:160, background: isSuperAdmin ? "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 80%, #f59e0b 100%)" : "linear-gradient(135deg, #0D4A6B 0%, #1B6B8F 50%, #4A8FA8 80%, #5A8FA8 100%)"}}>
          <div style={{position:"absolute",top:-30,right:-30,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
          <div style={{position:"absolute",bottom:-40,left:"30%",width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
          <div className="absolute top-5 left-7">
            <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Administrative Profile</div>
            <div className="text-white font-serif font-bold text-2xl">{profileData.name.toUpperCase()}</div>
          </div>
          <div className="absolute top-5 right-7">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white/90 border border-white/30" style={{background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)"}}>
              Security Clearance: Tier-{isAdmin ? "2" : "1"}
            </span>
          </div>
        </div>
      </FadeUp>

      <div className="px-7">
        <FadeUp delay={60}>
          {/* 🌟 HIGHLIGHTED CHANGE: Floating Avatar and Data block */}
          <div className="flex gap-5 items-start -mt-8 mb-6">
            <div className="shrink-0 relative">
              <div className="w-24 h-24 rounded-2xl border-4 border-background shadow-2xl grid place-items-center overflow-hidden" style={{background: isSuperAdmin ? "linear-gradient(135deg, #b45309, #f59e0b)" : "linear-gradient(135deg, #1B6B8F, #4A8FA8)"}}>
                <Shield className="w-12 h-12 text-white/90" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                <svg viewBox="0 0 10 10" className="w-2.5 h-2.5"><circle cx="5" cy="5" r="3" fill="white"/></svg>
              </span>
            </div>

            <div className="pt-10 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="font-serif font-bold text-teal-dark text-2xl leading-tight">{profileData.name}</h1>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-sm text-muted-text">{profileData.title}</span>
                    <span className="text-muted-text/40">·</span>
                    <span className="text-sm font-mono text-muted-text">{profileData.employeeId}</span>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${isSuperAdmin ? "bg-gold/15 text-yellow-700 border-gold/30" : "bg-teal/10 text-teal border-teal/20"}`}>
                      Scope: {profileData.scopeLabel}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-secondary text-muted-text border border-border">
                      {profileData.department}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🌟 HIGHLIGHTED CHANGE: Gradient stat cards mirroring Student Profile */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {statCards.map((s, i) => (
              <FadeUp key={s.label} delay={i * 50}>
                <div className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white shadow-md`} style={{boxShadow:"0 4px 14px rgba(0,0,0,0.12)"}}>
                  <div className="mb-1.5"><s.IconComp/></div>
                  <div className="font-serif font-bold text-3xl leading-none">{s.value}</div>
                  <div className="text-white/80 text-xs font-semibold mt-1 uppercase tracking-wide">{s.label}</div>
                  <div className="text-white/60 text-[10px] mt-0.5">{s.sub}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </FadeUp>

        {/* 🌟 HIGHLIGHTED CHANGE: Pill-style Tabbed Panel */}
        <FadeUp delay={120}>
          <div className="bg-card border border-border rounded-2xl overflow-hidden" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.08)"}}>
            <div className="flex gap-1 p-2 border-b border-border bg-secondary/20 overflow-x-auto">
              {activeTabs.map(t => (
                <button key={t.id} onClick={() => setCurrentTab(t.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
                  style={currentTab === t.id ? {background:"var(--teal-dark)", color:"#fff", boxShadow:"0 2px 8px rgba(13,74,107,0.3)"} : {color:"var(--muted-text)", background:"transparent"}}>
                  <t.Icon className="w-3.5 h-3.5"/>{t.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {currentTab === "overview" && (
                <div className="flex gap-5 items-start">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-muted-text uppercase tracking-widest mb-3">System Access Profile Parameters</div>
                    <div className="bg-secondary/30 rounded-xl p-4 transition-colors border border-border/30 mb-5">
                      <p className="text-sm text-muted-text leading-relaxed mb-3">This administrative profile sheet controls access tokens routing automated verification pipelines.</p>
                      <div className="p-3 bg-card border border-border rounded-xl text-xs font-mono text-foreground space-y-1">
                        <div>Security Matrix Clearances: Tier-{isAdmin ? "2 (Course Monitor)" : "1 (Global Root)"}</div>
                        <div>Assigned Signature Node: {isAdmin ? "STF-NEU-SEC-MON-ALPHA" : "STF-NEU-SEC-ROOT-SYSTEM"}</div>
                        <div>Terminal Session IP Clearance: Authorized via Single Sign On Proxy Protocol</div>
                      </div>
                    </div>
                    
                    <div className="text-xs font-bold text-muted-text uppercase tracking-widest mb-3">Contact routing</div>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {[
                        {label:"Primary Work Email", value: profileData.email},
                        {label:"Employee Registry",  value: profileData.employeeId},
                      ].map(({label, value}) => (
                        <div key={label} className="bg-secondary/30 rounded-xl p-4 transition-colors border border-border/30">
                          <div className="text-xs text-muted-text font-semibold uppercase tracking-wide mb-1.5">{label}</div>
                          <div className="font-semibold text-sm text-foreground">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 🌟 HIGHLIGHTED CHANGE: Admin/SuperAdmin Radar Chart */}
                  <div className="shrink-0 w-96">
                    <div className="rounded-2xl border border-border p-6 bg-secondary/10">
                      <div className="text-xs font-bold text-muted-text uppercase tracking-widest mb-1">System Health & Metrics</div>
                      <p className="text-[11px] text-muted-text mb-4">Core vitals for current semester operations</p>
                      <AdminRadarChart isSuperAdmin={isSuperAdmin} />
                    </div>
                  </div>
                </div>
              )}

              {currentTab === "assigned-scope" && isAdmin && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-teal-dark text-base mb-2">Class Section Assignments control</h3>
                  <p className="text-sm text-muted-text mb-4">The master parameters below delineate your explicit tracking jurisdictions over course nodes.</p>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-teal-dark text-white text-xs font-semibold uppercase">
                        <tr><th className="p-3">Section Code</th><th className="p-3">Course Description</th><th className="p-3">Schedule Slot</th><th className="p-3">Status</th></tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border text-xs bg-card">
                          <td className="p-3 font-bold text-teal-dark">GE101-SECA</td><td className="p-3">Art Appreciation</td><td className="p-3 font-mono">TUE/THU 11:30-13:00</td>
                          <td className="p-3"><span className="text-green-700 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 font-semibold">Track Active</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {currentTab === "org-control" && !isAdmin && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-teal-dark text-base mb-2">Global Operations Control Parameters</h3>
                  <p className="text-sm text-muted-text mb-4">Super-Admin architectural controls to override master tracking matrix synchronization intervals.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 border border-border bg-secondary/20 rounded-xl hover:border-red-status/40 transition">
                      <div className="text-sm font-bold text-teal-dark mb-1">Global Lock-out Triggers</div>
                      <div className="text-xs text-muted-text mb-4">Enforces a global read-only freeze context across all student profiles.</div>
                      <button className="px-4 py-2 bg-red-status text-white text-xs font-bold rounded-lg hover:opacity-90 transition">Deploy Master Freeze</button>
                    </div>
                    <div className="p-5 border border-border bg-secondary/20 rounded-xl hover:border-teal/40 transition">
                      <div className="text-sm font-bold text-teal-dark mb-1">COM Scheduling Integration</div>
                      <div className="text-xs text-muted-text mb-4">Triggers automated background cron compilation tasks matching COM master records.</div>
                      <button className="px-4 py-2 bg-teal-dark text-white text-xs font-bold rounded-lg hover:opacity-90 transition">Force COM Sync</button>
                    </div>
                  </div>
                </div>
              )}

              {currentTab === "audit" && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-teal-dark text-base mb-3">Recent Security Access & Mutation Logs</h3>
                  <div className="bg-secondary/20 border border-border rounded-xl p-4">
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex items-start gap-3 text-muted-text py-2 border-b border-border/40">
                        <Clock className="w-4 h-4 mt-0.5 text-teal shrink-0" />
                        <div><span className="text-foreground font-semibold">[2026-06-12 14:22:01]</span> Verified session tokens via Single Sign On proxy pipeline protocol.</div>
                      </div>
                      <div className="flex items-start gap-3 text-muted-text py-2 border-b border-border/40">
                        <Clock className="w-4 h-4 mt-0.5 text-teal shrink-0" />
                        <div><span className="text-foreground font-semibold">[2026-06-11 09:15:34]</span> Compiled tracking node sheets for matching session metrics.</div>
                      </div>
                      <div className="flex items-start gap-3 text-muted-text py-2">
                        <Clock className="w-4 h-4 mt-0.5 text-teal shrink-0" />
                        <div><span className="text-foreground font-semibold">[2026-06-10 18:02:11]</span> Administrative policy payload updated successfully.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}