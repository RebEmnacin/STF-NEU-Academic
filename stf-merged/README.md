# STF-NEU AEVM Portal — Merged Prototype

This is the merged frontend prototype combining:
- **LovableRei** (boss's design) — used as the primary base
- **STF-NEU Academic** (your backend data/teams/logic) — integrated on top

## What's merged
- ✅ Correct 6 STF-NEU teams: Music, Writing, Video, Photo, DGA, Livestream
- ✅ STF-NEU branding throughout (TopNav, hero, footer)
- ✅ Prototype role switcher: Guest → Student → Team Leader → GE Monitor → Super Admin
- ✅ All original Rei screens intact (dashboards, schedules, roster, QR, heatmap, etc.)
- ✅ No auth required — pure prototype view, switch roles freely

## How to run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## How to import into Lovable
1. Push this folder to a GitHub repo
2. Go to lovable.dev → Import from GitHub
3. Select your repo → done

## Teams (the only 6)
| Team | Description |
|------|-------------|
| Music | Worship music and audio production |
| Writing | Content creation and scriptwriting |
| Video | Cinematic storytelling and post-production |
| Photo | Photography and visual documentation |
| DGA | Digital graphics and animation |
| Livestream | Live broadcast and technical operations |

## Prototype roles
- **Guest** — Public homepage, team pages, login/signup
- **Student** — Dashboard, schedule, tasks, announcements
- **Team Leader** — All student views + roster, QR, heatmap, attendance logger
- **GE Monitor / Admin** — Section dashboard, students, grader, dispatcher
- **Super Admin** — Institutional dashboard, all students, global operations
