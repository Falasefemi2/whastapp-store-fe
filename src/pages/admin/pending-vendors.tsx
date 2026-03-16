import type { Vendors } from "@/api/admin/admin.types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useState } from "react";
import { ApproveVendorDialog } from "./approve-vendor-dialog";
import { Button } from "@/components/ui/button";


interface PendingVendorsTableProps {
    vendors: Vendors[]
    isLoading?: boolean
    onApprove?: (vendorId: string) => Promise<void>
}

export default function PendingVendorsPage({ vendors, isLoading, onApprove }: PendingVendorsTableProps) {

    const [selectedVendor, setSelectedVendor] = useState<Vendors | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)


    const pendingVendors = vendors.filter((v) => !v.approved)

    const handleApproveClick = (vendor: Vendors) => {
        setSelectedVendor(vendor)
        setDialogOpen(true)
    }

    const handleApprove = async (vendorId: string) => {
        if (onApprove) {
            await onApprove(vendorId) // calls the mutation passed from parent
        }
        setDialogOpen(false) // close dialog after approval
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">Loading vendors...</p>
            </div>
        )
    }

    if (!pendingVendors || pendingVendors.length === 0) {
        return (
            <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">No pending vendors</p>
            </div>
        )
    }
    return (
        <>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Store Name</TableHead>
                            <TableHead>Owner Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pendingVendors.map((vendor) => (
                            <TableRow key={vendor.id}>
                                <TableCell className="font-medium">{vendor.storeName}</TableCell>
                                <TableCell>{vendor.user.name}</TableCell>
                                <TableCell className="text-sm">{vendor.user.email}</TableCell>
                                <TableCell>{vendor.phone}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">Pending</Badge>
                                </TableCell>
                                <TableCell className="text-sm">
                                    {new Date(vendor.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="sm"
                                        onClick={() => handleApproveClick(vendor)}
                                    >
                                        Approve
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <ApproveVendorDialog
                vendor={selectedVendor}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onApprove={handleApprove}
            />
        </>
    )
}
