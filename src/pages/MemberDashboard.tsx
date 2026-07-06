import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Briefcase, Award, GraduationCap, 
  Globe, LogOut, ArrowLeft, Save, Plus, Trash2, Upload, FileText
} from 'lucide-react';
import { useIoTStore } from '../data/store';
import type { Member } from '../types';

export const MemberDashboard: React.FC = () => {
  const navigate = useNavigate();
  const store = useIoTStore();
  const [memberId, setMemberId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [profile, setProfile] = useState<Partial<Member>>({
    name: '', position: '', year: 'SE', bio: '',
    skillsTech: [], skillsSoft: [], education: [], certifications: [],
    projects: [], achievements: [], socials: {}
  });

  // Dynamic input collectors
  const [newSkillTech, setNewSkillTech] = useState('');
  const [newSkillSoft, setNewSkillSoft] = useState('');
  const [newEdu, setNewEdu] = useState('');
  const [newCert, setNewCert] = useState('');
  
  const [newProj, setNewProj] = useState({ name: '', description: '', url: '' });
  const [newAch, setNewAch] = useState({ title: '', year: '', org: '' });

  // Security Auth check
  useEffect(() => {
    const authId = sessionStorage.getItem('iot_member_auth');
    if (!authId) {
      navigate('/admin-login');
      return;
    }
    setMemberId(authId);
    
    // Find member record
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
        setProfile(prev => ({ ...prev, photoBase64: reader.result as string, photoName: file.name, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, resumeBase64: reader.result as string, resumeName: file.name }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Item Helpers
  const addTechSkill = () => {
    if (!newSkillTech.trim()) return;
    setProfile(prev => ({ ...prev, skillsTech: [...(prev.skillsTech || []), newSkillTech.trim()] }));
    setNewSkillTech('');
  };
  const addSoftSkill = () => {
    if (!newSkillSoft.trim()) return;
    setProfile(prev => ({ ...prev, skillsSoft: [...(prev.skillsSoft || []), newSkillSoft.trim()] }));
    setNewSkillSoft('');
  };
  const addEdu = () => {
    if (!newEdu.trim()) return;
    setProfile(prev => ({ ...prev, education: [...(prev.education || []), newEdu.trim()] }));
    setNewEdu('');
  };
  const addCert = () => {
    if (!newCert.trim()) return;
    setProfile(prev => ({ ...prev, certifications: [...(prev.certifications || []), newCert.trim()] }));
    setNewCert('');
  };
  const addProjItem = () => {
    if (!newProj.name.trim()) return;
    setProfile(prev => ({ ...prev, projects: [...(prev.projects || []), { ...newProj }] }));
    setNewProj({ name: '', description: '', url: '' });
  };
  const addAchItem = () => {
    if (!newAch.title.trim()) return;
    setProfile(prev => ({ ...prev, achievements: [...(prev.achievements || []), { ...newAch }] }));
    setNewAch({ title: '', year: '', org: '' });
  };

  // Delete Helpers
  const removeTechSkill = (idx: number) => {
    setProfile(prev => ({ ...prev, skillsTech: (prev.skillsTech || []).filter((_, i) => i !== idx) }));
  };
  const removeSoftSkill = (idx: number) => {
    setProfile(prev => ({ ...prev, skillsSoft: (prev.skillsSoft || []).filter((_, i) => i !== idx) }));
  };
  const removeEdu = (idx: number) => {
    setProfile(prev => ({ ...prev, education: (prev.education || []).filter((_, i) => i !== idx) }));
  };
  const removeCert = (idx: number) => {
    setProfile(prev => ({ ...prev, certifications: (prev.certifications || []).filter((_, i) => i !== idx) }));
  };
  const removeProjItem = (idx: number) => {
    setProfile(prev => ({ ...prev, projects: (prev.projects || []).filter((_, i) => i !== idx) }));
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
      const res = await store.updateMemberProfile({ ...profile, id: memberId });
      if (res.status === 'success') {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(res.message || 'Failed to update profile.');
      }
    } catch(err) {
      setError('A database sync error occurred.');
    } finally {
      setLoading(false);
    }
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
      {/* Mini header */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #cbd5e1',
        padding: '12px 5%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={() => navigate('/')} 
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.82rem', borderRadius: '4px' }}
          >
            <ArrowLeft size={14} /> Back to Web
          </button>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>Personal Member Console</span>
        </div>
        <button 
          onClick={handleLogout} 
          className="btn-secondary"
          style={{ borderColor: '#fca5a5', color: '#dc2626', padding: '6px 12px', fontSize: '0.82rem', borderRadius: '4px' }}
        >
          <LogOut size={14} /> End Session
        </button>
      </header>

      {/* Main panel */}
      <main style={{ maxWidth: '1000px', width: '100%', margin: '20px auto', padding: '0 20px', flexGrow: 1 }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-white)', marginBottom: '4px' }}>Welcome, {profile.name}</h2>
        <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '20px' }}>
          Edit your directory values and cloud configurations here.
        </p>

        {success && (
          <div style={{ padding: '10px 14px', background: '#e6f4ea', border: '1px solid #34a853', color: '#137333', borderRadius: '4px', marginBottom: '15px', fontSize: '0.85rem' }}>
            Profile configurations successfully synchronised!
          </div>
        )}

        {error && (
          <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '4px', marginBottom: '15px', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
          
          {/* Card: Basic Info */}
          <div className="glass-panel card-top-blue" style={{ padding: '20px', background: '#ffffff', borderRadius: '6px' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-white)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}><User size={16} /> Basic Profile</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Name</label>
                <input type="text" required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} style={{ width: '100%', padding: '8px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Position Title</label>
                <input type="text" required value={profile.position} onChange={(e) => setProfile({ ...profile, position: e.target.value })} style={{ width: '100%', padding: '8px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Academic Year</label>
                <select value={profile.year} onChange={(e) => setProfile({ ...profile, year: e.target.value as any })} style={{ width: '100%', padding: '8px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }}>
                  <option value="SE">Second Year (SE)</option>
                  <option value="TE">Third Year (TE)</option>
                  <option value="BE">Final Year (BE)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Contact Phone</label>
                <input type="text" value={profile.socials?.phone || ''} onChange={(e) => setProfile({ ...profile, socials: { ...(profile.socials || {}), phone: e.target.value } })} style={{ width: '100%', padding: '8px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Biography Summary</label>
              <textarea rows={3} required value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} style={{ width: '100%', padding: '8px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)', resize: 'none' }} />
            </div>
          </div>

          {/* Card: Uploads */}
          <div className="glass-panel" style={{ padding: '20px', background: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-white)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}><Upload size={16} /> Image & Resume Upload</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} className="grid-2">
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '6px' }}>Profile Photo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <Upload size={12} /> Select Photo
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  </label>
                  {profile.photoBase64 && <span style={{ fontSize: '0.72rem', color: 'var(--gdg-green)' }}>Photo selected</span>}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '6px' }}>Resume PDF</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <FileText size={12} /> Select PDF
                    <input type="file" accept=".pdf,.txt" onChange={handleResumeUpload} style={{ display: 'none' }} />
                  </label>
                  {profile.resumeName && <span style={{ fontSize: '0.72rem', color: 'var(--gdg-green)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.resumeName}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Card: Social Portals */}
          <div className="glass-panel card-top-green" style={{ padding: '20px', background: '#ffffff', borderRadius: '6px' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-white)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}><Globe size={16} /> Online Portals</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>LinkedIn Link</label>
                <input type="url" value={profile.socials?.linkedin || ''} onChange={(e) => setProfile({ ...profile, socials: { ...(profile.socials || {}), linkedin: e.target.value } })} style={{ width: '100%', padding: '8px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>GitHub Link</label>
                <input type="url" value={profile.socials?.github || ''} onChange={(e) => setProfile({ ...profile, socials: { ...(profile.socials || {}), github: e.target.value } })} style={{ width: '100%', padding: '8px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
              </div>
            </div>
          </div>

          {/* Card: Skills Collector */}
          <div className="glass-panel" style={{ padding: '20px', background: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-white)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}><Briefcase size={16} /> Skills Stack</h3>
            
            {/* Tech Skills */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Technical Skills</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input type="text" placeholder="e.g. FreeRTOS" value={newSkillTech} onChange={(e) => setNewSkillTech(e.target.value)} style={{ flexGrow: 1, padding: '8px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                <button type="button" onClick={addTechSkill} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '4px' }}><Plus size={14} /></button>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {(profile.skillsTech || []).map((skill, idx) => (
                  <span key={idx} style={{ fontSize: '0.75rem', padding: '3px 8px', background: 'var(--primary-glow)', border: '1px solid rgba(26,115,232,0.15)', color: 'var(--primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {skill} <Trash2 size={10} style={{ cursor: 'pointer', color: '#dc2626' }} onClick={() => removeTechSkill(idx)} />
                  </span>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Professional/Soft Skills</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input type="text" placeholder="e.g. Agile Scrum" value={newSkillSoft} onChange={(e) => setNewSkillSoft(e.target.value)} style={{ flexGrow: 1, padding: '8px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                <button type="button" onClick={addSoftSkill} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '4px' }}><Plus size={14} /></button>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {(profile.skillsSoft || []).map((skill, idx) => (
                  <span key={idx} style={{ fontSize: '0.75rem', padding: '3px 8px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: 'var(--text-light)', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {skill} <Trash2 size={10} style={{ cursor: 'pointer', color: '#dc2626' }} onClick={() => removeSoftSkill(idx)} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card: Education & Certifications */}
          <div className="glass-panel" style={{ padding: '20px', background: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-white)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}><GraduationCap size={16} /> Education & Certs</h3>
            
            {/* Education */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Education Milestones</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input type="text" placeholder="e.g. B.E. in Electronics, Univ of Tech (2023 - 2027)" value={newEdu} onChange={(e) => setNewEdu(e.target.value)} style={{ flexGrow: 1, padding: '8px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                <button type="button" onClick={addEdu} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '4px' }}><Plus size={14} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(profile.education || []).map((edu, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f8fafc', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}>
                    <span>{edu}</span>
                    <Trash2 size={12} style={{ cursor: 'pointer', color: '#dc2626', marginTop: '2px' }} onClick={() => removeEdu(idx)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Certifications</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input type="text" placeholder="e.g. AWS IoT Core Practitioner" value={newCert} onChange={(e) => setNewCert(e.target.value)} style={{ flexGrow: 1, padding: '8px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                <button type="button" onClick={addCert} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '4px' }}><Plus size={14} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(profile.certifications || []).map((cert, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f8fafc', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}>
                    <span>{cert}</span>
                    <Trash2 size={12} style={{ cursor: 'pointer', color: '#dc2626', marginTop: '2px' }} onClick={() => removeCert(idx)} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card: Portfolio Projects */}
          <div className="glass-panel card-top-yellow" style={{ padding: '20px', background: '#ffffff', borderRadius: '6px' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-white)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}><Plus size={16} /> Personal Projects</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '8px' }}>
              <input type="text" placeholder="Project Name" value={newProj.name} onChange={(e) => setNewProj({ ...newProj, name: e.target.value })} style={{ padding: '8px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
              <input type="text" placeholder="GitHub Repository URL" value={newProj.url} onChange={(e) => setNewProj({ ...newProj, url: e.target.value })} style={{ padding: '8px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input type="text" placeholder="Brief project summary description..." value={newProj.description} onChange={(e) => setNewProj({ ...newProj, description: e.target.value })} style={{ flexGrow: 1, padding: '8px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
              <button type="button" onClick={addProjItem} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '4px' }}><Plus size={14} /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(profile.projects || []).map((proj, idx) => (
                <div key={idx} style={{ padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <strong style={{ color: 'var(--text-white)' }}>{proj.name}</strong>
                    <p style={{ color: 'var(--text-light)', marginTop: '2px' }}>{proj.description}</p>
                    {proj.url && <span style={{ fontSize: '0.72rem', color: 'var(--primary)' }}>{proj.url}</span>}
                  </div>
                  <Trash2 size={12} style={{ cursor: 'pointer', color: '#dc2626' }} onClick={() => removeProjItem(idx)} />
                </div>
              ))}
            </div>
          </div>

          {/* Card: Achievements */}
          <div className="glass-panel card-top-red" style={{ padding: '20px', background: '#ffffff', borderRadius: '6px' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-white)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}><Award size={16} /> Personal Achievements</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <input type="text" placeholder="Award Title (e.g. Hackfest Winner)" value={newAch.title} onChange={(e) => setNewAch({ ...newAch, title: e.target.value })} style={{ padding: '8px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
              <input type="text" placeholder="Organization / Event" value={newAch.org} onChange={(e) => setNewAch({ ...newAch, org: e.target.value })} style={{ padding: '8px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" placeholder="Year" value={newAch.year} onChange={(e) => setNewAch({ ...newAch, year: e.target.value })} style={{ flexGrow: 1, padding: '8px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)' }} />
                <button type="button" onClick={addAchItem} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '4px' }}><Plus size={14} /></button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(profile.achievements || []).map((ach, idx) => (
                <div key={idx} style={{ padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: 'var(--text-white)' }}>{ach.title}</strong>
                    <span style={{ color: 'var(--text-light)', marginLeft: '8px' }}>{ach.org} ({ach.year})</span>
                  </div>
                  <Trash2 size={12} style={{ cursor: 'pointer', color: '#dc2626' }} onClick={() => removeAchItem(idx)} />
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary" 
            style={{ padding: '12px 0', width: '100%', justifyContent: 'center', gap: '8px', fontSize: '0.92rem', borderRadius: '4px' }}
          >
            <Save size={16} /> {loading ? 'Saving Profile Updates...' : 'Synchronize Profile Info'}
          </button>

        </form>
      </main>
    </div>
  );
};
