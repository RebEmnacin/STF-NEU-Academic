import { usePortal } from "./PortalContext";
import { Video, Camera, Music, PenLine, Radio, Palette } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// ─── Scroll-triggered Fade-up ─────────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timer: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setVisible(true), delay);
          observer.disconnect(); // fire once, never reverse
        }
      },
      { threshold: 0.12 } // trigger when 12% of element is visible
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1), transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const teams = [
  { icon: Music,   name: "Music",      slug: "music",      desc: "Worship music, live performances and audio production for all STF-NEU events." },
  { icon: PenLine, name: "Writing",    slug: "writing",    desc: "Content creation, scripts, written media, and ministry storytelling." },
  { icon: Video,   name: "Video",      slug: "video",      desc: "Cinematic storytelling, event documentation and post-production." },
  { icon: Camera,  name: "Photo",      slug: "photo",      desc: "Visual coverage and photography for all STF-NEU events and activities." },
  { icon: Palette, name: "DGA",        slug: "dga",        desc: "Digital graphics, motion graphics and visual design for the ministry." },
  { icon: Radio,   name: "Livestream", slug: "livestream", desc: "Live broadcast, technical operations and streaming for all events." },
];

const events = [
  { name: "STF-NEU Choir Concert Batch 3", date: "Jan 2, 2024",  desc: "YouTube Live performance" },
  { name: "CBI Peer Counseling Seminar",   date: "Nov 2, 2023",  desc: "Annual counseling event" },
  { name: "STF Photo Team Profiling",      date: "Oct 14, 2023", desc: "Team identity shoot" },
];

const stats = [
  ["6",    "Ministry Teams"],
  ["100+", "Active Members"],
  ["50+",  "Events / Sem"],
  ["15+",  "Years Serving"],
];

