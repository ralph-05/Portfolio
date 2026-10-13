/* ==========================================================================
   main.js — All portfolio behaviour
   --------------------------------------------------------------------------
   1.  Helpers
   2.  Theme (dark / light with localStorage)
   3.  Preloader
   4.  Navbar: scroll state, mobile close, active link
   5.  Scroll progress + back-to-top
   6.  Hero canvas particle network
   7.  Typewriter
   8.  Counter animation
   9.  Reveal on scroll
   10. Render: tech marquee
   11. Render: services
   12. Render: skills
   13. Render: projects (+ filtering, load more, modal)
   14. Render: resume (+ seminars)
   15. Render: awards & recognition
   16. Render: contact + footer
   17. Contact form validation & API submission
   18. Smooth anchor scrolling
   ========================================================================== */

(function () {
    "use strict";

    const D = window.PORTFOLIO_DATA;
    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- 1. HELPERS ---------- */
    const esc = (str = "") =>
        String(str).replace(/[&<>"']/g, c =>
            ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

    const socialIcon = name =>
        ({
            GitHub: "bi-github",
            LinkedIn: "bi-linkedin",
            Facebook: "bi-facebook",
            X: "bi-twitter-x",
            Dribbble: "bi-dribbble",
            "Stack Overflow": "bi-stack-overflow",
            Email: "bi-envelope-fill"
        }[name] || "bi-link-45deg");

    /** A placeholder URL is "#" — treat it as "not set yet". */
    const isReal = url => !!url && url !== "#" && url !== "";

    let toastInstance = null;
    function showToast(message, icon = "bi-check-circle-fill") {
        const el = $("#liveToast");
        if (!el) return;
        $("#toastMessage").innerHTML = `<i class="bi ${icon} me-2 text-primary"></i>${esc(message)}`;
        if (toastInstance) toastInstance.dispose();
        toastInstance = new bootstrap.Toast(el, { delay: 3600 });
        toastInstance.show();
    }

    /* ---------- 2. THEME ---------- */
    const THEME_KEY = "portfolio-theme";

    function applyTheme(theme) {
        document.documentElement.setAttribute("data-bs-theme", theme);
        const meta = $('meta[name="theme-color"]');
        // Matches --body-bg in style.css for each theme
        if (meta) meta.setAttribute("content", theme === "dark" ? "#070b14" : "#f5f8fd");
    }

    (function initTheme() {
        let saved = null;
        try { saved = localStorage.getItem(THEME_KEY); } catch (_) { /* private mode */ }
        const systemLight = window.matchMedia("(prefers-color-scheme: light)").matches;
        applyTheme(saved || (systemLight ? "light" : "dark"));
    })();

    $("#themeToggle")?.addEventListener("click", () => {
        const next = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        try { localStorage.setItem(THEME_KEY, next); } catch (_) { /* ignore */ }
        showToast(`${next === "dark" ? "Dark" : "Light"} theme enabled`, "bi-palette-fill");
    });

    /* ---------- 3. PRELOADER ---------- */
    window.addEventListener("load", () => {
        const preloader = $("#preloader");
        if (!preloader) return;
        setTimeout(() => {
            preloader.classList.add("hidden");
            document.body.classList.add("loaded");
            initReveal();
            setTimeout(() => preloader.remove(), 700);
        }, 350);
    });

    /* ---------- 4. NAVBAR ---------- */
    const nav = $("#mainNav");

    function navScrollState() {
        const scrolled = window.scrollY > 40;
        nav?.classList.toggle("scrolled", scrolled);

        const backToTop = $("#backToTop");
        backToTop?.classList.toggle("show", window.scrollY > 500);

        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
        const bar = $("#scrollProgressBar");
        if (bar) bar.style.width = pct + "%";
    }

    let ticking = false;
    window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { navScrollState(); ticking = false; });
    }, { passive: true });
    navScrollState();

    $$(".navbar .nav-link").forEach(link => {
        link.addEventListener("click", () => {
            const menu = $("#navMenu");
            const collapse = bootstrap.Collapse.getInstance(menu);
            if (collapse) collapse.hide();
        });
    });

    /* Active nav link on scroll (fallback for browsers w/o scrollspy) */
    const sections = $$("main section[id]");
    const navLinks = $$(".navbar .nav-link");

    if (sections.length && navLinks.length && !("IntersectionObserver" in window)) {
        window.addEventListener("scroll", () => {
            let current = "home";
            sections.forEach(s => { if (window.scrollY >= s.offsetTop - 160) current = s.id; });
            navLinks.forEach(l =>
                l.classList.toggle("active", l.getAttribute("href") === "#" + current));
        }, { passive: true });
    }

    /* ---------- 5. BACK TO TOP ---------- */
    $("#backToTop")?.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });

    /* ---------- 6. HERO CANVAS ---------- */
    (function heroCanvas() {
        const canvas = $("#heroCanvas");
        if (!canvas || prefersReducedMotion) { if (canvas) canvas.style.display = "none"; return; }

        const ctx = canvas.getContext("2d");
        let particles = [];
        let w = 0, h = 0, raf = null;
        const mouse = { x: -9999, y: -9999 };

        const isDark = () => document.documentElement.getAttribute("data-bs-theme") === "dark";
        const lineColor = () => (isDark() ? "79,140,255" : "79,140,255");
        const dotAlpha  = () => (isDark() ? 0.55 : 0.4);

        function resize() {
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = rect.width; h = rect.height;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = Math.min(Math.round(w / 9000), 110);
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 1.8 + 0.8
            }));
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);

            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${lineColor()},${dotAlpha()})`;
                ctx.fill();
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i], b = particles[j];
                    const dx = a.x - b.x, dy = a.y - b.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 135) {
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(${lineColor()},${0.16 * (1 - dist / 135)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }

                // mouse proximity link
                const p = particles[i];
                const mDist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
                if (mDist < 170) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(${lineColor()},${0.28 * (1 - mDist / 170)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            raf = requestAnimationFrame(draw);
        }

        function start() { if (!raf) raf = requestAnimationFrame(draw); }
        function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

        resize(); draw();

        let rt;
        window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 200); });
        document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());

        const hero = $("#home");
        hero.addEventListener("mousemove", e => {
            const rect = hero.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        hero.addEventListener("mouseleave", () => { mouse.x = mouse.y = -9999; });
    })();

    /* ---------- 7. TYPEWRITER ---------- */
    (function typewriter() {
        const el = $(".typewriter");
        if (!el) return;
        const words = JSON.parse(el.dataset.words || '["text"]');

        if (prefersReducedMotion) { el.textContent = words[0]; return; }

        let w = 0, c = 0, deleting = false;

        (function tick() {
            const word = words[w];
            el.textContent = word.slice(0, c);

            let delay = deleting ? 45 : 95;
            if (!deleting && c === word.length) { delay = 1600; deleting = true; }
            else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 350; }
            else c += deleting ? -1 : 1;

            setTimeout(tick, delay);
        })();
    })();

    /* ---------- 8. COUNTER ANIMATION ---------- */
    function initCounters() {
        const nodes = $$("[data-count]:not([data-counted])");
        if (!nodes.length) return;

        if (!("IntersectionObserver" in window)) {
            nodes.forEach(n => {
                n.textContent = n.dataset.count + (n.dataset.suffix || "");
                n.dataset.counted = "1";
            });
            return;
        }

        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const node = entry.target;
                node.dataset.counted = "1";
                const target = parseFloat(node.dataset.count);
                const suffix = node.dataset.suffix || "";
                const dur = 1600;
                const start = performance.now();

                (function step(now) {
                    const p = Math.min((now - start) / dur, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    node.textContent = Math.round(target * eased) + suffix;
                    if (p < 1) requestAnimationFrame(step);
                    else node.textContent = target + suffix;
                })(start);

                io.unobserve(node);
            });
        }, { threshold: 0.4 });

        nodes.forEach(n => io.observe(n));
    }
    initCounters();

    /* ---------- 9. REVEAL ON SCROLL ---------- */
    let revealObserver = null;

    function initReveal() {
        const items = $$(".reveal:not(.revealed)");
        if (!items.length) return;

        if (!("IntersectionObserver" in window) || prefersReducedMotion) {
            items.forEach(i => i.classList.add("revealed"));
            return;
        }

        if (!revealObserver) {
            revealObserver = new IntersectionObserver(entries => {
                entries.forEach((entry, idx) => {
                    if (!entry.isIntersecting) return;
                    setTimeout(() => entry.target.classList.add("revealed"), idx * 70);
                    revealObserver.unobserve(entry.target);
                });
            }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
        }

        items.forEach(i => revealObserver.observe(i));
    }
    initReveal();

    /* ---------- 10. HERO STATS ---------- */
    (function renderStats() {
        const host = $("#heroStats");
        if (!host || !D?.stats) return;
        host.innerHTML = D.stats.map(s => `
            <li><strong data-count="${esc(s.value)}" data-suffix="${esc(s.suffix || "")}">0</strong><span>${esc(s.label)}</span></li>
        `).join("");
        initCounters();
    })();

    /* ---------- 11. TECH MARQUEE ---------- */
    (function renderMarquee() {
        const track = $("#marqueeTrack");
        if (!track || !D) return;

        const markup = D.techStack.map(t =>
            `<span class="tech-item"><i class="bi ${esc(t.icon)}"></i>${esc(t.name)}</span>`).join("");

        // duplicated once so the -50% translate loops seamlessly
        track.innerHTML = markup + markup;
    })();

    /* ---------- 11. SERVICES ---------- */
    (function renderServices() {
        const grid = $("#servicesGrid");
        if (!grid || !D) return;

        grid.innerHTML = D.services.map(s => `
            <div class="col-md-6 col-lg-4 reveal">
                <article class="service-card">
                    <div class="service-icon"><i class="bi ${esc(s.icon)}"></i></div>
                    <h3>${esc(s.title)}</h3>
                    <p>${esc(s.text)}</p>
                    <ul class="service-list">
                        ${s.points.map(p => `<li>${esc(p)}</li>`).join("")}
                    </ul>
                </article>
            </div>`).join("");

        grid.querySelectorAll(".service-card").forEach(card => {
            card.addEventListener("mousemove", e => {
                const r = card.getBoundingClientRect();
                card.style.setProperty("--mx", `${e.clientX - r.left}px`);
                card.style.setProperty("--my", `${e.clientY - r.top}px`);
            });
        });
    })();

    /* ---------- 12. SKILLS ---------- */
    (function renderSkills() {
        renderSkillCarousel();

        const chips = $("#toolChips");
        if (chips && D) {
            chips.innerHTML = D.toolkits.map(t => `<span class="chip">${esc(t)}</span>`).join("");
        }

        const certs = $("#certList");
        if (certs && D) {
            certs.innerHTML = D.certifications.map(c => `
                <li>
                    <i class="bi bi-patch-check-fill"></i>
                    <span>${esc(c.name)} <em class="text-body-secondary">· ${esc(c.issuer)}, ${esc(c.year)}</em></span>
                    ${isReal(c.url)
                        ? `<a href="${esc(c.url)}" target="_blank" rel="noopener" aria-label="View ${esc(c.name)}"><i class="bi bi-box-arrow-up-right"></i></a>`
                        : ""}
                </li>`).join("");
        }
    })();

    /* ---------- 12b. 3D SKILL CAROUSEL ----------
       Cards sit at fixed slots around a cylinder (--sk3d-pos, applied by CSS).
       Only the stage travels: rotating it by -index * STEP brings the card in
       slot `index` to the front, facing the viewer. Opacity/brightness/z-index
       follow each card's distance from centre so the ring recedes properly. */

    function renderSkillCarousel() {
        const root = $("#skillCarousel");
        const stage = $("#sk3dStage");
        if (!root || !stage || !D?.skills?.length) return;

        const skills = D.skills;
        const count = skills.length;
        const reduced = prefersReducedMotion;

        /* Per-card accent wash so neighbouring cards don't look identical. */
        const accents = [
            "rgba(37,99,235,.28)", "rgba(6,182,212,.26)", "rgba(139,92,246,.26)",
            "rgba(56,189,248,.26)", "rgba(34,211,238,.24)", "rgba(59,130,246,.26)"
        ];

        stage.innerHTML = skills.map((s, i) => {
            const accent = accents[i % accents.length];
            const pct = Math.max(0, Math.min(100, Number(s.percent) || 0));
            const tags = (s.tags || []).map(t => `<li>${esc(t)}</li>`).join("");

            return `
            <article class="sk3d-card" data-index="${i}"
                     style="--sk3d-accent:${accent}"
                     aria-roledescription="slide"
                     aria-label="${esc(s.name)} — ${pct} percent">

                <div class="sk3d-face sk3d-front">
                    <span class="sk3d-icon"><i class="bi ${esc(s.icon || "bi-code-slash")}"></i></span>
                    <h3 class="sk3d-title">${esc(s.name)}</h3>
                    <p class="sk3d-blurb">${esc(s.blurb || "")}</p>
                    <div class="sk3d-ring" style="--p:${pct}">
                        <div>
                            <span class="sk3d-ring-value" data-ring="${pct}">${pct}%</span>
                            <span class="sk3d-ring-label">Proficiency</span>
                        </div>
                    </div>
                    <button type="button" class="sk3d-flip-btn" data-flip="${i}"
                            aria-label="Show what I work with in ${esc(s.name)}">
                        <i class="bi bi-arrow-repeat"></i> Details
                    </button>
                </div>

                <div class="sk3d-face sk3d-back">
                    <h4 class="sk3d-face-title"><i class="bi bi-tools"></i>${esc(s.name)}</h4>
                    <ul class="sk3d-tags">${tags}</ul>
                    <button type="button" class="sk3d-flip-btn" data-flip="${i}"
                            aria-label="Back to ${esc(s.name)} overview">
                        <i class="bi bi-arrow-left"></i> Back
                    </button>
                </div>
            </article>`;
        }).join("");

        const cards = $$(".sk3d-card", stage);
        const dotsHost = $("#sk3dDots");
        const prevBtn = $("#sk3dPrev");
        const nextBtn = $("#sk3dNext");
        const shell = $(".sk3d-shell", root);

        let index = 0;      // which card is at the front
        let dragOffset = 0; // fractional card-steps travelled while dragging
        const flipped = new Set();

        /* ---- Layout maths ----
           Cards are laid out in 2D: each one is offset horizontally from the
           front card by `signedOffset` steps, scaled down, and blurred. There is
           no 3D ring rotation, which keeps pointer hit-testing exact (see the
           note on .sk3d-card in carousel.css). */
        /* Horizontal px of travel per card-step. */
        const SPREAD = 132;

        /** Signed distance from card `i` to the front, in card-steps (-count/2, count/2].
            Signed so cards fan out to BOTH sides of the front card. */
        const signedOffset = i => {
            const wrapped = (((i - index) % count) + count) % count;
            // With an even count the antipodal slot is ambiguous; push it to the
            // far side so it hides cleanly instead of doubling up on the front.
            return wrapped > count / 2 ? wrapped - count : wrapped;
        };

        function paint(liveOffset) {
            // While dragging we get an explicit fractional position from the
            // pointer; the stored value must not leak into the resting state.
            const dragging = liveOffset !== undefined;
            if (dragging) dragOffset = liveOffset;

            cards.forEach((card, i) => {
                // Signed distance of this card from the front, in card units.
                // While dragging this is fractional, so the ring follows the finger.
                const off = dragging ? (i - index - dragOffset) : signedOffset(i);
                const abs = Math.min(Math.abs(off), count / 2);

                // Only the front card and its immediate neighbours are shown;
                // anything further just piles up behind.
                card.style.visibility = abs <= count / 2 - 0.5 ? "visible" : "hidden";

                // Horizontal spread + shrink. This is what sells the ring.
                const falloff = Math.min(abs / (count / 2), 1);
                const spread = Math.sign(off) * Math.min(abs, 3) * SPREAD;
                card.style.setProperty("--sk3d-x", spread.toFixed(1) + "px");
                card.style.setProperty("--sk3d-scale", (1 - falloff * .18).toFixed(3));
                card.style.opacity = String(1 - falloff * .6);
                // The blur is what really sells depth — and it stops
                // neighbouring titles from colliding with the front card's.
                card.style.filter = `blur(${(falloff * 2.4).toFixed(2)}px) brightness(${1 - falloff * .35})`;
                // Cards nearer the front must paint over the ones behind.
                card.style.zIndex = String(100 - Math.round(abs * 10));

                // Only the front card is interactive.
                const isFront = off === 0;
                card.classList.toggle("is-active", isFront);
                card.tabIndex = isFront ? 0 : -1;
                card.setAttribute("aria-hidden", isFront ? "false" : "true");

                const isFlipped = flipped.has(i);
                card.classList.toggle("is-flipped", isFlipped);
                // Flipping swaps which face is turned toward the viewer.
                const front = $(".sk3d-front", card);
                const back = $(".sk3d-back", card);
                if (front) front.style.transform = isFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
                if (back)  back.style.transform  = isFlipped ? "rotateY(0deg)"   : "rotateY(180deg)";
            });

            $$(".sk3d-dot", dotsHost).forEach((dot, i) => {
                dot.classList.toggle("active", i === index);
                dot.setAttribute("aria-selected", i === index ? "true" : "false");
            });
        }

        function goTo(next) {
            index = ((next % count) + count) % count;
            paint();
            animateFrontRing();
        }

        /* ---- Dots ---- */
        if (dotsHost) {
            dotsHost.innerHTML = skills.map((s, i) => `
                <li role="presentation">
                    <button type="button" class="sk3d-dot" role="tab" data-go="${i}"
                            aria-selected="${i === 0}" aria-label="${esc(s.name)}"></button>
                </li>`).join("");

            dotsHost.addEventListener("click", e => {
                const btn = e.target.closest("[data-go]");
                if (!btn) return;
                stopAuto();
                goTo(parseInt(btn.dataset.go, 10));
            });
        }

        prevBtn?.addEventListener("click", () => { stopAuto(); goTo(index - 1); });
        nextBtn?.addEventListener("click", () => { stopAuto(); goTo(index + 1); });

        /* ---- Flip the front card ----
           Driven by an explicit button, NOT by clicking the card surface. The
           cards are 3D-transformed, and Chrome hit-tests pointer events against
           the element's own transform matrix rather than the flat area the user
           actually sees — so a click on the visible front card lands on the
           stage behind it and never reaches the card. A real <button> inside
           the face is reliable, and is better for keyboard/AT users anyway. */
        stage.addEventListener("click", e => {
            const btn = e.target.closest("[data-flip]");
            if (!btn) return;
            e.stopPropagation();
            stopAuto();
            const i = parseInt(btn.dataset.flip, 10);
            flipped.has(i) ? flipped.delete(i) : flipped.add(i);
            paint();
        });

        // Enter / Space on a focused card also flips it.
        stage.addEventListener("keydown", e => {
            if (e.key !== "Enter" && e.key !== " ") return;
            const card = e.target.closest(".sk3d-card");
            if (!card || !card.classList.contains("is-active")) return;
            e.preventDefault();
            const i = parseInt(card.dataset.index, 10);
            flipped.has(i) ? flipped.delete(i) : flipped.add(i);
            paint();
        });

        /* ---- Keyboard ---- */
        root.addEventListener("keydown", e => {
            switch (e.key) {
                case "ArrowLeft":  stopAuto(); goTo(index - 1); e.preventDefault(); break;
                case "ArrowRight": stopAuto(); goTo(index + 1); e.preventDefault(); break;
                case "Home":       stopAuto(); goTo(0);         e.preventDefault(); break;
                case "End":        stopAuto(); goTo(count - 1); e.preventDefault(); break;
            }
        });

        /* ---- Pointer drag / swipe ---- */
        if (!reduced && shell) {
            const DRAG_THRESHOLD = 6; // px of travel before it counts as a drag
            let dragging = false;
            let moved = false;
            let startX = 0;

            shell.addEventListener("pointerdown", e => {
                // Ignore drags that begin on a control.
                if (e.target.closest(".sk3d-btn, .sk3d-dot, .sk3d-flip-btn")) return;
                dragging = true;
                moved = false;
                startX = e.clientX;
                stopAuto();
                // NOTE: pointer capture is deliberately NOT taken here.
                // Capturing retargets the follow-up click to the shell, which
                // stops it ever reaching the card's own buttons. We only
                // capture once a real drag starts (see pointermove).
            });

            shell.addEventListener("pointermove", e => {
                if (!dragging) return;
                // A click with no movement must NOT count as a drag, otherwise
                // releasing would snap to a random card instead of flipping.
                const dx = e.clientX - startX;
                if (!moved && Math.abs(dx) < DRAG_THRESHOLD) return;
                if (!moved) {
                    moved = true;
                    shell.classList.add("is-dragging");
                    // Now that it is a genuine drag, capture the pointer so it
                    // keeps tracking even if the cursor leaves the shell.
                    try { shell.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
                }
                // One full card-step per SPREAD px of travel.
                paint(dx / SPREAD);
            });

            const endDrag = e => {
                if (!dragging) return;
                dragging = false;
                shell.classList.remove("is-dragging");
                if (moved) {
                    try { shell.releasePointerCapture(e.pointerId); } catch (_) { /* ignore */ }
                }
                // Treat a tap as a click (card flip), not a drag.
                if (!moved) return;
                // Snap to whichever card ended up closest to centre.
                goTo(index + Math.round(dragOffset));
            };

            shell.addEventListener("pointerup", endDrag);
            shell.addEventListener("pointercancel", endDrag);
        }

        /* ---- Proficiency ring count-up (front card only) ---- */
        function animateFrontRing() {
            if (reduced) {
                $$("[data-ring]", stage).forEach(n => { n.textContent = n.dataset.ring + "%"; });
                return;
            }
            $$("[data-ring]", stage).forEach(node => {
                if (node.closest(".sk3d-card").dataset.index != index) return;
                const target = parseFloat(node.dataset.ring);
                const ring = node.closest(".sk3d-ring");
                const dur = 900, start = performance.now();
                (function step(now) {
                    const p = Math.min((now - start) / dur, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    node.textContent = Math.round(target * eased) + "%";
                    // Drive the conic-gradient sweep in step with the number.
                    if (ring) ring.style.setProperty("--p", (target * eased).toFixed(1));
                    if (p < 1) requestAnimationFrame(step);
                })(start);
            });
        }

        /* ---- Autoplay ---- */
        let autoTimer = null;
        const AUTO_MS = 5200;

        function startAuto() {
            if (reduced || autoTimer || count < 2) return;
            autoTimer = setInterval(() => {
                if (!document.hidden) goTo(index + 1);
            }, AUTO_MS);
        }
        function stopAuto() {
            if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
        }

        // Pause while the user interacts or the tab is hidden.
        if (shell) {
            shell.addEventListener("pointerenter", stopAuto);
            shell.addEventListener("focusin", stopAuto);
            shell.addEventListener("pointerleave", () => { if (!document.hidden) startAuto(); });
            shell.addEventListener("focusout", () => { if (!document.hidden) startAuto(); });
        }
        document.addEventListener("visibilitychange", () =>
            document.hidden ? stopAuto() : startAuto());

        paint();
        animateFrontRing();
        startAuto();
    }

    /* ---------- 13. PROJECTS ---------- */
    const PAGE_SIZE = 6;
    let visibleCount = PAGE_SIZE;

    (function renderProjects() {
        const grid = $("#projectsGrid");
        if (!grid || !D) return;

        function linksHtml(p) {
            const links = [];
            if (isReal(p.live)) {
                links.push(`<a href="${esc(p.live)}" target="_blank" rel="noopener" aria-label="View live site"><i class="bi bi-box-arrow-up-right"></i></a>`);
            }
            if (isReal(p.repo)) {
                links.push(`<a href="${esc(p.repo)}" target="_blank" rel="noopener" aria-label="View source code"><i class="bi bi-github"></i></a>`);
            }
            // No public URLs yet — fall back to a non-clickable tag so the
            // row never shows a dead link.
            if (!links.length) {
                links.push(`<span class="link-disabled" title="No public link yet"><i class="bi bi-link-45deg"></i></span>`);
            }
            return `<div class="project-links">${links.join("")}</div>`;
        }

        function cardHtml(p) {
            return `
            <div class="col-md-6 col-lg-4 reveal" data-category="${esc(p.category)}">
                <article class="project-card">
                    <div class="project-thumb">
                        <img src="${esc(p.image)}" alt="${esc(p.title)} screenshot" loading="lazy" width="600" height="375" />
                        <div class="project-tags">
                            ${p.tags.map(t => `<span class="project-tag">${esc(t)}</span>`).join("")}
                        </div>
                        <div class="project-overlay">
                            <button class="btn btn-primary btn-sm" data-project-id="${esc(p.id)}">
                                <i class="bi bi-arrows-fullscreen me-1"></i>Case study
                            </button>
                        </div>
                    </div>
                    <div class="project-body">
                        <h3>${esc(p.title)}</h3>
                        <p>${esc(p.summary)}</p>
                        <div class="project-meta">
                            <span><i class="bi bi-person-badge me-1"></i>${esc(p.role)}</span>
                            ${linksHtml(p)}
                        </div>
                    </div>
                </article>
            </div>`;
        }

        function paint() {
            const list = D.projects.slice(0, visibleCount);
            grid.innerHTML = list.map(cardHtml).join("");
            initReveal();

            const btn = $("#loadMoreBtn");
            if (btn) {
                const remaining = D.projects.length - visibleCount;
                btn.classList.toggle("d-none", remaining <= 0);
                btn.textContent = remaining > 0 ? `Load more projects (${remaining} left)` : "All projects loaded";
            }
        }

        paint();

        $("#loadMoreBtn")?.addEventListener("click", e => {
            e.preventDefault();
            visibleCount += PAGE_SIZE;
            paint();
            showToast(`Loaded ${Math.min(visibleCount, D.projects.length)} of ${D.projects.length} projects`, "bi-folder2-open");
        });

        /* --- Filtering --- */
        const filterBtns = $$(".filter-btn");
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => {
                    b.classList.remove("active");
                    b.setAttribute("aria-selected", "false");
                });
                btn.classList.add("active");
                btn.setAttribute("aria-selected", "true");

                const filter = btn.dataset.filter;
                $$(".reveal", grid).forEach(card => {
                    const match = filter === "all" || card.dataset.category === filter;
                    card.classList.toggle("filtered-out", !match);
                });

                $("#loadMoreBtn")?.classList.toggle("d-none", filter !== "all");
            });
        });

        /* --- Case-study modal --- */
        const modalEl = $("#projectModal");
        const modal = modalEl ? new bootstrap.Modal(modalEl) : null;

        grid.addEventListener("click", e => {
            const trigger = e.target.closest("[data-project-id]");
            if (!trigger) return;

            const project = D.projects.find(p => p.id === trigger.dataset.projectId);
            if (!project || !modal) return;

            $("#projectModalTitle").textContent = project.title;
            $("#projectModalBody").innerHTML = `
                <img src="${esc(project.image)}" alt="${esc(project.title)}" class="img-fluid rounded mb-3" />
                <div class="meta-row">
                    <span><i class="bi bi-briefcase me-1"></i>${esc(project.role)}</span>
                    <span><i class="bi bi-calendar3 me-1"></i>${esc(project.year)}</span>
                    <span><i class="bi bi-tag me-1"></i>${esc(project.category.toUpperCase())}</span>
                </div>
                <p class="text-body-secondary">${esc(project.description)}</p>
                <div class="kpi-row">
                    ${project.metrics.map(m => `<div class="kpi"><strong>${esc(m.value)}</strong><span>${esc(m.label)}</span></div>`).join("")}
                </div>
                <h4 class="mt-4 mb-2">Highlights</h4>
                <ul>${project.highlights.map(h => `<li>${esc(h)}</li>`).join("")}</ul>
                <h4 class="mt-4 mb-2">Stack</h4>
                <div class="d-flex flex-wrap gap-2">
                    ${project.tags.map(t => `<span class="project-tag">${esc(t)}</span>`).join("")}
                </div>`;

            $("#projectLiveLink").href = project.live || "#";
            $("#projectLiveLink").parentElement.classList.toggle("d-none", !isReal(project.live));
            $("#projectRepoLink").href = project.repo || "#";
            $("#projectRepoLink").parentElement.classList.toggle("d-none", !isReal(project.repo));
            modal.show();
        });
    })();

    /* ---------- 14. RESUME ---------- */
    function timelineHtml(items) {
        return items.map(item => `
            <div class="timeline-item">
                <span class="timeline-date">${esc(item.period)}</span>
                <h4>${esc(item.company)}</h4>
                <span class="role">${esc(item.role)}</span>
                <p>${esc(item.text)}</p>
                ${item.points?.length ? `<ul>${item.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
            </div>`).join("");
    }

    (function renderResume() {
        if (!D) return;

        const facts = $("#resumeFacts");
        if (facts) {
            facts.innerHTML = D.resumeFacts
                .map(f => `<li><span>${esc(f.label)}</span><span>${esc(f.value)}</span></li>`).join("");
        }

        const exp = $("#timelineExperience");
        if (exp) exp.innerHTML = timelineHtml(D.experience);

        const edu = $("#timelineEducation");
        if (edu) edu.innerHTML = timelineHtml(D.education);

        const certs = $("#timelineCerts");
        if (certs) certs.innerHTML = timelineHtml(D.resumeCerts);

        const seminars = $("#seminarList");
        if (seminars && D.seminars) {
            seminars.innerHTML = D.seminars.map(s => `
                <li>
                    <i class="bi bi-calendar-event"></i>
                    <span><strong>${esc(s.title)}</strong><em class="text-body-secondary">${esc(s.org)} · ${esc(s.date)}</em></span>
                </li>`).join("");
        }

        const quick = $("#quickResumeBody");
        if (quick) {
            quick.innerHTML = `
                <div class="text-center mb-4">
                    <h4 class="mb-1">${esc(D.profile.name)}</h4>
                    <p class="text-body-secondary mb-1">${esc(D.profile.role)}</p>
                    <p class="small text-body-secondary mb-0">
                        <i class="bi bi-geo-alt me-1"></i>${esc(D.profile.location)}
                        &nbsp;·&nbsp; <i class="bi bi-envelope me-1"></i>${esc(D.profile.email)}
                    </p>
                </div>
                <hr />
                <h5 class="mb-3">Experience</h5>
                ${timelineHtml(D.experience)}
                <hr />
                <h5 class="mb-3">Education</h5>
                ${timelineHtml(D.education)}
                <hr />
                <h5 class="mb-3">Certifications</h5>
                <ul class="quick-cert-list">
                    ${D.resumeCerts.map(c => `<li>${esc(c.role)} <em class="text-body-secondary">· ${esc(c.company)}, ${esc(c.period)}</em></li>`).join("")}
                </ul>
                <div class="text-center mt-4">
                    <a href="resume.html" class="btn btn-primary" target="_blank" rel="noopener">
                        <i class="bi bi-file-earmark-pdf me-2"></i>Open the full printable résumé
                    </a>
                </div>`;
        }
    })();

    /* ---------- 15. AWARDS & RECOGNITION ---------- */
    (function renderAwards() {
        const grid = $("#awardsGrid");
        if (!grid || !D) return;

        grid.innerHTML = D.awards.map(a => `
            <div class="col-md-6 reveal">
                <article class="award-card">
                    <div class="award-icon"><i class="bi ${esc(a.icon)}"></i></div>
                    <h3>${esc(a.title)}</h3>
                    <p class="award-meta">${esc(a.meta)}</p>
                    <p class="award-text">${esc(a.text)}</p>
                </article>
            </div>`).join("");
    })();

    /* ---------- 16. CONTACT + FOOTER ---------- */
    (function renderContact() {
        if (!D) return;
        const p = D.profile;

        const contact = $("#contactList");
        if (contact) {
            contact.innerHTML = [
                { icon: "bi-envelope-fill", label: "Email", value: p.email, href: "mailto:" + p.email },
                { icon: "bi-telephone-fill", label: "Phone", value: p.phone, href: "tel:" + p.phone.replace(/[^\d+]/g, "") },
                { icon: "bi-geo-alt-fill", label: "Location", value: p.location, href: "#" },
                { icon: "bi-clock-fill", label: "Availability", value: p.availability, href: "#" }
            ].map(c => `
                <li>
                    <span class="ci"><i class="bi ${c.icon}"></i></span>
                    <span>
                        <span class="cl d-block">${esc(c.label)}</span>
                        <a class="cv d-block" href="${esc(c.href)}" ${c.href === "#" ? 'onclick="return false"' : ""}>${esc(c.value)}</a>
                    </span>
                </li>`).join("");
        }

        const socialMarkup = D.socials.map(s => `
            <a class="social-btn" href="${esc(s.url)}" target="_blank" rel="noopener"
               aria-label="${esc(s.name)}" data-bs-toggle="tooltip" title="${esc(s.name)}">
                <i class="bi ${esc(s.icon)}"></i>
            </a>`).join("");

        [$("#socialRow"), $("#footerSocial")].forEach(el => { if (el) el.innerHTML = socialMarkup; });

        // Bootstrap tooltips
        $$('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));

        const footerNav = $("#footerNav");
        if (footerNav) {
            const links = [
                ["#about", "About"], ["#services", "Capabilities"], ["#skills", "Skills"],
                ["#projects", "Projects"], ["#resume", "Résumé"], ["#awards", "Recognition"], ["#contact", "Contact"]
            ];
            footerNav.innerHTML = links.map(([href, label]) =>
                `<li><a href="${href}">${label}</a></li>`).join("");
        }

        const footerContact = $("#footerContact");
        if (footerContact) {
            footerContact.innerHTML = `
                <li><a href="mailto:${esc(p.email)}"><i class="bi bi-envelope me-2"></i>${esc(p.email)}</a></li>
                <li><a href="tel:${esc(p.phone.replace(/[^\d+]/g, ""))}"><i class="bi bi-telephone me-2"></i>${esc(p.phone)}</a></li>
                <li><a href="resume.html"><i class="bi bi-file-earmark-pdf me-2"></i>Download résumé</a></li>
                <li><a href="#contact"><i class="bi bi-geo-alt me-2"></i>${esc(p.location)}</a></li>`;
        }

        const year = $("#currentYear");
        if (year) year.textContent = new Date().getFullYear();
    })();

    /* ---------- 17. CONTACT FORM ---------- */
    (function contactForm() {
        const form = $("#contactForm");
        if (!form) return;

        const message = $("#message");
        const counter = document.createElement("span");
        counter.className = "char-count";
        counter.textContent = "0 / 1000";
        message.closest(".col-12").appendChild(counter);

        const ENCODED_KEY = "portfolio:contact-draft";
        const saved = (() => {
            try { return JSON.parse(localStorage.getItem(ENCODED_KEY) || "null"); } catch (_) { return null; }
        })();

        // Restore and retain unsent drafts without keeping successfully sent messages.
        ["name", "email", "phone", "message"].forEach(id => {
            const input = $("#" + id);
            if (saved?.[id]) input.value = saved[id];
        });
        if (saved?.subject) $("#subject").value = saved.subject;

        const saveDraft = () => {
            try {
                localStorage.setItem(ENCODED_KEY, JSON.stringify({
                    name: $("#name").value,
                    email: $("#email").value,
                    phone: $("#phone").value,
                    subject: $("#subject").value,
                    message: message.value
                }));
            } catch (_) { /* Storage may be unavailable or full. */ }
        };
        $$("input[name], select[name], textarea[name]", form).forEach(input => {
            input.addEventListener("input", saveDraft);
            input.addEventListener("change", saveDraft);
        });

        message.addEventListener("input", () => {
            if (message.value.length > 1000) message.value = message.value.slice(0, 1000);
            counter.textContent = `${message.value.length} / 1000`;
        });
        if (message.value) counter.textContent = `${message.value.length} / 1000`;

        const phonePattern = /^[+]?[\d\s().-]{7,20}$/;
        $("#phone").addEventListener("blur", e => {
            if (e.target.value && !phonePattern.test(e.target.value)) e.target.classList.add("is-invalid");
        });

        form.addEventListener("submit", async e => {
            e.preventDefault();
            e.stopPropagation();

            if (!form.checkValidity()) {
                form.classList.add("was-validated");
                form.querySelector(":invalid")?.focus();
                showToast("Please fix the highlighted fields", "bi-exclamation-triangle-fill");
                return;
            }

            const btn = $("#submitBtn");
            const label = btn.querySelector(".btn-label");
            const spinner = btn.querySelector(".spinner-border");
            btn.disabled = true;
            label.classList.add("d-none");
            spinner.classList.remove("d-none");

            const payload = Object.fromEntries(new FormData(form).entries());
            try {
                const response = await fetch("/api/contact.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify({ ...payload, consent: $("#consent").checked })
                });
                const result = await response.json().catch(() => null);
                if (!response.ok) {
                    throw new Error(
                        typeof result?.error === "string"
                            ? result.error
                            : "Unable to send your message right now."
                    );
                }
                if (typeof result?.message !== "string") {
                    throw new Error("The server returned an invalid response. Please try again.");
                }

                try { localStorage.removeItem(ENCODED_KEY); } catch (_) { /* Storage may be unavailable. */ }
                form.reset();
                form.classList.remove("was-validated");
                counter.textContent = "0 / 1000";
                showToast(`Thanks ${payload.name.split(" ")[0]}! Your message is on its way.`, "bi-send-check-fill");
            } catch (error) {
                showToast(
                    error instanceof TypeError
                        ? "Unable to reach the server. Please try again."
                        : error.message,
                    "bi-exclamation-triangle-fill"
                );
            } finally {
                btn.disabled = false;
                label.classList.remove("d-none");
                spinner.classList.add("d-none");
            }
        });
    })();

    /* ---------- 18. SMOOTH ANCHORS ---------- */
    document.addEventListener("click", e => {
        const trigger = e.target.closest('a[href^="#"], [data-scroll-to]');
        if (!trigger) return;

        const selector = trigger.dataset.scrollTo || trigger.getAttribute("href");
        if (!selector || selector === "#" || selector.length < 2) return;

        const target = document.querySelector(selector);
        if (!target) return;

        e.preventDefault();
        const offset = (nav?.offsetHeight || 74) + 10;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });

        // file:// blocks history updates in some browsers — fail silently
        try { history.replaceState(null, "", selector); } catch (_) { /* ignore */ }
    });
})();
