# Injabin Alam: Bauhaus 3D Portfolio, Final Plan

Target: replace `injabin.is-a.dev` (current "game HUD" style site) with a professional, Bauhaus-styled, real-time 3D portfolio.
Build tool: Antigravity (agent-driven IDE). Goal: internships and junior roles in full-stack, backend, embedded/IoT software, plus an applied AI/ML research profile.

---


**Decisions already made (do not reopen):** Next.js + TypeScript + Tailwind + React Three Fiber; orthographic Bauhaus scene; **Web3Forms** contact form (free, no server code) with honeypot and hCaptcha; Vercel hosting on `injabin.is-a.dev`; English only.

---

## 0. What I found (and what to fix first)

I read your LinkedIn PDF and your live portfolio. Problems to fix before any design work:

| Issue | Why it hurts | Fix |
|---|---|---|
| Gamified labels (XP 0/1000, LEVEL 07, CLASS MAKER, skill bars 82/61/55) | Fake numbers look unserious to recruiters | Delete. Show skills as grouped lists with evidence (project links) |
| Portfolio leads with robotics ("Systems & Robotics Builder", quadruped, EMG arm), but your real focus is software | Recruiters read you as a hardware person | **Software first.** Hardware becomes a secondary strength (see Section 2) |
| Newest projects missing (Nexus Stock AI, AlgoArena, AquaSweep) | Your strongest, most modern work is hidden | Make them the top 3 |
| Outlier job missing, CanSat shown as "former" with no detail | Weak experience section | Rewrite with outcomes |
| "3+ years building", "10+ projects" | Unverifiable claims | Remove or replace with real, countable facts |
| Site links to `github.com/Injabin` (and repo links under that account); your real account is `github.com/ninja-bean` | Wrong or dead links | Use `ninja-bean` everywhere. Open every repo link and confirm it resolves; if old repos live under the other account, transfer or re-link them |
| Emoji icons, `// comments`, terminal jargon (INIT_SEQUENCE, CLASSIFIED) | Hard to scan, off-brand for Bauhaus | Plain language labels |
| Several "CLASSIFIED →" links go to `#` | Dead links | Either publish a write-up or remove the link |
| Phone number and home address are in your LinkedIn contact | Privacy | Do not put them on the portfolio. Email + LinkedIn + GitHub only |

---

## 1. Concept: "Construction Set"

Bauhaus was about function, geometry, and making things. You build things (software that touches hardware), so the site is a **construction set**: the whole site is one 3D stage built from the three Bauhaus primitives, and scrolling assembles your story.

- **Circle, square, triangle** are the only shapes. Every 3D object is one of them or a combination (cube, sphere, cone, cylinder, extruded arch).
- **Axonometric view.** Use an **orthographic camera** at an isometric-ish angle. No perspective distortion. This looks like a Bauhaus poster and a technical drawing at once, and it is the single biggest thing that stops this from looking like a generic Three.js site.
- **Flat, matte materials.** No glossy, no gradients, no bloom, no glassmorphism. Hard-edged shadows only.
- **One memorable thing:** the hero composition of three primitives that reacts to the mouse and then disassembles into the page as you scroll. Everything else stays quiet.

Design principle: *form follows function*. If a shape or motion doesn't help someone understand your work, cut it.

---

## 2. Positioning and copy

### Headline (use the same one on LinkedIn, GitHub README, portfolio, resume)

> **Injabin Alam**
> Software engineer. Full-stack and backend systems, built end to end.

### Sub-line

> CSE student at United International University, Dhaka. I plan, build and ship software with teams, and I also work with hardware when a project needs it. Open to software engineering internships and junior roles.

### Rules for all copy

- Sentence case. Plain verbs. No gamer or hacker slang.
- Every project card answers: **What is it, what did I build, what stack, what was hard, link.**
- Numbers only if real. If you don't have a number, describe the outcome instead.
- English only. No language toggle.
- **Software is the lead, hardware is the bonus.** Order of everything (projects, skills, bio): software first, then team leadership, then hardware/aviation.
- **Applied ML research is confidential.** Show one neutral line only (see Recognition section). No topic, method, dataset or results.

### Experience copy (draft, edit with your real details)

**AI Data Contributor, Outlier** (Sep 2026 to present)
Evaluate and compare visual and multilingual content against detailed quality guidelines. Work requires consistency, precise written feedback, and following changing specifications.

**Intern, UIU CanSat Team** (Aug 2025 to Aug 2026)
Designed the complete airframe of a fixed-wing VTOL drone in CAD. Researched aviation and VTOL design in depth, including the NACA 4412 airfoil and published papers related to the project. *(Only keep "flight controller firmware" in this entry if you personally worked on it; your LinkedIn currently says so.)*

**General Member, UIU App Forum** (Oct 2023 to Jan 2026)
*(Add one line: what did you build or contribute?)*

### Projects: order, pitch and your contribution

Order is software-first and shows teamwork and leadership early.

| # | Project | Pitch | Your contribution (use as the "My part" text) | Stack | 3D object |
|---|---|---|---|---|---|
| 1 | **AlgoArena** | 3D pathfinding visualizer where search algorithms race on the same maze | Implemented bidirectional A*, bidirectional BFS, simulated annealing and hill climbing. Added **multiple goal states** with animation. Planned the UI with teammates | React, TypeScript, Three.js, Zustand | Square grid with extruded walls |
| 2 | **Nexus Stock AI** | Real-time market data with AI-assisted stock analysis | Full UI and planning. **Scrum master**: managed the team, reviewed members' PRs, assigned tasks | Next.js, React, TypeScript, Gemini API | Rising stacked bars |
| 3 | **AquaSweep** | Aquaculture monitoring: live telemetry, drone control, AI assistant, ESP32 | Full UI and planning. Partial backend (MQTT live data, with a teammate). Hardware: sensor setups and tuning. **3rd runner-up, UIU CSE Project Show (microprocessor course)** | ESP32, MQTT, web dashboard, AI | Circle with ripple rings |
| 4 | **NextNest** | Real-estate desktop platform | Your first application. Built the full JavaFX UI alone, plus backend and database work | Java, JavaFX, MySQL | Cube house form |
| 5 | **GovConnect** | Dhaka city management and emergency response system | Built the whole project. Currently porting it from PHP to Next.js as a side project | PHP, MySQL; Next.js (in progress) | Triangle pin network |
| 6 | **VTOL drone (CanSat)** | Fixed-wing VTOL drone | Designed the complete drone in CAD. Researched the NACA 4412 airfoil, aviation and VTOL papers | Fusion 360 | Cross-shaped frame |

