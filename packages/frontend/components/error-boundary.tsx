'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Check if it's a hydration error
    if (error.message.includes('hydration') || error.message.includes('bis_skin_checked')) {
      // Don't show error UI for hydration issues caused by browser extensions
      return { hasError: false }
    }
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log non-hydration errors
    if (!error.message.includes('hydration') && !error.message.includes('bis_skin_checked')) {
      console.error('Error caught by boundary:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-center">
          <h2 className="text-lg font-semibold text-destructive">Something went wrong</h2>
          <p className="text-muted-foreground">Please refresh the page to try again.</p>
        </div>
      )
    }

    return this.props.children
  }
}