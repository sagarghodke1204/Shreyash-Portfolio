import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Terminal, X } from 'lucide-react';
import { api } from '../lib/api';
import type { Project } from '../types';
import { fallbackProjects } from '../data/mockData';
import ProjectCard from '../components/ProjectCard';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTech, setSelectedTech] = useState('All');
  const [statusTab, setStatusTab] = useState<'all' | 'published' | 'archived'>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const data = await api.getProjects();

        if (data && data.length > 0) {
          setProjects(data);
        } else {
          setUsingFallback(true);
        }
      } catch (err) {
        console.error('Error fetching projects from API:', err);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Extract all categories dynamically
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];

  // Extract all unique technologies
  const allTechs = Array.from(
    new Set(projects.flatMap((p) => p.technologies || []))
  ).sort();

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedTech('All');
    setStatusTab('all');
  };

  // Filter logic
  const filteredProjects = projects.filter((project) => {
    // 1. Status Filter (allows published and archived projects view)
    const matchesStatus =
      statusTab === 'all'
        ? (project.status === 'published' || project.status === 'archived')
        : project.status === statusTab;

    if (!matchesStatus) return false;

    // 2. Search keyword match
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      project.title.toLowerCase().includes(searchLower) ||
      project.short_description.toLowerCase().includes(searchLower) ||
      (project.full_description && project.full_description.toLowerCase().includes(searchLower)) ||
      project.technologies.some((t) => t.toLowerCase().includes(searchLower));

    // 3. Category match
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;

    // 4. Technology match
    const matchesTech = selectedTech === 'All' || project.technologies.includes(selectedTech);

    return matchesSearch && matchesCategory && matchesTech;
  });


  return (
    <div className="min-h-screen bg-cyber-bg pt-28 pb-20 relative">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none z-0"></div>

      {/* Database connection badge for developers */}
      {usingFallback && (
        <div className="fixed bottom-4 right-4 z-40 bg-cyber-orange/90 text-cyber-bg font-mono font-bold text-[10px] px-3 py-1.5 rounded shadow-lg border border-cyber-orange">
          OFFLINE_MOCK_CATALOG_ACTIVE
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="border-b border-cyber-border/40 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="font-mono text-xs text-cyber-teal flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              [ ACCESSING_PROJECTS_DATABASE ]
            </div>
            <h1 className="text-3xl font-extrabold text-white font-mono tracking-wider uppercase">
              Robotics & AI Systems
            </h1>
          </div>
          <div className="text-right font-mono text-[10px] text-slate-500 hidden md:block">
            ACTIVE_RECORDS: {filteredProjects.length} / {projects.length}
          </div>
        </div>

        {/* Status Tabs: Published / Archived / All */}
        <div className="flex flex-wrap border-b border-cyber-border/40 mb-6 font-mono text-xs gap-2">
          <button
            onClick={() => setStatusTab('all')}
            className={`px-4 py-2 border-b-2 font-bold uppercase transition-all ${
              statusTab === 'all'
                ? 'border-cyber-teal text-cyber-teal bg-cyber-teal/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            All Systems ({projects.filter(p => p.status === 'published' || p.status === 'archived').length})
          </button>
          <button
            onClick={() => setStatusTab('published')}
            className={`px-4 py-2 border-b-2 font-bold uppercase transition-all ${
              statusTab === 'published'
                ? 'border-cyber-green text-cyber-green bg-cyber-green/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Active / Main ({projects.filter(p => p.status === 'published').length})
          </button>
          <button
            onClick={() => setStatusTab('archived')}
            className={`px-4 py-2 border-b-2 font-bold uppercase transition-all ${
              statusTab === 'archived'
                ? 'border-cyber-purple text-cyber-purple bg-cyber-purple/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Archived Projects ({projects.filter(p => p.status === 'archived').length})
          </button>
        </div>


        {/* Search and Filters Bar */}
        <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-lg p-4 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative w-full md:flex-grow">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by system title, tech tag, keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-cyber-bg border border-cyber-border/80 focus:border-cyber-teal focus:ring-1 focus:ring-cyber-teal rounded pl-10 pr-4 py-2.5 text-slate-200 font-mono text-sm outline-none transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle Buttons */}
            <div className="flex w-full md:w-auto gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-1.5 px-4 py-2.5 border rounded font-mono text-xs w-full md:w-auto transition-all ${
                  showFilters
                    ? 'border-cyber-teal bg-cyber-teal/10 text-cyber-teal'
                    : 'border-cyber-border text-slate-300 hover:border-slate-500'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                FILTERS
              </button>
              {(selectedCategory !== 'All' || selectedTech !== 'All' || searchTerm) && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2.5 border border-cyber-orange/40 text-cyber-orange hover:bg-cyber-orange/10 font-mono text-xs rounded transition-all"
                >
                  RESET
                </button>
              )}
            </div>
          </div>

          {/* Collapsible Filter Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-cyber-border/30 font-mono text-xs">
              {/* Category selector */}
              <div className="space-y-2">
                <span className="text-slate-500 uppercase tracking-widest text-[10px]">Category Sector</span>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat || 'All')}
                      className={`px-3 py-1.5 border text-xs rounded transition-all ${
                        selectedCategory === (cat || 'All')
                          ? 'border-cyber-teal text-cyber-teal bg-cyber-teal/5'
                          : 'border-cyber-border text-slate-400 hover:border-slate-600 hover:text-slate-200'
                      }`}
                    >
                      {cat || 'Uncategorized'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technology tag selector */}
              <div className="space-y-2">
                <span className="text-slate-500 uppercase tracking-widest text-[10px]">Technology Stack</span>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto border border-cyber-border/40 p-2 rounded bg-cyber-bg/40">
                  <button
                    onClick={() => setSelectedTech('All')}
                    className={`px-2.5 py-1 border text-[10px] rounded transition-all ${
                      selectedTech === 'All'
                        ? 'border-cyber-teal text-cyber-teal bg-cyber-teal/5'
                        : 'border-cyber-border text-slate-400 hover:border-slate-600 hover:text-slate-200'
                    }`}
                  >
                    All Tech
                  </button>
                  {allTechs.map((tech) => (
                    <button
                      key={tech}
                      onClick={() => setSelectedTech(tech)}
                      className={`px-2.5 py-1 border text-[10px] rounded transition-all ${
                        selectedTech === tech
                          ? 'border-cyber-teal text-cyber-teal bg-cyber-teal/5'
                          : 'border-cyber-border text-slate-400 hover:border-slate-600 hover:text-slate-200'
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Projects Grid Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 font-mono">
            <div className="w-10 h-10 border-2 border-cyber-teal border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs text-slate-500 tracking-wider">RETRIEVING RECORD SHEETS...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="border border-dashed border-cyber-border/60 rounded-lg p-16 text-center font-mono">
            <Terminal className="w-10 h-10 text-cyber-orange mx-auto mb-4 animate-pulse" />
            <p className="text-sm text-slate-300 font-bold mb-1">NO MATCHING DATA SHEETS FOUND</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No robotic systems match the query criteria. Try adjusting keyword inputs or resetting filter nodes.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 px-4 py-2 border border-cyber-teal text-cyber-teal hover:bg-cyber-teal/15 text-xs rounded transition-all"
            >
              RESET_ALL_FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className="h-full">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
