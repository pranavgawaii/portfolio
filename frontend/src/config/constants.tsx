import { ProfileData, ExperienceItem, ProjectItem, EducationItem, LeadershipItem } from '../types/index';
import { Github, Linkedin, Mail, ExternalLink, Twitter, Youtube, Instagram } from 'lucide-react';
import { XIcon, MediumIcon } from '../components/icons/CustomIcons';

export const PROFILE: ProfileData = {
  name: "Pranav Gawai",
  title: "Full Stack Engineer",
  location: "Pune, MH",
  bio: "Pre-final year B.Tech CSE (AI/ML) student targeting AI-first startups and product companies. Building in public, shipping AI-native SaaS products, and competing in national-level hackathons.",
  socials: [
    { name: "X", url: "https://x.com/pranavgawai_", icon: "x" },
    { name: "LinkedIn", url: "https://linkedin.com/in/pranavgawai", icon: "linkedin" },
    { name: "GitHub", url: "https://github.com/pranavgawaii", icon: "github" },
    { name: "Medium", url: "https://medium.com/@pranavgawai", icon: "medium" },
    { name: "Instagram", url: "https://www.instagram.com/pranavgawai_/", icon: "instagram" },
    { name: "Email", url: "mailto:pranavgawai1518@gmail.com", icon: "mail" },
  ],
  skills: [
    { name: "Languages", skills: ["Python", "TypeScript", "JavaScript", "SQL"] },
    { name: "Frameworks", skills: ["Next.js", "React", "FastAPI", "Node.js", "Tailwind CSS"] },
    { name: "Databases", skills: ["PostgreSQL", "Supabase", "MongoDB", "Redis"] },
    { name: "AI & ML", skills: ["Claude Haiku", "OpenRouter", "Groq", "pgvector", "MCP"] },
    { name: "Infrastructure", skills: ["Vercel", "Railway", "Cloudflare R2", "Upstash", "Docker"] },
    { name: "Tools", skills: ["Git", "GitHub", "Prisma", "BullMQ", "Figma", "Clerk"] },
  ]
};

export const EDUCATION: EducationItem[] = [
  {
    id: "edu-1",
    institution: "MIT-ADT University",
    degree: "B.Tech in Computer Science and Engineering (AI/ML)",
    period: "2023 to 2027",
    location: "Pune, Maharashtra",
    details: [
      "Specialisation: Artificial Intelligence & Machine Learning",
      "Active member of the Technical Council",
      "Placement Coordinator helping peers prep for interviews, build profiles, and secure engineering roles",
    ]
  },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: "exp-3",
    role: "Software Developer",
    company: "CraftaStudio",
    period: "Jan 2026 to Present",
    type: "Current",
    location: "Remote",
    logo: undefined,
    description: [
      "Built an AI-native SaaS platform with architecture-first parallel code generation using a SharedContext object.",
      "Designed a block dependency graph (DAG) on ReactFlow canvas with Monaco Editor integration.",
      "Implemented an LLM fallback chain: Claude Haiku → Groq → OpenRouter → Gemini → Sarvam for resilient inference.",
      "Managed BullMQ job queues, Python FastAPI agent layer, and PostgreSQL via Prisma on Railway.",
      "Filed Invention Disclosure Form with MIT-ADT's RDC-IPR Cell; applied for AWS Activate credits.",
    ],
    techStack: ["Next.js", "FastAPI", "ReactFlow", "Monaco Editor", "BullMQ", "Prisma", "PostgreSQL", "Claude Haiku", "Groq"]
  },
  {
    id: "exp-2",
    role: "Full Stack Developer",
    company: "Danges Academy",
    period: "Nov 2025 to Present",
    type: "Freelance",
    location: "Freelance",
    logo: "/dange.png",
    description: [
      "Building the academy's production website from scratch, owning frontend architecture and core features.",
      "Developed authentication flows, course management UI, and responsive layouts used by real users.",
      "Designed scalable component structure and handled performance optimizations during development.",
      "Collaborating directly with stakeholders to translate requirements into shipped features.",
    ],
    techStack: ["React.js", "Vite", "Framer Motion", "JavaScript", "Lucide React"]
  },
  {
    id: "exp-1",
    role: "Software Development Intern",
    company: "Yes Boss Technology Pvt. Ltd.",
    period: "Jun 2025 to Sep 2025",
    type: "On-site",
    location: "On-site",
    logo: "/yesbosslogo.jpg",
    description: [
      "Built and maintained backend REST APIs using Django and PostgreSQL for production features.",
      "Developed an analytics dashboard with logging, usage tracking, and data export.",
      "Improved API performance and reduced response latency by ~30%.",
      "Collaborated via GitHub on feature development, reviews, and deployments."
    ],
    techStack: ["Django", "PostgreSQL", "GPT-4", "Agile"]
  }
];