// ─── Guest Home ───────────────────────────────────────────────────────────────
export function GuestHome() {
  const { setView } = usePortal();

  return (
    <div>
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-teal-dark via-teal to-teal-dark text-white py-24 px-8 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 30%, white 2px, transparent 2px), radial-gradient(circle at 75% 60%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

        <div className="max-w-6xl mx-auto relative">
          <div className="max-w-2xl">
            <FadeUp delay={0}>
              <span className="chip bg-gold/20 text-gold border border-gold/30 mb-4 inline-flex">
                ✦ Special Task Force — New Era University
              </span>
            </FadeUp>

            <FadeUp delay={80}>
              <h1 className="font-serif text-6xl md:text-7xl font-bold mb-4 leading-tight">
                STF-NEU<br />Chronicles
              </h1>
            </FadeUp>

            <FadeUp delay={160}>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                Your all-in-one portal for scheduling, tasks, attendance, and team management
                across all six STF-NEU ministry teams.
              </p>
            </FadeUp>

            <FadeUp delay={240}>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => document.getElementById("teams")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-gold text-teal-dark px-6 py-3 rounded-md font-bold hover:brightness-105 shadow transition"
                >
                  Browse Teams
                </button>
                <button
                  onClick={() => setView("login")}
                  className="border-2 border-white/30 text-white px-6 py-3 rounded-md font-semibold hover:border-white hover:bg-white/10 transition"
                >
                  Member Login →
                </button>
              </div>
            </FadeUp>
          </div>

          {/* Stat cards — stagger as they enter viewport */}
          <div className="mt-12 grid grid-cols-4 gap-4 max-w-xl">
            {stats.map(([v, l], i) => (
              <FadeUp key={l} delay={i * 60}>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                  <div className="font-serif text-2xl font-bold text-gold">{v}</div>
                  <div className="text-[10px] text-white/50 mt-0.5 uppercase tracking-wider">{l}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Teams ── */}
      <section id="teams" className="max-w-6xl mx-auto px-8 py-16">
        <FadeUp delay={0}>
          <div className="mb-8">
            <span className="text-[11px] font-bold tracking-[0.18em] text-teal uppercase">OUR TEAMS</span>
            <h2 className="font-serif text-3xl font-bold text-teal-dark mt-1">Chronicles by Team</h2>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-5">
          {teams.map((t, i) => {
            const Icon = t.icon;
            return (
              <FadeUp key={t.slug} delay={i * 70}>
                <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition card-soft group h-full">
                  <div className="h-1 bg-gradient-to-r from-teal to-gold" />
                  <div className="p-6">
                    <div className="w-12 h-12 rounded-md bg-teal-soft grid place-items-center mb-3 group-hover:bg-teal/10 transition">
                      <Icon className="w-6 h-6 text-teal-dark" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-teal-dark mb-2">{t.name}</h3>
                    <p className="text-sm text-muted-text mb-4 leading-relaxed">{t.desc}</p>
                    <button
                      onClick={() => setView("team-" + t.name)}
                      className="text-gold font-semibold text-sm hover:underline flex items-center gap-1"
                    >
                      View Team Page →
                    </button>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </section>

      {/* ── Events ── */}
      <section className="max-w-6xl mx-auto px-8 py-16 border-t border-border">
        <FadeUp delay={0}>
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[11px] font-bold tracking-[0.18em] text-gold uppercase">UPCOMING</span>
              <h2 className="font-serif text-3xl font-bold text-teal-dark mt-1">Events & Gatherings</h2>
            </div>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-5">
          {events.map((e, i) => (
            <FadeUp key={e.name} delay={i * 80}>
              <div className="bg-card rounded-lg border border-border overflow-hidden card-soft h-full">
                <div className="h-40 bg-gradient-to-br from-teal-soft via-teal-light to-gold-soft" />
                <div className="p-5">
                  <div className="text-xs text-gold font-bold mb-1">{e.date}</div>
                  <h4 className="font-serif font-bold text-teal-dark mb-2">{e.name}</h4>
                  <p className="text-sm text-muted-text">{e.desc}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-br from-teal-dark to-teal py-16 text-center text-white">
        <FadeUp delay={0}>
          <h2 className="font-serif text-4xl font-bold mb-3">STF YAY!</h2>
        </FadeUp>
        <FadeUp delay={80}>
          <p className="text-white/65 mb-6 max-w-md mx-auto">
            Join the STF-NEU community and be part of something greater. Your story starts here.
          </p>
        </FadeUp>
        <FadeUp delay={160}>
          <button
            onClick={() => setView("signup")}
            className="bg-gold text-teal-dark px-8 py-3 rounded-md font-bold hover:brightness-105 shadow-lg transition"
          >
            Join STF-NEU →
          </button>
        </FadeUp>
      </section>

      <footer className="bg-teal-dark text-white text-center py-8 text-sm">
        © {new Date().getFullYear()} STF-NEU AEVM Portal · New Era University
      </footer>
    </div>
  );
}


// ─── Guest Team Page ──────────────────────────────────────────────────────────
export function GuestTeamPage({ teamName }: { teamName: string }) {
  const { setView } = usePortal();
  const team = teams.find((t) => t.name === teamName) ?? teams[0];
  const Icon = team.icon;

  const recentWork = [
    "Foundation Day Coverage — Oct 2023",
    "Weekly Vlog Episode 12 — Sep 2023",
    "Orientation BTS — Aug 2023",
    "Annual Report — Jul 2023",
  ];

  const upcomingEvents: [string, string][] = [
    ["STF-NEU Choir Orientation (Batch 1)", "Nov 2, 2023"],
    ["Media Team Practice",                  "Nov 8, 2023"],
    ["Team Sync Meeting",                    "Nov 12, 2023"],
  ];

  return (
    <div>
      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-teal-dark to-teal text-white py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <FadeUp delay={0}>
            <button onClick={() => setView("home")} className="text-gold text-sm mb-3 hover:underline block">
              ← Back to Chronicles
            </button>
          </FadeUp>
          <FadeUp delay={80}>
            <h1 className="font-serif text-5xl font-bold flex items-center gap-4">
              <Icon className="w-12 h-12 text-gold" />
              {team.name} Team
            </h1>
          </FadeUp>
          <FadeUp delay={160}>
            <p className="text-white/65 mt-2 max-w-lg">{team.desc}</p>
          </FadeUp>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-8 py-12 grid lg:grid-cols-12 gap-6">

        {/* Team info aside */}
        <FadeUp delay={0} className="lg:col-span-3">
          <aside className="bg-card border border-border rounded-lg p-5 h-fit card-soft">
            <div className="w-16 h-16 rounded-md bg-teal-soft grid place-items-center mb-3">
              <Icon className="w-8 h-8 text-teal-dark" />
            </div>
            <h3 className="font-serif text-lg font-bold text-teal-dark">{team.name} Team</h3>
            <p className="text-sm text-muted-text mt-2">{team.desc}</p>
            <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
              <div><span className="text-muted-text">Members:</span> <strong>55</strong></div>
              <div><span className="text-muted-text">Team Leader:</span> <strong className="text-teal-dark">@JeraldC</strong></div>
              <div><span className="text-muted-text">Active Projects:</span> <strong>4</strong></div>
            </div>
          </aside>
        </FadeUp>

        {/* Recent work */}
        <section className="lg:col-span-6">
          <FadeUp delay={60}>
            <h3 className="font-serif text-2xl font-bold text-teal-dark mb-4">Recent Work</h3>
          </FadeUp>
          <div className="grid grid-cols-2 gap-4">
            {recentWork.map((w, i) => (
              <FadeUp key={w} delay={i * 70}>
                <div className="bg-card border border-border rounded-lg overflow-hidden card-soft h-full">
                  <div className="h-32 bg-gradient-to-br from-teal-soft via-teal-light to-gold-soft" />
                  <div className="p-3 text-xs font-medium text-foreground">{w}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* Upcoming events */}
        <aside className="lg:col-span-3">
          <FadeUp delay={60}>
            <h3 className="font-serif text-xl font-bold text-teal-dark mb-4">Upcoming Events</h3>
          </FadeUp>
          <ul className="space-y-3">
            {upcomingEvents.map(([n, d], i) => (
              <FadeUp key={n} delay={i * 80}>
                <li className="bg-card border border-border rounded-md p-3 card-soft">
                  <div className="text-xs text-gold font-bold">{d}</div>
                  <div className="text-sm font-medium">{n}</div>
                </li>
              </FadeUp>
            ))}
          </ul>
        </aside>
      </div>

      {/* ── CTA ── */}
      <div className="text-center py-10">
        <FadeUp delay={0}>
          <button
            onClick={() => setView("signup")}
            className="bg-gold text-teal-dark px-8 py-3 rounded-md font-bold hover:brightness-105 shadow"
          >
            Sign Up to Join STF-NEU →
          </button>
        </FadeUp>
      </div>
    </div>
  );
}