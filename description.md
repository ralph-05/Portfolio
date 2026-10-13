# Portfolio — Ralph Laurence O. Bayya

Static site. **HTML5 · CSS3 · vanilla JS · Bootstrap 5.3.** No build step, no `npm install`.
Open `index.html` and it runs.

> This file is the single reference for the project. Keep it short — details belong in
> `assets/js/data.js`, which is the real source of truth for content.

---

## 1. Files

```
index.html                 Portfolio page
resume.html                Standalone printable résumé
description.md             This file
README.md                  Quick start

assets/
  css/style.css            Portfolio styles (design tokens → print)
  css/resume.css           Résumé layout + @media print
  js/data.js                ALL CONTENT — edit this first
  js/main.js               All behaviour (18 numbered modules)
  img/*.svg                Placeholder images — replace with real ones
  resume/                  Drop Ralph-Bayya-Resume.pdf here

tools/
  generate-placeholders.ps1   Regenerates the SVG placeholders
  validate.js                 Sanity-checks data, assets and DOM ids
```

```bash
node tools/validate.js       # must print "All checks passed."
```

---

## 2. Run & deploy

```bash
start index.html             # or: npx serve .
```

Static — deploy to GitHub Pages, Netlify, Vercel or Cloudflare Pages with no build command,
publish directory `.`.

---

## 3. Editing content

**Everything lives in `assets/js/data.js`.** No HTML edits needed for text changes.

| Key | Drives |
| --- | --- |
| `profile` | Name, role, location, email, phone, availability |
| `socials` | Social buttons — `url: "#"` renders a placeholder |
| `techStack` | Scrolling marquee under the hero |
| `services` | "Skills & Capabilities" cards |
| `skills` | Animated progress bars (`percent` drives the fill) |
| `toolkits` | Chip cloud |
| `certifications` | Sidebar certification list |
| `stats` | Hero counters |
| `projects` | Filterable project grid + case-study modal |
| `resumeFacts` / `experience` / `education` / `resumeCerts` | Résumé section timelines |
| `seminars` | Seminars & training list |
| `awards` | Awards & recognition grid |

### Project shape

```js
{
    id: "p5", title: "Project Name",
    category: "web",          // must match a data-filter button in index.html
    image: "assets/img/project-5.svg",
    tags: ["React", "SQL"],
    summary: "One line.",
    description: "Longer paragraph.",
    highlights: ["Result one", "Result two"],
    metrics: [{ value: "12M", label: "events / day" }],
    role: "Your role", year: "2026",
    live: "", repo: ""        // "" or "#" hides the link automatically
}
```

Categories currently in use: `network`, `security`, `systems`, `web`.
To add one, add a matching `<button class="filter-btn" data-filter="…">` in `index.html`.

---

## 4. Design system

All tokens live at the top of `assets/css/style.css`. Re-skin the whole site from there.

```css
:root {
    --primary: #38bdf8;  --primary-rgb: 56, 189, 248;
    --grad-a: #2563eb;   --grad-b: #06b6d4;   --grad-c: #8b5cf6;
    --glass-bg / --glass-blur / --glass-border;
    --glow-1 / --glow-2 / --glow-3;   /* ambient orbs, per theme */
    --grain-opacity;
}
```

Surface colours are defined twice — once in `[data-bs-theme="dark"]`, once in
`[data-bs-theme="light"]`. Change both.

Visual techniques in use (inspired by spline.design + design.dev):

- `.glass` / `.card-panel` — liquid-glass surfaces via `backdrop-filter`, with a specular
  top-edge sheen and a `@supports` fallback to solid surfaces.
- `.glow-orb` — blurred ambient colour blobs for depth.
- `.grain` — fixed SVG `feTurbulence` noise layer that kills gradient banding.
- `.hero-grid-overlay` — masked CSS grid.
- Conic-gradient rings and glow halos around the avatar.
- Fluid type everywhere via `clamp()`.

---

## 5. Rendering map

`index.html` holds empty containers; `main.js` fills them.