**Per-project "hard part" text (draft, edit in your own voice):**

- **AlgoArena.** The first version supported a single goal, and every algorithm assumed it. Extending to multiple goals meant reworking how each algorithm decides when it is finished and how it scores progress. The hardest pieces were **simulated annealing** (choosing and cooling the temperature so it escapes local optima but still converges) and **hill climbing** (handling local maxima and plateaus), both adapted to multiple goal states.
- **Nexus Stock AI.** Coordinating a team: breaking work into tasks, reviewing PRs for consistency, and keeping everyone unblocked. Describe one concrete example (a PR you pushed back on, a task you split, a sprint decision).
- **AquaSweep.** Making hardware, data and UI agree: sensor setup and calibration on the ESP32, live data over MQTT, and a dashboard that stays accurate. *(Add one specific sensor problem you solved, for example calibration drift or noisy readings.)*
- **NextNest.** Designing a relational schema and keeping a desktop UI responsive over real queries, as a first project.
- **GovConnect.** Modeling emergency-response and city data in PHP and MySQL; now rethinking it in Next.js.
- **VTOL drone.** Choosing and justifying an airfoil (NACA 4412), and turning the research into a buildable CAD design.

**"Labs" section (small, secondary):** Quadruped robot, EMG-controlled arm, Snake engine. Label honestly as experiments. Keep it to one row; it must not compete with the six projects above. You may drop it if it feels like clutter.

### Recognition and research

- HackerRank 5-star, Java problem solving (link profile)
- Research preprint: *Cybersecurity Incidents and Their Social Impacts* (ResearchGate link)
- Applied ML research, early stage. Use exactly one neutral line: *"Currently doing early-stage applied machine learning research (details confidential)."* Nothing more.

---

## 3. Visual system

### 3.1 Color

Rule: **90% black and white, 10% Bauhaus primaries.** Default state is monochrome and iconic; color appears on interaction and on the 3D primitives only.

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#000000` | Text, outlines, black 3D forms |
| `--paper` | `#F5F5F0` | Page background (light theme) |
| `--white` | `#FFFFFF` | Cards, 3D white forms |
| `--red` | `#E10600` | Primary accent: circle, key CTA, hover state |
| `--blue` | `#0033A0` | Secondary accent: square, links, focus |
| `--yellow` | `#FFC700` | Tertiary accent: triangle, highlight (use rarest) |
| `--grey` | `#8A8A85` | Secondary text only (check contrast, see 3.6) |

**Dark theme:** invert to `--ink` background, `--paper` text. Keep primaries identical (they work on both).

**Mono mode (optional toggle):** a header switch turns every primitive black/white/grey. This directly answers your "black and white but iconic" idea and doubles as an accessibility feature.

**Color assignment by meaning (stay consistent):**
- Red circle = hardware / embedded / drones
- Blue square = software / web / backend
- Yellow triangle = AI / research / data
Each project tags with its dominant color. This makes the color a legend, not decoration.

### 3.2 Typography

| Role | Font | Notes |
|---|---|---|
| Display and headings | **Jost** (800, 900) | Free Futura-style geometric sans: closest to Bauhaus/Futura era without paying for a license |
| Body | **IBM Plex Sans** (400, 500) | Neutral, very legible, technical feel. Clearly distinct from Jost |
| Code snippets only | **IBM Plex Mono** | Only inside code blocks, never for decorative labels |

Type scale (fluid with `clamp`):

```
display-xl: clamp(4rem, 14vw, 14rem)    // name on hero, letter-spacing -0.04em, line-height 0.85
display-l : clamp(2.5rem, 7vw, 6rem)    // section titles
h3        : clamp(1.5rem, 3vw, 2.25rem)
body      : 1.0625rem / 1.65             // 17px, max-width 62ch
small     : 0.875rem / 1.5
```

Bauhaus type moves (use 2 to 3, not all):
- Huge name cropped by the viewport edge.
- Section titles rotated 90 degrees along the left edge, like a poster spine.
- Text set flush-left, ragged-right. Never justified, never centered body text.
- Heavy rules (4 to 8px black bars) as dividers.
- Lowercase-only titles in one place (for example the contact section) as a nod to Bayer's "universal" alphabet.

Avoid: all-caps tracked labels above every heading, bold-one-word-in-a-headline gimmicks, monospace "terminal" labels, emoji.

### 3.3 Grid and layout

- **12-column grid, 8px base unit.** Gutters 24px desktop, 16px mobile.
- Strict alignment to the grid. Elements may overlap each other **only** when overlapping is deliberate (a circle behind a headline).
- Asymmetry with balance: big heavy block on one side, whitespace on the other.
- Max 2 diagonal elements per screen. Diagonals are the Bauhaus accent: use them for one divider or one rotated title.
- Borders: 2px solid ink. **Border-radius: 0** on UI (square) and **full circles** where round. Never a "soft 8px radius on everything".
- No drop shadows on UI. Depth comes from the 3D scene.

### 3.4 Iconography

Draw all icons from circles, squares, triangles, and straight lines (SVG, 2px stroke, 24px grid). Do not use an icon pack with mixed styles. You need about 10 icons: GitHub, LinkedIn, email, download, arrow, close, menu, external link, theme, mono.

### 3.5 Motion principles

