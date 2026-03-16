import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createProduct, getProductByID, updateProduct, deleteProduct, getAllVendorProduct, toggleProduct, dashboardStat, getVendorBySlug } from "./vendor.api"
import { toast } from "sonner"
import type { CreateProduct, UpdateProduct } from "./vendor.types"

export const useGetAllVendorProducts = () => {
    return useQuery({
        queryKey: ["vendorproducts"],
        queryFn: getAllVendorProduct
    })
}

export const useGetProductByID = (id: string) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductByID(id)
    })
}

export const useGetDashboardStat = () => {
    return useQuery({
        queryKey: ["dashboardstat"],
        queryFn: dashboardStat
    })
}

export const useCreateProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: CreateProduct) => createProduct(payload),
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries({ queryKey: ["vendorproducts"] })
        },
        onError: (err: any) => {
            toast.error(err?.message || "Failed to create product")
        }
    })
}

export const useUpdateProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string, payload: UpdateProduct }) => updateProduct(id, payload),
        onSuccess: (data) => {
            toast.success("Product updated successfully")
            queryClient.invalidateQueries({ queryKey: ["vendorproducts"] })
            queryClient.invalidateQueries({ queryKey: ["product", data.id] })
        },
        onError: (err: any) => {
            toast.error(err?.message || "Failed to update product")
        }
    })
}

export const useDeleteProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => deleteProduct(id),
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries({ queryKey: ["vendorproducts"] })
        },
        onError: (err: any) => {
            toast.error(err?.message || "Failed to delete product")
        }
    })
}

export const useToggleProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => toggleProduct(id),
        onSuccess: (data) => {
            toast.success(`Product ${data.active ? "activated" : "deactivated"} successfully`)
            queryClient.invalidateQueries({ queryKey: ["vendorproducts"] })
            queryClient.invalidateQueries({ queryKey: ["product", data.id] })
        },
        onError: (err: any) => {
            toast.error(err?.message || "Failed to toggle product")
        }
    })
}

export const useGetVendorBySlug = (slug: string) => {
    return useQuery({
        queryKey: ["vendor", slug],
        queryFn: () => getVendorBySlug(slug),
    })
}
