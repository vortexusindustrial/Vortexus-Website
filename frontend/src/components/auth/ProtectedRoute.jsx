import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-canvas px-4">
        <div className="rounded-[1.5rem] border border-brand-border bg-white px-6 py-5 text-sm text-brand-muted shadow-[0_18px_46px_rgba(35,33,32,0.05)]">
          Loading dashboard...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
