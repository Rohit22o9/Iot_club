import React from 'react';
import { Mail, Phone, MapPin, ShieldAlert } from 'lucide-react';
import { Github, Linkedin } from './BrandIcons';
import { useIoTStore } from '../data/store';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const { homepageContent } = useIoTStore();

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '65px 5% 35px 5%',
        position: 'relative',
        zIndex: 2,
        overflow: 'hidden'
      }}
    >
      {/* Top subtle accent border line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #2563eb, #059669, transparent)',
      }} />

      <div
        style={{
          maxWidth: '1300px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1.5fr',
          gap: '40px',
          marginBottom: '40px',
        }}
        className="footer-grid"
      >
        {/* Info Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '1.5rem' }}>
              {homepageContent.logo}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.25rem',
                color: '#0f172a'
              }}
            >
              {homepageContent.clubName}
            </span>
          </div>
          <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '22px', maxWidth: '380px' }}>
            A next-generation technological chapter empowering student engineers to architect connected hardware, automated robotics, and edge intelligence systems.
          </p>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 10px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '4px', marginBottom: '22px' }}>
            <span className="cyber-pulse-dot" style={{ width: '6px', height: '6px', backgroundColor: '#059669', boxShadow: 'none' }} />
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#059669', fontWeight: 600 }}>
              NETWORK OPERATIONAL // V4.2
            </span>
          </div>

          {/* Socials */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#475569',
              width: '38px',
              height: '38px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition-smooth)'
            }}>
              <Github size={16} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#475569',
              width: '38px',
              height: '38px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition-smooth)'
            }}>
              <Linkedin size={16} />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 style={{ color: '#0f172a', fontSize: '1rem', marginBottom: '18px', fontFamily: 'var(--font-heading)', fontWeight: 700, letterSpacing: '0.5px' }}>
            Navigation
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['Home', 'About', 'Achievements', 'Projects', 'Gallery', 'Members', 'Faculty'].map((item) => (
              <li key={item}>
                <button
                  onClick={() => handleScrollTo(item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase())}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#475569',
                    fontFamily: 'var(--font-main)',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    padding: 0,
                    textAlign: 'left',
                    transition: 'var(--transition-smooth)',
                  }}
                  className="footer-link"
                >
                  › {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Address and Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h4 style={{ color: '#0f172a', fontSize: '1rem', fontFamily: 'var(--font-heading)', fontWeight: 700, letterSpacing: '0.5px' }}>
            Chapter Lab Headquarters
          </h4>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: '#334155', fontSize: '0.88rem' }}>
            <MapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '3px' }} />
            <p style={{ lineHeight: 1.5 }}>{homepageContent.address}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#334155', fontSize: '0.88rem' }}>
            <Mail size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <a href={`mailto:${homepageContent.email}`} style={{ color: '#334155', textDecoration: 'none' }} className="footer-link">
              {homepageContent.email}
            </a>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#334155', fontSize: '0.88rem' }}>
            <Phone size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <a href={`tel:${homepageContent.phone}`} style={{ color: '#334155', textDecoration: 'none' }} className="footer-link">
              {homepageContent.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '35px', paddingTop: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <p style={{ color: '#64748b', fontSize: '0.82rem' }}>
          &copy; {new Date().getFullYear()} {homepageContent.clubName}. Engineering Hardware & Edge Systems.
        </p>
        <Link to="/admin-login" style={{ color: '#64748b', fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }} className="footer-link">
          <ShieldAlert size={14} style={{ color: 'var(--primary)' }} /> Admin Access Console
        </Link>
      </div>

      <style>{`
        .footer-social-btn:hover {
          background: #eff6ff !important;
          color: #2563eb !important;
          border-color: #bfdbfe !important;
          transform: translateY(-2px);
        }
        .footer-link:hover {
          color: #2563eb !important;
          transform: translateX(3px);
        }
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1.5fr 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
      `}</style>
    </footer>
  );
};
