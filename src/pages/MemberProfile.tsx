import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Globe, Mail, Phone, BookOpen, 
  Award, FileText, Cpu, Layers, Download, CheckCircle
} from 'lucide-react';
import { Github, Linkedin } from '../components/BrandIcons';
import { useIoTStore } from '../data/store';

export const MemberProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { members } = useIoTStore();
  const [downloading, setDownloading] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const member = members.find((m) => m.id === id);

  if (!member) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-dark)',
        color: 'var(--text-white)'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Member Profile Not Found</h2>
        <button onClick={() => navigate('/')} className="btn-primary">Return Home</button>
      </div>
    );
  }

  const handleDownloadResume = () => {
    setDownloading(true);
    const resumeUrl = member.resumeUrl;
    if (resumeUrl) {
      setTimeout(() => {
        const element = document.createElement("a");
        element.href = resumeUrl;
        element.download = member.resumeName || `${(member.name || '').replace(/\s+/g, '_')}_Resume.pdf`;
        // Handle cross-origin or open in tab if download is blocked
        if (!resumeUrl.startsWith('data:')) {
          element.target = "_blank";
        }
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        setDownloading(false);
      }, 500);
    } else {
      setTimeout(() => {
        const element = document.createElement("a");
        const file = new Blob([
          `==================================================\n`,
          `RESUME: ${(member.name || '').toUpperCase()}\n`,
          `Position: ${member.position} (${member.year} Year Student)\n`,
          `Email: ${member.socials?.email || 'N/A'}\n`,
          `Phone: ${member.socials?.phone || 'N/A'}\n`,
          `==================================================\n\n`,
          `BIOGRAPHY:\n${member.bio || ''}\n\n`,
          `EDUCATION:\n${(member.education || []).join('\n')}\n\n`,
          `TECHNICAL SKILLS:\n${(member.skillsTech || member.skills || []).join(', ')}\n\n`,
          `SOFT SKILLS:\n${(member.skillsSoft || []).join(', ')}\n\n`,
          `PROJECTS:\n`,
          (member.projects || []).map(p => `- ${p.name}: ${p.description}`).join('\n'),
          `\n\nACHIEVEMENTS:\n`,
          (member.achievements || []).map(a => `- ${a.title} (${a.year})`).join('\n'),
          `\n\nCERTIFICATIONS:\n`,
          (member.certifications || []).map(c => `- ${c}`).join('\n'),
          `\n\nGenerated via IoT Innovation Club Portal`
        ], { type: 'text/plain' });
        
        element.href = URL.createObjectURL(file);
        element.download = `${(member.name || '').replace(/\s+/g, '_')}_Resume.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        setDownloading(false);
      }, 1000);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-dark)',
      padding: '110px 5% 50px 5%',
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 2
    }}>
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)} 
        className="btn-secondary"
        style={{
          marginBottom: '20px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          borderRadius: '4px'
        }}
      >
        <ArrowLeft size={16} /> Go Back
      </button>

      {/* Profile Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2.2fr',
        gap: '25px',
        alignItems: 'start'
      }} className="profile-layout-grid">
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Info Card */}
          <div className="glass-panel card-top-blue" style={{
            background: '#ffffff',
            borderRadius: '6px',
            overflow: 'hidden',
            textAlign: 'center',
            border: '1px solid #cbd5e1'
          }}>
            {/* cover banner */}
            <div style={{
              height: '80px',
              background: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)',
              position: 'relative'
            }}>
            </div>

            {/* Avatar */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-40px', marginBottom: '10px', position: 'relative', zIndex: 2 }}>
              <img
                src={member.photo}
                alt={member.name}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '4px', // blocky styled avatar
                  objectFit: 'cover',
                  border: '3px solid #ffffff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
            </div>

            {/* Basic Info */}
            <div style={{ padding: '0 16px 20px 16px' }}>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--text-white)', marginBottom: '3px', fontFamily: 'var(--font-heading)' }}>{member.name}</h2>
              <p style={{ color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '12px' }}>
                {member.position}
              </p>

              <div style={{ display: 'inline-block', padding: '2px 10px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '15px' }}>
                 Roster Classification: {member.year}
              </div>

              {/* Contacts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
                {member.socials?.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-gray)' }}>
                    <Mail size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{member.socials.email}</span>
                  </div>
                )}
                {member.socials?.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-gray)' }}>
                    <Phone size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <span>{member.socials.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="glass-panel" style={{
            padding: '12px',
            background: '#ffffff',
            borderRadius: '6px',
            display: 'flex',
            justifyContent: 'space-around',
            border: '1px solid #cbd5e1'
          }}>
            {member.socials?.linkedin && (
              <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-light)', transition: 'var(--transition-smooth)' }} className="profile-icon-btn">
                <Linkedin size={16} />
              </a>
            )}
            {member.socials?.github && (
              <a href={member.socials.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-light)', transition: 'var(--transition-smooth)' }} className="profile-icon-btn">
                <Github size={16} />
              </a>
            )}
            {member.socials?.portfolio && (
              <a href={member.socials.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-light)', transition: 'var(--transition-smooth)' }} className="profile-icon-btn">
                <Globe size={16} />
              </a>
            )}
          </div>

          {/* QR Code */}
          <div className="glass-panel" style={{
            padding: '16px',
            background: '#ffffff',
            borderRadius: '6px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '1px solid #cbd5e1'
          }}>
            <h4 style={{ color: 'var(--text-white)', fontSize: '0.85rem', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>Interactive QR Code</h4>
            <div style={{
              padding: '8px',
              background: '#ffffff',
              borderRadius: '4px',
              display: 'inline-flex',
              position: 'relative',
              border: '1px solid #cbd5e1',
            }}>
              <svg width="90" height="90" viewBox="0 0 100 100" style={{ shapeRendering: 'crispEdges' }}>
                <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" fill="#202124" />
                <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" fill="#202124" />
                <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" fill="#202124" />
                <path d="M40,5 h10 v10 h-10 z M55,0 h10 v20 h-10 z M45,25 h15 v5 h-15 z M5,45 h20 v10 h-20 z M40,40 h10 v15 h-10 z M60,40 h15 v10 h-15 z M80,45 h15 v20 h-15 z M35,70 h20 v10 h-20 z M65,75 h10 v10 h-10 z M45,90 h30 v5 h-30 z" fill="#202124" />
                <path d="M45,45 h10 v10 h-10 z" fill="#1a73e8" />
              </svg>
              {/* Subtle top scan line */}
              <div style={{
                position: 'absolute',
                left: '8px',
                right: '8px',
                height: '1.2px',
                backgroundColor: 'var(--primary)',
                animation: 'scan 2.8s linear infinite'
              }} />
            </div>
            <p style={{ color: 'var(--text-light)', fontSize: '0.72rem', marginTop: '10px', lineHeight: 1.3 }}>
              Scan vector matrix to bookmark this roster student path.
            </p>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Biography */}
          <div className="glass-panel card-top-blue" style={{ padding: '20px', background: '#ffffff', border: '1px solid #cbd5e1' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-white)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Cpu size={16} style={{ color: 'var(--secondary)' }} /> Biography
            </h3>
            <p style={{ color: 'var(--text-gray)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              {member.bio}
            </p>
          </div>

          {/* Education */}
          <div className="glass-panel" style={{ padding: '20px', background: '#ffffff', border: '1px solid #cbd5e1' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-white)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <BookOpen size={16} style={{ color: 'var(--primary)' }} /> Education
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(member.education || []).map((edu, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--secondary)',
                    marginTop: '6px'
                  }} />
                  <p style={{ color: 'var(--text-gray)', fontSize: '0.88rem', lineHeight: 1.3 }}>{edu}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="glass-panel" style={{ padding: '20px', background: '#ffffff', border: '1px solid #cbd5e1' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-white)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Layers size={16} style={{ color: 'var(--secondary)' }} /> Technical & Professional Skills
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <h4 style={{ color: 'var(--text-white)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Technical Focus</h4>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {(member.skillsTech || member.skills || []).map((skill, i) => (
                    <span key={i} style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '3px 8px',
                      background: 'var(--primary-glow)',
                      border: '1px solid rgba(26,115,232,0.15)',
                      color: 'var(--primary)',
                      borderRadius: '3px'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {member.skillsSoft && (member.skillsSoft || []).length > 0 && (
                <div>
                  <h4 style={{ color: 'var(--text-white)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Soft Skills</h4>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {(member.skillsSoft || []).map((skill, i) => (
                      <span key={i} style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        color: 'var(--text-light)',
                        borderRadius: '3px'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Projects */}
          {member.projects && (member.projects || []).length > 0 && (
            <div className="glass-panel" style={{ padding: '20px', background: '#ffffff', border: '1px solid #cbd5e1' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-white)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Cpu size={16} style={{ color: 'var(--primary)' }} /> Projects
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(member.projects || []).map((proj, idx) => (
                  <div key={idx} style={{
                    padding: '12px',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px'
                  }}>
                    <h4 style={{ fontSize: '0.92rem', color: 'var(--text-white)', marginBottom: '4px' }}>{proj.name}</h4>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.8rem', lineHeight: 1.35, marginBottom: '6px' }}>{proj.description}</p>
                    {proj.url && (
                      <a href={proj.url} target="_blank" rel="noopener noreferrer" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '0.78rem',
                        color: 'var(--secondary)',
                        textDecoration: 'none',
                        fontWeight: 600
                      }} className="proj-link-hover">
                        Repository <ArrowLeft size={10} style={{ transform: 'rotate(180deg)' }} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {member.achievements && (member.achievements || []).length > 0 && (
            <div className="glass-panel" style={{ padding: '20px', background: '#ffffff', border: '1px solid #cbd5e1' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-white)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Award size={16} style={{ color: 'var(--secondary)' }} /> Achievements
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(member.achievements || []).map((ach, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <CheckCircle size={14} style={{ color: 'var(--secondary)' }} />
                      <span style={{ color: 'var(--text-white)', fontSize: '0.85rem', fontWeight: 500 }}>{ach.title}</span>
                      {ach.org && <span style={{ color: 'var(--text-light)', fontSize: '0.82rem' }}>({ach.org})</span>}
                    </div>
                    <span style={{ color: 'var(--text-light)', fontSize: '0.82rem' }}>{ach.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {member.certifications && (member.certifications || []).length > 0 && (
            <div className="glass-panel" style={{ padding: '20px', background: '#ffffff', border: '1px solid #cbd5e1' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-white)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Award size={16} style={{ color: 'var(--primary)' }} /> Certifications
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(member.certifications || []).map((cert, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'center', color: 'var(--text-light)', fontSize: '0.82rem' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--secondary)' }} />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Download Resume */}
          <div className="glass-panel card-top-blue" style={{
            padding: '20px',
            background: 'var(--primary-glow)',
            borderRadius: '6px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}>
            <FileText size={32} style={{ color: 'var(--primary)' }} />
            <div>
              <h4 style={{ color: 'var(--text-white)', fontSize: '0.92rem', marginBottom: '2px' }}>Student Resume</h4>
              <p style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>
                Download the structured text resume sheet for {member.name}.
              </p>
            </div>
            <button 
              onClick={handleDownloadResume} 
              disabled={downloading}
              className="btn-primary" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                fontSize: '0.85rem',
                borderRadius: '4px'
              }}
            >
              {downloading ? (
                <>Packing File...</>
              ) : (
                <>
                  Download Resume <Download size={12} />
                </>
              )}
            </button>
          </div>

        </div>

      </div>

      <style>{`
        @keyframes scan {
          0% { top: 8px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 98px; opacity: 0; }
        }
        .profile-icon-btn:hover {
          color: var(--primary) !important;
        }
        .proj-link-hover:hover {
          text-decoration: underline !important;
        }
        @media (max-width: 900px) {
          .profile-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
};
