export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  contact_email: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExperienceHighlight {
  text: string;
  video_url?: string | null;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  highlights: ExperienceHighlight[];
  display_order: number;
  created_at: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_date?: string | null;
  end_date?: string | null;
  grade: string | null;

  details: string[];
  display_order: number;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Programming' | 'Robotics Hardware' | 'Simulation / Robotics Libraries' | 'Mechanical CAD' | 'Mechanical CAE' | 'General / AI';
  display_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string | null;
  date_string: string | null;
  category: string | null;
  technologies: string[];
  thumbnail_url: string | null;
  github_url: string | null;
  external_url: string | null;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  
  // Relations loaded dynamically
  videos?: ProjectVideo[];
  presentations?: Presentation[];
}

export interface ProjectVideo {
  id: string;
  project_id: string;
  title: string | null;
  url: string;
  type: 'youtube' | 'external' | 'upload';
  display_order: number;
  created_at: string;
}

export interface Presentation {
  id: string;
  project_id: string;
  title: string;
  url: string;
  type: 'pdf' | 'google_drive' | 'external';
  display_order: number;
  created_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string | null;
  date_string: string | null;
  link_url: string | null;
  display_order: number;
  created_at: string;
}

export interface Publication {
  id: string;
  title: string;
  type: 'paper' | 'patent' | 'conference' | 'preprint';
  authors: string;
  publisher_journal: string | null;
  year: number;
  abstract: string | null;
  url: string | null;
  doi_patent_number: string | null;
  pdf_url: string | null;
  display_order: number;
  status: 'published' | 'pending' | 'draft';
  created_at: string;
}

