'use client'

import { useEffect, useState } from 'react'

interface HydrationSafeProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function HydrationSafe({ children, fallback }: HydrationSafeProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Clean up any browser extension attributes that cause hydration issues
    const cleanupExtensionAttributes = () => {
      const elements = document.querySelectorAll('[bis_skin_checked]')
      elements.forEach(el => {
        el.removeAttribute('bis_skin_checked')
      })
    }

    // Run cleanup after hydration
    cleanupExtensionAttributes()
    setIsHydrated(true)

    // Set up observer to clean up dynamically added attributes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
          const target = mutation.target as Element
          target.removeAttribute('bis_skin_checked')
        }
      })
    })

    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['bis_skin_checked']
    })

    return () => observer.disconnect()
  }, [])

  if (!isHydrated) {
    return fallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}