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
      
      {/* 1. HERO SECTION */}
      <section 
        id="hero" 
        onMouseMove={handleMouseMove}
        style={{
          height: '78vh',
          minHeight: '640px',
          maxHeight: '780px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '80px',
          paddingBottom: '20px',
          backgroundColor: '#ffffff'
        }}
      >
        {/* PCB schematic watermark background */}
        <CanvasBackground />

        <div className="hero-grid-layout">
          
          {/* LEFT COLUMN: Text Content */}
          <div className="hero-left-col">
            {/* Sub-headline */}
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1.8px',
              color: 'var(--primary)',
              marginBottom: '10px'
            }}>
              IoT Innovation Club
            </div>

            {/* Bold Headline */}
            <h1 style={{
              fontSize: '2.8rem',
              lineHeight: 1.15,
              fontWeight: 800,
              color: 'var(--text-white)',
              marginBottom: '10px',
              letterSpacing: '-0.8px'
            }}>
              Build. Innovate.<br />Engineer the Future.
            </h1>

            {/* Typing text Tagline */}
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.4rem',
              fontWeight: 600,
              marginBottom: '12px',
              color: 'var(--text-gray)'
            }}>
              We Learn to <TypingText words={homepageContent.typingText} />
            </div>

            {/* Spacing & Readability Description */}
            <p style={{
              color: 'var(--text-light)',
              fontSize: '0.94rem',
              lineHeight: 1.55,
              maxWidth: '520px',
              marginBottom: '25px',
              fontWeight: 400
            }}>
              {homepageContent.tagline}
            </p>

            {/* CTAs */}
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              marginBottom: '30px'
            }}>
              <button onClick={() => navigate('/signup')} className="btn-primary" style={{ padding: '10px 22px', borderRadius: '4px' }}>
                Join Club <ArrowRight size={14} />
              </button>
              <button onClick={() => scrollIntoView('members')} className="btn-secondary" style={{ padding: '10px 22px', borderRadius: '4px' }}>
                Explore Roster <Users size={14} />
              </button>
            </div>

            {/* Technology Badges Row */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '15px' }}>
              <div style={{
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--text-light)',
                fontWeight: 700,
                marginBottom: '8px'
              }}>
                Trusted Technologies
              </div>
              <div className="hero-tech-badge-container">
                {['Arduino', 'ESP32', 'Raspberry Pi', 'STM32', 'MQTT', 'Edge AI', 'Robotics', 'Embedded Systems'].map(badge => (
                  <span key={badge} className="hero-tech-badge">{badge}</span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Vector SVG Illustration */}
          <div className="hero-right-col">
            <div className="animate-float" style={{
              width: '100%',
              maxWidth: '440px',
              aspectRatio: '1/1',
              position: 'relative'
            }}>
              <svg 
                viewBox="0 0 500 500" 
                width="100%" 
                height="100%" 
                style={{ overflow: 'visible' }}
              >
                {/* LAYER 1: Animated Connected Circuit Lines (Parallax factor: 0.4) */}
                <g style={{
                  transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)`,
                  transition: 'transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)'
                }}>
                  {/* Central Hub to Cloud */}
                  <path d="M 250,250 L 250,75" fill="none" stroke="rgba(26,115,232,0.25)" strokeWidth="2" />
                  <path d="M 250,250 L 250,75" fill="none" stroke="var(--primary)" strokeWidth="2" className="circuit-path-animated" />

                  {/* Central Hub to AI Chip */}
                  <path d="M 250,250 L 370,130" fill="none" stroke="rgba(26,115,232,0.25)" strokeWidth="2" />
                  <path d="M 250,250 L 370,130" fill="none" stroke="var(--primary)" strokeWidth="2" className="circuit-path-animated" />

                  {/* Central Hub to WiFi */}
                  <path d="M 250,250 L 415,250" fill="none" stroke="rgba(26,115,232,0.25)" strokeWidth="2" />
                  <path d="M 250,250 L 415,250" fill="none" stroke="var(--primary)" strokeWidth="2" className="circuit-path-animated" />

                  {/* Central Hub to Sensors */}
                  <path d="M 250,250 L 370,370" fill="none" stroke="rgba(26,115,232,0.25)" strokeWidth="2" />
                  <path d="M 250,250 L 370,370" fill="none" stroke="var(--primary)" strokeWidth="2" className="circuit-path-animated" />

                  {/* Central Hub to Robot Arm */}
                  <path d="M 250,250 L 250,425" fill="none" stroke="rgba(26,115,232,0.25)" strokeWidth="2" />
                  <path d="M 250,250 L 250,425" fill="none" stroke="var(--primary)" strokeWidth="2" className="circuit-path-animated" />

                  {/* Central Hub to Drone */}
                  <path d="M 250,250 L 130,370" fill="none" stroke="rgba(26,115,232,0.25)" strokeWidth="2" />
                  <path d="M 250,250 L 130,370" fill="none" stroke="var(--primary)" strokeWidth="2" className="circuit-path-animated" />

                  {/* Central Hub to Raspberry Pi */}
                  <path d="M 250,250 L 85,250" fill="none" stroke="rgba(26,115,232,0.25)" strokeWidth="2" />
                  <path d="M 250,250 L 85,250" fill="none" stroke="var(--primary)" strokeWidth="2" className="circuit-path-animated" />

                  {/* Central Hub to ESP32 */}
                  <path d="M 250,250 L 130,130" fill="none" stroke="rgba(26,115,232,0.25)" strokeWidth="2" />
                  <path d="M 250,250 L 130,130" fill="none" stroke="var(--primary)" strokeWidth="2" className="circuit-path-animated" />
                </g>

                {/* LAYER 2: Central PCB Gateway Hub (Parallax factor: 0.7) */}
                <g style={{
                  transform: `translate(${mousePos.x * 0.7}px, ${mousePos.y * 0.7}px)`,
                  transition: 'transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)'
                }}>
                  {/* Central Hub Shadow */}
                  <circle cx="250" cy="250" r="54" fill="rgba(60,64,67,0.06)" />
                  
                  {/* Outer PCB ring */}
                  <circle cx="250" cy="250" r="48" fill="#ffffff" stroke="var(--primary)" strokeWidth="3" />
                  <circle cx="250" cy="250" r="44" fill="none" stroke="var(--primary-glow)" strokeWidth="2" strokeDasharray="6 3" />
                  
                  {/* Inner MCU Chip representation */}
                  <rect x="230" y="230" width="40" height="40" rx="4" fill="#202124" />
                  
                  {/* Gold pin lines */}
                  <path d="M 225,236 h 5 M 225,244 h 5 M 225,252 h 5 M 225,260 h 5
                           M 270,236 h 5 M 270,244 h 5 M 270,252 h 5 M 270,260 h 5
                           M 236,225 v 5 M 244,225 v 5 M 252,225 v 5 M 260,225 v 5
                           M 236,270 v 5 M 244,270 v 5 M 252,270 v 5 M 260,270 v 5"
                        fill="none" stroke="#fbbc05" strokeWidth="1.5" />
                  
                  <text x="250" y="252" fontSize="7" fontFamily="monospace" fill="#ffffff" fontWeight="bold" textAnchor="middle">IoT</text>
                </g>

                {/* LAYER 3: Peripheral Orbital Nodes (Parallax factor: 1.0) */}
                <g style={{
                  transform: `translate(${mousePos.x * 1.0}px, ${mousePos.y * 1.0}px)`,
                  transition: 'transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)'
                }}>
                  {/* 1. Cloud Connectivity (Top Center: 250, 75) */}
                  <g transform="translate(250, 75)">
                    <circle cx="0" cy="0" r="24" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))' }} />
                    {/* Cloud Icon */}
                    <path d="M -8,3 a 5,5 0 0 1 0,-10 a 7,7 0 0 1 13,-2 a 5,5 0 0 1 0,10 z" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" />
                  </g>

                  {/* 2. AI Chip (Top Right: 370, 130) */}
                  <g transform="translate(370, 130)">
                    <circle cx="0" cy="0" r="24" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))' }} />
                    {/* Brain pathways icon */}
                    <rect x="-8" y="-8" width="16" height="16" rx="2" fill="none" stroke="var(--gdg-green)" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="3" fill="var(--gdg-green)" />
                    <line x1="-8" y1="0" x2="-12" y2="0" stroke="var(--gdg-green)" strokeWidth="1.2" />
                    <line x1="8" y1="0" x2="12" y2="0" stroke="var(--gdg-green)" strokeWidth="1.2" />
                    <line x1="0" y1="-8" x2="0" y2="-12" stroke="var(--gdg-green)" strokeWidth="1.2" />
                    <line x1="0" y1="8" x2="0" y2="12" stroke="var(--gdg-green)" strokeWidth="1.2" />
                  </g>

                  {/* 3. WiFi Signals (Middle Right: 415, 250) */}
                  <g transform="translate(415, 250)">
                    <circle cx="0" cy="0" r="24" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))' }} />
                    {/* WiFi Icon */}
                    <circle cx="0" cy="6" r="1.5" fill="var(--primary)" />
                    <path d="M -5,1 a 7,7 0 0 1 10,0" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M -9,-3 a 12,12 0 0 1 18,0" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" />
                  </g>

                  {/* 4. Sensors (Bottom Right: 370, 370) */}
                  <g transform="translate(370, 370)">
                    <circle cx="0" cy="0" r="24" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))' }} />
                    {/* Analog Dial / Gauge Icon */}
                    <path d="M -8,5 a 10,10 0 1 1 16,0" fill="none" stroke="var(--gdg-red)" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="0" y1="4" x2="4" y2="-3" stroke="var(--gdg-red)" strokeWidth="1.5" strokeLinecap="round" />
                  </g>

                  {/* 5. Robot Arm (Bottom Center: 250, 425) */}
                  <g transform="translate(250, 425)">
                    <circle cx="0" cy="0" r="24" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))' }} />
                    {/* Mechanical arm schematic */}
                    <rect x="-10" y="6" width="20" height="4" fill="none" stroke="var(--gdg-yellow)" strokeWidth="1.5" />
                    <line x1="-5" y1="6" x2="0" y2="-4" stroke="var(--gdg-yellow)" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="0" y1="-4" x2="8" y2="-8" stroke="var(--gdg-yellow)" strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="0" cy="-4" r="2" fill="var(--gdg-yellow)" />
                  </g>

                  {/* 6. Drone (Bottom Left: 130, 370) */}
                  <g transform="translate(130, 370)">
                    <circle cx="0" cy="0" r="24" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))' }} />
                    {/* Quadcopter cross outline */}
                    <line x1="-10" y1="-10" x2="10" y2="10" stroke="var(--primary)" strokeWidth="1.5" />
                    <line x1="-10" y1="10" x2="10" y2="-10" stroke="var(--primary)" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="4" fill="#ffffff" stroke="var(--primary)" strokeWidth="1.5" />
                    {/* Little rotors */}
                    <line x1="-12" y1="-10" x2="-8" y2="-10" stroke="var(--primary)" strokeWidth="1" />
                    <line x1="8" y1="-10" x2="12" y2="-10" stroke="var(--primary)" strokeWidth="1" />
                    <line x1="-12" y1="10" x2="-8" y2="10" stroke="var(--primary)" strokeWidth="1" />
                    <line x1="8" y1="10" x2="12" y2="10" stroke="var(--primary)" strokeWidth="1" />
                  </g>

                  {/* 7. Raspberry Pi (Middle Left: 85, 250) */}
                  <g transform="translate(85, 250)">
                    <circle cx="0" cy="0" r="24" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))' }} />
                    {/* Berry emblem vector representation */}
                    <circle cx="-3" cy="2" r="5" fill="none" stroke="var(--gdg-red)" strokeWidth="1.5" />
                    <circle cx="3" cy="2" r="5" fill="none" stroke="var(--gdg-red)" strokeWidth="1.5" />
                    <circle cx="0" cy="-3" r="4.5" fill="none" stroke="var(--gdg-red)" strokeWidth="1.5" />
                    <path d="M -3,-7 Q 0,-3 3,-7" fill="none" stroke="var(--gdg-green)" strokeWidth="1.5" />
                  </g>

                  {/* 8. ESP32 (Top Left: 130, 130) */}
                  <g transform="translate(130, 130)">
                    <circle cx="0" cy="0" r="24" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))' }} />
                    {/* Microchip pin details */}
                    <rect x="-8" y="-9" width="16" height="18" rx="1.5" fill="none" stroke="var(--gdg-yellow)" strokeWidth="1.5" />
                    <line x1="-11" y1="-5" x2="-8" y2="-5" stroke="var(--gdg-yellow)" strokeWidth="1.2" />
                    <line x1="-11" y1="0" x2="-8" y2="0" stroke="var(--gdg-yellow)" strokeWidth="1.2" />
                    <line x1="-11" y1="5" x2="-8" y2="5" stroke="var(--gdg-yellow)" strokeWidth="1.2" />
                    <line x1="8" y1="-5" x2="11" y2="-5" stroke="var(--gdg-yellow)" strokeWidth="1.2" />
                    <line x1="8" y1="0" x2="11" y2="0" stroke="var(--gdg-yellow)" strokeWidth="1.2" />
                    <line x1="8" y1="5" x2="11" y2="5" stroke="var(--gdg-yellow)" strokeWidth="1.2" />
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          onClick={() => scrollIntoView('about')}
          style={{
            position: 'absolute',
            bottom: '25px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'var(--text-light)',
            fontSize: '0.78rem'
          }}
        >
          <ChevronRight size={16} className="scroll-indicator-arrow" />
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

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '15px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>Squad:</span>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {proj.team.map((name, i) => (
                        <span key={i} style={{
                          fontSize: '0.75rem',
                          color: 'var(--primary)',
                          background: 'var(--primary-glow)',
                          padding: '1px 6px',
                          borderRadius: '3px'
                        }}>
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>

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
                src={fac.photo}
                alt={fac.name}
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '4px',
                  objectFit: 'cover',
                  border: '1.5px solid var(--border-glass)',
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
