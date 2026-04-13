import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import AboutMe from './pages/AboutMe';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import Article from './pages/Article';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ProjectDetail from './pages/ProjectDetail';

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
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
