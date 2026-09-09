import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Publications from './pages/Publications';
import ProjectDetail from './pages/ProjectDetail';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import { supabase } from './lib/supabase';

// Scroll to top on route change helper
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layout wrapper that includes navigation and checks profile for resume URL
function PublicLayout({ children }: { children: React.ReactNode }) {
  const [resumeUrl, setResumeUrl] = useState('#');

  useEffect(() => {
    // Fetch profile resume url
    supabase
      .from('profiles')
      .select('resume_url')
      .maybeSingle()
      .then(({ data }) => {
        if (data?.resume_url) {
          setResumeUrl(data.resume_url);
        }
      });
  }, []);

  return (
    <>
      <Navigation resumeUrl={resumeUrl} />
      {children}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Sector Routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/projects"
          element={
            <PublicLayout>
              <Projects />
            </PublicLayout>
          }
        />
        <Route
          path="/publications"
          element={
            <PublicLayout>
              <Publications />
            </PublicLayout>
          }
        />
        <Route
          path="/project/:slug"
          element={
            <PublicLayout>
              <ProjectDetail />
            </PublicLayout>
          }
        />


        {/* Private Administrative Routes */}
        <Route path="/admin/login" element={<Login />} />
        
        {/* Protected Dashboard Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Route>

        {/* Route Resolution Failure Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
