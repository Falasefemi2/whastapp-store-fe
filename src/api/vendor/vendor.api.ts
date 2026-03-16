import apiClient from "../client";
import type { Product, CreateProduct, UpdateProduct, DashboardStat, PublicVendor } from "./vendor.types";

export const createProduct = async (payload: CreateProduct) => {
    const formData = new FormData()

    formData.append("name", payload.name)
    formData.append("description", payload.description)
    formData.append("price", payload.price.toString())
    formData.append("quantity", payload.quantity.toString())

    payload.images.forEach((image) => {
        formData.append("images", image)
    })

    const response = await apiClient.post<{ message: string }>("/products", formData)
    return response.data;
}

export const getProductByID = async (id: string) => {
    const response = await apiClient.get<Product>(`/products/${id}`)
    return response.data;
}

export const updateProduct = async (id: string, payload: UpdateProduct) => {
    const response = await apiClient.patch<Product>(`/products/${id}`, payload)
    return response.data;
}

export const deleteProduct = async (id: string) => {
    const response = await apiClient.delete<{ message: string }>(`/products/${id}`)
    return response.data;
}

export const getAllVendorProduct = async () => {
    const response = await apiClient.get<Product[]>("/products")
    return response.data;
}

export const toggleProduct = async (id: string) => {
    const response = await apiClient.patch<{ id: string, active: boolean }>(`/products/${id}/toggle`)
    return response.data;
}

export const dashboardStat = async () => {
    const response = await apiClient.get<DashboardStat>("/dashboard/stats")
    return response.data;
}

export const getVendorBySlug = async (slug: string) => {
    const response = await apiClient.get<PublicVendor>(`/vendors/stores/${slug}`)
    return response.data;
}
