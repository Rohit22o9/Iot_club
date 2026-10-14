import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Briefcase, Trophy, Calendar, Image, BookOpen, 
  Settings, LogOut, Plus, Edit, Trash2, ShieldAlert,
  GraduationCap, Upload, FileText, ArrowLeft,
  Mail, Copy, Check, Send, Key, Sparkles, AlertCircle, CheckCircle2, RefreshCw
} from 'lucide-react';
import { useIoTStore } from '../data/store';
import { getTwilioConfig, saveTwilioConfig } from '../services/twilioEmailService';
import type { Member, Project, Achievement, Activity, Resource, Faculty, Alumni, Event, GalleryItem, HomepageContent } from '../types';

type TabType = 'members' | 'projects' | 'achievements' | 'activities' | 'gallery' | 'resources' | 'faculty' | 'alumni' | 'events' | 'settings';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const store = useIoTStore();
  const [activeTab, setActiveTab] = useState<TabType>('members');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Authentication check
  useEffect(() => {
    const isLogged = sessionStorage.getItem('iot_admin_auth') === 'true';
    if (!isLogged) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('iot_admin_auth');
    navigate('/');
  };

  // Quick Student Registration State (Requirement 1 & 2)
  const [quickStudent, setQuickStudent] = useState({
    name: '',
    email: '',
    year: 'SE' as 'SE' | 'TE' | 'BE',
    department: 'Electronics & Telecommunication'
  });
  const [registeringStudent, setRegisteringStudent] = useState(false);
  const [quickRegisterError, setQuickRegisterError] = useState('');
  const [registeredResult, setRegisteredResult] = useState<{
    name: string;
    email: string;
    tempPassword: string;
    emailResult?: any;
    memberId?: string;
  } | null>(null);
  const [copiedCredentials, setCopiedCredentials] = useState(false);

  // Twilio SendGrid settings modal
  const [showTwilioModal, setShowTwilioModal] = useState(false);
  const [twilioSettings, setTwilioSettings] = useState(getTwilioConfig());
  const [twilioSavedSuccess, setTwilioSavedSuccess] = useState(false);

  const handleQuickStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuickRegisterError('');
    if (!quickStudent.name.trim() || !quickStudent.email.trim()) {
      setQuickRegisterError('Please enter both student name and email address.');
      return;
    }

    setRegisteringStudent(true);
    try {
      const res = await store.adminRegisterStudent({
        name: quickStudent.name.trim(),
        email: quickStudent.email.trim(),
        year: quickStudent.year,
        department: quickStudent.department
      });

      if (res.status === 'success' && res.tempPassword) {
        setRegisteredResult({
          name: quickStudent.name.trim(),
          email: quickStudent.email.trim(),
          tempPassword: res.tempPassword,
          emailResult: res.emailResult,
          memberId: res.memberId
        });
        setQuickStudent({
          name: '',
          email: '',
          year: 'SE',
          department: 'Electronics & Telecommunication'
        });
      } else {
        setQuickRegisterError(res.message || 'Failed to register student.');
      }
    } catch (err: any) {
      setQuickRegisterError('An error occurred during registration. Please try again.');
    } finally {
      setRegisteringStudent(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!registeredResult) return;
    const loginUrl = `${window.location.origin}${window.location.pathname}#/login`;
    const text = `IoT Club Student Access Credentials:\n\nName: ${registeredResult.name}\nEmail: ${registeredResult.email}\nTemporary Password: ${registeredResult.tempPassword}\nLogin Portal: ${loginUrl}\n\nPlease log in and complete your technical profile.`;
    navigator.clipboard.writeText(text);
    setCopiedCredentials(true);
    setTimeout(() => setCopiedCredentials(false), 2500);
  };

  const handleSaveTwilioSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveTwilioConfig(twilioSettings);
    setTwilioSavedSuccess(true);
    setTimeout(() => {
      setTwilioSavedSuccess(false);
      setShowTwilioModal(false);
    }, 1500);
  };

  // Form states
  const [memberForm, setMemberForm] = useState<Partial<Member>>({
    name: '', year: 'SE', position: '', photo: '', bio: '',
    skills: [], skillsTech: [], skillsSoft: [], projects: [], achievements: [], certifications: [], socials: {}
  });

  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '', description: '', image: '', tags: [], team: [], github: '', demo: ''
  });

  const [achievementForm, setAchievementForm] = useState<Partial<Achievement>>({
    title: '', description: '', date: '', award: '', category: 'hackathon'
  });

  const [activityForm, setActivityForm] = useState<Partial<Activity>>({
    title: '', description: '', date: '', image: ''
  });

  const [resourceForm, setResourceForm] = useState<Partial<Resource>>({
    title: '', description: '', category: 'Arduino', link: ''
  });

  const [facultyForm, setFacultyForm] = useState<Partial<Faculty>>({
    name: '', role: '', photo: '', email: '', linkedin: ''
  });

  const [alumniForm, setAlumniForm] = useState<Partial<Alumni>>({
    name: '', batch: '', company: '', position: '', linkedin: ''
  });

  const [eventForm, setEventForm] = useState<Partial<Event>>({
    title: '', description: '', date: '', time: '', venue: '', image: '', status: 'upcoming', registrationLink: ''
  });

  const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({
    title: '', image: '', category: 'workshops'
  });

  const [settingsForm, setSettingsForm] = useState<HomepageContent>(store.homepageContent);

  useEffect(() => {
    if (store.homepageContent) {
      setSettingsForm(store.homepageContent);
    }
  }, [store.homepageContent]);

  // Handle Base64 photo readings
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Base64 resume readings
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMemberForm(prev => ({
          ...prev,
          resumeUrl: reader.result as string,
          resumeName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setEditId(null);
    setMemberForm({
      name: '', year: 'SE', position: '', photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300', bio: '',
      skills: ['Arduino', 'C++'], skillsTech: ['C++', 'Microcontrollers'], skillsSoft: ['Leadership'],
      projects: [{ name: 'IoT Automation', description: 'Smart room control' }], 
      achievements: [{ title: 'SIH Winner', year: '2025' }], 
      certifications: ['AWS Certified'], socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' }
    });
    setProjectForm({ title: '', description: '', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600', tags: [], team: [], github: '', demo: '' });
    setAchievementForm({ title: '', description: '', date: '', award: '', category: 'hackathon' });
    setActivityForm({ title: '', description: '', date: '', image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600' });
    setResourceForm({ title: '', description: '', category: 'Arduino', link: '' });
    setFacultyForm({ name: '', role: '', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300', email: '', linkedin: '' });
    setAlumniForm({ name: '', batch: '', company: '', position: '', linkedin: '' });
    setEventForm({ title: '', description: '', date: '', time: '', venue: '', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600', status: 'upcoming' });
    setGalleryForm({ title: '', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600', category: 'workshops' });
    setModalOpen(true);
  };

  const openEditModal = (id: string) => {
    setEditId(id);
    if (activeTab === 'members') {
      const item = store.members.find(x => x.id === id);
      if (item) setMemberForm(item);
    } else if (activeTab === 'projects') {
      const item = store.projects.find(x => x.id === id);
      if (item) setProjectForm(item);
    } else if (activeTab === 'achievements') {
      const item = store.achievements.find(x => x.id === id);
      if (item) setAchievementForm(item);
    } else if (activeTab === 'activities') {
      const item = store.activities.find(x => x.id === id);
      if (item) setActivityForm(item);
    } else if (activeTab === 'resources') {
      const item = store.resources.find(x => x.id === id);
      if (item) setResourceForm(item);
    } else if (activeTab === 'faculty') {
      const item = store.faculty.find(x => x.id === id);
      if (item) setFacultyForm(item);
    } else if (activeTab === 'alumni') {
      const item = store.alumni.find(x => x.id === id);
      if (item) setAlumniForm(item);
    } else if (activeTab === 'events') {
      const item = store.events.find(x => x.id === id);
      if (item) setEventForm(item);
    } else if (activeTab === 'gallery') {
      const item = store.gallery.find(x => x.id === id);
      if (item) setGalleryForm(item);
    }
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this catalog database entry?')) {
      if (activeTab === 'members') store.deleteMember(id);
      else if (activeTab === 'projects') store.deleteProject(id);
      else if (activeTab === 'achievements') store.deleteAchievement(id);
      else if (activeTab === 'activities') store.deleteActivity(id);
      else if (activeTab === 'resources') store.deleteResource(id);
      else if (activeTab === 'faculty') store.deleteFaculty(id);
      else if (activeTab === 'alumni') store.deleteAlumni(id);
      else if (activeTab === 'events') store.deleteEvent(id);
      else if (activeTab === 'gallery') store.deleteGalleryItem(id);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'members') {
      if (editId) store.updateMember({ ...memberForm, id: editId } as Member);
      else store.addMember(memberForm as Omit<Member, 'id'>);
    } else if (activeTab === 'projects') {
      if (editId) store.updateProject({ ...projectForm, id: editId } as Project);
      else store.addProject(projectForm as Omit<Project, 'id'>);
    } else if (activeTab === 'achievements') {
      if (editId) store.updateAchievement({ ...achievementForm, id: editId } as Achievement);
      else store.addAchievement(achievementForm as Omit<Achievement, 'id'>);
    } else if (activeTab === 'activities') {
      if (editId) store.updateActivity({ ...activityForm, id: editId } as Activity);
      else store.addActivity(activityForm as Omit<Activity, 'id'>);
    } else if (activeTab === 'resources') {
      if (editId) store.updateResource({ ...resourceForm, id: editId } as Resource);
      else store.addResource(resourceForm as Omit<Resource, 'id'>);
    } else if (activeTab === 'faculty') {
      if (editId) store.updateFaculty({ ...facultyForm, id: editId } as Faculty);
      else store.addFaculty(facultyForm as Omit<Faculty, 'id'>);
    } else if (activeTab === 'alumni') {
      if (editId) store.updateAlumni({ ...alumniForm, id: editId } as Alumni);
      else store.addAlumni(alumniForm as Omit<Alumni, 'id'>);
    } else if (activeTab === 'events') {
      if (editId) store.updateEvent({ ...eventForm, id: editId } as Event);
      else store.addEvent(eventForm as Omit<Event, 'id'>);
    } else if (activeTab === 'gallery') {
      if (editId) store.updateGalleryItem({ ...galleryForm, id: editId } as GalleryItem);
      else store.addGalleryItem(galleryForm as Omit<GalleryItem, 'id'>);
    }
    setModalOpen(false);
  };

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateHomepageContent(settingsForm);
    alert('Homepage configurations successfully updated!');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-dark)',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: '80px',
      position: 'relative',
      zIndex: 2
    }}>
      {/* Header Banner */}
      <header style={{
        background: 'rgba(8, 14, 28, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0, 242, 254, 0.2)',
        padding: '16px 5%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button 
            onClick={() => navigate('/')} 
            className="btn-secondary"
            style={{
              padding: '6px 14px',
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '6px'
            }}
          >
            <ArrowLeft size={14} /> Back to Web
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neon-cyan)' }}>
            <ShieldAlert size={20} />
            <h1 style={{ fontSize: '1.2rem', color: '#ffffff', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
              IoT Club Admin Console
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setShowTwilioModal(true)}
            className="btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              fontSize: '0.82rem',
              borderRadius: '6px',
              borderColor: 'rgba(0, 242, 254, 0.4)',
              color: 'var(--neon-cyan)'
            }}
          >
            <Mail size={14} /> Twilio SendGrid Config
          </button>

          <button 
            onClick={handleLogout} 
            className="btn-secondary logout-button"
            style={{
              borderColor: 'rgba(244, 63, 94, 0.4)',
              color: '#fb7185',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              fontSize: '0.85rem',
              borderRadius: '6px'
            }}
          >
            <LogOut size={14} /> End Session
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div style={{
        flexGrow: 1,
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
        padding: '30px 5%'
      }} className="dashboard-layout-grid">
        
        {/* Sidebar Nav */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderRight: '1px solid #cbd5e1', paddingRight: '15px' }} className="dashboard-sidebar">
          {[
            { id: 'members', label: 'Members', icon: Users },
            { id: 'projects', label: 'Projects', icon: Briefcase },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'activities', label: 'Timeline Activities', icon: Calendar },
            { id: 'gallery', label: 'Gallery', icon: Image },
            { id: 'resources', label: 'Resources', icon: BookOpen },
            { id: 'faculty', label: 'Faculty Advisors', icon: Users },
            { id: 'alumni', label: 'Alumni Directory', icon: GraduationCap },
            { id: 'events', label: 'Events Calendar', icon: Calendar },
            { id: 'settings', label: 'Homepage Settings', icon: Settings },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-gray)',
                  fontFamily: 'var(--font-main)',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'var(--transition-smooth)'
                }}
                className="dashboard-tab-btn"
              >
                <IconComp size={16} /> {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Content Panel */}
        <main style={{ paddingLeft: '30px' }} className="dashboard-content-panel">
          {activeTab !== 'settings' ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h2 style={{ fontSize: '1.45rem', color: 'var(--text-white)', textTransform: 'capitalize' }}>Manage {activeTab}</h2>
                <button onClick={openAddModal} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '4px' }}>
                  <Plus size={14} /> Add Catalog Entry
                </button>
              </div>

              {/* Quick Student Registration Panel (Requirement 1 & 2) */}
              {activeTab === 'members' && (
                <div className="glass-panel" style={{
                  marginBottom: '26px',
                  padding: '24px',
                  borderRadius: '14px',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  background: 'rgba(8, 14, 28, 0.75)',
                  boxShadow: '0 8px 30px rgba(0, 242, 254, 0.08)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sparkles size={18} style={{ color: 'var(--neon-cyan)' }} />
                        <h3 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 700, margin: 0 }}>
                          Register New Student & Dispatch Twilio Invite
                        </h3>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '4px', margin: 0 }}>
                        Enter a student's Name and Email. The system generates a secure random password and automatically sends login credentials via Twilio SendGrid.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowTwilioModal(true)}
                      className="btn-secondary"
                      style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '6px' }}
                    >
                      <Mail size={13} /> Twilio Settings
                    </button>
                  </div>

                  {quickRegisterError && (
                    <div style={{
                      padding: '10px 14px',
                      background: 'rgba(244, 63, 94, 0.12)',
                      border: '1px solid rgba(244, 63, 94, 0.35)',
                      borderRadius: '8px',
                      color: '#fb7185',
                      fontSize: '0.85rem',
                      marginBottom: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <AlertCircle size={16} />
                      {quickRegisterError}
                    </div>
                  )}

                  <form onSubmit={handleQuickStudentRegister} style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto',
                    gap: '12px',
                    alignItems: 'end'
                  }}>
                    <div>
                      <label className="cyber-label" style={{ fontSize: '0.76rem', marginBottom: '5px' }}>Student Full Name *</label>
                      <input
                        type="text"
                        className="cyber-input"
                        placeholder="e.g. Aryan Deshmukh"
                        value={quickStudent.name}
                        onChange={e => setQuickStudent(prev => ({ ...prev, name: e.target.value }))}
                        required
                        style={{ padding: '9px 12px', fontSize: '0.88rem' }}
                      />
                    </div>
                    <div>
                      <label className="cyber-label" style={{ fontSize: '0.76rem', marginBottom: '5px' }}>Student Email Address *</label>
                      <input
                        type="email"
                        className="cyber-input"
                        placeholder="aryan@college.edu"
                        value={quickStudent.email}
                        onChange={e => setQuickStudent(prev => ({ ...prev, email: e.target.value }))}
                        required
                        style={{ padding: '9px 12px', fontSize: '0.88rem' }}
                      />
                    </div>
                    <div>
                      <label className="cyber-label" style={{ fontSize: '0.76rem', marginBottom: '5px' }}>Academic Cohort *</label>
                      <select
                        className="cyber-input"
                        value={quickStudent.year}
                        onChange={e => setQuickStudent(prev => ({ ...prev, year: e.target.value as 'SE' | 'TE' | 'BE' }))}
                        style={{ padding: '9px 12px', fontSize: '0.88rem' }}
                      >
                        <option value="SE">SE (Second Year)</option>
                        <option value="TE">TE (Third Year)</option>
                        <option value="BE">BE (Final Year)</option>
                      </select>
                    </div>
                    <div>
                      <label className="cyber-label" style={{ fontSize: '0.76rem', marginBottom: '5px' }}>Department / Branch</label>
                      <input
                        type="text"
                        className="cyber-input"
                        placeholder="e.g. E&TC Engineering"
                        value={quickStudent.department}
                        onChange={e => setQuickStudent(prev => ({ ...prev, department: e.target.value }))}
                        style={{ padding: '9px 12px', fontSize: '0.88rem' }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={registeringStudent}
                      className="btn-primary"
                      style={{
                        padding: '10px 20px',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        height: '42px',
                        borderRadius: '6px'
                      }}
                    >
                      {registeringStudent ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" /> Dispatching...
                        </>
                      ) : (
                        <>
                          <Send size={15} /> Register Student
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Data Table */}
              <div className="glass-panel" style={{
                background: 'rgba(8, 14, 28, 0.75)',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px'
              }}>
                {activeTab === 'members' && (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(0, 242, 254, 0.2)', backgroundColor: 'rgba(0, 242, 254, 0.04)' }}>
                        <th style={{ padding: '14px 18px', color: 'var(--neon-cyan)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>Photo</th>
                        <th style={{ padding: '14px 18px', color: 'var(--neon-cyan)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>Student Details</th>
                        <th style={{ padding: '14px 18px', color: 'var(--neon-cyan)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>Cohort Year</th>
                        <th style={{ padding: '14px 18px', color: 'var(--neon-cyan)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>Role / Branch</th>
                        <th style={{ padding: '14px 18px', color: 'var(--neon-cyan)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>Status</th>
                        <th style={{ padding: '14px 18px', color: 'var(--neon-cyan)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.members.map(item => {
                        const isPending = item.isFirstLogin === true || item.profileCompleted === false;
                        const yearColor = item.year === 'SE' ? 'var(--neon-cyan)' : item.year === 'TE' ? 'var(--neon-purple)' : 'var(--neon-emerald)';

                        return (
                          <tr key={item.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }} className="alumni-row">
                            <td style={{ padding: '10px 18px' }}>
                              <img src={item.photo} alt={item.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${yearColor}` }} />
                            </td>
                            <td style={{ padding: '10px 18px' }}>
                              <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                              {item.email && (
                                <div style={{ color: 'var(--text-light)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>{item.email}</div>
                              )}
                            </td>
                            <td style={{ padding: '10px 18px' }}>
                              <span style={{
                                padding: '3px 10px',
                                borderRadius: '12px',
                                background: `rgba(${item.year === 'SE' ? '0, 242, 254' : item.year === 'TE' ? '168, 85, 247' : '0, 245, 160'}, 0.12)`,
                                border: `1px solid ${yearColor}`,
                                color: yearColor,
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                fontFamily: 'var(--font-mono)'
                              }}>
                                {item.year} Section
                              </span>
                            </td>
                            <td style={{ padding: '10px 18px' }}>
                              <div style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{item.position}</div>
                              {item.department && (
                                <div style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.74rem' }}>{item.department}</div>
                              )}
                            </td>
                            <td style={{ padding: '10px 18px' }}>
                              {isPending ? (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  background: 'rgba(245, 158, 11, 0.12)',
                                  border: '1px solid rgba(245, 158, 11, 0.35)',
                                  color: '#fbbf24',
                                  fontSize: '0.75rem'
                                }}>
                                  <Key size={11} /> Invited (Pending First Login)
                                </span>
                              ) : (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  background: 'rgba(0, 245, 160, 0.1)',
                                  border: '1px solid rgba(0, 245, 160, 0.3)',
                                  color: 'var(--neon-emerald)',
                                  fontSize: '0.75rem'
                                }}>
                                  <CheckCircle2 size={11} /> Profile Active
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '10px 18px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button onClick={() => openEditModal(item.id)} style={{ background: 'none', border: 'none', color: 'var(--neon-cyan)', cursor: 'pointer', padding: '4px' }} title="Edit"><Edit size={14} /></button>
                                <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer', padding: '4px' }} title="Delete"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

                {activeTab === 'projects' && (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #cbd5e1', backgroundColor: '#f8fafc' }}>
                        <th style={{ padding: '12px 18px', color: 'var(--text-white)', fontSize: '0.88rem' }}>Cover</th>
                        <th style={{ padding: '12px 18px', color: 'var(--text-white)', fontSize: '0.88rem' }}>Title</th>
                        <th style={{ padding: '12px 18px', color: 'var(--text-white)', fontSize: '0.88rem' }}>Team Members</th>
                        <th style={{ padding: '12px 18px', color: 'var(--text-white)', fontSize: '0.88rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.projects.map(item => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }} className="alumni-row">
                          <td style={{ padding: '8px 18px' }}>
                            <img src={item.image} alt={item.title} style={{ width: '45px', height: '30px', borderRadius: '4px', objectFit: 'cover' }} />
                          </td>
                          <td style={{ padding: '8px 18px', color: 'var(--text-white)', fontWeight: 500, fontSize: '0.88rem' }}>{item.title}</td>
                          <td style={{ padding: '8px 18px', color: 'var(--text-light)', fontSize: '0.88rem' }}>{item.team.join(', ')}</td>
                          <td style={{ padding: '8px 18px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                              <button onClick={() => openEditModal(item.id)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}><Edit size={14} /></button>
                              <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'achievements' && (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #cbd5e1', backgroundColor: '#f8fafc' }}>
                        <th style={{ padding: '12px 18px', color: 'var(--text-white)', fontSize: '0.88rem' }}>Title</th>
                        <th style={{ padding: '12px 18px', color: 'var(--text-white)', fontSize: '0.88rem' }}>Award</th>
                        <th style={{ padding: '12px 18px', color: 'var(--text-white)', fontSize: '0.88rem' }}>Date</th>
                        <th style={{ padding: '12px 18px', color: 'var(--text-white)', fontSize: '0.88rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.achievements.map(item => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }} className="alumni-row">
                          <td style={{ padding: '8px 18px', color: 'var(--text-white)', fontWeight: 500, fontSize: '0.88rem' }}>{item.title}</td>
                          <td style={{ padding: '8px 18px', color: 'var(--secondary)', fontSize: '0.88rem' }}>{item.award}</td>
                          <td style={{ padding: '8px 18px', color: 'var(--text-light)', fontSize: '0.88rem' }}>{item.date}</td>
                          <td style={{ padding: '8px 18px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                              <button onClick={() => openEditModal(item.id)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}><Edit size={14} /></button>
                              <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Fallback Lists */}
                {!['members', 'projects', 'achievements'].includes(activeTab) && (
                  <div style={{ padding: '15px', color: 'var(--text-light)', fontSize: '0.88rem' }}>
                    <p style={{ marginBottom: '10px' }}>Total listed items: {
                      activeTab === 'activities' ? store.activities.length :
                      activeTab === 'gallery' ? store.gallery.length :
                      activeTab === 'resources' ? store.resources.length :
                      activeTab === 'faculty' ? store.faculty.length :
                      activeTab === 'alumni' ? store.alumni.length : store.events.length
                    }</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(activeTab === 'activities' ? store.activities :
                        activeTab === 'gallery' ? store.gallery :
                        activeTab === 'resources' ? store.resources :
                        activeTab === 'faculty' ? store.faculty :
                        activeTab === 'alumni' ? store.alumni : store.events).map((x: any) => (
                          <div key={x.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f8fafc', borderRadius: '4px', border: '1px solid #cbd5e1' }} className="alumni-row">
                            <span style={{ color: '#1e293b', fontWeight: 500 }}>{x.title || x.name}</span>
                            <div style={{ display: 'flex', gap: '12px' }}>
                              <button onClick={() => openEditModal(x.id)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}><Edit size={14} /></button>
                              <button onClick={() => handleDelete(x.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}><Trash2 size={14} /></button>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Settings */
            <div>
              <h2 style={{ fontSize: '1.45rem', color: 'var(--text-white)', marginBottom: '20px' }}>Homepage Configurations</h2>
              <form onSubmit={handleSettingsSave} className="glass-panel" style={{ padding: '25px', background: '#ffffff', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '6px' }}>Club Logo Emoji</label>
                    <input type="text" value={settingsForm.logo} onChange={(e) => setSettingsForm({...settingsForm, logo: e.target.value})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '6px' }}>Club Name</label>
                    <input type="text" value={settingsForm.clubName} onChange={(e) => setSettingsForm({...settingsForm, clubName: e.target.value})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '6px' }}>Hero Tagline</label>
                  <textarea rows={2} value={settingsForm.tagline} onChange={(e) => setSettingsForm({...settingsForm, tagline: e.target.value})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)', resize: 'none' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '6px' }}>About Introduction</label>
                  <textarea rows={3} value={settingsForm.aboutIntro} onChange={(e) => setSettingsForm({...settingsForm, aboutIntro: e.target.value})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)', resize: 'none' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '6px' }}>Club Email</label>
                    <input type="email" value={settingsForm.email} onChange={(e) => setSettingsForm({...settingsForm, email: e.target.value})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '6px' }}>Club Phone</label>
                    <input type="text" value={settingsForm.phone} onChange={(e) => setSettingsForm({...settingsForm, phone: e.target.value})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '6px' }}>Club Address Location</label>
                  <input type="text" value={settingsForm.address} onChange={(e) => setSettingsForm({...settingsForm, address: e.target.value})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                </div>

                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '10px 24px', borderRadius: '4px' }}>
                  Save Configurations
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* CRUD Modals */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '560px', padding: '25px', background: '#ffffff', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '10px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-white)', marginBottom: '20px' }}>
              {editId ? 'Edit Catalog Entry' : 'Create New Catalog Entry'}
            </h3>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Member Form Fields */}
              {activeTab === 'members' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Name</label>
                    <input type="text" required value={memberForm.name} onChange={(e) => setMemberForm({...memberForm, name: e.target.value})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Academic Year</label>
                      <select value={memberForm.year} onChange={(e) => setMemberForm({...memberForm, year: e.target.value as any})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }}>
                        <option value="SE">Second Year (SE)</option>
                        <option value="TE">Third Year (TE)</option>
                        <option value="BE">Final Year (BE)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Position Title</label>
                      <input type="text" required value={memberForm.position} onChange={(e) => setMemberForm({...memberForm, position: e.target.value})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Biography</label>
                    <textarea rows={3} required value={memberForm.bio} onChange={(e) => setMemberForm({...memberForm, bio: e.target.value})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)', resize: 'none' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {/* Photo upload */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Profile Photo</label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <label style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.82rem',
                          color: 'var(--text-gray)'
                        }}>
                          <Upload size={12} /> Upload Image
                          <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, (url) => setMemberForm({...memberForm, photo: url}))} style={{ display: 'none' }} />
                        </label>
                        {memberForm.photo && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--secondary)' }}>Loaded</span>
                        )}
                      </div>
                    </div>

                    {/* Resume Upload */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Resume PDF</label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <label style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.82rem',
                          color: 'var(--text-gray)'
                        }}>
                          <FileText size={12} /> Upload PDF
                          <input type="file" accept=".pdf,.txt" onChange={handleResumeUpload} style={{ display: 'none' }} />
                        </label>
                        {memberForm.resumeName && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {memberForm.resumeName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Project Form Fields */}
              {activeTab === 'projects' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Project Title</label>
                    <input type="text" required value={projectForm.title} onChange={(e) => setProjectForm({...projectForm, title: e.target.value})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Description</label>
                    <textarea rows={3} required value={projectForm.description} onChange={(e) => setProjectForm({...projectForm, description: e.target.value})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)', resize: 'none' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>GitHub Link</label>
                      <input type="text" required value={projectForm.github} onChange={(e) => setProjectForm({...projectForm, github: e.target.value})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Demo Link</label>
                      <input type="text" required value={projectForm.demo} onChange={(e) => setProjectForm({...projectForm, demo: e.target.value})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Upload Cover Image</label>
                    <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, (url) => setProjectForm({...projectForm, image: url}))} style={{ color: 'var(--text-gray)', fontSize: '0.85rem' }} />
                  </div>
                </>
              )}

              {/* Achievements Form Fields */}
              {activeTab === 'achievements' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Title</label>
                    <input type="text" required value={achievementForm.title} onChange={(e) => setAchievementForm({...achievementForm, title: e.target.value})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Award</label>
                      <input type="text" required value={achievementForm.award} onChange={(e) => setAchievementForm({...achievementForm, award: e.target.value})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Category</label>
                      <select value={achievementForm.category} onChange={(e) => setAchievementForm({...achievementForm, category: e.target.value as any})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }}>
                        <option value="hackathon">Hackathon</option>
                        <option value="competition">Competition</option>
                        <option value="paper">Paper Presentation</option>
                        <option value="certification">Certification</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Date</label>
                      <input type="text" required placeholder="e.g. Dec 2025" value={achievementForm.date} onChange={(e) => setAchievementForm({...achievementForm, date: e.target.value})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Description</label>
                    <textarea rows={3} required value={achievementForm.description} onChange={(e) => setAchievementForm({...achievementForm, description: e.target.value})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)', resize: 'none' }} />
                  </div>
                </>
              )}

              {/* Gallery Form Fields */}
              {activeTab === 'gallery' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Title</label>
                    <input type="text" required value={galleryForm.title} onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Category</label>
                    <select value={galleryForm.category} onChange={(e) => setGalleryForm({...galleryForm, category: e.target.value as any})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }}>
                      <option value="workshops">Workshops</option>
                      <option value="competitions">Competitions</option>
                      <option value="seminars">Seminars</option>
                      <option value="guest lectures">Guest Lectures</option>
                      <option value="events">Events</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Upload Image</label>
                    <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, (url) => setGalleryForm({...galleryForm, image: url}))} style={{ color: 'var(--text-gray)', fontSize: '0.85rem' }} />
                  </div>
                </>
              )}

              {/* Faculty Form Fields */}
              {activeTab === 'faculty' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Name</label>
                    <input type="text" required value={facultyForm.name} onChange={(e) => setFacultyForm({...facultyForm, name: e.target.value})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Role / Designation</label>
                    <input type="text" required value={facultyForm.role} onChange={(e) => setFacultyForm({...facultyForm, role: e.target.value})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Email</label>
                      <input type="email" required value={facultyForm.email} onChange={(e) => setFacultyForm({...facultyForm, email: e.target.value})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>LinkedIn Link</label>
                      <input type="url" value={facultyForm.linkedin || ''} onChange={(e) => setFacultyForm({...facultyForm, linkedin: e.target.value})} style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Upload Photo</label>
                    <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, (url) => setFacultyForm({...facultyForm, photo: url}))} style={{ color: 'var(--text-gray)', fontSize: '0.85rem' }} />
                  </div>
                </>
              )}

              {/* Simple fallback inputs */}
              {!['members', 'projects', 'achievements', 'gallery', 'faculty'].includes(activeTab) && (
                <div style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                  <p style={{ marginBottom: '8px' }}>Metadata catalog fields:</p>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>Title</label>
                    <input type="text" required style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px', borderTop: '1px solid #cbd5e1', paddingTop: '15px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary" style={{ flexGrow: 1, justifyContent: 'center', padding: '8px 0', borderRadius: '4px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flexGrow: 1, justifyContent: 'center', padding: '8px 0', borderRadius: '4px' }}>
                  Save Entry
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Credentials Confirmation Modal (Requirement 1 & 2) */}
      {registeredResult && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel card-top-blue" style={{
            maxWidth: '520px',
            width: '100%',
            padding: '32px',
            borderRadius: '16px',
            boxShadow: '0 0 50px rgba(0, 242, 254, 0.25)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(0, 245, 160, 0.12)',
                border: '1px solid rgba(0, 245, 160, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--neon-emerald)',
                margin: '0 auto 12px auto'
              }}>
                <CheckCircle2 size={30} />
              </div>
              <h2 style={{ fontSize: '1.45rem', color: '#ffffff', fontWeight: 700, marginBottom: '6px' }}>
                Student Successfully Registered!
              </h2>
              <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                Credentials generated and account provisioned in the directory.
              </p>
            </div>

            {/* Credentials Card */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              borderRadius: '12px',
              padding: '18px',
              marginBottom: '20px'
            }}>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '0.5px' }}>
                  Student Name & Email
                </span>
                <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.95rem', marginTop: '2px' }}>
                  {registeredResult.name}
                </div>
                <div style={{ color: 'var(--neon-cyan)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                  {registeredResult.email}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '0.5px' }}>
                  Auto-Generated Temporary Password
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(0, 245, 160, 0.08)',
                  border: '1px solid rgba(0, 245, 160, 0.35)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  marginTop: '4px'
                }}>
                  <code style={{ fontSize: '1.15rem', color: 'var(--neon-emerald)', fontWeight: 800, letterSpacing: '1px' }}>
                    {registeredResult.tempPassword}
                  </code>
                  <button
                    onClick={handleCopyCredentials}
                    className="btn-secondary"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.76rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      borderRadius: '4px'
                    }}
                  >
                    {copiedCredentials ? (
                      <>
                        <Check size={12} style={{ color: 'var(--neon-emerald)' }} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Email Dispatch Status */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '8px',
              background: registeredResult.emailResult?.method === 'sendgrid' ? 'rgba(0, 245, 160, 0.08)' : 'rgba(245, 158, 11, 0.08)',
              border: `1px solid ${registeredResult.emailResult?.method === 'sendgrid' ? 'rgba(0, 245, 160, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
              marginBottom: '22px',
              fontSize: '0.82rem',
              color: registeredResult.emailResult?.method === 'sendgrid' ? '#a7f3d0' : '#fde68a',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Mail size={18} style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600 }}>
                  {registeredResult.emailResult?.method === 'sendgrid' ? 'Twilio SendGrid Email Dispatched' : 'Twilio Email Ready (Simulated)'}
                </div>
                <div style={{ fontSize: '0.76rem', opacity: 0.9, marginTop: '2px' }}>
                  {registeredResult.emailResult?.message}
                </div>
              </div>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => setRegisteredResult(null)}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                fontWeight: 700,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Done & Return to Console
            </button>
          </div>
        </div>
      )}

      {/* Twilio SendGrid Configuration Modal */}
      {showTwilioModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel card-top-blue" style={{
            maxWidth: '500px',
            width: '100%',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 0 50px rgba(0, 242, 254, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={20} style={{ color: 'var(--neon-cyan)' }} />
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 700, margin: 0 }}>
                  Twilio SendGrid Settings
                </h3>
              </div>
              <button
                onClick={() => setShowTwilioModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                &times;
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-light)', marginBottom: '18px', lineHeight: 1.5 }}>
              Enter your Twilio SendGrid credentials to enable automatic email dispatch of student login credentials.
            </p>

            {twilioSavedSuccess && (
              <div style={{
                padding: '10px 14px',
                background: 'rgba(0, 245, 160, 0.12)',
                border: '1px solid rgba(0, 245, 160, 0.4)',
                borderRadius: '8px',
                color: '#a7f3d0',
                fontSize: '0.85rem',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} /> Twilio settings successfully saved!
              </div>
            )}

            <form onSubmit={handleSaveTwilioSettings}>
              <div style={{ marginBottom: '14px' }}>
                <label className="cyber-label">SendGrid API Key (starts with SG.)</label>
                <input
                  type="password"
                  className="cyber-input"
                  placeholder="SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={twilioSettings.apiKey}
                  onChange={e => setTwilioSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label className="cyber-label">Verified Sender Email</label>
                <input
                  type="email"
                  className="cyber-input"
                  placeholder="iotclub@yourcollege.edu"
                  value={twilioSettings.fromEmail}
                  onChange={e => setTwilioSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                />
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label className="cyber-label">Sender Name</label>
                <input
                  type="text"
                  className="cyber-input"
                  placeholder="IoT Club Administration"
                  value={twilioSettings.fromName}
                  onChange={e => setTwilioSettings(prev => ({ ...prev, fromName: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowTwilioModal(false)}
                  className="btn-secondary"
                  style={{ flexGrow: 1, padding: '10px', borderRadius: '6px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flexGrow: 1, padding: '10px', borderRadius: '6px', fontWeight: 700 }}
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .dashboard-tab-btn:hover {
          color: var(--primary) !important;
          background: var(--primary-glow) !important;
        }
        .alumni-row:hover {
          background-color: #f1f5f9 !important;
        }
        @media (max-width: 900px) {
          .dashboard-layout-grid {
            grid-template-columns: 1fr !important;
          }
          .dashboard-sidebar {
            flex-direction: row !important;
            overflow-x: auto;
            border-right: none !important;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 15px;
            padding-right: 0 !important;
            margin-bottom: 20px;
          }
          .dashboard-tab-btn {
            flex-shrink: 0;
            width: auto !important;
          }
          .dashboard-content-panel {
            padding-left: 0 !important;
          }
        }
      `}</style>

    </div>
  );
};