export const PROJECTS: ProjectItem[] = [
  {
    id: "proj-auren",
    title: "Auren - Autonomous Multi-Agent OS",
    description: "AI execution layer built solo in ~6 days. Integrates Gmail, Google Calendar, and GitHub via MCP with Human-in-the-Loop confirmation before any action executes.",
    longDescription: "Auren is an AI execution agent that integrates Gmail, Google Calendar, and GitHub through the Model Context Protocol (MCP). It features a Human-in-the-Loop confirmation pattern no action executes without user approval. Built for the Corsair × ChaiCode Hackathon in approximately 6 days.",
    techStack: ["Next.js", "Supabase", "pgvector", "Clerk", "OpenRouter", "Claude Haiku", "MCP"],
    github: "https://github.com/pranavgawaii",
    link: "https://tryauren.in",
    status: "",
    image: "/sahara_preview.jpg",
    architecture: [
      { layer: "Frontend", tech: "Next.js + Clerk Auth", desc: "Warm cream UI (#FBF3EC), coral accent (#E8593C)" },
      { layer: "MCP Layer", tech: "Corsair MCP", desc: "Gmail, Google Calendar, GitHub integrations" },
      { layer: "AI Core", tech: "Claude Haiku + OpenRouter", desc: "Email classification & multi-model routing" },
      { layer: "Memory", tech: "Supabase + pgvector", desc: "Semantic memory with cosine similarity search" },
      { layer: "Human-in-Loop", tech: "Confirmation UI", desc: "Every action requires explicit user approval" },
    ]
  },
  {
    id: "proj-rovn",
    title: "Rovn - AI Omnichannel Inbox",
    description: "AI omnichannel inbox for Indian SMBs integrating WhatsApp, Instagram, and Email into one unified dashboard. Scored 88/100 from OpenAI & Outskill judges.",
    longDescription: "Rovn is an AI-powered omnichannel inbox designed for Indian SMBs. It unifies WhatsApp, Instagram, and Email into one intelligent dashboard with AI-driven response suggestions. Achieved Top 1% of 10,000+ teams at the OpenAI × Outskill Hackathon with an 88/100 judge score.",
    techStack: ["Next.js", "Node.js", "WhatsApp API", "Instagram API", "OpenAI", "PostgreSQL"],
    github: "https://github.com/pranavgawaii",
    link: "https://github.com/pranavgawaii",
    status: "",
    image: "/medsecure24_preview.jpg",
    architecture: [
      { layer: "Inbox UI", tech: "Next.js Dashboard", desc: "Unified view across all channels" },
      { layer: "Channels", tech: "WhatsApp + Instagram + Email APIs", desc: "Real-time message ingestion" },
      { layer: "AI Layer", tech: "OpenAI GPT", desc: "Smart reply suggestions & auto-categorization" },
      { layer: "Database", tech: "PostgreSQL", desc: "Message threading, contacts, conversation history" },
    ]
  },
  {
    id: "proj-specboard",
    title: "SpecBoard - Build Faster",
    description: "Multi-tenant SaaS platform tracking PRD requirements through the full delivery lifecycle with GitHub PR integration. Built for ChaiCode Builder Mode On hackathon.",
    longDescription: "Specboard is a multi-tenant SaaS platform that tracks PRD (Product Requirements Document) requirements through the entire delivery lifecycle, with native GitHub PR integration to link specs to code. In active development for the ChaiCode 'Builder Mode On' hackathon.",
    techStack: ["Next.js", "Supabase", "GitHub API", "Prisma", "TypeScript"],
    github: "https://github.com/pranavgawaii",
    link: "https://specboard.in",
    status: "",
    image: "/sahara_preview.jpg",
    architecture: [
      { layer: "Multi-tenant UI", tech: "Next.js App Router", desc: "Per-org workspace with role-based access" },
      { layer: "PRD Engine", tech: "Custom spec parser", desc: "Requirement → ticket → PR lifecycle tracking" },
      { layer: "GitHub Integration", tech: "GitHub API", desc: "Link PRs to specific requirements in real-time" },
      { layer: "Database", tech: "Supabase + Prisma", desc: "Multi-tenant schema with RLS policies" },
    ]
  },
  {
    id: "proj-1",
    title: "MedSecure - Real-Time ICU Monitoring",
    description: "Encrypted live vitals monitoring system using AES-256, JWT, and Socket.io with sub-2s latency. Complete security architecture and threat model delivered in 24 hours.",
    longDescription: "MedSecure24 is a real-time medical vitals monitoring system built with end-to-end encryption. Uses AES-256 for data at rest, JWT for auth, and Socket.io for sub-2 second live transmission. Built and presented in a 24-hour national cybersecurity hackathon securing 1st place.",
    techStack: ["React", "Node.js", "PostgreSQL", "AES-256", "Socket.io", "JWT"],
    github: "https://github.com/pranavgawaii/medsecure",
    link: "https://youtu.be/Q7ZKzBrLb5E",
    youtube: "https://youtu.be/Q7ZKzBrLb5E",
    status: "",
    image: "/medsecure24_preview.jpg",
    architecture: [
      { layer: "Client", tech: "React Dashboard", desc: "Real-time vitals display with alert thresholds" },
      { layer: "Transport", tech: "Socket.io", desc: "Sub-2s bidirectional vitals streaming" },
      { layer: "Auth", tech: "JWT + AES-256", desc: "End-to-end encryption, role-based access" },
      { layer: "API", tech: "Node.js + Express", desc: "REST endpoints for device registration & history" },
      { layer: "Database", tech: "PostgreSQL", desc: "Encrypted vitals time-series storage" },
    ]
  },
  {
    id: "proj-2",
    title: "Sahara - AI Mental Health Agent",
    description: "WCAG 2.1-compliant accessible platform with Google OAuth, real-time messaging, and multilingual Gemini AI chatbot with voice features serving 200+ active users.",
    longDescription: "Sahara is a fully accessible platform built to WCAG 2.1 AA standards. Features Google OAuth, real-time messaging via Socket.io, a multilingual Gemini AI chatbot with voice input, and serves 200+ active users. Secured Top 10 among 800+ teams at Smart India Hackathon 2025.",
    techStack: ["React", "TypeScript", "Node.js", "Gemini API", "Socket.io", "Google OAuth"],
    github: "https://github.com/pranavgawaii/sahara-main",
    link: "https://github.com/pranavgawaii/sahara-main",
    youtube: "https://youtu.be/YhirH5UDh-4",
    status: "",
    image: "/sahara_preview.jpg",
    architecture: [
      { layer: "Frontend", tech: "React + TypeScript", desc: "WCAG 2.1 AA compliant, screen reader support" },
      { layer: "Auth", tech: "Google OAuth 2.0", desc: "SSO with secure session management" },
      { layer: "Real-time", tech: "Socket.io", desc: "Live messaging and presence indicators" },
      { layer: "AI Chatbot", tech: "Gemini API", desc: "Multilingual support + voice input/output" },
      { layer: "Backend", tech: "Node.js + Express", desc: "REST API with rate limiting & CORS" },
    ]
  },
  {
    id: "proj-placepro",
    title: "PlacePro - Placement Management",
    description: "Campus placement management platform pitched to the TPO cell at MIT-ADT. Streamlines placement drives, student profiles, and recruiter coordination.",
    longDescription: "PlacePro is a campus placement management system designed for the MIT-ADT university TPO cell. It streamlines end-to-end placement drive management from student profile creation to recruiter coordination and offer letter distribution. Pitched directly to the Training and Placement Office.",
    techStack: ["React", "Node.js", "PostgreSQL", "Express"],
    github: "https://github.com/pranavgawaii",
    link: "https://placepro.in",
    status: "",
    image: "/postgenius_preview.jpg",
    architecture: [
      { layer: "Student Portal", tech: "React Dashboard", desc: "Profile builder, application tracker, offer letters" },
      { layer: "TPO Admin", tech: "Admin Panel", desc: "Drive management, eligibility filters, bulk comms" },
      { layer: "Recruiter Portal", tech: "Company View", desc: "JD posting, shortlisting, scheduling" },
      { layer: "Backend", tech: "Node.js + Express", desc: "REST API with role-based access control" },
      { layer: "Database", tech: "PostgreSQL", desc: "Students, drives, applications, offers schema" },
    ]
  },
];

