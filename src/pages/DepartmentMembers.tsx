import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Search, Globe, Mail } from 'lucide-react';
import { Github, Linkedin } from '../components/BrandIcons';
import { useIoTStore } from '../data/store';

export const DepartmentMembers: React.FC = () => {
  const { year } = useParams<{ year: string }>();
  const navigate = useNavigate();
  const { members } = useIoTStore();
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedYear = (year || 'se').toUpperCase() as 'SE' | 'TE' | 'BE';
  const deptTitle = 
    normalizedYear === 'SE' ? 'Second Year (SE)' :
    normalizedYear === 'TE' ? 'Third Year (TE)' : 'Final Year (BE)';


  // Filter members of this department matching search queries
  const deptMembers = members.filter(
    (m) => m.year === normalizedYear &&
    ((m.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
     (Array.isArray(m.skills || m.skillsTech) && (m.skills || m.skillsTech || []).some(skill => (skill || '').toLowerCase().includes(searchQuery.toLowerCase()))) ||
     (m.position || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-dark)',
      padding: '110px 5% 50px 5%',
      maxWidth: '1300px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 2
    }}>
      {/* Back CTA */}
      <button 
        onClick={() => navigate('/')} 
        className="btn-secondary"
        style={{
          marginBottom: '25px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          borderRadius: '4px'
        }}
      >
        <ArrowLeft size={16} /> Back to Homepage
      </button>

      {/* Header and Search */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          marginBottom: '35px',
          borderBottom: '1px solid #cbd5e1',
          paddingBottom: '15px'
        }}
      >
        <div>
          <h1 style={{
            fontSize: '1.9rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            color: 'var(--text-white)',
            marginBottom: '4px'
          }}>
            {deptTitle} Student Directory
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '0.88rem' }}>
            Roster listings of active developers, hardware builders, and project squads.
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <Search 
            size={15} 
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-light)'
            }} 
          />
          <input
            type="text"
            placeholder="Search student or tech skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 32px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              color: 'var(--text-white)',
              outline: 'none',
              fontFamily: 'var(--font-main)',
              fontSize: '0.85rem',
              transition: 'var(--transition-smooth)'
            }}
            className="search-input-focus"
          />
        </div>
      </div>

      {/* Members Directory Grid */}
      {deptMembers.length === 0 ? (
        <div 
          className="glass-panel" 
          style={{
            padding: '30px',
            textAlign: 'center',
            background: '#ffffff',
            borderRadius: '6px'
          }}
        >
          <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
            No members found in this roster classification.
          </p>
        </div>
      ) : (
        <div className="grid-3">
          {deptMembers.map((m) => (
            <div 
              key={m.id} 
              className={`member-card-premium card-glow-${normalizedYear.toLowerCase()}`}
            >
              {/* Cover Banner with Tech Mesh Pattern & Organic Curve */}
              <div 
                className={`member-card-banner-${normalizedYear.toLowerCase()}`}
                style={{
                  height: '100px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  borderBottomLeftRadius: '24px',
                  borderBottomRightRadius: '24px'
                }}
              >
                {/* Tech Pattern Grid Overlay (Clipped) */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
                  backgroundSize: '12px 12px',
                  borderBottomLeftRadius: '24px',
                  borderBottomRightRadius: '24px',
                  pointerEvents: 'none'
                }} />
                
                <img
                  src={m.photo}
                  alt={m.name}
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `4px solid #ffffff`,
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.12)',
                    zIndex: 2,
                    position: 'absolute',
                    bottom: '-28px',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  className="member-avatar"
                />
              </div>

              {/* Card Contents */}
              <div 
                style={{
                  padding: '36px 18px 18px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  textAlign: 'center'
                }}
              >
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-white)', fontWeight: 700, marginBottom: '3px', fontFamily: 'var(--font-heading)' }}>
                  {m.name}
                </h3>
                
                {/* Position Pill Tag */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    background: normalizedYear === 'SE' ? 'rgba(15, 157, 88, 0.08)' : normalizedYear === 'TE' ? 'rgba(26, 115, 232, 0.08)' : 'rgba(234, 67, 53, 0.08)',
                    color: normalizedYear === 'SE' ? 'var(--gdg-green)' : normalizedYear === 'TE' ? 'var(--primary)' : 'var(--gdg-red)',
                    borderRadius: '100px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04rem'
                  }}>
                    {m.position}
                  </span>
                </div>

                <p style={{
                  color: 'var(--text-light)',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                  marginBottom: '14px',
                  flexGrow: 1,
                  minHeight: '20px',
                  maxHeight: '38px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {m.bio}
                </p>

                {/* Skills Theme-Coded */}
                <div 
                  style={{
                    display: 'flex',
                    gap: '5px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    marginBottom: '16px',
                    minHeight: '28px'
                  }}
                >
                  {(m.skills || m.skillsTech || []).slice(0, 3).map((s, idx) => (
                    <span 
                      key={idx} 
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        background: normalizedYear === 'SE' ? 'rgba(15, 157, 88, 0.05)' : normalizedYear === 'TE' ? 'rgba(26, 115, 232, 0.05)' : 'rgba(234, 67, 53, 0.05)',
                        border: normalizedYear === 'SE' ? '1px solid rgba(15, 157, 88, 0.15)' : normalizedYear === 'TE' ? '1px solid rgba(26, 115, 232, 0.15)' : '1px solid rgba(234, 67, 53, 0.15)',
                        borderRadius: '100px',
                        color: normalizedYear === 'SE' ? 'var(--gdg-green)' : normalizedYear === 'TE' ? 'var(--primary)' : 'var(--gdg-red)',
                        transition: 'all 0.2s ease'
                      }}
                      className="skill-badge-premium"
                    >
                      {s}
                    </span>
                  ))}
                  {(m.skills || m.skillsTech || []).length > 3 && (
                    <span style={{ 
                      fontSize: '0.7rem', 
                      padding: '3px 6px', 
                      color: normalizedYear === 'SE' ? 'var(--gdg-green)' : normalizedYear === 'TE' ? 'var(--primary)' : 'var(--gdg-red)', 
                      fontWeight: 700 
                    }}>
                      +{(m.skills || m.skillsTech || []).length - 3} items
                    </span>
                  )}
                </div>

                {/* Footer and socials */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    {m.socials?.github && (
                      <a href={m.socials.github} target="_blank" rel="noopener noreferrer" className={`member-social-btn hover-${normalizedYear.toLowerCase()}`}>
                        <Github size={14} />
                      </a>
                    )}
                    {m.socials?.linkedin && (
                      <a href={m.socials.linkedin} target="_blank" rel="noopener noreferrer" className={`member-social-btn hover-${normalizedYear.toLowerCase()}`}>
                        <Linkedin size={14} />
                      </a>
                    )}
                    {m.socials?.portfolio && (
                      <a href={m.socials.portfolio} target="_blank" rel="noopener noreferrer" className={`member-social-btn hover-${normalizedYear.toLowerCase()}`}>
                        <Globe size={14} />
                      </a>
                    )}
                    {m.socials?.email && (
                      <a href={`mailto:${m.socials.email}`} className={`member-social-btn hover-${normalizedYear.toLowerCase()}`}>
                        <Mail size={14} />
                      </a>
                    )}
                  </div>

                  <Link 
                    to={`/profile/${m.id}`} 
                    className={`btn-view-profile btn-hover-${normalizedYear.toLowerCase()}`}
                  >
                    View Roster Profile
                  </Link>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .search-input-focus:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.12);
        }
        
        /* Premium Card Layout and Transitions */
        .member-card-premium {
          background: linear-gradient(to bottom, #ffffff, #fcfdfe);
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }
        
        /* Soft Ambient Glow Shadows per department */
        .card-glow-se {
          box-shadow: 0 4px 20px rgba(15, 157, 88, 0.04), 0 2px 4px rgba(0, 0, 0, 0.02);
        }
        .card-glow-se:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 35px rgba(15, 157, 88, 0.12), 0 10px 15px rgba(0, 0, 0, 0.03);
          border-color: rgba(15, 157, 88, 0.3);
        }
        
        .card-glow-te {
          box-shadow: 0 4px 20px rgba(26, 115, 232, 0.04), 0 2px 4px rgba(0, 0, 0, 0.02);
        }
        .card-glow-te:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 35px rgba(26, 115, 232, 0.12), 0 10px 15px rgba(0, 0, 0, 0.03);
          border-color: rgba(26, 115, 232, 0.3);
        }
        
        .card-glow-be {
          box-shadow: 0 4px 20px rgba(234, 67, 53, 0.04), 0 2px 4px rgba(0, 0, 0, 0.02);
        }
        .card-glow-be:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 35px rgba(234, 67, 53, 0.12), 0 10px 15px rgba(0, 0, 0, 0.03);
          border-color: rgba(234, 67, 53, 0.3);
        }
        
        .member-card-premium:hover .member-avatar {
          transform: scale(1.06);
        }
        
        /* Themed Gradients per department */
        .member-card-banner-se {
          background: linear-gradient(135deg, #059669 0%, #064e3b 100%);
        }
        .member-card-banner-te {
          background: linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%);
        }
        .member-card-banner-be {
          background: linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%);
        }
        
        /* Circular Social Icon Buttons with themed hovers */
        .member-social-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b !important;
          transition: all 0.25s ease;
        }
        
        .member-social-btn.hover-se:hover {
          background: rgba(15, 157, 88, 0.06);
          border-color: var(--gdg-green);
          color: var(--gdg-green) !important;
          transform: translateY(-3px);
          box-shadow: 0 4px 8px rgba(15, 157, 88, 0.15);
        }
        .member-social-btn.hover-te:hover {
          background: rgba(26, 115, 232, 0.06);
          border-color: var(--primary);
          color: var(--primary) !important;
          transform: translateY(-3px);
          box-shadow: 0 4px 8px rgba(26, 115, 232, 0.15);
        }
        .member-social-btn.hover-be:hover {
          background: rgba(234, 67, 53, 0.06);
          border-color: var(--gdg-red);
          color: var(--gdg-red) !important;
          transform: translateY(-3px);
          box-shadow: 0 4px 8px rgba(234, 67, 53, 0.15);
        }
        
        /* Profile CTA Buttons with Dynamic Hover Theme */
        .btn-view-profile {
          padding: 10px 0;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.88rem;
          font-weight: 600;
          border-radius: 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        
        .btn-hover-se:hover {
          background: var(--gdg-green);
          border-color: var(--gdg-green);
          color: #ffffff;
          box-shadow: 0 8px 16px rgba(15, 157, 88, 0.24);
        }
        .btn-hover-te:hover {
          background: var(--primary);
          border-color: var(--primary);
          color: #ffffff;
          box-shadow: 0 8px 16px rgba(26, 115, 232, 0.24);
        }
        .btn-hover-be:hover {
          background: var(--gdg-red);
          border-color: var(--gdg-red);
          color: #ffffff;
          box-shadow: 0 8px 16px rgba(234, 67, 53, 0.24);
        }
      `}</style>

    </div>
  );
};
