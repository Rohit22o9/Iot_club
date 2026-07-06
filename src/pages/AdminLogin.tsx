import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';
import { useIoTStore } from '../data/store';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { memberLogin } = useIoTStore();
  const [role, setRole] = useState<'member' | 'admin'>('member');
  
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
    const isMemberLogged = sessionStorage.getItem('iot_member_auth');
    if (isMemberLogged) {
      navigate('/member-dashboard');
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
      // Student member auth check (Local or Google Sheets Sync API)
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
      padding: '20px',
      position: 'relative',
      zIndex: 2
    }}>
      <div 
        className={`glass-panel ${isShaking ? 'shake-animation' : ''}`}
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '35px 25px',
          background: '#ffffff',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #cbd5e1',
          boxShadow: 'var(--card-shadow-hover)'
        }}
      >
        {/* Shield Icon */}
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
          margin: '0 auto 20px auto',
        }}>
          <ShieldAlert size={26} />
        </div>

        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-white)', marginBottom: '4px', fontFamily: 'var(--font-heading)' }}>IoT Portal Authentication</h2>
        <p style={{ color: 'var(--text-light)', fontSize: '0.82rem', marginBottom: '20px' }}>
          Select clearance role to access the workspace dashboards.
        </p>

        {/* Tab Selection */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '5px',
          background: '#f1f5f9',
          padding: '4px',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => { setRole('member'); setError(''); }}
            style={{
              padding: '8px 0',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.82rem',
              fontFamily: 'var(--font-main)',
              background: role === 'member' ? '#ffffff' : 'transparent',
              color: role === 'member' ? 'var(--primary)' : 'var(--text-light)',
              boxShadow: role === 'member' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              transition: 'var(--transition-smooth)'
            }}
          >
            Student Member
          </button>
          <button
            type="button"
            onClick={() => { setRole('admin'); setError(''); }}
            style={{
              padding: '8px 0',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.82rem',
              fontFamily: 'var(--font-main)',
              background: role === 'admin' ? '#ffffff' : 'transparent',
              color: role === 'admin' ? 'var(--primary)' : 'var(--text-light)',
              boxShadow: role === 'admin' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              transition: 'var(--transition-smooth)'
            }}
          >
            Club Admin
          </button>
        </div>

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

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
          
          {role === 'member' ? (
            /* Student Email field */
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '6px' }}>Student Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input
                  type="email"
                  required
                  placeholder="student@univ.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px 10px 36px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)', outline: 'none', fontSize: '0.9rem' }}
                  className="input-focus"
                />
              </div>
            </div>
          ) : (
            /* Admin username field */
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '6px' }}>Admin Username</label>
              <div style={{ position: 'relative' }}>
                <User size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input
                  type="text"
                  required
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px 10px 36px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)', outline: 'none', fontSize: '0.9rem' }}
                  className="input-focus"
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '6px' }}>Passcode</label>
            <div style={{ position: 'relative' }}>
              <Lock size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 36px 10px 36px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: 'var(--text-white)', outline: 'none', fontSize: '0.9rem' }}
                className="input-focus"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: 0 }}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '11px 0', marginTop: '5px', borderRadius: '4px' }}
          >
            {loading ? 'Authenticating Console...' : 'Log In Portal'}
          </button>
        </form>

        {role === 'member' && (
          <div style={{ marginTop: '20px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-light)' }}>Don't have a profile yet? </span>
            <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
              Create Account
            </Link>
          </div>
        )}

        <button 
          onClick={() => navigate('/')} 
          style={{ background: 'none', border: 'none', color: 'var(--text-light)', marginTop: '20px', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Return to Club Site
        </button>
      </div>

      <style>{`
        .shake-animation {
          animation: shake 0.5s ease-in-out;
        }
        .input-focus:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 5px rgba(26,115,232,0.15);
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};
