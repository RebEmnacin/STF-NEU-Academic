// GET ACTION CENTER



// ============ Action Center (renamed Dispatcher, 4 tabs) ============
type ACScope = "leader" | "admin" | "superadmin";
const SCOPE_LABEL: Record<ACScope, string> = {
  leader: "Video Team 104 / CICS2 / PE3 G2",
  admin: "GE 101 - Sec A",
  superadmin: "Full Organization (4,500)",
};

export function ActionCenter({ scope }: { scope: ACScope }) {
  const [tab, setTab] = useState<"ann" | "task" | "survey" | "event">("ann");
  const locked = scope !== "superadmin";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-serif text-2xl font-bold text-teal-dark">Action Center</h1>
          <p className="text-sm text-muted-text">{scope === "superadmin" ? "Full organizational dispatch" : "Scoped dispatch — limited to your assigned groups"}</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 text-xs border border-border rounded-md bg-card hover:bg-secondary">Load Template</button>
          <button className="px-3 py-2 text-xs border border-gold text-teal-dark bg-gold-soft rounded-md font-semibold">Save as Template</button>
        </div>
      </div>

      {locked && (
        <div className="bg-gold-soft border border-gold rounded-md px-4 py-2 text-xs text-foreground mb-4">
          🔒 <strong>Scope-locked:</strong> you can only target <strong>{SCOPE_LABEL[scope]}</strong>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg card-soft overflow-hidden">
        <div className="border-b border-border bg-card px-4">
          <TabBar tabs={[
            { id: "ann", label: "Announcement", icon: Megaphone },
            { id: "task", label: "Task", icon: CheckSquare },
            { id: "survey", label: "Survey", icon: FileText },
            { id: "event", label: "Event Setter", icon: CalendarPlus },
          ]} active={tab} onChange={(id) => setTab(id as any)} />
        </div>

        <div className="grid grid-cols-12 gap-5 p-5">
          {/* Audience selector */}
          <div className="col-span-4 space-y-3">
            <div className="text-xs font-bold text-muted-text uppercase tracking-wider">Audience / Scope</div>
            <div className="bg-secondary border border-border rounded p-3 text-sm space-y-2 max-h-80 overflow-y-auto">
              <label className="flex items-center gap-2 font-semibold"><input type="checkbox" defaultChecked />{SCOPE_LABEL[scope]}</label>
              <div className="pl-5 space-y-1 text-xs">
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> All Members</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Leads Only</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Monitors Only</label>
                {scope === "superadmin" && (
                  <>
                    <div className="text-muted-text font-bold mt-2">Departments</div>
                    {["Computer Studies","Nursing","Engineering","Communication","Music"].map(d => (
                      <label key={d} className="flex items-center gap-2"><input type="checkbox" /> {d}</label>
                    ))}
                    <div className="text-muted-text font-bold mt-2">STF Teams</div>
                    {["🎬 Video","📷 Photo","🎵 Music","✍️ Writers","📡 Livestream","🎨 DGA"].map(d => (
                      <label key={d} className="flex items-center gap-2"><input type="checkbox" /> {d}</label>
                    ))}
                  </>
                )}
                <div className="text-muted-text font-bold mt-2">Specific People</div>
                {["Natalie Portman","Alex Ammin","Ben Affleck","Maria Santos"].map(n => (
                  <label key={n} className="flex items-center gap-2"><input type="checkbox" /> {n}</label>
                ))}
              </div>
            </div>
            <div className="bg-teal-soft border border-teal rounded p-2 text-xs">
              <strong>Reach preview:</strong> this will be sent to <strong>{scope === "superadmin" ? "1,245" : scope === "admin" ? "30" : "55"}</strong> members.
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-muted-text uppercase tracking-wider">Recurrence & Effectivity</div>
              <select className="w-full px-2 py-1.5 border border-border rounded text-sm bg-card">
                <option>Does not repeat</option><option>Daily</option><option>Weekly</option><option>Bi-weekly</option><option>Monthly</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-[10px] text-muted-text">Start</label><input type="date" defaultValue="2026-06-08" className="w-full mt-0.5 px-2 py-1 border border-border rounded text-xs bg-card"/></div>
                <div><label className="text-[10px] text-muted-text">End</label><input type="date" defaultValue="2026-07-08" className="w-full mt-0.5 px-2 py-1 border border-border rounded text-xs bg-card"/></div>
              </div>
            </div>
          </div>

          {/* Tab body */}
          <div className="col-span-8 space-y-3">
            {tab === "ann" && (
              <>
                <input className="w-full px-3 py-2 border border-border rounded-md text-sm bg-card font-semibold" defaultValue="Weekly Team Sync — Reminder" />
                <div className="border border-border rounded-md bg-card">
                  <div className="flex gap-2 px-3 py-2 border-b border-border text-xs"><b>B</b><i>I</i><span>≡ List</span><span>🔗 Link</span></div>
                  <textarea rows={6} className="w-full p-3 text-sm bg-card" defaultValue="Please confirm your attendance to this Saturday's sync. Bring your project notes and assigned segment storyboards." />
                </div>
                <div className="flex items-center justify-between bg-secondary p-3 rounded">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Schedule send</label>
                  <input type="datetime-local" className="px-2 py-1 border border-border rounded text-sm bg-card" />
                </div>
                <div className="flex gap-2">
                  <button className="chip bg-teal text-white">Normal</button>
                  <button className="chip border border-red-status text-red-status">Urgent</button>
                </div>
              </>
            )}
            {tab === "task" && (
              <>
                <input className="w-full px-3 py-2 border border-border rounded-md text-sm bg-card font-semibold" defaultValue="TASK: AEVM Multimedia Training Submissions (Week 3)" />
                <textarea rows={5} className="w-full px-3 py-2 border border-border rounded-md text-sm bg-card" defaultValue="Submit your weekly multimedia training output. Include rough cut + raw assets." />
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="text-xs text-muted-text">Deadline</label><input type="datetime-local" defaultValue="2026-06-14T23:59" className="w-full mt-1 px-2 py-1.5 border border-border rounded-md text-sm bg-card" /></div>
                  <div><label className="text-xs text-muted-text">Priority</label><select className="w-full mt-1 px-2 py-1.5 border border-border rounded-md text-sm bg-card"><option>High</option><option>Medium</option><option>Low</option></select></div>
                  <div><label className="text-xs text-muted-text">Max Score</label><input type="number" defaultValue={100} className="w-full mt-1 px-2 py-1.5 border border-border rounded-md text-sm bg-card" /></div>
                </div>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Graded task</label>
                <button className="text-xs px-3 py-1.5 border border-dashed border-border rounded-md hover:bg-secondary">📎 Attach file</button>
              </>
            )}
            {tab === "survey" && (
              <>
                <input className="w-full px-3 py-2 border border-border rounded-md text-sm bg-card font-semibold" defaultValue="Post-Practice Sentiment Survey" />
                <textarea rows={2} className="w-full px-3 py-2 border border-border rounded-md text-sm bg-card" defaultValue="Quick pulse check on this week's session." />
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="border border-border rounded p-3 bg-card space-y-2">
                      <div className="flex gap-2">
                        <select className="px-2 py-1 border border-border rounded text-xs">
                          <option>Multiple Choice</option><option>Dropdown</option><option>Text Area</option><option>Text Input</option><option>Selectable Options</option>
                        </select>
                        <input placeholder={`Question ${i}`} className="flex-1 px-2 py-1 border border-border rounded text-sm" defaultValue={i === 1 ? "How was today's session?" : i === 2 ? "What can we improve?" : "Rate the venue (1–5)"} />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="bg-teal text-white px-4 py-2 rounded-md text-sm hover:bg-teal-dark">+ Add Question</button>
              </>
            )}
            {tab === "event" && (
              <>
                <input className="w-full px-3 py-2 border border-border rounded-md text-sm bg-card font-semibold" defaultValue="STF-NEU Choir Concert — Batch 4 Rehearsal" />
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-muted-text">Event Type</label>
                    <select className="w-full mt-1 px-2 py-1.5 border border-border rounded-md text-sm bg-card"><option>Team Activity</option><option>Panata</option><option>GE Class</option><option>Institutional Event</option><option>Other</option></select>
                  </div>
                  <div><label className="text-xs text-muted-text">Venue (nullable)</label>
                    <input className="w-full mt-1 px-2 py-1.5 border border-border rounded-md text-sm bg-card" defaultValue="Main Studio · IS Bldg B" placeholder="Leave blank / TBD" />
                  </div>
                  <div><label className="text-xs text-muted-text">Scheduled Start</label><input type="datetime-local" defaultValue="2026-06-15T18:00" className="w-full mt-1 px-2 py-1.5 border border-border rounded-md text-sm bg-card" /></div>
                  <div><label className="text-xs text-muted-text">Scheduled End</label><input type="datetime-local" defaultValue="2026-06-15T21:00" className="w-full mt-1 px-2 py-1.5 border border-border rounded-md text-sm bg-card" /></div>
                </div>
                <textarea rows={4} className="w-full px-3 py-2 border border-border rounded-md text-sm bg-card" defaultValue="Final rehearsal before Batch 4 livestream. Bring confirmed segment scripts and call-time matrix." />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Recurring event</label>
                <div className="bg-teal-soft border border-teal rounded p-2 text-xs">
                  ℹ️ Publishing auto-adds to the institutional calendar + dispatches a paired announcement to the audience above.
                </div>
              </>
            )}
          </div>
        </div>

        <div className="px-5 py-3 border-t border-border bg-secondary flex justify-end gap-2">
          <button className="px-4 py-2 text-sm border border-border rounded-md bg-card hover:bg-background">Preview</button>
          <button className="px-5 py-2 text-sm bg-teal text-white rounded-md font-semibold hover:bg-teal-dark">
            {tab === "event" ? "Publish Event" : tab === "ann" ? "Send Announcement" : tab === "task" ? "Send / Assign" : "Send Survey"}
          </button>
        </div>
      </div>
    </div>
  );
}
