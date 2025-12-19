export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
  techStack?: string[];
  type: 'Current' | 'Past' | 'Internship';
  location?: string;
  logo?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  period: string;
  location: string;
  details?: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  link?: string;
  github?: string;
  status?: string;
  image?: string;
}

export interface LeadershipItem {
  id: string;
  title: string;
  role?: string;
  description?: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface ProfileData {
  name: string;
  title: string;
  location: string;
  bio: string;
  socials: SocialLink[];
  skills: SkillCategory[];
}