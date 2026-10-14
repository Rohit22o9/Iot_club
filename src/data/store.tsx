import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Member, Project, Achievement, Activity, Resource, Faculty, Alumni, Event, GalleryItem, HomepageContent } from '../types';
import {
  initialMembers,
  initialProjects,
  initialAchievements,
  initialActivities,
  initialResources,
  initialFaculty,
  initialAlumni,
  initialEvents,
  initialGallery,
  initialHomepageContent
} from './mockData';

import { supabase } from '../supabaseClient';
import { googleSheetsService } from '../services/googleSheetsService';
import { generateSecurePassword, sendStudentCredentialsEmail } from '../services/twilioEmailService';

interface IoTStoreContextType {
  members: Member[];
  projects: Project[];
  achievements: Achievement[];
  activities: Activity[];
  resources: Resource[];
  faculty: Faculty[];
  alumni: Alumni[];
  events: Event[];
  gallery: GalleryItem[];
  homepageContent: HomepageContent;
  
  // Google Sheets Integration
  googleSheetsUrl: string;
  isGoogleSheetsConfigured: boolean;
  setGoogleSheetsUrl: (url: string) => void;
  testGoogleSheetsConnection: (url?: string) => Promise<{ success: boolean; message: string }>;
  fetchFromGoogleSheets: () => Promise<void>;

  // CRUD - Members
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (member: Member) => void;
  deleteMember: (id: string) => void;

  // CRUD - Projects
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;

  // CRUD - Achievements
  addAchievement: (achievement: Omit<Achievement, 'id'>) => void;
  updateAchievement: (achievement: Achievement) => void;
  deleteAchievement: (id: string) => void;

  // CRUD - Activities
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  updateActivity: (activity: Activity) => void;
  deleteActivity: (id: string) => void;

  // CRUD - Resources
  addResource: (resource: Omit<Resource, 'id'>) => void;
  updateResource: (resource: Resource) => void;
  deleteResource: (id: string) => void;

  // CRUD - Faculty
  addFaculty: (faculty: Omit<Faculty, 'id'>) => void;
  updateFaculty: (faculty: Faculty) => void;
  deleteFaculty: (id: string) => void;

  // CRUD - Alumni
  addAlumni: (alumni: Omit<Alumni, 'id'>) => void;
  updateAlumni: (alumni: Alumni) => void;
  deleteAlumni: (id: string) => void;

  // CRUD - Events
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;

  // CRUD - Gallery
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  updateGalleryItem: (item: GalleryItem) => void;
  deleteGalleryItem: (id: string) => void;

  // Homepage Settings
  updateHomepageContent: (content: HomepageContent) => void;

  // MEMBER SIGN UP, LOGIN & ONBOARDING
  adminRegisterStudent: (payload: {
    name: string;
    email: string;
    year?: 'SE' | 'TE' | 'BE';
    department?: string;
    position?: string;
  }) => Promise<{
    status: 'success' | 'error';
    message?: string;
    memberId?: string;
    tempPassword?: string;
    emailResult?: any;
  }>;
  memberSignUp: (payload: any) => Promise<{status: 'success' | 'error'; message?: string; memberId?: string}>;
  memberLogin: (payload: any) => Promise<{
    status: 'success' | 'error';
    message?: string;
    memberId?: string;
    name?: string;
    isFirstLogin?: boolean;
    profileCompleted?: boolean;
  }>;
  updateMemberProfile: (payload: any) => Promise<{status: 'success' | 'error'; message?: string}>;
}

const IoTStoreContext = createContext<IoTStoreContextType | undefined>(undefined);

