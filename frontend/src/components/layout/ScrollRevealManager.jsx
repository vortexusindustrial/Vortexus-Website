import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const TARGET_SELECTOR = [
  'main > section:not(:first-child)',
  'main section article',
  'main section form',
  'main section .scroll-reveal-card',
].join(', ')

function ScrollRevealManager() {
  const location = useLocation()

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      return undefined
    }

    const targets = [...document.querySelectorAll(TARGET_SELECTOR)].filter(
      (element) => !element.classList.contains('no-scroll-reveal'),
    )

    if (targets.length === 0) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.14,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    targets.forEach((target, index) => {
      target.classList.add('scroll-reveal')
      target.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 70}ms`)
      observer.observe(target)
    })

    return () => {
      targets.forEach((target) => {
        target.classList.remove('scroll-reveal', 'is-visible')
        target.style.removeProperty('--reveal-delay')
      })
      observer.disconnect()
    }
  }, [location.pathname])

  return null
}

export default ScrollRevealManager
