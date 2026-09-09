import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Github, ExternalLink, Calendar, Layers, Video,
  FileText, Download, Terminal, Play, Sparkles, X, Maximize2
} from 'lucide-react';
import { api } from '../lib/api';
import { getGoogleDriveEmbedUrl, isGoogleDriveUrl } from '../utils/googleDrive';
import type { Project, ProjectVideo } from '../types';
import { fallbackProjects } from '../data/mockData';
import ProjectCard from '../components/ProjectCard';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Video State
  const [activeVideo, setActiveVideo] = useState<ProjectVideo | null>(null);
  const [modalVideo, setModalVideo] = useState<{ title?: string; url: string } | null>(null);

  // Helper to extract YouTube ID
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  useEffect(() => {
    async function loadProjectDetails() {
      try {
        setLoading(true);

        // Fetch current project by slug from backend API
        const projData = await api.getProject(slug || '');
        let activeProject: Project | null = null;

        if (projData) {
          activeProject = projData;
        } else {
          // Offline Fallback
          const mockMatch = fallbackProjects.find((p) => p.slug === slug);
          if (mockMatch) {
            activeProject = mockMatch;
          }
        }

        if (!activeProject) {
          setProject(null);
          return;
        }

        setProject(activeProject);

        // Initialize active video if videos exist
        if (activeProject.videos && activeProject.videos.length > 0) {
          setActiveVideo(activeProject.videos[0]);
        } else {
          setActiveVideo(null);
        }

        // Load related projects (same category, excluding current project)
        const allProjects = await api.getProjects();
        if (allProjects && allProjects.length > 0) {
          const related = allProjects
            .filter((p) => p.category === activeProject!.category && p.slug !== slug)
            .slice(0, 3);
          setRelatedProjects(related);
        } else {
          // Offline related fallback
          const mockRelated = fallbackProjects
            .filter((p) => p.category === activeProject!.category && p.slug !== slug)
            .slice(0, 3);
          setRelatedProjects(mockRelated);
        }

      } catch (err) {
        console.error('Error loading project details:', err);
        const mockMatch = fallbackProjects.find((p) => p.slug === slug);
        if (mockMatch) {
          setProject(mockMatch);
          if (mockMatch.videos && mockMatch.videos.length > 0) {
            setActiveVideo(mockMatch.videos[0]);
          }
          const mockRelated = fallbackProjects
            .filter((p) => p.category === mockMatch.category && p.slug !== slug)
            .slice(0, 3);
          setRelatedProjects(mockRelated);
        }
      } finally {
        setLoading(false);
      }
    }

    loadProjectDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-bg flex flex-col items-center justify-center font-mono">
        <div className="w-10 h-10 border-2 border-cyber-teal border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs text-slate-500 tracking-wider">RESOLVING_SYSTEM_LOGS...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-cyber-bg flex flex-col items-center justify-center font-mono text-center px-4">
        <Terminal className="w-12 h-12 text-cyber-orange mb-4 animate-bounce" />
        <h2 className="text-xl font-bold text-white mb-2">ERROR_404: SYSTEM_NOT_FOUND</h2>
        <p className="text-xs text-slate-500 max-w-sm mb-6">
          The requested system log '{slug}' does not exist or has been retracted from database nodes.
        </p>
        <Link
          to="/projects"
          className="flex items-center gap-1.5 px-4 py-2 border border-cyber-teal text-cyber-teal hover:bg-cyber-teal/10 rounded text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          RETURN_TO_DATABASE
        </Link>
      </div>
    );
  }

  // Render player iframe for a given video URL
  const renderEmbedIframe = (videoUrl: string, autoPlay = false) => {
    const ytId = getYouTubeId(videoUrl);
    if (ytId) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1${autoPlay ? '&autoplay=1' : ''}`}
          title="YouTube Video Player"
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }

    if (isGoogleDriveUrl(videoUrl)) {
      const driveUrl = getGoogleDriveEmbedUrl(videoUrl);
      return (
        <iframe
          src={driveUrl}
          title="Google Drive Video Player"
          className="absolute inset-0 w-full h-full border-0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      );
    }

    // Direct MP4 or external iframe
    return (
      <video
        src={videoUrl}
        controls
        autoPlay={autoPlay}
        className="absolute inset-0 w-full h-full object-cover"
      ></video>
    );
  };

  const handlePlayInPlayer = (vid: ProjectVideo) => {
    setActiveVideo(vid);
    const playerEl = document.getElementById('primary-video-player');
    if (playerEl) {
      playerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg pt-28 pb-20 relative">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Link */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyber-teal mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          [ BACK_TO_DATABASE ]
        </Link>

        {/* Project Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Column: Visual Media & Detailed Description (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Primary Video Embed or Fallback Thumbnail Stage */}
            <div id="primary-video-player" className="scroll-mt-32">
              {activeVideo ? (
                <div className="bg-black border border-cyber-teal/40 rounded-lg overflow-hidden relative shadow-2xl aspect-video glow-teal group">
                  {renderEmbedIframe(activeVideo.url, true)}
                  
                  {/* Top Bar Overlay showing Active Stream Title */}
                  <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <span className="font-mono text-xs text-cyber-teal font-bold truncate">
                      PLAYING: {activeVideo.title || 'Attached Video Stream'}
                    </span>
                    <button
                      onClick={() => setModalVideo({ title: activeVideo.title || project.title, url: activeVideo.url })}
                      className="pointer-events-auto p-1.5 bg-cyber-surface/80 hover:bg-cyber-teal hover:text-cyber-bg text-slate-300 rounded border border-cyber-border transition-all"
                      title="Open Fullscreen Pop-up Player"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : project.thumbnail_url ? (
                <div className="border border-cyber-border rounded-lg overflow-hidden aspect-video relative">
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                /* Blueprint schematic mockup */
                <div className="border border-cyber-border rounded-lg bg-cyber-surface/20 aspect-video flex flex-col items-center justify-center relative dot-grid overflow-hidden">
                  <div className="w-20 h-20 border border-cyber-teal/30 rounded-full flex items-center justify-center relative animate-pulse-slow">
                    <div className="w-16 h-16 border border-cyber-teal/20 border-dashed rounded-full"></div>
                    <Layers className="w-8 h-8 text-cyber-teal" />
                  </div>
                  <span className="text-xs font-mono text-slate-500 mt-4 uppercase tracking-widest">[ Simulation_Schematic_Available ]</span>
                  {/* Decorative border tags */}
                  <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-cyber-border"></div>
                  <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-cyber-border"></div>
                  <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-cyber-border"></div>
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-cyber-border"></div>
                </div>
              )}
            </div>

            {/* Video Stream Selection List */}
            {project.videos && project.videos.length > 0 && (
              <div className="bg-cyber-surface/30 border border-cyber-border/40 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-cyber-border/30 pb-3">
                  <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                    <Video className="w-4 h-4 text-cyber-teal" />
                    ATTACHED_MEDIA_STREAMS ({project.videos.length})
                  </h3>
                  <span className="text-[10px] font-mono text-cyber-teal uppercase tracking-wider">
                    Click any stream to play directly
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.videos.map((vid) => {
                    const isActive = activeVideo?.url === vid.url;

                    return (
                      <div
                        key={vid.id}
                        className={`border rounded p-4 flex flex-col justify-between gap-3 transition-all duration-300 ${
                          isActive
                            ? 'border-cyber-teal bg-cyber-teal/10 shadow-[0_0_12px_rgba(0,242,254,0.15)]'
                            : 'border-cyber-border/60 bg-cyber-bg/40 hover:border-slate-500'
                        }`}
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-xs font-mono font-bold truncate ${isActive ? 'text-cyber-teal' : 'text-white'}`}>
                              {vid.title || 'Demo Video Stream'}
                            </p>
                            {isActive && (
                              <span className="text-[9px] font-mono bg-cyber-teal text-cyber-bg px-1.5 py-0.2 rounded uppercase font-bold shrink-0">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-mono text-slate-500 truncate">{vid.url}</p>
                        </div>

                        {/* Interactive Play Controls */}
                        <div className="flex items-center gap-2 pt-2 border-t border-cyber-border/30 font-mono text-xs">
                          <button
                            onClick={() => handlePlayInPlayer(vid)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded font-bold text-xs transition-all flex-grow justify-center ${
                              isActive
                                ? 'bg-cyber-teal text-cyber-bg shadow-sm'
                                : 'bg-cyber-surface border border-cyber-teal/50 text-cyber-teal hover:bg-cyber-teal hover:text-cyber-bg'
                            }`}
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            {isActive ? 'PLAYING NOW' : 'PLAY STREAM'}
                          </button>

                          <button
                            onClick={() => setModalVideo({ title: vid.title || project.title, url: vid.url })}
                            className="p-1.5 border border-cyber-purple/50 text-cyber-purple hover:bg-cyber-purple/10 rounded transition-all"
                            title="Open Pop-up Lightbox Player"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={vid.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 border border-cyber-border text-slate-500 hover:text-slate-200 rounded transition-all"
                            title="Open External URL in New Tab"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Project Full Narrative Block */}
            <div className="bg-cyber-surface/30 border border-cyber-border/40 rounded-lg p-6 sm:p-8 space-y-6 tech-border tech-border-top-left tech-border-bottom-right">
              <h2 className="text-lg font-bold font-mono text-white border-b border-cyber-border/30 pb-3 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyber-teal" />
                SYSTEM_SPECIFICATIONS
              </h2>
              
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
                {project.full_description || project.short_description}
              </div>
            </div>
          </div>

          {/* Right Column: Metadata Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Tech details card */}
            <div className="bg-cyber-surface/40 border border-cyber-border/60 rounded-lg p-6 space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-wide">
                  {project.title}
                </h1>
                {project.category && (
                  <span className="text-[10px] font-mono bg-cyber-teal/10 border border-cyber-teal/30 text-cyber-teal px-2 py-0.5 rounded uppercase tracking-widest inline-block mt-2">
                    {project.category}
                  </span>
                )}
              </div>

              {/* Attributes */}
              <div className="space-y-4 border-t border-cyber-border/30 pt-4 font-mono text-xs text-slate-400">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-cyber-blue" /> DATE</span>
                  <span className="text-white font-semibold">{project.date_string || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-cyber-teal" /> INTEGRITY</span>
                  <span className="text-cyber-green font-semibold">VERIFIED</span>
                </div>
              </div>

              {/* Technologies list */}
              <div className="space-y-3 border-t border-cyber-border/30 pt-4">
                <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">SYSTEM_UTILITIES</span>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-cyber-bg/50 border border-cyber-border text-[11px] font-mono text-slate-300 px-2.5 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links and Codebases */}
              <div className="space-y-3 border-t border-cyber-border/30 pt-4">
                <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">EXTERNAL_NODES</span>
                <div className="grid grid-cols-1 gap-2 pt-1 font-mono text-xs">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-cyber-bg border border-cyber-border hover:border-white text-slate-300 hover:text-white rounded transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      REPOS_CODEBASE
                    </a>
                  )}
                  {project.external_url && (
                    <a
                      href={project.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-cyber-teal text-cyber-bg font-bold rounded hover:bg-white hover:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      LIVE_SYSTEM
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Presentations Sidebar Box */}
            {project.presentations && project.presentations.length > 0 && (
              <div className="bg-cyber-surface/40 border border-cyber-border/60 rounded-lg p-6 space-y-4">
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-cyber-blue" />
                  SYSTEM_PRESENTATIONS
                </h3>
                <div className="space-y-2">
                  {project.presentations.map((pres) => (
                    <a
                      key={pres.id}
                      href={pres.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-cyber-bg/40 border border-cyber-border/80 rounded hover:border-cyber-blue transition-colors font-mono text-xs"
                    >
                      <span className="truncate text-slate-300 font-bold">{pres.title}</span>
                      <Download className="w-4 h-4 text-cyber-blue flex-shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Systems Section */}
        {relatedProjects.length > 0 && (
          <div className="border-t border-cyber-border/30 pt-16 space-y-8">
            <h3 className="text-xl font-bold text-white font-mono tracking-wide flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyber-teal" />
              RELATED_ROBOTIC_SYSTEMS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((relProj) => (
                <ProjectCard key={relProj.id} project={relProj} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pop-up Video Lightbox Modal */}
      {modalVideo && (
        <div className="fixed inset-0 z-50 bg-cyber-bg/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-cyber-surface border border-cyber-teal/50 rounded-xl w-full max-w-5xl p-6 relative shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-cyber-border/40 pb-3">
              <div className="flex items-center gap-2 font-mono text-sm text-cyber-teal font-bold">
                <Video className="w-4 h-4" />
                <span>[ INLINE_STREAM_PLAYER :: {modalVideo.title || 'Video Stream'} ]</span>
              </div>
              <button
                onClick={() => setModalVideo(null)}
                className="p-1.5 text-slate-400 hover:text-white border border-cyber-border/60 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full aspect-video bg-black rounded overflow-hidden border border-cyber-border shadow-inner">
              {renderEmbedIframe(modalVideo.url, true)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
