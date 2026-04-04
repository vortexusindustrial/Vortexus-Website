import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Seo from '../components/seo/Seo'
import { useAuth } from '../context/AuthContext'
import { apiRequest } from '../lib/api'

const statusLabels = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  quoted: 'Quoted',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
}

const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({
  value,
  label,
}))

function currencyFormat(value) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

function buildQuery(filters) {
  const params = new URLSearchParams()
  params.set('source_channel', 'website')

  if (filters.startDate) {
    params.set('start_date', filters.startDate)
  }
  if (filters.endDate) {
    params.set('end_date', filters.endDate)
  }
  if (filters.landingPage) {
    params.set('landing_page', filters.landingPage)
  }
  if (filters.productInterest) {
    params.set('product_interest', filters.productInterest)
  }

  return `?${params.toString()}`
}

function AdminDashboardPage() {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()
  const [summary, setSummary] = useState(null)
  const [leads, setLeads] = useState([])
  const [allWebsiteLeads, setAllWebsiteLeads] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [updatingLeadId, setUpdatingLeadId] = useState(null)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    landingPage: '',
    productInterest: '',
  })

  const loadDashboard = async (activeFilters = filters, includeReferenceLeads = false) => {
    setIsLoading(true)
    setError('')

    try {
      const queryString = buildQuery(activeFilters)
      const requests = [
        apiRequest(`/dashboard/summary${queryString}`, { token }),
        apiRequest(`/leads${queryString}`, { token }),
      ]

      if (includeReferenceLeads) {
        requests.push(apiRequest('/leads?source_channel=website', { token }))
      }

      const responses = await Promise.all(requests)
      const [summaryData, leadsData, referenceLeadsData] = responses

      setSummary(summaryData)
      setLeads(leadsData.leads || [])

      if (referenceLeadsData) {
        setAllWebsiteLeads(referenceLeadsData.leads || [])
      }
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard(filters, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const kpiCards = useMemo(() => {
    if (!summary) {
      return []
    }

    return [
      { label: 'Website Leads', value: summary.kpis.website_leads },
      { label: 'Qualified Leads', value: summary.kpis.qualified_website_leads },
      { label: 'Won Deals', value: summary.kpis.won_deals },
      { label: 'Pipeline Value', value: currencyFormat(summary.kpis.website_pipeline_value) },
      { label: 'Website Revenue', value: currencyFormat(summary.kpis.website_sourced_revenue) },
      { label: 'Lead to Sale %', value: `${summary.kpis.lead_to_sale_conversion_rate}%` },
    ]
  }, [summary])

  const landingPageOptions = useMemo(
    () =>
      [...new Set(allWebsiteLeads.map((lead) => lead.landing_page).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b),
      ),
    [allWebsiteLeads],
  )

  const productInterestOptions = useMemo(
    () =>
      [
        ...new Set(
          allWebsiteLeads
            .map((lead) => lead.product_interest || lead.service_interest)
            .filter(Boolean),
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [allWebsiteLeads],
  )

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  const handleFilterChange = (field) => (event) => {
    setFilters((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleApplyFilters = (event) => {
    event.preventDefault()
    loadDashboard(filters)
  }

  const handleResetFilters = () => {
    const resetFilters = {
      startDate: '',
      endDate: '',
      landingPage: '',
      productInterest: '',
    }
    setFilters(resetFilters)
    loadDashboard(resetFilters)
  }

  const handleStatusChange = async (leadId, nextStatus) => {
    setUpdatingLeadId(leadId)
    setError('')

    try {
      await apiRequest(`/leads/${leadId}`, {
        method: 'PATCH',
        token,
        body: { status: nextStatus },
      })

      setLeads((current) =>
        current.map((lead) =>
          lead.id === leadId
            ? {
                ...lead,
                status: nextStatus,
              }
            : lead,
        ),
      )

      await loadDashboard(filters)
    } catch (updateError) {
      setError(updateError.message)
    } finally {
      setUpdatingLeadId(null)
    }
  }

  return (
    <div className="space-y-8">
      <Seo
        title="Lead Dashboard"
        description="Admin dashboard for website leads, pipeline stages, and website-attributed revenue."
      />

      <section className="overflow-hidden rounded-[2rem] border border-brand-border bg-white shadow-[0_24px_80px_rgba(35,33,32,0.08)]">
        <div className="theme-hero-blue relative overflow-hidden px-5 py-6 text-white sm:px-8 sm:py-8">
          <div className="theme-hero-blue-overlay absolute inset-0" />
          <div className="theme-hero-blue-grid absolute inset-0 opacity-20" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/78">
                Website Attribution Dashboard
              </p>
              <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                Track sourced leads, pipeline movement, and closed revenue.
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/82 sm:text-base">
                This dashboard shows what the website is generating, how those leads move through
                the pipeline, and which pages or product interests are contributing to revenue.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-full border border-white/18 bg-white/8 px-4 py-2 text-sm text-white/82">
                Signed in as {user?.name || user?.email}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/14"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-brand-border bg-white px-5 py-5 shadow-[0_18px_46px_rgba(35,33,32,0.05)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-green">
              Reporting Filters
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-brand-ink sm:text-3xl">
              Narrow the website attribution view
            </h2>
          </div>
          <p className="text-sm text-brand-muted">
            Filter by date, landing page, and product interest.
          </p>
        </div>

        <form onSubmit={handleApplyFilters} className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-brand-ink">Start date</span>
            <input
              type="date"
              value={filters.startDate}
              onChange={handleFilterChange('startDate')}
              className="h-11 w-full rounded-[0.95rem] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition focus:border-brand-green"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-brand-ink">End date</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={handleFilterChange('endDate')}
              className="h-11 w-full rounded-[0.95rem] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition focus:border-brand-green"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-brand-ink">Landing page</span>
            <select
              value={filters.landingPage}
              onChange={handleFilterChange('landingPage')}
              className="h-11 w-full rounded-[0.95rem] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition focus:border-brand-green"
            >
              <option value="">All pages</option>
              {landingPageOptions.map((page) => (
                <option key={page} value={page}>
                  {page}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-brand-ink">Product interest</span>
            <select
              value={filters.productInterest}
              onChange={handleFilterChange('productInterest')}
              className="h-11 w-full rounded-[0.95rem] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition focus:border-brand-green"
            >
              <option value="">All interests</option>
              {productInterestOptions.map((interest) => (
                <option key={interest} value={interest}>
                  {interest}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end gap-3">
            <button
              type="submit"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-brand-green px-5 text-sm font-semibold text-white transition hover:bg-brand-green-soft"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-brand-border bg-white px-5 text-sm font-semibold text-brand-ink transition hover:border-brand-green hover:text-brand-green"
            >
              Reset
            </button>
          </div>
        </form>
      </section>

      {error ? (
        <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="h-28 animate-pulse rounded-[1.5rem] border border-brand-border bg-white"
              />
            ))
          : kpiCards.map((card) => (
              <article
                key={card.label}
                className="rounded-[1.5rem] border border-brand-border bg-white px-5 py-5 shadow-[0_18px_46px_rgba(35,33,32,0.05)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-green">
                  {card.label}
                </p>
                <p className="mt-4 font-display text-3xl font-semibold text-brand-ink sm:text-4xl">
                  {card.value}
                </p>
              </article>
            ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.75rem] border border-brand-border bg-white px-5 py-5 shadow-[0_18px_46px_rgba(35,33,32,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-green">
            Pipeline Stages
          </p>
          <div className="mt-5 space-y-4">
            {Object.entries(summary?.stage_counts || {}).map(([status, count]) => (
              <div key={status}>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium text-brand-ink">{statusLabels[status] || status}</span>
                  <span className="text-brand-muted">{count}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-brand-surface">
                  <div
                    className="h-2 rounded-full bg-brand-green"
                    style={{
                      width: `${Math.min(100, ((count || 0) / Math.max(1, summary?.kpis.website_leads || 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-brand-border bg-white px-5 py-5 shadow-[0_18px_46px_rgba(35,33,32,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-green">
            Top Landing Pages
          </p>
          <div className="mt-5 space-y-4">
            {(summary?.top_pages || []).slice(0, 6).map((item) => (
              <div key={item.page} className="flex items-start justify-between gap-4 border-t border-brand-border pt-4 first:border-t-0 first:pt-0">
                <div>
                  <p className="text-sm font-semibold text-brand-ink">{item.page}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-brand-muted/70">
                    {item.leads} leads
                  </p>
                </div>
                <p className="text-sm font-medium text-brand-green">
                  {currencyFormat(item.revenue)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-[1.75rem] border border-brand-border bg-white px-5 py-5 shadow-[0_18px_46px_rgba(35,33,32,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-green">
            Top Products / Interests
          </p>
          <div className="mt-5 space-y-4">
            {(summary?.top_products || []).slice(0, 6).map((item) => (
              <div key={item.product} className="flex items-start justify-between gap-4 border-t border-brand-border pt-4 first:border-t-0 first:pt-0">
                <div>
                  <p className="text-sm font-semibold text-brand-ink">{item.product}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-brand-muted/70">
                    {item.leads} leads
                  </p>
                </div>
                <p className="text-sm font-medium text-brand-green">
                  {currencyFormat(item.revenue)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-brand-border bg-white px-5 py-5 shadow-[0_18px_46px_rgba(35,33,32,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-green">
            Recent Closed Deals
          </p>
          <div className="mt-5 space-y-4">
            {(summary?.recent_closed_deals || []).length === 0 ? (
              <p className="text-sm leading-7 text-brand-muted">
                No closed website-attributed deals yet.
              </p>
            ) : (
              (summary?.recent_closed_deals || []).map((deal) => (
                <div key={deal.id} className="border-t border-brand-border pt-4 first:border-t-0 first:pt-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-brand-ink">
                        {deal.company_name || deal.customer_name}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.22em] text-brand-muted/70">
                        {deal.product_interest || 'General inquiry'}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-brand-green">
                      {currencyFormat(deal.final_closed_value)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-brand-border bg-white px-5 py-5 shadow-[0_18px_46px_rgba(35,33,32,0.05)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-green">
              Website Leads
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-brand-ink sm:text-3xl">
              Captured leads with inline status editing
            </h2>
          </div>
          <p className="text-sm text-brand-muted">
            Update the pipeline stage directly from the dashboard.
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {leads.slice(0, 16).map((lead) => (
            <article
              key={lead.id}
              className="rounded-[1.35rem] border border-brand-border bg-brand-canvas/60 px-4 py-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-brand-ink">
                    {lead.company_name || lead.customer_name}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-brand-muted/70">
                    Lead #{lead.id}
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-green shadow-[0_10px_20px_rgba(35,33,32,0.05)]">
                  {lead.product_interest || lead.service_interest || 'General'}
                </span>
              </div>

              <div className="mt-4 grid gap-2 text-sm text-brand-muted sm:grid-cols-2">
                <p>{lead.email || 'No email provided'}</p>
                <p>{lead.phone || 'No phone provided'}</p>
                <p>{lead.landing_page || 'Unknown page'}</p>
                <p>{currencyFormat(lead.final_closed_value || lead.quote_value || lead.estimated_value)}</p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-brand-muted/70">
                    Status
                  </span>
                  <select
                    value={lead.status}
                    onChange={(event) => handleStatusChange(lead.id, event.target.value)}
                    disabled={updatingLeadId === lead.id}
                    className="h-11 w-full rounded-[0.95rem] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition focus:border-brand-green disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="text-xs uppercase tracking-[0.24em] text-brand-muted/70">
                  {updatingLeadId === lead.id ? 'Saving…' : statusLabels[lead.status] || lead.status}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AdminDashboardPage
