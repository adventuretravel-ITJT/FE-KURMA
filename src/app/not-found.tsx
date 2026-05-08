import ErrorPage from '@/components/error/ErrorPage'

export default function NotFound() {
  return (
    <ErrorPage
      code="404"
      title="Page not found."
      description="The page you're looking for doesn't exist or may have been moved. Check the URL or head back to explore."
      primaryAction={{ label: 'Back to Home', href: '/' }}
      secondaryAction={{ label: 'Go to Dashboard', href: '/dashboard' }}
    />
  )
}

