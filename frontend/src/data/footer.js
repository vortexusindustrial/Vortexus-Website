import { company } from './site/company'

export const footerGroups = [
  {
    title: 'Products',
    links: [
      { label: 'Pre-Treatment Systems', to: '/products/category/pre-treatment-systems' },
      { label: 'Filtration Systems', to: '/products/category/filtration-systems' },
      { label: 'RO Systems', to: '/products/category/reverse-osmosis-systems' },
      { label: 'Water Treatment Chemicals', to: '/products/category/water-treatment-chemicals' },
      { label: 'Pumps & Fluid Handling', to: '/products/category/pumps-fluid-handling' },
      { label: 'Monitoring & Instrumentation', to: '/products/category/monitoring-instrumentation' },
    ],
  },
  {
    title: 'Industries',
    links: [
      { label: 'Food & Beverage', to: '/industries/food-beverage' },
      { label: 'Pharmaceutical', to: '/industries/pharmaceutical' },
      { label: 'Textile', to: '/industries/textile' },
      { label: 'Mining', to: '/industries/mining' },
      { label: 'Power Plants', to: '/industries/power-plants' },
      { label: 'Agriculture & Irrigation', to: '/industries/agriculture-irrigation' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about-us' },
      { label: 'Blog', to: '/blog' },
      { label: 'Contact Us', to: '/contact-us' },
      { label: 'Request a Quote', to: '/contact-us' },
    ],
  },
]

export const footerHighlights = [
  {
    title: 'Product-First Catalog',
    text: 'Industrial water-treatment products, components, chemicals, pumps, controls, and instrumentation organized for faster discovery.',
  },
  {
    title: 'Industry Alignment',
    text: 'Category browsing is supported by industry views so buyers can move from application need to product shortlist quickly.',
  },
  {
    title: 'RFQ Ready',
    text: 'Every major product path is designed to move directly into a quotation request instead of a consumer-style cart flow.',
  },
]

export const socialLinks = [
  { label: 'Facebook', href: company.socialLinks.facebook, icon: 'facebook' },
  { label: 'Twitter', href: company.socialLinks.twitter, icon: 'twitter' },
  { label: 'Instagram', href: company.socialLinks.instagram, icon: 'instagram' },
  { label: 'LinkedIn', href: company.socialLinks.linkedin, icon: 'linkedin' },
  { label: 'WhatsApp', href: company.whatsapp, icon: 'whatsapp' },
]

export const contactItems = [
  { label: 'Nairobi, Kenya', icon: 'address' },
  { label: company.email, href: `mailto:${company.email}`, icon: 'email' },
  { label: company.phone, href: 'tel:+254700000000', icon: 'phone' },
  { label: company.tagline, icon: 'fax' },
]

export const footerMetaLinks = [
  { label: 'Products', to: '/products' },
  { label: 'Industries', to: '/industries' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact-us' },
]
