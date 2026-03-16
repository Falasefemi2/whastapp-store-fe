import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { approveVendor, fetchAllVendors, fetchApprovedVendors, fetchPendingVendors } from "./admin.api"
import { toast } from "sonner"

export const useGetAllVendors = () => {
    return useQuery({
        queryKey: ["allvendors"],
        queryFn: fetchAllVendors
    })
}

export const useGetPendingVendors = () => {
    return useQuery({
        queryKey: ["pendingvendors"],
        queryFn: fetchPendingVendors
    })
}

export const useGetApprovedVendors = () => {
    return useQuery({
        queryKey: ["approvedvendors"],
        queryFn: fetchApprovedVendors
    })
}

export const useApproveVendor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: approveVendor,
        onSuccess: (vendor) => {
            toast.success(`Vendor ${vendor.storeName} approved successfully!`);

            // Refresh the relevant queries
            queryClient.invalidateQueries({ queryKey: ["allvendors"] });
            queryClient.invalidateQueries({ queryKey: ["pendingvendors"] });
            queryClient.invalidateQueries({ queryKey: ["approvedvendors"] });
        },
        onError: (err: any) => {
            toast.error(err?.message || "Failed to approve vendor");
        },
    });
};