- **Easing:** mechanical and precise. `cubic-bezier(0.7, 0, 0.2, 1)` for moves, no bounces, no wobble.
- **Durations:** 200 to 300ms for UI, 800 to 1200ms for scene transitions.
- **Scroll is the main driver** of 3D motion (scrubbed, not timed).
- One orchestrated entrance (hero assemble). Don't fade-and-slide every section.
- Hover: shapes snap color from mono to primary in one step. No gradients.
- Respect `prefers-reduced-motion` (see Section 8).

### 3.6 Accessibility and contrast

- Body text `--ink` on `--paper`: passes AAA.
- `--grey` on `--paper`: only for large or secondary text. Check with a contrast tool; darken to `#5C5C58` if it fails 4.5:1.
- White text on `--red` and `--blue` passes AA. **Never put white text on `--yellow`**; use ink.
- Visible keyboard focus: 3px `--blue` outline with 3px offset on every interactive element.

---

## 4. The 3D concept in detail

### 4.1 Architecture: one persistent canvas

One fixed full-screen `<Canvas>` sits behind the HTML content. The HTML scrolls normally (real text, real links, good for SEO and accessibility). Scroll position drives a camera and object timeline.

```
┌─────────────────────────────────────────────┐
│  <Canvas> fixed, z-index 0 (3D scene)       │
│  ┌───────────────────────────────────────┐  │
│  │ HTML content, z-index 1, scrolls       │  │
│  │ (text, links, cards, forms)            │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

Camera: `OrthographicCamera`, position about `[10, 10, 10]` looking at the origin, zoom tuned per section. Scroll moves the camera along a set of waypoints and rotates it in 90-degree steps (like turning a model on a table).

### 4.2 Section by section

| Section | What the user sees | 3D behavior |
|---|---|---|
| **1. Hero** | Giant name "Injabin Alam", one-line headline | Red sphere, blue cube, yellow cone float in an assembled stack. Pointer moves them with subtle parallax. They idle-rotate slowly |
| **2. About** | Short bio, photo (black and white, cropped square) | Shapes slide apart to the right edge, rotating to show different faces. Camera rotates 90 degrees |
| **3. Projects** | Index list of 6 projects | Each project is a **plinth** with its metaphor object. Camera dollies along the row. Hover or focus on a list item lifts and rotates its object and turns it from white to its color |
| **4. Project detail** | Case study overlay (not a separate heavy page) | The chosen object scales up and centers; HTML panel slides in from the left |
| **5. Skills** | Four groups: Languages, Web, Data/AI, Hardware | An exploded axonometric stack of blocks. Each block is a skill; groups share a color. Hover reveals the name and related projects |
| **6. Experience** | Timeline: Outlier, CanSat, App Forum, UIU | Vertical stack of slabs; thickness equals duration; camera climbs the stack |
| **7. Research and recognition** | Preprint, HackerRank, current ML research | Yellow triangle focus; a rotating tetrahedron beside the text |
| **8. Contact** | A **message form that sends mail directly** (Section 7b), plus email, LinkedIn, GitHub, resume download | All shapes reassemble into the hero stack. On successful send, the shapes snap together once as the confirmation |

### 4.3 Signature interaction

**"Assemble / disassemble".** The hero stack and the contact stack are the same three objects. Scroll disassembles them at the top and reassembles them at the bottom, so the page feels like one continuous object. Spend your effort on making this one feel perfect.

### 4.4 Rendering style (this is what makes it Bauhaus, not generic)

- `MeshBasicMaterial` or `MeshToonMaterial` with 2 steps. No PBR, no environment maps, no reflections.
- One directional light, hard shadow (`PCFShadowMap`, no soft blur), shadow color near-ink at 25 to 35% opacity.
- Black outlines via inverted-hull or `<Edges>` from drei (2px look). This gives the technical-drawing feel.
- Background: transparent so CSS `--paper` shows through.
- Optional subtle film grain via CSS only. Skip post-processing in v1.

### 4.5 Interactivity checklist

- Pointer parallax on hero shapes
- Scroll-scrubbed camera and shape positions
- Project hover/focus lifts objects; click opens detail
- Drag-to-rotate on a project object inside the detail view (`OrbitControls`, limited angles, no zoom)
- Keyboard: Tab moves between projects, Enter opens, Esc closes
- Click the monogram to reset to top

---

## 5. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | You already use it. Good SEO, easy deploy, metadata API |
| 3D | **three.js + @react-three/fiber + @react-three/drei** | Declarative 3D in React, mature ecosystem |
| Scroll | **Lenis** (smooth scroll) + **GSAP ScrollTrigger** | Scrubbed timelines are easier in GSAP than hand-rolled |
| State | **Zustand** | You already use it in AlgoArena. Holds scroll progress, active project, theme, mono mode |
| Styling | **Tailwind CSS** with tokens from Section 3, or CSS modules | Pick one. Tailwind is faster in an agent workflow |
| UI motion | **Framer Motion** (HTML overlays only) | Panel transitions. Keep 3D motion in GSAP/R3F |
| Content | **MDX or typed `.ts` data files** | Projects live as data, not hardcoded JSX |
| Hosting | **Vercel** (free tier) | Automatic builds from GitHub, preview URLs |
| Domain | Keep `injabin.is-a.dev` | See Section 10 for the CNAME step |
| Analytics | **Vercel Analytics** or Plausible | Privacy-friendly, optional |
| Email sending | **Web3Forms** (browser posts to their API) | Free, no server code, no secrets to hide, works on any domain including `is-a.dev`. Details in Section 7b |
| Validation | **Zod** | Client-side checks before sending |
| Spam protection | **Honeypot field + hCaptcha** (both free on Web3Forms) | Blocks bots without puzzles for most visitors |

Version pinning: use current stable versions at install time. Lock them in `package-lock.json`. Do not mix incompatible versions of `three`, `@react-three/fiber`, and `drei`; install them together and run `npm ls three` to confirm a single `three` instance.

---

## 6. Project structure

```
portfolio/
├── app/
│   ├── layout.tsx              # fonts, metadata, theme provider
│   ├── page.tsx                # composes HTML sections + <Scene/>
│   ├── globals.css             # design tokens (Section 3)
│   ├── opengraph-image.tsx     # social card, generated
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── scene/
│   │   ├── Scene.tsx           # <Canvas>, camera, lights, scroll rig
│   │   ├── ScrollRig.tsx       # maps scroll progress -> camera waypoints
│   │   ├── HeroStack.tsx       # sphere + cube + cone, assemble logic
│   │   ├── ProjectPlinths.tsx  # row of plinths + metaphor objects
│   │   ├── objects/            # AlgoArenaObj, NexusObj, AquaObj, ...
│   │   ├── SkillBlocks.tsx     # exploded stack, instanced
│   │   ├── ExperienceSlabs.tsx
│   │   └── materials.ts        # shared toon/basic materials, outline helper
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── ProjectDetail.tsx
│   │   ├── Skills.tsx
│   │   ├── Experience.tsx
│   │   ├── Research.tsx
│   │   └── Contact.tsx
│   └── ui/                     # Button, Rule, Icon, ThemeToggle, MonoToggle, SkipLink, ContactForm
├── content/
│   ├── projects.ts             # typed project data (Section 7)
│   ├── experience.ts
│   ├── skills.ts
│   └── site.ts                 # name, headline, links
├── lib/
│   ├── store.ts                # Zustand
│   ├── scroll.ts               # Lenis + GSAP setup
│   ├── device.ts               # GPU tier, reduced motion, WebGL support
│   └── seo.ts                  # JSON-LD
├── public/
│   ├── models/                 # only if needed, .glb with Draco
│   ├── fonts/                  # self-hosted Jost + Plex (woff2)
│   ├── resume.pdf
│   └── injabin-bw.jpg          # optimized portrait
├── scripts/
│   └── capture.mjs             # proof screenshots and video (Section 11.5)
├── .env.local                  # secrets, NEVER committed (Section 7b)
├── .agent/                     # Antigravity rules and workflows (Section 11)
├── PLAN.md                     # this file
└── package.json
```

Prefer **procedural geometry** (boxes, spheres, cones, extrusions) over imported models. It is smaller, faster, always on-brand, and needs no 3D modeling software.

---

## 7. Content model

```ts
// content/projects.ts
export type Project = {
  slug: string;
  title: string;
  year: number;
  status: 'shipped' | 'in-progress' | 'research';
  category: 'software' | 'hardware' | 'ai';       // drives color
  pitch: string;                                   // one sentence
  role: string;                                    // what YOU did
  team?: string;                                   // e.g. "Scrum master, team of N"
  award?: string;                                  // e.g. "3rd runner-up, UIU CSE Project Show"
  stack: string[];
  challenge: string;                               // the hard part
  outcome: string;                                 // result, honest
  links: { label: string; href: string }[];       // repo, live, write-up
  object: 'grid' | 'bars' | 'ripple' | 'pin' | 'house' | 'quad';
};
```

Case study template (each project detail panel, about 150 to 250 words total):
1. **What it is** (1 sentence)
2. **My part** (2 sentences)
3. **Stack** (list)
4. **The hard part** (2 to 3 sentences, with a technical decision and why)
5. **Result and what I'd do next** (2 sentences)
6. Links: GitHub, live demo, short video/GIF

Get **screenshots or a 10 to 15 second looping video** of each project. Convert to optimized WebM/MP4 and display in black-and-white by default, color on hover (fits the mono-first palette).

---

## 7b. Direct email from the contact section (Web3Forms, free)

Goal: a visitor types a message and it arrives in `injabin29@gmail.com` without opening their mail app. **Total cost: $0.** Pricing was checked in October 2026; re-check Web3Forms' pricing page before launch.

### Decision: Web3Forms

| What matters | Web3Forms free plan |
|---|---|
| Price | $0, no credit card |
| Volume | 250 submissions/month, unlimited forms, unlimited domains |
| Works on `injabin.is-a.dev` | Yes. No DNS records, no domain verification |
| Server code and secrets | None. The form posts straight to Web3Forms. The access key is designed to be public |
| Spam protection | Honeypot plus hCaptcha integration on the free plan |
| History | Submissions are emailed to you; the free plan keeps 30 days of history |

**Honest trade-offs:** 250 a month is plenty for a portfolio, but if bots flood the form you stop receiving mail until next month, so the spam layers matter. Because there is no server in the middle, you can't add your own IP rate limit. Cloudflare Turnstile is only on paid plans, so use hCaptcha. And the browser-side access key means anyone can read it; treat it as public and restrict it to your domains if the dashboard offers that on your plan.

**Plan B (only if Web3Forms fails your tests):** a Next.js route handler using Nodemailer with a Gmail app password (also free, also works on `is-a.dev`). Don't build it unless you need it.

### One-time setup (about 10 minutes)

1. Go to Web3Forms and request an access key for `injabin29@gmail.com`. The key arrives by email.
2. Add it to `.env.local` and to Vercel (Project Settings, Environment Variables), then **redeploy**:

```
NEXT_PUBLIC_WEB3FORMS_KEY=your-access-key
```

3. Enable hCaptcha following Web3Forms' current hCaptcha instructions (the agent must read those docs, because the exact steps can change).
4. If your dashboard lets you restrict the key to specific domains, allow `injabin.is-a.dev` and `localhost`.
5. Keep `.env*` in `.gitignore`.

### Flow

```
Browser form -> client checks (Zod, honeypot, hCaptcha) -> POST https://api.web3forms.com/submit -> your inbox
```

### Rules

1. Hidden honeypot field named `botcheck` (a checkbox bots tick and humans never see). Leave it empty for real users.
2. hCaptcha is required before sending.
3. Validate with Zod before posting. Limits: name 80, email 120, message 2000 characters.
4. Add a small client-side cooldown (disable the button for 60 seconds after sending). This stops accidents, not attackers.
5. Set the email subject to `Portfolio message from <name>` and make sure the visitor's email is the reply address so Reply in Gmail goes to them (check Web3Forms' docs for the exact field behavior).
6. Don't store messages yourself. Say so in one sentence under the form.
7. Always show a plain `mailto:injabin29@gmail.com` fallback link.
8. Clear errors, never silent failures.

### Client code sketch

```tsx
// components/ui/ContactForm.tsx (core of the submit handler)
const payload = {
  access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
  from_name: 'Portfolio',
  subject: `Portfolio message from ${name}`,
  name,
  email,
  message,
  botcheck: '',                     // honeypot
  'h-captcha-response': captchaToken,
};