export const LEADERSHIP: LeadershipItem[] = [
  {
    id: "lead-mlss",
    title: "Amazon MLSS 2026",
    role: "Cleared SOP Round Selection Test Window Opens",
    description: "Cleared the Statement of Purpose screening round for Amazon's prestigious Machine Learning Summer School 2026. Selection test window opens June 28.",
    category: "award"
  },
  {
    id: "lead-openai",
    title: "Top 1% of 10,000+ Teams",
    role: "OpenAI × Outskill Hackathon Rovn (Score: 88/100)",
    description: "Built Rovn, an AI omnichannel inbox for Indian SMBs. Judges from OpenAI & Outskill awarded 88/100: 'Strong submission with clear product direction, solid build quality, and a well-structured evaluation narrative.'",
    category: "award"
  },
  {
    id: "lead-1",
    title: "1st Place Winner",
    role: "24-Hour National Cybersecurity Hackathon 2025 (MedSecure24)",
    description: "Built and presented a cybersecurity-focused encrypted vitals system under a 24-hour deadline, securing first place through technical execution and security architecture depth.",
    category: "award"
  },
  {
    id: "lead-ai-grand",
    title: "2nd Place",
    role: "National AI Grand Challenge",
    description: "Secured 2nd place at the National AI Grand Challenge, competing against top engineering teams with an AI-driven solution evaluated on real-world impact and technical rigor.",
    category: "award"
  },
  {
    id: "lead-3",
    title: "Top 10 Finalist",
    role: "Smart India Hackathon 2025 800+ Teams (Sahara)",
    description: "Selected among the top 10 teams nationwide out of 800+ entries by building a scalable, WCAG-compliant accessibility platform evaluated by industry and government mentors.",
    category: "award"
  },
  {
    id: "lead-2",
    title: ".PlacePro - College Placement Portal",
    role: "MIT-ADT University Batch 2027 Core Team",
    description: "Serving on the core placement team, coordinating campus recruitment with 50+ companies and organizing large-scale training and placement activities for 1200+ students.",
    category: "role"
  },
  {
    id: "lead-4",
    title: "GitHub Foundations Certification",
    role: "Score: 83/100",
    description: "Demonstrated strong understanding of version control, Git workflows, collaboration practices, and open-source fundamentals.",
    category: "certification"
  },
  {
    id: "lead-5",
    title: "NPTEL Certification",
    role: "Design and Analysis of Algorithms",
    description: "Completed an academically rigorous course covering algorithm design, complexity analysis, and problem-solving techniques.",
    category: "certification"
  },
];

export const ICONS_MAP: Record<string, any> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  external: ExternalLink,
  twitter: Twitter,
  x: XIcon,
  medium: MediumIcon,
  instagram: Instagram
};

export const BLOGS: BlogPost[] = [
  {
    id: "blog-internal-6",
    slug: "howsqlactuallyworks",
    title: "How SQL Actually Works",
    description: "Tables, queries, joins, indexes, transactions: the whole picture, drawn out. The post I wish someone had handed me before my first slow endpoint.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2068&auto=format&fit=crop",
    date: "Jul 18, 2026",
    tags: ["SQL", "Databases", "Engineering"],
    platform: "Portfolio",
    isLocal: true,
    content: [
      {
        type: "paragraph",
        text: "Every app you've ever used is quietly asking a database questions. Instagram asking 'which posts should this person see'. A food delivery app asking 'which restaurants are open near this location'. Your bank asking 'how much money does this account actually have'. Almost all of it, underneath, is SQL."
      },
      {
        type: "paragraph",
        text: "The first time I debugged a genuinely slow endpoint, I spent a full day suspecting everything except the database. Then I turned on query logging and watched one innocent-looking API call fire 340 separate SQL queries. I refreshed the log twice because I didn't believe the number. That was the day SQL stopped being a college subject for me and became the thing that decides whether an app feels instant or broken. This post is everything that clicked after that day, drawn out the way I wish someone had drawn it for me."
      },
      {
        type: "heading",
        text: "A table is not a spreadsheet"
      },
      {
        type: "paragraph",
        text: "Strip away the jargon and a database is a collection of tables. A table is rows and columns. Each column has a name and a type: text, number, date. Each row is one record: one user, one order, one message. That's the whole idea. Everything else in SQL (joins, indexes, transactions) is machinery built on top of it."
      },
      {
        type: "diagram",
        diagram: "table-anatomy",
        caption: "This is all a table is. Columns define the shape, every row is one thing that exists."
      },
      {
        type: "paragraph",
        text: "The difference from a spreadsheet is the rules. A database enforces them: this column must be unique, this one can never be empty, this one must point to a real row in another table. A spreadsheet politely accepts your typos. A database refuses to. That refusal is the entire point: it's what lets a million rows stay trustworthy."
      },
      {
        type: "heading",
        text: "A query is a question"
      },
      {
        type: "paragraph",
        text: "SQL reads badly until you realise it's just a question with strict grammar. 'Which users signed up this week?' becomes SELECT, FROM, WHERE. You're not writing a program; you're filling out a very picky form. The database takes the question and hands you back rows that match."
      },
      {
        type: "diagram",
        diagram: "query-result",
        caption: "English in, rows out. SELECT picks the columns, FROM picks the table, WHERE filters the rows."
      },
      {
        type: "heading",
        text: "Where SQL actually lives in an app"
      },
      {
        type: "paragraph",
        text: "The part no tutorial bothers to show: where does this run? Not in the browser. Your frontend talks to an API server. The API server writes the SQL, sends it to the database over a connection, gets rows back, converts them to JSON, and ships them to the screen. That whole round trip happens on every feed refresh, every search, every cart update, often dozens of times per page."
      },
      {
        type: "diagram",
        diagram: "system-architecture",
        caption: "The round trip behind every screen you scroll. The database is always the last stop, and usually the reason the trip was slow."
      },
      {
        type: "heading",
        text: "Joins: two tables, one answer"
      },
      {
        type: "paragraph",
        text: "Data gets split across tables on purpose: users in one, orders in another, so nothing is written down twice. A JOIN stitches them back together at question time: 'give me every order, with the name of the person who placed it.' The database matches rows on a shared column and returns one combined answer."
      },
      {
        type: "diagram",
        diagram: "join-tables",
        caption: "The join matches orders.user_id to users.id. Pranav appears twice because he placed two orders; the join follows the data, not the other way around."
      },
      {
        type: "heading",
        text: "Everyone learns SQL backwards"
      },
      {
        type: "paragraph",
        text: "Tutorials teach you SELECT, WHERE, JOIN on a table with ten rows. Every query is instant, so you come away believing syntax is the skill. It isn't. The skill is knowing what a query costs. On ten rows, everything works. On a hundred thousand, the query that worked fine yesterday takes four seconds today, and nothing in the syntax changed. What changed is that the database started making different decisions, and you never learned that the database makes decisions at all."
      },
      {
        type: "paragraph",
        text: "The mental model that fixed this for me: SQL is not instructions, it's a request. You describe what you want, and a query planner (a genuinely clever piece of software) decides how to get it. Once you internalise that there's a planner, the next question becomes obvious: what did it decide? And there's a command for exactly that."
      },
      {
        type: "diagram",
        diagram: "query-planner",
        caption: "Your SQL is a request, not a procedure. The planner decides how it actually runs, and its two moods are very different."
      },
      {
        type: "heading",
        text: "N+1: the bug every ORM gives you for free"
      },
      {
        type: "paragraph",
        text: "The 340-query endpoint was a textbook N+1. Fetch a list of students: one query. Then, inside a loop, access each student's department: one more query per student. The ORM makes this invisible because accessing a property doesn't look like a database call. It looks like reading a field. Django fires the query lazily, Prisma does its own version of it, and your code reads beautifully while your database gets hammered."
      },
      {
        type: "paragraph",
        text: "The fix is one line: select_related in Django, include in Prisma, which turns the whole thing into a single JOIN. But the fix isn't the lesson. The lesson is the habit: log your queries in development, and every time you write a loop that touches model objects, ask what each iteration actually costs. I've caught this bug in every ORM codebase I've worked in since, including my own."
      },
      {
        type: "diagram",
        diagram: "n-plus-one",
        caption: "The same data, fetched two ways. The ORM writes the left column for you unless you tell it not to."
      },
      {
        type: "heading",
        text: "Indexes: not what makes it fast, what makes it findable"
      },
      {
        type: "paragraph",
        text: "The tutorial version is 'indexes make queries fast.' The real version is: an index is a sorted copy of specific columns, and the planner only uses it when your query matches its shape. I learned the sharp edge of this with a compound index. I had an index on (user_id, created_at) and assumed a query filtering only by created_at would use it. It didn't. A compound index is sorted by the first column first, so if your query skips that column, the index is useless to you. That's the mistake everyone makes exactly once."
      },
      {
        type: "diagram",
        diagram: "compound-index",
        caption: "A compound index only helps queries that use its leading column. Skip it and you're back to scanning."
      },
      {
        type: "paragraph",
        text: "EXPLAIN ANALYZE is how you stop guessing. Prefix any query with it and Postgres tells you the plan: sequential scan or index scan, estimated rows versus actual rows, where the milliseconds went. The first time you catch a seq scan chewing through two hundred thousand rows to return 180, the abstraction breaks in the best possible way. Just this month I shipped indexes for this portfolio's own MongoDB collections: comments and reactions filtered by slug on every page load, no index behind them. Different database, same law: if the engine can't seek, it scans."
      },
      {
        type: "diagram",
        diagram: "explain-output",
        caption: "Before and after, straight from psql. This is the single most useful habit I picked up: read the plan, not the vibes."
      },
      {
        type: "heading",
        text: "Transactions: two users, one row, same moment"
      },
      {
        type: "paragraph",
        text: "Nothing in a tutorial prepares you for concurrency, because tutorials have one user: you. Real systems have two people clicking the same button in the same second. Building PlacePro's application flow made this concrete: read the count of applicants, check it against the limit, insert a new application. Two students submit at the same moment, both reads see the same count, both inserts pass the check, and now the drive is over its limit. Read-check-write feels safe and is quietly broken."
      },
      {
        type: "diagram",
        diagram: "race-condition",
        caption: "Read-check-write, run twice at the same moment. Each transaction is locally correct. The system is wrong."
      },
      {
        type: "paragraph",
        text: "Transactions are the answer, but only half of it. The other half is knowing they don't magically serialise the world; two transactions can still read the same stale value unless you lock the row (SELECT FOR UPDATE) or make the database enforce the rule itself with a constraint. My rule now: any invariant I care about lives in the database, not in application code. Application code is a suggestion. A unique constraint is a law."
      },
      {
        type: "heading",
        text: "The uncomfortable lesson: sometimes you denormalize"
      },
      {
        type: "paragraph",
        text: "College teaches normal forms like theology: duplicating data is sin. Then you build a real feed or dashboard and discover the read path hits five joins on every request while writes happen once an hour. At some point the honest move is storing a computed value (a counter, a denormalized name, a cached aggregate) and accepting that you now have to keep it in sync. That's a real cost. It's just sometimes smaller than the cost of joining five tables at every read."
      },
      {
        type: "diagram",
        diagram: "read-write-ratio",
        caption: "Denormalization doesn't remove the cost. It moves it from the path you hit constantly to the path you hit rarely."
      },
      {
        type: "paragraph",
        text: "The judgment call isn't 'normalize or not.' It's knowing your read-to-write ratio and choosing where the pain goes. Nobody can teach you that from a slide. You have to feel a slow dashboard first."
      },
      {
        type: "heading",
        text: "pgvector broke my mental model"
      },
      {
        type: "paragraph",
        text: "The most fun I've had with SQL recently is semantic memory in Auren, built on Supabase with pgvector. The query looks almost normal (ORDER BY embedding, using a distance operator, LIMIT 5) except what it's doing is cosine similarity search over embeddings. Meaning, ranked by closeness, in the same database that holds users and sessions, inside the same transaction if I want."
      },
      {
        type: "diagram",
        diagram: "pgvector-query",
        caption: "Auren's actual memory lookup, simplified. Semantic search wearing a WHERE clause."
      },
      {
        type: "paragraph",
        text: "Everyone building AI products right now is being sold a dedicated vector store. Sometimes you need one. But there's a strong argument that for most products, vectors are just another column, and keeping them next to your relational data means joins, constraints and transactions all still work. Thirty-year-old SQL absorbed the newest workload in the industry without changing its interface. That's not legacy. That's design."
      },
      {
        type: "heading",
        text: "The honest part"
      },
      {
        type: "paragraph",
        text: "I still Google LEFT JOIN versus RIGHT JOIN sometimes. I have written a subquery, stared at it, and rewritten it as two simple queries because I couldn't convince myself it was correct. None of that embarrasses me anymore. Depth in SQL was never memorising syntax; it's knowing what the database does when you're not looking: the planner choosing a scan, the index sitting unused, the two transactions racing for the same row."
      },
      {
        type: "paragraph",
        text: "Remember that 340-query endpoint from the start of this post? I want to be honest about how I found it: not because I was smart, but because I finally got annoyed enough to look. The query logging was sitting there the whole time, one setting away. Most slow endpoints are like that. The tools that would tell you the truth are already installed: EXPLAIN, query logs, an index you never added. Nobody's hiding the answer from you. You just have to be annoyed enough to ask."
      },
      {
        type: "paragraph",
        text: "So here's the assignment, if you want one: take the slowest endpoint you own, find its heaviest query, and run EXPLAIN ANALYZE on it. Read the plan. Actually read it, line by line, even the parts that look like noise. I will bet you a coffee the database is doing something you never asked for and wouldn't have approved."
      },
      {
        type: "paragraph",
        text: "Go read your slowest query. It's been trying to tell you something for months. I just wasn't listening for a while either."
      }
    ]
  },
  {
    id: "blog-internal-1",
    slug: "whyibuild",
    title: "Why I Build",
    description: "On obsession, overnight servers, and what it actually feels like to ship something from zero.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
    date: "Jun 28, 2025",
    tags: ["Engineering", "Personal"],
    platform: "Portfolio",
    isLocal: true,
    content: [
      {
        type: "paragraph",
        text: "There's a specific feeling I keep chasing. It happens at around 2am, when the terminal finally stops throwing errors and the page loads correctly for the first time. No audience. No notification. Just a browser tab and the quiet knowledge that something that didn't exist twelve hours ago now does."
      },
      {
        type: "paragraph",
        text: "I build because of that feeling. Not the shipping, not the launch. The moment right before it, when the system is alive but the world doesn't know yet."
      },
      {
        type: "heading",
        text: "It started with a broken laptop"
      },
      {
        type: "paragraph",
        text: "My first real project was a Python script that automated attendance tracking for my class. The college portal was painfully slow, the UI was from 2008, and I was tired of manually counting absences. I wrote a scraper, wrapped it in a loop, and sent the results to a WhatsApp group via an API I definitely should not have been using."
      },
      {
        type: "paragraph",
        text: "It didn't scale. It broke every time the college updated their login page. But 40 people used it every morning. That was enough."
      },
      {
        type: "heading",
        text: "The gap between learning and building"
      },
      {
        type: "paragraph",
        text: "Courses teach you syntax. Projects teach you judgment. The first time you have to decide between three possible solutions, all of which are technically correct, is when real engineering starts. No tutorial covers that moment. You have to build enough junk to develop taste."
      },
      {
        type: "paragraph",
        text: "I've built things that were genuinely embarrassing in retrospect. A React app where every component was in a single 1,400-line file. A FastAPI backend that stored sessions in a global Python dictionary. A hackathon project that worked exactly once, in exactly my environment, in front of exactly the judges who mattered."
      },
      {
        type: "paragraph",
        text: "These failures were not detours. They were the road."
      },
      {
        type: "heading",
        text: "What I'm actually trying to build"
      },
      {
        type: "paragraph",
        text: "I'm pre-final year. I have time. Not a lot, but enough to be deliberate. I'm not trying to collect side projects; I'm trying to develop depth. The difference is what you do with feedback. A side project sits on GitHub with 3 stars. Depth means you shipped it, watched real users break it in ways you didn't predict, fixed it, and shipped again."
      },
      {
        type: "paragraph",
        text: "I want to work at an AI-first startup where the problem is genuinely unsolved and the team is small enough that one person's judgment materially changes the outcome. That goal shapes what I build now: not demos, but systems. Not features, but products."
      },
      {
        type: "heading",
        text: "The honest part"
      },
      {
        type: "paragraph",
        text: "Building is not always romantic. Most days look like: debugging a CORS error for an hour, realising you spelled the environment variable wrong, fixing it, then finding a completely different bug underneath. There's no montage. There's just you, the terminal, and the stubborn belief that it should work."
      },
      {
        type: "paragraph",
        text: "But when it does work, when the pieces finally connect and the system does exactly what you asked it to do, there's nothing quite like it. I don't know how to explain it to someone who hasn't felt it. You just have to build something."
      },
      {
        type: "paragraph",
        text: "So build something."
      }
    ]
  },
  {
    id: "blog-1",
    slug: "gitvisualworkflow",
    title: "Git Visual Workflow",
    description: "A beginner's guide to mastering Git visually. Understand branches, commits, and merges with easy-to-follow diagrams.",
    image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=2076&auto=format&fit=crop",
    link: "https://pranavgawai.hashnode.dev/git-for-beginners-visual-workflow",
    date: "Oct 12, 2023",
    tags: ["Git", "DevOps"],
    platform: "Hashnode"
  },
  {
    id: "blog-2",
    slug: "sih2024",
    title: "From Ideas to Impact: My SIH 2024 Journey",
    description: "A detailed account of my Smart India Hackathon experience: the problem statement, the team, the 36-hour grind, and the lessons that stuck.",
    image: "/blogsih2024.jpg",
    link: "https://medium.com/@pranavgawai1518/from-ideas-to-impact-my-experience-at-the-smart-india-hackathon-34831673024d",
    date: "Sep 20, 2024",
    tags: ["Hackathon", "Experience"],
    platform: "Medium"
  },
  {
    id: "blog-internal-2",
    slug: "theillusionofprogress",
    title: "The Illusion of Progress",
    description: "Why watching tutorials all day feels like learning but isn't. The difference between consuming knowledge and actually building something.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop",
    date: "May 14, 2025",
    tags: ["Personal", "Engineering"],
    platform: "Portfolio",
    isLocal: true,
    content: [
      { type: "paragraph", text: "I've watched enough YouTube tutorials to build an entire company. I haven't. That's the thing nobody tells you: consuming is not the same as creating. They feel identical from the inside, and that's exactly the problem." },
      { type: "paragraph", text: "There's a dopamine hit that comes from finishing a tutorial. You close the tab feeling like you've done something. But you haven't built anything. The code lives in the instructor's repository. The thinking was theirs. You followed instructions. That's useful, but it's not engineering." },
      { type: "heading", text: "What fake progress looks like" },
      { type: "paragraph", text: "Fake progress has a recognisable shape. You switch frameworks every two weeks because the new one looks cleaner. You spend four days setting up a perfect development environment. You refactor working code into something more 'elegant.' You read architecture articles without having architected anything yourself." },
      { type: "paragraph", text: "I've done all of these. I had opinions about Next.js App Router vs Pages Router before I'd shipped a single Next.js app to production. I had thoughts on microservices before I'd run into the limits of a monolith. The confidence was completely unearned." },
      { type: "heading", text: "The thing that actually moved me forward" },
      { type: "paragraph", text: "The first time real progress happened, I noticed it by accident. I was building something for a hackathon: deadline in 36 hours, no time to read documentation carefully, just trying to make things work. I was forced to debug instead of watch. Forced to make decisions instead of follow along. Forced to ship something broken and fix it in public." },
      { type: "paragraph", text: "That experience compressed three months of tutorial-watching into 36 hours of actual learning. I came out of it understanding things in my hands, not just my head." },
      { type: "heading", text: "The reframe that helped" },
      { type: "paragraph", text: "A senior engineer once told me: if you can't explain what you built to a five-year-old, you didn't build it; you assembled it. That distinction matters. Assembly is valuable. It's how you start. But you have to eventually understand the pieces, not just know where they slot together." },
      { type: "paragraph", text: "Now when I notice myself switching tabs to a new tutorial instead of debugging the one thing in front of me, I stop. The discomfort of not knowing is where the actual learning is. Staying in it is the job." },
      { type: "paragraph", text: "Tutorials are maps. Maps are useful. But you learn the territory by walking it, not by memorising the map." }
    ]
  },
  {
    id: "blog-internal-3",
    slug: "howithinkaboutaiproducts",
    title: "How I Think About AI Products",
    description: "Most AI products are search bars with a language model attached. The ones that last are built around a problem, not a model.",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=2070&auto=format&fit=crop",
    date: "Apr 2, 2025",
    tags: ["AI", "Engineering"],
    platform: "Portfolio",
    isLocal: true,
    content: [
      { type: "paragraph", text: "In 2023, the playbook was simple: take ChatGPT, wrap a UI around it, add a specific domain label ('AI for legal', 'AI for sales', 'AI for homework') and ship. Some of those products worked. Most of them didn't, because the differentiation was purely cosmetic. The underlying logic was identical. The moat was exactly zero." },
      { type: "paragraph", text: "I've been thinking a lot about what makes an AI product actually worth building. Not in the hype sense, but in the sense of: would this exist and be useful in five years, or is it a temporary bridge product that gets absorbed into the model itself?" },
      { type: "heading", text: "The distribution trap" },
      { type: "paragraph", text: "A lot of AI founders I've spoken to think about distribution first. Get users, iterate on the product later. This works in consumer apps because the switching cost is low and attention is the game. It doesn't work as well for AI products, because the AI is the product, and if the AI gets commoditised (it will), you need something underneath that isn't just the model." },
      { type: "paragraph", text: "The companies that will survive the AI commoditisation cycle are the ones that have accumulated proprietary data, deeply embedded workflows, or genuinely novel model applications that aren't obvious. Those things take time. Distribution-first can't shortcut them." },
      { type: "heading", text: "What I look for" },
      { type: "paragraph", text: "When I'm thinking about whether to build something, I ask: is this product useful without the AI? If the answer is no, then the AI is the entire value proposition, and that's a fragile position. If the answer is yes, then the AI is an accelerant. That's a much stronger place to build from." },
      { type: "paragraph", text: "The second question is: who benefits the most from this being automated? Not 'who would use it' but 'whose job or life gets materially better.' The gap between those two groups is where most AI products fail. They get used but not relied on." },
      { type: "heading", text: "What I'm building toward" },
      { type: "paragraph", text: "The project I'm most excited about right now involves code generation, specifically the problem of generating large, interdependent codebases, not just individual functions. The insight is that most LLM code generation fails at scale because it doesn't model dependencies. Fix that, and you can generate architecture, not just snippets." },
      { type: "paragraph", text: "Whether that's the right insight, I won't know until it's in users' hands. But that's the point. You build toward the hypothesis, ship it, and let reality correct you." }
    ]
  },
  {
    id: "blog-internal-5",
    slug: "thepriceofstartingover",
    title: "The Price of Starting Over",
    description: "On deleting months of work, the courage it takes to restart with better judgment, and why the second version is always built on the ruins of the first.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
    date: "Jun 29, 2026",
    tags: ["Engineering", "Personal"],
    platform: "Portfolio",
    isLocal: true,
    content: [
      { type: "paragraph", text: "Last year I deleted three months of code in a single afternoon. Not because it didn't work. It worked fine. I deleted it because I finally understood what I was actually building, and the code I had written was for a different problem." },
      { type: "paragraph", text: "Starting over is not failure. It is the most honest thing a builder can do. But nobody talks about what it costs, not the time, not the sunk effort, but the specific psychological weight of looking at something you made with care and choosing to let it go." },
      { type: "heading", text: "What the first version always gets wrong" },
      { type: "paragraph", text: "The first version of anything is written in the language of assumptions. You assume you understand the user. You assume the architecture will hold. You assume the problem is the shape you think it is. Every assumption gets encoded into the structure of your code: in the schema, the component hierarchy, the API surface. And then reality arrives." },
      { type: "paragraph", text: "Users do not use things the way you imagined. The schema doesn't fit the query patterns you actually need. The component that made perfect sense at week two becomes a liability at week ten. The first version teaches you what the second version should have been from the start." },
      { type: "paragraph", text: "This is not a mistake. This is the process. The first version is the research. The second version is the product." },
      { type: "heading", text: "Why it's so hard to let go" },
      { type: "paragraph", text: "We attach identity to our work. The three-month codebase isn't just files on a disk; it's proof that you showed up, that you tried, that you built something. Deleting it feels like erasing yourself. This feeling is a lie, but it's a convincing one." },
      { type: "paragraph", text: "The sunk cost fallacy hits differently in software than anywhere else, because the 'cost' is invisible. Nobody sees the nights you spent debugging that authentication flow. There's no receipt for the Saturday you spent designing the database schema. So the moment you scrap it, it's as if those hours evaporated entirely. They didn't: they live in your head as the knowledge that makes version two faster and better. But in the moment, it doesn't feel that way." },
      { type: "heading", text: "The discipline of the fresh start" },
      { type: "paragraph", text: "There's a craft to starting over well. The worst thing you can do is rebuild the same thing faster. The whole point of the restart is that you now know something you didn't. If you rebuild without incorporating that knowledge, you're just paying the price of starting over without collecting the reward." },
      { type: "paragraph", text: "I spent a week before touching the keyboard, writing down everything I'd learned. Not in code. In sentences. What the actual problem was. What the user actually needed. What I would never do again, and why. Then I started building. The second version took half the time and was three times more coherent." },
      { type: "paragraph", text: "The document I wrote that week is still the best technical writing I've ever done. It was honest in a way that upfront documentation never is, because it was written by someone who had already failed once." },
      { type: "heading", text: "What it means to build well" },
      { type: "paragraph", text: "I've come to think that the willingness to restart is one of the clearest signals of a good engineer. It requires separating your ego from your output, something that's much harder than it sounds, and something that gets easier with practice. It requires trusting that your time wasn't wasted even when the artefact is gone. And it requires believing that the version of you who restarts is more capable than the version of you who started." },
      { type: "paragraph", text: "That belief, it turns out, is almost always correct." },
      { type: "paragraph", text: "Delete the thing. Write down what you know. Build the second version. The first one was never the point." }
    ]
  },
  {
    id: "blog-internal-4",
    slug: "onbeingastudentengineer",
    title: "On Being a Student Engineer",
    description: "The strange position of building real things while sitting in lectures. What college teaches you, what it doesn't, and why both matter.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
    date: "Mar 10, 2025",
    tags: ["Personal"],
    platform: "Portfolio",
    isLocal: true,
    content: [
      { type: "paragraph", text: "I'm writing this between two back-to-back lectures on operating systems. In three hours, I have to submit a database assignment. Tonight, I'm shipping a feature for a real product used by actual people. This is the normal texture of being a student engineer in 2025." },
      { type: "paragraph", text: "The strange thing about this position is that you're simultaneously taken too seriously and not seriously enough. Recruiters at big companies see 'B.Tech, 2nd year' and mentally file you under 'future candidate.' Startups see your GitHub and treat you like a peer. Neither gets it completely right." },
      { type: "heading", text: "What college actually teaches you" },
      { type: "paragraph", text: "Not the syntax. Not the frameworks. Not what any reasonable person would call 'practical skills.' What college teaches you, if you pay attention, is how to learn things you don't want to learn, under time pressure, and produce something that approximates correct." },
      { type: "paragraph", text: "That's not nothing. The muscle of sitting with something confusing and working through it, even when the deadline is tomorrow morning and you still don't understand the third normal form: that's the actual transferable skill. The operating systems knowledge will be mostly irrelevant. The ability to debug unfamiliar systems under pressure will not." },
      { type: "heading", text: "What college doesn't teach you" },
      { type: "paragraph", text: "It doesn't teach you taste. It doesn't teach you when to stop building and start shipping. It doesn't teach you how to disagree with a senior engineer professionally, or how to scope a project so it actually gets done, or how to write a commit message that means something six months later." },
      { type: "paragraph", text: "Those things come from doing the work in the real world. Which is why I think the students who are building alongside college (not instead of it, alongside it) come out significantly further ahead. The context of a real product makes the abstract concepts land differently." },
      { type: "heading", text: "The honest answer to 'what should I do in college?'" },
      { type: "paragraph", text: "Build something. Doesn't have to be big. Doesn't have to be profitable. Has to be real: meaning someone other than you uses it and depends on it. That dependency is what teaches you things no course can." },
      { type: "paragraph", text: "And go to the lectures. Not because the content will save you, but because showing up to hard things consistently is itself a form of practice. The discipline doesn't hurt." }
    ]
  },
];


export type BlogContent =
  | { type: 'paragraph' | 'heading'; text: string }
  | { type: 'diagram'; diagram: string; caption?: string; text?: string };

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  date: string;
  tags?: string[];
  platform?: string;
  isLocal?: boolean;
  content?: BlogContent[];
}


