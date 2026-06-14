import { usePortal } from "./PortalContext";
import { Video, Camera, Music, PenLine, Radio, Palette, Youtube } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import AevmLogo from "../../assets/AEVMLogo.png";
import NeuVideo from "../../assets/NEU.mp4";
import AevmVideo from "../../assets/AEVM_LOGO.mp4";

// ─── Scroll-triggered Fade-up ─────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { timer = setTimeout(() => setVisible(true), delay); observer.disconnect(); }
    }, { threshold: 0.12 });
    observer.observe(el);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, [delay]);
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}ms`, willChange: "opacity,transform" }}>
      {children}
    </div>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────
function TelegramIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 1 0 12 24a12 12 0 0 0-.056-24zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const teams = [
  { icon: Music,   name: "Music",      slug: "music",      color: "#a855f7", desc: "Worship music, live performances and audio production for all STF-NEU events." },
  { icon: PenLine, name: "Writing",    slug: "writing",    color: "#f59e0b", desc: "Content creation, scripts, written media, and ministry storytelling." },
  { icon: Video,   name: "Video",      slug: "video",      color: "#ef4444", desc: "Cinematic storytelling, event documentation and post-production." },
  { icon: Camera,  name: "Photo",      slug: "photo",      color: "#3b82f6", desc: "Visual coverage and photography for all STF-NEU events and activities." },
  { icon: Palette, name: "DGA",        slug: "dga",        color: "#ec4899", desc: "Digital graphics, motion graphics and visual design for the ministry." },
  { icon: Radio,   name: "Livestream", slug: "livestream", color: "#10b981", desc: "Live broadcast, technical operations and streaming for all events." },
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

// ─── Team Card ────────────────────────────────────────────────────────────────
function TeamCard({ t, onNavigate }: { t: typeof teams[0]; onNavigate: () => void }) {
  const Icon = t.icon;
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative bg-card rounded-lg border border-border h-full cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onNavigate}
      style={{
        transform: hovered ? "scale(1.045)" : "scale(1)",
        boxShadow: hovered ? "0 12px 32px rgba(13,74,107,0.18)" : "0 1px 4px rgba(13,74,107,0.06)",
        transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s",
        zIndex: hovered ? 10 : 1,
      }}
    >
      <div className="h-0.5 bg-gradient-to-r from-teal to-gold" />
      <div className="p-5">
        <div className="w-10 h-10 rounded-md bg-teal-soft grid place-items-center mb-3">
          <Icon className="w-5 h-5 text-teal-dark" />
        </div>
        <h3 className="font-serif text-lg font-bold text-teal-dark mb-1">{t.name}</h3>
        <p className="text-xs text-muted-text leading-relaxed mb-3">{t.desc}</p>
        <span style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(5px)", transition: "opacity 0.2s, transform 0.2s", display: "flex", alignItems: "center", gap: 4 }} className="text-gold font-semibold text-xs">
          View Team Page →
        </span>
      </div>
    </div>
  );
}

// ─── AEVM Logo Video ──────────────────────────────────────────────────────────
function HeroVideo() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 14,
        overflow: "hidden",
        aspectRatio: "16/9",
        boxShadow: "0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(245,197,24,0.12)",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0) scale(1)" : "translateY(18px) scale(0.97)",
        transition: "opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Gold top accent */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #F5C518 50%, transparent)", zIndex: 2, opacity: 0.8 }} />
      <video
        src={AevmVideo}
        autoPlay
        muted
        loop
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  );
}

// ─── Guest Home ───────────────────────────────────────────────────────────────
export function GuestHome() {
  const { setView } = usePortal();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  const [tiltActive, setTiltActive] = useState(false);

  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    setTilt({ x: dy * -8, y: dx * 8 });
    setGlare({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden text-white" style={{ minHeight: 480 }}>

        {/* NEU.mp4 looping background */}
        <video
          src={NeuVideo}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.30) saturate(1.15)" }}
        />

        {/* Teal overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(13,74,107,0.72) 0%, rgba(13,74,107,0.48) 45%, rgba(13,74,107,0.84) 100%)" }} />

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "36px 36px" }} />

        {/* Gold bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F5C518] to-transparent opacity-80" />

        <div className="relative z-10 max-w-6xl mx-auto px-8 py-14">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* ── Left ── */}
            <div>
              <FadeUp delay={0}>
                <span className="chip bg-gold/20 text-gold border border-gold/30 mb-4 inline-flex items-center gap-1.5 text-xs">
                  ✦ Special Task Force — New Era University
                </span>
              </FadeUp>
              <FadeUp delay={60}>
                <h1 className="font-serif text-5xl md:text-6xl font-bold mb-3 leading-[1.05] drop-shadow-lg">
                  STF-NEU<br /><span className="text-gold">ASTRA</span>
                </h1>
              </FadeUp>
              <FadeUp delay={120}>
                <p className="text-white/65 text-sm mb-6 leading-relaxed max-w-md">
                  Your all-in-one portal for scheduling, tasks, attendance, and team management across all six STF-NEU ministry teams.
                </p>
              </FadeUp>
              <FadeUp delay={180}>
                <div className="flex gap-3 flex-wrap mb-8">
                  <button onClick={() => document.getElementById("teams")?.scrollIntoView({ behavior: "smooth" })} className="bg-gold text-teal-dark px-5 py-2.5 rounded-md font-bold hover:brightness-105 shadow-lg transition text-sm">Browse Teams</button>
                  <button onClick={() => setView("login")} className="border-2 border-white/30 text-white px-5 py-2.5 rounded-md font-semibold hover:border-white hover:bg-white/10 transition text-sm">Member Login →</button>
                </div>
              </FadeUp>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                {stats.map(([v, l], i) => (
                  <FadeUp key={l} delay={240 + i * 50}>
                    <div className="rounded-lg p-3 text-center border border-white/10" style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(10px)" }}>
                      <div className="font-serif text-xl font-bold text-gold">{v}</div>
                      <div className="text-[9px] text-white/50 mt-0.5 uppercase tracking-wider leading-tight">{l}</div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>

            {/* ── Right: AEVM video + 3D tilt logo card ── */}
            <div className="flex flex-col gap-4">
              {/* AEVM_LOGO.mp4 */}
              <HeroVideo />

              {/* 3D tilt card */}
              <FadeUp delay={160}>
                <div style={{ perspective: "900px" }}>
                  <div
                    ref={cardRef}
                    onMouseMove={handleTiltMove}
                    onMouseEnter={() => setTiltActive(true)}
                    onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setTiltActive(false); }}
                    style={{
                      transformStyle: "preserve-3d",
                      transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tiltActive ? 1.02 : 1})`,
                      transition: tiltActive ? "transform 0.08s linear" : "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
                      borderRadius: 16,
                      position: "relative",
                    }}
                  >
                    <div
                      className="rounded-2xl border border-white/15 overflow-hidden"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        backdropFilter: "blur(20px)",
                        boxShadow: tiltActive
                          ? "0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(245,197,24,0.12)"
                          : "0 6px 24px rgba(0,0,0,0.25)",
                      }}
                    >
                      {/* Glare */}
                      <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.12) 0%, transparent 55%)`, opacity: tiltActive ? 1 : 0, transition: tiltActive ? "none" : "opacity 0.4s" }} />

                      <div className="p-6 flex flex-col items-center text-center" style={{ transform: "translateZ(16px)" }}>
                        <img src={AevmLogo} alt="AEVM Logo" style={{ height: 90, width: "auto", marginBottom: 10, filter: "drop-shadow(0 4px 16px rgba(245,197,24,0.35))" }} />
                        <p className="text-white/55 text-xs mb-4 max-w-xs leading-relaxed">Join the STF-NEU community and be part of something greater.</p>
                        <div className="flex gap-2 flex-wrap justify-center">
                          <a href="mailto:md@neu.edu.ph" className="bg-gold text-teal-dark px-5 py-2 rounded-lg font-bold hover:brightness-105 shadow-lg transition text-xs flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                            md@neu.edu.ph
                          </a>
                          <a href="https://www.youtube.com/@neu.aevmprogram" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-[#FF0000] text-white px-4 py-2 rounded-lg font-bold hover:brightness-110 shadow-lg transition text-xs">
                            <Youtube className="w-3.5 h-3.5" /> YouTube
                          </a>
                          <a href="https://t.me/STF_NEU" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-[#229ED9] text-white px-4 py-2 rounded-lg font-bold hover:brightness-110 shadow-lg transition text-xs">
                            <TelegramIcon className="w-3.5 h-3.5" /> Telegram
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>

          </div>
        </div>
      </section>

      {/* ── Teams ── */}
      <section id="teams">
        <div className="max-w-6xl mx-auto px-8">
          <FadeUp delay={0}>
            <div className="mb-6">
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(245,197,24,0.7)", textTransform: "uppercase" }}>OUR TEAMS</span>
              <h2 className="font-serif text-2xl font-bold mt-0.5" style={{ color: "teal-dark" }}>Chronicles by Team</h2>
            </div>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-4">
            {teams.map((t, i) => (
              <FadeUp key={t.slug} delay={i * 60}>
                <TeamCard t={t} onNavigate={() => setView("team-" + t.name)} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Events ── */}
      <section className="max-w-6xl mx-auto px-8 py-10 border-t border-border" >
        <FadeUp delay={0}>
          <div className="mb-6">
            <span className="text-[11px] font-bold tracking-[0.18em] text-gold uppercase">UPCOMING</span>
            <h2 className="font-serif text-2xl font-bold text-teal-dark mt-0.5">Events & Gatherings</h2>
          </div>
        </FadeUp>
        <div className="grid md:grid-cols-3 gap-4">
          {events.map((e, i) => (
            <FadeUp key={e.name} delay={i * 70}>
              <div className="bg-card rounded-lg border border-border h-full">
                <div className="h-28 bg-teal-soft rounded-t-lg" />
                <div className="p-4">
                  <div className="text-xs text-gold font-bold mb-1">{e.date}</div>
                  <h4 className="font-serif font-bold text-teal-dark text-sm mb-1">{e.name}</h4>
                  <p className="text-xs text-muted-text">{e.desc}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-teal-dark text-white/50 text-center py-6 text-xs tracking-wide">
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
    ["Media Team Practice", "Nov 8, 2023"],
    ["Team Sync Meeting", "Nov 12, 2023"],
  ];

  return (
    <div>
      {/* ── Team Hero — NEU.mp4 background ── */}
      <div className="relative overflow-hidden text-white" style={{ minHeight: 180 }}>
        <video
          src={NeuVideo}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.30) saturate(1.1)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(13,74,107,0.65) 0%, rgba(13,74,107,0.75) 60%, var(--color-background,#f8fafa) 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F5C518] to-transparent opacity-80" />
        <div className="relative z-10 max-w-6xl mx-auto px-8 py-10">
          <button onClick={() => setView("home")} className="text-gold text-xs mb-3 hover:underline block">← Back to Chronicles</button>
          <h1 className="font-serif text-4xl font-bold flex items-center gap-3 drop-shadow">
            <Icon className="w-9 h-9 text-gold" />{team.name} Team
          </h1>
          <p className="text-white/60 mt-1 max-w-lg text-sm">{team.desc}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 grid lg:grid-cols-12 gap-5">
        <FadeUp delay={0} className="lg:col-span-3">
          <aside className="bg-card border border-border rounded-lg p-4 h-fit">
            <div className="w-12 h-12 rounded-md bg-teal-soft grid place-items-center mb-3">
              <Icon className="w-6 h-6 text-teal-dark" />
            </div>
            <h3 className="font-serif text-base font-bold text-teal-dark">{team.name} Team</h3>
            <p className="text-xs text-muted-text mt-1">{team.desc}</p>
            <div className="mt-3 pt-3 border-t border-border space-y-1.5 text-xs">
              <div><span className="text-muted-text">Members:</span> <strong>55</strong></div>
              <div><span className="text-muted-text">Leader:</span> <strong className="text-teal-dark">@JeraldC</strong></div>
              <div><span className="text-muted-text">Projects:</span> <strong>4</strong></div>
            </div>
          </aside>
        </FadeUp>

        <section className="lg:col-span-6">
          <FadeUp delay={60}>
            <h3 className="font-serif text-xl font-bold text-teal-dark mb-3">Recent Work</h3>
          </FadeUp>
          <div className="grid grid-cols-2 gap-3">
            {recentWork.map((w, i) => (
              <FadeUp key={w} delay={i * 60}>
                <div className="bg-card border border-border rounded-lg overflow-hidden h-full">
                  <div className="h-24 bg-teal-soft" />
                  <div className="p-2.5 text-xs font-medium text-foreground">{w}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        <aside className="lg:col-span-3">
          <FadeUp delay={60}>
            <h3 className="font-serif text-lg font-bold text-teal-dark mb-3">Upcoming Events</h3>
          </FadeUp>
          <ul className="space-y-2">
            {upcomingEvents.map(([n, d], i) => (
              <FadeUp key={n} delay={i * 70}>
                <li className="bg-card border border-border rounded-md p-2.5">
                  <div className="text-[10px] text-gold font-bold">{d}</div>
                  <div className="text-xs font-medium">{n}</div>
                </li>
              </FadeUp>
            ))}
          </ul>
        </aside>
      </div>

      <div className="text-center py-8">
        <button onClick={() => setView("signup")} className="bg-gold text-teal-dark px-7 py-2.5 rounded-md font-bold hover:brightness-105 shadow text-sm">
          Sign Up to Join STF-NEU →
        </button>
      </div>
    </div>
  );
}