# Ralph Laurence O. Bayya — Portfolio

Portfolio with a dedicated printable résumé and a PHP/MySQL contact API.
**HTML5 · CSS3 · vanilla JS · PHP · MySQL · Docker Compose.** No Node build step.

---

## Run it

Run the complete site and API with Docker Compose:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
notepad .env
docker compose up --build -d
```

Open <http://localhost:8080>. The contact API writes submissions to the MySQL
database managed by Compose. The first database start creates its table from
`backend/database/init.sql`; the named volume keeps submissions across restarts.
For the database passwords, phpMyAdmin login, and more Docker commands, see
[`DOCKER-DATABASE-GUIDE.md`](DOCKER-DATABASE-GUIDE.md).
To stop the services, run `docker compose down`. To also erase the local database
and all saved submissions, run `docker compose down -v`.

The `.env` values are for local development only. Replace the database passwords
before using this setup in a shared or production environment.

```bash
node tools/validate.js  # → "All checks passed."
```

---

## Edit your content

**All text lives in `assets/js/data.js`.** Services, skills, projects, certifications,
résumé entries, seminars and awards — change them there and the page updates.

Then replace the two things that can't be edited as text:

1. **Photos** → `assets/img/avatar.svg` (400×400) and `project-*.svg` (600×375).
   Regenerate the placeholders any time with `.\tools\generate-placeholders.ps1`.
2. **Social links** → the `socials` array. Any `url: "#"` is a deliberate placeholder;
   paste your real GitHub / LinkedIn URLs and they light up.

Export the résumé PDF: open `resume.html` → Print → Save as PDF →
`assets/resume/Ralph-Bayya-Resume.pdf`.

---

## Sections

`Home` · `About` · `Capabilities` · `Skills` · `Projects` · `Résumé` · `Recognition` · `Contact`

---

## Highlights

- Dark / light theme toggle, persisted to `localStorage`, shared with the résumé page
- Animated particle-network hero canvas with mouse interaction, plus ambient glow orbs
- Liquid-glass cards (`backdrop-filter`), film-grain overlay, conic-gradient avatar ring
- Typewriter headline + count-up hero statistics on scroll
- Filterable project grid with case-study modals
- Experience / education / certification timelines + seminars list
- Animated skill bars, toolkit chips, certification list
- Awards & recognition grid (replaces a testimonial carousel — all content is verifiable)
- Fully validated contact form with character counter and draft autosave
- Scroll progress bar, back-to-top, toasts, scroll-reveal animations
- Responsive from 320px, `prefers-reduced-motion` respected, print-optimised A4 résumé
- Semantic HTML, ARIA labels, visible focus states, lazy-loaded images

---

## Contact API

The contact form posts JSON to `backend/api/contact.php`. PHP validates every
field and inserts the message using a prepared PDO statement. The API and
database credentials are configured through `.env`; do not commit that file.
See [`description.md` §7](description.md) for the API contract and database
schema.

---

## Dependencies

Both from CDN — self-host if you need offline:

- Bootstrap 5.3.3 (CSS + JS bundle)
- Bootstrap Icons 1.11.3

The backend uses PHP 8.3 with PDO MySQL and MySQL 8.4, orchestrated by Docker Compose.

---

## Full documentation

[`description.md`](description.md) — file map, data schema, design tokens, rendering map,
behaviour modules, accessibility notes and a pre-publish checklist.