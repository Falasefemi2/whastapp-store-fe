export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    storeName: string;
    phone: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface Vendor {
    id: string;
    userId: string;
    storeName: string;
    phone: string;
    logoUrl: string | null;
    slug: string;
    approved: boolean;
    approvedAt: string;
    createdAt: string;
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    // passwordHash: string;
    role: "admin" | "vendor";
    createdAt: string;
    updatedAt: string;
    vendor: Vendor;
}

export interface MeSuccessResponse {
    user: AuthUser;
}

export interface LoginSuccessResponse {
    message: string;
    user: AuthUser;
}

export interface RegisterSuccessResponse {
    message: string;
}

export interface AuthErrorResponse {
    message: string;
}

export interface ValidationErrorResponse {
    success: false;
    error: {
        name: string;
        message: string;
    };
}
