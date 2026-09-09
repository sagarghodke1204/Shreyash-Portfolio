import { Link } from 'react-router-dom';
import { Github, ExternalLink, Video, FileText, ArrowRight, Layers } from 'lucide-react';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const {
    title,
    slug,
    short_description,
    category,
    technologies,
    thumbnail_url,
    github_url,
    external_url,
    videos = [],
    presentations = []
  } = project;

  const hasVideo = videos.length > 0 || project.id === 'cosmo-logistic' || project.id === 'stem-bot';
  const hasPresentation = presentations.length > 0 || project.id === 'cosmo-logistic';

  return (
    <div className="group bg-cyber-surface/40 hover:bg-cyber-surface/80 border border-cyber-border/40 hover:border-cyber-teal/50 rounded-lg overflow-hidden flex flex-col h-full transition-all duration-300 glow-teal-hover">
      {/* Thumbnail area / Tech visual fallback */}
      <div className="relative h-48 bg-cyber-bg border-b border-cyber-border/40 overflow-hidden flex items-center justify-center">
        {thumbnail_url ? (
          <img
            src={thumbnail_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          /* Futuristic Blueprint / Radar Mockup */
          <div className="absolute inset-0 dot-grid opacity-30 flex flex-col items-center justify-center group-hover:opacity-50 transition-opacity duration-300">
            <div className="w-16 h-16 border border-cyber-teal/20 rounded-full flex items-center justify-center relative animate-pulse-slow">
              <div className="w-12 h-12 border border-cyber-teal/40 border-dashed rounded-full"></div>
              <Layers className="w-6 h-6 text-cyber-teal absolute" />
            </div>
            <span className="text-[9px] font-mono text-slate-500 mt-2 uppercase tracking-widest">[ Wireframe_Model_Active ]</span>
          </div>
        )}
        
        {/* Category & Status Badge */}
        <div className="absolute top-3 left-3 flex gap-1.5 items-center">
          {category && (
            <span className="bg-cyber-bg/80 backdrop-blur-sm border border-cyber-border/80 text-[10px] text-cyber-teal px-2 py-0.5 rounded font-mono uppercase tracking-wider">
              {category}
            </span>
          )}
          {project.status === 'archived' && (
            <span className="bg-cyber-purple/20 border border-cyber-purple/60 text-[10px] text-cyber-purple font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
              ARCHIVED
            </span>
          )}
        </div>

        {/* Media indicators (Video/PDF) */}
        <div className="absolute top-3 right-3 flex gap-1.5">

          {hasVideo && (
            <span className="bg-cyber-bg/85 backdrop-blur-sm border border-cyber-teal/30 p-1.5 rounded text-cyber-teal" title="Demo Video Attached">
              <Video className="w-3.5 h-3.5" />
            </span>
          )}
          {hasPresentation && (
            <span className="bg-cyber-bg/85 backdrop-blur-sm border border-cyber-blue/30 p-1.5 rounded text-cyber-blue" title="Presentation Attached">
              <FileText className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
        
        {/* Decorative corner highlights */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyber-teal/40"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyber-teal/40"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyber-teal/40"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyber-teal/40"></div>
      </div>

      {/* Content Area */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow">
        <h3 className="text-white text-lg font-bold font-mono tracking-wide mb-2 line-clamp-1 group-hover:text-cyber-teal transition-colors">
          {title}
        </h3>
        
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
          {short_description}
        </p>

        {/* Technology tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {technologies.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="bg-cyber-bg/40 border border-cyber-border text-[10px] text-slate-300 font-mono px-2 py-0.5 rounded"
            >
              {tech}
            </span>
          ))}
          {technologies.length > 5 && (
            <span className="text-[10px] text-slate-500 font-mono self-center">
              +{technologies.length - 5} more
            </span>
          )}
        </div>

        {/* Action footer */}
        <div className="flex items-center justify-between pt-4 border-t border-cyber-border/40 mt-auto">
          <div className="flex gap-2">
            {github_url && (
              <a
                href={github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-cyber-border text-slate-400 hover:text-white hover:border-slate-500 rounded transition-colors"
                title="View Code on GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {external_url && (
              <a
                href={external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-cyber-border text-slate-400 hover:text-white hover:border-slate-500 rounded transition-colors"
                title="View Live Site"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <Link
            to={`/project/${slug}`}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyber-teal hover:text-white transition-colors duration-200 group/btn"
          >
            EXPLORE SYSTEM
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
