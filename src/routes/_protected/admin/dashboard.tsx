import { createFileRoute, redirect } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AllVendorsPage from '@/pages/admin/all-vendors'
import { useApproveVendor, useGetAllVendors, useGetApprovedVendors, useGetPendingVendors } from '@/api/admin/admin.queires'
import PendingVendorsPage from '@/pages/admin/pending-vendors'
import ApprovedVendorsPage from '@/pages/admin/approved-vendors'

export const Route = createFileRoute('/_protected/admin/dashboard')({
    beforeLoad: ({ context }) => {
        if (context.user?.role !== 'admin') {
            throw redirect({ to: '/login' })
        }
    },
    component: RouteComponent,
})

function RouteComponent() {

    const { data: vendors } = useGetAllVendors()
    const { data: pendingVendors } = useGetPendingVendors();
    const { data: approvedVendors } = useGetApprovedVendors();
    const approveMutation = useApproveVendor();
    const handleApprove = async (vendorId: string) => {
        await approveMutation.mutateAsync(vendorId)
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

                <Tabs defaultValue="all-vendors" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all-vendors">All Vendors</TabsTrigger>
                        <TabsTrigger value="pending">Pending Vendor</TabsTrigger>
                        <TabsTrigger value="approved">Approved Vendor</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all-vendors" className="mt-8">
                        <div className="rounded-lg border bg-card p-6">
                            <h2 className="text-xl font-semibold mb-4">All Vendors</h2>
                            <div className="text-muted-foreground">
                                <AllVendorsPage vendors={vendors || []} />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="pending" className="mt-8">
                        <div className="rounded-lg border bg-card p-6">
                            <h2 className="text-xl font-semibold mb-4">Pending Vendors</h2>
                            <div className="text-muted-foreground">
                                <PendingVendorsPage
                                    vendors={pendingVendors || []}
                                    onApprove={handleApprove}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="approved" className="mt-8">
                        <div className="rounded-lg border bg-card p-6">
                            <h2 className="text-xl font-semibold mb-4">Approved Vendors</h2>
                            <div className="text-muted-foreground">
                                <ApprovedVendorsPage vendors={approvedVendors || []} />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
