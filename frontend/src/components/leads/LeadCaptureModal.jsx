import { useEffect, useState } from 'react'
import { apiRequest } from '../../lib/api'

function LeadCaptureModal({
  isOpen,
  onClose,
  title = 'Request a Consultation',
  landingPage = '/',
  productInterest = '',
  serviceInterest = '',
}) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) {
      setError('')
      setSuccess('')
      setIsSubmitting(false)
    }
  }, [isOpen])

  const handleChange = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await apiRequest('/leads/public', {
        method: 'POST',
        body: {
          customer_name: formData.name,
          company_name: formData.company,
          email: formData.email,
          phone: formData.phone,
          source_channel: 'website',
          source_medium: 'cta',
          landing_page: landingPage,
          first_page: landingPage,
          product_interest: productInterest || undefined,
          service_interest: serviceInterest || undefined,
          message: formData.message,
          attribution_owner: 'website',
        },
      })

      setSuccess('Your inquiry has been captured. Our team will reach out shortly.')
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        message: '',
      })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end bg-brand-ink/55 p-0 sm:items-center sm:justify-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full rounded-t-[1.75rem] border border-brand-border bg-white px-5 py-6 shadow-[0_24px_80px_rgba(35,33,32,0.18)] sm:max-w-xl sm:rounded-[1.75rem] sm:px-6"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-white text-brand-muted transition hover:text-brand-ink"
          aria-label="Close inquiry form"
        >
          ×
        </button>

        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand-green">
          Website Inquiry
        </p>
        <h3 className="mt-3 max-w-[90%] font-display text-3xl font-semibold text-brand-ink">
          {title}
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-7 text-brand-muted">
          Share your details and interest area so the team can follow up with the right solution path.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-brand-ink">Name</span>
            <input
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
              className="h-12 w-full rounded-[0.95rem] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/60 focus:border-brand-green"
              placeholder="Your full name"
              required
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-brand-ink">Company</span>
              <input
                type="text"
                value={formData.company}
                onChange={handleChange('company')}
                className="h-12 w-full rounded-[0.95rem] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/60 focus:border-brand-green"
                placeholder="Company name"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-brand-ink">Phone</span>
              <input
                type="tel"
                value={formData.phone}
                onChange={handleChange('phone')}
                className="h-12 w-full rounded-[0.95rem] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/60 focus:border-brand-green"
                placeholder="Phone number"
                required
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-brand-ink">Email</span>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              className="h-12 w-full rounded-[0.95rem] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/60 focus:border-brand-green"
              placeholder="Email address"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-brand-ink">What do you need?</span>
            <textarea
              rows="4"
              value={formData.message}
              onChange={handleChange('message')}
              className="w-full rounded-[0.95rem] border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/60 focus:border-brand-green"
              placeholder="Tell us what you need, site context, or product interest."
              required
            />
          </label>

          {error ? (
            <div className="rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-[1rem] border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-green px-5 text-sm font-semibold text-white transition hover:bg-brand-green-soft disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LeadCaptureModal
