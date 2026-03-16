export interface Vendors {
    id: string
    userId: string
    storeName: string
    phone: string
    logoUrl: string | null
    slug: string
    approved: boolean
    approvedAt: string | null
    createdAt: string
    user: User
}

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export type ApproveVendorResponse = {
    message: string
    vendor: Vendors
}