const res = await fetch('https://api.web3forms.com/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify(payload),
});
const data = await res.json().catch(() => null);

if (res.ok && data?.success) {
  // show "Message sent." and trigger the 3D snap-together moment
} else {
  // show "Could not send. Please email me directly." plus the mailto link
}
```

This is a starting point. Have the agent check Web3Forms' current API and hCaptcha docs before wiring it.

### Making sure it actually works: 4-step test protocol

I can't send mail from this chat because I have no access to your inbox or accounts. These tests prove each link. **Do not launch until all four pass.**

**Test 1: the API alone (2 minutes).** Before any site code, with hCaptcha not yet enabled:

```
curl -X POST https://api.web3forms.com/submit \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"access_key":"YOUR_KEY","name":"Test","email":"test@example.com","message":"Hello from curl test"}'
```

Pass = the response contains `"success": true` and the email reaches `injabin29@gmail.com`.

**Test 2: the form locally.** Run `npm run dev` and try: empty form, invalid email, a message under 10 characters, one over 2000 characters, honeypot filled (no email should arrive), and a valid message with hCaptcha completed. Check every error and success state, keyboard-only too.

**Test 3: production.** After deploying with the env var set, send one real message from `https://injabin.is-a.dev`. Check your inbox **and spam**. If it lands in spam, mark "Not spam" once and add a Gmail filter for "Portfolio message".

