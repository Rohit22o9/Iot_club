import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Mail, 
  ExternalLink, Globe, Cpu, Users, Layers, Trophy, 
  ChevronRight
} from 'lucide-react';
import { Github, Linkedin } from '../components/BrandIcons';
import { useIoTStore } from '../data/store';
import { CanvasBackground } from '../components/CanvasBackground';
import { Counter } from '../components/Counter';
import { Lightbox } from '../components/Lightbox';

// Typing text component
const TypingText: React.FC<{ words: string[] }> = ({ words }) => {
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;
    const word = words[currentWordIdx];
    const typingSpeed = isDeleting ? 40 : 100;

    let timer = setTimeout(() => {
      if (!isDeleting && currentText === word) {
        timer = setTimeout(() => setIsDeleting(true), 1800);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentWordIdx((prev) => (prev + 1) % words.length);
      } else {
        setCurrentText(
          isDeleting
            ? word.substring(0, currentText.length - 1)
            : word.substring(0, currentText.length + 1)
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIdx, words]);

  return (
    <span style={{ 
      color: 'var(--primary)', 
      borderRight: '3px solid var(--primary)', 
      paddingRight: '6px',
      animation: 'blink 0.8s step-end infinite' 
    }}>
      {currentText}
      <style>{`
        @keyframes blink {
          from, to { border-color: transparent }
          50% { border-color: var(--primary); }
        }
      `}</style>
    </span>
  );
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const store = useIoTStore();
  const {
    homepageContent,
    members,
    projects,
    achievements,
    activities,
    faculty,
    gallery
  } = store;

  // State definitions
  const [activeAchievementFilter, setActiveAchievementFilter] = useState<'all' | 'hackathon' | 'competition' | 'paper' | 'certification'>('all');
  const [activeGalleryFilter, setActiveGalleryFilter] = useState<string>('all');
  const [lightboxData, setLightboxData] = useState<{ isOpen: boolean; index: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) * 0.05;
    const y = (clientY - window.innerHeight / 2) * 0.05;
    setMousePos({ x, y });
  };

  // Group members count
  const seCount = members.filter(m => m.year === 'SE').length;
  const teCount = members.filter(m => m.year === 'TE').length;
  const beCount = members.filter(m => m.year === 'BE').length;
  const activeMembersTotal = seCount + teCount + beCount;

  // Filtered achievements
  const filteredAchievements = activeAchievementFilter === 'all'
    ? achievements
    : achievements.filter(a => a.category === activeAchievementFilter);

  // Filtered gallery items
  const filteredGallery = activeGalleryFilter === 'all'
    ? gallery
    : gallery.filter(g => g.category === activeGalleryFilter);



  const scrollIntoView = (id: string) => {
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
    <div style={{ position: 'relative', backgroundColor: 'var(--bg-dark)' }}>
      
      {/* 1. HERO SECTION (Refined Centered Minimalist & Premium) */}
      <section 
        id="hero" 
        onMouseMove={handleMouseMove}
        className="hero-section-refined"
      >
        {/* Brushed metal & faint purposeful circuit background */}
        <div className="hero-panel-texture" />
        <CanvasBackground mousePos={mousePos} />

        {/* Centered Hero Composition */}
        <div className="hero-centered-container">
          
          {/* Kicker Pill Badge */}
          <div className="hero-kicker-pill">
            <span className="hero-live-indicator" />
            <span>IoT Innovation Club</span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ color: 'var(--primary)' }}>Hardware & Edge AI Lab</span>
          </div>

          {/* Monumental Headline */}
          <h1 className="hero-main-heading">
            Build. Innovate.<br />
            Engineer the Future.
          </h1>

          {/* Integrated Subtitle & Lead Paragraph */}
          <div className="hero-lead-container">
            <div className="hero-typing-line">
              We Learn to <TypingText words={homepageContent.typingText} />
            </div>
            <p className="hero-description-text">
              {homepageContent.tagline} A premier student engineering hub where developers and hardware hackers collaborate to build next-generation embedded firmware, telemetry networks, and edge intelligence systems.
            </p>
          </div>

          {/* Centered Polished CTAs */}
          <div className="hero-cta-group">
            <button 
              onClick={() => navigate('/signup')} 
              className="hero-btn-primary"
            >
              <span>Join Club</span>
              <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => scrollIntoView('members')} 
              className="hero-btn-secondary"
            >
              <span>Explore Roster</span>
              <Users size={16} />
            </button>
          </div>

          {/* Symmetrical Centered Trusted Technologies */}
          <div className="hero-tech-ecosystem">
            <div className="hero-tech-title">
              Trusted Technologies & Platforms
            </div>
            <div className="hero-tech-pill-row">
              {['Arduino', 'ESP32', 'Raspberry Pi', 'STM32', 'MQTT', 'Edge AI', 'Robotics', 'Embedded Systems', 'TinyML', 'FreeRTOS'].map(badge => (
                <span key={badge} className="hero-tech-pill">{badge}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          onClick={() => scrollIntoView('about')}
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
            transition: 'var(--transition-smooth)'
          }}
          title="Scroll to Club Overview"
        >
          <ChevronRight size={16} style={{ transform: 'rotate(90deg)' }} />
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" style={{ backgroundColor: 'var(--bg-page)' }}>
        <div className="section-title-container">
          <h2 className="section-title">Club Overview</h2>
          <p className="section-subtitle">Bridging theoretical calculations with physical hardware prototyping and software nodes.</p>
        </div>

        <div className="grid-2" style={{ alignItems: 'start', gap: '30px', marginBottom: '25px' }}>
          <div className="glass-panel" style={{
            padding: '24px',
            background: '#ffffff',
            borderRadius: '6px',
            border: '1px solid var(--border-glass)'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={20} style={{ color: 'var(--primary)' }} /> Prototyping Chapter
            </h3>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '12px' }}>
              {homepageContent.aboutIntro}
            </p>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.5 }}>
              Our labs provide students with test equipment, microcontrollers, and computing modules. We guide members through design schematic entries, PCB layouts, native embedded software SDKs, and data aggregations.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Vision */}
            <div className="glass-panel card-top-blue" style={{ padding: '20px', display: 'flex', gap: '15px', background: '#ffffff', borderRadius: '6px' }}>
              <div style={{
                background: 'var(--primary-glow)',
                width: '40px',
                height: '40px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                flexShrink: 0
              }}>
                <Globe size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', color: '#1e293b', marginBottom: '4px' }}>Vision Statement</h4>
                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.4 }}>{homepageContent.aboutVision}</p>
              </div>
            </div>

            {/* Mission */}
            <div className="glass-panel card-top-green" style={{ padding: '20px', display: 'flex', gap: '15px', background: '#ffffff', borderRadius: '6px' }}>
              <div style={{
                background: 'rgba(15, 157, 88, 0.08)',
                width: '40px',
                height: '40px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gdg-green)',
                flexShrink: 0
              }}>
                <Layers size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', color: '#1e293b', marginBottom: '4px' }}>Mission Statement</h4>
                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.4 }}>{homepageContent.aboutMission}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Objectives */}
        <div className="glass-panel" style={{ padding: '20px', background: '#ffffff', borderRadius: '6px' }}>
          <h4 style={{ fontSize: '1.1rem', color: '#1e293b', marginBottom: '12px', textAlign: 'center' }}>Key Objectives</h4>
          <div className="grid-2" style={{ gap: '12px' }}>
            {homepageContent.aboutObjectives.map((obj, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <ChevronRight size={14} style={{ color: 'var(--primary)', marginTop: '3px', flexShrink: 0 }} />
                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.4 }}>{obj}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. STATISTICS SECTION */}
      <section id="stats" style={{ paddingBottom: '25px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '15px',
          textAlign: 'center',
        }}>
          {[
            { target: activeMembersTotal || 45, label: 'Active Members', borderClass: 'card-top-blue' },
            { target: projects.length || 24, label: 'Completed Projects', borderClass: 'card-top-green' },
            { target: activities.length + 15 || 18, label: 'Conducted Bootcamps', borderClass: 'card-top-red' },
            { target: achievements.length + 8 || 12, label: 'Awards & Hackathons', borderClass: 'card-top-yellow' },
            { target: 35, label: 'Certifications', borderClass: 'card-top-blue' },
            { target: 8, label: 'Corporate Partners', borderClass: 'card-top-green' }
          ].map((stat, i) => (
            <div key={i} className={`glass-panel ${stat.borderClass}`} style={{ padding: '20px 10px', background: '#ffffff', borderRadius: '6px' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#1e293b', fontFamily: 'var(--font-heading)' }}>
                <Counter target={stat.target} suffix="+" />
              </div>
              <p style={{ color: '#475569', fontWeight: 600, marginTop: '4px', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>



      {/* 5. ACHIEVEMENTS SECTION */}
      <section id="achievements">
        <div className="section-title-container">
          <h2 className="section-title">Achievements Wall</h2>
          <p className="section-subtitle">Recognizing hardware hackathons, published papers, and outstanding technical milestones.</p>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '6px',
          flexWrap: 'wrap',
          marginBottom: '25px'
        }}>
          {(['all', 'hackathon', 'competition', 'paper', 'certification'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveAchievementFilter(filter)}
              style={{
                padding: '5px 14px',
                borderRadius: '4px',
                border: '1px solid',
                borderColor: activeAchievementFilter === filter ? 'var(--primary)' : '#dadce0',
                background: activeAchievementFilter === filter ? 'var(--primary)' : '#ffffff',
                color: activeAchievementFilter === filter ? '#ffffff' : 'var(--text-light)',
                cursor: 'pointer',
                fontFamily: 'var(--font-main)',
                fontSize: '0.82rem',
                fontWeight: 500,
                textTransform: 'capitalize',
                transition: 'var(--transition-smooth)'
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid-2">
          {filteredAchievements.map((ach, idx) => {
            const borderClass = 
              idx % 4 === 0 ? 'card-top-blue' :
              idx % 4 === 1 ? 'card-top-green' :
              idx % 4 === 2 ? 'card-top-red' : 'card-top-yellow';
            
            return (
              <div key={ach.id} className={`glass-panel ${borderClass}`} style={{
                padding: '20px',
                background: '#ffffff',
                borderRadius: '6px',
                display: 'flex',
                gap: '15px',
              }}>
                <div style={{
                  background: 'var(--primary-glow)',
                  width: '44px',
                  height: '44px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  flexShrink: 0
                }}>
                  <Trophy size={20} />
                </div>

                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '5px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)' }}>
                      {ach.award}
                    </span>
                    <span style={{ color: '#475569', fontSize: '0.78rem' }}>{ach.date}</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', color: '#1e293b', marginBottom: '4px' }}>{ach.title}</h3>
                  <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.4 }}>{ach.description}</p>
                </div>

                {ach.image && (
                  <div 
                    onClick={() => {
                      const gIndex = gallery.findIndex(g => g.image === ach.image);
                      if (gIndex !== -1) {
                        setLightboxData({ isOpen: true, index: gIndex });
                      }
                    }}
                    style={{
                      width: '78px',
                      height: '78px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      cursor: 'pointer',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}
                    title="Click to preview award photo"
                  >
                    <img 
                      src={ach.image} 
                      alt={ach.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. PROJECTS SECTION */}
      <section id="projects" style={{ backgroundColor: 'var(--bg-page)' }}>
        <div className="section-title-container">
          <h2 className="section-title">Featured Portfolios</h2>
          <p className="section-subtitle">Real-world hardware, firmware, and edge intelligence systems engineered by student squads.</p>
        </div>

        <div className="grid-2">
          {projects.map((proj, idx) => {
            const borderClass = idx % 2 === 0 ? 'card-top-blue' : 'card-top-green';
            return (
              <div key={proj.id} className={`glass-panel ${borderClass}`} style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#ffffff',
                borderRadius: '6px',
                overflow: 'hidden',
                height: '100%'
              }}>
                <div style={{ height: '170px', overflow: 'hidden', position: 'relative' }}>
                  <img src={proj.image} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {proj.tags.map((t, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '2px 6px',
                        background: '#f1f5f9',
                        borderRadius: '3px',
                        color: '#475569'
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <h3 style={{ fontSize: '1.15rem', color: '#1e293b', marginBottom: '6px' }}>{proj.title}</h3>
                  <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.45, marginBottom: '15px', flexGrow: 1 }}>
                    {proj.description}
                  </p>

                  {/* Squad members temporarily hidden until updated details are provided */}

                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                    <a href={proj.github} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexGrow: 1,
                      justifyContent: 'center',
                      padding: '8px 0',
                      fontSize: '0.85rem'
                    }}>
                      <Github size={14} /> Repository
                    </a>
                    <a href={proj.demo} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexGrow: 1,
                      justifyContent: 'center',
                      padding: '8px 0',
                      fontSize: '0.85rem'
                    }}>
                      Live Demo <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. GALLERY SECTION */}
      <section id="gallery">
        <div className="section-title-container">
          <h2 className="section-title">Branch Gallery</h2>
          <p className="section-subtitle">Snapshots of workspaces, guest sessions, hackathons, and lab explorations.</p>
        </div>

        {/* Gallery filters */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '6px',
          flexWrap: 'wrap',
          marginBottom: '25px'
        }}>
          {['all', 'workshops', 'competitions', 'seminars', 'guest lectures', 'events'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveGalleryFilter(cat)}
              style={{
                padding: '5px 12px',
                borderRadius: '4px',
                border: '1px solid',
                borderColor: activeGalleryFilter === cat ? 'var(--primary)' : '#dadce0',
                background: activeGalleryFilter === cat ? 'var(--primary)' : '#ffffff',
                color: activeGalleryFilter === cat ? '#ffffff' : 'var(--text-light)',
                cursor: 'pointer',
                fontFamily: 'var(--font-main)',
                fontSize: '0.82rem',
                textTransform: 'capitalize',
                transition: 'var(--transition-smooth)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry */}
        <div style={{
          columnCount: 3,
          columnGap: '12px',
          width: '100%',
        }} className="gallery-masonry">
          {filteredGallery.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLightboxData({ isOpen: true, index: idx })}
              style={{
                breakInside: 'avoid',
                marginBottom: '12px',
                borderRadius: '6px',
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                border: '1px solid #e5e7eb',
                background: '#ffffff',
                boxShadow: 'var(--card-shadow)'
              }}
              className="gallery-item-card"
            >
              <img src={item.image} alt={item.title} style={{ width: '100%', display: 'block', transition: 'var(--transition-smooth)' }} className="gallery-image" />
              <div 
                className="gallery-item-overlay"
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(0deg, rgba(32,33,36,0.85) 0%, rgba(32,33,36,0.1) 100%)',
                  opacity: 0,
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '12px',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--gdg-yellow)', fontWeight: 700 }}>{item.category}</span>
                  <h4 style={{ color: '#ffffff', fontSize: '0.88rem', marginTop: '2px' }}>{item.title}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>

        {lightboxData && lightboxData.isOpen && (
          <Lightbox
            images={filteredGallery.map((g) => g.image)}
            titles={filteredGallery.map((g) => g.title)}
            initialIndex={lightboxData.index}
            onClose={() => setLightboxData(null)}
          />
        )}

        <style>{`
          .gallery-item-card:hover .gallery-image {
            transform: scale(1.02);
          }
          .gallery-item-card:hover .gallery-item-overlay {
            opacity: 1 !important;
          }
          @media (max-width: 1024px) {
            .gallery-masonry {
              column-count: 2 !important;
            }
          }
          @media (max-width: 768px) {
            .gallery-masonry {
              column-count: 1 !important;
            }
          }
        `}</style>
      </section>

      {/* 8. MEMBERS DEPARTMENT PORTAL */}
      <section id="members" style={{ backgroundColor: 'var(--bg-page)' }}>
        <div className="section-title-container">
          <h2 className="section-title">Student Directory</h2>
          <p className="section-subtitle">Meet our student team members grouped by their academic year classifications.</p>
        </div>

        <div className="grid-3">
          {/* SE */}
          <div className="glass-panel card-top-green member-dept-card" style={{
            padding: '24px',
            textAlign: 'center',
            background: '#ffffff',
            borderRadius: '6px',
          }}>
            <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '8px' }}>Second Year (SE)</h3>
            <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '15px', lineHeight: 1.4 }}>
              Learning fundamental breadboard setups, sensor protocols, and C++ logic.
            </p>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--gdg-green)', marginBottom: '15px' }}>
              {seCount} Roster Student{seCount !== 1 ? 's' : ''}
            </div>
            <button onClick={() => navigate('/members/se')} className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'var(--gdg-green)' }}>
              View Directory <ChevronRight size={14} />
            </button>
          </div>

          {/* TE */}
          <div className="glass-panel card-top-blue member-dept-card" style={{
            padding: '24px',
            textAlign: 'center',
            background: '#ffffff',
            borderRadius: '6px',
          }}>
            <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '8px' }}>Third Year (TE)</h3>
            <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '15px', lineHeight: 1.4 }}>
              Developing firmware, multithreading operations, and MQTT server routing.
            </p>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '15px' }}>
              {teCount} Roster Student{teCount !== 1 ? 's' : ''}
            </div>
            <button onClick={() => navigate('/members/te')} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              View Directory <ChevronRight size={14} />
            </button>
          </div>

          {/* BE */}
          <div className="glass-panel card-top-red member-dept-card" style={{
            padding: '24px',
            textAlign: 'center',
            background: '#ffffff',
            borderRadius: '6px',
          }}>
            <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '8px' }}>Final Year (BE)</h3>
            <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '15px', lineHeight: 1.4 }}>
              Providing thesis topics, code reviews, and industry collaborations.
            </p>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--gdg-red)', marginBottom: '15px' }}>
              {beCount} Roster Student{beCount !== 1 ? 's' : ''}
            </div>
            <button onClick={() => navigate('/members/be')} className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'var(--gdg-red)' }}>
              View Directory <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 9. FACULTY SECTION */}
      <section id="faculty">
        <div className="section-title-container">
          <h2 className="section-title">Faculty Mentors</h2>
          <p className="section-subtitle">Dedicated academic advisors guiding our research labs and technical programs.</p>
        </div>

        <div className="grid-2" style={{ maxWidth: '900px', margin: '0 auto' }}>
          {faculty.map((fac) => (
            <div key={fac.id} className="glass-panel card-top-blue" style={{
              padding: '20px',
              background: '#ffffff',
              borderRadius: '6px',
              display: 'flex',
              gap: '15px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <img
                src={fac.photo || '/default-avatar.svg'}
                alt={fac.name}
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #e2e8f0',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}
              />
              <div>
                <h3 style={{ fontSize: '1.05rem', color: '#1e293b', marginBottom: '3px' }}>{fac.name}</h3>
                <p style={{ color: '#475569', fontWeight: 500, fontSize: '0.82rem', marginBottom: '8px' }}>{fac.role}</p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <a href={`mailto:${fac.email}`} style={{ color: '#475569' }} className="fac-social-icon">
                    <Mail size={15} />
                  </a>
                  {fac.linkedin && (
                    <a href={fac.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#475569' }} className="fac-social-icon">
                      <Linkedin size={15} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>



    </div>
  );
};
