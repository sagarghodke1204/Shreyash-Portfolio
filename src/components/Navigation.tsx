import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Cpu, FileText, LayoutDashboard, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NavigationProps {
  resumeUrl?: string;
}

export default function Navigation({ resumeUrl = '#' }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleNavClick = (sectionId: string) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/#' + sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { label: 'About', action: () => handleNavClick('about') },
    { label: 'Experience', action: () => handleNavClick('experience') },
    { label: 'Skills', action: () => handleNavClick('skills') },
    { label: 'Achievements', action: () => handleNavClick('achievements') },
    { label: 'Contact', action: () => handleNavClick('contact') },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cyber-bg/85 backdrop-blur-md border-b border-cyber-border py-3 shadow-lg shadow-cyber-bg/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo / Brand Name */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2 group text-white font-mono tracking-wider font-bold text-lg sm:text-xl"
            >
              <Cpu className="w-5 h-5 text-cyber-teal group-hover:rotate-45 transition-transform duration-300" />
              <span className="bg-gradient-to-r from-white via-slate-200 to-cyber-teal bg-clip-text text-transparent">
                SHREYASH
              </span>
              <span className="text-[10px] text-cyber-teal font-light border border-cyber-teal/30 px-1 rounded uppercase tracking-widest hidden sm:inline-block">
                SYS.ACTIVE
              </span>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/projects"
              className={`text-sm font-mono transition-colors tracking-wide ${
                location.pathname === '/projects'
                  ? 'text-cyber-teal font-medium'
                  : 'text-slate-300 hover:text-cyber-teal'
              }`}
            >
              [ Projects ]
            </Link>
            <Link
              to="/publications"
              className={`text-sm font-mono transition-colors tracking-wide ${
                location.pathname === '/publications'
                  ? 'text-cyber-teal font-medium'
                  : 'text-slate-300 hover:text-cyber-teal'
              }`}
            >
              [ Publications ]
            </Link>
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="text-sm font-mono text-slate-300 hover:text-cyber-teal transition-colors text-left"
              >
                {link.label}
              </button>
            ))}
          </div>


          {/* CTA / Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAdmin ? (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 border border-cyber-green/50 text-cyber-green text-xs font-mono rounded hover:bg-cyber-green/10 transition-all duration-200"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                CMS PANEL
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center justify-center p-1.5 border border-cyber-border text-slate-400 hover:text-cyber-teal hover:border-cyber-teal/50 rounded transition-all duration-200"
                title="Admin Access"
              >
                <User className="w-4 h-4" />
              </Link>
            )}
            <a
              href={resumeUrl}
              download
              className="flex items-center gap-1.5 px-4 py-1.5 bg-cyber-teal text-cyber-bg text-xs font-bold font-mono rounded hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-200"
            >
              <FileText className="w-3.5 h-3.5" />
              RESUME
            </a>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={resumeUrl}
              download
              className="flex items-center gap-1 px-3 py-1.5 bg-cyber-teal text-cyber-bg text-xs font-bold font-mono rounded"
            >
              <FileText className="w-3 h-3" />
              RESUME
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded text-slate-400 hover:text-white hover:bg-cyber-surface/50 border border-cyber-border/40 focus:outline-none"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 border-b border-cyber-border bg-cyber-surface' : 'max-h-0'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-3 font-mono">
          <Link
            to="/projects"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded text-base text-slate-300 hover:text-cyber-teal hover:bg-cyber-bg/50 border-l-2 border-transparent hover:border-cyber-teal"
          >
            [ Projects ]
          </Link>
          <Link
            to="/publications"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded text-base text-slate-300 hover:text-cyber-teal hover:bg-cyber-bg/50 border-l-2 border-transparent hover:border-cyber-teal"
          >
            [ Publications ]
          </Link>

          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className="block w-full text-left px-3 py-2 rounded text-base text-slate-300 hover:text-cyber-teal hover:bg-cyber-bg/50 border-l-2 border-transparent hover:border-cyber-teal"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 flex justify-between items-center px-3 border-t border-cyber-border/40">
            {isAdmin ? (
              <Link
                to="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1.5 text-cyber-green text-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                CMS Panel
              </Link>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1.5 text-slate-400 hover:text-cyber-teal text-sm"
              >
                <User className="w-4 h-4" />
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