**Test 4: phone.** Send one more from your phone's browser on mobile data.

### Common failures

| Symptom | Likely cause |
|---|---|
| "Invalid access key" | Key typo, or the env var is missing in Vercel (add it, then redeploy) |
| Works locally, fails live | Domain restriction doesn't include `injabin.is-a.dev` |
| Success shown but no email | Check spam; confirm the access key's email was verified |
| hCaptcha never appears | Script blocked or wrong setup; recheck the Web3Forms hCaptcha docs |
| Submissions suddenly stop | Monthly cap (250) reached by spam; keep captcha on, check the dashboard, wait for reset or upgrade |

### Form design (Bauhaus)

- Square inputs, 2px ink borders, no radius, labels above fields in sentence case, 3px blue focus ring.
- One red square submit button: "Send message". Success message: "Message sent."
- States: idle, sending (the red square rotates), sent (shapes snap together in the 3D scene), error (red bar above the form).
- `aria-live="polite"` for status messages, `autocomplete` on name and email, fully keyboard-accessible. Make sure the hCaptcha widget stays usable in dark and mono modes and on a 360px screen.

---

## 8. Performance, fallbacks, accessibility

### 8.1 Performance budget

| Metric | Target |
|---|---|
| Lighthouse Performance (mobile) | 85+ |
| Accessibility / Best Practices / SEO | 95+ |
| LCP | under 2.5s (hero text must paint before 3D loads) |
| Total JS (gzipped, initial) | under 300 KB, with the 3D scene lazy-loaded |
| Frame rate | 60 fps desktop, 30 fps acceptable on low-end mobile |
| Draw calls | under 100 per frame |

### 8.2 Techniques

- `dynamic(() => import('./Scene'), { ssr: false })` so the scene never blocks first paint.
- **Hero text is HTML**, not 3D text, so it renders immediately and is selectable and indexable.
- `dpr={[1, 1.5]}` on mobile, `[1, 2]` on desktop. Never uncapped.
- `frameloop="demand"` when the user is idle and nothing animates; invalidate on scroll or pointer.
- Use `InstancedMesh` for skill blocks (one draw call for all).
- Share geometries and materials; never create them inside render loops.
- Dispose of geometries/materials/textures on unmount.
- Pause rendering when the tab is hidden (`document.visibilitychange`).
- Self-host fonts as `woff2`, `font-display: swap`, subset to Latin.
- Videos: lazy-load, `preload="none"`, poster image.
- If you do use `.glb` files: compress with Draco or Meshopt, keep each under 500 KB.

### 8.3 Device tiers

`lib/device.ts` detects tier and chooses:

| Tier | Condition | Behavior |
|---|---|---|
| **High** | Desktop GPU, WebGL2 | Full scene, shadows, outlines |
| **Medium** | Most phones | No shadows, simpler outlines, dpr 1 |
| **Low / none** | No WebGL, very old device, or `prefers-reduced-motion` | **Static 2D Bauhaus fallback**: the same layout with SVG shapes (circle, square, triangle). The site must still look great and work fully |

### 8.4 Accessibility rules

