import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  GraduationCap, Mail, Lock, User, Image, 
  ArrowLeft, ArrowRight, CheckCircle2, Database, X
} from 'lucide-react';
import { useIoTStore } from '../data/store';

// Curated avatars for quick student selection
const PRESET_AVATARS = [
  '/photoes/IMG-20241215-WA0024.jpg',
  '/photoes/IMG-20241215-WA0077.jpg',
  '/photoes/IMG-20260222-WA0049.jpg',
  '/photoes/Techathon%203.0%20best%20project%20award.jpg',
  '/photoes/Innovation%202k25%201.jpeg',
  '/photoes/Innovation%202k25%20Runner%20Up.jpeg',
];

const POPULAR_SKILLS = [
  'Arduino', 'ESP32-S3', 'Raspberry Pi', 'Python', 'Embedded C++', 
  'FreeRTOS', 'MQTT', 'Edge AI', 'Robotics', 'LoRaWAN', 'PCB Design', 'Computer Vision'
];

export const MemberSignUp: React.FC = () => {
  const navigate = useNavigate();
  const { memberSignUp, isGoogleSheetsConfigured } = useIoTStore();
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    year: 'SE' as 'SE' | 'TE' | 'BE',
    position: 'Member Developer',
    photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
    bio: '',
    linkedin: '',
    github: ''
  });

  const [skillsList, setSkillsList] = useState<string[]>(['Embedded Systems', 'IoT Prototyping']);
  const [skillInput, setSkillInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdMemberId, setCreatedMemberId] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (skillsList.length === 0) {
      setError('Please add at least one technical skill or hardware interest.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        skills: skillsList,
        skillsTech: skillsList
      };

      const res = await memberSignUp(payload);
      if (res.status === 'success' && res.memberId) {
        setCreatedMemberId(res.memberId);
        setSuccess(true);
        // Automatically save session
        sessionStorage.setItem('iot_member_auth', res.memberId);
        setTimeout(() => {
          navigate('/member-dashboard');
        }, 2200);
      } else {
        setError(res.message || 'Registration failed. Please check your data.');
      }
    } catch(err) {
      setError('A database routing error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      zIndex: 2,
      overflow: 'hidden'
    }}>
      {/* Ambient background glows */}
      <div className="ambient-glow-cyan" style={{ top: '-100px', left: '-100px' }} />
      <div className="ambient-glow-purple" style={{ bottom: '-100px', right: '-100px' }} />

      <div 
        className="glass-panel card-top-blue"
        style={{
          width: '100%',
          maxWidth: '580px',
          padding: '36px 32px',
          borderRadius: '16px',
          position: 'relative',
          zIndex: 3
        }}
      >
        {/* Navigation & Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button 
            onClick={() => navigate('/')} 
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '6px' }}
          >
            <ArrowLeft size={14} /> Back to Web
          </button>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            background: 'rgba(0, 245, 160, 0.08)',
            border: '1px solid rgba(0, 245, 160, 0.25)',
            borderRadius: '20px',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--neon-emerald)'
          }}>
            <Database size={11} />
            {isGoogleSheetsConfigured ? 'Sheets Database Linked' : 'Active Local Directory'}
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <div style={{
            background: 'rgba(0, 242, 254, 0.12)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.25)',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--neon-cyan)',
            margin: '0 auto 14px auto',
          }}>
            <GraduationCap size={28} />
          </div>
          <h2 style={{
            fontSize: '1.65rem',
            color: 'var(--text-white)',
            marginBottom: '6px',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700
          }}>
            Student Onboarding & Registration
          </h2>
          <p style={{ color: 'var(--text-light)', fontSize: '0.88rem' }}>
            Register your developer profile to appear in the official chapter directory.
          </p>
        </div>

        {/* Success Modal Notification */}
        {success && (
          <div style={{
            padding: '16px',
            background: 'rgba(0, 245, 160, 0.12)',
            border: '1px solid rgba(0, 245, 160, 0.4)',
            borderRadius: '10px',
            color: '#a7f3d0',
            fontSize: '0.9rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <CheckCircle2 size={24} style={{ color: 'var(--neon-emerald)', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, color: '#ffffff' }}>Account Successfully Created!</div>
              <div style={{ fontSize: '0.82rem', marginTop: '2px' }}>
                {createdMemberId && `ID: ${createdMemberId} · `}Redirecting to your student management console...
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div style={{
            padding: '12px 14px',
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            color: '#fb7185',
            fontSize: '0.85rem',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Row 1: Full Name & Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }} className="grid-responsive-2">
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '6px', fontWeight: 500 }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--neon-cyan)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
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

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '6px', fontWeight: 500 }}>
                Email Address *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--neon-cyan)' }} />
                <input
                  type="email"
                  required
                  placeholder="alex@university.edu"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
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
          </div>

          {/* Row 2: Password & Academic Year */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }} className="grid-responsive-2">
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '6px', fontWeight: 500 }}>
                Account Password *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--neon-cyan)' }} />
                <input
                  type="password"
                  required
                  placeholder="Choose a password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
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

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '6px', fontWeight: 500 }}>
                Department / Academic Year *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {(['SE', 'TE', 'BE'] as const).map(yr => {
                  const isSelected = form.year === yr;
                  const label = yr === 'SE' ? 'SE (2nd Yr)' : yr === 'TE' ? 'TE (3rd Yr)' : 'BE (Final)';
                  return (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setForm({ ...form, year: yr })}
                      style={{
                        padding: '10px 4px',
                        borderRadius: '8px',
                        border: isSelected ? '1px solid var(--neon-cyan)' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: isSelected ? 'rgba(0, 242, 254, 0.18)' : 'rgba(13, 19, 38, 0.8)',
                        color: isSelected ? 'var(--neon-cyan)' : 'var(--text-gray)',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        boxShadow: isSelected ? '0 0 12px rgba(0, 242, 254, 0.35)' : 'none',
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 3: Profile/Avatar Image Link with Live Preview */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '6px', fontWeight: 500 }}>
              Profile / Avatar Image Link (URL) *
            </label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {/* Preview Avatar Image */}
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid var(--neon-cyan)',
                boxShadow: '0 0 12px rgba(0, 242, 254, 0.3)',
                flexShrink: 0,
                background: '#0d142b'
              }}>
                <img 
                  src={form.photo} 
                  alt="Avatar Preview" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PRESET_AVATARS[0];
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>

              {/* URL Input */}
              <div style={{ position: 'relative', flexGrow: 1 }}>
                <Image size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--neon-cyan)' }} />
                <input
                  type="url"
                  required
                  placeholder="https://example.com/avatar.jpg"
                  value={form.photo}
                  onChange={(e) => setForm({ ...form, photo: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    background: 'rgba(13, 19, 38, 0.8)',
                    border: '1px solid rgba(0, 242, 254, 0.25)',
                    borderRadius: '8px',
                    color: 'var(--text-white)',
                    outline: 'none',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-main)'
                  }}
                  className="cyber-input"
                />
              </div>
            </div>

            {/* Quick Preset Avatars Picker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Or choose preset avatar:</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {PRESET_AVATARS.map((preset, idx) => (
                  <img
                    key={idx}
                    src={preset}
                    alt={`Preset ${idx + 1}`}
                    onClick={() => setForm({ ...form, photo: preset })}
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: form.photo === preset ? '2px solid var(--neon-cyan)' : '1px solid rgba(255,255,255,0.2)',
                      boxShadow: form.photo === preset ? '0 0 8px var(--neon-cyan)' : 'none',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Technical Skills */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '6px', fontWeight: 500 }}>
              Technical Skills & Hardware Domains *
            </label>
            
            {/* Active Skills Badges */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              padding: '8px 10px',
              background: 'rgba(13, 19, 38, 0.8)',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              borderRadius: '8px',
              minHeight: '44px',
              marginBottom: '8px'
            }}>
              {skillsList.map((skill) => (
                <span
                  key={skill}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    background: 'rgba(0, 242, 254, 0.15)',
                    border: '1px solid rgba(0, 242, 254, 0.35)',
                    borderRadius: '4px',
                    color: 'var(--neon-cyan)',
                    fontSize: '0.76rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {skill}
                  <X 
                    size={12} 
                    onClick={() => removeSkill(skill)} 
                    style={{ cursor: 'pointer', color: 'var(--text-light)' }} 
                  />
                </span>
              ))}

              <input
                type="text"
                placeholder={skillsList.length === 0 ? "Type skill and press Enter..." : "Add skill..."}
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDownSkill}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-white)',
                  outline: 'none',
                  fontSize: '0.82rem',
                  flexGrow: 1,
                  minWidth: '100px'
                }}
              />
            </div>

            {/* Quick-add popular skills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginRight: '4px' }}>Quick Add:</span>
              {POPULAR_SKILLS.filter(s => !skillsList.includes(s)).slice(0, 6).map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSkill(skill)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '4px',
                    color: 'var(--text-gray)',
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                  className="quick-skill-btn"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Row 5: Position & Bio Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '6px', fontWeight: 500 }}>
                Short Bio / Engineering Focus
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Passionate about firmware architectures, robotics actuators, and FreeRTOS concurrency."
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '13px',
              fontSize: '1rem',
              borderRadius: '8px',
              marginTop: '10px'
            }}
          >
            {loading ? 'Publishing Student Record...' : (
              <>Register & Publish to Directory <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
          <p style={{ color: 'var(--text-gray)', fontSize: '0.86rem' }}>
            Already registered as a member?{' '}
            <Link to="/login" style={{ color: 'var(--neon-cyan)', fontWeight: 600, textDecoration: 'none' }}>
              Student Sign In
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        .cyber-input:focus {
          border-color: var(--neon-cyan) !important;
          box-shadow: 0 0 15px rgba(0, 242, 254, 0.3) !important;
        }
        .quick-skill-btn:hover {
          background: rgba(0, 242, 254, 0.15) !important;
          border-color: var(--neon-cyan) !important;
          color: var(--neon-cyan) !important;
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
