import React, { Suspense } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './layouts/Layout';

// Páginas cargadas de forma diferida (Code Splitting) para reducir el JS inicial
const Home = React.lazy(() => import('./pages/Home'));
const AboutMe = React.lazy(() => import('./pages/AboutMe'));
const Projects = React.lazy(() => import('./pages/Projects'));
const Blog = React.lazy(() => import('./pages/Blog'));
const Article = React.lazy(() => import('./pages/Article'));
const Login = React.lazy(() => import('./pages/Login'));
const Admin = React.lazy(() => import('./pages/Admin'));
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <LanguageProvider>
        <Suspense fallback={<div className="min-h-screen bg-background flex flex-col items-center justify-center"><div className="w-8 h-8 md:w-12 md:h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div></div>}>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Spanish Routes (Default) */}
              <Route index element={<Home />} />
              <Route path="sobre-mi" element={<AboutMe />} />
              <Route path="proyectos" element={<Projects />} />
              <Route path="project/:slug" element={<ProjectDetail />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<Article />} />
              <Route path="login" element={<Login />} />
              <Route path="admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />

              {/* English Routes */}
              <Route path="en">
                <Route index element={<Home />} />
                <Route path="about" element={<AboutMe />} />
                <Route path="projects" element={<Projects />} />
                <Route path="project/:slug" element={<ProjectDetail />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:slug" element={<Article />} />
                <Route path="login" element={<Login />} />
                <Route path="admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
