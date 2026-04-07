import { useEffect, useMemo, useState } from 'react'
import { NavLink, useSearchParams } from 'react-router-dom'
import FullBleedHero from '../components/sections/FullBleedHero'
import Seo from '../components/seo/Seo'
import { industriesCatalog, productCategories } from '../data/productCatalog'
import { apiRequest } from '../lib/api'

function RequestQuotePage() {
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    categorySlug: '',
    industrySlug: '',
    productName: '',
    quantity: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')

  const selectedCategory = useMemo(
    () => productCategories.find((category) => category.slug === formData.categorySlug) || null,
    [formData.categorySlug],
  )

  const selectedIndustry = useMemo(
    () => industriesCatalog.find((industry) => industry.slug === formData.industrySlug) || null,
    [formData.industrySlug],
  )

  useEffect(() => {
    const category = searchParams.get('category') || ''
    const industry = searchParams.get('industry') || ''
    const product = searchParams.get('product') || ''

    if (!category && !industry && !product) {
      return
    }

    setFormData((current) => ({
      ...current,
      categorySlug: category || current.categorySlug,
      industrySlug: industry || current.industrySlug,
      productName: product || current.productName,
    }))
  }, [searchParams])

  const handleChange = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    setSubmitSuccess('')

    try {
      await apiRequest('/leads/public', {
        method: 'POST',
        body: {
          customer_name: formData.fullName,
          company_name: formData.companyName,
          email: formData.email,
          phone: formData.phone,
          source_channel: 'website',
          source_medium: 'rfq-page',
          landing_page: '/request-quote',
          first_page: '/request-quote',
          product_interest: formData.productName || selectedCategory?.name || undefined,
          service_interest: selectedIndustry?.name || selectedCategory?.name || 'RFQ',
          message: [
            formData.quantity ? `Quantity / size requirement: ${formData.quantity}` : null,
            selectedCategory ? `Category: ${selectedCategory.name}` : null,
            selectedIndustry ? `Industry: ${selectedIndustry.name}` : null,
            formData.message,
          ]
            .filter(Boolean)
            .join('\n\n'),
          attribution_owner: 'website',
        },
      })

      setSubmitSuccess('Your quotation request has been submitted. Our team will follow up with the next technical and commercial steps.')
      setFormData({
        fullName: '',
        companyName: '',
        email: '',
        phone: '',
        categorySlug: '',
        industrySlug: '',
        productName: '',
        quantity: '',
        message: '',
      })
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-16 text-brand-ink lg:space-y-24">
      <Seo
        title="Request Quote"
        description="Request a quotation for water-treatment products, pumps, chemicals, membranes, instruments, controls, tanks, and industry-specific equipment."
      />
      <FullBleedHero
        eyebrow="Request for Quotation"
        title="Start your RFQ with the right technical context."
        description="Use this page when you already know the product family, industry, quantity, or process need. The goal is to move serious buying intent into a cleaner quotation workflow."
        imageSrc="/images/assets/img/norwa/waterinfrastructure.webp"
        imageAlt="Request quotation for industrial water treatment products"
        overlayClassName="theme-hero-dark"
      >
        <div className="flex flex-wrap gap-3">
          <NavLink
            to="/products"
            className="inline-flex items-center justify-center rounded-full bg-brand-green px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-green-soft"
          >
            Browse Products
          </NavLink>
          <NavLink
            to="/industries"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/8 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/12"
          >
            Browse Industries
          </NavLink>
        </div>
      </FullBleedHero>

      <section className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-[2rem] border border-brand-border bg-white px-6 py-6 shadow-[0_20px_52px_rgba(35,33,32,0.06)] sm:px-8 sm:py-8"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-brand-green">
              RFQ Form
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold text-brand-ink sm:text-5xl">
              Send a quotation request.
            </h2>
          </div>

          {(formData.productName || selectedCategory || selectedIndustry) ? (
            <div className="rounded-[1.1rem] border border-brand-border bg-brand-surface px-4 py-4 text-sm leading-7 text-brand-muted">
              <span className="font-semibold text-brand-ink">Prefilled context:</span>{' '}
              {[
                formData.productName ? `Product: ${formData.productName}` : null,
                selectedCategory ? `Category: ${selectedCategory.name}` : null,
                selectedIndustry ? `Industry: ${selectedIndustry.name}` : null,
              ]
                .filter(Boolean)
                .join(' · ')}
            </div>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-brand-ink">Full Name</span>
              <input
                type="text"
                value={formData.fullName}
                onChange={handleChange('fullName')}
                placeholder="Your full name"
                className="h-12 w-full rounded-[0.95rem] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/60 focus:border-brand-green"
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-brand-ink">Company</span>
              <input
                type="text"
                value={formData.companyName}
                onChange={handleChange('companyName')}
                placeholder="Company name"
                className="h-12 w-full rounded-[0.95rem] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/60 focus:border-brand-green"
              />
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-brand-ink">Email</span>
              <input
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                placeholder="Email address"
                className="h-12 w-full rounded-[0.95rem] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/60 focus:border-brand-green"
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-brand-ink">Phone</span>
              <input
                type="tel"
                value={formData.phone}
                onChange={handleChange('phone')}
                placeholder="Phone number"
                className="h-12 w-full rounded-[0.95rem] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/60 focus:border-brand-green"
                required
              />
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-brand-ink">Product Category</span>
              <select
                value={formData.categorySlug}
                onChange={handleChange('categorySlug')}
                className="h-12 w-full rounded-[0.95rem] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition focus:border-brand-green"
              >
                <option value="">Select a category</option>
                {productCategories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-brand-ink">Industry</span>
              <select
                value={formData.industrySlug}
                onChange={handleChange('industrySlug')}
                className="h-12 w-full rounded-[0.95rem] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition focus:border-brand-green"
              >
                <option value="">Select an industry</option>
                {industriesCatalog.map((industry) => (
                  <option key={industry.slug} value={industry.slug}>
                    {industry.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-brand-ink">Product Name or Item</span>
              <input
                type="text"
                value={formData.productName}
                onChange={handleChange('productName')}
                placeholder="Example: BW 4040 RO Membrane"
                className="h-12 w-full rounded-[0.95rem] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/60 focus:border-brand-green"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-brand-ink">Quantity / Size</span>
              <input
                type="text"
                value={formData.quantity}
                onChange={handleChange('quantity')}
                placeholder="e.g 10 pcs / 20 m3/day"
                className="h-12 w-full rounded-[0.95rem] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/60 focus:border-brand-green"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-brand-ink">Requirement Details</span>
            <textarea
              rows="5"
              value={formData.message}
              onChange={handleChange('message')}
              placeholder="Tell us the application, water source, process need, or technical requirement."
              className="w-full rounded-[0.95rem] border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/60 focus:border-brand-green"
              required
            />
          </label>

          {submitError ? (
            <div className="rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          ) : null}

          {submitSuccess ? (
            <div className="rounded-[1rem] border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {submitSuccess}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-green px-5 text-sm font-semibold text-white transition hover:bg-brand-green-soft disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Submitting...' : 'Submit RFQ'}
          </button>
        </form>

        <div className="space-y-5">
          <div className="rounded-[1.75rem] border border-brand-border bg-brand-surface px-5 py-5">
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-brand-green">
              Best Used For
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-brand-muted">
              <li>Products with multiple size options</li>
              <li>Industrial equipment requiring technical review</li>
              <li>Category-level requests before final shortlisting</li>
              <li>Industry-specific procurement inquiries</li>
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-brand-border bg-white px-5 py-5 shadow-[0_18px_46px_rgba(35,33,32,0.05)]">
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-brand-green">
              Quick Links
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {productCategories.slice(0, 6).map((category) => (
                <NavLink
                  key={category.slug}
                  to={`/products/category/${category.slug}`}
                  className="rounded-full border border-brand-border bg-white px-4 py-2.5 text-sm font-semibold text-brand-ink transition hover:border-brand-green hover:text-brand-green"
                >
                  {category.name}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default RequestQuotePage
