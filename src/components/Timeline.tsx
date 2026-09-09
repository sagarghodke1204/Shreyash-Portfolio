import { Calendar, MapPin, Award } from 'lucide-react';
import type { Experience, Education } from '../types';

interface TimelineProps {
  experiences?: Experience[];
  education?: Education[];
}

export default function Timeline({ experiences = [], education = [] }: TimelineProps) {
  const isExperience = experiences.length > 0;
  const items = isExperience
    ? [...experiences].sort((a, b) => a.display_order - b.display_order)
    : [...education].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="relative border-l border-cyber-border/80 ml-4 md:ml-6 space-y-12 py-2">
      {items.map((item) => {
        const isExpItem = 'company' in item;
        const id = item.id;
        const title = isExpItem ? (item as Experience).role : (item as Education).degree;
        const subtitle = isExpItem ? (item as Experience).company : (item as Education).institution;
        const location = isExpItem ? (item as Experience).location : null;
        const startDate = isExpItem ? (item as Experience).start_date : (item as Education).start_date;
        const endDate = isExpItem ? (item as Experience).end_date : (item as Education).end_date;

        let dateStr = '';
        if (isExpItem) {
          if (startDate || endDate) {
            dateStr = `${startDate || ''}${startDate && (endDate || 'Present') ? ' – ' : ''}${endDate || 'Present'}`;
          }
        } else {
          if (startDate && endDate) {
            dateStr = `${startDate} – ${endDate}`;
          } else if (startDate) {
            dateStr = startDate;
          } else if (endDate) {
            dateStr = endDate;
          }
        }

        const extraInfo = isExpItem ? null : (item as Education).grade;
        const highlights = isExpItem ? (item as Experience).highlights : (item as Education).details;

        return (
          <div key={id} className="relative pl-8 group">
            {/* Glowing Timeline Connector Node */}
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-cyber-bg border border-cyber-border rounded-full flex items-center justify-center group-hover:border-cyber-teal group-hover:shadow-[0_0_10px_rgba(0,242,254,0.5)] transition-all duration-300">
              <div className="w-1.5 h-1.5 bg-cyber-border/80 rounded-full group-hover:bg-cyber-teal transition-colors"></div>
            </div>

            {/* Content Container */}
            <div className="bg-cyber-surface/40 hover:bg-cyber-surface/60 border border-cyber-border/40 hover:border-cyber-border-glow p-5 sm:p-6 rounded-lg tech-border tech-border-top-left tech-border-bottom-right transition-all duration-300">
              {/* Header section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-mono tracking-wide flex items-center gap-1.5">
                    {title}
                  </h3>
                  <p className="text-sm font-semibold text-cyber-teal hover:text-white transition-colors duration-200 inline-flex items-center gap-1">
                    {subtitle}
                  </p>
                </div>
                
                {/* Meta details */}
                <div className="flex flex-wrap gap-3 text-xs font-mono text-slate-400">
                  {dateStr && (
                    <span className="flex items-center gap-1 border border-cyber-border/60 px-2 py-0.5 rounded bg-cyber-bg/50">
                      <Calendar className="w-3.5 h-3.5 text-cyber-blue" />
                      [ {dateStr.toUpperCase()} ]
                    </span>
                  )}

                  {location && (
                    <span className="flex items-center gap-1 border border-cyber-border/60 px-2 py-0.5 rounded bg-cyber-bg/50">
                      <MapPin className="w-3.5 h-3.5 text-cyber-orange" />
                      {location.toUpperCase()}
                    </span>
                  )}
                  {extraInfo && (
                    <span className="flex items-center gap-1 border border-cyber-border/60 px-2 py-0.5 rounded bg-cyber-bg/50 text-cyber-green">
                      <Award className="w-3.5 h-3.5 text-cyber-green" />
                      {extraInfo.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Bullet highlights */}
              {highlights && highlights.length > 0 && (
                <ul className="space-y-2">
                  {highlights.map((bullet, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-slate-300 leading-relaxed flex items-start gap-2">
                      <span className="text-cyber-teal font-mono mt-0.5 flex-shrink-0 select-none">&gt;</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
