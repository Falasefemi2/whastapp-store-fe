import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/vendor/dashboard')({
  beforeLoad: ({ context }) => {
    if (context.user?.role !== 'vendor') {
      throw redirect({ to: '/login' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/vendor/dashboard"!</div>
}
