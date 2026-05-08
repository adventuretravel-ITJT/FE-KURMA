'use client'

import { useEffect } from 'react'
import ErrorPage from '@/components/error/ErrorPage'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <ErrorPage
      code="500"
      title="Something went wrong."
      description="An unexpected error occurred on our end. You can try again or head back home while we look into it."
      primaryAction={{ label: 'Try again', onClick: reset }}
      secondaryAction={{ label: 'Back to Home', href: '/' }}
    />
  )
}

