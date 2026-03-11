import { ProfileData, ExperienceItem, ProjectItem, EducationItem, LeadershipItem } from '../types/index';
import { Github, Linkedin, Mail, ExternalLink, Twitter, Youtube, Instagram } from 'lucide-react';
import { XIcon, MediumIcon } from '../components/icons/CustomIcons';

export const PROFILE: ProfileData = {
  name: "Pranav Gawai",
  title: "Full Stack Engineer",
  location: "Pune, MH",
  bio: "Third-year Computer Science student passionate about building scalable web applications and solving real-world problems through technology. Experienced in full-stack development with React, TypeScript, and Node.js, with hands-on expertise in API design and database optimization. Won 1st place at Cybersecurity Hackathon 2025 and secured Top 10 position among 800+ teams at Smart India Hackathon 2025.",
  socials: [
    { name: "X", url: "https://x.com/pranavgawai_", icon: "x" },
    { name: "LinkedIn", url: "https://linkedin.com/in/pranavgawai", icon: "linkedin" },
    { name: "GitHub", url: "https://github.com/pranavgawaii", icon: "github" },
    { name: "Medium", url: "https://medium.com/@pranavgawai1518", icon: "medium" },
    { name: "Instagram", url: "https://www.instagram.com/pranavgawai_/", icon: "instagram" },
    { name: "Email", url: "mailto:pranavgawai1518@gmail.com", icon: "mail" },
  ],
  skills: [
    { name: "Languages", skills: ["Python", "JavaScript", "TypeScript", "C++", "SQL", "HTML5", "CSS3"] },
    { name: "Frameworks", skills: ["React", "Node.js", "Express.js", "Django", "Flask", "Next.js", "Socket.io", "Tailwind CSS"] },
    { name: "Databases", skills: ["PostgreSQL", "MongoDB", "MySQL", "Redis"] },
    { name: "AI & ML", skills: ["GPT-4", "Google Gemini API", "HuggingFace", "LangChain", "RAG"] },
    { name: "Tools", skills: ["Git", "GitHub", "Docker", "VS Code", "Postman", "Linux/Unix", "Figma"] },
    { name: "Core Skills", skills: ["RESTful APIs", "WebSocket", "System Architecture", "Encryption (AES-256, JWT)"] },
  ]
};

export const EDUCATION: EducationItem[] = [
  {
    id: "edu-1",
    institution: "MIT-ADT University",
    degree: "B.Tech in Computer Science and Engineering (AI)",
    period: "2023 - 2027",
    location: "Pune, Maharashtra"
  },
  {
    id: "edu-2",
    institution: "Maharashtra State Board",
    degree: "",
    period: "",
    location: "Jalna, Maharashtra",
    details: ["Higher Secondary (12th): 85.33%", "Secondary School (10th): 84.80%"]
  }
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: "exp-2",
    role: "Full Stack Developer",
    company: "Danges Academy",
    period: "Nov 2025 – Present",
    type: "Current",
    location: "Remote",
    logo: "/dange.png",
    description: [
      "Building the academy’s production website from scratch, owning frontend architecture and core features.",
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
    period: "Jun 2025 – Sep 2025",
    type: "Internship",
    location: "Remote",
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
    id: "proj-1",
    title: "MedSecure24",
    description: "Developed encrypted live vitals system using AES-256, JWT, and Socket.io with sub-2s latency. Delivered complete security architecture, threat model, and functional prototype in 24 hours.",
    techStack: ["React", "Node.js", "PostgreSQL", "AES-256", "Socket.io"],
    github: "https://github.com/pranavgawaii/medsecure",
    link: "https://youtu.be/Q7ZKzBrLb5E",
    youtube: "https://youtu.be/Q7ZKzBrLb5E",
    status: "1st Place in 24hr Cybersecurity Hackathon",
    image: "/medsecure24_preview.jpg"
  },
  {
    id: "proj-2",
    title: "Sahara",
    description: "Built accessible WCAG 2.1-compliant platform with Google OAuth and real-time messaging. Integrated multilingual Gemini AI chatbot with voice features serving 200+ active users.",
    techStack: ["React", "TypeScript", "Node.js", "Gemini API"],
    github: "https://github.com/pranavgawaii/sahara-main",
    link: "https://github.com/pranavgawaii/sahara-main",
    youtube: "https://youtu.be/YhirH5UDh-4",
    status: "Secure Top 10 among 800+ teams",
    image: "/sahara_preview.jpg"
  },
  {
    id: "proj-3",
    title: "Post Genius",
    description: "Automated Facebook/Twitter post scheduling via Graph APIs. Engineered analytics dashboard and improved performance by 40% through query optimization.",
    techStack: ["Django", "React", "PostgreSQL", "Graph APIs"],
    github: "https://github.com/pranavgawaii/PostGenius-main",
    link: "#",
    image: "/postgenius_preview.jpg"
  }
];

export const LEADERSHIP: LeadershipItem[] = [
  {
    id: "lead-1",
    title: "1st Place Winner",
    role: "24-Hour Cybersecurity Hackathon 2025 (MedSecure24)",
    description: "Built and presented a cybersecurity-focused solution under a 24-hour deadline, competing against multiple teams and securing first place through technical execution and problem clarity.",
    category: "award"
  },
  {
    id: "lead-2",
    title: "Placement Coordinator - Core Team",
    role: "MIT-ADT University",
    description: "Part of the core placement team, coordinating campus recruitment with 50+ companies and organizing large-scale training and placement activities for 1200+ students.",
    category: "role"
  },
  {
    id: "lead-3",
    title: "Top 10 Finalist",
    role: "Smart India Hackathon 2025 among 800+ teams (Sahara)",
    description: "Selected among the top 10 teams nationwide out of 800+ entries by building a scalable, problem-driven solution evaluated by industry and government mentors.",
    category: "award"
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
  {
    id: "lead-6",
    title: "LinkedIn Learning",
    role: "React.js Development Path Certificate",
    description: "Completed a structured learning path covering React fundamentals, component-driven development, and modern frontend practices.",
    category: "certification"
  }
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