export const IoTStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [homepageContent, setHomepageContent] = useState<HomepageContent>(initialHomepageContent);
  const [googleSheetsUrl, setGoogleSheetsUrlState] = useState<string>(googleSheetsService.getAppsScriptUrl());

  const setGoogleSheetsUrl = (url: string) => {
    googleSheetsService.setAppsScriptUrl(url);
    setGoogleSheetsUrlState(url);
  };

  const testGoogleSheetsConnection = async (url?: string) => {
    return await googleSheetsService.testConnection(url);
  };

  // Fetch directory records from Google Sheets
  const fetchFromGoogleSheets = async () => {
    if (!googleSheetsService.isConfigured()) return;
    try {
      const data = await googleSheetsService.fetchDirectoryData();
      if (data && Array.isArray(data.members) && data.members.length > 0) {
        const mapped: Member[] = data.members.map((raw: any) => ({
          id: String(raw.id || 'm_' + Math.random()),
          name: String(raw.name || 'Member'),
          position: String(raw.position || 'Member'),
          year: (String(raw.year || 'SE').toUpperCase()) as 'SE' | 'TE' | 'BE',
          photo: raw.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
          bio: raw.bio || '',
          skills: Array.isArray(raw.skills) ? raw.skills : (typeof raw.skills === 'string' ? raw.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : []),
          skillsTech: Array.isArray(raw.skillsTech) ? raw.skillsTech : [],
          skillsSoft: Array.isArray(raw.skillsSoft) ? raw.skillsSoft : [],
          education: Array.isArray(raw.education) ? raw.education : [],
          projects: Array.isArray(raw.projects) ? raw.projects : [],
          achievements: Array.isArray(raw.achievements) ? raw.achievements : [],
          certifications: Array.isArray(raw.certifications) ? raw.certifications : [],
          resumeUrl: raw.resumeUrl || '',
          resumeName: raw.resumeName || '',
          email: raw.email || '',
          password: raw.password || '',
          socials: typeof raw.socials === 'object' && raw.socials !== null ? raw.socials : {
            github: raw.github || '',
            linkedin: raw.linkedin || '',
            portfolio: raw.portfolio || '',
            phone: raw.phone || ''
          }
        }));

        setMembers(prev => {
          // Merge Google Sheets members with any local members
          const existingIds = new Set(mapped.map(m => m.id));
          const localOnly = prev.filter(m => !existingIds.has(m.id));
          const merged = [...mapped, ...localOnly];
          localStorage.setItem('iot_members', JSON.stringify(merged));
          return merged;
        });
      }
    } catch (err) {
      console.warn("Could not sync from Google Sheets:", err);
    }
  };

  // Fetch data from Supabase if configured
  const fetchData = async () => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;
    try {
      const [
        { data: membersData, error: membersError },
        { data: projectsData, error: projectsError },
        { data: achievementsData, error: achievementsError },
        { data: eventsData, error: eventsError }
      ] = await Promise.all([
        supabase.from('members').select('*'),
        supabase.from('projects').select('*'),
        supabase.from('achievements').select('*'),
        supabase.from('events').select('*')
      ]);

      if (membersError) throw membersError;
      if (projectsError) throw projectsError;
      if (achievementsError) throw achievementsError;
      if (eventsError) throw eventsError;

      if (membersData) {
        const mappedMembers: Member[] = membersData.map((raw: any) => ({
          id: raw.id,
          name: raw.name,
          position: raw.position,
          year: raw.year,
          photo: raw.photo,
          bio: raw.bio,
          skills: raw.skills || [],
          skillsTech: raw.skills_tech || [],
          skillsSoft: raw.skills_soft || [],
          education: raw.education || [],
          projects: raw.projects || [],
          achievements: raw.achievements || [],
          certifications: raw.certifications || [],
          resumeUrl: raw.resume_url || '',
          resumeName: raw.resume_name || '',
          email: raw.email,
          password: raw.password,
          socials: raw.socials || {}
        }));
        setMembers(mappedMembers);
      }

      if (projectsData) setProjects(projectsData);
      if (achievementsData) setAchievements(achievementsData);
      if (eventsData) setEvents(eventsData);
    } catch (e) {
      console.warn("Supabase fetch fallback to local storage:", e);
    }
  };

  // Seed or Load from LocalStorage on mount
  useEffect(() => {
    const getOrSeed = <T,>(key: string, initialData: T): T => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          return JSON.parse(data) as T;
        } catch {
          return initialData;
        }
      } else {
        localStorage.setItem(key, JSON.stringify(initialData));
        return initialData;
      }
    };

    // 1. Members: merge initial members with their updated names & real photos while preserving custom registered students
    let loadedMembers = getOrSeed<Member[]>('iot_members', initialMembers);
    loadedMembers = loadedMembers.map(m => {
      const seed = initialMembers.find(s => s.id === m.id);
      if (seed) {
        return {
          ...m,
          name: seed.name || m.name,
          photo: (seed.photo && seed.photo.startsWith('/photoes/')) ? seed.photo : (seed.photo || m.photo)
        };
      }
      return m;
    });
    localStorage.setItem('iot_members', JSON.stringify(loadedMembers));
    setMembers(loadedMembers);

    // 2. Projects: sync photoes
    let loadedProjects = getOrSeed<Project[]>('iot_projects', initialProjects);
    loadedProjects = loadedProjects.map(p => {
      const seed = initialProjects.find(s => s.id === p.id);
      if (seed && seed.image && seed.image.startsWith('/photoes/')) {
        return { ...p, image: seed.image };
      }
      return p;
    });
    localStorage.setItem('iot_projects', JSON.stringify(loadedProjects));
    setProjects(loadedProjects);

    // 3. Achievements: sync photoes
    let loadedAchievements = getOrSeed<Achievement[]>('iot_achievements', initialAchievements);
    loadedAchievements = loadedAchievements.map(a => {
      const seed = initialAchievements.find(s => s.id === a.id);
      if (seed && seed.image) {
        return { ...a, image: seed.image };
      }
      return a;
    });
    localStorage.setItem('iot_achievements', JSON.stringify(loadedAchievements));
    setAchievements(loadedAchievements);

    // 4. Activities: sync photoes
    let loadedActivities = getOrSeed<Activity[]>('iot_activities', initialActivities);
    loadedActivities = loadedActivities.map(act => {
      const seed = initialActivities.find(s => s.id === act.id);
      if (seed && seed.image && seed.image.startsWith('/photoes/')) {
        return { ...act, image: seed.image };
      }
      return act;
    });
    localStorage.setItem('iot_activities', JSON.stringify(loadedActivities));
    setActivities(loadedActivities);

    // 5. Events: sync photoes
    let loadedEvents = getOrSeed<Event[]>('iot_events', initialEvents);
    loadedEvents = loadedEvents.map(e => {
      const seed = initialEvents.find(s => s.id === e.id);
      if (seed && seed.image && seed.image.startsWith('/photoes/')) {
        return { ...e, image: seed.image };
      }
      return e;
    });
    localStorage.setItem('iot_events', JSON.stringify(loadedEvents));
    setEvents(loadedEvents);

    // 6. Gallery: sync all 8 items with real photos
    let loadedGallery = getOrSeed<GalleryItem[]>('iot_gallery', initialGallery);
    const hasUnsplash = loadedGallery.some(g => g.image && g.image.includes('unsplash.com'));
    if (hasUnsplash || loadedGallery.length < initialGallery.length) {
      loadedGallery = initialGallery;
      localStorage.setItem('iot_gallery', JSON.stringify(loadedGallery));
    }
    setGallery(loadedGallery);

    setResources(getOrSeed<Resource[]>('iot_resources', initialResources));

    // 7. Faculty: sync latest faculty details (Dr. Dattatray Waghole, Prof. Smita Wagh)
    let loadedFaculty = getOrSeed<Faculty[]>('iot_faculty', initialFaculty);
    loadedFaculty = loadedFaculty.map(f => {
      const seed = initialFaculty.find(s => s.id === f.id);
      if (seed) {
        return { ...f, name: seed.name, role: seed.role, email: seed.email, photo: seed.photo, linkedin: seed.linkedin || f.linkedin };
      }
      return f;
    });
    if (loadedFaculty.some(f => f.name.includes('Deshpande') || f.name.includes('Vineeta') || f.name.includes('Dattray') || f.name.includes('waghole') || f.name.includes('smita') || (f.photo && f.photo.includes('unsplash.com')))) {
      loadedFaculty = initialFaculty;
    }
    localStorage.setItem('iot_faculty', JSON.stringify(loadedFaculty));
    setFaculty(loadedFaculty);

    setAlumni(getOrSeed<Alumni[]>('iot_alumni', initialAlumni));
    setHomepageContent(getOrSeed<HomepageContent>('iot_homepage_content', initialHomepageContent));

    if (googleSheetsService.isConfigured()) {
      fetchFromGoogleSheets();
    } else if (import.meta.env.VITE_SUPABASE_URL) {
      fetchData();
    }
  }, []);

  const save = <T,>(key: string, data: T, setter: React.Dispatch<React.SetStateAction<T>>) => {
    localStorage.setItem(key, JSON.stringify(data));
    setter(data);
  };

  // Live Cloud Synchronizer (Admin Catalog Updates)
  const syncAdminCrud = async (sheetName: string, operation: 'add' | 'edit' | 'delete', id: string | null, record: any) => {
    if (import.meta.env.VITE_SUPABASE_URL) {
      try {
        const dbTable = sheetName.toLowerCase();
        
        const mapRecordToDb = (rec: any) => {
          const mapped = { ...rec };
          if (mapped.skillsTech !== undefined) {
            mapped.skills_tech = mapped.skillsTech;
            delete mapped.skillsTech;
          }
          if (mapped.skillsSoft !== undefined) {
            mapped.skills_soft = mapped.skillsSoft;
            delete mapped.skillsSoft;
          }
          if (mapped.resumeUrl !== undefined) {
            mapped.resume_url = mapped.resumeUrl;
            delete mapped.resumeUrl;
          }
          if (mapped.resumeName !== undefined) {
            mapped.resume_name = mapped.resumeName;
            delete mapped.resumeName;
          }
          return mapped;
        };

        if (operation === 'add') {
          await supabase.from(dbTable).insert([mapRecordToDb(record)]);
        } else if (operation === 'edit') {
          await supabase.from(dbTable).update(mapRecordToDb(record)).eq('id', id);
        } else if (operation === 'delete') {
          await supabase.from(dbTable).delete().eq('id', id);
        }
      } catch (e) {
        console.error("Supabase sync failure:", e);
      }
    }
  };

  // MEMBERS CRUD
  const addMember = (m: Omit<Member, 'id'>) => {
    const newId = 'm_' + Date.now();
    const newMember: Member = { ...m, id: newId };
    save('iot_members', [...members, newMember], setMembers);
    syncAdminCrud('Members', 'add', null, newMember);
  };

  const updateMember = (m: Member) => {
    const updated = members.map(x => (x.id === m.id ? m : x));
    save('iot_members', updated, setMembers);
    syncAdminCrud('Members', 'edit', m.id, m);
  };

  const deleteMember = (id: string) => {
    const updated = members.filter(x => x.id !== id);
    save('iot_members', updated, setMembers);
    syncAdminCrud('Members', 'delete', id, null);
  };

  // PROJECTS CRUD
  const addProject = (p: Omit<Project, 'id'>) => {
    const newProj: Project = { ...p, id: 'p_' + Date.now() };
    save('iot_projects', [...projects, newProj], setProjects);
    syncAdminCrud('Projects', 'add', null, newProj);
  };

  const updateProject = (p: Project) => {
    const updated = projects.map(x => (x.id === p.id ? p : x));
    save('iot_projects', updated, setProjects);
    syncAdminCrud('Projects', 'edit', p.id, p);
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter(x => x.id !== id);
    save('iot_projects', updated, setProjects);
    syncAdminCrud('Projects', 'delete', id, null);
  };

  // ACHIEVEMENTS CRUD
  const addAchievement = (a: Omit<Achievement, 'id'>) => {
    const newAch: Achievement = { ...a, id: 'ach_' + Date.now() };
    save('iot_achievements', [...achievements, newAch], setAchievements);
    syncAdminCrud('Achievements', 'add', null, newAch);
  };

  const updateAchievement = (a: Achievement) => {
    const updated = achievements.map(x => (x.id === a.id ? a : x));
    save('iot_achievements', updated, setAchievements);
    syncAdminCrud('Achievements', 'edit', a.id, a);
  };

  const deleteAchievement = (id: string) => {
    const updated = achievements.filter(x => x.id !== id);
    save('iot_achievements', updated, setAchievements);
    syncAdminCrud('Achievements', 'delete', id, null);
  };

  // ACTIVITIES CRUD
  const addActivity = (act: Omit<Activity, 'id'>) => {
    const newAct: Activity = { ...act, id: 'act_' + Date.now() };
    save('iot_activities', [...activities, newAct], setActivities);
  };

  const updateActivity = (act: Activity) => {
    const updated = activities.map(x => (x.id === act.id ? act : x));
    save('iot_activities', updated, setActivities);
  };

  const deleteActivity = (id: string) => {
    const updated = activities.filter(x => x.id !== id);
    save('iot_activities', updated, setActivities);
  };

  // RESOURCES CRUD
  const addResource = (r: Omit<Resource, 'id'>) => {
    const newRes: Resource = { ...r, id: 'res_' + Date.now() };
    save('iot_resources', [...resources, newRes], setResources);
  };

  const updateResource = (r: Resource) => {
    const updated = resources.map(x => (x.id === r.id ? r : x));
    save('iot_resources', updated, setResources);
  };

  const deleteResource = (id: string) => {
    const updated = resources.filter(x => x.id !== id);
    save('iot_resources', updated, setResources);
  };

  // FACULTY CRUD
  const addFaculty = (f: Omit<Faculty, 'id'>) => {
    const newFac: Faculty = { ...f, id: 'f_' + Date.now() };
    save('iot_faculty', [...faculty, newFac], setFaculty);
  };

  const updateFaculty = (f: Faculty) => {
    const updated = faculty.map(x => (x.id === f.id ? f : x));
    save('iot_faculty', updated, setFaculty);
  };

  const deleteFaculty = (id: string) => {
    const updated = faculty.filter(x => x.id !== id);
    save('iot_faculty', updated, setFaculty);
  };

  // ALUMNI CRUD
  const addAlumni = (al: Omit<Alumni, 'id'>) => {
    const newAl: Alumni = { ...al, id: 'al_' + Date.now() };
    save('iot_alumni', [...alumni, newAl], setAlumni);
  };

  const updateAlumni = (al: Alumni) => {
    const updated = alumni.map(x => (x.id === al.id ? al : x));
    save('iot_alumni', updated, setAlumni);
  };

  const deleteAlumni = (id: string) => {
    const updated = alumni.filter(x => x.id !== id);
    save('iot_alumni', updated, setAlumni);
  };

  // EVENTS CRUD
  const addEvent = (ev: Omit<Event, 'id'>) => {
    const newEv: Event = { ...ev, id: 'ev_' + Date.now() };
    save('iot_events', [...events, newEv], setEvents);
    syncAdminCrud('Events', 'add', null, newEv);
  };

  const updateEvent = (ev: Event) => {
    const updated = events.map(x => (x.id === ev.id ? ev : x));
    save('iot_events', updated, setEvents);
    syncAdminCrud('Events', 'edit', ev.id, ev);
  };

  const deleteEvent = (id: string) => {
    const updated = events.filter(x => x.id !== id);
    save('iot_events', updated, setEvents);
    syncAdminCrud('Events', 'delete', id, null);
  };

  // GALLERY CRUD
  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = { ...item, id: 'gal_' + Date.now() };
    save('iot_gallery', [...gallery, newItem], setGallery);
  };

  const updateGalleryItem = (item: GalleryItem) => {
    const updated = gallery.map(x => (x.id === item.id ? item : x));
    save('iot_gallery', updated, setGallery);
  };

  const deleteGalleryItem = (id: string) => {
    const updated = gallery.filter(x => x.id !== id);
    save('iot_gallery', updated, setGallery);
  };

  // HOMEPAGE CONTENT
  const updateHomepageContent = (content: HomepageContent) => {
    save('iot_homepage_content', content, setHomepageContent);
  };

  // ADMIN REGISTER STUDENT (Twilio Email + Auto Password + Google Sheets + Local)
  const adminRegisterStudent = async (payload: {
    name: string;
    email: string;
    year?: 'SE' | 'TE' | 'BE';
    department?: string;
    position?: string;
  }): Promise<{
    status: 'success' | 'error';
    message?: string;
    memberId?: string;
    tempPassword?: string;
    emailResult?: any;
  }> => {
    const inputEmail = String(payload.email || '').toLowerCase().trim();
    if (!inputEmail) {
      return { status: 'error', message: 'Student email address is required.' };
    }

    // Check if email already registered locally
    const existing = members.find(m => String(m.email).toLowerCase().trim() === inputEmail);
    if (existing) {
      return { status: 'error', message: `Student with email "${payload.email}" is already registered in the directory.` };
    }

    // 1. Generate secure random password
    const tempPassword = generateSecurePassword(10);
    const newId = 'm_' + Date.now();
    const chosenYear = (payload.year || 'SE').toUpperCase() as 'SE' | 'TE' | 'BE';
    const dept = payload.department || 'Engineering';

    const newMember: Member = {
      id: newId,
      name: payload.name.trim() || 'Student Member',
      email: inputEmail,
      password: tempPassword,
      tempPassword,
      year: chosenYear,
      department: dept,
      position: payload.position || 'Student Developer',
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
      bio: `${dept} student at IoT Club. Account provisioned via Admin Console.`,
      skills: ['Embedded Systems', 'IoT Prototyping'],
      skillsTech: ['Embedded Systems', 'IoT Prototyping'],
      skillsSoft: ['Problem Solving', 'Teamwork'],
      education: ['Undergraduate Student'],
      projects: [],
      achievements: [],
      certifications: [],
      socials: { email: inputEmail },
      isFirstLogin: true,
      profileCompleted: false,
      registeredByAdmin: true
    };

    // 2. Persist locally right away
    save('iot_members', [...members, newMember], setMembers);

    // 3. Dispatch Twilio SendGrid email notification
    let emailResult: any = null;
    try {
      emailResult = await sendStudentCredentialsEmail({
        name: newMember.name,
        email: inputEmail,
        tempPassword,
        department: dept,
        year: chosenYear
      });
    } catch (mailErr) {
      console.warn('Twilio email dispatch error:', mailErr);
      emailResult = { success: false, method: 'error', message: String(mailErr) };
    }

    // 4. Sync to Google Sheets if configured
    if (googleSheetsService.isConfigured()) {
      try {
        await googleSheetsService.adminRegisterStudent({
          name: newMember.name,
          email: inputEmail,
          password: tempPassword,
          year: chosenYear,
          department: dept
        });
      } catch (err: any) {
        console.warn('Google Sheets sync note:', err.message);
      }
    }

    // 5. Sync to Supabase if configured
    if (import.meta.env.VITE_SUPABASE_URL) {
      try {
        await supabase.from('members').insert([{
          id: newId,
          name: newMember.name,
          email: inputEmail,
          password: tempPassword,
          year: chosenYear,
          position: newMember.position,
          photo: newMember.photo,
          bio: newMember.bio,
          skills: newMember.skills,
          skills_tech: newMember.skillsTech,
          skills_soft: newMember.skillsSoft,
          education: newMember.education,
          certifications: [],
          projects: [],
          achievements: [],
          socials: newMember.socials
        }]);
      } catch (err: any) {
        console.warn('Supabase sync note:', err.message);
      }
    }

    return {
      status: 'success',
      memberId: newId,
      tempPassword,
      emailResult
    };
  };

  // MEMBER REGISTRATION (Google Sheets + Supabase + LocalStorage)
  const memberSignUp = async (payload: any): Promise<{status: 'success' | 'error'; message?: string; memberId?: string}> => {
    // 1. Check if email already registered locally
    const exists = members.some(x => String(x.email).toLowerCase().trim() === String(payload.email).toLowerCase().trim());
    if (exists) {
      return { status: 'error', message: 'Email address is already registered in student directory.' };
    }

    const newId = 'm_' + Date.now();

    // Parse skills cleanly (handling array or comma-separated string)
    let parsedSkills: string[] = [];
    if (Array.isArray(payload.skills)) {
      parsedSkills = payload.skills;
    } else if (typeof payload.skills === 'string') {
      parsedSkills = payload.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
    } else if (Array.isArray(payload.skillsTech)) {
      parsedSkills = payload.skillsTech;
    }

    if (parsedSkills.length === 0) {
      parsedSkills = ['Embedded Systems', 'Hardware Prototyping'];
    }

    const newMember: Member = {
      id: newId,
      name: payload.name || 'Member',
      email: payload.email,
      password: payload.password,
      year: (payload.year || 'SE').toUpperCase() as 'SE' | 'TE' | 'BE',
      position: payload.position || 'Student Developer',
      photo: payload.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
      bio: payload.bio || '',
      skills: parsedSkills,
      skillsTech: parsedSkills,
      skillsSoft: payload.skillsSoft || ['Collaboration', 'Problem Solving'],
      education: payload.education || ['University Engineering Student'],
      projects: [],
      achievements: [],
      certifications: [],
      socials: {
        linkedin: payload.linkedin || payload.socials?.linkedin || '',
        github: payload.github || payload.socials?.github || '',
        portfolio: payload.portfolio || payload.socials?.portfolio || '',
        phone: payload.phone || payload.socials?.phone || '',
        email: payload.email
      }
    };

    // 2. Persist locally right away so user card appears immediately
    save('iot_members', [...members, newMember], setMembers);

    // 3. Sync to Google Sheets if configured
    if (googleSheetsService.isConfigured()) {
      try {
        await googleSheetsService.signUpStudent({
          ...payload,
          id: newId,
          skills: parsedSkills,
          skillsTech: parsedSkills
        });
      } catch (err: any) {
        console.warn("Google Sheets sync note:", err.message);
      }
    }

    // 4. Sync to Supabase if configured
    if (import.meta.env.VITE_SUPABASE_URL) {
      try {
        await supabase.from('members').insert([{
          id: newId,
          name: newMember.name,
          email: newMember.email,
          password: newMember.password,
          year: newMember.year,
          position: newMember.position,
          photo: newMember.photo,
          bio: newMember.bio,
          skills: newMember.skills,
          skills_tech: newMember.skillsTech,
          skills_soft: newMember.skillsSoft,
          education: newMember.education,
          certifications: [],
          projects: [],
          achievements: [],
          socials: newMember.socials
        }]);
      } catch (err: any) {
        console.warn("Supabase sync note:", err.message);
      }
    }

    return { status: 'success', memberId: newId };
  };

  // MEMBER AUTH LOGIN (Google Sheets + Local + Supabase)
  // MEMBER AUTH LOGIN (Google Sheets + Local + Supabase)
  const memberLogin = async (payload: any): Promise<{
    status: 'success' | 'error';
    message?: string;
    memberId?: string;
    name?: string;
    isFirstLogin?: boolean;
    profileCompleted?: boolean;
  }> => {
    const inputEmail = String(payload.email || '').toLowerCase().trim();
    const inputPass = String(payload.password || '');

    // 1. Try Google Sheets if connected
    if (googleSheetsService.isConfigured()) {
      try {
        const gsRes = await googleSheetsService.loginStudent({
          email: inputEmail,
          password: inputPass
        });
        if (gsRes && gsRes.status === 'success' && gsRes.memberId) {
          return { 
            status: 'success', 
            memberId: gsRes.memberId, 
            name: gsRes.name,
            isFirstLogin: gsRes.isFirstLogin ?? false,
            profileCompleted: gsRes.profileCompleted ?? true
          };
        }
      } catch (err) {
        console.warn("Google Sheets login check failed, falling back to local credentials:", err);
      }
    }

    // 2. Try Supabase
    if (import.meta.env.VITE_SUPABASE_URL) {
      try {
        const { data } = await supabase
          .from('members')
          .select('id, name, password, is_first_login, profile_completed')
          .eq('email', inputEmail)
          .maybeSingle();

        if (data && String(data.password) === inputPass) {
          const isFirst = Boolean((data as any).is_first_login);
          return { 
            status: 'success', 
            memberId: data.id, 
            name: data.name,
            isFirstLogin: isFirst,
            profileCompleted: !isFirst
          };
        }
      } catch (err) {
        console.warn("Supabase login check failed:", err);
      }
    }

    // 3. Check Local State
    const match = members.find(
      x => String(x.email).toLowerCase().trim() === inputEmail && String(x.password) === inputPass
    );
    if (match) {
      const isFirst = match.isFirstLogin === true || match.profileCompleted === false;
      return { 
        status: 'success', 
        memberId: match.id, 
        name: match.name,
        isFirstLogin: isFirst,
        profileCompleted: match.profileCompleted ?? !isFirst
      };
    }

    return { status: 'error', message: 'Invalid credentials. Password or email is incorrect.' };
  };

  // PROFILE FIELDS UPDATE (Google Sheets + Local + Supabase)
  const updateMemberProfile = async (payload: any): Promise<{status: 'success' | 'error'; message?: string}> => {
    // 1. Update local state immediately
    const updatedMembers = members.map(m => {
      if (m.id === payload.id) {
        const parsedSkills = Array.isArray(payload.skills)
          ? payload.skills
          : (typeof payload.skills === 'string' ? payload.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : (payload.skillsTech || m.skills));

        const item: Member = {
          ...m,
          name: payload.name !== undefined ? payload.name : m.name,
          position: payload.position !== undefined ? payload.position : m.position,
          year: (payload.year || m.year).toUpperCase() as 'SE' | 'TE' | 'BE',
          department: payload.department !== undefined ? payload.department : m.department,
          bio: payload.bio !== undefined ? payload.bio : m.bio,
          photo: payload.photo !== undefined ? payload.photo : m.photo,
          password: payload.newPassword || payload.password || m.password,
          isFirstLogin: false,
          profileCompleted: true,
          skills: parsedSkills,
          skillsTech: payload.skillsTech !== undefined ? payload.skillsTech : parsedSkills,
          skillsSoft: payload.skillsSoft !== undefined ? payload.skillsSoft : m.skillsSoft,
          education: payload.education !== undefined ? payload.education : m.education,
          projects: payload.projects !== undefined ? payload.projects : m.projects,
          achievements: payload.achievements !== undefined ? payload.achievements : m.achievements,
          certifications: payload.certifications !== undefined ? payload.certifications : m.certifications,
          resumeUrl: payload.resumeUrl !== undefined ? payload.resumeUrl : m.resumeUrl,
          resumeName: payload.resumeName !== undefined ? payload.resumeName : m.resumeName,
          socials: {
            linkedin: payload.linkedin !== undefined ? payload.linkedin : (payload.socials?.linkedin ?? m.socials?.linkedin),
            github: payload.github !== undefined ? payload.github : (payload.socials?.github ?? m.socials?.github),
            portfolio: payload.portfolio !== undefined ? payload.portfolio : (payload.socials?.portfolio ?? m.socials?.portfolio),
            phone: payload.phone !== undefined ? payload.phone : (payload.socials?.phone ?? m.socials?.phone),
            email: payload.email !== undefined ? payload.email : (payload.socials?.email ?? m.socials?.email)
          }
        };
        return item;
      }
      return m;
    });

    save('iot_members', updatedMembers, setMembers);

    // 2. Sync to Google Sheets
    if (googleSheetsService.isConfigured()) {
      try {
        await googleSheetsService.updateStudentProfile(payload);
      } catch (err: any) {
        console.warn("Google Sheets update note:", err.message);
      }
    }

    // 3. Sync to Supabase
    if (import.meta.env.VITE_SUPABASE_URL) {
      try {
        const dbPayload: any = {};
        if (payload.name !== undefined) dbPayload.name = payload.name;
        if (payload.position !== undefined) dbPayload.position = payload.position;
        if (payload.year !== undefined) dbPayload.year = payload.year;
        if (payload.bio !== undefined) dbPayload.bio = payload.bio;
        if (payload.photo !== undefined) dbPayload.photo = payload.photo;
        if (payload.skills !== undefined) dbPayload.skills = payload.skills;
        if (payload.skillsTech !== undefined) dbPayload.skills_tech = payload.skillsTech;
        if (payload.skillsSoft !== undefined) dbPayload.skills_soft = payload.skillsSoft;
        if (payload.education !== undefined) dbPayload.education = payload.education;
        if (payload.projects !== undefined) dbPayload.projects = payload.projects;
        if (payload.achievements !== undefined) dbPayload.achievements = payload.achievements;
        if (payload.certifications !== undefined) dbPayload.certifications = payload.certifications;

        if (payload.socials || payload.linkedin || payload.github || payload.portfolio || payload.phone) {
          dbPayload.socials = {
            linkedin: payload.linkedin || payload.socials?.linkedin,
            github: payload.github || payload.socials?.github,
            portfolio: payload.portfolio || payload.socials?.portfolio,
            phone: payload.phone || payload.socials?.phone,
            email: payload.email || payload.socials?.email
          };
        }

        await supabase.from('members').update(dbPayload).eq('id', payload.id);
      } catch (err: any) {
        console.warn("Supabase update error:", err);
      }
    }

    return { status: 'success' };
  };

  return (
    <IoTStoreContext.Provider value={{
      members, projects, achievements, activities, resources, faculty, alumni, events, gallery, homepageContent,
      googleSheetsUrl,
      isGoogleSheetsConfigured: Boolean(googleSheetsUrl),
      setGoogleSheetsUrl,
      testGoogleSheetsConnection,
      fetchFromGoogleSheets,
      addMember, updateMember, deleteMember,
      addProject, updateProject, deleteProject,
      addAchievement, updateAchievement, deleteAchievement,
      addActivity, updateActivity, deleteActivity,
      addResource, updateResource, deleteResource,
      addFaculty, updateFaculty, deleteFaculty,
      addAlumni, updateAlumni, deleteAlumni,
      addEvent, updateEvent, deleteEvent,
      addGalleryItem, updateGalleryItem, deleteGalleryItem,
      updateHomepageContent,
      adminRegisterStudent, memberSignUp, memberLogin, updateMemberProfile
    }}>
      {children}
    </IoTStoreContext.Provider>
  );
};

export const useIoTStore = () => {
  const context = useContext(IoTStoreContext);
  if (context === undefined) {
    throw new Error('useIoTStore must be used within an IoTStoreProvider');
  }
  return context;
};
