import type { Profile, Experience, Education, Skill, Project, Achievement, Publication } from '../types';
import { supabase } from './supabase';


const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Helper to fetch authorization header token from localStorage
 */
function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('portfolio_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Handles standard JSON response errors
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  // Authentication Actions
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await handleResponse<{ token: string; user: any; session: any }>(res);
        localStorage.setItem('portfolio_admin_token', data.token);
        return data;
      }
    } catch (err) {
      console.warn('Backend auth endpoint unreachable, attempting direct Supabase login fallback');
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      throw new Error(error?.message || 'Login failed.');
    }
    const token = data.session.access_token;
    localStorage.setItem('portfolio_admin_token', token);
    return { token, user: data.user };
  },

  logout(): void {
    localStorage.removeItem('portfolio_admin_token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('portfolio_admin_token');
  },

  // Profile Actions
  async getProfile(): Promise<Profile | null> {
    try {
      const res = await fetch(`${API_BASE}/profile`);
      if (res.ok) return await res.json();
    } catch (err) {
      // ignore & fallback to direct Supabase
    }

    const { data, error } = await supabase.from('profiles').select('*').maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateProfile(profile: Partial<Profile>): Promise<Profile> {
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(profile)
      });
      if (res.ok) return await handleResponse<Profile>(res);
    } catch (err) {
      // fallback
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert({ ...profile, updated_at: new Date() })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Experiences Actions
  async getExperiences(): Promise<Experience[]> {
    try {
      const res = await fetch(`${API_BASE}/experiences`);
      if (res.ok) return await res.json();
    } catch (err) {
      // fallback
    }

    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async createExperience(exp: Partial<Experience>): Promise<Experience> {
    try {
      const res = await fetch(`${API_BASE}/experiences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(exp)
      });
      if (res.ok) return await handleResponse<Experience>(res);
    } catch (err) {
      // fallback
    }

    const { data, error } = await supabase.from('experiences').insert(exp).select().single();
    if (error && error.message && error.message.includes('highlight_video_urls')) {
      const { highlight_video_urls, ...expWithoutVideo } = exp;
      const retry = await supabase.from('experiences').insert(expWithoutVideo).select().single();
      if (retry.error) throw retry.error;
      return retry.data;
    }
    if (error) throw error;
    return data;
  },

  async updateExperience(id: string, exp: Partial<Experience>): Promise<Experience> {
    try {
      const res = await fetch(`${API_BASE}/experiences/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(exp)
      });
      if (res.ok) return await handleResponse<Experience>(res);
    } catch (err) {
      // fallback
    }

    const { data, error } = await supabase.from('experiences').update(exp).eq('id', id).select().single();
    if (error && error.message && error.message.includes('highlight_video_urls')) {
      const { highlight_video_urls, ...expWithoutVideo } = exp;
      const retry = await supabase.from('experiences').update(expWithoutVideo).eq('id', id).select().single();
      if (retry.error) throw retry.error;
      return retry.data;
    }
    if (error) throw error;
    return data;
  },

  async deleteExperience(id: string): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/experiences/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      if (res.ok) return await handleResponse<{ success: boolean }>(res);
    } catch (err) {
      // fallback
    }

    const { error } = await supabase.from('experiences').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  },

  // Education Actions
  async getEducation(): Promise<Education[]> {
    try {
      const res = await fetch(`${API_BASE}/education`);
      if (res.ok) return await res.json();
    } catch (err) {
      // fallback
    }

    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  // Skills Actions
  async getSkills(): Promise<Skill[]> {
    try {
      const res = await fetch(`${API_BASE}/skills`);
      if (res.ok) return await res.json();
    } catch (err) {
      // fallback
    }

    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async createSkill(skill: Partial<Skill>): Promise<Skill> {
    try {
      const res = await fetch(`${API_BASE}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(skill)
      });
      if (res.ok) return await handleResponse<Skill>(res);
    } catch (err) {
      // fallback
    }

    const { data, error } = await supabase.from('skills').insert(skill).select().single();
    if (error) throw error;
    return data;
  },

  async updateSkill(id: string, skill: Partial<Skill>): Promise<Skill> {
    try {
      const res = await fetch(`${API_BASE}/skills/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(skill)
      });
      if (res.ok) return await handleResponse<Skill>(res);
    } catch (err) {
      // fallback
    }

    const { data, error } = await supabase.from('skills').update(skill).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteSkill(id: string): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/skills/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      if (res.ok) return await handleResponse<{ success: boolean }>(res);
    } catch (err) {
      // fallback
    }

    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  },

  // Achievements Actions
  async getAchievements(): Promise<Achievement[]> {
    try {
      const res = await fetch(`${API_BASE}/achievements`);
      if (res.ok) return await res.json();
    } catch (err) {
      // fallback
    }

    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async createAchievement(ach: Partial<Achievement>): Promise<Achievement> {
    try {
      const res = await fetch(`${API_BASE}/achievements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(ach)
      });
      if (res.ok) return await handleResponse<Achievement>(res);
    } catch (err) {
      // fallback
    }

    const { data, error } = await supabase.from('achievements').insert(ach).select().single();
    if (error) throw error;
    return data;
  },

  async updateAchievement(id: string, ach: Partial<Achievement>): Promise<Achievement> {
    try {
      const res = await fetch(`${API_BASE}/achievements/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(ach)
      });
      if (res.ok) return await handleResponse<Achievement>(res);
    } catch (err) {
      // fallback
    }

    const { data, error } = await supabase.from('achievements').update(ach).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteAchievement(id: string): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/achievements/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      if (res.ok) return await handleResponse<{ success: boolean }>(res);
    } catch (err) {
      // fallback
    }

    const { error } = await supabase.from('achievements').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  },

  // Publications & Patents Actions
  async getPublications(): Promise<Publication[]> {
    try {
      const res = await fetch(`${API_BASE}/publications`);
      if (res.ok) return await res.json();
    } catch (err) {
      // fallback
    }

    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async createPublication(pub: Partial<Publication>): Promise<Publication> {
    try {
      const res = await fetch(`${API_BASE}/publications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(pub)
      });
      if (res.ok) return await handleResponse<Publication>(res);
    } catch (err) {
      // fallback
    }

    const { data, error } = await supabase.from('publications').insert(pub).select().single();
    if (error) throw error;
    return data;
  },

  async updatePublication(id: string, pub: Partial<Publication>): Promise<Publication> {
    try {
      const res = await fetch(`${API_BASE}/publications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(pub)
      });
      if (res.ok) return await handleResponse<Publication>(res);
    } catch (err) {
      // fallback
    }

    const { data, error } = await supabase.from('publications').update(pub).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deletePublication(id: string): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/publications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      if (res.ok) return await handleResponse<{ success: boolean }>(res);
    } catch (err) {
      // fallback
    }

    const { error } = await supabase.from('publications').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  },

  // Projects Actions

  async getProjects(): Promise<Project[]> {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (res.ok) return await res.json();
    } catch (err) {
      // fallback
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*, videos:project_videos(id), presentations(id)')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getProject(slug: string): Promise<Project> {
    try {
      const res = await fetch(`${API_BASE}/projects/${slug}`);
      if (res.ok) return await res.json();
    } catch (err) {
      // fallback
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*, videos:project_videos(*), presentations(*)')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Project not found');
    return data;
  },

  async createProject(project: any): Promise<Project> {
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(project)
      });
      if (res.ok) return await handleResponse<Project>(res);
    } catch (err) {
      // fallback
    }

    const { videos, presentations, ...projData } = project;
    const { data: createdProject, error: projErr } = await supabase.from('projects').insert(projData).select().single();
    if (projErr) throw projErr;

    if (videos && videos.length > 0) {
      const videosWithId = videos.map((v: any) => ({ ...v, project_id: createdProject.id }));
      await supabase.from('project_videos').insert(videosWithId);
    }

    if (presentations && presentations.length > 0) {
      const presWithId = presentations.map((p: any) => ({ ...p, project_id: createdProject.id }));
      await supabase.from('presentations').insert(presWithId);
    }

    return createdProject;
  },

  async updateProject(id: string, project: any): Promise<Project> {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(project)
      });
      if (res.ok) return await handleResponse<Project>(res);
    } catch (err) {
      // fallback
    }

    const { videos, presentations, ...projData } = project;
    const { data: updatedProject, error: projErr } = await supabase
      .from('projects')
      .update(projData)
      .eq('id', id)
      .select()
      .single();
    if (projErr) throw projErr;

    await supabase.from('project_videos').delete().eq('project_id', id);
    if (videos && videos.length > 0) {
      const cleanVideos = videos.map(({ id: _, created_at: __, ...v }: any) => ({ ...v, project_id: id }));
      await supabase.from('project_videos').insert(cleanVideos);
    }

    await supabase.from('presentations').delete().eq('project_id', id);
    if (presentations && presentations.length > 0) {
      const cleanPres = presentations.map(({ id: _, created_at: __, ...p }: any) => ({ ...p, project_id: id }));
      await supabase.from('presentations').insert(cleanPres);
    }

    return updatedProject;
  },

  async deleteProject(id: string): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      if (res.ok) return await handleResponse<{ success: boolean }>(res);
    } catch (err) {
      // fallback
    }

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  },

  // Contact Actions
  async submitContact(name: string, email: string, subject: string, message: string): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      if (res.ok) return await handleResponse<{ success: boolean }>(res);
    } catch (err) {
      // ignore
    }
    return { success: true };
  },

  // Upload Action
  async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const base64 = await base64Promise;

      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({
          bucket,
          path,
          fileBase64: base64,
          contentType: file.type
        })
      });
      if (res.ok) {
        const data = await handleResponse<{ publicUrl: string }>(res);
        return data.publicUrl;
      }
    } catch (err) {
      // Fallback direct storage upload
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  }
};
