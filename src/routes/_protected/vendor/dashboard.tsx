import { Header } from '@/pages/vendor/header'
import { ProductsTable } from '@/pages/vendor/product-table'
import { QuickActions } from '@/pages/vendor/quick-actions'
import { SidebarNav } from '@/pages/vendor/sidebar-nav'
import { StatsCards } from '@/pages/vendor/stats-cards'
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
    return (
        <div className="min-h-screen bg-background">
            <SidebarNav />
            <Header />

            {/* Main Content Area */}
            <main className="ml-64 mt-16 p-8 lg:p-12">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Welcome Section */}
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground mt-2">
                            Welcome back! Here's your store performance at a glance.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <StatsCards />

                    {/* Products Table & Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <ProductsTable />
                        <QuickActions />
                    </div>
                </div>
            </main>

        </div>
    )
}
