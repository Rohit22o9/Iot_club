import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, Briefcase, ArrowLeft } from 'lucide-react';
import { useIoTStore } from '../data/store';

export const MemberSignUp: React.FC = () => {
  const navigate = useNavigate();
  const { memberSignUp } = useIoTStore();
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    year: 'SE',
    position: 'Member',
    bio: '',
    linkedin: '',
    github: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await memberSignUp(form);
      if (res.status === 'success') {
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin-login');
        }, 2500);
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch(err) {
      setError('A database routing error occurred.');
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
      zIndex: 2
    }}>
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '30px 25px',
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          boxShadow: 'var(--card-shadow-hover)',
          textAlign: 'center'
        }}
      >
        {/* Cap Badge */}
        <div style={{
          background: 'var(--primary-glow)',
          border: '1px solid rgba(26, 115, 232, 0.15)',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          margin: '0 auto 15px auto',
        }}>
          <GraduationCap size={28} />
        </div>

        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-white)', marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>Student Roster Registration</h2>
        <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '20px' }}>
          Create your developer branch profile.
        </p>

        {error && (
          <div style={{
            padding: '10px 12px',
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            color: '#dc2626',
            fontSize: '0.82rem',
            borderRadius: '6px',
            marginBottom: '15px',
            textAlign: 'left'
          }}>
            {error}
          </div>
        )}

        {success ? (
          <div style={{
            padding: '20px',
            background: '#e6f4ea',
            border: '1px solid #34a853',
            color: '#137333',
            fontSize: '0.9rem',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <strong>Registration successful!</strong><br />
            Redirecting to the login interface...
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
            
            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Amit Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px 8px 36px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)', outline: 'none', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Email & Passcode */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Institutional Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="email"
                    required
                    placeholder="student@univ.edu"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px 8px 36px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)', outline: 'none', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px 8px 36px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)', outline: 'none', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Year & Position */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Academic Year</label>
                <select
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)', outline: 'none', fontSize: '0.85rem' }}
                >
                  <option value="SE">Second Year (SE)</option>
                  <option value="TE">Third Year (TE)</option>
                  <option value="BE">Final Year (BE)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Position / Role</label>
                <div style={{ position: 'relative' }}>
                  <Briefcase size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Firmware Writer"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px 8px 36px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)', outline: 'none', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Brief Bio */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Biography Summary</label>
              <textarea
                rows={2}
                required
                placeholder="Briefly describe your hardware interests and engineering focus..."
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)', outline: 'none', fontSize: '0.85rem', resize: 'none' }}
              />
            </div>

            {/* Social profiles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>LinkedIn URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={form.linkedin}
                  onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)', outline: 'none', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>GitHub URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={form.github}
                  onChange={(e) => setForm({ ...form, github: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)', outline: 'none', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '10px 0', marginTop: '10px', borderRadius: '4px' }}
            >
              {loading ? 'Creating Profile...' : 'Sign Up Profile'}
            </button>
          </form>
        )}

        <div style={{ marginTop: '20px', borderTop: '1px solid #e5e7eb', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
          <Link to="/" style={{ color: 'var(--text-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={12} /> Back to Web
          </Link>
          <Link to="/admin-login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
            Already registered? Log In
          </Link>
        </div>
      </div>
    </div>
  );
};
