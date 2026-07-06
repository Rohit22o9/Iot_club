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
        backgroundColor: '#0f172a', // Clean Professional Navy Slate
        borderTop: '1px solid #1e293b',
        padding: '60px 5% 30px 5%',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
            <span style={{ fontSize: '1.5rem' }}>{homepageContent.logo}</span>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '1.2rem',
                color: '#ffffff',
              }}
            >
              {homepageContent.clubName}
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px', maxWidth: '350px' }}>
            A premium technological ecosystem enabling students to prototype next-generation microgrids, automated robotics, and edge intelligence.
          </p>
          {/* Socials */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#94a3b8',
              width: '36px',
              height: '36px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition-smooth)'
            }}>
              <Github size={16} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#94a3b8',
              width: '36px',
              height: '36px',
              borderRadius: '4px',
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
          <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '15px', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['About', 'Achievements', 'Projects', 'Gallery', 'Members'].map((item) => (
              <li key={item}>
                <button
                  onClick={() => handleScrollTo(item.toLowerCase())}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontFamily: 'var(--font-main)',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    padding: 0,
                    textAlign: 'left',
                    transition: 'var(--transition-smooth)',
                  }}
                  className="footer-link"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Address and Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h4 style={{ color: '#ffffff', fontSize: '1rem', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>Club Headquarters</h4>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: '#94a3b8', fontSize: '0.88rem' }}>
            <MapPin size={16} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ lineHeight: 1.5 }}>{homepageContent.address}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
            <Mail size={16} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
            <a href={`mailto:${homepageContent.email}`} style={{ color: '#94a3b8', textDecoration: 'none' }} className="footer-link">
              {homepageContent.email}
            </a>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
            <Phone size={16} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
            <a href={`tel:${homepageContent.phone}`} style={{ color: '#94a3b8', textDecoration: 'none' }} className="footer-link">
              {homepageContent.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid #1e293b', marginTop: '30px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <p style={{ color: '#64748b', fontSize: '0.8rem' }}>
          &copy; {new Date().getFullYear()} {homepageContent.clubName}. All rights reserved. Professional University Student Chapter.
        </p>
        <Link to="/admin-login" style={{ color: '#64748b', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }} className="footer-link">
          <ShieldAlert size={14} /> Admin Access Console
        </Link>
      </div>

      <style>{`
        .footer-social-btn:hover {
          background: var(--primary) !important;
          color: #fff !important;
          border-color: var(--primary) !important;
          transform: translateY(-1px);
        }
        .footer-link:hover {
          color: #ffffff !important;
        }
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1.5fr 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 25px !important;
          }
        }
      `}</style>
    </footer>
  );
};
