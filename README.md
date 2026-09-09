# Shreyash Choudhari | Professional Robotics & AI Portfolio

A modern, high-end, responsive personal portfolio website and Content Management System (CMS) designed specifically for a Robotics, Computer Vision, and AI/ML Engineer.

This repository features a **Public Portfolio Website** and a **Private Admin / CMS Dashboard** that connects directly to a **Supabase** backend. The portfolio owner can log in and add, edit, or delete projects, videos, presentations, skills, and experience items dynamically without touching the frontend code.

---

## 1. Tech Stack
* **Frontend:** React, Vite, TypeScript, Tailwind CSS v4, Lucide Icons, React Router
* **Backend / Database:** Supabase (PostgreSQL database, Storage Buckets, Auth, Row Level Security)
* **Hosting:** Optimized for static deployments such as GitHub Pages, Netlify, or Vercel
* **CI/CD:** Automatic builds and deployment using GitHub Actions

---

## 2. Installation
To set up and run this project locally:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Portfolio
   ```
2. **Install Node dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   * Duplicate `.env.example` and rename it to `.env`:
     ```bash
     cp .env.example .env
     ```
   * Populate `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with your credentials (see Supabase Setup below).

---

## 3. Supabase Setup & Database Schema
Follow these steps to connect your portfolio with your Supabase database:

### Step 1: Create a Supabase Project
1. Log in to [Supabase Console](https://supabase.com) and click **New Project**.
2. Input a project name, database password, and choose a region near you.
3. Once the project is provisioned, go to **Project Settings** -> **API** to copy:
   * **Project URL** (Input as `VITE_SUPABASE_URL` in `.env`)
   * **Anon Public API Key** (Input as `VITE_SUPABASE_ANON_KEY` in `.env`)

### Step 2: Initialize Tables & Seed Data
1. Navigated to the **SQL Editor** in the left sidebar of the Supabase dashboard.
2. Click **New Query**.
3. Open the file `supabase/setup.sql` in this repository, copy its entire contents, and paste it into the Supabase SQL editor.
4. Click **Run**. This will create the tables:
   * `profiles`, `experiences`, `education`, `skills`, `projects`, `project_videos`, `presentations`, `achievements`
5. It will also configure **Row Level Security (RLS)** policies on all tables so that public visitors can only read published content, while only authenticated operators can perform insert/update/delete operations.
6. The script will seed the database with initial resume information.

### Step 3: Create Storage Bucket
For uploading project thumbnails and PDF files:
1. Go to the **Storage** section in the left sidebar of the Supabase dashboard.
2. Click **New Bucket**.
3. Name the bucket `portfolio-media` and toggle it to **Public**.
4. Set up access policies by running this SQL script in the SQL editor:
   ```sql
   -- Create RLS Policies for portfolio-media Storage Bucket
   CREATE POLICY "Public Read Access"
     ON storage.objects FOR SELECT
     USING ( bucket_id = 'portfolio-media' );

   CREATE POLICY "Auth Insert Access"
     ON storage.objects FOR INSERT
     TO authenticated
     WITH CHECK ( bucket_id = 'portfolio-media' );

   CREATE POLICY "Auth Update Access"
     ON storage.objects FOR UPDATE
     TO authenticated
     USING ( bucket_id = 'portfolio-media' )
     WITH CHECK ( bucket_id = 'portfolio-media' );

   CREATE POLICY "Auth Delete Access"
     ON storage.objects FOR DELETE
     TO authenticated
     USING ( bucket_id = 'portfolio-media' );
   ```

---

## 4. Admin Authentication
To access the admin dashboard (`#/admin/login`):

1. Go to **Authentication** in the Supabase Dashboard.
2. Click **Add User** -> **Create User**.
3. Enter the administrator's email and password. Click **Save**.
4. Disable "Confirm User Email" in settings if you want to log in immediately without checking email verification.
5. Once created, visit `#/admin/login` on the website, input these credentials, and you will be routed to the CMS.

---

## 5. Local Development
To run the local hot-reloading development server:
```bash
npm run dev
```
The console will display the local port (usually `http://localhost:5173`).

---

## 6. Production Build & Verification
To test compilation and build the static assets:
```bash
npm run build
```
The output directory will be created as `dist/`. You can preview the build locally using:
```bash
npm run preview
```

---

## 7. GitHub Pages Deployment
The website is configured with SPA routing using **HashRouter** (URLs like `#/projects`), which works out-of-the-box on GitHub Pages without redirect errors or 404 reloads.

### Setup Base Path (If Applicable)
If deploying to a repository subfolder (e.g., `https://<username>.github.io/portfolio/`), adjust the base path in `vite.config.ts` or during build:
```bash
npm run build -- --base=/portfolio/
```

### Deploying Automatically via GitHub Actions
We have provided an automated build workflow in `.github/workflows/deploy.yml`. To activate it:
1. Push this codebase to your GitHub repository.
2. Go to **Settings** -> **Secrets and variables** -> **Actions** in your GitHub repository.
3. Add Repository Secrets for the build:
   * `VITE_SUPABASE_URL`: Your Supabase project URL
   * `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
4. Go to **Settings** -> **Pages** in the repository:
   * Build and deployment source: Select **GitHub Actions** or select deploy from the **gh-pages** branch created by the workflow.
5. Push a commit to the `main` branch, and GitHub Actions will automatically compile the site and deploy it!

---

## 8. CMS Guide: How to Manage Content

### Logging In
Navigate to `#/admin/login`, enter your email and password, and click **Initialize Session**. You will be redirected to the secure `#/admin/dashboard`.

### Adding or Editing Projects
1. Go to the **Projects Control** tab in the admin sidebar.
2. Click **[ + ADD PROJECT ]** or click the **Edit (pencil)** icon on an existing project.
3. **Basic Fields:** Fill in Title, Short Description, Full Description, Date (e.g. "April 2022"), and Sector Category.
4. **Publishing Status:** Toggle between `Draft` and `Published`. Check `Featured` to pin the project.
5. **Technologies:** Input tags by typing the name (e.g., `ROS2`) and pressing **ENTER**.
6. **Thumbnails:** Click **Upload file** to select an image from your computer (uploaded directly to Supabase storage), or paste an external image URL.
7. **Linked Videos:** Click **Add Stream** to insert YouTube urls.
8. **Presentations:** Click **Add Document** to attach presentation PDF links, Google Drive links, or external page URLs.
9. Click **[ SAVE SYSTEM ]** to publish instantly.

### Managing Experience, Skills, Achievements, and Profile
* **Experiences Log:** Add new employment rows, specify company, start/end dates, toggle "Current Position", and add bullet point highlights.
* **Skills Matrix:** Type in a technical skill and select its category segment. Click delete to remove tags.
* **Achievements Ledger:** Log awards, certifications, or patents along with verification links.
* **Profile Telemetry:** Update Shreyash's name, title, bio, contact email, social handles, and upload an updated resume PDF directly into storage.

---

## 9. Security Considerations
* **Row Level Security (RLS):** All write requests to database tables and storage require a valid user token. Anyone can read, but only logged-in operators can modify database rows.
* **No Hardcoded Secrets:** No Supabase service-role keys or admin passwords are built into the client code. All API calls use the public `anon` key, which is safe to expose under RLS protection.
