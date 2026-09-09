import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, ArrowRight, Download, Cpu, Star, ExternalLink, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';
import type { Profile, Experience, Education, Skill, Achievement } from '../types';
import {
  fallbackProfile,
  fallbackExperiences,
  fallbackEducation,
  fallbackSkills,
  fallbackAchievements
} from '../data/mockData';
import Timeline from '../components/Timeline';

export default function Home() {
  const [profile, setProfile] = useState<Profile>(fallbackProfile);
  const [experiences, setExperiences] = useState<Experience[]>(fallbackExperiences);
  const [education, setEducation] = useState<Education[]>(fallbackEducation);
  const [skills, setSkills] = useState<Skill[]>(fallbackSkills);
  const [achievements, setAchievements] = useState<Achievement[]>(fallbackAchievements);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // 1. Fetch Profile
        const profileData = await api.getProfile();
        if (profileData) {
          setProfile(profileData);
        } else {
          setUsingFallback(true);
        }

        // 2. Fetch Experiences
        const expData = await api.getExperiences();
        if (expData && expData.length > 0) {
          setExperiences(expData);
        }

        // 3. Fetch Education
        const eduData = await api.getEducation();
        if (eduData && eduData.length > 0) {
          setEducation(eduData);
        }

        // 4. Fetch Skills
        const skillData = await api.getSkills();
        if (skillData && skillData.length > 0) {
          setSkills(skillData);
        }

        // 5. Fetch Achievements
        const achData = await api.getAchievements();
        if (achData && achData.length > 0) {
          setAchievements(achData);
        }

      } catch (err) {
        console.error('Error fetching data from API, using local seed fallback:', err);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Handle contact form submission (mailto client-side format with backend logging)
  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Log communication to server API
      await api.submitContact(contactForm.name, contactForm.email, contactForm.subject, contactForm.message);

      // 2. Open client mailto link
      const emailTo = profile.contact_email || 'shreyash.choudhari@example.com';
      const body = encodeURIComponent(
        `Name: ${contactForm.name}\nEmail: ${contactForm.email}\n\nMessage:\n${contactForm.message}`
      );
      const mailtoUrl = `mailto:${emailTo}?subject=${encodeURIComponent(contactForm.subject)}&body=${body}`;
      
      window.location.href = mailtoUrl;
      setSubmitStatus('success');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const focusAreas = [
    'Robotics',
    'Computer Vision',
    'AI / Machine Learning',
    'Autonomous Navigation',
    'Vision-Language Models (VLM/VLA)',
    'Robot Manipulation',
    'Perception Systems',
    'Control Systems',
    'Sim-to-Real Transfer'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-bg flex flex-col items-center justify-center font-mono">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 border-2 border-cyber-teal/20 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-cyber-teal border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-xs text-cyber-teal tracking-widest uppercase animate-pulse-slow">
          [ LOADING_CORE_SYSTEM_TELEMETRY ]
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-bg relative">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none z-0"></div>

      {/* Database connection badge for developers */}
      {usingFallback && (
        <div className="fixed bottom-4 right-4 z-40 bg-cyber-orange/90 text-cyber-bg font-mono font-bold text-[10px] px-3 py-1.5 rounded shadow-lg flex items-center gap-1.5 border border-cyber-orange">
          <span className="w-2 h-2 rounded-full bg-cyber-bg animate-ping"></span>
          OFFLINE_MOCK_DATA_ACTIVE
        </div>
      )}

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Header */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left">
            <div className="font-mono text-xs sm:text-sm text-cyber-teal flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyber-teal animate-pulse"></span>
              [ SECTOR.01_INITIALIZED ]
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
                {profile.name}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl font-mono text-cyber-teal font-medium tracking-wide">
                {profile.title}
              </p>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              {profile.bio || 'Robotics and AI/ML Engineer developing end-to-end autonomous navigation pipelines, legged platforms, robot manipulation systems, and simulation transfer solutions.'}
            </p>

            {/* Quick stats tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {focusAreas.map((area) => (
                <span
                  key={area}
                  className="bg-cyber-surface border border-cyber-border text-slate-300 font-mono text-[10px] sm:text-xs px-2.5 py-1 rounded"
                >
                  #{area.replace(/\s+/g, '').replace('/', '')}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/projects"
                className="flex items-center gap-2 px-6 py-3 bg-cyber-teal text-cyber-bg font-bold font-mono rounded hover:bg-white hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all duration-300 group"
              >
                VIEW PROJECTS
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#contact"
                className="flex items-center gap-2 px-6 py-3 border border-cyber-teal/40 text-cyber-teal font-mono rounded hover:bg-cyber-teal/15 hover:border-cyber-teal transition-all duration-300"
              >
                CONTACT_ME
              </a>
              <a
                href={profile.resume_url || '#'}
                download
                className="flex items-center gap-2 px-6 py-3 border border-cyber-border text-slate-300 font-mono rounded hover:bg-cyber-surface transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                DOWNLOAD_RESUME
              </a>
            </div>

            {/* Socials */}
            <div className="flex items-center space-x-6 pt-4 text-slate-400">
              {profile.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-cyber-teal transition-colors">
                  <Github className="w-6 h-6" />
                </a>
              )}
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-cyber-teal transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
              )}
              {profile.contact_email && (
                <a href={`mailto:${profile.contact_email}`} className="hover:text-cyber-teal transition-colors">
                  <Mail className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>

          {/* Right Area: System Telemetry HUD Display */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-xl p-6 font-mono text-xs text-slate-400 relative overflow-hidden tech-border tech-border-top-left tech-border-bottom-right">
              {/* Radar Grid Graphic inside HUD */}
              <div className="absolute right-4 top-4 w-12 h-12 rounded-full border border-cyber-teal/30 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border border-cyber-teal/20 border-dashed animate-spin"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-teal animate-ping absolute"></div>
              </div>

              <div className="border-b border-cyber-border/40 pb-4 mb-4 flex justify-between items-center">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyber-teal" />
                  ROBOTICS_CORE_STATUS
                </span>
                <span className="text-[10px] text-cyber-green bg-cyber-green/10 border border-cyber-green/30 px-1.5 py-0.5 rounded">
                  ONLINE
                </span>
              </div>
              
              <div className="space-y-2 leading-relaxed">
                <p><span className="text-slate-500">HOST:</span> localhost::robot_control</p>
                <p><span className="text-slate-500">KERN:</span> VLM_ACTUATOR_V1.0.4</p>
                <p><span className="text-slate-500">LATENCY:</span> 12ms (VLA feedback loop)</p>
                <p><span className="text-slate-500">ACCURACY:</span> ~20cm monocular navigation</p>
                <p><span className="text-slate-500">PLATFORMS:</span> Unitree Go2, B2 Legged, UR5 Arm</p>
                <p className="border-t border-cyber-border/20 pt-2 mt-2 text-cyber-teal">
                  &gt; initializing neural-pipeline...
                </p>
                <p>&gt; loading landmark-based map... [OK]</p>
                <p>&gt; camera calibration check... [OK]</p>
                <p className="text-cyber-green">&gt; ALL SYSTEMS OPERATIONAL</p>
              </div>

              {/* Grid graphic */}
              <div className="mt-6 border border-cyber-border/40 h-28 rounded relative overflow-hidden bg-cyber-bg/40">
                <div className="absolute inset-0 dot-grid opacity-25"></div>
                <div className="absolute bottom-2 left-3 text-[9px] text-slate-500 font-mono">X_COORD :: Y_COORD</div>
                {/* Simulated sine-wave / control signal */}
                <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none">
                  <path
                    d="M 0 50 Q 50 15, 100 50 T 200 50 T 300 50 T 400 50"
                    fill="none"
                    stroke="rgba(0, 242, 254, 0.4)"
                    strokeWidth="1.5"
                    className="animate-pulse"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="py-24 border-t border-cyber-border/30 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white font-mono tracking-wider">
              [ ABOUT_THE_ENGINEER ]
            </h2>
            <div className="w-16 h-1 bg-cyber-teal mx-auto mt-4 rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            {/* Tech details left */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-cyber-surface/40 border border-cyber-border/60 p-6 rounded-lg tech-border tech-border-top-left tech-border-bottom-right">
                <h3 className="font-mono text-sm font-bold text-white mb-4 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyber-teal" />
                  CORE RESEARCH & EXPERTISE
                </h3>
                <ul className="space-y-3 font-mono text-xs text-slate-300">
                  <li className="flex justify-between border-b border-cyber-border/20 pb-1.5">
                    <span>autonomous vehicles</span>
                    <span className="text-cyber-teal">level 5 planner</span>
                  </li>
                  <li className="flex justify-between border-b border-cyber-border/20 pb-1.5">
                    <span>perception pipelines</span>
                    <span className="text-cyber-teal">audio-visual / 3d</span>
                  </li>
                  <li className="flex justify-between border-b border-cyber-border/20 pb-1.5">
                    <span>robot platforms</span>
                    <span className="text-cyber-teal">legged & arm systems</span>
                  </li>
                  <li className="flex justify-between border-b border-cyber-border/20 pb-1.5">
                    <span>vlm / vla frameworks</span>
                    <span className="text-cyber-teal">zero-shot / few-shot</span>
                  </li>
                  <li className="flex justify-between border-b border-cyber-border/20 pb-1.5">
                    <span>simulators</span>
                    <span className="text-cyber-teal">isaac sim / carla</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Profile narrative right */}
            <div className="md:col-span-7 space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                Hello, I'm <strong className="text-white font-mono">Shreyash Choudhari</strong>, a robotics and artificial intelligence engineer dedicated to building autonomous systems that operate seamlessly in the physical world. My work bridges the gap between machine perception and physical manipulation, utilizing advanced deep learning pipelines, Vision-Language Models (VLMs), and reinforcement learning framework implementations.
              </p>
              <p>
                Currently, I work as an <strong className="text-white font-mono">RL Engineer</strong> at <strong className="text-cyber-teal">Kalyani Group / Bharat Forge</strong>. Here, I design and deploy audio-visual perception models for legged/humanoid robot platforms (like Unitree Go2 and B2) enabling autonomous target search across multi-floor environments, and develop 2-finger manipulator systems driven by Vision-Language-Action (VLA) architectures.
              </p>
              <p>
                My background includes conducting robotics research at <strong className="text-cyber-teal">IISc Bangalore</strong> (developing edge-deployable navigation models on NVIDIA Jetson and path planners for aircraft-carried imaging sensors) and simulating autonomous level-5 highway planners under professor Arpita Sinha at <strong className="text-cyber-teal">IIT Bombay</strong>. I specialize in taking algorithms from simulation (Isaac Sim, Gazebo, CARLA) and successfully transferring them to real-world embedded hardware.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXPERIENCE SECTION */}
      <section id="experience" className="py-24 border-t border-cyber-border/30 relative z-10 bg-cyber-bg/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white font-mono tracking-wider">
              [ PROFESSIONAL_TIMELINE ]
            </h2>
            <div className="w-16 h-1 bg-cyber-teal mx-auto mt-4 rounded"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Experience Timeline */}
            <div className="lg:col-span-8">
              <h3 className="text-xl font-bold text-white font-mono mb-8 flex items-center gap-2">
                <span>01.</span> WORK_HISTORY
              </h3>
              <Timeline experiences={experiences} />
            </div>

            {/* Education Timeline */}
            <div className="lg:col-span-4">
              <h3 className="text-xl font-bold text-white font-mono mb-8 flex items-center gap-2">
                <span>02.</span> ACADEMICS
              </h3>
              <Timeline education={education} />
            </div>
          </div>
        </div>
      </section>

      {/* 4. TECHNICAL SKILLS */}
      <section id="skills" className="py-24 border-t border-cyber-border/30 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white font-mono tracking-wider">
              [ TECHNICAL_SKILLS_MATRIX ]
            </h2>
            <div className="w-16 h-1 bg-cyber-teal mx-auto mt-4 rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(skillsByCategory).map(([category, catSkills]) => (
              <div
                key={category}
                className="bg-cyber-surface/40 border border-cyber-border/50 rounded-lg p-6 hover:border-cyber-border-glow transition-all duration-300"
              >
                <h3 className="font-mono text-sm font-bold text-cyber-teal mb-4 uppercase tracking-wider border-b border-cyber-border/40 pb-2">
                  // {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {catSkills
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((skill) => (
                      <span
                        key={skill.id}
                        className="bg-cyber-bg/50 border border-cyber-border/80 text-xs text-slate-300 font-mono px-3 py-1 rounded hover:text-cyber-teal hover:border-cyber-teal/30 transition-all duration-200"
                      >
                        {skill.name}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ACHIEVEMENTS SECTION */}
      <section id="achievements" className="py-24 border-t border-cyber-border/30 relative z-10 bg-cyber-bg/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white font-mono tracking-wider">
              [ KEY_ACHIEVEMENTS ]
            </h2>
            <div className="w-16 h-1 bg-cyber-teal mx-auto mt-4 rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, idx) => (
              <div
                key={achievement.id || idx}
                className="bg-cyber-surface/40 hover:bg-cyber-surface/60 border border-cyber-border/40 p-6 rounded-lg relative overflow-hidden tech-border tech-border-top-left tech-border-bottom-right transition-all duration-300"
              >
                <div className="absolute top-4 right-4 text-cyber-teal/20 font-mono font-bold text-4xl select-none">
                  0{idx + 1}
                </div>
                <div className="w-10 h-10 rounded bg-cyber-teal/10 border border-cyber-teal/30 flex items-center justify-center mb-4">
                  <Star className="w-5 h-5 text-cyber-teal" />
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                  [ DATE :: {achievement.date_string || 'N/A'} ]
                </span>
                <h3 className="text-white font-bold font-mono text-sm sm:text-base tracking-wide mb-2">
                  {achievement.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {achievement.description}
                </p>
                {achievement.link_url && (
                  <a
                    href={achievement.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-mono text-cyber-teal hover:underline"
                  >
                    View proof <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CONTACT SECTION */}
      <section id="contact" className="py-24 border-t border-cyber-border/30 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white font-mono tracking-wider">
              [ TRANSMIT_COMMS ]
            </h2>
            <div className="w-16 h-1 bg-cyber-teal mx-auto mt-4 rounded"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Details Left */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-mono text-white tracking-wide">
                  DIRECT CONNECTION
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                  Interested in discussing robotics systems, VLM navigation pipelines, research collaborations, or engineering vacancies? Reach out directly via the form or through my professional channels.
                </p>
              </div>

              {/* Direct Link Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <a
                  href={`mailto:${profile.contact_email || 'shreyash.choudhari@example.com'}`}
                  className="bg-cyber-surface/40 hover:bg-cyber-surface/70 border border-cyber-border/60 hover:border-cyber-teal/40 p-4 rounded text-center flex flex-col items-center gap-2 transition-all group"
                >
                  <Mail className="w-6 h-6 text-cyber-teal group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">email me</span>
                </a>
                <a
                  href={profile.linkedin_url || 'https://linkedin.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-cyber-surface/40 hover:bg-cyber-surface/70 border border-cyber-border/60 hover:border-cyber-teal/40 p-4 rounded text-center flex flex-col items-center gap-2 transition-all group"
                >
                  <Linkedin className="w-6 h-6 text-cyber-blue group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">linkedin</span>
                </a>
                <a
                  href={profile.github_url || 'https://github.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-cyber-surface/40 hover:bg-cyber-surface/70 border border-cyber-border/60 hover:border-cyber-teal/40 p-4 rounded text-center flex flex-col items-center gap-2 transition-all group"
                >
                  <Github className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">github</span>
                </a>
              </div>

              {/* Coordinates Indicator */}
              <div className="font-mono text-[10px] text-slate-600 hidden lg:block leading-relaxed">
                <p>STATUS :: COMM_PORT_RECEIVING</p>
                <p>IP :: 127.0.0.1 // SSL_ENABLED</p>
                <p>LOC :: PUNE, MH, IN [18.5204° N, 73.8567° E]</p>
              </div>
            </div>

            {/* Contact Form Right */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleContactSubmit}
                className="bg-cyber-surface/40 border border-cyber-border/60 p-6 sm:p-8 rounded-lg space-y-6 tech-border tech-border-top-left tech-border-bottom-right"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
                      Sender Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full bg-cyber-bg border border-cyber-border/80 focus:border-cyber-teal focus:ring-1 focus:ring-cyber-teal rounded px-4 py-2.5 text-slate-200 font-mono text-sm outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
                      Sender Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="e.g. sender@example.com"
                      className="w-full bg-cyber-bg border border-cyber-border/80 focus:border-cyber-teal focus:ring-1 focus:ring-cyber-teal rounded px-4 py-2.5 text-slate-200 font-mono text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Transmission Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="e.g. Robotics Project Discussion"
                    className="w-full bg-cyber-bg border border-cyber-border/80 focus:border-cyber-teal focus:ring-1 focus:ring-cyber-teal rounded px-4 py-2.5 text-slate-200 font-mono text-sm outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Message Body
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Provide details about your query here..."
                    className="w-full bg-cyber-bg border border-cyber-border/80 focus:border-cyber-teal focus:ring-1 focus:ring-cyber-teal rounded px-4 py-2.5 text-slate-200 font-mono text-sm outline-none transition-colors resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-cyber-teal text-cyber-bg font-bold font-mono rounded hover:bg-white hover:shadow-[0_0_15px_rgba(0,242,254,0.4)] transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? '[ SENDING_TRANSMISSION... ]' : '[ SEND_TRANSMISSION ]'}
                </button>

                {submitStatus === 'success' && (
                  <p className="text-xs font-mono text-cyber-green text-center">
                    &gt;&gt; Email client triggered successfully. Please submit the email draft.
                  </p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-xs font-mono text-cyber-orange text-center">
                    &gt;&gt; ERROR: Failed to prepare email transmission.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer copyright */}
      <footer className="py-8 border-t border-cyber-border/25 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs font-mono text-slate-500">
          <p>© {new Date().getFullYear()} SHREYASH CHOUDHARI. ALL RIGHTS RESERVED. // SECURITY_CLEARANCE_L1</p>
          <p className="mt-1 text-[10px] text-slate-600">POWERED BY SUPABASE CMS + VITE REACT TS</p>
        </div>
      </footer>
    </div>
  );
}
