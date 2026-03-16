import { createFileRoute, redirect } from '@tanstack/react-router'
import { Header } from '@/pages/vendor/header'
import { SidebarNav } from '@/pages/vendor/sidebar-nav'
import { useGetProductByID } from '@/api/vendor/vendor.queries'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconArrowLeft } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/vendor/products/$id')({
    beforeLoad: ({ context }) => {
        if (context.user?.role !== 'vendor') {
            throw redirect({ to: '/login' })
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { id } = Route.useParams()
    const { data: product, isLoading, error } = useGetProductByID(id)

    return (
        <div className="min-h-screen bg-background">
            <SidebarNav />
            <Header />

            {/* Main Content Area */}
            <main className="ml-64 mt-16 p-8 lg:p-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Back Button */}
                    <Link
                        to="/vendor/products"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <IconArrowLeft className="w-4 h-4" />
                        Back to Products
                    </Link>

                    {isLoading && (
                        <Card className="border-border">
                            <CardHeader>
                                <CardTitle>Loading...</CardTitle>
                            </CardHeader>
                        </Card>
                    )}

                    {error && (
                        <Card className="border-destructive bg-destructive/10">
                            <CardHeader>
                                <CardTitle className="text-destructive">Error</CardTitle>
                                <CardDescription className="text-destructive/80">
                                    Failed to load product details
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    )}

                    {product && (
                        <>
                            {/* Product Header */}
                            <div>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-foreground tracking-tight">{product.name}</h1>
                                        <Badge
                                            className={`mt-4 text-xs ${product.active
                                                ? 'bg-green-900 text-green-100 hover:bg-green-900'
                                                : 'bg-slate-700 text-slate-100 hover:bg-slate-700'
                                                }`}
                                        >
                                            {product.active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Product Images */}
                            {product.images && product.images.length > 0 && (
                                <Card className="border-border">
                                    <CardHeader>
                                        <CardTitle>Product Images</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {product.images.map((image) => (
                                                <div key={image.id} className="aspect-square rounded-lg overflow-hidden bg-secondary">
                                                    <img
                                                        src={image.url}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Product Details */}
                            <Card className="border-border">
                                <CardHeader>
                                    <CardTitle>Product Details</CardTitle>
                                    <CardDescription>Basic information about this product</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Description */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-foreground mb-2">Description</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {product.description || 'No description provided'}
                                        </p>
                                    </div>

                                    {/* Price and Quantity */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-sm font-semibold text-foreground mb-2">Price</h3>
                                            <p className="text-2xl font-bold text-accent">${Number(product.price).toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-foreground mb-2">Stock Quantity</h3>
                                            <p className="text-2xl font-bold text-foreground">{product.quantity ?? 0}</p>
                                        </div>
                                    </div>

                                    {/* Created Date */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-foreground mb-2">Created</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(product.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <Link
                                    to="/vendor/products"
                                    className="inline-block"
                                >
                                    <Button variant="outline">Back to Products</Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
