export interface CreateProduct {
    name: string
    description: string
    price: number
    quantity: number
    images: File[]
}

export interface UpdateProduct {
    name?: string
    description?: string
    price?: number
    quantity?: number
}

export interface Product {
    id: string
    name: string
    description: string | null
    price: string
    quantity: number | null
    active: boolean
    vendorId: string
    createdAt: string
    images: { id: string; url: string }[]
}

export interface DashboardStat {
    totalProducts: number;
    activeProducts: number;
    totalVisits: number;
    recentVisits: number;
}

export interface PublicVendor {
    id: string
    storeName: string
    phone: string
    logoUrl: string | null
    slug: string
    approved: boolean
    approvedAt: string
    createdAt: string
    products: Product[]
}