- The `<canvas>` is `aria-hidden="true"`. All information exists as real HTML.
- Skip link to main content as the first focusable element.
- Landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`. One `<h1>`.
- Every 3D interaction has a keyboard and a plain-link equivalent (the project list is a normal `<ul>` of links).
- `prefers-reduced-motion: reduce` means: disable smooth scroll, disable idle rotation, snap between camera positions instead of tweening.
- No content that appears only on hover.
- Test with keyboard only, and with a screen reader (VoiceOver or NVDA) once before launch.

---

## 9. SEO and sharing

- `metadata` in `layout.tsx`: title `Injabin Alam | Software engineer`, description matching the headline.
- JSON-LD `Person` schema: name, jobTitle, alumniOf (United International University), sameAs (LinkedIn, GitHub, ResearchGate).
- Open Graph / Twitter card: auto-generated Bauhaus card (black, red circle, blue square, yellow triangle, name). This is what people see when they paste your link in LinkedIn or WhatsApp. Make it good.
- Real `sitemap.xml` and `robots.txt`.
- Update LinkedIn "Website" field, GitHub profile README, and resume header to this URL.
- Add a downloadable one-page `resume.pdf`. Recruiters often want it before anything else.

---

## 10. Deployment and domain

1. Push the repo to GitHub (private while building, public when ready).
2. Import into **Vercel**; every push to `main` deploys, every PR gets a preview URL.
3. **`is-a.dev` domain:** subdomains are managed through a pull request to the `is-a-dev/register` repository on GitHub. Edit your existing JSON file so the `CNAME` record points to your Vercel target (for example `cname.vercel-dns.com`), and add the custom domain in Vercel. Check the current instructions in that repo's README before doing this, because the process and format can change.
4. Wait for DNS and HTTPS to finish, then verify.
5. Keep the old site reachable (an `/old` branch or a separate Vercel project) until the new one is verified.

---

## 11. Working in Antigravity

Antigravity works best when the agent has **rules (always-on instructions)** and **small, verifiable tasks**. Check the current Antigravity docs for the exact location and format of rules and workflow files; the usual convention is a project-level `.agent/` folder.

### 11.1 Rules file (paste into your project rules)

```
# Project rules: Bauhaus 3D portfolio

- Stack: Next.js App Router, TypeScript strict, Tailwind, three + @react-three/fiber + drei, GSAP ScrollTrigger, Lenis, Zustand.
- Visual style: Bauhaus. Only circles, squares, triangles. Flat/toon materials, hard shadows, black outlines. No gradients, glow, glassmorphism, or rounded UI cards.
- Colors only from tokens in globals.css: ink, paper, white, red, blue, yellow, grey. 90% monochrome.
- Fonts: Jost (display), IBM Plex Sans (body), IBM Plex Mono (code only). No emoji, no all-caps tracked labels.
- All content lives in /content as typed data. Never hardcode copy in components.
- The 3D canvas is aria-hidden; all information must exist as real HTML.
- Always respect prefers-reduced-motion and provide the static fallback.
- Performance: lazy-load the scene, cap dpr, use instancing, dispose resources.
- Before finishing any task: run `npm run lint`, `npm run build`, and report errors. Do not add dependencies without saying why.
- Make one focused change per task. Show a screenshot or describe how to verify.
- Contact form: use Web3Forms from the browser (no server route). Never commit .env files. Do not mark the contact feature done until the 4-step test protocol in Section 7b passes.
- Applied ML research is confidential: never add details beyond the single approved line.
- GitHub username is ninja-bean. Contact email is injabin29@gmail.com. Do not add a phone number or home address anywhere.
- After every phase, run the proof capture (Section 11.5) and attach the screenshots and the screen recording as artifacts. A phase is not finished without proof. If you cannot capture proof, say so instead of claiming success.
- Never claim something works unless you ran it and saw it work. Report failures plainly.
```

### 11.2 Build in this order (one agent task per step)

Each step is small enough to verify before moving on. Do not ask for "the entire site" in one prompt. **Every phase ends with proof (Section 11.5): screenshots and a screen recording attached by the agent.**

| Phase | Task | Done when |
|---|---|---|
| **A. Foundation** | Scaffold Next.js + TS + Tailwind. Add design tokens, fonts, layout, theme toggle, mono toggle | Blank page shows correct fonts, colors, dark/light switch |
| **B. Content** | Create `/content` files with real copy from Section 2 | Data typed, no copy in components |
| **C. 2D layout first** | Build all HTML sections with the Bauhaus grid, **no 3D yet** | Site is complete, readable, accessible, and responsive as a flat page. This is also your fallback |
| **D. Scene base** | Add the persistent canvas, orthographic camera, lights, materials, outline helper, lazy load | Empty stage renders, no layout shift, LCP unaffected |
| **E. Hero** | Build `HeroStack`: three primitives, idle rotation, pointer parallax | Looks right at 360px and 1920px widths |
| **F. Scroll rig** | Lenis + GSAP ScrollTrigger drive camera waypoints and the assemble/disassemble move | Smooth, scrubbed, reversible, no jank |
| **G. Projects** | Plinths and metaphor objects, hover/focus sync with the HTML list, detail overlay | Mouse and keyboard both work |
| **H. Skills, experience, research, contact** | Instanced skill blocks, slabs, final reassemble, **working contact form (Section 7b)** | Each section's 3D matches its content; a test message arrives in your inbox |
| **I. Fallbacks and a11y** | Device tiers, reduced motion, static SVG version, keyboard/skip link | Works with WebGL disabled |
| **J. Performance pass** | Profile, trim, compress | Meets budget in 8.1 |
| **K. SEO and OG** | Metadata, JSON-LD, OG image, sitemap | Link preview looks right |
| **L. Deploy** | Vercel, domain, final QA | Live at your URL |

### 11.3 Prompt pack (copy, adapt, run one at a time)

**Phase A**
> Scaffold a Next.js App Router project in TypeScript with Tailwind. Create `globals.css` with CSS variables: --ink #000000, --paper #F5F5F0, --white #FFFFFF, --red #E10600, --blue #0033A0, --yellow #FFC700, --grey #5C5C58, with a dark-theme override and a `data-mono` override that turns the primaries to black/white/grey. Self-host Jost and IBM Plex Sans via next/font. Add a header with a theme toggle and a mono toggle (stored in Zustand and localStorage). Border-radius 0 everywhere. Run lint and build.

**Phase C**
> Using content from /content, build the Hero, About, Projects, Skills, Experience, Research and Contact sections as plain HTML on a 12-column grid. Bauhaus layout: huge flush-left name cropped by the viewport edge, 4px black rules as dividers, one rotated section title. No 3D yet. It must look finished on its own at 360px, 768px and 1440px. Include a skip link and visible focus states.

**Phase D/E**
> Add a fixed full-screen React Three Fiber Canvas behind the content, lazy-loaded with ssr:false. Use an OrthographicCamera at an isometric angle, transparent background, one directional light with a hard shadow, and flat toon materials with black edge outlines using drei `<Edges>`. Build `HeroStack`: a red sphere, blue cube and yellow cone stacked, slowly rotating, with subtle pointer parallax. `aria-hidden` on the canvas. Cap dpr at 1.5 on mobile.

**Phase F**
> Add Lenis smooth scroll and a GSAP ScrollTrigger timeline that writes scroll progress to the Zustand store. Create `ScrollRig` that moves the camera through waypoints, one per section, and disassembles the hero stack as the user leaves the hero. Scroll must be fully reversible and scrubbed. Disable smooth scroll and snap positions when prefers-reduced-motion is set.

**Phase G**
> Build `ProjectPlinths`: one plinth per project with a procedural metaphor object (grid with extruded walls for AlgoArena, stacked bars for Nexus Stock AI, circle with ripple rings for AquaSweep, etc.). Objects are white by default and take their category color on hover or keyboard focus of the matching item in the HTML list. Clicking opens the ProjectDetail panel with the case study; Esc closes it.

**Phase H (contact form)**
> Build the contact section form (name, email, message) styled to the Bauhaus tokens. It posts directly from the browser to the Web3Forms API (`https://api.web3forms.com/submit`) using `NEXT_PUBLIC_WEB3FORMS_KEY`, with a hidden honeypot field named `botcheck`, hCaptcha enabled per Web3Forms' current docs (read them first), and Zod validation (name 80, email 120, message 2000 characters). Subject: "Portfolio message from <name>". Add a 60-second client-side cooldown after a send, clear error and success states with aria-live, and a mailto fallback link to injabin29@gmail.com. Create `.env.example` with an empty key and make sure `.env*` is in `.gitignore`. Do not build a server route. Write a short manual test checklist, then run the four tests from Section 7b that you can (the API test with curl; the form states), and tell me which tests only I can do (inbox, spam folder, phone).

