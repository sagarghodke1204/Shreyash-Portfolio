import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve directory paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '20mb' })); // Large limit for base64 file uploads

// Initialize Supabase Client on the backend using the admin service key (bypasses RLS)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('CRITICAL ERROR: Supabase credentials (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) missing in server/.env!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Authentication Middleware
 * Checks the Authorization header for a valid Supabase JWT.
 */
const authenticateAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. Authorization token required.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Access denied. Invalid or expired token session.' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('Session validation crash:', err);
    res.status(500).json({ error: 'Failed to verify admin security token.' });
  }
};

/* ==========================================================================
   PUBLIC ENDPOINTS
   ========================================================================== */

// Profile metadata
app.get('/api/profile', async (req, res) => {
  try {
    const { data, error } = await supabase.from('profiles').select('*').maybeSingle();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Experiences List
app.get('/api/experiences', async (req, res) => {
  try {
    const { data, error } = await supabase.from('experiences').select('*').order('display_order', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Education List
app.get('/api/education', async (req, res) => {
  try {
    const { data, error } = await supabase.from('education').select('*').order('display_order', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Skills Matrix
app.get('/api/skills', async (req, res) => {
  try {
    const { data, error } = await supabase.from('skills').select('*').order('display_order', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Achievements List
app.get('/api/achievements', async (req, res) => {
  try {
    const { data, error } = await supabase.from('achievements').select('*').order('display_order', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Publications & Patents List
app.get('/api/publications', async (req, res) => {
  try {
    const { data, error } = await supabase.from('publications').select('*').order('display_order', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Projects Catalog
app.get('/api/projects', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*, videos:project_videos(id), presentations(id)')
      .order('display_order', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Individual Project Details by Slug
app.get('/api/projects/:slug', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*, videos:project_videos(*), presentations(*)')
      .eq('slug', req.params.slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'System record not found.' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Contact Form submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    console.log(`[CONTACT_FORM] Received message from ${name} (${email}): [${subject}] - ${message}`);
    // Succeed and respond. Frontend triggers mailto client-side fallback
    res.json({ success: true, message: 'Transmission successfully received by system backend logs.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================================================
   AUTHENTICATION ENDPOINT
   ========================================================================== */

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    res.json({
      token: data.session.access_token,
      user: data.user,
      session: data.session
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================================================
   ADMIN PROTECTED ENDPOINTS (CRUD OPERATIONS)
   ========================================================================== */

// Profile Update
app.put('/api/profile', authenticateAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ ...req.body, updated_at: new Date() })
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Experiences CRUD
app.post('/api/experiences', authenticateAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('experiences').insert(req.body).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/experiences/:id', authenticateAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('experiences').update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/experiences/:id', authenticateAdmin, async (req, res) => {
  try {
    const { error } = await supabase.from('experiences').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Skills CRUD
app.post('/api/skills', authenticateAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('skills').insert(req.body).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/skills/:id', authenticateAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('skills').update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/skills/:id', authenticateAdmin, async (req, res) => {
  try {
    const { error } = await supabase.from('skills').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Achievements CRUD
app.post('/api/achievements', authenticateAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('achievements').insert(req.body).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/achievements/:id', authenticateAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('achievements').update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/achievements/:id', authenticateAdmin, async (req, res) => {
  try {
    const { error } = await supabase.from('achievements').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Publications & Patents CRUD
app.post('/api/publications', authenticateAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('publications').insert(req.body).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/publications/:id', authenticateAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('publications').update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/publications/:id', authenticateAdmin, async (req, res) => {
  try {
    const { error } = await supabase.from('publications').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Projects CRUD (Handles nested project_videos and presentations relations)
app.post('/api/projects', authenticateAdmin, async (req, res) => {
  try {
    const { videos, presentations, ...projData } = req.body;
    // Insert base project
    const { data: project, error: projErr } = await supabase.from('projects').insert(projData).select().single();
    if (projErr) throw projErr;

    // Insert videos
    if (videos && videos.length > 0) {
      const videosWithId = videos.map(v => ({ ...v, project_id: project.id }));
      const { error: vidErr } = await supabase.from('project_videos').insert(videosWithId);
      if (vidErr) throw vidErr;
    }

    // Insert presentations
    if (presentations && presentations.length > 0) {
      const presWithId = presentations.map(p => ({ ...p, project_id: project.id }));
      const { error: presErr } = await supabase.from('presentations').insert(presWithId);
      if (presErr) throw presErr;
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id', authenticateAdmin, async (req, res) => {
  try {
    const { videos, presentations, ...projData } = req.body;
    // Update base project record
    const { data: project, error: projErr } = await supabase
      .from('projects')
      .update(projData)
      .eq('id', req.params.id)
      .select()
      .single();
    if (projErr) throw projErr;

    // Sync videos: delete old and insert new
    await supabase.from('project_videos').delete().eq('project_id', req.params.id);
    if (videos && videos.length > 0) {
      const cleanVideos = videos.map(({ id, created_at, ...v }) => ({ ...v, project_id: project.id }));
      const { error: vidErr } = await supabase.from('project_videos').insert(cleanVideos);
      if (vidErr) throw vidErr;
    }

    // Sync presentations: delete old and insert new
    await supabase.from('presentations').delete().eq('project_id', req.params.id);
    if (presentations && presentations.length > 0) {
      const cleanPres = presentations.map(({ id, created_at, ...p }) => ({ ...p, project_id: project.id }));
      const { error: presErr } = await supabase.from('presentations').insert(cleanPres);
      if (presErr) throw presErr;
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', authenticateAdmin, async (req, res) => {
  try {
    const { error } = await supabase.from('projects').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// File upload proxy: receives base64 payload, converts to buffer, uploads to Supabase Storage
app.post('/api/upload', authenticateAdmin, async (req, res) => {
  const { bucket, path: filePath, fileBase64, contentType } = req.body;
  if (!bucket || !filePath || !fileBase64) {
    return res.status(400).json({ error: 'Missing required parameters bucket, path, or fileBase64.' });
  }

  try {
    const buffer = Buffer.from(fileBase64, 'base64');
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: contentType || 'application/octet-stream',
        upsert: true
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    res.json({ publicUrl: publicUrlData.publicUrl });
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================================================
   STATIC PRODUCTION FILES SERVING
   ========================================================================== */

const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback index.html mapping for React SPA Router
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`[SERVER] Portfolio Backend running at http://localhost:${PORT}`);
});
