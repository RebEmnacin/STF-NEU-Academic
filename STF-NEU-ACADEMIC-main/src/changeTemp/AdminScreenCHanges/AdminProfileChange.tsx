















export function AdminProfile({ tier = "admin" }: { tier?: "admin" | "superadmin" }) {
  const name = tier === "superadmin" ? "Dr. E. Mariano" : "Ate M. Sandoval";
  return (
    <>
      <PageHeader title="My Profile" />
      <div className="mb-6 flex flex-wrap items-center gap-5 rounded-xl border border-border bg-white p-5 shadow-sm">
        <div className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white"
             style={{ background: "linear-gradient(135deg,#0D5B7F,#1B7B9F)" }}>
          {name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
        </div>
        <div className="flex-1 min-w-[260px]">
          <h2 className="text-xl font-bold">{name}</h2>
          <div className="text-sm text-muted-foreground">{tier === "superadmin" ? "Super Admin · Institution-wide" : "Admin · Computer Studies cluster"}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Pill variant="info">{tier === "superadmin" ? "Super Admin" : "Admin"}</Pill>
            <Pill variant="success">Student-role Promoter</Pill>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Section title="Assigned Subjects">
          <ul className="space-y-1.5 text-sm">
            <li>Sosyedad at Literatura — IS233 B</li>
            {tier === "superadmin" && <li>Ethics — M210 A</li>}
          </ul>
        </Section>
        <Section title="Assigned GE Subject Groups">
          <ul className="space-y-1.5 text-sm">
            <li>SosLit — IS233 B (Teacher)</li>
            <li>SosLit — IS234 A (Coordinator)</li>
          </ul>
        </Section>
        <Section title="Assigned Teams">
          <ul className="space-y-1.5 text-sm"><li>Video Team — Overseer</li>{tier === "superadmin" && <li>DGA Team — Overseer</li>}</ul>
        </Section>
        <Section title="Assigned Panata Groups">
          <ul className="space-y-1.5 text-sm"><li>CICS2 Panata — Overseer</li>{tier === "superadmin" && <li>CICS3 Panata — Overseer</li>}</ul>
        </Section>
      </div>
    </>
  );
}