**Phase I**
> Add `lib/device.ts` to detect WebGL support, GPU tier and reduced motion. For low tier or no WebGL, render a static SVG composition of the same three shapes instead of the canvas. Verify the whole site works with WebGL disabled.

### 11.4 Verification habits

- After each phase, open the site in the Antigravity browser and in your real phone browser.
- Ask the agent to **describe what changed and how to verify it** before you accept.
- Commit after every working phase (`git commit -m "phase E: hero stack"`). If a step breaks things, you can revert instead of untangling.
- If the agent adds a heavy or unneeded dependency, reject it.
- Don't let it "fix" a design issue by adding gradients, shadows or rounded corners. Point it back to the rules.

---

## 11.5 Proof: screenshots and screen recordings (the agent makes these)

Rule: **the agent proves each phase with images and video, you review them.** You should never have to take your own screenshots to check progress. Ask the agent to attach the results as artifacts in the Antigravity task view, and also save them in the repo under `proof/<phase-name>/` so you have a visual history.

### What the agent must capture after every phase

| Proof | Details |
|---|---|
| Screenshots, 3 sizes | Phone 390x844, tablet 820x1180, desktop 1440x900 |
| Themes | Light, dark, and mono mode |
| Sections | One screenshot per section as it scrolls into view (not just the top of the page) |
| Screen recording | 20 to 40 second desktop recording that scrolls the whole page and shows hover and click interactions of the current phase |
| Edge cases | Reduced motion on; WebGL disabled (static fallback); keyboard-only focus ring visible |
| Numbers | Lighthouse scores (mobile) and the build output size, in a short `proof/<phase>/report.md` |

### Ask the agent to make the capture script once (Phase A), then reuse it

Prompt:

> Add Playwright as a dev dependency (`npm i -D playwright` and `npx playwright install chromium`). Create `scripts/capture.mjs` that starts from `BASE_URL` (default `http://localhost:3000`) and, for phone, tablet and desktop sizes in light and dark mode, scrolls the page in steps and saves a screenshot at each step into `proof/<name>/`. Also record a video of the desktop light run (Playwright `recordVideo`), and make extra runs with `reducedMotion: 'reduce'` and with WebGL disabled. Add `npm run proof -- <phase-name>`. Then run it and attach the output to this task.

Starting point for the script (let the agent refine it):

```js
// scripts/capture.mjs
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const name = process.argv[2] ?? 'latest';
const out = `proof/${name}`;
fs.mkdirSync(out, { recursive: true });

const sizes = {
  phone: { width: 390, height: 844 },
  tablet: { width: 820, height: 1180 },
  desktop: { width: 1440, height: 900 },
};

const browser = await chromium.launch();

async function run(label, size, opts = {}, record = false) {
  const ctx = await browser.newContext({
    viewport: size,
    ...opts,
    ...(record ? { recordVideo: { dir: out, size } } : {}),
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  let i = 0;
  for (let y = 0; y < height; y += Math.round(size.height * 0.8)) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${out}/${label}-${String(i++).padStart(2, '0')}.png` });
  }
  await ctx.close(); // finalizes the video file
}

