import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Menu, X, ShieldAlert } from 'lucide-react';
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
        height: '80px',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 5%',
        transition: 'var(--transition-smooth)',
        borderBottom: '1px solid #cbd5e1',
        background: '#ffffff',
        boxShadow: '0 1px 3px rgba(60,64,67,0.08)'
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '1.5rem' }}>
          {homepageContent.logo}
        </span>
        <span
          onClick={() => handleNavClick('hero')}
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '1.2rem',
            color: 'var(--primary)',
            cursor: 'pointer',
            letterSpacing: '-0.3px'
          }}
        >
          {homepageContent.clubName}
        </span>
      </div>

      {/* Desktop Links */}
      <div className="nav-desktop-links" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => handleNavClick(link.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-light)',
              fontFamily: 'var(--font-main)',
              fontWeight: 500,
              fontSize: '0.88rem',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '4px',
              transition: 'var(--transition-smooth)',
            }}
            className="nav-link-hover"
          >
            {link.name}
          </button>
        ))}
        <Link
          to="/admin-login"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#ffffff',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 600,
            padding: '8px 14px',
            borderRadius: '4px',
            background: 'var(--primary)',
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
          background: 'none',
          border: 'none',
          color: 'var(--text-white)',
          cursor: 'pointer',
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
            top: '85px',
            left: '4%',
            right: '4%',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '16px',
            zIndex: 99,
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.08)'
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-gray)',
                fontFamily: 'var(--font-main)',
                fontWeight: 500,
                fontSize: '0.95rem',
                cursor: 'pointer',
                textAlign: 'left',
                padding: '6px 0',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              {link.name}
            </button>
          ))}
          <Link
            to="/admin-login"
            onClick={() => setIsOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: '#fff',
              textDecoration: 'none',
              background: 'var(--primary)',
              padding: '10px',
              borderRadius: '4px',
              textAlign: 'center',
              fontWeight: 600,
              marginTop: '6px'
            }}
          >
            <ShieldAlert size={15} /> Admin Portal
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
          background: #f1f5f9 !important;
        }
        .admin-nav-button:hover {
          background: var(--primary-hover) !important;
        }
      `}</style>
    </nav>
  );
};
