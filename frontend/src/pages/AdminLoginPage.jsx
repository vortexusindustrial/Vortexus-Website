import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Seo from '../components/seo/Seo'
import { useAuth } from '../context/AuthContext'
import { company } from '../data/site/company'

function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login(email, password)
      const redirectTo = location.state?.from?.pathname || '/admin/dashboard'
      navigate(redirectTo, { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center py-6 sm:py-10">
      <Seo
        title="Admin Login"
        description="Secure admin login for the Vortexus lead and revenue attribution dashboard."
      />
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-brand-border bg-white shadow-[0_24px_80px_rgba(35,33,32,0.08)] lg:grid-cols-[0.94fr_1.06fr]">
        <div className="theme-hero-blue relative hidden min-h-full overflow-hidden px-8 py-10 text-white lg:block">
          <div className="theme-hero-blue-overlay absolute inset-0" />
          <div className="theme-hero-blue-grid absolute inset-0 opacity-20" />
          <div className="theme-hero-blue-orb absolute left-10 top-10 h-32 w-32 rounded-full blur-3xl" />
          <div className="relative">
            <img src={company.logo} alt={`${company.name} logo`} className="h-16 w-auto object-contain brightness-[1.8]" />
            <p className="mt-14 text-xs font-semibold uppercase tracking-[0.34em] text-white/76">
              Lead Attribution Console
            </p>
            <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight">
              Track the leads and revenue your website is generating.
            </h1>
            <ul className="mt-8 space-y-4 text-sm leading-7 text-white/82">
              <li>Website lead capture</li>
              <li>Pipeline stage tracking</li>
              <li>Closed revenue attribution</li>
              <li>Landing page and product performance</li>
            </ul>
          </div>
        </div>

        <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand-green">
            Admin Access
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-brand-ink sm:text-4xl">
            Sign in to the dashboard
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-brand-muted">
            Use your admin or staff credentials to view sourced leads, pipeline progress,
            and website-attributed revenue.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-brand-ink">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@company.com"
                className="h-12 w-full rounded-[0.95rem] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/60 focus:border-brand-green"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-brand-ink">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="h-12 w-full rounded-[0.95rem] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/60 focus:border-brand-green"
                required
              />
            </label>

            {error ? (
              <div className="rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-green px-5 text-sm font-semibold text-white transition hover:bg-brand-green-soft disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage
