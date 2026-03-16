import { createFileRoute } from '@tanstack/react-router'
import { useGetVendorBySlug } from '@/api/vendor/vendor.queries'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { IconPackage, IconPhone, IconChevronLeft, IconChevronRight, IconShoppingCart, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import type { Product } from '@/api/vendor/vendor.types'
import { formatNaira } from '@/lib/utils'

export const Route = createFileRoute('/store/$slug')({
    component: RouteComponent,
})

interface CartItem {
    product: Product
    quantity: number
}

function RouteComponent() {
    const { slug } = Route.useParams()
    const { data: vendor, isLoading, error } = useGetVendorBySlug(slug)

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [cart, setCart] = useState<CartItem[]>([])
    const [showCart, setShowCart] = useState(false)

    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.product.id === product.id)
            if (existingItem) {
                return prevCart.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...prevCart, { product, quantity: 1 }]
        })
    }

    const removeFromCart = (productId: string) => {
        setCart(prevCart => prevCart.filter(item => item.product.id !== productId))
    }

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId)
        } else {
            setCart(prevCart =>
                prevCart.map(item =>
                    item.product.id === productId ? { ...item, quantity } : item
                )
            )
        }
    }

    const handleCheckout = () => {
        if (!vendor || cart.length === 0) return

        const cartMessage = cart
            .map(item => `${item.product.name} x${item.quantity} - ${formatNaira(Number(item.product.price) * item.quantity)}`)
            .join('%0A')

        const total = cart.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)

        const message = `Hello! I'm interested in the following products:%0A%0A${cartMessage}%0A%0ATotal: ${formatNaira(total)}`

        const whatsappUrl = `https://wa.me/${vendor.phone.replace(/\D/g, '')}?text=${message}`
        window.open(whatsappUrl, '_blank')
    }

    const openProduct = (product: Product) => {
        setSelectedProduct(product)
        setCurrentImageIndex(0)
    }

    const prevImage = () => {
        if (!selectedProduct) return
        setCurrentImageIndex(i => (i === 0 ? selectedProduct.images.length - 1 : i - 1))
    }

    const nextImage = () => {
        if (!selectedProduct) return
        setCurrentImageIndex(i => (i === selectedProduct.images.length - 1 ? 0 : i + 1))
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-muted-foreground">Loading store...</p>
            </div>
        )
    }

    if (error || !vendor) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-destructive">Store not found</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Store Header */}
            <div className="border-b border-border bg-card">
                <div className="max-w-6xl mx-auto px-6 py-10 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        {vendor.logoUrl ? (
                            <img
                                src={vendor.logoUrl}
                                alt={vendor.storeName}
                                className="w-20 h-20 rounded-full object-cover border border-border"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold text-foreground">
                                {vendor.storeName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">{vendor.storeName}</h1>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <IconPhone className="w-4 h-4" />
                                    {vendor.phone}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <IconPackage className="w-4 h-4" />
                                    {vendor.products.length} Products
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCart(true)}
                        className="relative p-3 hover:bg-secondary rounded-lg transition-colors"
                    >
                        <IconShoppingCart className="w-6 h-6" />
                        {cart.length > 0 && (
                            <span className="absolute top-1 right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {cart.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-6xl mx-auto px-6 py-10">
                <h2 className="text-xl font-semibold text-foreground mb-6">Products</h2>

                {vendor.products.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        No products available yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {vendor.products.filter(p => p.active).map((product) => (
                            <Card
                                key={product.id}
                                className="border-border hover:shadow-md transition-shadow group flex flex-col"
                            >
                                <div
                                    className="aspect-square overflow-hidden rounded-t-lg bg-secondary cursor-pointer group-hover:scale-105 transition-transform duration-300"
                                    onClick={() => openProduct(product)}
                                >
                                    {product.images.length > 0 ? (
                                        <img
                                            src={product.images[0].url}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            <IconPackage className="w-12 h-12" />
                                        </div>
                                    )}
                                    {product.images.length > 1 && (
                                        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                                            +{product.images.length - 1}
                                        </div>
                                    )}
                                </div>
                                <CardContent className="pt-4 flex-1 flex flex-col">
                                    <h3 className="font-semibold text-foreground text-sm truncate">{product.name}</h3>
                                    {product.description && (
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                                    )}
                                    <div className="flex items-center justify-between mt-3 mb-3">
                                        <span className="text-lg font-bold text-accent">
                                            {formatNaira(product.price)}
                                        </span>
                                        <Badge className="text-xs bg-secondary text-muted-foreground">
                                            Qty: {product.quantity ?? 0}
                                        </Badge>
                                    </div>
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            addToCart(product)
                                        }}
                                        className="w-full mt-auto"
                                        size="sm"
                                    >
                                        Add to Cart
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Modal */}
            <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
                <DialogContent className="max-w-2xl p-0 overflow-hidden">
                    {selectedProduct && (
                        <div className="flex flex-col">
                            {/* Image Carousel */}
                            <div className="relative aspect-video bg-secondary">
                                <img
                                    src={selectedProduct.images[currentImageIndex]?.url}
                                    alt={selectedProduct.name}
                                    className="w-full h-full object-cover"
                                />

                                {selectedProduct.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                                        >
                                            <IconChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                                        >
                                            <IconChevronRight className="w-5 h-5" />
                                        </button>

                                        {/* Dots */}
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                            {selectedProduct.images.map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentImageIndex(i)}
                                                    className={`w-2 h-2 rounded-full transition-colors ${i === currentImageIndex ? 'bg-white' : 'bg-white/40'}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {selectedProduct.images.length > 1 && (
                                <div className="flex gap-2 px-4 pt-3 overflow-x-auto">
                                    {selectedProduct.images.map((image, i) => (
                                        <img
                                            key={image.id}
                                            src={image.url}
                                            alt={`${selectedProduct.name} ${i + 1}`}
                                            onClick={() => setCurrentImageIndex(i)}
                                            className={`w-14 h-14 object-cover rounded cursor-pointer shrink-0 border-2 transition-colors ${i === currentImageIndex ? 'border-accent' : 'border-transparent'}`}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Product Info */}
                            <div className="p-6 space-y-3">
                                <h2 className="text-xl font-bold text-foreground">{selectedProduct.name}</h2>
                                {selectedProduct.description && (
                                    <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                                )}
                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-2xl font-bold text-accent">
                                        {formatNaira(selectedProduct.price)}
                                    </span>
                                    <Badge className="bg-secondary text-muted-foreground">
                                        {selectedProduct.quantity ?? 0} in stock
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Cart Sheet */}
            <Sheet open={showCart} onOpenChange={setShowCart}>
                <SheetContent className="flex flex-col w-full sm:max-w-md">
                    <SheetHeader>
                        <SheetTitle>Shopping Cart</SheetTitle>
                    </SheetHeader>

                    {cart.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            Your cart is empty
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto space-y-4 py-4">
                                {cart.map(item => (
                                    <div key={item.product.id} className="flex gap-4 pb-4 border-b border-border">
                                        <div className="w-20 h-20 rounded overflow-hidden bg-secondary shrink-0">
                                            {item.product.images.length > 0 ? (
                                                <img
                                                    src={item.product.images[0].url}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                    <IconPackage className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-sm text-foreground">{item.product.name}</h3>
                                            <p className="text-sm text-accent font-bold mt-1">
                                                {formatNaira(item.product.price)}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    className="px-2 py-1 rounded border border-border hover:bg-secondary text-sm"
                                                >
                                                    −
                                                </button>
                                                <span className="px-3 py-1 text-sm font-semibold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    className="px-2 py-1 rounded border border-border hover:bg-secondary text-sm"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() => removeFromCart(item.product.id)}
                                                    className="ml-auto p-1 hover:bg-destructive/10 rounded transition-colors"
                                                >
                                                    <IconX className="w-4 h-4 text-destructive" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-border pt-4 space-y-3">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total:</span>
                                    <span className="text-accent">
                                        {formatNaira(cart.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0))}
                                    </span>
                                </div>
                                <Button
                                    onClick={handleCheckout}
                                    className="w-full"
                                    size="lg"
                                >
                                    Checkout via WhatsApp
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
