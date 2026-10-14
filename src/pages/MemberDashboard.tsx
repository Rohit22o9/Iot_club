import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Briefcase, Award, 
  Globe, LogOut, ArrowLeft, ArrowRight, Save, Plus, Trash2, Upload,
  CheckCircle2, ExternalLink, Database, Sparkles, Terminal, Eye
} from 'lucide-react';
import { Github, Linkedin } from '../components/BrandIcons';
import { useIoTStore } from '../data/store';
import type { Member } from '../types';

const PRESET_AVATARS = [
  '/photoes/IMG-20241215-WA0024.jpg',
  '/photoes/IMG-20241215-WA0077.jpg',
  '/photoes/IMG-20260222-WA0049.jpg',
  '/photoes/Techathon%203.0%20best%20project%20award.jpg',
  '/photoes/Innovation%202k25%201.jpeg',
  '/photoes/Innovation%202k25%20Runner%20Up.jpeg',
];

export const MemberDashboard: React.FC = () => {
  const navigate = useNavigate();
  const store = useIoTStore();
  const [memberId, setMemberId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Google Sheets Config Modal
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [sheetsUrlInput, setSheetsUrlInput] = useState(store.googleSheetsUrl);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);

  // Form states
  const [profile, setProfile] = useState<Partial<Member>>({
    name: '', position: 'Student Developer', year: 'SE', bio: '', photo: '',
    skillsTech: ['Embedded Systems', 'Arduino', 'IoT Routing'], 
    skillsSoft: ['Collaboration', 'Problem Solving'], 
    education: ['University Engineering Student'], 
    certifications: [],
    projects: [], achievements: [], socials: {}
  });

  // Dynamic input collectors
  const [newSkillTech, setNewSkillTech] = useState('');
  const [newCert, setNewCert] = useState('');
  const [newProj, setNewProj] = useState({ name: '', description: '', url: '' });
  const [newAch, setNewAch] = useState({ title: '', year: '', org: '' });

  // Security Auth check
  useEffect(() => {
    const authId = sessionStorage.getItem('iot_member_auth');
    if (!authId) {
      navigate('/login');
      return;
    }
    setMemberId(authId);
    
    // Find member record in store
    const user = store.members.find(x => x.id === authId);
    if (user) {
      setProfile(user);
    }
  }, [store.members, navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('iot_member_auth');
    navigate('/');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ 
          ...prev, 
          photoBase64: reader.result as string, 
          photoName: file.name, 
          photo: reader.result as string 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Item Helpers
  const addTechSkill = () => {
    if (!newSkillTech.trim()) return;
    const current = profile.skillsTech || profile.skills || [];
    if (!current.includes(newSkillTech.trim())) {
      setProfile(prev => ({ 
        ...prev, 
        skillsTech: [...current, newSkillTech.trim()],
        skills: [...current, newSkillTech.trim()]
      }));
    }
    setNewSkillTech('');
  };

  const removeTechSkill = (idx: number) => {
    const current = profile.skillsTech || profile.skills || [];
    const updated = current.filter((_, i) => i !== idx);
    setProfile(prev => ({ ...prev, skillsTech: updated, skills: updated }));
  };

  const addCert = () => {
    if (!newCert.trim()) return;
    setProfile(prev => ({ ...prev, certifications: [...(prev.certifications || []), newCert.trim()] }));
    setNewCert('');
  };

  const removeCert = (idx: number) => {
    setProfile(prev => ({ ...prev, certifications: (prev.certifications || []).filter((_, i) => i !== idx) }));
  };

  const addProjItem = () => {
    if (!newProj.name.trim()) return;
    setProfile(prev => ({ ...prev, projects: [...(prev.projects || []), { ...newProj }] }));
    setNewProj({ name: '', description: '', url: '' });
  };

  const removeProjItem = (idx: number) => {
    setProfile(prev => ({ ...prev, projects: (prev.projects || []).filter((_, i) => i !== idx) }));
  };

  const addAchItem = () => {
    if (!newAch.title.trim()) return;
    setProfile(prev => ({ ...prev, achievements: [...(prev.achievements || []), { ...newAch }] }));
    setNewAch({ title: '', year: '', org: '' });
  };

  const removeAchItem = (idx: number) => {
    setProfile(prev => ({ ...prev, achievements: (prev.achievements || []).filter((_, i) => i !== idx) }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await store.updateMemberProfile({ 
        ...profile, 
        id: memberId,
        skills: profile.skillsTech || profile.skills,
        skillsTech: profile.skillsTech || profile.skills
      });

      if (res.status === 'success') {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 4000);
      } else {
        setError(res.message || 'Failed to update profile.');
      }
    } catch(err) {
      setError('A database sync error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoogleSheetsConfig = async () => {
    store.setGoogleSheetsUrl(sheetsUrlInput);
    setTestingConnection(true);
    const result = await store.testGoogleSheetsConnection(sheetsUrlInput);
    setTestingConnection(false);
    setTestResult(result);
    if (result.success) {
      setTimeout(() => setShowConfigModal(false), 1500);
    }
  };

  const currentYearCode = (profile.year || 'SE').toUpperCase() as 'SE' | 'TE' | 'BE';
  const currentSkills = profile.skillsTech || profile.skills || [];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-dark)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 2,
      overflow: 'hidden'
    }}>
      {/* Background ambient light */}
      <div className="ambient-glow-cyan" style={{ top: '-120px', left: '-120px' }} />
      <div className="ambient-glow-purple" style={{ bottom: '-120px', right: '-120px' }} />

      {/* Top Console Navigation Bar */}
      <header style={{
        background: 'rgba(7, 9, 19, 0.92)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(0, 242, 254, 0.18)',
        padding: '14px 5%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => navigate('/')} 
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.82rem', borderRadius: '6px' }}
          >
            <ArrowLeft size={14} /> Back to Web
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.1rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #00f2fe 0%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Student Console
            </span>
            <span style={{
              fontSize: '0.72rem',
              padding: '2px 8px',
              borderRadius: '12px',
              fontWeight: 700,
              background: currentYearCode === 'SE' ? 'rgba(0, 245, 160, 0.15)' : currentYearCode === 'TE' ? 'rgba(0, 242, 254, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              color: currentYearCode === 'SE' ? 'var(--neon-emerald)' : currentYearCode === 'TE' ? 'var(--neon-cyan)' : 'var(--neon-rose)',
              border: `1px solid ${currentYearCode === 'SE' ? 'rgba(0, 245, 160, 0.3)' : currentYearCode === 'TE' ? 'rgba(0, 242, 254, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            }}>
              {currentYearCode} Section
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Google Sheets Connection Toggle */}
          <button
            onClick={() => setShowConfigModal(true)}
            className="btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '0.8rem',
              borderRadius: '6px',
              borderColor: store.isGoogleSheetsConfigured ? 'rgba(0, 245, 160, 0.4)' : 'rgba(0, 242, 254, 0.3)',
              color: store.isGoogleSheetsConfigured ? 'var(--neon-emerald)' : 'var(--text-gray)'
            }}
          >
            <Database size={13} /> 
            {store.isGoogleSheetsConfigured ? 'Sheets Connected' : 'Connect Google Sheets'}
          </button>

          {/* View Public Card */}
          <Link
            to={`/members/${currentYearCode.toLowerCase()}`}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '6px', color: 'var(--neon-cyan)' }}
          >
            <Eye size={13} /> View in Directory
          </Link>

          {/* End Session */}
          <button 
            onClick={handleLogout} 
            className="btn-secondary"
            style={{
              borderColor: 'rgba(244, 63, 94, 0.35)',
              color: '#fb7185',
              padding: '6px 12px',
              fontSize: '0.8rem',
              borderRadius: '6px'
            }}
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1280px', width: '100%', margin: '24px auto', padding: '0 20px', flexGrow: 1 }}>
        
        {/* Banner greeting */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            fontSize: '1.8rem',
            color: 'var(--text-white)',
            fontWeight: 800,
            marginBottom: '4px',
            fontFamily: 'var(--font-heading)'
          }}>
            Welcome, {profile.name || 'Member'}
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Update your technical profile below. Once saved, your profile card automatically updates in the{' '}
            <strong style={{ color: 'var(--neon-cyan)' }}>
              {currentYearCode === 'SE' ? 'Second Year (SE)' : currentYearCode === 'TE' ? 'Third Year (TE)' : 'Final Year (BE)'} Directory
            </strong>.
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div style={{
            padding: '14px 18px',
            background: 'rgba(0, 245, 160, 0.12)',
            border: '1px solid rgba(0, 245, 160, 0.4)',
            color: '#a7f3d0',
            borderRadius: '10px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={20} style={{ color: 'var(--neon-emerald)' }} />
              <div>
                <strong>Profile Successfully Published to Directory!</strong>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                  Synced with Google Sheets and active directory cohorts.
                </div>
              </div>
            </div>
            <Link
              to={`/members/${currentYearCode.toLowerCase()}`}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              See Your Card Now <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            color: '#fb7185',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '0.88rem'
          }}>
            {error}
          </div>
        )}

        {/* Dashboard 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: '26px', alignItems: 'start' }} className="dashboard-grid">
          
          {/* LEFT: Information Input Form */}
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* CARD 1: Basic & Academic Information */}
            <div className="glass-panel card-top-blue" style={{ padding: '24px' }}>
              <h3 style={{
                fontSize: '1.15rem',
                color: 'var(--text-white)',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700
              }}>
                <User size={18} style={{ color: 'var(--neon-cyan)' }} /> 
                Personal & Academic Details
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }} className="grid-responsive-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '6px', fontWeight: 500 }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.name || ''}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(13, 19, 38, 0.8)',
                      border: '1px solid rgba(0, 242, 254, 0.25)',
                      borderRadius: '8px',
                      color: 'var(--text-white)',
                      outline: 'none',
                      fontSize: '0.88rem',
                      fontFamily: 'var(--font-main)'
                    }}
                    className="cyber-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '6px', fontWeight: 500 }}>
                    Position / Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IoT Firmware Lead, Member"
                    value={profile.position || ''}
                    onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(13, 19, 38, 0.8)',
                      border: '1px solid rgba(0, 242, 254, 0.25)',
                      borderRadius: '8px',
                      color: 'var(--text-white)',
                      outline: 'none',
                      fontSize: '0.88rem',
                      fontFamily: 'var(--font-main)'
                    }}
                    className="cyber-input"
                  />
                </div>
              </div>

              {/* Department/Year & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }} className="grid-responsive-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '6px', fontWeight: 500 }}>
                    Academic Year Cohort *
                  </label>
                  <select
                    value={profile.year || 'SE'}
                    onChange={(e) => setProfile({ ...profile, year: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#0d142b',
                      border: '1px solid rgba(0, 242, 254, 0.25)',
                      borderRadius: '8px',
                      color: 'var(--text-white)',
                      outline: 'none',
                      fontSize: '0.88rem',
                      fontFamily: 'var(--font-main)',
                      cursor: 'pointer'
                    }}
                    className="cyber-input"
                  >
                    <option value="SE">Second Year (SE Section)</option>
                    <option value="TE">Third Year (TE Section)</option>
                    <option value="BE">Final Year (BE Section)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '6px', fontWeight: 500 }}>
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={profile.socials?.phone || ''}
                    onChange={(e) => setProfile({ 
                      ...profile, 
                      socials: { ...(profile.socials || {}), phone: e.target.value } 
                    })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(13, 19, 38, 0.8)',
                      border: '1px solid rgba(0, 242, 254, 0.25)',
                      borderRadius: '8px',
                      color: 'var(--text-white)',
                      outline: 'none',
                      fontSize: '0.88rem',
                      fontFamily: 'var(--font-main)'
                    }}
                    className="cyber-input"
                  />
                </div>
              </div>

              {/* Bio Summary */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '6px', fontWeight: 500 }}>
                  Biography & Engineering Focus *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell other chapter members about your hardware interests, microcontrollers you work with, and skills..."
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(13, 19, 38, 0.8)',
                    border: '1px solid rgba(0, 242, 254, 0.25)',
                    borderRadius: '8px',
                    color: 'var(--text-white)',
                    outline: 'none',
                    fontSize: '0.88rem',
                    fontFamily: 'var(--font-main)',
                    resize: 'none'
                  }}
                  className="cyber-input"
                />
              </div>
            </div>

            {/* CARD 2: Avatar Photo & Media */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{
                fontSize: '1.15rem',
                color: 'var(--text-white)',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700
              }}>
                <Upload size={18} style={{ color: 'var(--neon-emerald)' }} />
                Profile Avatar & Media Link
              </h3>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '14px' }}>
                <img
                  src={profile.photo || PRESET_AVATARS[0]}
                  alt="Avatar"
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid var(--neon-cyan)',
                    boxShadow: '0 0 16px rgba(0, 242, 254, 0.35)',
                    flexShrink: 0
                  }}
                />
                <div style={{ flexGrow: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '6px', fontWeight: 500 }}>
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={profile.photo || ''}
                    onChange={(e) => setProfile({ ...profile, photo: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(13, 19, 38, 0.8)',
                      border: '1px solid rgba(0, 242, 254, 0.25)',
                      borderRadius: '8px',
                      color: 'var(--text-white)',
                      outline: 'none',
                      fontSize: '0.85rem'
                    }}
                    className="cyber-input"
                  />
                </div>
              </div>

              {/* Or Preset Avatars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Choose Preset:</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {PRESET_AVATARS.map((preset, idx) => (
                    <img
                      key={idx}
                      src={preset}
                      alt="Preset"
                      onClick={() => setProfile({ ...profile, photo: preset })}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        objectFit: 'cover',
                        border: profile.photo === preset ? '2px solid var(--neon-cyan)' : '1px solid rgba(255,255,255,0.2)'
                      }}
                    />
                  ))}
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem', margin: '0 4px' }}>or</span>
                <label className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem', cursor: 'pointer', borderRadius: '4px' }}>
                  <Upload size={12} /> Upload File
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            {/* CARD 3: Technical Skills Management */}
            <div className="glass-panel card-top-green" style={{ padding: '24px' }}>
              <h3 style={{
                fontSize: '1.15rem',
                color: 'var(--text-white)',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700
              }}>
                <Terminal size={18} style={{ color: 'var(--neon-emerald)' }} />
                Technical Skills & Hardware Domains
              </h3>

              {/* Active Skills Badges */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                padding: '10px 12px',
                background: 'rgba(13, 19, 38, 0.8)',
                border: '1px solid rgba(0, 245, 160, 0.25)',
                borderRadius: '8px',
                minHeight: '48px',
                marginBottom: '12px'
              }}>
                {currentSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 10px',
                      background: 'rgba(0, 245, 160, 0.15)',
                      border: '1px solid rgba(0, 245, 160, 0.35)',
                      borderRadius: '6px',
                      color: 'var(--neon-emerald)',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeTechSkill(idx)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: 0 }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Skill Input */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="e.g. STM32, LoRaWAN, Edge Impulse"
                  value={newSkillTech}
                  onChange={(e) => setNewSkillTech(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTechSkill();
                    }
                  }}
                  style={{
                    flexGrow: 1,
                    padding: '10px 12px',
                    background: 'rgba(13, 19, 38, 0.8)',
                    border: '1px solid rgba(0, 242, 254, 0.25)',
                    borderRadius: '8px',
                    color: 'var(--text-white)',
                    outline: 'none',
                    fontSize: '0.88rem'
                  }}
                  className="cyber-input"
                />
                <button
                  type="button"
                  onClick={addTechSkill}
                  className="btn-secondary"
                  style={{ borderRadius: '8px', borderColor: 'var(--neon-emerald)', color: 'var(--neon-emerald)' }}
                >
                  <Plus size={16} /> Add Skill
                </button>
              </div>
            </div>

            {/* CARD 4: Projects & Portfolios */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{
                fontSize: '1.15rem',
                color: 'var(--text-white)',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700
              }}>
                <Briefcase size={18} style={{ color: 'var(--neon-cyan)' }} />
                Projects & Prototypes
              </h3>

              {/* List of current projects */}
              {profile.projects && profile.projects.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {profile.projects.map((proj, idx) => (
                    <div 
                      key={idx}
                      style={{
                        padding: '12px 14px',
                        background: 'rgba(13, 19, 38, 0.8)',
                        border: '1px solid rgba(0, 242, 254, 0.2)',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-white)', fontSize: '0.9rem' }}>{proj.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{proj.description}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProjItem(idx)}
                        style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Project Form */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                padding: '14px',
                background: 'rgba(0, 242, 254, 0.04)',
                border: '1px solid rgba(0, 242, 254, 0.15)',
                borderRadius: '8px'
              }} className="grid-responsive-2">
                <input
                  type="text"
                  placeholder="Project Title"
                  value={newProj.name}
                  onChange={(e) => setNewProj({ ...newProj, name: e.target.value })}
                  style={{
                    padding: '8px 10px',
                    background: 'rgba(13, 19, 38, 0.8)',
                    border: '1px solid rgba(0, 242, 254, 0.25)',
                    borderRadius: '6px',
                    color: 'var(--text-white)',
                    fontSize: '0.85rem'
                  }}
                />
                <input
                  type="url"
                  placeholder="GitHub / Live URL"
                  value={newProj.url}
                  onChange={(e) => setNewProj({ ...newProj, url: e.target.value })}
                  style={{
                    padding: '8px 10px',
                    background: 'rgba(13, 19, 38, 0.8)',
                    border: '1px solid rgba(0, 242, 254, 0.25)',
                    borderRadius: '6px',
                    color: 'var(--text-white)',
                    fontSize: '0.85rem'
                  }}
                />
                <textarea
                  rows={2}
                  placeholder="Brief description of hardware or logic..."
                  value={newProj.description}
                  onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
                  style={{
                    gridColumn: '1 / -1',
                    padding: '8px 10px',
                    background: 'rgba(13, 19, 38, 0.8)',
                    border: '1px solid rgba(0, 242, 254, 0.25)',
                    borderRadius: '6px',
                    color: 'var(--text-white)',
                    fontSize: '0.85rem',
                    resize: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={addProjItem}
                  className="btn-secondary"
                  style={{ gridColumn: '1 / -1', justifyContent: 'center', padding: '8px' }}
                >
                  <Plus size={14} /> Add Project Item
                </button>
              </div>
            </div>

            {/* CARD 5: Certifications & Honors */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{
                fontSize: '1.15rem',
                color: 'var(--text-white)',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700
              }}>
                <Award size={18} style={{ color: 'var(--neon-amber)' }} />
                Certifications & Achievements
              </h3>

              {/* Certifications List */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '6px' }}>
                  Industry Certifications
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  {(profile.certifications || []).map((cert, idx) => (
                    <span 
                      key={idx}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        background: 'rgba(251, 191, 36, 0.12)',
                        border: '1px solid rgba(251, 191, 36, 0.3)',
                        borderRadius: '6px',
                        color: 'var(--neon-amber)',
                        fontSize: '0.78rem'
                      }}
                    >
                      {cert}
                      <button 
                        type="button" 
                        onClick={() => removeCert(idx)}
                        style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer', padding: 0 }}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="e.g. AWS IoT Developer, Certified Embedded Engineer"
                    value={newCert}
                    onChange={(e) => setNewCert(e.target.value)}
                    style={{
                      flexGrow: 1,
                      padding: '8px 10px',
                      background: 'rgba(13, 19, 38, 0.8)',
                      border: '1px solid rgba(0, 242, 254, 0.25)',
                      borderRadius: '6px',
                      color: 'var(--text-white)',
                      fontSize: '0.85rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={addCert}
                    className="btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                  >
                    <Plus size={14} /> Add Cert
                  </button>
                </div>
              </div>

              {/* Achievements List */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '6px' }}>
                  Hackathons & Competitions
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
                  {(profile.achievements || []).map((ach, idx) => (
                    <div 
                      key={idx}
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(13, 19, 38, 0.8)',
                        border: '1px solid rgba(251, 191, 36, 0.2)',
                        borderRadius: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.84rem'
                      }}
                    >
                      <span>
                        <strong style={{ color: 'var(--text-white)' }}>{ach.title}</strong>
                        {ach.org && <span style={{ color: 'var(--text-muted)' }}> — {ach.org}</span>}
                        {ach.year && <span style={{ color: 'var(--neon-amber)' }}> ({ach.year})</span>}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => removeAchItem(idx)}
                        style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px' }} className="grid-responsive-2">
                  <input
                    type="text"
                    placeholder="Award / Contest Title"
                    value={newAch.title}
                    onChange={(e) => setNewAch({ ...newAch, title: e.target.value })}
                    style={{
                      padding: '8px 10px',
                      background: 'rgba(13, 19, 38, 0.8)',
                      border: '1px solid rgba(0, 242, 254, 0.25)',
                      borderRadius: '6px',
                      color: 'var(--text-white)',
                      fontSize: '0.85rem'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Organizer / Event"
                    value={newAch.org}
                    onChange={(e) => setNewAch({ ...newAch, org: e.target.value })}
                    style={{
                      padding: '8px 10px',
                      background: 'rgba(13, 19, 38, 0.8)',
                      border: '1px solid rgba(0, 242, 254, 0.25)',
                      borderRadius: '6px',
                      color: 'var(--text-white)',
                      fontSize: '0.85rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={addAchItem}
                    className="btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                  >
                    <Plus size={14} /> Add Award
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 6: Social Profiles */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{
                fontSize: '1.15rem',
                color: 'var(--text-white)',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700
              }}>
                <Globe size={18} style={{ color: 'var(--neon-cyan)' }} />
                Professional Social Links
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }} className="grid-responsive-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '6px' }}>LinkedIn Profile URL</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={profile.socials?.linkedin || ''}
                    onChange={(e) => setProfile({
                      ...profile,
                      socials: { ...(profile.socials || {}), linkedin: e.target.value }
                    })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(13, 19, 38, 0.8)',
                      border: '1px solid rgba(0, 242, 254, 0.25)',
                      borderRadius: '8px',
                      color: 'var(--text-white)',
                      fontSize: '0.85rem'
                    }}
                    className="cyber-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '6px' }}>GitHub Profile URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/username"
                    value={profile.socials?.github || ''}
                    onChange={(e) => setProfile({
                      ...profile,
                      socials: { ...(profile.socials || {}), github: e.target.value }
                    })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(13, 19, 38, 0.8)',
                      border: '1px solid rgba(0, 242, 254, 0.25)',
                      borderRadius: '8px',
                      color: 'var(--text-white)',
                      fontSize: '0.85rem'
                    }}
                    className="cyber-input"
                  />
                </div>
              </div>
            </div>

            {/* SAVE & PUBLISH ACTION BUTTON */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  padding: '14px 28px',
                  fontSize: '1rem',
                  borderRadius: '8px',
                  flexGrow: 1,
                  justifyContent: 'center'
                }}
              >
                {loading ? 'Synchronizing with Database...' : (
                  <><Save size={18} /> Save & Publish to Directory</>
                )}
              </button>
            </div>

          </form>

          {/* RIGHT: Live Directory Preview Card */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <span style={{
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--neon-cyan)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Sparkles size={14} /> Live Directory Card Preview
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Target: {currentYearCode} Section
              </span>
            </div>

            {/* PREVIEW CARD */}
            <div 
              className={`member-card-premium card-glow-${currentYearCode.toLowerCase()}`}
              style={{
                boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                border: '1px solid rgba(0, 242, 254, 0.35)'
              }}
            >
              {/* Banner */}
              <div 
                className={`member-card-banner-${currentYearCode.toLowerCase()}`}
                style={{
                  height: '100px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  borderBottomLeftRadius: '24px',
                  borderBottomRightRadius: '24px'
                }}
              >
                <img
                  src={profile.photo || PRESET_AVATARS[0]}
                  alt={profile.name || 'Student'}
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid var(--neon-cyan)',
                    boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)',
                    position: 'absolute',
                    bottom: '-28px',
                    zIndex: 2
                  }}
                />
              </div>

              {/* Card Contents */}
              <div style={{ padding: '36px 20px 20px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-white)', fontWeight: 800, marginBottom: '3px', fontFamily: 'var(--font-heading)' }}>
                  {profile.name || 'Student Name'}
                </h3>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '3px 12px',
                    background: currentYearCode === 'SE' ? 'rgba(0, 245, 160, 0.12)' : currentYearCode === 'TE' ? 'rgba(0, 242, 254, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                    color: currentYearCode === 'SE' ? 'var(--neon-emerald)' : currentYearCode === 'TE' ? 'var(--neon-cyan)' : 'var(--neon-rose)',
                    borderRadius: '100px',
                    border: `1px solid ${currentYearCode === 'SE' ? 'rgba(0, 245, 160, 0.3)' : currentYearCode === 'TE' ? 'rgba(0, 242, 254, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {profile.position || 'Member Developer'}
                  </span>
                </div>

                <p style={{
                  color: 'var(--text-light)',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  marginBottom: '16px',
                  minHeight: '38px'
                }}>
                  {profile.bio || 'Add a biography to present your engineering profile to the chapter.'}
                </p>

                {/* Skills Chips */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '16px' }}>
                  {currentSkills.slice(0, 4).map((s, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        background: 'rgba(0, 242, 254, 0.1)',
                        border: '1px solid rgba(0, 242, 254, 0.25)',
                        borderRadius: '4px',
                        color: 'var(--neon-cyan)',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {s}
                    </span>
                  ))}
                  {currentSkills.length > 4 && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      +{currentSkills.length - 4} more
                    </span>
                  )}
                </div>

                {/* Socials & Card CTA */}
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    {profile.socials?.github && (
                      <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="member-social-btn">
                        <Github size={14} />
                      </a>
                    )}
                    {profile.socials?.linkedin && (
                      <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="member-social-btn">
                        <Linkedin size={14} />
                      </a>
                    )}
                  </div>

                  <Link
                    to={`/members/${currentYearCode.toLowerCase()}`}
                    className={`btn-view-profile btn-hover-${currentYearCode.toLowerCase()}`}
                    style={{ fontSize: '0.85rem' }}
                  >
                    View in {currentYearCode} Section Directory <ExternalLink size={13} style={{ marginLeft: '4px' }} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Helper Box */}
            <div style={{
              marginTop: '16px',
              padding: '14px',
              background: 'rgba(13, 19, 38, 0.7)',
              border: '1px solid rgba(0, 242, 254, 0.2)',
              borderRadius: '10px',
              fontSize: '0.8rem',
              color: 'var(--text-light)'
            }}>
              <strong style={{ color: 'var(--text-white)' }}>💡 Did you know?</strong>
              <p style={{ marginTop: '4px', lineHeight: 1.4 }}>
                Switching your <strong>Academic Year</strong> automatically shifts your card to the corresponding section (SE, TE, or BE) in the public student directory.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Google Sheets Connection Modal */}
      {showConfigModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '520px',
            width: '100%',
            padding: '28px',
            borderRadius: '16px',
            border: '1px solid rgba(0, 242, 254, 0.35)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={20} style={{ color: 'var(--neon-emerald)' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-white)', fontWeight: 700 }}>
                  Google Sheets & Drive Backend
                </h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '18px' }}>
              Connect your Google Sheets spreadsheet via Google Apps Script to synchronize student registrations, profiles, and portfolios across Google Drive and the club website.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '6px' }}>
                Google Apps Script Web App URL
              </label>
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={sheetsUrlInput}
                onChange={(e) => setSheetsUrlInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(13, 19, 38, 0.8)',
                  border: '1px solid rgba(0, 242, 254, 0.25)',
                  borderRadius: '8px',
                  color: 'var(--text-white)',
                  fontSize: '0.85rem'
                }}
                className="cyber-input"
              />
            </div>

            {testResult && (
              <div style={{
                padding: '10px 12px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                marginBottom: '16px',
                background: testResult.success ? 'rgba(0, 245, 160, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                color: testResult.success ? '#a7f3d0' : '#fb7185',
                border: `1px solid ${testResult.success ? 'rgba(0, 245, 160, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
              }}>
                {testResult.message}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Close
              </button>
              <button
                type="button"
                disabled={testingConnection}
                onClick={handleSaveGoogleSheetsConfig}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                {testingConnection ? 'Testing...' : 'Test & Save Endpoint'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cyber-input:focus {
          border-color: var(--neon-cyan) !important;
          box-shadow: 0 0 15px rgba(0, 242, 254, 0.3) !important;
        }
        @media (max-width: 960px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .grid-responsive-2 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
