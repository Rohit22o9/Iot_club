import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Database } from 'lucide-react';
import { useIoTStore } from '../data/store';

export const StudentLogin: React.FC = () => {
  const navigate = useNavigate();
  const { memberLogin, isGoogleSheetsConfigured } = useIoTStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    // If already authenticated as student, navigate straight to member dashboard
    const authId = sessionStorage.getItem('iot_member_auth');
    if (authId) {
      navigate('/member-dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await memberLogin({ email, password });
      if (res.status === 'success' && res.memberId) {
        sessionStorage.setItem('iot_member_auth', res.memberId);
        if (res.isFirstLogin || res.profileCompleted === false) {
          navigate('/complete-profile');
        } else {
          navigate('/member-dashboard');
        }
      } else {
        setError(res.message || 'Invalid email address or password.');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      }
    } catch (err) {
      setError('Connection timeout. Please check your network or database link.');
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
        className={`glass-panel card-top-blue ${isShaking ? 'shake-animation' : ''}`}
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '36px 30px',
          borderRadius: '16px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 3
        }}
      >
        {/* Back Link */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
          <button 
            onClick={() => navigate('/')} 
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '6px' }}
          >
            <ArrowLeft size={14} /> Back to Home
          </button>
        </div>

        {/* Icon Emblem */}
        <div style={{
          background: 'rgba(0, 242, 254, 0.12)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          boxShadow: '0 0 20px rgba(0, 242, 254, 0.25)',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--neon-cyan)',
          margin: '0 auto 16px auto',
        }}>
          <GraduationCap size={30} />
        </div>

        <h2 style={{
          fontSize: '1.6rem',
          color: 'var(--text-white)',
          marginBottom: '6px',
          fontFamily: 'var(--font-heading)',
          fontWeight: 700
        }}>
          Student Member Login
        </h2>
        <p style={{ color: 'var(--text-light)', fontSize: '0.88rem', marginBottom: '22px' }}>
          Access your IoT developer profile and directory dashboard.
        </p>

        {/* Database backend badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          background: 'rgba(0, 245, 160, 0.08)',
          border: '1px solid rgba(0, 245, 160, 0.25)',
          borderRadius: '20px',
          fontSize: '0.74rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--neon-emerald)',
          marginBottom: '20px'
        }}>
          <Database size={12} />
          {isGoogleSheetsConfigured ? 'Google Sheets Database Active' : 'Cloud & Local Database Sync'}
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            color: '#fb7185',
            fontSize: '0.84rem',
            borderRadius: '8px',
            marginBottom: '18px',
            textAlign: 'left'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Email */}
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '6px', fontWeight: 500 }}>
              Registered Student Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--neon-cyan)' }} />
              <input
                type="email"
                required
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px 11px 38px',
                  background: 'rgba(13, 19, 38, 0.8)',
                  border: '1px solid rgba(0, 242, 254, 0.25)',
                  borderRadius: '8px',
                  color: 'var(--text-white)',
                  outline: 'none',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-main)',
                  transition: 'var(--transition-smooth)'
                }}
                className="cyber-input"
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '6px', fontWeight: 500 }}>
              Account Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--neon-cyan)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 38px 11px 38px',
                  background: 'rgba(13, 19, 38, 0.8)',
                  border: '1px solid rgba(0, 242, 254, 0.25)',
                  borderRadius: '8px',
                  color: 'var(--text-white)',
                  outline: 'none',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-main)',
                  transition: 'var(--transition-smooth)'
                }}
                className="cyber-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-light)',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '12px',
              marginTop: '6px',
              fontSize: '0.95rem'
            }}
          >
            {loading ? 'Authenticating...' : (
              <>Sign In to Console <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        {/* Links */}
        <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ color: 'var(--text-gray)', fontSize: '0.85rem' }}>
            New to IoT Innovation Club?{' '}
            <Link to="/signup" style={{ color: 'var(--neon-cyan)', fontWeight: 600, textDecoration: 'none' }}>
              Register Here
            </Link>
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            Faculty or Administrator?{' '}
            <Link to="/admin-login" style={{ color: 'var(--neon-violet)', textDecoration: 'none' }}>
              Access Admin Portal
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        .cyber-input:focus {
          border-color: var(--neon-cyan) !important;
          box-shadow: 0 0 15px rgba(0, 242, 254, 0.3) !important;
        }
        .shake-animation {
          animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
          40%, 60% { transform: translate3d(3px, 0, 0); }
        }
      `}</style>
    </div>
  );
};
