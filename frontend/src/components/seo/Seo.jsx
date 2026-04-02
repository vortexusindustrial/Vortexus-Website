import { useEffect } from 'react'

const SITE_NAME = 'Vortexus'
const DEFAULT_DESCRIPTION =
  'Vortexus delivers water treatment, borehole systems, pumping, solar-powered water infrastructure, and project support for commercial, industrial, institutional, and community applications.'

function upsertMeta(attr, key, content) {
  if (!content) {
    return
  }

  let element = document.head.querySelector(`meta[${attr}="${key}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attr, key)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

function Seo({ title, description = DEFAULT_DESCRIPTION }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME

    document.title = fullTitle
    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)
  }, [title, description])

  return null
}

export default Seo
