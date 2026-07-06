export interface SocialLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
  email?: string;
  phone?: string;
}

export interface MemberProject {
  name: string;
  description: string;
  url?: string;
}

export interface MemberAchievement {
  title: string;
  year: string;
  org?: string;
}

export interface Member {
  id: string;
  name: string;
  year: 'SE' | 'TE' | 'BE';
  position: string;
  photo: string; // Base64 or URL
  skills: string[];
  socials: SocialLinks;
  bio: string;
  education: string[];
  skillsTech: string[];
  skillsSoft: string[];
  projects: MemberProject[];
  achievements: MemberAchievement[];
  certifications: string[];
  resumeUrl?: string; // or Base64
  resumeName?: string;
  email?: string;
  password?: string;
  photoBase64?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  team: string[];
  github: string;
  demo: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  award: string;
  category: 'hackathon' | 'competition' | 'paper' | 'certification';
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'Arduino' | 'ESP32' | 'Raspberry Pi' | 'Documentation' | 'Useful Links';
  link: string;
}

export interface Faculty {
  id: string;
  name: string;
  role: string;
  photo: string;
  email: string;
  linkedin?: string;
}

export interface Alumni {
  id: string;
  name: string;
  batch: string;
  company: string;
  position: string;
  linkedin: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  image: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  registrationLink?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: 'workshops' | 'competitions' | 'seminars' | 'guest lectures' | 'events';
}

export interface HomepageContent {
  logo: string;
  clubName: string;
  tagline: string;
  typingText: string[];
  aboutVision: string;
  aboutMission: string;
  aboutObjectives: string[];
  aboutIntro: string;
  address: string;
  email: string;
  phone: string;
  googleMapSrc: string;
}
