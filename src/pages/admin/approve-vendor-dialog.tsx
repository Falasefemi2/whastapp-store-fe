import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Vendors } from '@/api/admin/admin.types'

interface ApproveVendorDialogProps {
    vendor: Vendors | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onApprove: (vendorId: string) => Promise<void>
}

export function ApproveVendorDialog({
    vendor,
    open,
    onOpenChange,
    onApprove,
}: ApproveVendorDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    if (!vendor) return null

    const handleApprove = async () => {
        setIsLoading(true)
        try {
            await onApprove(vendor.id)
            onOpenChange(false)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Approve Vendor</DialogTitle>
                    <DialogDescription>
                        Review vendor information before approval
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Store Information */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-muted-foreground">
                            Store Information
                        </h3>
                        <div className="bg-muted p-4 rounded-lg space-y-2">
                            <div>
                                <p className="text-xs text-muted-foreground">Store Name</p>
                                <p className="font-medium">{vendor.storeName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Store Slug</p>
                                <p className="font-medium text-sm">{vendor.slug}</p>
                            </div>
                        </div>
                    </div>

                    {/* Owner Information */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-muted-foreground">
                            Owner Information
                        </h3>
                        <div className="bg-muted p-4 rounded-lg space-y-2">
                            <div>
                                <p className="text-xs text-muted-foreground">Full Name</p>
                                <p className="font-medium">{vendor.user.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Email</p>
                                <p className="font-medium text-sm">{vendor.user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-muted-foreground">
                            Contact Information
                        </h3>
                        <div className="bg-muted p-4 rounded-lg space-y-2">
                            <div>
                                <p className="text-xs text-muted-foreground">Phone</p>
                                <p className="font-medium">{vendor.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Status Information */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-muted-foreground">
                            Status
                        </h3>
                        <div className="bg-muted p-4 rounded-lg space-y-2">
                            <div>
                                <p className="text-xs text-muted-foreground">Current Status</p>
                                <Badge variant={vendor.approved ? 'default' : 'secondary'}>
                                    {vendor.approved ? 'Approved' : 'Pending'}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Created Date</p>
                                <p className="font-medium text-sm">
                                    {new Date(vendor.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleApprove}
                        disabled={isLoading || vendor.approved}
                        className={vendor.approved ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                        {isLoading ? 'Approving...' : 'Approve Vendor'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
