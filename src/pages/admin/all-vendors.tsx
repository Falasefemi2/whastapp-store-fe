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


interface AllVendorsTableProps {
    vendors: Vendors[]
    isLoading?: boolean
}

export default function AllVendorsPage({ vendors, isLoading }: AllVendorsTableProps) {

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">Loading vendors...</p>
            </div>
        )
    }

    if (!vendors || vendors.length === 0) {
        return (
            <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">No vendors found</p>
            </div>
        )
    }
    return (
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
                        <TableHead>Approved At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vendors.map((vendor) => (
                        <TableRow key={vendor.id}>
                            <TableCell className="font-medium">{vendor.storeName}</TableCell>
                            <TableCell>{vendor.user.name}</TableCell>
                            <TableCell className="text-sm">{vendor.user.email}</TableCell>
                            <TableCell>{vendor.phone}</TableCell>
                            <TableCell>
                                <Badge variant={vendor.approved ? 'default' : 'secondary'}>
                                    {vendor.approved ? 'Approved' : 'Pending'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                                {new Date(vendor.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-sm">
                                {vendor.approvedAt
                                    ? new Date(vendor.approvedAt).toLocaleDateString()
                                    : '-'}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
