import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import LeadCaptureModal from '../components/leads/LeadCaptureModal'
import Seo from '../components/seo/Seo'
import { industriesCatalog } from '../data/productCatalog'
import { brandsCatalog } from '../data/brandsCatalog'
import { loadCatalogSummary } from '../lib/catalogApi'
import { company } from '../data/site/company'

const treatmentImage = '/homepage products (1).png'
const fieldImage = '/homepage products (2).png'
const heroSlides = [
  {
    src: treatmentImage,
    alt: 'Industrial water treatment equipment and product systems',
    fit: 'object-contain object-center bg-brand-ink',
  },
  {
    src: fieldImage,
    alt: 'Field water infrastructure installation and product deployment',
    fit: 'object-contain object-center bg-brand-ink',
  },
]

function HomePage() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const [catalogSummary, setCatalogSummary] = useState({
    totalProducts: 0,
    featuredProducts: [],
  })

  useEffect(() => {
    let isMounted = true

    loadCatalogSummary()
      .then((summary) => {
        if (isMounted) {
          setCatalogSummary(summary)
        }
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="space-y-16 pb-8 lg:space-y-22">
      <Seo
        title="Industrial Water Treatment Products"
        description={`${company.name} is building a product-focused catalog for water treatment equipment, RO systems, chemicals, pumps, instrumentation, automation, tanks, and industrial water process applications.`}
      />
      <section className="relative left-1/2 -mt-8 min-h-[38rem] w-screen -translate-x-1/2 overflow-hidden bg-brand-ink lg:-mt-12 lg:min-h-[44rem]">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              className={`hero-bg-slide absolute inset-0 h-full w-full ${slide.fit}`}
              style={{ animationDelay: `${index * 6}s` }}
            />
          ))}
          <div className="theme-home-hero-overlay absolute inset-0" />
          <div className="theme-home-hero-radial absolute inset-0" />
        </div>

        <div className="relative mx-auto flex min-h-[38rem] w-full max-w-7xl items-center px-6 py-10 sm:px-8 lg:min-h-[44rem] lg:px-10 lg:py-14">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.38em] text-brand-green-muted">
              Water Treatment Product Catalog
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[1.02] font-semibold tracking-tight text-white drop-shadow-[0_14px_30px_rgba(0,0,0,0.28)] sm:text-6xl lg:text-7xl">
              Empowering Industrial Excellence with the world’s leading brands & Products.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/86 drop-shadow-[0_10px_26px_rgba(0,0,0,0.22)] sm:text-lg">
              Browse filtration systems, reverse osmosis equipment, pumps, chemicals,
              instrumentation, automation, tanks, and industry-focused product groups
              through a structured catalog designed for industrial buying.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <NavLink
                to="/products"
                className="inline-flex items-center justify-center rounded-full bg-brand-green px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-green-soft"
              >
                Explore Products
              </NavLink>
              <button
                type="button"
                onClick={() => setIsLeadModalOpen(true)}
                className="inline-flex items-center justify-center rounded-full border border-white/24 bg-white/8 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/12"
              >
                Request a Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div>
          <p className="text-center text-sm font-semibold uppercase tracking-[0.34em] text-brand-green">
            Industry-Leading Brands
          </p>
        </div>

        <div className="grid grid-cols-2 items-center gap-x-8 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {brandsCatalog.map((brand) => (
              <NavLink
                key={brand.name}
                to={`/products?brand=${encodeURIComponent(brand.slug)}`}
                className="flex min-h-[70px] items-center justify-center px-3 py-3 transition hover:-translate-y-0.5"
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="max-h-12 w-auto max-w-full object-contain"
                  loading="lazy"
                />
              </NavLink>
            ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-brand-green">
              Featured Products
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold text-brand-ink sm:text-5xl">
              Featured stock products ready for detail review and RFQ.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-brand-muted">
              The homepage now focuses on getting buyers to the right products faster,
              with category routes, product detail pages, related items, and RFQ actions.
            </p>
          </div>
          <NavLink
            to="/products"
            className="inline-flex items-center justify-center rounded-full border border-brand-border bg-white px-5 py-3 text-sm font-semibold text-brand-ink transition hover:border-brand-green hover:text-brand-green"
          >
            Browse Products
          </NavLink>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {catalogSummary.featuredProducts.slice(0, 4).map((product) => (
            <article
              key={product.slug}
              className="overflow-hidden rounded-[1.65rem] border border-brand-border bg-white shadow-[0_16px_38px_rgba(35,33,32,0.05)]"
            >
              <img
                src={product.image || '/place holder.jpg'}
                alt={product.name}
                className="h-52 w-full object-cover"
              />
              <div className="space-y-4 px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-green">
                  {product.subcategory}
                </p>
                <div>
                  <h3 className="font-display text-[1.7rem] font-semibold leading-tight text-brand-ink">
                    {product.name}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  <NavLink
                    to={`/products/item/${product.slug}`}
                    className="inline-flex items-center justify-center rounded-full bg-brand-green px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-green-soft"
                  >
                    View Product
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => setIsLeadModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-full border border-brand-border bg-white px-5 py-3 text-sm font-semibold text-brand-ink transition hover:border-brand-green hover:text-brand-green"
                  >
                    RFQ
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-brand-green">
            Industries
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold text-brand-ink sm:text-5xl">
            Browse products by application environment.
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {industriesCatalog.map((industry) => (
            <NavLink
              key={industry.slug}
              to={`/industries/${industry.slug}`}
              className="rounded-full border border-brand-border bg-white px-4 py-2.5 text-sm font-medium text-brand-ink transition hover:border-brand-green hover:text-brand-green"
            >
              {industry.name}
            </NavLink>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] bg-brand-ink px-6 py-10 text-white sm:px-8 lg:px-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-brand-green-muted">
              Ready To Talk?
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold sm:text-5xl">
              Let’s help you identify the right product line and move it into quotation.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">
              If you already know the product family, go directly into the catalog. If not,
              send your requirement and we will guide you to the right item or equivalent line.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <button
              type="button"
              onClick={() => setIsLeadModalOpen(true)}
              className="inline-flex items-center justify-center rounded-full bg-brand-green px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-green-soft"
            >
              Request a Quote
            </button>
            <NavLink
              to="/products"
              className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/6 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Browse Products
            </NavLink>
          </div>
        </div>
      </section>
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        title="Request a Quotation"
        landingPage="/"
        serviceInterest="General product inquiry"
      />
    </div>
  )
}

export default HomePage
