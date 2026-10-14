import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Search, Globe, Mail, UserPlus, LogIn, ExternalLink, Sparkles } from 'lucide-react';
import { Github, Linkedin } from '../components/BrandIcons';
import { useIoTStore } from '../data/store';

export const DepartmentMembers: React.FC = () => {
  const { year } = useParams<{ year: string }>();
  const navigate = useNavigate();
  const { members } = useIoTStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Active year cohort (defaults to SE if invalid or missing)
  const normalizedYear = (year || 'se').toUpperCase() as 'SE' | 'TE' | 'BE';
  const activeYear = ['SE', 'TE', 'BE'].includes(normalizedYear) ? normalizedYear : 'SE';

  const deptTitle = 
    activeYear === 'SE' ? 'Second Year (SE)' :
    activeYear === 'TE' ? 'Third Year (TE)' : 'Final Year (BE)';

  // Calculate live counts for each cohort
  const seCount = members.filter(m => m.year === 'SE').length;
  const teCount = members.filter(m => m.year === 'TE').length;
  const beCount = members.filter(m => m.year === 'BE').length;

  // Filter members of this department matching search queries
  const deptMembers = members.filter(
    (m) => m.year === activeYear &&
    ((m.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
     (Array.isArray(m.skills || m.skillsTech) && (m.skills || m.skillsTech || []).some(skill => (skill || '').toLowerCase().includes(searchQuery.toLowerCase()))) ||
     (m.position || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '100px 5% 60px 5%',
      maxWidth: '1340px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 2,
      overflow: 'hidden'
    }}>
      {/* Top Action Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '28px'
      }}>
        <button 
          onClick={() => navigate('/')} 
          className="btn-secondary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            borderRadius: '6px',
            padding: '8px 14px',
            fontSize: '0.84rem'
          }}
        >
          <ArrowLeft size={15} /> Back to Homepage
        </button>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/signup')}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.84rem', borderRadius: '6px' }}
          >
            <UserPlus size={14} /> Register as Student
          </button>
          <button
            onClick={() => navigate('/login')}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.84rem', borderRadius: '6px', color: '#2563eb' }}
          >
            <LogIn size={14} /> Student Login
          </button>
        </div>
      </div>

      {/* Cohort Tabs Switcher (SE / TE / BE) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '14px',
        marginBottom: '32px'
      }} className="year-tabs-container">
        {[
          { code: 'SE', title: 'Second Year (SE)', sub: 'Foundation & Circuits', count: seCount, color: '#059669', activeBg: '#ecfdf5', badgeBg: '#ecfdf5', badgeColor: '#059669', border: '#a7f3d0' },
          { code: 'TE', title: 'Third Year (TE)', sub: 'Firmware & Protocols', count: teCount, color: '#0284c7', activeBg: '#eff6ff', badgeBg: '#eff6ff', badgeColor: '#0284c7', border: '#bfdbfe' },
          { code: 'BE', title: 'Final Year (BE)', sub: 'Edge AI & Capstones', count: beCount, color: '#e11d48', activeBg: '#fdf2f8', badgeBg: '#fdf2f8', badgeColor: '#e11d48', border: '#fbcfe8' }
        ].map(tab => {
          const isActive = activeYear === tab.code;
          return (
            <div
              key={tab.code}
              onClick={() => navigate(`/members/${tab.code.toLowerCase()}`)}
              style={{
                padding: '16px 18px',
                borderRadius: '12px',
                cursor: 'pointer',
                border: isActive ? `2px solid ${tab.color}` : '1px solid #e2e8f0',
                background: '#ffffff',
                boxShadow: isActive ? '0 4px 14px rgba(0, 0, 0, 0.06)' : '0 1px 3px rgba(0, 0, 0, 0.03)',
                transition: 'var(--transition-smooth)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                  color: isActive ? tab.color : '#0f172a'
                }}>
                  {tab.title}
                </span>
                <span style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  background: isActive ? tab.badgeBg : '#f1f5f9',
                  color: isActive ? tab.badgeColor : '#64748b',
                  border: isActive ? `1px solid ${tab.border}` : '1px solid #e2e8f0'
                }}>
                  {tab.count} Students
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                {tab.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Directory Title and Search Bar */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '32px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '20px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h1 style={{
              fontSize: '2rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em'
            }}>
              {deptTitle} Student Directory
            </h1>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '20px',
              background: activeYear === 'SE' ? '#ecfdf5' : activeYear === 'TE' ? '#eff6ff' : '#fdf2f8',
              color: activeYear === 'SE' ? '#059669' : activeYear === 'TE' ? '#0284c7' : '#e11d48',
              border: `1px solid ${activeYear === 'SE' ? '#a7f3d0' : activeYear === 'TE' ? '#bfdbfe' : '#fbcfe8'}`,
            }}>
              {deptMembers.length} Active
            </span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Official student member roster classified by academic department track.
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
          <Search 
            size={16} 
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b'
            }} 
          />
          <input
            type="text"
            placeholder="Search student, skill, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              color: '#0f172a',
              outline: 'none',
              fontFamily: 'var(--font-main)',
              fontSize: '0.88rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
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
            padding: '45px 30px',
            textAlign: 'center',
            borderRadius: '16px',
            maxWidth: '600px',
            margin: '40px auto',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563eb',
            margin: '0 auto 16px auto'
          }}>
            <Sparkles size={26} />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '8px' }}>
            No Students Found in {deptTitle}
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '22px' }}>
            {searchQuery 
              ? `No student matching "${searchQuery}" found in this cohort.` 
              : `Be the first student to register for the ${deptTitle} cohort!`}
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="btn-primary"
            style={{ padding: '10px 22px' }}
          >
            Register Student Profile Now
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {deptMembers.map((m) => {
            const memberSkills = m.skills || m.skillsTech || [];
            return (
              <div 
                key={m.id} 
                className="member-card-premium"
              >
                {/* Cover Banner with Themed Cohort Gradient */}
                <div 
                  className={`member-card-banner-${activeYear.toLowerCase()}`}
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
                  <img
                    src={m.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300'}
                    alt={m.name}
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #ffffff',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
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
                    padding: '36px 20px 20px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    textAlign: 'center'
                  }}
                >
                  <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 700, marginBottom: '4px', fontFamily: 'var(--font-heading)' }}>
                    {m.name}
                  </h3>
                  
                  {/* Position Pill Tag */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                    <span style={{
                      fontSize: '0.74rem',
                      fontWeight: 650,
                      padding: '3px 12px',
                      background: activeYear === 'SE' ? '#ecfdf5' : activeYear === 'TE' ? '#eff6ff' : '#fdf2f8',
                      color: activeYear === 'SE' ? '#059669' : activeYear === 'TE' ? '#0284c7' : '#e11d48',
                      borderRadius: '100px',
                      border: `1px solid ${activeYear === 'SE' ? '#a7f3d0' : activeYear === 'TE' ? '#bfdbfe' : '#fbcfe8'}`,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {m.position || 'Student Developer'}
                    </span>
                  </div>

                  <p style={{
                    color: '#475569',
                    fontSize: '0.86rem',
                    lineHeight: 1.5,
                    marginBottom: '16px',
                    flexGrow: 1,
                    minHeight: '22px',
                    maxHeight: '44px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {m.bio || 'Active student member participating in chapter hardware prototyping squads.'}
                  </p>

                  {/* Skills Chips */}
                  <div 
                    style={{
                      display: 'flex',
                      gap: '6px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      marginBottom: '18px',
                      minHeight: '28px'
                    }}
                  >
                    {memberSkills.slice(0, 3).map((s, idx) => (
                      <span 
                        key={idx} 
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          padding: '3px 9px',
                          background: '#f1f5f9',
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px',
                          color: '#334155',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        {s}
                      </span>
                    ))}
                    {memberSkills.length > 3 && (
                      <span style={{ 
                        fontSize: '0.74rem', 
                        padding: '3px 6px', 
                        color: '#64748b', 
                        fontWeight: 600 
                      }}>
                        +{memberSkills.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Footer and socials */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      {m.socials?.github && (
                        <a href={m.socials.github} target="_blank" rel="noopener noreferrer" className="member-social-btn">
                          <Github size={14} />
                        </a>
                      )}
                      {m.socials?.linkedin && (
                        <a href={m.socials.linkedin} target="_blank" rel="noopener noreferrer" className="member-social-btn">
                          <Linkedin size={14} />
                        </a>
                      )}
                      {m.socials?.portfolio && (
                        <a href={m.socials.portfolio} target="_blank" rel="noopener noreferrer" className="member-social-btn">
                          <Globe size={14} />
                        </a>
                      )}
                      {m.socials?.email && (
                        <a href={`mailto:${m.socials.email}`} className="member-social-btn">
                          <Mail size={14} />
                        </a>
                      )}
                    </div>

                    <Link 
                      to={`/profile/${m.id}`} 
                      className={`btn-view-profile btn-hover-${activeYear.toLowerCase()}`}
                    >
                      View Roster Profile <ExternalLink size={13} style={{ marginLeft: '4px' }} />
                    </Link>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .search-input-focus:focus {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;
        }
        
        .member-card-premium {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03);
          transition: var(--transition-smooth);
          position: relative;
        }
        
        .member-card-premium:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px -4px rgba(15, 23, 42, 0.08), 0 4px 10px -2px rgba(15, 23, 42, 0.04);
          border-color: #cbd5e1;
        }
        
        .member-card-premium:hover .member-avatar {
          transform: scale(1.08);
        }
        
        .member-card-banner-se {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        .member-card-banner-te {
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
        }
        .member-card-banner-be {
          background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
        }
        
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
        
        .member-social-btn:hover {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: #2563eb !important;
          transform: translateY(-2px);
        }
        
        .btn-view-profile {
          padding: 10px 0;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.88rem;
          font-weight: 600;
          border-radius: 8px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          color: #0f172a;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        
        .btn-hover-se:hover {
          background: #059669;
          border-color: #059669;
          color: #ffffff !important;
        }
        .btn-hover-te:hover {
          background: #0284c7;
          border-color: #0284c7;
          color: #ffffff !important;
        }
        .btn-hover-be:hover {
          background: #e11d48;
          border-color: #e11d48;
          color: #ffffff !important;
        }

        @media (max-width: 800px) {
          .year-tabs-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
