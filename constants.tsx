import { ProfileData, ExperienceItem, ProjectItem, EducationItem, LeadershipItem } from './types';
import { Github, Linkedin, Mail, ExternalLink, Twitter, Youtube, Instagram } from 'lucide-react';
import React from 'react';

const XIcon = ({ size = 24, className, ...props }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const MediumIcon = ({ size = 24, className, ...props }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
  </svg>
);

export const PROFILE: ProfileData = {
  name: "Pranav Gawai",
  title: "Full Stack Engineer",
  location: "Pune, MH",
  bio: "Third-year Computer Science student passionate about building scalable web applications and solving real-world problems through technology. Experienced in full-stack development with React, TypeScript, and Node.js, with hands-on expertise in API design and database optimization. Won 1st place at Cybersecurity Hackathon 2025 and secured Top 10 position among 800+ teams at Smart India Hackathon 2025.",
  socials: [
    { name: "X", url: "https://twitter.com/pranavgawai", icon: "x" },
    { name: "LinkedIn", url: "https://linkedin.com/in/pranavgawai", icon: "linkedin" },
    { name: "GitHub", url: "https://github.com/pranavgawaii", icon: "github" },
    { name: "Medium", url: "https://medium.com/@pranavgawai", icon: "medium" },
    { name: "Instagram", url: "https://instagram.com/pranavgawai", icon: "instagram" },
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
    degree: "Bachelor of Technology in Computer Science and Engineering (AI)",
    period: "Aug 2023 – Jun 2027",
    location: "Pune, Maharashtra"
  },
  {
    id: "edu-2",
    institution: "Maharashtra State Board",
    degree: "Higher Secondary (12th): 85.33%",
    period: "",
    location: "Jalna, Maharashtra",
    details: ["Secondary School (10th): 84.80%"]
  }
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: "exp-1",
    role: "Software Development Intern",
    company: "Yes Boss Technology Pvt. Ltd.",
    period: "Jun 2025 – Sep 2025",
    type: "Internship",
    location: "Pune, MH",
    description: [
      "Engineered REST APIs using Django and PostgreSQL with GPT-4 and DALL-E integrations.",
      "Built analytics dashboard with logs, tracking, and CSV export; optimized API latency by 30%.",
      "Worked in Agile sprints and contributed to GitHub reviews and workflow maintenance."
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
    github: "https://github.com/pranavgawaii",
    status: "Winner"
  },
  {
    id: "proj-2",
    title: "Sahara",
    description: "Built accessible WCAG 2.1-compliant platform with Google OAuth and real-time messaging. Integrated multilingual Gemini AI chatbot with voice features serving 200+ active users.",
    techStack: ["React", "TypeScript", "Node.js", "Gemini API"],
    github: "https://github.com/pranavgawaii",
    status: "Top 10"
  },
  {
    id: "proj-3",
    title: "Post Genius",
    description: "Automated Facebook/Twitter post scheduling via Graph APIs. Engineered analytics dashboard and improved performance by 40% through query optimization.",
    techStack: ["Django", "React", "PostgreSQL", "Graph APIs"],
    github: "https://github.com/pranavgawaii",
  }
];

export const LEADERSHIP: LeadershipItem[] = [
  {
    id: "lead-1",
    title: "1st Place Winner",
    role: "24-Hour Cybersecurity Hackathon 2025 (MedSecure24)",
    description: ""
  },
  {
    id: "lead-2",
    title: "Placement Coordinator - Core Team",
    role: "MIT-ADT University",
    description: "Coordinated campus recruitment with 50+ companies and organized training workshops for 1200+ students."
  },
  {
    id: "lead-3",
    title: "Top 10 Finalist",
    role: "Smart India Hackathon 2025 among 800+ teams (Sahara)",
    description: ""
  },
  {
    id: "lead-4",
    title: "GitHub Foundations Certification",
    role: "Score: 83/100",
    description: ""
  },
  {
    id: "lead-5",
    title: "NPTEL Certification",
    role: "Design and Analysis of Algorithms",
    description: ""
  },
  {
    id: "lead-6",
    title: "LinkedIn Learning",
    role: "React.js Development Path Certificate",
    description: ""
  }
];

export const ICONS_MAP: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  external: ExternalLink,
  twitter: Twitter,
  x: XIcon,
  medium: MediumIcon,
  instagram: Instagram
};