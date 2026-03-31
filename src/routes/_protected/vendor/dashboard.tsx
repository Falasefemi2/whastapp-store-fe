import { Header } from "@/pages/vendor/header"
import { ProductsTable } from "@/pages/vendor/product-table"
import { QuickActions } from "@/pages/vendor/quick-actions"
import { SidebarNav } from "@/pages/vendor/sidebar-nav"
import { StatsCards } from "@/pages/vendor/stats-cards"
import { StoreLinkCard } from "@/pages/vendor/store-link-card"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/vendor/dashboard")({
  beforeLoad: ({ context }) => {
    if (context.user?.role !== "vendor") {
      throw redirect({ to: "/login" })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useRouteContext()

  return (
    <div className="min-h-screen bg-[#e8e8e8]">
      <SidebarNav />
      <Header />
      <main className="mt-16 ml-64 p-8 lg:p-12">
        <div className="mx-auto max-w-7xl space-y-8">
          <div>
            <h1 className="text-[1.75rem] font-semibold tracking-tight text-[#1a1a1a]">
              Dashboard
            </h1>
            <p className="mt-1 text-[14px] text-[#777]">
              Welcome back! Here&apos;s your store performance at a glance.
            </p>
          </div>
          <StoreLinkCard slug={user?.vendor?.slug ?? ""} />
          <StatsCards />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <ProductsTable limit={3} />
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  )
}
