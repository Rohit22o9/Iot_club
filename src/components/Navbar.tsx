import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Menu, X, ShieldAlert, GraduationCap } from 'lucide-react';
import { useIoTStore } from '../data/store';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { homepageContent } = useIoTStore();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'hero' },
    { name: 'About', id: 'about' },
    { name: 'Achievements', id: 'achievements' },
    { name: 'Projects', id: 'projects' },
    { name: 'Gallery', id: 'gallery' },
    { name: 'Members', id: 'members' },
    { name: 'Faculty', id: 'faculty' },
  ];

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    if (location.pathname === '/' || location.pathname === '') {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  return (
    <nav
      className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '76px',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 5%',
        transition: 'var(--transition-smooth)',
        borderBottom: '1px solid #e2e8f0',
        background: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.06)' : '0 1px 3px rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* Logo */}
      <div 
        onClick={() => handleNavClick('hero')}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <span style={{ fontSize: '1.5rem' }}>
          {homepageContent.logo}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.25rem',
              color: '#0f172a',
              letterSpacing: '-0.3px',
            }}
          >
            {homepageContent.clubName}
          </span>
          <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#059669', letterSpacing: '0.8px', fontWeight: 600 }}>
            ● ONLINE // V4.2
          </span>
        </div>
      </div>

      {/* Desktop Links */}
      <div className="nav-desktop-links" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => handleNavClick(link.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#334155',
              fontFamily: 'var(--font-main)',
              fontWeight: 500,
              fontSize: '0.88rem',
              cursor: 'pointer',
              padding: '6px 14px',
              borderRadius: '6px',
              transition: 'var(--transition-smooth)',
            }}
            className="nav-link-hover"
          >
            {link.name}
          </button>
        ))}
        <Link
          to="/login"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#059669',
            textDecoration: 'none',
            fontSize: '0.86rem',
            fontWeight: 600,
            padding: '7px 14px',
            borderRadius: '6px',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            transition: 'var(--transition-smooth)',
            marginLeft: '6px'
          }}
          className="student-nav-button"
        >
          <GraduationCap size={15} /> Student Portal
        </Link>
        <Link
          to="/admin-login"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#2563eb',
            textDecoration: 'none',
            fontSize: '0.86rem',
            fontWeight: 600,
            padding: '7px 14px',
            borderRadius: '6px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            transition: 'var(--transition-smooth)'
          }}
          className="admin-nav-button"
        >
          <ShieldAlert size={14} /> Admin Portal
        </Link>
      </div>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="nav-mobile-hamburger"
        style={{
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          color: '#0f172a',
          cursor: 'pointer',
          padding: '6px',
          display: 'none',
        }}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Overlay Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '4%',
            right: '4%',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '18px',
            zIndex: 99,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#1e293b',
                fontFamily: 'var(--font-main)',
                fontWeight: 500,
                fontSize: '0.95rem',
                cursor: 'pointer',
                textAlign: 'left',
                padding: '8px 10px',
                borderRadius: '6px',
                borderBottom: '1px solid #f1f5f9',
                transition: 'var(--transition-smooth)'
              }}
              className="nav-link-hover"
            >
              {link.name}
            </button>
          ))}
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: '#ffffff',
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              padding: '11px',
              borderRadius: '6px',
              textAlign: 'center',
              fontWeight: 650,
              marginTop: '8px',
              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)'
            }}
          >
            <GraduationCap size={16} /> Student Portal
          </Link>
          <Link
            to="/admin-login"
            onClick={() => setIsOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: '#ffffff',
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              padding: '11px',
              borderRadius: '6px',
              textAlign: 'center',
              fontWeight: 650,
              marginTop: '4px',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
            }}
          >
            <ShieldAlert size={16} /> Admin Portal
          </Link>
        </div>
      )}

      {/* CSS adjustments */}
      <style>{`
        @media (max-width: 1024px) {
          .nav-desktop-links {
            display: none !important;
          }
          .nav-mobile-hamburger {
            display: block !important;
          }
        }
        .nav-link-hover:hover {
          color: var(--primary) !important;
          background: #eff6ff !important;
        }
        .student-nav-button:hover {
          background: #059669 !important;
          color: #ffffff !important;
          border-color: #059669 !important;
          transform: translateY(-1px);
        }
        .admin-nav-button:hover {
          background: #2563eb !important;
          color: #ffffff !important;
          border-color: #2563eb !important;
          transform: translateY(-1px);
        }
      `}</style>
    </nav>
  );
};
