export type Session = {
  n: string;
  title: string;
  week: string;
  instructor: string;
  desc: string;
  deliverable: string;
  hours: string;
};

export type Faculty = {
  name: string;
  initials: string;
  role: string;
  badge: string;
  tagline: string;
  bio: string;
};

export type WhyPoint = { numeral: string; title: string; body: string };

export type Course = {
  id: string;
  title: string;
  titleZh: string;
  tagline: string;
  price: number; // online price, used for checkout
  priceInPerson: number;
  weeks: number;
  sessions: number;
  hours: number;
  format: string;
  level: string;
  for: string;
  outcomes: string[];
  keywords: string[];

  // editorial landing fields
  vol: string;
  kicker: string;
  headline: { pre: string; accent: string; post: string };
  blurb: string;
  metaLine: string;
  startLine: string;
  founderQuote: string;
  founderNote: string[];
  syllabusTitle: { l1: string; l2: string };
  syllabusIntro: string;
  sessionList: Session[];
  faculty: Faculty;
  why: WhyPoint[];
};

export const COURSES: Course[] = [
  {
    id: "agentic",
    title: "Agentic AI & Autonomous Systems",
    titleZh: "智能体 AI 与自治系统 · 多智能体编排",
    tagline: "The compass course — from neural nets to agent harness.",
    price: 399,
    priceInPerson: 499,
    weeks: 7,
    sessions: 13,
    hours: 22.5,
    format: "Live cohort · Online (Zoom)",
    level: "All levels — meets you where you are",
    for: "builders arriving from prompt engineering, generative AI, or entering fresh",
    outcomes: [
      "Deployed CLI and OpenClaw agents you can demo to employers",
      "An agent-harness strategy written in WRITITATION™",
      "A live, agent-powered career-tracking workflow",
    ],
    keywords: ["agent", "agentic", "openclaw", "opencode", "harness", "orchestration", "cli", "career", "automation", "智能体", "编排", "自动化", "代理"],
    vol: "VOL. 01 · COHORT 2026",
    kicker: "CSTU · CSE642",
    headline: { pre: "From prompt to ", accent: "agent harness", post: "." },
    blurb:
      "The compass course for CSTU's Emerging Technology program. Trace the evolution from machine learning to agent harness — then build with it: CLI-based coding agents, a local agent operating system, and the workflow orchestration patterns that connect them, across software, analytics, content, and go-to-market.",
    metaLine: "13 sessions · 22.5 hours · 1.5 credits · CSTU CSE642",
    startLine: "6.5-week live cohort · Mon & Sat · starts May 2",
    founderQuote: "The tools changed. The roles are changing faster.",
    founderNote: [
      "This course teaches you to operate AI agents across disciplines — not by memorizing commands, but by understanding the system well enough to direct it. You trace the arc that matters: machine learning, transformers, ChatGPT, prompt engineering, context engineering, and the current frontier — agent harness.",
      "It is the bridge from foundational AI literacy into the advanced tracks: Full Stack, DevOps/Platform, AI-Agents, Business Solutions, and GTM Engineering. Whether you arrive from prompt engineering or enter fresh, this course is the instrument to navigate wherever the ecosystem goes next.",
    ],
    syllabusTitle: { l1: "Thirteen sessions.", l2: "One builder's toolkit." },
    syllabusIntro:
      "Two live sessions a week over six and a half weeks — Monday and Saturday on Zoom. The arc runs from the evolution of agents to a real agent harness you design yourself, with hands-on labs in OpenCode and OpenClaw throughout. You finish by presenting a working project and launching a career workflow that keeps running after the course ends.",
    sessionList: [
      { n: "01", title: "The evolution — from neural nets to agent harness", week: "Week 1 · Ping Wu", instructor: "Ping Wu", desc: "Cut through the marketing jargon and trace the arc that matters: ML → transformers → ChatGPT → prompt engineering → context engineering → agent harness. A map of the current landscape.", deliverable: "Articulate why agent harness is a new paradigm.", hours: "3.5h" },
      { n: "02", title: "Layers of AI abstraction — hardware to applications", week: "Week 2 · Ping Wu", instructor: "Ping Wu", desc: "The anatomy of agents and the layers of abstraction. Why an agent is a new operating system — seen through the WRITITATION™ lens that bridges human intent and agent execution.", deliverable: "Map any AI tool to its place in the stack.", hours: "3.5h" },
      { n: "03", title: "The IDE where agents operate", week: "Week 3 · Ping Wu", instructor: "Ping Wu", desc: "VS Code and its variations — Cursor, Antigravity. Installation, configuration, and core UI. Set up the workspace your agents will work inside.", deliverable: "A fully configured development environment.", hours: "3.5h" },
      { n: "04", title: "OpenCode — the CLI-based agent", week: "Week 4 · Ping Wu", instructor: "Ping Wu", desc: "Install and configure a CLI agent; run the software development life cycle via the GSD framework. From a prompt to working code to a committed project.", deliverable: "A multi-step build committed to version control.", hours: "3.5h" },
      { n: "05", title: "OpenClaw — the agent operating system", week: "Week 5 · Ping Wu", instructor: "Ping Wu", desc: "Configuration files, memory, sub-agents, skills, and Slack integration. Signature build: a Daily News Briefing Agent that delivers a personalized morning brief.", deliverable: "A deployed OpenClaw automation you can demo.", hours: "3.5h" },
      { n: "06", title: "Agent harness & WRITITATION™", week: "Week 6 · Ping Wu", instructor: "Ping Wu", desc: "Engineer your goals in markdown with WRITITATION™. The architect's role for knowledge workers — where you stop using tools and start orchestrating systems.", deliverable: "An agent-harness strategy for a real problem.", hours: "3.5h" },
      { n: "07", title: "Solo Unicorn — project & career launch", week: "Week 7 · Ping Wu", instructor: "Ping Wu", desc: "Final presentations and career launch. Three paths: find a job, create jobs, or leverage new skills — plus a live, agent-powered career-tracking workflow that keeps working after the course ends.", deliverable: "A working project + a live career workflow.", hours: "2h" },
    ],
    faculty: {
      name: "Ping Wu",
      initials: "PW",
      role: "Lead Instructor",
      badge: "Professor, CSTU · CSE642",
      tagline: "Agent harness & WRITITATION™ · 22.5 hours",
      bio: "MS Computer Science and a 20+ year cloud solutions architect across AWS, Azure, and GCP — with enterprise experience at SAP, ByteDance/TikTok, Gilead Sciences, and Zuora. AWS Certified Solutions Architect and FinOps Practitioner, with a USPTO patent pending and the trademarked WRITITATION™ methodology.",
    },
    why: [
      { numeral: "I", title: "The compass course", body: "CSTU's bridge from foundational AI literacy into the advanced tracks — Full Stack, DevOps, AI-Agents, Business Solutions, and GTM Engineering. Wherever the ecosystem goes, you'll have the instrument to navigate it." },
      { numeral: "II", title: "Build, don't memorize", body: "Hands-on labs with OpenCode and OpenClaw from week one. You don't learn about agents — you deploy them, and leave with automations you can demonstrate to employers." },
      { numeral: "III", title: "Career infrastructure, not exercises", body: "A LinkedIn profile that attracts, a GitHub portfolio that proves you build, and an agent-powered career workflow that sustains opportunity long after the course ends." },
    ],
  },
  {
    id: "fullstack",
    title: "Fullstack in the Age of AI Agents",
    titleZh: "AI 智能体时代的全栈开发",
    tagline: "Zero to a deployed, AI-powered full-stack app in seven weeks.",
    price: 399,
    priceInPerson: 499,
    weeks: 7,
    sessions: 14,
    hours: 22.5,
    format: "Live cohort · Online (Zoom)",
    level: "Beginner-friendly — little or no programming experience needed",
    for: "anyone who wants to build and deploy real full-stack apps with AI",
    outcomes: [
      "A portfolio site deployed to Vercel",
      "A full-stack CRUD app: Next.js + FastAPI + PostgreSQL",
      "An AI-powered capstone running on Docker Compose",
    ],
    keywords: ["fullstack", "full stack", "nextjs", "fastapi", "postgres", "postgresql", "docker", "claude api", "backend", "crud", "deploy", "全栈", "后端", "部署", "数据库"],
    vol: "VOL. 02 · COHORT 2026",
    kicker: "CSTU · CSE552",
    headline: { pre: "Build software ", accent: "with an agent", post: " beside you." },
    blurb:
      "A seven-week, hands-on path from 'how the web works' to a deployed, AI-powered application. Next.js and Tailwind on the front, FastAPI and PostgreSQL on the back, the Claude API and a tool-calling agent in the middle — all shipped with Docker Compose. AI-assisted coding is a core professional tool from day one.",
    metaLine: "14 sessions · 22.5 hours · 1.5 credits · CSTU CSE552",
    startLine: "7-week live cohort · Thu & Sat · starts May 2",
    founderQuote: "The question isn't just how you build software — it's how you build it when an AI agent is working alongside you.",
    founderNote: [
      "This course introduces students with little or no programming experience to modern full-stack development. AI coding assistants aren't an afterthought — they're a core professional tool used from the very first class, across the entire stack.",
      "By the end you will have designed, built, and deployed a real AI-powered web application: a Next.js frontend, a FastAPI backend, a PostgreSQL database, a Claude-powered feature, and a tool-calling agent — wired together and shipped with a single `docker compose up`.",
    ],
    syllabusTitle: { l1: "Fourteen sessions.", l2: "One deployed app." },
    syllabusIntro:
      "Two live sessions a week over seven weeks — Thursday and Saturday on Zoom. Each week pairs a weekday concept class with a Saturday lab, and most weeks end with something you ship: a page, an API, a database, an AI feature. By Demo Day your capstone runs with a single `docker compose up`.",
    sessionList: [
      { n: "01", title: "Web fundamentals — setup, HTML & CSS", week: "Week 1 · Qingsong Zhang", instructor: "Qingsong Zhang", desc: "How the web works: client-server, HTTP, requests and responses. Set up VS Code, Node, Python, Git, and Claude Code. HTML structure, CSS, the box model, Flexbox, and DevTools.", deliverable: "A static personal page pushed to GitHub.", hours: "3.5h" },
      { n: "02", title: "JavaScript & React/Next.js", week: "Week 2 · Qingsong Zhang", instructor: "Qingsong Zhang", desc: "JavaScript fundamentals and the DOM, then React components, JSX, props, and useState. The Next.js App Router and Tailwind for rapid styling.", deliverable: "Mini Project 1 — a portfolio deployed to Vercel.", hours: "3.5h" },
      { n: "03", title: "Python & FastAPI", week: "Week 3 · Qingsong Zhang", instructor: "Qingsong Zhang", desc: "Python for backends and what a REST API is. FastAPI routes, path and query parameters, and Pydantic validation. Build a Book Tracker API with full CRUD.", deliverable: "A REST API with all CRUD endpoints tested.", hours: "3.5h" },
      { n: "04", title: "Databases & full-stack integration", week: "Week 4 · Qingsong Zhang", instructor: "Qingsong Zhang", desc: "PostgreSQL via Docker and the SQLAlchemy ORM. CORS, then fetch and useEffect to load data in React. Wire the frontend to a live database.", deliverable: "Mini Project 2 — a full-stack CRUD app.", hours: "3.5h" },
      { n: "05", title: "AI integration — LLMs & the Claude API", week: "Week 5 · Qingsong Zhang", instructor: "Qingsong Zhang", desc: "How LLMs work and their limits. The Claude API: models, messages, system prompts, and prompt engineering. Streaming responses and adding an AI endpoint to your app.", deliverable: "An AI feature live in your application.", hours: "3.5h" },
      { n: "06", title: "AI agents & tool use", week: "Week 6 · Qingsong Zhang", instructor: "Qingsong Zhang", desc: "Agents vs chatbots: planning, tools, and multi-step reasoning. The tool-calling pattern and the ReAct loop. Build an agent that reads and writes your app's data.", deliverable: "A working AI agent inside the app.", hours: "3.5h" },
      { n: "07", title: "Deployment & capstone demo day", week: "Week 7 · Qingsong Zhang", instructor: "Qingsong Zhang", desc: "Containers and why they matter. Dockerfiles for Next.js and FastAPI, then Docker Compose to wire frontend, backend, and database into one command. Live capstone demos.", deliverable: "Capstone — an AI app from `docker compose up`.", hours: "3.5h" },
    ],
    faculty: {
      name: "Qingsong Zhang",
      initials: "QZ",
      role: "Lead Instructor",
      badge: "Lecturer, CSTU · CSE552",
      tagline: "Next.js, FastAPI, PostgreSQL & Docker · 22.5 hours",
      bio: "Lecturer for CSTU's Fullstack Software Development in the Age of AI Agents. Teaches the complete stack — Next.js, FastAPI, PostgreSQL, the Claude API, and Docker — to students with little or no prior programming experience, with AI-assisted coding as a core tool from day one.",
    },
    why: [
      { numeral: "I", title: "From zero to deployed", body: "Built for students with little or no programming experience. By the end you've designed, built, and deployed a real AI-powered web application across the full stack." },
      { numeral: "II", title: "AI from day one", body: "AI coding assistants aren't an afterthought — they're a core professional tool from the first class. You learn not just how to build software, but how to build it with an agent beside you." },
      { numeral: "III", title: "A portfolio that proves it", body: "Two mini projects and a capstone, all on a professional GitHub repository — the kind of evidence recruiters actually look for." },
    ],
  },
  {
    id: "opcs",
    title: "One-Person AI Company",
    titleZh: "一人 AI 公司 · OPCS",
    tagline: "A 16-hour live bootcamp for the founder of one.",
    price: 199,
    priceInPerson: 299,
    weeks: 4,
    sessions: 8,
    hours: 16,
    format: "Live cohort · Online + In-person",
    level: "Intermediate",
    for: "founders and freelancers who want to ship a real product solo",
    outcomes: [
      "An AI tool stack that replaces a team",
      "Four monetization tracks you actually run",
      "A live product and a 90-day operating plan",
    ],
    keywords: ["startup", "founder", "solo", "business", "product", "freelance", "创业", "公司", "产品", "一人"],
    vol: "VOL. 03 · COHORT 2026",
    kicker: "CSTU × BayAI Circle",
    headline: { pre: "Build your ", accent: "one-person", post: " AI company." },
    blurb:
      "OPCS — a 16-hour live bootcamp over four weeks for the founder of one. Eight sessions of Silicon Valley trend and real monetization playbooks, with hands-on builds in OpenClaw, Hermes, Claude Code, and Codex — taught by the people running it now.",
    metaLine: "8 sessions · 16 hours · CSTU × BayAI Circle · first-session refund",
    startLine: "4-week live cohort · starts Jul 18 · 24 seats",
    founderQuote:
      "The next generation of billion-dollar companies will be built by individuals — not 50-person teams.",
    founderNote: [
      "Cursor was four people. Midjourney was eleven. Levels.io built six profitable products alone. The leverage AI gives a single founder today is unprecedented — and most professionals are still acting like it's 2019.",
      "OPCS is not another “intro to LLMs” survey course. It's a 16-hour operational playbook: build the AI tool stack that replaces a team, then run four real monetization tracks against it.",
    ],
    syllabusTitle: { l1: "Eight sessions.", l2: "Sixteen hours." },
    syllabusIntro:
      "Two live sessions a week over four weeks. Technical tooling is interleaved with the monetization tracks — build the skill, then put it to work — so you never sit through four hours on one theme. Every session ends with something you ship.",
    sessionList: [
      { n: "01", title: "Silicon Valley AI: trends & opportunities", week: "Week 1 · Jimmy Cai", instructor: "Jimmy", desc: "Where the Valley's AI industry stands today and where it's heading — and what an OPC (One Person Company) actually is.", deliverable: "Define your OPC direction hypothesis.", hours: "2h" },
      { n: "02", title: "OpenClaw & Hermes", week: "Week 1 · Daniel", instructor: "Daniel", desc: "What these tools are and when to reach for them. Environment setup, the core workflow, and one automation built end-to-end.", deliverable: "Your first workflow running locally.", hours: "2h" },
      { n: "03", title: "Claude Code & Codex in practice", week: "Week 2 · Jimmy Cai", instructor: "Jimmy", desc: "Pair-program your product with AI: from a spec to a working feature, with the review habits that keep it shippable.", deliverable: "A working feature shipped.", hours: "2h" },
      { n: "04", title: "Monetization I — productize a service", week: "Week 2 · Jimmy Cai", instructor: "Jimmy", desc: "Turn what you already do into a packaged, priced offer that doesn't trade hours for dollars.", deliverable: "A priced offer page.", hours: "2h" },
      { n: "05", title: "Monetization II — the content engine", week: "Week 3 · Daniel", instructor: "Daniel", desc: "An AI content pipeline that compounds: research, draft, edit, publish, repurpose — on a schedule you can keep.", deliverable: "One week of content queued.", hours: "2h" },
      { n: "06", title: "Monetization III — automate ops & support", week: "Week 3 · Daniel", instructor: "Daniel", desc: "Agents for the boring parts: inbox, scheduling, FAQs, onboarding. Free your hours for the work only you can do.", deliverable: "Two ops tasks automated.", hours: "2h" },
      { n: "07", title: "Monetization IV — launch & sell", week: "Week 4 · Jimmy Cai", instructor: "Jimmy", desc: "Go-to-market for one: a landing page, a launch sequence, and the first cold and warm outreach that books calls.", deliverable: "A live landing + first outreach sent.", hours: "2h" },
      { n: "08", title: "Demo day & the next 90 days", week: "Week 4 · Faculty", instructor: "Faculty", desc: "Show what you built to the cohort, get feedback, and leave with a concrete operating plan for the quarter.", deliverable: "Your 90-day operating plan.", hours: "2h" },
    ],
    faculty: {
      name: "Jimmy Cai",
      initials: "JC",
      role: "Lead Instructor",
      badge: "Visiting Professor, CSTU",
      tagline: "Silicon Valley trends & 4 monetization modules · 12 hours",
      bio: "An operator who runs a profitable one-person company today. Teaches the Silicon Valley trend module and the four monetization tracks — the same playbook he's running this quarter.",
    },
    why: [
      { numeral: "I", title: "University-backed", body: "Curriculum co-developed and certificate co-issued by CSTU and BayAI Circle. Not a Twitter-influencer course — academic credibility you can list on LinkedIn." },
      { numeral: "II", title: "Live, not pre-recorded", body: "Real instructors, real Q&A, real cohort — taught live and recorded for lifetime replay. The in-person track keeps a small room; the online track runs in sync." },
      { numeral: "III", title: "Operators, not academics", body: "Instructors are people running profitable one-person companies right now. The playbook you'll learn is the one they're using this quarter." },
    ],
  },
  {
    id: "btc-ai",
    title: "Bitcoin × AI for Builders",
    titleZh: "比特币 × AI · 开发者实战",
    tagline: "Ship protocol-level Bitcoin code, with AI as your pair.",
    price: 499,
    priceInPerson: 599,
    weeks: 3,
    sessions: 6,
    hours: 12,
    format: "Live cohort · Online",
    level: "Advanced",
    for: "engineers who want to build real Bitcoin Layer 1 applications",
    outcomes: [
      "A working Taproot spend and a test RGB asset",
      "An AI-assisted spec → tests → implementation loop",
      "A reviewed, shippable Bitcoin module",
    ],
    keywords: ["bitcoin", "taproot", "rgb", "engineer", "developer", "protocol", "code", "wallet", "比特币", "开发", "工程", "协议"],
    vol: "VOL. 04 · COHORT 2026",
    kicker: "CSTU × BayAI Circle",
    headline: { pre: "Build on ", accent: "Bitcoin", post: ", with AI as your pair." },
    blurb:
      "A 12-hour technical cohort for engineers: the modern Bitcoin Layer 1 stack — Taproot, Tapscript, and RGB — paired with an AI-assisted workflow that takes you from spec to tested implementation. Build real spends and assets, not toy examples.",
    metaLine: "6 sessions · 12 hours · CSTU × BayAI Circle · code review included",
    startLine: "3-week live cohort · starts Aug 8 · 16 seats",
    founderQuote:
      "AI doesn't replace the engineer who understands the protocol — it makes that engineer dangerous.",
    founderNote: [
      "Bitcoin's Layer 1 changed more in the last few years than most engineers realize. Taproot reshaped scripting; client-side validation opened a new design space. The builders who understand this stack — and pair it with AI tooling — ship things others can't.",
      "This cohort is hands-on and unforgiving in the good way: every session you write real code against signet, with AI driving the spec-to-tests loop and a human review at the end. You leave with reviewed code you'd actually ship.",
    ],
    syllabusTitle: { l1: "Six sessions.", l2: "Real code." },
    syllabusIntro:
      "Two live sessions a week for three weeks. Each session is build-first: a short concept, then you write and run code against a Bitcoin signet node, with AI paired in for the spec-to-tests loop. Reviews are part of the work, not an afterthought.",
    sessionList: [
      { n: "01", title: "The Bitcoin L1 stack today", week: "Week 1 · Aaron Zhang", instructor: "Aaron", desc: "What Taproot changed and why it matters. Set up a dev environment and a signet node you'll build against all cohort.", deliverable: "Your dev env + signet node running.", hours: "2h" },
      { n: "02", title: "Scripting with Taproot", week: "Week 1 · Aaron Zhang", instructor: "Aaron", desc: "Tapscript, key-path vs script-path spends, and the spending conditions that real applications use.", deliverable: "A working Taproot spend.", hours: "2h" },
      { n: "03", title: "RGB & client-side validation", week: "Week 2 · Aaron Zhang", instructor: "Aaron", desc: "Issue and transfer assets on Bitcoin without bloating the chain — the model, the trade-offs, and the tooling.", deliverable: "Issue a test asset.", hours: "2h" },
      { n: "04", title: "AI as your protocol pair", week: "Week 2 · Aaron Zhang", instructor: "Aaron", desc: "Drive Claude Code from a precise spec to tests to implementation — and the guardrails that keep protocol code correct.", deliverable: "A tested module from a spec.", hours: "2h" },
      { n: "05", title: "Build a real app", week: "Week 3 · Aaron Zhang", instructor: "Aaron", desc: "Wire an end-to-end flow: construct, sign, and broadcast a PSBT from your own application code.", deliverable: "A signed PSBT in your app.", hours: "2h" },
      { n: "06", title: "Ship & review", week: "Week 3 · Aaron Zhang", instructor: "Aaron", desc: "Run an AI-assisted security review, then a human pass — the two-layer review every Bitcoin change deserves.", deliverable: "Reviewed, shippable code.", hours: "2h" },
    ],
    faculty: {
      name: "Aaron Zhang",
      initials: "AZ",
      role: "Lead Instructor",
      badge: "Instructor, CSTU",
      tagline: "Taproot, RGB & AI-assisted engineering · 12 hours",
      bio: "Bitcoin Layer 1 engineer working on Taproot and RGB, an OpenSats grantee, and the author of Mastering Taproot. Builds protocol-level software and teaches an AI-assisted workflow for shipping it safely.",
    },
    why: [
      { numeral: "I", title: "Protocol-deep", body: "Not a crypto-hype course. You work at the script and validation layer — the level where real Bitcoin applications are actually built." },
      { numeral: "II", title: "Build every session", body: "Every session ends with code running against signet. You leave with working spends, a test asset, and a reviewed module." },
      { numeral: "III", title: "AI done right for hard code", body: "Learn the spec → tests → implementation loop that makes AI safe for protocol work — with a human review as the last gate." },
    ],
  },
];

export function getCourse(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}
