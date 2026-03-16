import { createFileRoute, redirect } from '@tanstack/react-router'
import { Header } from '@/pages/vendor/header'
import { ProductsTable } from '@/pages/vendor/product-table'
import { SidebarNav } from '@/pages/vendor/sidebar-nav'

export const Route = createFileRoute('/_protected/vendor/products/')({
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
                    {/* Header Section */}
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Products</h1>
                        <p className="text-muted-foreground mt-2">
                            Manage your store products and inventory.
                        </p>
                    </div>

                    {/* Products Table */}
                    <ProductsTable />
                </div>
            </main>
        </div>
    )
}
