import apiClient from "../client"
import type { ApproveVendorResponse, Vendors } from "./admin.types"

export const fetchAllVendors = async (): Promise<Vendors[]> => {
    const { data } = await apiClient.get<Vendors[]>("/vendors/admin/vendors")
    return data
}

export const fetchPendingVendors = async (): Promise<Vendors[]> => {
    const { data } = await apiClient.get<Vendors[]>("vendors/admin/vendors/pending")
    return data;
}

export const fetchApprovedVendors = async (): Promise<Vendors[]> => {
    const { data } = await apiClient.get<Vendors[]>("vendors/admin/vendors/approved")
    return data;
}

export const approveVendor = async (id: string): Promise<Vendors> => {
    const { data } = await apiClient.patch<ApproveVendorResponse>(
        `/vendors/admin/vendors/${id}/approve`
    )

    return data.vendor
}