for (const [sizeName, size] of Object.entries(sizes)) {
  for (const scheme of ['light', 'dark']) {
    await run(`${sizeName}-${scheme}`, size, { colorScheme: scheme }, sizeName === 'desktop' && scheme === 'light');
  }
}
await run('desktop-reduced-motion', sizes.desktop, { reducedMotion: 'reduce' });
await browser.close();
console.log('Proof saved in', out);
```

Notes for the agent: smooth scroll (Lenis) can ignore `window.scrollTo` jumps, so wait after each step or temporarily expose a test hook; a WebGL-disabled run needs the browser launched with GPU/WebGL flags turned off (adapt the `launch` call for that run); rename the video file after the context closes.

### Per-phase proof requests (append to each phase prompt)

> When done, run `npm run proof -- phase-X`, attach the screenshots and the screen recording to this task, and summarize them: what looks right, what looks wrong, and what you would fix next.

### Special proof

- **Phase E (hero):** a 10-second recording of pointer parallax on the hero stack, plus a screenshot at 390px width.
- **Phase F (scroll rig):** a full-page scroll recording showing the assemble/disassemble motion, scrolling down **and back up** to prove it is reversible.
- **Phase G (projects):** recording of hovering each project, opening a detail panel, and closing it with Esc.
- **Phase H (contact):** screenshots of every form state (empty, error, sending, sent) and a **real inbox screenshot** that you take yourself of the received test email (the agent can't see your inbox).
- **Phase I (fallbacks):** screenshots with WebGL disabled and with reduced motion, proving the static version looks finished.
- **Phase J (performance):** Lighthouse report screenshots (mobile and desktop).
- **Phase K (SEO):** a screenshot of the Open Graph image, and the link preview as it shows in a LinkedIn or WhatsApp paste (you do this one).
- **Phase L (deploy):** the same capture run against the live URL: `BASE_URL=https://injabin.is-a.dev npm run proof -- live`.

### Review checklist for proof (you, 2 minutes per phase)

- Does it look Bauhaus: flat shapes, black outlines, no gradients, no rounded cards?
- Is text readable on every screenshot, including dark and phone sizes?
- Does the video run smoothly, with no jumps, and does it work backwards?
- Does anything overflow sideways on the phone screenshots?
- Is the fallback screenshot (no WebGL) still good-looking?

If something fails, reply with the screenshot name and what is wrong. The agent can then fix that exact thing.

---

## 12. Quality checklist before launch

**Design**
- [ ] Only circles, squares, triangles, straight lines
- [ ] 90% black/white, primaries used with meaning
- [ ] One memorable moment (assemble/disassemble); everything else quiet
- [ ] No emoji, gradients, glow, soft shadows, rounded cards
- [ ] Looks good in light, dark and mono modes

**Content**
- [ ] Same headline as LinkedIn and GitHub
- [ ] Every project has role, challenge, outcome, and a working link
- [ ] No fake XP, levels, or percentage skill bars
- [ ] No dead `#` links
- [ ] No phone number or home address
- [ ] Research mentioned in one neutral line only
- [ ] GitHub links all use `ninja-bean`
- [ ] Resume PDF present and current

**Technical**
- [ ] Lighthouse targets met on mobile
- [ ] Works with WebGL off, reduced motion on, and keyboard only
- [ ] No console errors; build passes
- [ ] Contact form: all 4 tests in Section 7b passed, including a real send from the live site and from a phone
- [ ] No secrets in the repo history (`git log -p | grep -i key` as a quick check)
- [ ] Scene disposes resources; no memory growth after scrolling for 2 minutes
- [ ] Tested on Chrome, Safari (iOS), Firefox, and one low-end Android phone

**Proof**
- [ ] `proof/` has screenshots (phone, tablet, desktop; light, dark, mono) and a screen recording for every phase
- [ ] A WebGL-off screenshot set and a reduced-motion set exist
- [ ] Final run against the live URL captured and reviewed

**Distribution**
- [ ] OG image previews correctly in LinkedIn and WhatsApp
- [ ] Domain and HTTPS working
- [ ] LinkedIn, GitHub, ResearchGate, resume all link to the new site

---

## 13. Maintenance

- **Add a project:** add one entry to `content/projects.ts` and, if you want a custom 3D object, one file in `scene/objects/`. Nothing else.
- **Monthly:** update experience and recent work, run Lighthouse, run `npm outdated`.
- **Dependencies:** upgrade `three`, `@react-three/fiber` and `drei` together, never one at a time.
- **After adding anything 3D:** re-check frame rate and draw calls (use `r3f-perf` in development only).
- **Keep a changelog** in the repo README. It also shows recruiters that you maintain things.

---

## 14. Suggested timeline (part-time, alongside university)

| Week | Focus |
|---|---|
| 1 | Fix content and positioning (Section 0 and 2), gather screenshots/videos, write case studies, Phase A to C |
| 2 | Phases D to F: scene base, hero, scroll rig |
| 3 | Phases G to H: projects, skills, experience, contact |
| 4 | Phases I to L: fallbacks, accessibility, performance, SEO, deploy |

Realistic minimum for a first version: **Phase A to C plus the hero and project plinths**. Ship that, then iterate. A finished simple version beats an unfinished perfect one.

---

## 15. Decisions locked in, and what is still open

**Locked in (from you):**
- Focus: software engineering first; hardware is a secondary strength
- Applied ML research: early stage and confidential, one neutral line only
- GitHub: `github.com/ninja-bean`
- Public email: `injabin29@gmail.com`; no phone, no address
- GovConnect: PHP project, currently being ported to Next.js for fun
- No Bangla language option
- Direct email sending from the contact section (Section 7b)
- Project contributions and the AlgoArena "hard part" (Section 2)

**Still open (do these before Phase B):**
1. Export clean screenshots of AlgoArena, Nexus Stock AI, AquaSweep, NextNest, GovConnect and the VTOL CAD model ss is already given. Crop them square or 4:3, at about 1600px wide.
2. For AquaSweep: name one real sensor or calibration problem you solved, and add the year of the Project Show.
3. For Nexus Stock AI: team size, and one concrete scrum-master example (a PR you pushed back on, a task you split).
4. For VTOL drone: confirm whether the LinkedIn phrase "flight controller firmware" is accurate for you; if not, edit LinkedIn so both match.
5. A short, honest line on the CAD design: key parameters (wingspan, configuration) if you are allowed to share them.
6. Check every old repo link (`Injabin/...`) and move or re-link to `ninja-bean`.
7. Pin your 4 best repos on GitHub and add a README with a screenshot to each. Recruiters will click through from the portfolio.
8. Request your Web3Forms access key (sent to injabin29@gmail.com) and create a free Vercel account.
9. A black-and-white, square-cropped portrait for the About section.
