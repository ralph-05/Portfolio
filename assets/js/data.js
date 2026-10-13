/* ==========================================================================
   data.js — Single source of truth for every piece of content on the site.
   Edit values here and the UI updates automatically (no HTML edits needed).

   ⚠️  TODO BEFORE PUBLISHING
       1. Social URLs below are PLACEHOLDERS ("#") — paste your real GitHub,
          LinkedIn and Facebook links. Search this file for `TODO:`.
       2. Projects have no public live/repo URLs yet. Set `live` and `repo`
          to a real URL, or leave them "" and the links hide automatically.
       3. Swap assets/img/*.svg for real photos (avatar.svg, project-*.svg).
   ========================================================================== */

const PORTFOLIO_DATA = {

    /* ---------------- Identity ---------------- */
    profile: {
        name: "Ralph Laurence O. Bayya",
        shortName: "Ralph Bayya",
        role: "IT Graduate · Network & Security",
        titleLine: "Network Operations · System Administration · Support",
        location: "Unzad, Villasis, Pangasinan",
        email: "ralphlaurencebayya@gmail.com",
        phone: "+63 991 182 9525",
        availability: "Open to IT roles — network operations, system administration & support",
        intro: "IT graduate specialising in networking and security, with hands-on experience supporting live office and school networks."
    },

    /* ---------------- Social links ----------------
       TODO: replace every "#" with your real profile URL. */
    socials: [
        { name: "GitHub",    icon: "bi-github",        url: "https://github.com/ralph-05" },  // TODO:
        { name: "LinkedIn",  icon: "bi-linkedin",      url: "https://www.linkedin.com/in/ralph-laurence-bayya-aba154405" },  // TODO:
        { name: "Facebook",  icon: "bi-facebook",      url: "https://www.facebook.com/ralph.bayya.5" },  // TODO:
        { name: "Email",     icon: "bi-envelope-fill", url: "mailto:ralphlaurencebayya@gmail.com" }
    ],

    /* ---------------- Tech marquee ---------------- */
    techStack: [
        { icon: "bi-router-fill",        name: "Cisco LAN" },
        { icon: "bi-diagram-3-fill",    name: "Network Topology" },
        { icon: "bi-broadcast-pin",     name: "LAN / WAN" },
        { icon: "bi-shield-lock-fill",  name: "Security" },
        { icon: "bi-filetype-py",       name: "Python" },
        { icon: "bi-filetype-php",      name: "PHP" },
        { icon: "bi-bezier2",           name: "React" },
        { icon: "bi-database-fill",     name: "SQL" },
        { icon: "bi-ubuntu",            name: "Linux" },
        { icon: "bi-terminal",          name: "Packet Tracer" },
        { icon: "bi-cable",             name: "RJ45 Cabling" },
        { icon: "bi-firewall",          name: "Ethical Hacking" },
        { icon: "bi-hdd-network-fill",  name: "Starlink" },
        { icon: "bi-bootstrap-fill",    name: "Bootstrap" },
        { icon: "bi-git",               name: "Git & GitHub" }
    ],

    /* ---------------- Capabilities ---------------- */
    services: [
        {
            icon: "bi-router-fill",
            title: "Network Operations",
            text: "Keeping live office and school networks online — diagnosis first, hardware second.",
            points: ["LAN/WAN configuration", "Packet Tracer labs", "Topology design", "Bandwidth & uptime checks"]
        },
        {
            icon: "bi-tools",
            title: "System Administration",
            text: "Endpoint upkeep and server-side housekeeping that keeps teams productive.",
            points: ["Linux / Ubuntu administration", "Hardware troubleshooting", "User & access control", "SAP ERP (basic)"]
        },
        {
            icon: "bi-shield-lock-fill",
            title: "Cybersecurity & Filtering",
            text: "Defensive security on school and office networks, plus a CCNA grounding.",
            points: ["URL & domain filtering", "Ethical hacking basics", "Network access control", "Incident awareness"]
        },
        {
            icon: "bi-code-slash",
            title: "Full-Stack Development",
            text: "Web applications from database design through to a working React front end.",
            points: ["React · HTML5 · CSS3", "PHP & Python", "REST API integration", "Bootstrap & responsive UI"]
        },
        {
            icon: "bi-database-fill",
            title: "Database & Data",
            text: "Schemas, queries and reporting — plus analysis in Python and Excel.",
            points: ["PostgreSQL · MySQL", "Supabase · Firebase", "Data modelling", "Excel & Python analysis"]
        },
        {
            icon: "bi-people-fill",
            title: "IT Support & Collaboration",
            text: "Working with staff and students to solve problems quickly and explain them clearly.",
            points: ["First-line troubleshooting", "User training & walkthroughs", "Project & record management", "Clear written communication"]
        }
    ],

    /* ---------------- Skills (percent drives the card ring) ----------------
       icon: Bootstrap Icons class · blurb: one line shown on the card
       tags:  small chips listed on the back face                        */
    skills: [
        {
            name: "Networking & LAN Configuration",
            percent: 92,
            icon: "bi-router-fill",
            blurb: "Designing and keeping LAN/WAN infrastructure online for live offices and schools.",
            tags: ["Cisco IOS", "LAN/WAN", "Topology Design", "Packet Tracer", "RJ45"]
        },
        {
            name: "Cybersecurity & Filtering",
            percent: 86,
            icon: "bi-shield-lock-fill",
            blurb: "Defensive security, content filtering and network access control.",
            tags: ["URL Filtering", "Access Control", "Ethical Hacking", "CCNA Security"]
        },
        {
            name: "Python, PHP & JavaScript",
            percent: 82,
            icon: "bi-filetype-py",
            blurb: "Scripting, back-end logic and data analysis across three core languages.",
            tags: ["Python", "PHP", "JavaScript", "Data Analysis", "Automation"]
        },
        {
            name: "React & Front-End (HTML/CSS)",
            percent: 78,
            icon: "bi-bezier2",
            blurb: "Component-based interfaces, responsive layouts and REST integration.",
            tags: ["React", "HTML5", "CSS3", "Bootstrap", "REST API"]
        },
        {
            name: "SQL & Database Management",
            percent: 80,
            icon: "bi-database-fill",
            blurb: "Relational schemas, queries, migrations and data modelling.",
            tags: ["PostgreSQL", "MySQL", "Supabase", "Firebase", "Modelling"]
        },
        {
            name: "Linux & System Administration",
            percent: 75,
            icon: "bi-ubuntu",
            blurb: "Server and endpoint upkeep, user management and troubleshooting.",
            tags: ["Linux", "Ubuntu", "Windows", "Docker", "Permissions"]
        }
    ],

    toolkits: [
        "Cisco IOS", "Cisco Packet Tracer", "CCNA", "LAN/WAN", "Network Topology", "URL Filtering",
        "Python", "PHP", "JavaScript", "SQL", "React", "HTML5", "CSS3", "Bootstrap",
        "PostgreSQL", "MySQL", "Supabase", "Firebase", "Docker",
        "Linux / Ubuntu", "Windows", "Git & GitHub", "Visual Studio", "Android Studio"
    ],

    /* Certifications — the 9 listed on the résumé.
       TODO: paste a verification link into `url`, or leave "#" and the
       arrow icon is hidden automatically. */
    certifications: [
        { name: "CCNA: Enterprise Networking, Security and Automation", issuer: "Cisco NetAcad", year: "2026", url: "#" },
        { name: "CCNA: Switching, Routing and Wireless Essentials",     issuer: "Cisco NetAcad", year: "2026", url: "#" },
        { name: "Introduction to Ethical Hacking & Penetration Testing",  issuer: "Cisco NetAcad", year: "2026", url: "#" },
        { name: "Planning & Scoping a Pentest Assessment",              issuer: "Cisco NetAcad", year: "2026", url: "#" },
        { name: "Introduction to Cybersecurity",                        issuer: "Cisco NetAcad", year: "2026", url: "#" },
        { name: "Networking Basics",                                    issuer: "Cisco NetAcad", year: "2026", url: "#" },
        { name: "NCII — Computer Servicing System",                     issuer: "TESDA",         year: "2026", url: "#" },
        { name: "AI in Programming — Server Set-up & Deployment",        issuer: "DOST",         year: "2026", url: "#" },
        { name: "Data Analysis using Microsoft Excel",                  issuer: "EXCEL",         year: "2026", url: "#" }
    ],

    /* ---------------- Hero statistics ---------------- */
    stats: [
        { value: 9,   suffix: "",  label: "Certifications earned" },
        { value: 3,   suffix: "",  label: "Projects delivered" },
        { value: 2,   suffix: "",  label: "Network support roles" },
        { value: 2026, suffix: "", label: "Year of graduation" }
    ],

    /* ---------------- Projects ----------------
       categories: "web" | "network" | "systems" | "security"
       Set `live` / `repo` to a real URL, or leave "" to hide those links. */
    projects: [
        {
            id: "p1",
            title: "QuickTap — Cafeteria POS with Analytics",
            category: "web",
            image: "assets/img/quicktapzone.jpg",
            tags: ["React", "Supabase", "REST API", "Analytics"],
            summary: "Capstone project that turned a cafeteria point-of-sale system into a web app with embedded sales analytics.",
            description:
                "A three-member capstone team project modernising a cafeteria POS into a browser-based application. Staff take orders through a dedicated interface while management reads live sales and product performance from an analytics dashboard — all backed by a relational schema and a REST layer.",
            highlights: [
                "Delivered end to end as a three-member capstone team, including system walkthrough and defence",
                "Split the product into staff and customer roles so ordering and reporting stay separate",
                "Built an analytics dashboard that turns transaction records into readable sales trends"
            ],
            metrics: [
                { value: "3",       label: "team members" },
                { value: "2",       label: "roles: staff & customer" },
                { value: "Live",    label: "sales analytics" }
            ],
            role: "Capstone team member — full-stack",
            year: "2026",
            live: "",
            repo: ""
        },
        {
            id: "p2",
            title: "DOST-CAR Interns Attendance System",
            category: "systems",
            image: "assets/img/Databasekono.jpg",
            tags: ["SQL", "Data Modelling", "Project Management"],
            summary: "Data management and project lead for an attendance system tracking DOST-CAR interns.",
            description:
                "Served as Data Management Analyst and Project Manager for an attendance management system deployed at the DOST-CAR Regional Office. Owned the data model and records side while coordinating the rollout across the internship programme.",
            highlights: [
                "Designed and maintained the data model behind daily intern attendance records",
                "Managed records end to end, keeping data consistent across the programme",
                "Coordinated the system rollout alongside the regional office IT department"
            ],
            metrics: [
                { value: "SQL",   label: "data model" },
                { value: "Daily", label: "record capture" },
                { value: "2026",  label: "rollout" }
            ],
            role: "Data Management Analyst & Project Manager",
            year: "2026",
            live: "",
            repo: ""
        },
        {
            id: "p3",
            title: "Regional Network Topology Redesign",
            category: "network",
            image: "assets/img/rj45.jpg",
            tags: ["Network Design", "Starlink", "RJ45 Cabling", "Cisco"],
            summary: "Redesigned the DOST-CAR LAN topology and installed Starlink backhaul to remove coverage dead zones.",
            description:
                "A live infrastructure project at the DOST-CAR Regional Office in La Trinidad. Diagnosed dead zones across the building, helped map a redesigned network topology, installed a Starlink satellite router as backhaul, and terminated the structured cabling to rebuild physical connections.",
            highlights: [
                "Installed a Starlink satellite router that eliminated dead zones and restored stable coverage",
                "Helped map and design the organisation's network topology with the IT team",
                "Crimped and terminated RJ45 cabling to build and maintain physical network links"
            ],
            metrics: [
                { value: "Starlink", label: "backhaul added" },
                { value: "100%",     label: "coverage restored" },
                { value: "RJ45",     label: "terminations" }
            ],
            role: "MIS Intern — Network & Infrastructure",
            year: "2026",
            live: "",
            repo: ""
        },
        {
            id: "p4",
            title: "School Network Support & Content Filtering",
            category: "security",
            image: "assets/img/Unzadtopology.jpg",
            tags: ["URL Filtering", "Access Control", "Diagnostics"],
            summary: "Ongoing network support and content-safety enforcement for Unzad Elementary School.",
            description:
                "A continuing role supporting the school network since January 2025. Enforces content-safety policy through domain and URL filtering, runs routine diagnostics and speed tests, and manages access controls so limited bandwidth reaches the classrooms that need it.",
            highlights: [
                "Implemented domain and URL filtering to block unauthorised and illegal content",
                "Ran routine diagnostics and speed tests to track bandwidth, uptime and link quality",
                "Administered network access controls to stop unauthorised bandwidth consumption"
            ],
            metrics: [
                { value: "Since",  label: "Jan 2025" },
                { value: "Daily",  label: "link monitoring" },
                { value: "Live",   label: "content safety" }
            ],
            role: "Sub-Network Support",
            year: "2025 — Present",
            live: "",
            repo: ""
        }
    ],

    /* ---------------- Resume ---------------- */
    resumeFacts: [
        { label: "Name",       value: "Ralph Laurence O. Bayya" },
        { label: "Title",      value: "IT Graduate · Network & Security" },
        { label: "Location",   value: "Unzad, Villasis, Pangasinan" },
        { label: "Graduated",  value: "24 September 2026" },
        { label: "Focus",      value: "Networking · SysAdmin · Support" },
        { label: "Status",     value: "Open to IT roles" }
    ],

    experience: [
        {
            period: "Jun 2026 — Aug 2026",
            company: "DOST-CAR Regional Office",
            role: "Intern — Management Information System",
            text: "La Trinidad, Benguet. Worked alongside the IT department on live regional-office infrastructure.",
            points: [
                "Coordinated with IT teams to troubleshoot hardware and software issues across the office",
                "Installed a Starlink satellite router that eliminated dead zones and restored stable coverage",
                "Helped map and design the organisation's network topology in team brainstorming sessions",
                "Crimped and terminated RJ45 cabling to build and maintain physical network connections"
            ]
        },
        {
            period: "Jan 2025 — Present",
            company: "Unzad Elementary School",
            role: "Sub-Network Support",
            text: "Unzad, Villasis, Pangasinan. Ongoing network support and content-safety enforcement.",
            points: [
                "Implemented domain and URL filtering to block unauthorised and illegal sites on the school network",
                "Ran routine network diagnostics and speed tests to assess bandwidth, uptime and link quality",
                "Administered network access controls to prevent unauthorised bandwidth consumption"
            ]
        }
    ],

    education: [
        {
            period: "2022 — 2026",
            company: "University of the Cordilleras",
            role: "BS Information Technology — Network & Security Track",
            text: "Baguio City. Major track in Network & Security. Graduated 24 September 2026.",
            points: [
                "Core coursework across networking, security, systems integration and database management"
            ]
        },
        
    ],

    resumeCerts: [
        { period: "2026", company: "Cisco NetAcad", role: "CCNA — Enterprise Networking, Security and Automation", text: "Enterprise architectures, security operations and network automation." },
        { period: "2026", company: "Cisco NetAcad", role: "CCNA — Switching, Routing and Wireless Essentials",  text: "Switching, routing and wireless configuration fundamentals." },
        { period: "2026", company: "Cisco NetAcad", role: "Introduction to Ethical Hacking & Penetration Testing", text: "Offensive-security mindset used defensively on school and office networks." },
        { period: "2026", company: "Cisco NetAcad", role: "Planning & Scoping a Pentest Assessment", text: "Rules of engagement, scoping and reporting for penetration tests." },
        { period: "2026", company: "Cisco NetAcad", role: "Introduction to Cybersecurity & Networking Basics", text: "Security fundamentals, threats, defence and core networking concepts." },
        { period: "2026", company: "TESDA", role: "NCII — Computer Servicing System", text: "NCII-recognised computer servicing competency certification." },
        { period: "2026", company: "DOST", role: "AI in Programming — Server Set-up & Deployment", text: "Server configuration and application deployment." },
        { period: "2026", company: "EXCEL", role: "Data Analysis using Microsoft Excel", text: "Data cleaning, formulae and reporting in spreadsheets." }
    ],

    /* ---------------- Seminars & training ---------------- */
    seminars: [
        { date: "Mar 14, 2026", title: "Practical Data Analysis Using Python & Data Visualisation", org: "University of the Cordilleras" },
        { date: "Mar 14, 2026", title: "Practical App Development", org: "University of the Cordilleras" },
        { date: "Mar 7, 2026",  title: "Quantum Computing: Fundamentals, Concepts & Application", org: "University of the Cordilleras" },
        { date: "Mar 7, 2026",  title: "Blockchain 101: Concepts, Architecture & Real-World Use", org: "University of the Cordilleras" },
        { date: "Feb 6, 2026",  title: "KAS Solution Conference", org: "SotoGrande Hotel, Baguio City" },
        { date: "Oct 23, 2025", title: "SAP Accenture — Student Career Talk Encore Webinar", org: "SAP University Alliances" },
        { date: "Mar 23, 2023", title: "Work Immersion — Improving Skills in IT Technologies", org: "Olla Academy, Urdaneta City" },
    ],

    /* ---------------- Recognition & awards ----------------
       Replaces the old testimonial carousel. Everything here is verifiable
       from the résumé — no invented people or companies. */
    awards: [
        {
            icon: "bi-trophy-fill",
            title: "100% Overall Rating",
            meta: "Work Immersion Performance Appraisal · Olla Academy, Urdaneta City · Mar 2023",
            text: "Top overall score on the work immersion performance appraisal."
        },
        {
            icon: "bi-mortarboard-fill",
            title: "14th Regional Health Research Conference",
            meta: "Benguet State University, La Trinidad, Benguet · Jun 19, 2026",
            text: "Participated in the regional research conference programme."
        },
        {
            icon: "bi-globe-asia-australia-fill",
            title: "NDRM Summit EXPO 2026",
            meta: "Baguio City · Jul 23, 2026",
            text: "Attended the summit expo expo of regional development organisations."
        },
        {
            icon: "bi-patch-check-fill",
            title: "9 Certificates Earned in 2026",
            meta: "Cisco NetAcad · TESDA",
            text: "Six Cisco Networking Academy credentials plus three TESDA certifications."
        }
    ]
};

/* Expose the data to main.js.
   A top-level `const` in a classic script creates a script-scoped lexical
   binding, NOT a property of `window` — so `window.PORTFOLIO_DATA` would be
   undefined. main.js reads it off `window`, so publish it explicitly here. */
window.PORTFOLIO_DATA = PORTFOLIO_DATA;