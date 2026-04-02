import { offices as officeLocations } from '../data/mock/offices'
import BlueAccentHero from '../components/sections/BlueAccentHero'
import Seo from '../components/seo/Seo'

function ContactPage() {
  const activeOffices = officeLocations.filter((office) => office.coordinates)

  return (
    <div className="text-brand-ink">
      <Seo
        title="Contact Us"
        description="Contact Vortexus for water treatment projects, borehole systems, pump solutions, solar water delivery, partnerships, and regional engineering support."
      />
      <BlueAccentHero
        eyebrow="Contact Vortexus"
        title="Contact Us"
        description="Speak with our team about projects, partnerships, regional support, and worldwide delivery."
      />

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold text-brand-ink sm:text-4xl">
            Questions?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-brand-muted">
            Tell us about your company, your need, and how you would like us to
            reach you. We kept the layout straightforward, with the form placed
            directly on the page rather than inside cards.
          </p>
        </div>

        <form className="mt-12 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-brand-ink">
                First Name
              </span>
              <input
                type="text"
                placeholder="First Name"
                className="h-12 w-full rounded-[10px] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/60 focus:border-[var(--color-accent-blue-highlight)]"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-brand-ink">
                Last Name
              </span>
              <input
                type="text"
                placeholder="Last Name"
                className="h-12 w-full rounded-[10px] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/60 focus:border-[var(--color-accent-blue-highlight)]"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-brand-ink">
              Email <span className="text-[var(--color-accent-blue-highlight)]">*</span>
            </span>
            <input
              type="email"
              placeholder="Email Address"
              className="h-12 w-full rounded-[10px] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/60 focus:border-[var(--color-accent-blue-highlight)]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-brand-ink">
              Phone Number <span className="text-[var(--color-accent-blue-highlight)]">*</span>
            </span>
            <input
              type="tel"
              placeholder="Enter Phone Number"
              className="h-12 w-full rounded-[10px] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/60 focus:border-[var(--color-accent-blue-highlight)]"
            />
          </label>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-brand-ink">
                Company Name
              </span>
              <input
                type="text"
                placeholder="e.g Waffle Group"
                className="h-12 w-full rounded-[10px] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/60 focus:border-[var(--color-accent-blue-highlight)]"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-brand-ink">
                Position
              </span>
              <input
                type="text"
                placeholder="e.g Customer Service"
                className="h-12 w-full rounded-[10px] border border-brand-border bg-white px-4 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/60 focus:border-[var(--color-accent-blue-highlight)]"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-brand-ink">
              Your Message <span className="text-[var(--color-accent-blue-highlight)]">*</span>
            </span>
            <textarea
              rows="6"
              placeholder="Your Message"
              className="w-full rounded-[10px] border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/60 focus:border-[var(--color-accent-blue-highlight)]"
            />
          </label>

          <div className="flex justify-center">
            <button
              type="submit"
              className="inline-flex items-center justify-center bg-[var(--color-accent-blue-highlight)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-blue-hover)]"
            >
              Contact Us
            </button>
          </div>
        </form>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold text-brand-ink sm:text-4xl">
            Our Operations
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-brand-muted">
            We are working worldwide, supporting regional teams and cross-border
            projects from East Africa, Southern Africa, the Indian Ocean, and
            remote delivery hubs. Our operations are designed to serve clients
            wherever they are.
          </p>
        </div>

        <div className="mt-14">
          <div className="overflow-hidden rounded-[2rem] border border-brand-border bg-white shadow-[0_24px_80px_rgba(35,33,32,0.08)]">
            <div className="grid gap-8 px-6 py-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-accent-blue-highlight)]">
                  Worldwide Delivery Network
                </p>
                <h3 className="mt-4 font-display text-3xl font-semibold text-brand-ink sm:text-4xl">
                  Regional teams with cross-border project support.
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-8 text-brand-muted">
                  We coordinate projects from East Africa, Southern Africa, the Indian Ocean,
                  and remote delivery hubs. That means clients get engineering support,
                  response coordination, and implementation visibility without depending on a
                  single physical office.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {activeOffices.map((office, index) => (
                    <div
                      key={office.country}
                      className="rounded-[1.4rem] border border-brand-border bg-brand-canvas/70 px-4 py-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-3 w-3 rounded-full bg-[var(--color-marker-solid)] ${index % 2 === 0 ? 'animate-pulse' : ''}`} />
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-ink">
                          {office.country}
                        </p>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-brand-muted">
                        {office.address}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.8rem] border border-brand-border bg-[linear-gradient(160deg,rgba(16,27,143,0.96),rgba(41,86,227,0.92),rgba(70,166,255,0.88))] p-6 text-white">
                <div className="grid gap-4 md:grid-cols-2">
                  {activeOffices.map((office, index) => (
                    <div
                      key={`${office.country}-hub`}
                      className="rounded-[1.35rem] border border-white/14 bg-white/8 px-4 py-4 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-2.5 w-2.5 rounded-full bg-white ${index % 2 === 0 ? 'animate-pulse' : ''}`} />
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/92">
                          {office.country}
                        </p>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-white/80">
                        {office.company}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[1.35rem] border border-white/14 bg-white/8 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/74">
                    Coverage
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/84">
                    Commercial, institutional, industrial, agricultural, community water,
                    and remote implementation support across regional and international projects.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-brand-border px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.4em] text-brand-muted/60 lg:px-10">
              Worldwide Delivery Network
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
          {officeLocations.map((office) => (
            <div key={office.country} className="border-t border-brand-border pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-accent-blue-highlight)]">
                {office.country}
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-brand-ink">
                {office.company}
              </h3>
              <p className="mt-4 text-sm leading-8 text-brand-muted">
                {office.address}
              </p>
              <p className="mt-2 text-sm leading-8 text-brand-muted">
                {office.phone}
              </p>
              <p className="mt-2 text-sm leading-8 text-brand-muted">
                {office.email}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ContactPage
