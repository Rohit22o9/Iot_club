import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, CheckCircle2, ShieldCheck, Cpu, 
  UserCheck, Lock, Upload,
  AlertCircle, Eye, EyeOff
} from 'lucide-react';
import { Github, Linkedin } from '../components/BrandIcons';
import { useIoTStore } from '../data/store';

const PRESET_AVATARS = [
  '/photoes/IMG-20241215-WA0024.jpg',
  '/photoes/IMG-20241215-WA0077.jpg',
  '/photoes/IMG-20260222-WA0049.jpg',
  '/photoes/Techathon%203.0%20best%20project%20award.jpg',
  '/photoes/Innovation%202k25%201.jpeg',
  '/photoes/Innovation%202k25%20Runner%20Up.jpeg',
];

const SUGGESTED_SKILLS = [
  'ESP32-S3', 'Arduino', 'Raspberry Pi', 'Embedded C++', 'Python',
  'MQTT', 'LoRaWAN', 'FreeRTOS', 'Edge AI', 'PCB Design', 'KiCAD', 'Computer Vision'
];

export const ProfileCompletion: React.FC = () => {
  const navigate = useNavigate();
  const store = useIoTStore();
  
  const [memberId, setMemberId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    year: 'SE' as 'SE' | 'TE' | 'BE',
    department: 'Electronics & Telecommunication',
    position: 'Junior IoT Developer',
    photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
    bio: '',
    github: '',
    linkedin: '',
    portfolio: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [skillsList, setSkillsList] = useState<string[]>(['Embedded Systems', 'IoT Prototyping']);
  const [skillInput, setSkillInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Authentication check
  useEffect(() => {
    const authId = sessionStorage.getItem('iot_member_auth');
    if (!authId) {
      navigate('/login');
      return;
    }
    setMemberId(authId);

    const currentMember = store.members.find(m => m.id === authId);
    if (currentMember) {
      setForm(prev => ({
        ...prev,
        name: currentMember.name || prev.name,
        email: currentMember.email || prev.email,
        year: currentMember.year || 'SE',
        department: currentMember.department || prev.department,
        position: currentMember.position || prev.position,
        photo: currentMember.photo || prev.photo,
        bio: currentMember.bio || '',
        github: currentMember.socials?.github || '',
        linkedin: currentMember.socials?.linkedin || '',
        portfolio: currentMember.socials?.portfolio || ''
      }));

      if (currentMember.skills && currentMember.skills.length > 0) {
        setSkillsList(currentMember.skills);
      }
    }
  }, [store.members, navigate]);

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skillsList.includes(trimmed)) {
      setSkillsList([...skillsList, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter(s => s !== skillToRemove));
  };

  const handleKeyDownSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (skillsList.length === 0) {
      setError('Please add at least one technical skill to showcase on your profile.');
      return;
    }

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError('New password and confirmation password do not match.');
      return;
    }

    if (!memberId) {
      setError('Session expired. Please log in again.');
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        id: memberId,
        name: form.name,
        email: form.email,
        year: form.year,
        department: form.department,
        position: form.position,
        photo: form.photo,
        bio: form.bio || `Specializing in ${form.department} with a focus on IoT hardware solutions.`,
        skills: skillsList,
        skillsTech: skillsList,
        isFirstLogin: false,
        profileCompleted: true,
        socials: {
          github: form.github,
          linkedin: form.linkedin,
          portfolio: form.portfolio,
          email: form.email
        }
      };

      if (form.newPassword && form.newPassword.trim()) {
        payload.newPassword = form.newPassword.trim();
        payload.password = form.newPassword.trim();
      }

      const res = await store.updateMemberProfile(payload);
      if (res.status === 'success') {
        setSuccess(true);
        setTimeout(() => {
          // Redirect to their respective year directory
          navigate(`/members/${form.year.toLowerCase()}`);
        }, 1800);
      } else {
        setError(res.message || 'Failed to update profile. Please try again.');
      }
    } catch (err: any) {
      setError('An error occurred while saving your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Dynamic theme colors for live preview
  const yearTheme = {
    SE: { name: 'Second Year (SE)', color: 'var(--neon-cyan)', bg: 'rgba(0, 242, 254, 0.08)', border: 'rgba(0, 242, 254, 0.3)' },
    TE: { name: 'Third Year (TE)', color: 'var(--neon-purple)', bg: 'rgba(168, 85, 247, 0.08)', border: 'rgba(168, 85, 247, 0.3)' },
    BE: { name: 'Final Year (BE)', color: 'var(--neon-emerald)', bg: 'rgba(0, 245, 160, 0.08)', border: 'rgba(0, 245, 160, 0.3)' }
  }[form.year];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-dark)',
      padding: '40px 20px',
      position: 'relative',
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Background Ambient Glows */}
      <div className="ambient-glow-cyan" style={{ top: '-120px', left: '-120px' }} />
      <div className="ambient-glow-purple" style={{ bottom: '-120px', right: '-120px' }} />

      {/* Main Container */}
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        
        {/* Onboarding Header */}
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            background: 'rgba(0, 242, 254, 0.1)',
            border: '1px solid rgba(0, 242, 254, 0.35)',
            borderRadius: '30px',
            color: 'var(--neon-cyan)',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-mono)',
            marginBottom: '14px',
            boxShadow: '0 0 15px rgba(0, 242, 254, 0.2)'
          }}>
            <Sparkles size={14} /> MANDATORY ONBOARDING PROTOCOL
          </div>

          <h1 style={{
            fontSize: '2.2rem',
            color: 'var(--text-white)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            marginBottom: '10px'
          }}>
            Welcome to IoT Club, <span className="neon-text-cyan">{form.name || 'Engineer'}</span>!
          </h1>
          <p style={{
            color: 'var(--text-light)',
            fontSize: '0.98rem',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Your account was provisioned via email. Complete your technical profile below to activate your member badge and automatically publish your card to the official chapter directory.
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div style={{
            background: 'rgba(0, 245, 160, 0.12)',
            border: '1px solid rgba(0, 245, 160, 0.45)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            color: '#ffffff',
            boxShadow: '0 0 25px rgba(0, 245, 160, 0.2)'
          }}>
            <CheckCircle2 size={30} style={{ color: 'var(--neon-emerald)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Profile Successfully Activated!</div>
              <div style={{ fontSize: '0.9rem', color: '#a7f3d0', marginTop: '4px' }}>
                Your card has been published to the <strong>{form.year} Section</strong>. Redirecting you to the live directory...
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            borderRadius: '10px',
            padding: '14px 18px',
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#fb7185',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <div>{error}</div>
          </div>
        )}

        {/* Two-Column Grid: Form + Live Directory Preview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.3fr 0.9fr',
          gap: '30px',
          alignItems: 'start'
        }} className="profile-completion-grid">
          
          {/* Column 1: Form */}
          <form onSubmit={handleSubmit} className="glass-panel" style={{
            padding: '32px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            
            {/* Step 1: Academic Cohort & Year */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{
                  background: 'var(--neon-cyan)',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>1</span>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-white)', fontWeight: 600 }}>Academic Year & Cohort</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                {(['SE', 'TE', 'BE'] as const).map(yr => {
                  const isSelected = form.year === yr;
                  const label = yr === 'SE' ? 'Second Year (SE)' : yr === 'TE' ? 'Third Year (TE)' : 'Final Year (BE)';
                  return (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, year: yr }))}
                      style={{
                        padding: '14px 10px',
                        borderRadius: '10px',
                        border: isSelected ? '1px solid var(--neon-cyan)' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: isSelected ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        color: isSelected ? '#ffffff' : 'var(--text-light)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                        boxShadow: isSelected ? '0 0 15px rgba(0, 242, 254, 0.2)' : 'none'
                      }}
                    >
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: isSelected ? 'var(--neon-cyan)' : 'var(--text-white)' }}>{yr}</div>
                      <div style={{ fontSize: '0.72rem', marginTop: '4px' }}>{label}</div>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="cyber-label">Department / Branch</label>
                  <input
                    type="text"
                    className="cyber-input"
                    value={form.department}
                    onChange={e => setForm(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="e.g. E&TC, Computer Engineering"
                    required
                  />
                </div>
                <div>
                  <label className="cyber-label">Club Position / Role</label>
                  <input
                    type="text"
                    className="cyber-input"
                    value={form.position}
                    onChange={e => setForm(prev => ({ ...prev, position: e.target.value }))}
                    placeholder="e.g. Embedded Developer, IoT Core"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Technical Skills & Hardware Stack */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{
                  background: 'var(--neon-cyan)',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>2</span>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-white)', fontWeight: 600 }}>Technical Skills & Hardware Stack</h3>
              </div>

              {/* Input for adding new skills */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <input
                  type="text"
                  className="cyber-input"
                  placeholder="Type a skill and press Enter (e.g. ESP32, MQTT)..."
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={handleKeyDownSkill}
                />
                <button
                  type="button"
                  onClick={() => addSkill(skillInput)}
                  className="btn-primary"
                  style={{ padding: '0 18px', whiteSpace: 'nowrap' }}
                >
                  Add
                </button>
              </div>

              {/* Active Skill Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                {skillsList.map(skill => (
                  <span
                    key={skill}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '5px 12px',
                      background: 'rgba(0, 242, 254, 0.1)',
                      border: '1px solid rgba(0, 242, 254, 0.3)',
                      borderRadius: '20px',
                      color: 'var(--neon-cyan)',
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.6)',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '0.85rem'
                      }}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              {/* Quick Preset Skill Suggestions */}
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginBottom: '6px' }}>
                  Quick add common technologies:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {SUGGESTED_SKILLS.filter(s => !skillsList.includes(s)).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addSkill(s)}
                      style={{
                        padding: '3px 8px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        color: 'var(--text-light)',
                        fontSize: '0.72rem',
                        cursor: 'pointer'
                      }}
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Avatar & Bio */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{
                  background: 'var(--neon-cyan)',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>3</span>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-white)', fontWeight: 600 }}>Profile Avatar & Bio</h3>
              </div>

              {/* Avatar Picker */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <img
                  src={form.photo}
                  alt={form.name}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--neon-cyan)',
                    boxShadow: '0 0 15px rgba(0, 242, 254, 0.3)'
                  }}
                />
                <div style={{ flexGrow: 1 }}>
                  <label className="cyber-label">Avatar Image URL or Upload</label>
                  <input
                    type="text"
                    className="cyber-input"
                    value={form.photo}
                    onChange={e => setForm(prev => ({ ...prev, photo: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                  />
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <label style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      color: 'var(--text-light)',
                      cursor: 'pointer'
                    }}>
                      <Upload size={12} /> Upload File
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                    </label>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>or choose preset:</span>
                    {PRESET_AVATARS.slice(0, 4).map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, photo: p }))}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          border: form.photo === p ? '2px solid var(--neon-cyan)' : '1px solid rgba(255,255,255,0.2)',
                          padding: 0,
                          overflow: 'hidden',
                          cursor: 'pointer'
                        }}
                      >
                        <img src={p} alt="Preset" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="cyber-label">About / Technical Bio</label>
                <textarea
                  className="cyber-input"
                  rows={3}
                  value={form.bio}
                  onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Share a short summary of your IoT projects, interests, and engineering goals..."
                />
              </div>
            </div>

            {/* Step 4: Social & Developer Links */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{
                  background: 'var(--neon-cyan)',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>4</span>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-white)', fontWeight: 600 }}>Developer & Social Links</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="cyber-label">GitHub Profile</label>
                  <input
                    type="text"
                    className="cyber-input"
                    value={form.github}
                    onChange={e => setForm(prev => ({ ...prev, github: e.target.value }))}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <label className="cyber-label">LinkedIn Profile</label>
                  <input
                    type="text"
                    className="cyber-input"
                    value={form.linkedin}
                    onChange={e => setForm(prev => ({ ...prev, linkedin: e.target.value }))}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
            </div>

            {/* Step 5: Update Temporary Password (Optional) */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '28px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Lock size={15} style={{ color: 'var(--neon-cyan)' }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-white)', fontWeight: 600 }}>
                  Set Permanent Password (Optional)
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '12px' }}>
                You logged in with a temporary password sent via email. Set a personal password now if desired.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="cyber-input"
                    placeholder="New Password"
                    value={form.newPassword}
                    onChange={e => setForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  />
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="cyber-input"
                    placeholder="Confirm New Password"
                    value={form.confirmPassword}
                    onChange={e => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-light)',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '1rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              {loading ? (
                <span>Syncing Profile to Database...</span>
              ) : (
                <>
                  <UserCheck size={18} /> Activate Profile & Publish to Directory
                </>
              )}
            </button>
          </form>

          {/* Column 2: Live Preview Card */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px'
            }}>
              <span style={{
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                color: yearTheme.color,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Cpu size={13} /> LIVE DIRECTORY CARD PREVIEW
              </span>
              <span style={{
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: '10px',
                background: yearTheme.bg,
                border: `1px solid ${yearTheme.border}`,
                color: yearTheme.color
              }}>
                {yearTheme.name}
              </span>
            </div>

            {/* Member Directory Card Preview */}
            <div className="glass-panel" style={{
              borderRadius: '16px',
              padding: '24px',
              border: `1px solid ${yearTheme.border}`,
              boxShadow: `0 8px 32px ${yearTheme.bg}`,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Year Color Accent Line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: yearTheme.color
              }} />

              {/* Avatar and Main Info */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '18px' }}>
                <img
                  src={form.photo}
                  alt={form.name}
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `2px solid ${yearTheme.color}`,
                    boxShadow: `0 0 15px ${yearTheme.bg}`
                  }}
                />
                <div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    color: '#ffffff',
                    fontWeight: 700,
                    marginBottom: '4px'
                  }}>
                    {form.name || 'Your Full Name'}
                  </h3>
                  <div style={{
                    fontSize: '0.85rem',
                    color: yearTheme.color,
                    fontWeight: 500
                  }}>
                    {form.position || 'Student Developer'}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-light)',
                    marginTop: '2px'
                  }}>
                    {form.department} &bull; {form.year} Cohort
                  </div>
                </div>
              </div>

              {/* Bio Preview */}
              <p style={{
                fontSize: '0.84rem',
                color: 'var(--text-light)',
                lineHeight: 1.5,
                marginBottom: '18px',
                minHeight: '38px'
              }}>
                {form.bio || 'Technical summary and engineering interests will appear here in the chapter directory.'}
              </p>

              {/* Skills Tags */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Technical Specialties
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {skillsList.map(skill => (
                    <span
                      key={skill}
                      style={{
                        padding: '3px 8px',
                        background: yearTheme.bg,
                        border: `1px solid ${yearTheme.border}`,
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        color: yearTheme.color,
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div style={{
                display: 'flex',
                gap: '10px',
                paddingTop: '14px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                {form.github && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--text-white)' }}>
                    <Github size={14} /> GitHub
                  </span>
                )}
                {form.linkedin && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--neon-cyan)' }}>
                    <Linkedin size={14} /> LinkedIn
                  </span>
                )}
                {!form.github && !form.linkedin && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                    Developer social links configured above
                  </span>
                )}
              </div>
            </div>

            {/* Directory Note */}
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '8px',
              fontSize: '0.78rem',
              color: 'var(--text-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ShieldCheck size={16} style={{ color: 'var(--neon-emerald)', flexShrink: 0 }} />
              <div>
                Upon saving, this card will appear under <strong>Directory &gt; {form.year} Section</strong>.
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .profile-completion-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
