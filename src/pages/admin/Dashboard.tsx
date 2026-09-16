import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Cpu, LayoutDashboard, FolderKanban, Briefcase, Award, 
  Wrench, Settings, Plus, Edit2, Trash2, Save, X, Upload, Github, Link as LinkIcon, BookOpen, Video
} from 'lucide-react';
import { api } from '../../lib/api';
import type { Profile, Experience, ExperienceHighlight, Skill, Project, ProjectVideo, Presentation, Achievement, Publication } from '../../types';
import {
  fallbackProfile,
  fallbackExperiences,
  fallbackSkills,
  fallbackAchievements,
  fallbackProjects,
  fallbackPublications
} from '../../data/mockData';

type ActiveTab = 'overview' | 'projects' | 'publications' | 'experience' | 'skills' | 'achievements' | 'profile';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [loading, setLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState<any>(null);

  // Database Data States
  const [profile, setProfile] = useState<Profile>(fallbackProfile);
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [publications, setPublications] = useState<Publication[]>(fallbackPublications);
  const [experiences, setExperiences] = useState<Experience[]>(fallbackExperiences);
  const [skills, setSkills] = useState<Skill[]>(fallbackSkills);
  const [achievements, setAchievements] = useState<Achievement[]>(fallbackAchievements);


  // Edit / Form states
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  
  // Status banner state
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    // Check session
    if (!api.isAuthenticated()) {
      navigate('/admin/login');
    } else {
      setSessionUser({ email: 'admin@portfolio.com' });
      loadAllCMSData();
    }
  }, [navigate]);

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const loadAllCMSData = async () => {
    try {
      setLoading(true);

      // Fetch Profile
      const profileData = await api.getProfile();
      if (profileData) setProfile(profileData);

      // Fetch Projects with videos and presentations
      const projData = await api.getProjects();
      if (projData && projData.length > 0) setProjects(projData);

      // Fetch Experiences
      const expData = await api.getExperiences();
      if (expData && expData.length > 0) setExperiences(expData);

      // Fetch Skills
      const skillData = await api.getSkills();
      if (skillData && skillData.length > 0) setSkills(skillData);

      // Fetch Achievements
      const achData = await api.getAchievements();
      if (achData && achData.length > 0) setAchievements(achData);

      // Fetch Publications
      const pubData = await api.getPublications();
      if (pubData && pubData.length > 0) setPublications(pubData);

    } catch (err) {
      console.error('Error fetching CMS data:', err);
      showStatus('Failed to load dynamic database data. Using local cache.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    navigate('/admin/login');
  };

  // Helper count aggregates
  const totalVideos = projects.reduce((sum, p) => sum + (p.videos?.length || 0), 0);
  const totalPresentations = projects.reduce((sum, p) => sum + (p.presentations?.length || 0), 0);
  const featuredProjects = projects.filter(p => p.is_featured).length;

  return (
    <div className="min-h-screen bg-cyber-bg flex flex-col font-mono text-slate-300">
      {/* Top Banner Control Header */}
      <header className="bg-cyber-surface border-b border-cyber-border py-4 px-6 flex justify-between items-center z-10 shadow-md">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyber-teal" />
          <span className="text-white font-extrabold tracking-wider">ROBOTICS_CMS_PANEL</span>
          <span className="text-[9px] border border-cyber-teal/30 px-1.5 py-0.5 rounded text-cyber-teal uppercase tracking-widest hidden sm:inline">
            l2_operator
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500 hidden md:inline truncate max-w-xs">
            OP: {sessionUser?.email}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-cyber-orange/40 hover:border-cyber-orange text-cyber-orange hover:bg-cyber-orange/10 text-xs rounded transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            DISCONNECT
          </button>
        </div>
      </header>

      {/* Main CMS Layout */}
      <div className="flex-grow flex flex-col md:flex-row min-h-0">
        
        {/* Sidebar Nav Tabs */}
        <aside className="w-full md:w-64 bg-cyber-surface/40 border-r border-cyber-border md:p-4 p-2 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible shrink-0">
          <div className="text-[10px] text-slate-600 uppercase tracking-widest px-3 py-2 hidden md:block select-none">
            sector nodes
          </div>
          {[
            { id: 'overview', label: 'Overview HUD', icon: LayoutDashboard },
            { id: 'projects', label: 'Projects Control', icon: FolderKanban },
            { id: 'publications', label: 'Publications & Patents', icon: BookOpen },
            { id: 'experience', label: 'Experiences Log', icon: Briefcase },
            { id: 'skills', label: 'Skills Matrix', icon: Wrench },
            { id: 'achievements', label: 'Achievements Ledger', icon: Award },
            { id: 'profile', label: 'Profile Telemetry', icon: Settings }
          ].map((tab) => {

            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setEditingProject(null);
                  setActiveTab(tab.id as ActiveTab);
                }}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded text-left text-xs tracking-wide transition-all shrink-0 md:shrink ${
                  activeTab === tab.id
                    ? 'bg-cyber-teal text-cyber-bg font-bold shadow-[0_0_12px_rgba(0,242,254,0.25)]'
                    : 'hover:bg-cyber-surface hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label.toUpperCase()}
              </button>
            );
          })}
        </aside>

        {/* CMS Output Content Panel */}
        <main className="flex-grow p-6 sm:p-8 min-w-0 overflow-y-auto">
          {/* Status banner alerts */}
          {statusMessage && (
            <div className={`border p-3.5 rounded mb-6 text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-cyber-green/10 border-cyber-green/40 text-cyber-green'
                : 'bg-cyber-orange/10 border-cyber-orange/40 text-cyber-orange'
            }`}>
              <span className="font-bold uppercase">[{statusMessage.type}]</span>
              <span>{statusMessage.text.toUpperCase()}</span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-cyber-teal border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-xs text-slate-500 tracking-wider">COMMUNICATION_PENDING...</p>
            </div>
          ) : editingProject ? (
            /* Render Project creation/edit form */
            <ProjectFormSection
              project={editingProject}
              onCancel={() => setEditingProject(null)}
              onSave={async (_savedProj) => {
                // Reload data and close form
                await loadAllCMSData();
                setEditingProject(null);
                showStatus('Project record successfully updated in database');
              }}
              showStatus={showStatus}
            />
          ) : (
            /* Render regular tabs */
            <div>
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="border-b border-cyber-border pb-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <LayoutDashboard className="w-5 h-5 text-cyber-teal" />
                      OPERATIONS_OVERVIEW
                    </h2>
                  </div>

                  {/* Summary Grid Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Systems', val: projects.length, color: 'text-cyber-teal' },
                      { label: 'Video Feeds', val: totalVideos, color: 'text-cyber-blue' },
                      { label: 'Doc Presentations', val: totalPresentations, color: 'text-cyber-green' },
                      { label: 'Featured Systems', val: featuredProjects, color: 'text-cyber-orange' }
                    ].map((card, idx) => (
                      <div key={idx} className="bg-cyber-surface/40 border border-cyber-border p-5 rounded-lg relative overflow-hidden tech-border tech-border-top-left tech-border-bottom-right">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">
                          {card.label}
                        </span>
                        <span className={`text-3xl font-extrabold font-mono ${card.color}`}>
                          {card.val}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Log console info */}
                  <div className="bg-cyber-surface/20 border border-cyber-border/60 p-5 rounded-lg leading-relaxed text-xs">
                    <p className="text-slate-400 font-bold mb-3 uppercase tracking-wider">// SYSTEM_DIAGNOSTICS_LOG</p>
                    <p className="text-slate-500">CONNECTION :: SECURE_SSL_ACTIVE</p>
                    <p className="text-slate-500">USER_LEVEL :: CONFIG_MANAGER_AUTHENTICATED</p>
                    <p className="text-slate-500">RLS_POLICIES :: STATUS_ACTIVE (INSERT_RESTRICTED)</p>
                    <p className="text-cyber-green mt-2">&gt;&gt; Ready to accept remote mutations.</p>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-cyber-border pb-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <FolderKanban className="w-5 h-5 text-cyber-teal" />
                      PROJECTS_LOG_CONTROL
                    </h2>
                    <button
                      onClick={() => setEditingProject({})}
                      className="flex items-center gap-1.5 px-4 py-2 bg-cyber-teal text-cyber-bg font-bold text-xs rounded hover:bg-white transition-all shadow-[0_0_10px_rgba(0,242,254,0.2)]"
                    >
                      <Plus className="w-4 h-4" />
                      ADD_PROJECT
                    </button>
                  </div>

                  {/* Projects Data Table */}
                  <div className="border border-cyber-border rounded-lg overflow-hidden bg-cyber-surface/20">
                    <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead>
                        <tr className="bg-cyber-surface text-slate-400 border-b border-cyber-border uppercase tracking-widest text-[10px]">
                          <th className="p-4">Project Title</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((proj) => (
                          <tr key={proj.id} className="border-b border-cyber-border/40 hover:bg-cyber-surface/20 transition-colors">
                            <td className="p-4 font-bold text-white">{proj.title}</td>
                            <td className="p-4 text-cyber-teal">{proj.category || 'N/A'}</td>
                            <td className="p-4">{proj.date_string || 'N/A'}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 border rounded uppercase text-[10px] ${
                                proj.status === 'published'
                                  ? 'border-cyber-green/50 text-cyber-green bg-cyber-green/5'
                                  : 'border-cyber-orange/50 text-cyber-orange bg-cyber-orange/5'
                              }`}>
                                {proj.status}
                              </span>
                              {proj.is_featured && (
                                <span className="ml-1.5 px-2 py-0.5 border border-cyber-blue/50 text-cyber-blue bg-cyber-blue/5 rounded text-[10px] uppercase font-bold">
                                  FEATURED
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => setEditingProject(proj)}
                                className="p-1.5 border border-cyber-border hover:border-cyber-teal text-slate-400 hover:text-cyber-teal rounded transition-colors"
                                title="Edit Project"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm(`Are you sure you want to delete project: "${proj.title}"?`)) {
                                    try {
                                      await api.deleteProject(proj.id);
                                      showStatus('Project deleted successfully');
                                      loadAllCMSData();
                                    } catch (err) {
                                      showStatus('Failed to delete project', 'error');
                                    }
                                  }
                                }}
                                className="p-1.5 border border-cyber-border hover:border-cyber-orange text-slate-400 hover:text-cyber-orange rounded transition-colors"
                                title="Delete Project"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'publications' && (
                <PublicationsCMSSection
                  publications={publications}
                  onReload={loadAllCMSData}
                  showStatus={showStatus}
                />
              )}

              {activeTab === 'experience' && (

                <ExperienceCMSSection
                  experiences={experiences}
                  onReload={loadAllCMSData}
                  showStatus={showStatus}
                />
              )}

              {activeTab === 'skills' && (
                <SkillsCMSSection
                  skills={skills}
                  onReload={loadAllCMSData}
                  showStatus={showStatus}
                />
              )}

              {activeTab === 'achievements' && (
                <AchievementsCMSSection
                  achievements={achievements}
                  onReload={loadAllCMSData}
                  showStatus={showStatus}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileCMSSection
                  profile={profile}
                  onReload={loadAllCMSData}
                  showStatus={showStatus}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// =========================================================================
// PROJECT ADD / EDIT SUB-FORM COMPONENT
// =========================================================================
interface ProjFormProps {
  project: Partial<Project>;
  onCancel: () => void;
  onSave: (proj: Project) => void;
  showStatus: (txt: string, type?: 'success' | 'error') => void;
}

function ProjectFormSection({ project, onCancel, onSave, showStatus }: ProjFormProps) {
  const isEdit = !!project.id;
  const [title, setTitle] = useState(project.title || '');
  const [slug, setSlug] = useState(project.slug || '');
  const [shortDesc, setShortDesc] = useState(project.short_description || '');
  const [fullDesc, setFullDesc] = useState(project.full_description || '');
  const [dateStr, setDateStr] = useState(project.date_string || '');
  const [category, setCategory] = useState(project.category || 'Robotics');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>(project.status || 'published');
  const [isFeatured, setIsFeatured] = useState(project.is_featured || false);

  const [githubUrl, setGithubUrl] = useState(project.github_url || '');
  const [externalUrl, setExternalUrl] = useState(project.external_url || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(project.thumbnail_url || '');
  const [displayOrder, setDisplayOrder] = useState<number>(project.display_order ?? 0);

  // Tags list state
  const [techInput, setTechInput] = useState('');
  const [technologies, setTechnologies] = useState<string[]>(project.technologies || []);

  // Multi-records arrays (stored locally and updated in DB sub-tables)
  const [videos, setVideos] = useState<Partial<ProjectVideo>[]>(project.videos || []);
  const [presentations, setPresentations] = useState<Partial<Presentation>[]>(project.presentations || []);

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Generate slug dynamically from title if creating
  useEffect(() => {
    if (!isEdit && title) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }, [title, isEdit]);

  const handleAddTech = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = techInput.trim();
      if (val && !technologies.includes(val)) {
        setTechnologies([...technologies, val]);
        setTechInput('');
      }
    }
  };

  const handleRemoveTech = (tag: string) => {
    setTechnologies(technologies.filter(t => t !== tag));
  };

  // Add multi-record templates
  const addVideoRow = () => {
    setVideos([...videos, { title: '', url: '', type: 'youtube' }]);
  };
  const removeVideoRow = (idx: number) => {
    setVideos(videos.filter((_, i) => i !== idx));
  };
  const updateVideoRow = (idx: number, field: string, val: string) => {
    const updated = [...videos];
    updated[idx] = { ...updated[idx], [field]: val };
    setVideos(updated);
  };

  const addPresentationRow = () => {
    setPresentations([...presentations, { title: '', url: '', type: 'external' }]);
  };
  const removePresentationRow = (idx: number) => {
    setPresentations(presentations.filter((_, i) => i !== idx));
  };
  const updatePresentationRow = (idx: number, field: string, val: string) => {
    const updated = [...presentations];
    updated[idx] = { ...updated[idx], [field]: val };
    setPresentations(updated);
  };

  // Upload file helper
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    
    setUploadingImage(true);
    try {
      const activeSlug = slug || 'temp-project';
      const ext = file.name.split('.').pop();
      const fileName = `thumb-${Date.now()}.${ext}`;
      const filePath = `projects/${activeSlug}/${fileName}`;
      
      const publicUrl = await api.uploadFile('portfolio-media', filePath, file);
      setThumbnailUrl(publicUrl);
      showStatus('Thumbnail image uploaded to storage successfully.');
    } catch (err: any) {
      console.error(err);
      showStatus(err.message || 'Image upload failed. Ensure "portfolio-media" bucket is configured.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !shortDesc) {
      showStatus('Missing core fields: Title, Slug, Short Description are required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const projectPayload = {
        title,
        slug,
        short_description: shortDesc,
        full_description: fullDesc,
        date_string: dateStr,
        category,
        technologies,
        thumbnail_url: thumbnailUrl || null,
        github_url: githubUrl || null,
        external_url: externalUrl || null,
        status,
        is_featured: isFeatured,
        display_order: displayOrder,
        videos: videos.filter(v => v.url).map((v, index) => ({
          title: v.title || null,
          url: v.url,
          type: v.type || 'youtube',
          display_order: index
        })),
        presentations: presentations.filter(p => p.title && p.url).map((p, index) => ({
          title: p.title,
          url: p.url,
          type: p.type || 'external',
          display_order: index
        }))
      };

      if (isEdit && project.id) {
        await api.updateProject(project.id, projectPayload);
        showStatus('Project entry successfully updated.');
      } else {
        await api.createProject(projectPayload);
        showStatus('Project entry successfully created.');
      }

      onSave(projectPayload as any);
    } catch (err: any) {
      console.error(err);
      showStatus(err.message || 'Database write error occurred during save.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl font-mono text-xs">
      
      {/* Form Header */}
      <div className="flex justify-between items-center border-b border-cyber-border pb-4">
        <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
          {isEdit ? `EDITING: ${project.title}` : 'ADD_NEW_ROBOTICS_SYSTEM'}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1 px-3 py-1.5 border border-cyber-border text-slate-400 hover:text-white rounded"
          >
            <X className="w-3.5 h-3.5" /> CANCEL
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1 px-4 py-1.5 bg-cyber-teal text-cyber-bg font-bold rounded hover:bg-white disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" /> {saving ? 'SAVING...' : 'SAVE_SYSTEM'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left main form details */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Section: Basic info */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 p-5 rounded-lg space-y-4">
            <h3 className="font-bold text-white uppercase tracking-wide">// basic_information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-400">System Name</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. STEM Bot"
                  className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-400">System Slug (URL identifier)</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. stem-bot"
                  className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-400">Date String</label>
                <input
                  type="text"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  placeholder="e.g. September 2022"
                  className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-400">Sector Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Robotics"
                  className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-400">Sequence Display Order</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                  className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400">Short Summary</label>
              <input
                type="text"
                required
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="Brief one-line summary of capabilities."
                className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400">Detailed Telemetry Description (Full details)</label>
              <textarea
                rows={6}
                value={fullDesc}
                onChange={(e) => setFullDesc(e.target.value)}
                placeholder="Enter details on algorithms, kinematics, sensors used..."
                className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal resize-none"
              ></textarea>
            </div>
          </div>

          {/* Section: Technologies Tags input */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 p-5 rounded-lg space-y-4">
            <h3 className="font-bold text-white uppercase tracking-wide">// technology_stack</h3>
            
            <div className="space-y-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleAddTech}
                placeholder="Press ENTER or comma to insert technology tag"
                className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {technologies.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-cyber-bg border border-cyber-teal/30 text-cyber-teal px-2 py-0.5 rounded"
                  >
                    {tag}
                    <button type="button" onClick={() => handleRemoveTech(tag)} className="text-slate-400 hover:text-white font-bold ml-1">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Media Videos list */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 p-5 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white uppercase tracking-wide">// video_feeds</h3>
              <button
                type="button"
                onClick={addVideoRow}
                className="text-cyber-teal flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> ADD_STREAM
              </button>
            </div>

            <div className="space-y-3">
              {videos.map((vid, idx) => (
                <div key={idx} className="border border-cyber-border/40 p-4 rounded bg-cyber-bg/40 space-y-2 relative">
                  <button
                    type="button"
                    onClick={() => removeVideoRow(idx)}
                    className="absolute top-2 right-2 text-slate-500 hover:text-cyber-orange"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase">Stream Label</label>
                      <input
                        type="text"
                        value={vid.title || ''}
                        onChange={(e) => updateVideoRow(idx, 'title', e.target.value)}
                        placeholder="e.g. SLAM Navigation"
                        className="w-full bg-cyber-bg border border-cyber-border rounded px-2.5 py-1.5 text-slate-200 outline-none focus:border-cyber-teal"
                      />
                    </div>
                    <div className="sm:col-span-5 space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase">Video URL</label>
                      <input
                        type="text"
                        required
                        value={vid.url || ''}
                        onChange={(e) => updateVideoRow(idx, 'url', e.target.value)}
                        placeholder="https://youtu.be/..."
                        className="w-full bg-cyber-bg border border-cyber-border rounded px-2.5 py-1.5 text-slate-200 outline-none focus:border-cyber-teal"
                      />
                      <p className="text-[8px] text-slate-500 font-sans mt-0.5">Supports YouTube or Google Drive share links (ensure link access is set to 'Anyone with the link').</p>
                    </div>
                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase">Feed Type</label>
                      <select
                        value={vid.type || 'youtube'}
                        onChange={(e) => updateVideoRow(idx, 'type', e.target.value)}
                        className="w-full bg-cyber-bg border border-cyber-border rounded px-2.5 py-1.5 text-slate-200 outline-none focus:border-cyber-teal"
                      >
                        <option value="youtube">YouTube</option>
                        <option value="external">External Link</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {videos.length === 0 && (
                <p className="text-[10px] text-slate-600 text-center uppercase tracking-wider py-4">No video feeds linked to system.</p>
              )}
            </div>
          </div>

          {/* Section: Presentation Document Links */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 p-5 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white uppercase tracking-wide">// document_presentations</h3>
              <button
                type="button"
                onClick={addPresentationRow}
                className="text-cyber-teal flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> ADD_DOCUMENT
              </button>
            </div>

            <div className="space-y-3">
              {presentations.map((pres, idx) => (
                <div key={idx} className="border border-cyber-border/40 p-4 rounded bg-cyber-bg/40 space-y-2 relative">
                  <button
                    type="button"
                    onClick={() => removePresentationRow(idx)}
                    className="absolute top-2 right-2 text-slate-500 hover:text-cyber-orange"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase">Doc Title</label>
                      <input
                        type="text"
                        value={pres.title || ''}
                        onChange={(e) => updatePresentationRow(idx, 'title', e.target.value)}
                        placeholder="e.g. Design Proposal PDF"
                        className="w-full bg-cyber-bg border border-cyber-border rounded px-2.5 py-1.5 text-slate-200 outline-none focus:border-cyber-teal"
                      />
                    </div>
                    <div className="sm:col-span-5 space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase">Doc Path / URL</label>
                      <input
                        type="text"
                        required
                        value={pres.url || ''}
                        onChange={(e) => updatePresentationRow(idx, 'url', e.target.value)}
                        placeholder="https://drive.google.com/..."
                        className="w-full bg-cyber-bg border border-cyber-border rounded px-2.5 py-1.5 text-slate-200 outline-none focus:border-cyber-teal"
                      />
                    </div>
                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase">Doc Type</label>
                      <select
                        value={pres.type || 'external'}
                        onChange={(e) => updatePresentationRow(idx, 'type', e.target.value)}
                        className="w-full bg-cyber-bg border border-cyber-border rounded px-2.5 py-1.5 text-slate-200 outline-none focus:border-cyber-teal"
                      >
                        <option value="external">External Link</option>
                        <option value="pdf">Direct PDF</option>
                        <option value="google_drive">Google Drive</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {presentations.length === 0 && (
                <p className="text-[10px] text-slate-600 text-center uppercase tracking-wider py-4">No presentation decks attached to system.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar options: links, flags, media */}
        <div className="md:col-span-4 space-y-6">
          
          {/* Section: publishing status */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 p-5 rounded-lg space-y-4">
            <h3 className="font-bold text-white uppercase tracking-wide">// publication_nodes</h3>
            
            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-400">Publishing Status</label>
                <div className="flex gap-2">
                  {['draft', 'published', 'archived'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatus(st as 'draft' | 'published' | 'archived')}
                      className={`flex-grow py-2 border rounded font-mono text-[10px] uppercase transition-all ${
                        status === st
                          ? st === 'archived'
                            ? 'border-cyber-purple bg-cyber-purple/10 text-cyber-purple font-bold'
                            : 'border-cyber-teal bg-cyber-teal/10 text-cyber-teal font-bold'
                          : 'border-cyber-border text-slate-400'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

              </div>

              <div className="flex items-center justify-between border border-cyber-border/50 p-3 rounded bg-cyber-bg/30">
                <div className="space-y-0.5">
                  <span className="text-white font-bold text-xs uppercase">FEATURED FLAG</span>
                  <p className="text-[9px] text-slate-500">Showcase in main hero timeline slider.</p>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4.5 h-4.5 border border-cyber-border bg-cyber-bg rounded accent-cyber-teal cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section: repository nodes */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 p-5 rounded-lg space-y-4">
            <h3 className="font-bold text-white uppercase tracking-wide">// external_nodes</h3>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-slate-400 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5" /> GitHub Repository
                </label>
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-400 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5" /> Project Live Page
                </label>
                <input
                  type="text"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://mysystem.com"
                  className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
                />
              </div>
            </div>
          </div>

          {/* Section: Thumbnail image selector */}
          <div className="bg-cyber-surface/30 border border-cyber-border/60 p-5 rounded-lg space-y-4">
            <h3 className="font-bold text-white uppercase tracking-wide">// thumbnail_media</h3>
            
            <div className="space-y-4">
              <div className="border border-dashed border-cyber-border p-4 rounded text-center bg-cyber-bg/40 relative">
                {uploadingImage ? (
                  <div className="py-4 text-center">
                    <div className="w-6 h-6 border-2 border-cyber-teal border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <span className="text-[10px] text-slate-500 uppercase">Uploading Image...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-6 h-6 text-slate-500 mx-auto" />
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Upload local file</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 uppercase text-[9px]">Thumbnail URL Address</label>
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://image.com/myimage.jpg"
                  className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
                />
              </div>

              {thumbnailUrl && (
                <div className="border border-cyber-border p-2 rounded bg-cyber-bg/40">
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest block mb-1">Preview</span>
                  <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-24 object-cover rounded" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

// =========================================================================
// EXPERIENCE RECORDS CMS SUB-SECTION
// =========================================================================
interface ExpCMSProps {
  experiences: Experience[];
  onReload: () => void;
  showStatus: (txt: string, type?: 'success' | 'error') => void;
}

function ExperienceCMSSection({ experiences, onReload, showStatus }: ExpCMSProps) {
  const [editingExp, setEditingExp] = useState<Partial<Experience> | null>(null);

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [highlightInput, setHighlightInput] = useState('');
  const [highlightVideoInput, setHighlightVideoInput] = useState('');
  const [highlights, setHighlights] = useState<ExperienceHighlight[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingExp) {
      setCompany(editingExp.company || '');
      setRole(editingExp.role || '');
      setLocation(editingExp.location || '');
      setStartDate(editingExp.start_date || '');
      setEndDate(editingExp.end_date || '');
      setIsCurrent(editingExp.is_current || false);
      setDisplayOrder(editingExp.display_order ?? 0);
      const rawHighlights = editingExp.highlights || [];
      const rawVideoUrls = editingExp.highlight_video_urls || [];
      setHighlights(
        rawHighlights.map((h: any, i: number) => ({
          text: typeof h === 'string' ? h : (h?.text || String(h)),
          video_url: rawVideoUrls[i] || (typeof h !== 'string' ? h?.video_url : null) || null
        }))
      );
    } else {
      setCompany('');
      setRole('');
      setLocation('');
      setStartDate('');
      setEndDate('');
      setIsCurrent(false);
      setDisplayOrder(0);
      setHighlights([]);
      setHighlightInput('');
      setHighlightVideoInput('');
    }
  }, [editingExp]);

  const handleAddHighlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (highlightInput.trim()) {
      const newHighlight: ExperienceHighlight = {
        text: highlightInput.trim(),
        video_url: highlightVideoInput.trim() || null
      };
      setHighlights([...highlights, newHighlight]);
      setHighlightInput('');
      setHighlightVideoInput('');
    }
  };

  const handleRemoveHighlight = (idx: number) => {
    setHighlights(highlights.filter((_, i) => i !== idx));
  };

  const handleUpdateHighlightVideoUrl = (idx: number, url: string) => {
    setHighlights(highlights.map((h, i) => i === idx ? { ...h, video_url: url || null } : h));
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role || !startDate) {
      showStatus('Company, Role, and Start Date are required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        company,
        role,
        location: location || null,
        start_date: startDate,
        end_date: isCurrent ? 'Present' : (endDate || null),
        is_current: isCurrent,
        highlights: highlights.map(h => h.text),
        highlight_video_urls: highlights.map(h => h.video_url || ''),
        display_order: displayOrder
      };

      if (editingExp?.id) {
        await api.updateExperience(editingExp.id, payload);
        showStatus('Experience entry updated.');
      } else {
        await api.createExperience(payload);
        showStatus('Experience entry added.');
      }

      setEditingExp(null);
      onReload();
    } catch (err: any) {
      showStatus(err.message || 'Database error occurred.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="flex justify-between items-center border-b border-cyber-border pb-4">
        <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-cyber-teal" />
          EXPERIENCE_LOG_CONTROL
        </h2>
        {!editingExp && (
          <button
            onClick={() => setEditingExp({})}
            className="flex items-center gap-1 px-3 py-1.5 bg-cyber-teal text-cyber-bg font-bold rounded hover:bg-white"
          >
            <Plus className="w-3.5 h-3.5" /> ADD_ENTRY
          </button>
        )}
      </div>

      {editingExp ? (
        <form onSubmit={handleSaveExp} className="bg-cyber-surface/30 border border-cyber-border p-6 rounded-lg space-y-6">
          <div className="flex justify-between items-center border-b border-cyber-border/40 pb-3">
            <h3 className="font-bold text-white uppercase">{editingExp.id ? 'EDIT ENTRY' : 'CREATE NEW ENTRY'}</h3>
            <button type="button" onClick={() => setEditingExp(null)} className="text-slate-400 hover:text-white">
              CLOSE
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-slate-400">Company Name</label>
              <input
                type="text"
                required
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="e.g. Kalyani Group"
                className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Role Title</label>
              <input
                type="text"
                required
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. RL Engineer"
                className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Location</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Pune"
                className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-slate-400">Start Date</label>
              <input
                type="text"
                required
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                placeholder="e.g. December 2025"
                className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">End Date</label>
              <input
                type="text"
                disabled={isCurrent}
                value={isCurrent ? 'Present' : endDate}
                onChange={e => setEndDate(e.target.value)}
                placeholder="e.g. June 2026"
                className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal disabled:opacity-50"
              />
            </div>
            <div className="space-y-1 shrink-0 flex items-center pt-5">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCurrent}
                  onChange={e => setIsCurrent(e.target.checked)}
                  className="accent-cyber-teal"
                />
                Current Position
              </label>
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Display order</label>
              <input
                type="number"
                value={displayOrder}
                onChange={e => setDisplayOrder(parseInt(e.target.value) || 0)}
                className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
              />
            </div>
          </div>

          {/* Highlights with Video URLs */}
          <div className="space-y-3">
            <label className="text-slate-400">Key Highlights / Bullet points</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={highlightInput}
                  onChange={e => setHighlightInput(e.target.value)}
                  placeholder="Enter highlight bullet text..."
                  className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
                />
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="px-4 py-2 border border-cyber-teal text-cyber-teal rounded hover:bg-cyber-teal/10 shrink-0"
                >
                  ADD
                </button>
              </div>
              <div className="flex gap-2 items-center">
                <Video className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <input
                  type="text"
                  value={highlightVideoInput}
                  onChange={e => setHighlightVideoInput(e.target.value)}
                  placeholder="Optional: Google Drive video URL for this bullet"
                  className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
                />
              </div>
              <p className="text-[8px] text-slate-500 font-sans">Add a video URL before pressing ADD to link a demo video to this highlight. You can also edit video URLs on existing bullets below.</p>
            </div>

            <ul className="space-y-2 pt-2">
              {highlights.map((h, i) => (
                <li key={i} className="p-3 border border-cyber-border/40 rounded bg-cyber-bg/40 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-slate-300 text-xs leading-relaxed">&gt; {h.text}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(i)}
                      className="text-slate-500 hover:text-cyber-orange shrink-0 mt-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Video className="w-3 h-3 text-cyber-teal/50 shrink-0" />
                    <input
                      type="text"
                      value={h.video_url || ''}
                      onChange={e => handleUpdateHighlightVideoUrl(i, e.target.value)}
                      placeholder="Paste Google Drive video link..."
                      className="w-full bg-cyber-bg/60 border border-cyber-border/60 rounded px-2.5 py-1.5 text-[11px] text-slate-300 outline-none focus:border-cyber-teal"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-cyber-teal text-cyber-bg font-bold font-mono rounded hover:bg-white transition-all disabled:opacity-50"
          >
            {saving ? 'SAVING DATA...' : 'SAVE RECORD'}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {experiences.map(exp => (
            <div key={exp.id} className="bg-cyber-surface/30 border border-cyber-border p-5 rounded-lg flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h4 className="font-bold text-white text-sm">{exp.role}</h4>
                <p className="text-cyber-teal">{exp.company} // {exp.location}</p>
                <p className="text-slate-500 text-[10px] uppercase font-mono tracking-wider">
                  [{exp.start_date} – {exp.end_date || 'Present'}]
                </p>
                <ul className="mt-3 space-y-1 text-[11px] text-slate-400">
                  {(() => {
                    const rawTexts = exp.highlights || [];
                    const rawVideos = exp.highlight_video_urls || [];
                    return rawTexts.map((h: any, i: number) => {
                      const text = typeof h === 'string' ? h : (h?.text || String(h));
                      const vUrl = rawVideos[i] || (typeof h !== 'string' ? h?.video_url : null);
                      return (
                        <li key={i} className="flex items-center gap-1.5">
                          &gt; {text}
                          {vUrl && vUrl !== '#' && (
                            <a href={vUrl} target="_blank" rel="noopener noreferrer" className="text-cyber-teal" title="Video linked">
                              <Video className="w-3 h-3" />
                            </a>
                          )}
                        </li>
                      );
                    });
                  })()}
                </ul>
              </div>

              <div className="flex sm:flex-col gap-2 justify-end items-end">
                <button
                  onClick={() => setEditingExp(exp)}
                  className="p-1.5 border border-cyber-border hover:border-cyber-teal text-slate-400 hover:text-cyber-teal rounded transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Delete this work experience?')) {
                      try {
                        await api.deleteExperience(exp.id);
                        showStatus('Experience entry deleted');
                        onReload();
                      } catch (err) {
                        showStatus('Delete failed', 'error');
                      }
                    }
                  }}
                  className="p-1.5 border border-cyber-border hover:border-cyber-orange text-slate-400 hover:text-cyber-orange rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =========================================================================
// SKILLS MATRIX CMS SUB-SECTION
// =========================================================================
interface SkillsCMSProps {
  skills: Skill[];
  onReload: () => void;
  showStatus: (txt: string, type?: 'success' | 'error') => void;
}

function SkillsCMSSection({ skills, onReload, showStatus }: SkillsCMSProps) {
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState<'Programming' | 'Robotics Hardware' | 'Simulation / Robotics Libraries' | 'Mechanical CAD' | 'Mechanical CAE' | 'General / AI'>('Programming');
  const [saving, setSaving] = useState(false);

  const categories = [
    'Programming', 'Robotics Hardware', 'Simulation / Robotics Libraries',
    'Mechanical CAD', 'Mechanical CAE', 'General / AI'
  ];

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    setSaving(true);
    try {
      const payload = {
        name: skillName.trim(),
        category,
        display_order: skills.filter(s => s.category === category).length + 1
      };

      await api.createSkill(payload);
      showStatus(`Skill tag "${skillName.trim()}" added to matrix.`);
      setSkillName('');
      onReload();
    } catch (err: any) {
      showStatus(err.message || 'Failed to add skill.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Group skills locally
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-8 font-mono text-xs">
      <div className="border-b border-cyber-border pb-4">
        <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Wrench className="w-5 h-5 text-cyber-teal" />
          TECHNICAL_SKILLS_CMS
        </h2>
      </div>

      {/* Add Skill form panel */}
      <form onSubmit={handleAddSkill} className="bg-cyber-surface/30 border border-cyber-border p-5 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div className="space-y-1.5">
          <label className="text-slate-400">Skill Tag Name</label>
          <input
            type="text"
            required
            value={skillName}
            onChange={e => setSkillName(e.target.value)}
            placeholder="e.g. ROS2"
            className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-slate-400">Skill Matrix Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value as any)}
            className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="py-2 px-4 bg-cyber-teal text-cyber-bg font-bold rounded hover:bg-white transition-all disabled:opacity-50"
        >
          {saving ? 'ADDING...' : 'ADD_SKILL_TAG'}
        </button>
      </form>

      {/* Grouped Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(cat => {
          const catSkills = groupedSkills[cat] || [];
          return (
            <div key={cat} className="bg-cyber-surface/20 border border-cyber-border p-5 rounded-lg">
              <h4 className="font-bold text-white uppercase border-b border-cyber-border/40 pb-2 mb-3">// {cat}</h4>
              <div className="flex flex-wrap gap-2">
                {catSkills.map(skill => (
                  <span
                    key={skill.id}
                    className="flex items-center gap-1.5 bg-cyber-bg border border-cyber-border text-slate-300 px-2.5 py-1 rounded"
                  >
                    {skill.name}
                    <button
                      type="button"
                      onClick={async () => {
                        if (confirm(`Delete skill tag: "${skill.name}"?`)) {
                          try {
                            await api.deleteSkill(skill.id);
                            showStatus('Skill tag deleted');
                            onReload();
                          } catch (err) {
                            showStatus('Delete failed', 'error');
                          }
                        }
                      }}
                      className="text-slate-500 hover:text-cyber-orange font-bold font-sans text-sm line-height-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {catSkills.length === 0 && (
                  <span className="text-[10px] text-slate-600 uppercase italic">No skill tags registered in sector.</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =========================================================================
// ACHIEVEMENTS LEDGER CMS SUB-SECTION
// =========================================================================
interface AchCMSProps {
  achievements: Achievement[];
  onReload: () => void;
  showStatus: (txt: string, type?: 'success' | 'error') => void;
}

function AchievementsCMSSection({ achievements, onReload, showStatus }: AchCMSProps) {
  const [editingAch, setEditingAch] = useState<Partial<Achievement> | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingAch) {
      setTitle(editingAch.title || '');
      setDescription(editingAch.description || '');
      setDateStr(editingAch.date_string || '');
      setLinkUrl(editingAch.link_url || '');
      setDisplayOrder(editingAch.display_order ?? 0);
    } else {
      setTitle('');
      setDescription('');
      setDateStr('');
      setLinkUrl('');
      setDisplayOrder(0);
    }
  }, [editingAch]);

  const handleSaveAch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dateStr) {
      showStatus('Title and Date String are required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title,
        description: description || null,
        date_string: dateStr,
        link_url: linkUrl || null,
        display_order: displayOrder
      };

      if (editingAch?.id) {
        await api.updateAchievement(editingAch.id, payload);
        showStatus('Achievement entry updated.');
      } else {
        await api.createAchievement(payload);
        showStatus('Achievement entry added.');
      }

      setEditingAch(null);
      onReload();
    } catch (err: any) {
      showStatus(err.message || 'Database error occurred.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="flex justify-between items-center border-b border-cyber-border pb-4">
        <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="w-5 h-5 text-cyber-teal" />
          ACHIEVEMENTS_LEDGER_CONTROL
        </h2>
        {!editingAch && (
          <button
            onClick={() => setEditingAch({})}
            className="flex items-center gap-1 px-3 py-1.5 bg-cyber-teal text-cyber-bg font-bold rounded hover:bg-white"
          >
            <Plus className="w-3.5 h-3.5" /> ADD_ACHIEVEMENT
          </button>
        )}
      </div>

      {editingAch ? (
        <form onSubmit={handleSaveAch} className="bg-cyber-surface/30 border border-cyber-border p-6 rounded-lg space-y-6">
          <div className="flex justify-between items-center border-b border-cyber-border/40 pb-3">
            <h3 className="font-bold text-white uppercase">{editingAch.id ? 'EDIT ACHIEVEMENT' : 'CREATE NEW ACHIEVEMENT'}</h3>
            <button type="button" onClick={() => setEditingAch(null)} className="text-slate-400 hover:text-white">
              CLOSE
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-400">Achievement Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Ranked Top 15 out of 300 teams"
                className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Date String</label>
              <input
                type="text"
                required
                value={dateStr}
                onChange={e => setDateStr(e.target.value)}
                placeholder="e.g. September 2022"
                className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-400">Reference/Proof Link URL</label>
              <input
                type="text"
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                placeholder="https://verify.com/certificate/..."
                className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Display Order</label>
              <input
                type="number"
                value={displayOrder}
                onChange={e => setDisplayOrder(parseInt(e.target.value) || 0)}
                className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">Description Summary</label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide a short description of the achievement details."
              className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-cyber-teal text-cyber-bg font-bold font-mono rounded hover:bg-white transition-all disabled:opacity-50"
          >
            {saving ? 'SAVING DATA...' : 'SAVE ACHIEVEMENT'}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {achievements.map(ach => (
            <div key={ach.id} className="bg-cyber-surface/30 border border-cyber-border p-5 rounded-lg flex justify-between gap-4">
              <div>
                <h4 className="font-bold text-white text-sm">{ach.title}</h4>
                <p className="text-slate-500 text-[10px] uppercase font-mono tracking-wider mt-1">
                  [DATE :: {ach.date_string || 'N/A'}]
                </p>
                {ach.description && <p className="text-slate-400 mt-2 text-xs">{ach.description}</p>}
                {ach.link_url && (
                  <a href={ach.link_url} target="_blank" rel="noopener noreferrer" className="text-cyber-teal hover:underline text-[10px] block mt-2">
                    Verify link
                  </a>
                )}
              </div>

              <div className="flex flex-col gap-2 justify-end items-end">
                <button
                  onClick={() => setEditingAch(ach)}
                  className="p-1.5 border border-cyber-border hover:border-cyber-teal text-slate-400 hover:text-cyber-teal rounded transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Delete this achievement ledger row?')) {
                      try {
                        await api.deleteAchievement(ach.id);
                        showStatus('Achievement deleted');
                        onReload();
                      } catch (err) {
                        showStatus('Delete failed', 'error');
                      }
                    }
                  }}
                  className="p-1.5 border border-cyber-border hover:border-cyber-orange text-slate-400 hover:text-cyber-orange rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =========================================================================
// PROFILE TELEMETRY CMS SUB-SECTION
// =========================================================================
interface ProfileCMSProps {
  profile: Profile;
  onReload: () => void;
  showStatus: (txt: string, type?: 'success' | 'error') => void;
}

function ProfileCMSSection({ profile, onReload, showStatus }: ProfileCMSProps) {
  const [name, setName] = useState(profile.name || '');
  const [title, setTitle] = useState(profile.title || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [contactEmail, setContactEmail] = useState(profile.contact_email || '');
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedin_url || '');
  const [githubUrl, setGithubUrl] = useState(profile.github_url || '');
  const [resumeUrl, setResumeUrl] = useState(profile.resume_url || '');
  
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    
    setUploadingResume(true);
    try {
      const fileName = `resume-${Date.now()}.pdf`;
      const filePath = `resumes/${fileName}`;
      
      const publicUrl = await api.uploadFile('portfolio-media', filePath, file);
      setResumeUrl(publicUrl);
      showStatus('Resume PDF document uploaded successfully.');
    } catch (err: any) {
      console.error(err);
      showStatus(err.message || 'PDF upload failed. Ensure storage CORS is active.', 'error');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !title) {
      showStatus('Name and Title are required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        id: profile.id,
        name,
        title,
        bio: bio || null,
        contact_email: contactEmail || null,
        linkedin_url: linkedinUrl || null,
        github_url: githubUrl || null,
        resume_url: resumeUrl || null
      };

      await api.updateProfile(payload);
      showStatus('Operator profile telemetry successfully saved to database.');
      onReload();
    } catch (err: any) {
      showStatus(err.message || 'Database transaction failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSaveProfile} className="space-y-6 max-w-3xl font-mono text-xs">
      <div className="border-b border-cyber-border pb-4">
        <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyber-teal" />
          PROFILE_TELEMETRY_CONTROL
        </h2>
      </div>

      <div className="bg-cyber-surface/30 border border-cyber-border p-6 rounded-lg space-y-6">
        
        {/* Name and title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-slate-400">Name Node</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-slate-400">Title Node</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
            />
          </div>
        </div>

        {/* Narrative bio */}
        <div className="space-y-1.5">
          <label className="text-slate-400">Narrative Bio summary</label>
          <textarea
            rows={5}
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal resize-none"
          ></textarea>
        </div>

        {/* Contact email and Resume */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-slate-400">Contact Email Node</label>
            <input
              type="email"
              value={contactEmail}
              onChange={e => setContactEmail(e.target.value)}
              className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-slate-400">Resume PDF Document</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={resumeUrl}
                onChange={e => setResumeUrl(e.target.value)}
                placeholder="https://storage.com/resume.pdf"
                className="flex-grow bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
              />
              <div className="relative border border-cyber-border bg-cyber-surface hover:bg-cyber-bg hover:border-cyber-teal rounded px-3 flex items-center justify-center cursor-pointer shrink-0 font-bold">
                {uploadingResume ? '...' : 'UPLOAD'}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-slate-400">LinkedIn URL Channel</label>
            <input
              type="text"
              value={linkedinUrl}
              onChange={e => setLinkedinUrl(e.target.value)}
              className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-slate-400">GitHub URL Channel</label>
            <input
              type="text"
              value={githubUrl}
              onChange={e => setGithubUrl(e.target.value)}
              className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-slate-200 outline-none focus:border-cyber-teal"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 bg-cyber-teal text-cyber-bg font-bold font-mono rounded hover:bg-white transition-all disabled:opacity-50"
        >
          {saving ? 'SAVING DATA...' : 'SAVE PROFILE DATA'}
        </button>
      </div>
    </form>
  );
}

// =========================================================================
// PUBLICATIONS & PATENTS CMS SUB-SECTION
// =========================================================================
interface PubCMSProps {
  publications: Publication[];
  onReload: () => void;
  showStatus: (txt: string, type?: 'success' | 'error') => void;
}

function PublicationsCMSSection({ publications, onReload, showStatus }: PubCMSProps) {
  const [editingPub, setEditingPub] = useState<Partial<Publication>>({});
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPub.title || !editingPub.authors || !editingPub.year) {
      showStatus('Title, Authors, and Year are required fields.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingPub.id) {
        await api.updatePublication(editingPub.id, editingPub);
        showStatus('Publication entry updated successfully.');
      } else {
        await api.createPublication(editingPub);
        showStatus('Publication entry created successfully.');
      }
      setShowModal(false);
      setEditingPub({});
      onReload();
    } catch (err: any) {
      showStatus(err.message || 'Error saving publication record', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete publication: "${title}"?`)) {
      try {
        await api.deletePublication(id);
        showStatus('Publication record deleted.');
        onReload();
      } catch (err: any) {
        showStatus('Failed to delete publication.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="flex justify-between items-center border-b border-cyber-border pb-4">
        <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyber-teal" />
          PUBLICATIONS_&_PATENTS_CMS
        </h2>
        <button
          onClick={() => {
            setEditingPub({ type: 'paper', year: new Date().getFullYear(), status: 'published', display_order: 0 });
            setShowModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-cyber-teal text-cyber-bg font-bold text-xs rounded hover:bg-white transition-all shadow-[0_0_10px_rgba(0,242,254,0.2)]"
        >
          <Plus className="w-4 h-4" />
          ADD_PUBLICATION
        </button>
      </div>

      <div className="border border-cyber-border rounded-lg overflow-hidden bg-cyber-surface/20">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="bg-cyber-surface text-slate-400 border-b border-cyber-border uppercase tracking-widest text-[10px]">
              <th className="p-4">Type</th>
              <th className="p-4">Title</th>
              <th className="p-4">Authors / Venue</th>
              <th className="p-4">Year</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {publications.map((pub) => (
              <tr key={pub.id} className="border-b border-cyber-border/40 hover:bg-cyber-surface/20 transition-colors">
                <td className="p-4">
                  <span className={`px-2 py-0.5 border rounded uppercase text-[10px] font-bold ${
                    pub.type === 'patent' ? 'border-cyber-orange text-cyber-orange' : 'border-cyber-teal text-cyber-teal'
                  }`}>
                    {pub.type}
                  </span>
                </td>
                <td className="p-4 font-bold text-white max-w-xs truncate">{pub.title}</td>
                <td className="p-4 text-slate-400 max-w-xs truncate">{pub.authors} {pub.publisher_journal ? `(${pub.publisher_journal})` : ''}</td>
                <td className="p-4">{pub.year}</td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => {
                      setEditingPub(pub);
                      setShowModal(true);
                    }}
                    className="p-1.5 border border-cyber-border hover:border-cyber-teal text-slate-400 hover:text-cyber-teal rounded transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(pub.id, pub.title)}
                    className="p-1.5 border border-cyber-border hover:border-cyber-orange text-slate-400 hover:text-cyber-orange rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-cyber-bg/85 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-cyber-surface border border-cyber-border p-6 rounded-lg w-full max-w-2xl space-y-4 font-mono text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-cyber-border pb-3">
              <h3 className="font-bold text-white uppercase text-sm">{editingPub.id ? 'EDIT PUBLICATION / PATENT' : 'NEW PUBLICATION / PATENT ENTRY'}</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-400">Record Type</label>
                <select
                  value={editingPub.type || 'paper'}
                  onChange={(e) => setEditingPub({ ...editingPub, type: e.target.value as any })}
                  className="w-full bg-cyber-bg border border-cyber-border p-2 rounded text-slate-200 outline-none"
                >
                  <option value="paper">Research Paper</option>
                  <option value="patent">Patent</option>
                  <option value="preprint">Preprint (arXiv)</option>
                  <option value="conference">Conference Proceeding</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Publication Year</label>
                <input
                  type="number"
                  required
                  value={editingPub.year || ''}
                  onChange={(e) => setEditingPub({ ...editingPub, year: parseInt(e.target.value) || new Date().getFullYear() })}
                  className="w-full bg-cyber-bg border border-cyber-border p-2 rounded text-slate-200 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Title</label>
              <input
                type="text"
                required
                value={editingPub.title || ''}
                onChange={(e) => setEditingPub({ ...editingPub, title: e.target.value })}
                className="w-full bg-cyber-bg border border-cyber-border p-2 rounded text-slate-200 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-400">Authors</label>
                <input
                  type="text"
                  required
                  value={editingPub.authors || ''}
                  onChange={(e) => setEditingPub({ ...editingPub, authors: e.target.value })}
                  placeholder="e.g. Shreyash Choudhari, Prof. Arpita Sinha"
                  className="w-full bg-cyber-bg border border-cyber-border p-2 rounded text-slate-200 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Publisher / Journal / Patent Office</label>
                <input
                  type="text"
                  value={editingPub.publisher_journal || ''}
                  onChange={(e) => setEditingPub({ ...editingPub, publisher_journal: e.target.value })}
                  placeholder="e.g. IISc Bangalore / AAAI"
                  className="w-full bg-cyber-bg border border-cyber-border p-2 rounded text-slate-200 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-400">DOI / Patent Number / Reference</label>
                <input
                  type="text"
                  value={editingPub.doi_patent_number || ''}
                  onChange={(e) => setEditingPub({ ...editingPub, doi_patent_number: e.target.value })}
                  placeholder="e.g. PAT-2025-IISC-091 or DOI:..."
                  className="w-full bg-cyber-bg border border-cyber-border p-2 rounded text-slate-200 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">External Web URL / Drive Link</label>
                <input
                  type="text"
                  value={editingPub.url || ''}
                  onChange={(e) => setEditingPub({ ...editingPub, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-cyber-bg border border-cyber-border p-2 rounded text-slate-200 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Abstract / Executive Summary</label>
              <textarea
                rows={4}
                value={editingPub.abstract || ''}
                onChange={(e) => setEditingPub({ ...editingPub, abstract: e.target.value })}
                className="w-full bg-cyber-bg border border-cyber-border p-2 rounded text-slate-200 outline-none resize-none"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-cyber-border">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-cyber-border text-slate-400 rounded">
                CANCEL
              </button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-cyber-teal text-cyber-bg font-bold rounded">
                {saving ? 'SAVING...' : 'SAVE_RECORD'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

