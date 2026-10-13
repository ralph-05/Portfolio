// Sanity check: loads data.js and verifies every asset path + referenced ID resolves.
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const src = fs.readFileSync(path.join(root, "assets/js/data.js"), "utf8");
eval(src.replace("const PORTFOLIO_DATA", "var PORTFOLIO_DATA"));
const D = PORTFOLIO_DATA;

let errors = 0;
const fail = m => { console.log("  FAIL  " + m); errors++; };
const ok = m => console.log("  ok    " + m);

// --- 1. required keys
const required = {
    socials: ["name", "icon", "url"],
    techStack: ["icon", "name"],
    services: ["icon", "title", "text", "points"],
    skills: ["name", "percent"],
    projects: ["id", "title", "category", "image", "tags", "summary",
               "description", "highlights", "metrics", "role", "year", "live", "repo"],
    resumeFacts: ["label", "value"],
    experience: ["period", "company", "role", "text"],
    education: ["period", "company", "role", "text"],
    resumeCerts: ["period", "company", "role", "text"],
    certifications: ["name", "issuer", "year", "url"],
    awards: ["icon", "title", "meta", "text"],
    seminars: ["date", "title", "org"],
    stats: ["value", "label"]
};

console.log("\n[1] Data shape");
for (const [key, fields] of Object.entries(required)) {
    if (!Array.isArray(D[key])) { fail(`missing array: ${key}`); continue; }
    if (!D[key].length) { fail(`empty array: ${key}`); continue; }
    const missing = D[key].filter(item => fields.some(f => item[f] === undefined));
    missing.length ? fail(`${key}: items missing fields ${[...new Set(missing.flatMap(m => fields.filter(f => m[f] === undefined)))].join(", ")}`)
                   : ok(`${key} (${D[key].length} entries)`);
}
if (!D.toolkits?.length) fail("missing toolkits"); else ok(`toolkits (${D.toolkits.length})`);

// --- 1b. profile object
console.log("\n[1b] Profile");
["name", "role", "location", "email", "phone", "availability"].forEach(f =>
    D.profile?.[f] ? ok(`profile.${f}: ${D.profile[f]}`) : fail(`profile.${f} is empty`));

// --- 2. referenced asset files exist
console.log("\n[2] Asset paths");
const assets = new Set();
D.projects.forEach(p => assets.add(p.image));
["assets/img/avatar.svg", "assets/img/workspace.svg", "assets/img/favicon.svg"].forEach(a => assets.add(a));
for (const a of assets) {
    fs.existsSync(path.join(root, a)) ? ok(a) : fail(`missing file: ${a}`);
}

// --- 3. hard-coded asset paths in HTML
console.log("\n[3] Asset paths referenced in HTML");
["index.html", "resume.html"].forEach(page => {
    const html = fs.readFileSync(path.join(root, page), "utf8");
    const refs = [...html.matchAll(/(?:src|href)="((?:assets|resume)[^"#?]*)"/g)].map(m => m[1]);
    [...new Set(refs)].forEach(r => {
        if (r.endsWith(".pdf")) {
            console.log(`  note  ${page} -> ${r} (supplied by you; see assets/resume/README.md)`);
            return;
        }
        fs.existsSync(path.join(root, r)) ? ok(`${page} -> ${r}`) : fail(`${page} -> missing ${r}`);
    });
});

// --- 4. unique project ids + valid categories
console.log("\n[4] Project integrity");
const ids = D.projects.map(p => p.id);
new Set(ids).size === ids.length ? ok("unique project ids") : fail("duplicate project ids");
const cats = [...new Set(D.projects.map(p => p.category))];
console.log("  info  categories in use: " + cats.join(", "));

// --- 5. every nav/filter target exists in index.html
console.log("\n[5] DOM targets");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const domIds = new Set([
    ...[...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]),
    ...[...html.matchAll(/data-bs-target="(#[^"]+)"/g)].map(m => m[1].slice(1))
]);
const needed = [
    "preloader", "scrollProgressBar", "backToTop", "mainNav", "navMenu", "themeToggle",
    "home", "heroStats", "heroCanvas", "marqueeTrack", "about", "services", "servicesGrid",
    "skills", "skillCarousel", "sk3dStage", "sk3dDots", "sk3dPrev", "sk3dNext",
    "toolChips", "certList", "projects", "projectsGrid", "loadMoreBtn",
    "resume", "resumeFacts", "timelineExperience", "timelineEducation", "timelineCerts",
    "seminarList", "quickResume", "quickResumeBody", "awards", "awardsGrid",
    "contact", "contactList", "socialRow",
    "contactForm", "submitBtn", "footerNav", "footerContact", "footerSocial",
    "currentYear", "projectModal", "projectModalTitle", "projectModalBody",
    "projectLiveLink", "projectRepoLink", "liveToast", "toastMessage", "name", "email",
    "phone", "subject", "message", "consent"
];
needed.forEach(id => domIds.has(id) || fail(`index.html missing id: #${id}`));
ok(`${needed.length} DOM ids verified`);

// nav anchors -> sections
[...html.matchAll(/href="#([a-zA-Z]+)"/g)].map(m => m[1])
    .filter(h => !domIds.has(h))
    .forEach(h => fail(`anchor target not found: #${h}`));
ok("all internal anchors resolve");

// --- 6. résumé page ids
console.log("\n[6] resume.html");
const rh = fs.readFileSync(path.join(root, "resume.html"), "utf8");
["resumeThemeToggle", "printBtn", "resumeSheet", "resumeYear"].forEach(id =>
    new RegExp(`id="${id}"`).test(rh) || fail(`resume.html missing id: ${id}`));
ok("résumé controls present");

// --- 7. counts
console.log("\n[7] Totals");
console.log(`  ${D.services.length} capabilities · ${D.skills.length} skill cards · ${D.projects.length} projects · ` +
            `${D.experience.length} roles · ${D.education.length} education · ${D.certifications.length} certifications · ` +
            `${D.awards.length} awards · ${D.seminars.length} seminars · ${D.techStack.length} marquee items · ${D.socials.length} socials`);

// --- 8. warn about unfilled placeholders (not errors — intentional until the owner fills them)
const blanks = [];
if (D.socials.some(s => s.url === "#")) blanks.push("social URLs still '#' — search data.js for TODO:");
D.projects.forEach(p => { if (!p.live && !p.repo) blanks.push(`project "${p.title}" has no public link (links auto-hide)`); });
if (blanks.length) {
    console.log("\n[8] Placeholder warnings (not failures)");
    blanks.forEach(b => console.log("  note  " + b));
}

console.log(errors ? `\n${errors} PROBLEM(S) FOUND\n` : "\nAll checks passed.\n");
process.exit(errors ? 1 : 0);