| Container | Data key |
| --- | --- |
| `#heroStats` | `stats` |
| `#marqueeTrack` | `techStack` |
| `#servicesGrid` | `services` |
| `#skillCarousel` / `#toolChips` / `#certList` | `skills` / `toolkits` / `certifications` |
| `#projectsGrid` | `projects` |
| `#resumeFacts` / `#timelineExperience` / `#timelineEducation` / `#timelineCerts` | résumé keys |
| `#seminarList` | `seminars` |
| `#awardsGrid` | `awards` |
| `#contactList` / `#socialRow` / `#footerNav` / `#footerContact` / `#footerSocial` | `profile` / `socials` |

After injecting new `.reveal` elements call `initReveal()`. After injecting
`[data-count]` elements call `initCounters()`.

---

## 6. Behaviour modules (main.js)

1. Helpers · 2. Theme · 3. Preloader · 4. Navbar · 5. Scroll progress & back-to-top ·
6. Hero particle canvas · 7. Typewriter · 8. Counters · 9. Reveal on scroll ·
10. Hero stats · 11. Marquee · 12. Capabilities · 13. Skills · 14. Projects
(+ filter, load-more, case-study modal) · 15. Résumé · 16. Awards · 17. Contact & footer ·
18. Contact form · 19. Smooth anchors

Constants worth knowing: `PAGE_SIZE = 6` (projects per batch), `THEME_KEY = "portfolio-theme"`
(shared with `resume.html`).

---

## 7. Contact API and database

The contact form sends a JSON `POST` to `/api/contact.php`. The PHP endpoint
validates the name, email, optional phone, allowed subject, message, and required
consent, then stores the submission with a prepared PDO statement in MySQL.
It returns JSON with HTTP `201` after a successful insert, `422` for invalid
fields, and a non-success status if the request cannot be saved. The browser
keeps unsent drafts in local storage and clears the saved draft only after a
successful API response.

Run the frontend, PHP/Apache API, and database together from the repository root:

```powershell
Copy-Item .env.example .env
docker compose up --build
```

Open `http://localhost:8080`. Compose waits for MySQL's health check before
starting the web service. MySQL initializes the `contact_messages` table from
`backend/database/init.sql` on the first start and keeps its data in the
`portfolio_db` volume. To remove the local database and all stored messages,
run `docker compose down -v`. The `.env.example` credentials are for local
development only; use managed secrets and appropriate backups/rate limiting
before exposing the endpoint publicly.

### API request

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "",
  "subject": "Network operations",
  "message": "I would like to discuss a network support role.",
  "consent": true
}
```

Successful response: `201 Created` with `{"message":"Message received."}`.
Validation failures return `422` with an `error` message. The endpoint does
not expose stored submissions or database credentials.

---

## 8. Accessibility & support

- Semantic landmarks, skip link, visible `:focus-visible` outlines.
- Filter buttons use `role="tab"` + `aria-selected`; toggles have `aria-label`.
- All inputs labelled, `required`, with `.invalid-feedback`; errors announced via `was-validated`.
- `prefers-reduced-motion` disables the canvas, typewriter, counters, reveals and smooth scroll.
- Decorative images are `aria-hidden`; below-fold images use `loading="lazy"`.
- Targets: Chrome/Edge 90+, Firefox 90+, Safari 15.4+.

---

## 9. Before you publish

- [ ] Paste real GitHub / LinkedIn / Facebook URLs into `socials` in `data.js` (search `TODO:`)
- [ ] Add `live` / `repo` URLs to projects that have public links
- [ ] Replace `assets/img/avatar.svg` with a real 400×400 photo
- [ ] Replace `project-*.svg` with real 600×375 screenshots
- [ ] Export the PDF → `assets/resume/Ralph-Bayya-Resume.pdf`
- [ ] Wire the contact form (§7) and remove the `console.log`
- [ ] Update `<title>`, meta description and Open Graph tags if anything changed
- [ ] Test on a phone, in both themes, keyboard-only
- [ ] `node tools/validate.js`

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Markup | HTML5, semantic elements, ARIA |
| Styling | Bootstrap 5.3 + custom CSS design tokens, Bootstrap Icons |
| Behaviour | Vanilla ES6+ IIFE, Canvas 2D, IntersectionObserver, localStorage |
| Backend | PHP 8.3, PDO MySQL, MySQL 8.4 |
| Local environment | Docker Compose |
| Frontend dependencies | Bootstrap 5.3.3, Bootstrap Icons 1.11.3 (CDN) |