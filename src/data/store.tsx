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

  // MEMBER SIGN UP & LOGIN
  memberSignUp: (payload: any) => Promise<{status: 'success' | 'error'; message?: string; memberId?: string}>;
  memberLogin: (payload: any) => Promise<{status: 'success' | 'error'; message?: string; memberId?: string; name?: string}>;
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

      if (projectsData) {
        setProjects(projectsData);
      }
      if (achievementsData) {
        setAchievements(achievementsData);
      }
      if (eventsData) {
        setEvents(eventsData);
      }
    } catch (e) {
      console.warn("Failed to load Supabase records. Falling back to local storage.", e);
    }
  };

  // Load from LocalStorage or seed mock data
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

    setMembers(getOrSeed<Member[]>('iot_members', initialMembers));
    setProjects(getOrSeed<Project[]>('iot_projects', initialProjects));
    setAchievements(getOrSeed<Achievement[]>('iot_achievements', initialAchievements));
    setActivities(getOrSeed<Activity[]>('iot_activities', initialActivities));
    setResources(getOrSeed<Resource[]>('iot_resources', initialResources));
    setFaculty(getOrSeed<Faculty[]>('iot_faculty', initialFaculty));
    setAlumni(getOrSeed<Alumni[]>('iot_alumni', initialAlumni));
    setEvents(getOrSeed<Event[]>('iot_events', initialEvents));
    setGallery(getOrSeed<GalleryItem[]>('iot_gallery', initialGallery));
    setHomepageContent(getOrSeed<HomepageContent>('iot_homepage_content', initialHomepageContent));

    if (import.meta.env.VITE_SUPABASE_URL) {
      fetchData();
    }
  }, []);

  const save = <T,>(key: string, data: T, setter: React.Dispatch<React.SetStateAction<T>>) => {
    localStorage.setItem(key, JSON.stringify(data));
    setter(data);
  };

  // Live Cloud Synchronizer (Admin Catalog Updates)
  const syncAdminCrud = async (sheetName: string, operation: 'add' | 'edit' | 'delete', id: string | null, record: any) => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;
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
        const { error } = await supabase.from(dbTable).insert([mapRecordToDb(record)]);
        if (error) throw error;
      } else if (operation === 'edit') {
        const { error } = await supabase.from(dbTable).update(mapRecordToDb(record)).eq('id', id);
        if (error) throw error;
      } else if (operation === 'delete') {
        const { error } = await supabase.from(dbTable).delete().eq('id', id);
        if (error) throw error;
      }
      fetchData();
    } catch (e) {
      console.error("Supabase sync failure:", e);
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
    save('iot_members', members.map(x => x.id === m.id ? m : x), setMembers);
    syncAdminCrud('Members', 'edit', m.id, m);
  };
  const deleteMember = (id: string) => {
    save('iot_members', members.filter(x => x.id !== id), setMembers);
    syncAdminCrud('Members', 'delete', id, null);
  };

  // PROJECTS CRUD
  const addProject = (p: Omit<Project, 'id'>) => {
    const newId = 'p_' + Date.now();
    const newProj: Project = { ...p, id: newId };
    save('iot_projects', [...projects, newProj], setProjects);
    syncAdminCrud('Projects', 'add', null, newProj);
  };
  const updateProject = (p: Project) => {
    save('iot_projects', projects.map(x => x.id === p.id ? p : x), setProjects);
    syncAdminCrud('Projects', 'edit', p.id, p);
  };
  const deleteProject = (id: string) => {
    save('iot_projects', projects.filter(x => x.id !== id), setProjects);
    syncAdminCrud('Projects', 'delete', id, null);
  };

  // ACHIEVEMENTS CRUD
  const addAchievement = (a: Omit<Achievement, 'id'>) => {
    const newId = 'a_' + Date.now();
    const newAch: Achievement = { ...a, id: newId };
    save('iot_achievements', [...achievements, newAch], setAchievements);
    syncAdminCrud('Achievements', 'add', null, newAch);
  };
  const updateAchievement = (a: Achievement) => {
    save('iot_achievements', achievements.map(x => x.id === a.id ? a : x), setAchievements);
    syncAdminCrud('Achievements', 'edit', a.id, a);
  };
  const deleteAchievement = (id: string) => {
    save('iot_achievements', achievements.filter(x => x.id !== id), setAchievements);
    syncAdminCrud('Achievements', 'delete', id, null);
  };

  // ACTIVITIES CRUD
  const addActivity = (act: Omit<Activity, 'id'>) => {
    const newId = 'act_' + Date.now();
    const newAct: Activity = { ...act, id: newId };
    save('iot_activities', [...activities, newAct], setActivities);
  };
  const updateActivity = (act: Activity) => {
    save('iot_activities', activities.map(x => x.id === act.id ? act : x), setActivities);
  };
  const deleteActivity = (id: string) => {
    save('iot_activities', activities.filter(x => x.id !== id), setActivities);
  };

  // RESOURCES CRUD
  const addResource = (r: Omit<Resource, 'id'>) => {
    const newId = 'r_' + Date.now();
    const newRes: Resource = { ...r, id: newId };
    save('iot_resources', [...resources, newRes], setResources);
  };
  const updateResource = (r: Resource) => {
    save('iot_resources', resources.map(x => x.id === r.id ? r : x), setResources);
  };
  const deleteResource = (id: string) => {
    save('iot_resources', resources.filter(x => x.id !== id), setResources);
  };

  // FACULTY CRUD
  const addFaculty = (f: Omit<Faculty, 'id'>) => {
    const newId = 'f_' + Date.now();
    const newFac: Faculty = { ...f, id: newId };
    save('iot_faculty', [...faculty, newFac], setFaculty);
  };
  const updateFaculty = (f: Faculty) => {
    save('iot_faculty', faculty.map(x => x.id === f.id ? f : x), setFaculty);
  };
  const deleteFaculty = (id: string) => {
    save('iot_faculty', faculty.filter(x => x.id !== id), setFaculty);
  };

  // ALUMNI CRUD
  const addAlumni = (al: Omit<Alumni, 'id'>) => {
    const newId = 'al_' + Date.now();
    const newAl: Alumni = { ...al, id: newId };
    save('iot_alumni', [...alumni, newAl], setAlumni);
  };
  const updateAlumni = (al: Alumni) => {
    save('iot_alumni', alumni.map(x => x.id === al.id ? al : x), setAlumni);
  };
  const deleteAlumni = (id: string) => {
    save('iot_alumni', alumni.filter(x => x.id !== id), setAlumni);
  };

  // EVENTS CRUD
  const addEvent = (e: Omit<Event, 'id'>) => {
    const newId = 'e_' + Date.now();
    const newEv: Event = { ...e, id: newId };
    save('iot_events', [...events, newEv], setEvents);
    syncAdminCrud('Events', 'add', null, newEv);
  };
  const updateEvent = (e: Event) => {
    save('iot_events', events.map(x => x.id === e.id ? e : x), setEvents);
    syncAdminCrud('Events', 'edit', e.id, e);
  };
  const deleteEvent = (id: string) => {
    save('iot_events', events.filter(x => x.id !== id), setEvents);
    syncAdminCrud('Events', 'delete', id, null);
  };

  // GALLERY CRUD
  const addGalleryItem = (g: Omit<GalleryItem, 'id'>) => {
    const newId = 'g_' + Date.now();
    const newG: GalleryItem = { ...g, id: newId };
    save('iot_gallery', [...gallery, newG], setGallery);
  };
  const updateGalleryItem = (g: GalleryItem) => {
    save('iot_gallery', gallery.map(x => x.id === g.id ? g : x), setGallery);
  };
  const deleteGalleryItem = (id: string) => {
    save('iot_gallery', gallery.filter(x => x.id !== id), setGallery);
  };

  // HOMEPAGE
  const updateHomepageContent = (content: HomepageContent) => {
    save('iot_homepage_content', content, setHomepageContent);
  };

  // MEMBER REGISTRATION
  const memberSignUp = async (payload: any): Promise<{status: 'success' | 'error'; message?: string; memberId?: string}> => {
    if (import.meta.env.VITE_SUPABASE_URL) {
      try {
        const id = 'm_' + Date.now();
        
        const dbPayload = {
          id,
          name: payload.name,
          email: payload.email,
          password: payload.password,
          year: payload.year || 'SE',
          position: payload.position || 'Member',
          photo: payload.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
          bio: payload.bio || '',
          skills: ['Embedded Systems', 'IoT Routing'],
          skills_tech: ['IoT Protocols', 'Embedded Coding'],
          skills_soft: ['Collaboration'],
          education: ['University Student'],
          certifications: [],
          projects: [],
          achievements: [],
          socials: {
            linkedin: payload.linkedin || '',
            github: payload.github || '',
            email: payload.email
          }
        };

        const { error } = await supabase.from('members').insert([dbPayload]);
        if (error) {
          if (error.code === '23505') {
            return { status: 'error', message: 'Email address is already registered.' };
          }
          throw error;
        }

        fetchData();
        return { status: 'success', memberId: id };
      } catch (err: any) {
        return { status: 'error', message: err.message || 'Unable to connect to database server.' };
      }
    } else {
      // Local storage simulation
      const exists = members.some(x => x.email === payload.email);
      if (exists) return { status: 'error', message: 'Email address is already registered.' };
      
      const newId = 'm_' + Date.now();
      const newM: Member = {
        id: newId,
        email: payload.email,
        password: payload.password,
        name: payload.name,
        year: payload.year || 'SE',
        position: payload.position || 'Member',
        photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
        bio: payload.bio || '',
        skills: ['Embedded Systems', 'IoT Routing'],
        skillsTech: ['IoT Protocols', 'Embedded Coding'],
        skillsSoft: ['Collaboration'],
        education: ['University B.E. Student'],
        projects: [],
        achievements: [],
        certifications: [],
        socials: { linkedin: payload.linkedin || '', github: payload.github || '', email: payload.email }
      };

      save('iot_members', [...members, newM], setMembers);
      return { status: 'success', memberId: newId };
    }
  };

  // MEMBER AUTH LOGIN
  const memberLogin = async (payload: any): Promise<{status: 'success' | 'error'; message?: string; memberId?: string; name?: string}> => {
    if (import.meta.env.VITE_SUPABASE_URL) {
      try {
        const { data, error } = await supabase
          .from('members')
          .select('id, name, password')
          .eq('email', payload.email)
          .maybeSingle();

        if (error) throw error;
        if (!data || String(data.password) !== String(payload.password)) {
          return { status: 'error', message: 'Invalid credentials. Password or email is incorrect.' };
        }

        return { status: 'success', memberId: data.id, name: data.name };
      } catch (err: any) {
        return { status: 'error', message: err.message || 'Unable to connect to database server.' };
      }
    } else {
      // Local storage simulation
      const match = members.find(x => x.email === payload.email && String(x.password) === String(payload.password));
      if (match) {
        return { status: 'success', memberId: match.id, name: match.name };
      }
      return { status: 'error', message: 'Invalid credentials. Password or email is incorrect.' };
    }
  };

  // PROFILE FIELDS UPDATE
  const updateMemberProfile = async (payload: any): Promise<{status: 'success' | 'error'; message?: string}> => {
    if (import.meta.env.VITE_SUPABASE_URL) {
      try {
        const dbPayload: any = {};
        if (payload.name !== undefined) dbPayload.name = payload.name;
        if (payload.position !== undefined) dbPayload.position = payload.position;
        if (payload.year !== undefined) dbPayload.year = payload.year;
        if (payload.bio !== undefined) dbPayload.bio = payload.bio;
        if (payload.photo !== undefined) dbPayload.photo = payload.photo;
        if (payload.resumeUrl !== undefined) dbPayload.resume_url = payload.resumeUrl;
        if (payload.resumeName !== undefined) dbPayload.resume_name = payload.resumeName;
        if (payload.skills !== undefined) dbPayload.skills = payload.skills;
        if (payload.skillstech !== undefined) dbPayload.skills_tech = payload.skillstech;
        if (payload.skillssoft !== undefined) dbPayload.skills_soft = payload.skillssoft;
        if (payload.education !== undefined) dbPayload.education = payload.education;
        if (payload.projects !== undefined) dbPayload.projects = payload.projects;
        if (payload.achievements !== undefined) dbPayload.achievements = payload.achievements;
        if (payload.certifications !== undefined) dbPayload.certifications = payload.certifications;

        if (payload.socials || payload.linkedin !== undefined || payload.github !== undefined || payload.portfolio !== undefined || payload.phone !== undefined || payload.email !== undefined) {
          dbPayload.socials = {
            linkedin: payload.linkedin !== undefined ? payload.linkedin : payload.socials?.linkedin,
            github: payload.github !== undefined ? payload.github : payload.socials?.github,
            portfolio: payload.portfolio !== undefined ? payload.portfolio : payload.socials?.portfolio,
            email: payload.email !== undefined ? payload.email : payload.socials?.email,
            phone: payload.phone !== undefined ? payload.phone : payload.socials?.phone
          };
        }

        const { error } = await supabase
          .from('members')
          .update(dbPayload)
          .eq('id', payload.id);

        if (error) throw error;
        
        fetchData();
        return { status: 'success' };
      } catch (err: any) {
        return { status: 'error', message: err.message || 'Unable to connect to database server.' };
      }
    } else {
      // Local storage simulation
      const updated = members.map(m => {
        if (m.id === payload.id) {
          const item = { ...m, ...payload };
          item.socials = {
            linkedin: payload.linkedin !== undefined ? payload.linkedin : m.socials?.linkedin,
            github: payload.github !== undefined ? payload.github : m.socials?.github,
            portfolio: payload.portfolio !== undefined ? payload.portfolio : m.socials?.portfolio,
            email: payload.email !== undefined ? payload.email : m.socials?.email,
            phone: payload.phone !== undefined ? payload.phone : m.socials?.phone
          };
          return item;
        }
        return m;
      });
      save('iot_members', updated, setMembers);
      return { status: 'success' };
    }
  };

  return (
    <IoTStoreContext.Provider value={{
      members, projects, achievements, activities, resources, faculty, alumni, events, gallery, homepageContent,
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
      memberSignUp, memberLogin, updateMemberProfile
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
