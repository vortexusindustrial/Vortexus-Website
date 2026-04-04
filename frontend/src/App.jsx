import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminLayout from './components/layout/AdminLayout'
import RouteScrollManager from './components/layout/RouteScrollManager'
import SiteLayout from './components/layout/SiteLayout'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AboutPage from './pages/AboutPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import ContactPage from './pages/ContactPage'
import HomePage from './pages/HomePage'
import NewsPage from './pages/NewsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ProjectsPage from './pages/ProjectsPage'
import ServicesPage from './pages/ServicesPage'
import SolutionDetailPage from './pages/SolutionDetailPage'
import SolutionsPage from './pages/SolutionsPage'

function App() {
  return (
    <>
      <RouteScrollManager />
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route
            path="admin/dashboard"
            element={(
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            )}
          />
        </Route>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about-us" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="solutions" element={<SolutionsPage />} />
          <Route path="solutions/:slug" element={<SolutionDetailPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="contact-us" element={<ContactPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:slug" element={<ProjectDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
