import BlueAccentHero from '../components/sections/BlueAccentHero'
import Seo from '../components/seo/Seo'

const companyPillars = [
  {
    title: 'Catalog-Led Supply',
    text: 'We are building a structured product environment that helps clients move quickly from category discovery to item review and RFQ.',
  },
  {
    title: 'Industrial Relevance',
    text: 'Our focus is on water-treatment products, pumps, chemicals, tanks, control systems, instrumentation, and related industrial components.',
  },
  {
    title: 'Technical Confidence',
    text: 'We position products with practical application context so buyers, engineers, and procurement teams can make better decisions.',
  },
  {
    title: 'RFQ Readiness',
    text: 'The platform is designed to support quotation-driven buying rather than consumer-cart behavior, which suits industrial purchasing better.',
  },
]

const coreValues = [
  {
    title: 'Integrity',
    text: 'We uphold high ethical standards, fostering trust and transparency in all our interactions with clients, suppliers, and partners.',
    accent: 'border-[#7E8BF6]',
  },
  {
    title: 'Collaboration',
    text: 'We believe in teamwork, valuing diverse perspectives and working together to achieve stronger outcomes.',
    accent: 'border-[#55B96A]',
  },
  {
    title: 'Sustainability',
    text: 'We support practices that contribute to long-term environmental, social, and economic well-being.',
    accent: 'border-[#6160C8]',
  },
  {
    title: 'Inclusivity',
    text: 'We strive to create an environment where people feel valued, respected, and fairly represented.',
    accent: 'border-[#E67C62]',
  },
  {
    title: 'Innovation',
    text: 'We embrace creativity and continuous improvement, encouraging new ideas that drive progress and excellence.',
    accent: 'border-[#7E8BF6]',
  },
  {
    title: 'Empowerment',
    text: 'We are committed to providing opportunities for personal and professional growth so individuals can realize their full potential.',
    accent: 'border-[#55B96A]',
  },
  {
    title: 'Accountability',
    text: 'We take responsibility for our actions and decisions, ensuring reliability and ownership in our work.',
    accent: 'border-[#6160C8]',
  },
  {
    title: 'Time',
    text: 'We value timely execution and decision-making, ensuring our actions contribute to efficiency and measurable progress.',
    accent: 'border-[#E67C62]',
  },
]

const capabilityBands = [
  'Reverse osmosis and desalination product lines',
  'Filtration systems, media, and pressure vessels',
  'Treatment chemicals, resin, chlorine, and antiscalants',
  'Pumps, motors, pressure items, and fluid handling',
  'Automation, control panels, and monitoring instruments',
  'Storage tanks, brine tanks, and process accessories',
]

function AboutPage() {
  return (
    <div className="space-y-16 pb-8 lg:space-y-22">
      <Seo
        title="About Us"
        description="Learn about Vortexus Industrial Solutions as a product-focused industrial water treatment company supplying filtration, RO, pumping, chemicals, tanks, control systems, and RFQ-ready catalog products."
      />

      <BlueAccentHero
        eyebrow="About Vortexus"
        title="About Us"
        description="Vortexus is evolving into a product-focused industrial water-treatment platform built around structured product discovery, technical review, and quotation-ready buying."
      />

      <section className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-brand-green">
            Who We Are
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold text-brand-ink sm:text-5xl">
            A product-oriented company focused on industrial water-treatment supply and commercial clarity.
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-8 text-brand-muted">
            Vortexus Industrial Solutions is building a structured product environment for
            industrial water treatment, pumping, storage, chemicals, instrumentation, and
            control equipment. The goal is not retail e-commerce. The goal is to help
            buyers discover the right products faster, compare practical alternatives, and
            move into quotation with greater confidence.
          </p>
          <p className="mt-5 max-w-3xl text-base leading-8 text-brand-muted">
            Our direction is centered on strong product organization, technical relevance,
            industry fit, and RFQ-ready commercial flow. That means cleaner category
            structures, clearer product detail, related item visibility, and a more useful
            experience for procurement teams, engineers, contractors, and institutional buyers.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {companyPillars.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-[1.45rem] border border-brand-border bg-white px-5 py-5 shadow-[0_14px_34px_rgba(35,33,32,0.05)]"
              >
                <h3 className="font-display text-xl font-semibold text-brand-ink">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-brand-muted">{pillar.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-[2rem] shadow-[0_20px_60px_rgba(35,33,32,0.08)]">
            <img
              src="/images/products/pumps-fluid-handling/submersible-pump.webp"
              alt="Submersible pump product for industrial water applications"
              className="h-[22rem] w-full object-cover"
            />
          </div>

          <div className="rounded-[1.8rem] border border-brand-border bg-white px-6 py-6 shadow-[0_16px_38px_rgba(35,33,32,0.05)]">
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-brand-green">
              Product Focus
            </p>
            <div className="mt-5 space-y-3">
              {capabilityBands.map((item) => (
                <div key={item} className="border-b border-brand-border pb-3 last:border-b-0 last:pb-0">
                  <p className="text-sm leading-7 text-brand-muted">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-brand-green">
            Core Values
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold text-brand-ink sm:text-5xl">
            The values that guide how we work, communicate, and grow.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {coreValues.map((value) => (
            <article
              key={value.title}
              className={`rounded-[1.6rem] border-2 ${value.accent} bg-white px-5 py-5 shadow-[0_14px_34px_rgba(35,33,32,0.05)]`}
            >
              <h3 className="font-display text-2xl font-semibold text-brand-ink">
                {value.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-brand-muted">{value.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[0.98fr_1.02fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-brand-green">
            Commercial Direction
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold text-brand-ink sm:text-5xl">
            Built to support product discovery first, then technical review, then RFQ.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-brand-muted">
            The website is being shaped around product visibility instead of long
            corporate storytelling. Buyers should be able to find a product family,
            review similar items, understand the general application fit, and move
            into a quotation request without unnecessary friction.
          </p>
          <p className="mt-5 max-w-3xl text-base leading-8 text-brand-muted">
            That product-first model is especially important in industrial supply,
            where customers often know the component, process stage, membrane size,
            pressure class, or chemical function they are looking for. Our job is to
            organize those products clearly and make the buying path easier to follow.
          </p>
        </div>

        <div className="overflow-hidden rounded-[2rem] shadow-[0_20px_60px_rgba(35,33,32,0.08)]">
          <img
            src="/section-medical-water.jpg"
            alt="Industrial water treatment equipment and product systems"
            className="h-[28rem] w-full object-cover"
          />
        </div>
      </section>
    </div>
  )
}

export default AboutPage
