import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, User, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';
import { useIoTStore } from '../data/store';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { memberLogin } = useIoTStore();
  const [role, setRole] = useState<'admin' | 'member'>('admin');
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Session auto-routing
    const isAdminLogged = sessionStorage.getItem('iot_admin_auth') === 'true';
    if (isAdminLogged) {
      navigate('/admin');
      return;
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (role === 'admin') {
      // Admin authentication check (Mock Credentials)
      if (username === 'admin' && password === 'iotclub2026') {
        sessionStorage.setItem('iot_admin_auth', 'true');
        navigate('/admin');
      } else {
        setError('Invalid administrator passcode credentials.');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      }
      setLoading(false);
    } else {
      // Student member auth check
      try {
        const res = await memberLogin({ email, password });
        if (res.status === 'success') {
          sessionStorage.setItem('iot_member_auth', res.memberId || '');
          navigate('/member-dashboard');
        } else {
          setError(res.message || 'Incorrect email or password credentials.');
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 500);
        }
      } catch(err) {
        setError('Authentication server timeout error.');
      } finally {
        setLoading(false);
      }
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
          maxWidth: '430px',
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
            <ArrowLeft size={14} /> Back to Web
          </button>
        </div>

        {/* Shield Icon */}
        <div style={{
          background: 'rgba(0, 242, 254, 0.12)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          boxShadow: '0 0 20px rgba(0, 242, 254, 0.25)',
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--neon-cyan)',
          margin: '0 auto 16px auto',
        }}>
          <ShieldAlert size={28} />
        </div>

        <h2 style={{ fontSize: '1.55rem', color: 'var(--text-white)', marginBottom: '6px', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
          IoT Portal Access Console
        </h2>
        <p style={{ color: 'var(--text-light)', fontSize: '0.86rem', marginBottom: '20px' }}>
          Select clearance role to access the workspace dashboards.
        </p>

        {/* Tab Selection */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px',
          background: 'rgba(13, 19, 38, 0.8)',
          padding: '5px',
          borderRadius: '8px',
          border: '1px solid rgba(0, 242, 254, 0.2)',
          marginBottom: '22px'
        }}>
          <button
            type="button"
            onClick={() => { setRole('admin'); setError(''); }}
            style={{
              padding: '9px 0',
              border: role === 'admin' ? '1px solid var(--neon-cyan)' : 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.84rem',
              fontFamily: 'var(--font-main)',
              background: role === 'admin' ? 'rgba(0, 242, 254, 0.2)' : 'transparent',
              color: role === 'admin' ? 'var(--neon-cyan)' : 'var(--text-gray)',
              boxShadow: role === 'admin' ? '0 0 10px rgba(0, 242, 254, 0.3)' : 'none',
              transition: 'var(--transition-smooth)'
            }}
          >
            Club Admin
          </button>
          <button
            type="button"
            onClick={() => { setRole('member'); setError(''); }}
            style={{
              padding: '9px 0',
              border: role === 'member' ? '1px solid var(--neon-emerald)' : 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.84rem',
              fontFamily: 'var(--font-main)',
              background: role === 'member' ? 'rgba(0, 245, 160, 0.2)' : 'transparent',
              color: role === 'member' ? 'var(--neon-emerald)' : 'var(--text-gray)',
              boxShadow: role === 'member' ? '0 0 10px rgba(0, 245, 160, 0.3)' : 'none',
              transition: 'var(--transition-smooth)'
            }}
          >
            Student Member
          </button>
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

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          
          {role === 'member' ? (
            /* Student Email field */
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '6px', fontWeight: 500 }}>
                Student Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--neon-emerald)' }} />
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
                    border: '1px solid rgba(0, 245, 160, 0.25)',
                    borderRadius: '8px',
                    color: 'var(--text-white)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-main)'
                  }}
                  className="cyber-input"
                />
              </div>
            </div>
          ) : (
            /* Admin username field */
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '6px', fontWeight: 500 }}>
                Admin Username
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--neon-cyan)' }} />
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 12px 11px 38px',
                    background: 'rgba(13, 19, 38, 0.8)',
                    border: '1px solid rgba(0, 242, 254, 0.25)',
                    borderRadius: '8px',
                    color: 'var(--text-white)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-main)'
                  }}
                  className="cyber-input"
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '6px', fontWeight: 500 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: role === 'member' ? 'var(--neon-emerald)' : 'var(--neon-cyan)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder={role === 'admin' ? 'iotclub2026' : 'Enter password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 38px 11px 38px',
                  background: 'rgba(13, 19, 38, 0.8)',
                  border: `1px solid ${role === 'member' ? 'rgba(0, 245, 160, 0.25)' : 'rgba(0, 242, 254, 0.25)'}`,
                  borderRadius: '8px',
                  color: 'var(--text-white)',
                  outline: 'none',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-main)'
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

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary" 
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '12px 0',
              marginTop: '6px',
              borderRadius: '8px',
              background: role === 'member' ? 'linear-gradient(135deg, #00f5a0 0%, #00d2ff 100%)' : undefined
            }}
          >
            {loading ? 'Authenticating...' : (
              <>Sign In to Console <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        {role === 'member' && (
          <div style={{ marginTop: '22px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-light)' }}>Don't have an account yet? </span>
            <Link to="/signup" style={{ color: 'var(--neon-emerald)', textDecoration: 'none', fontWeight: 600 }}>
              Register Here
            </Link>
          </div>
        )}
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
