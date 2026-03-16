import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IconEye, IconFileHorizontal, IconPencil, IconTrash } from '@tabler/icons-react'
import { DeleteConfirmationDialog } from './delete-confirmation-dialog'
import { useState } from 'react'
import { useDeleteProduct, useGetAllVendorProducts, useToggleProduct, useUpdateProduct } from '@/api/vendor/vendor.queries'
import type { Product } from '@/api/vendor/vendor.types'

export function ProductsTable() {
    const { data: products = [] } = useGetAllVendorProducts()
    const { mutate: toggleProduct } = useToggleProduct()
    const { mutate: deleteProduct } = useDeleteProduct()
    const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct()

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [productToEdit, setProductToEdit] = useState<Product | null>(null)

    const openDeleteDialog = (id: string) => {
        setProductToDelete(id)
        setDeleteDialogOpen(true)
    }

    const openEditDialog = (product: Product) => {
        setProductToEdit(product)
        setEditDialogOpen(true)
    }

    const handleDeleteConfirm = () => {
        if (!productToDelete) return
        setIsDeleting(true)
        deleteProduct(productToDelete, {
            onSuccess: () => {
                setDeleteDialogOpen(false)
                setProductToDelete(null)
                setIsDeleting(false)
            },
            onError: () => setIsDeleting(false)
        })
    }

    const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!productToEdit) return
        const form = e.currentTarget
        const data = new FormData(form)

        updateProduct({
            id: productToEdit.id,
            payload: {
                name: data.get('name') as string,
                description: data.get('description') as string,
                price: Number(data.get('price')),
                quantity: Number(data.get('quantity')),
            }
        }, {
            onSuccess: () => {
                setEditDialogOpen(false)
                setProductToEdit(null)
            }
        })
    }

    const getProductName = () => {
        return products.find((p) => p.id === productToDelete)?.name || 'this product'
    }

    return (
        <Card className="col-span-1 lg:col-span-2 border-border">
            <CardHeader>
                <CardTitle>Recent Products</CardTitle>
                <CardDescription>Manage your product inventory and status</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="w-48">Product</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id} className="border-border hover:bg-secondary hover:bg-opacity-30">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.images[0]?.url}
                                                alt={product.name}
                                                className="w-10 h-10 rounded object-cover"
                                            />
                                            <p className="font-medium text-foreground text-sm">{product.name}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-semibold text-foreground">
                                            ${Number(product.price).toFixed(2)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">{product.quantity ?? 0}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={product.active}
                                                onCheckedChange={() => toggleProduct(product.id)}
                                                className="cursor-pointer"
                                            />
                                            <Badge
                                                className={`text-xs ${product.active
                                                    ? 'bg-green-900 text-green-100 hover:bg-green-900'
                                                    : 'bg-slate-700 text-slate-100 hover:bg-slate-700'
                                                    }`}
                                            >
                                                {product.active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <IconFileHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    <IconEye className="w-4 h-4 mr-2" />
                                                    View
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openEditDialog(product)}>
                                                    <IconPencil className="w-4 h-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => openDeleteDialog(product.id)}
                                                    className="text-destructive hover:bg-destructive hover:bg-opacity-10 focus:bg-destructive focus:bg-opacity-10 focus:text-destructive"
                                                >
                                                    <IconTrash className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            {/* Edit Modal */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                    </DialogHeader>
                    {productToEdit && (
                        <form onSubmit={handleEditSubmit} className="space-y-4 mt-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" defaultValue={productToEdit.name} required />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" defaultValue={productToEdit.description ?? ''} rows={3} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="price">Price</Label>
                                    <Input id="price" name="price" type="number" min="0" step="0.01" defaultValue={Number(productToEdit.price)} required />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <Input id="quantity" name="quantity" type="number" min="0" defaultValue={productToEdit.quantity ?? 0} />
                                </div>
                            </div>
                            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isUpdating}>
                                {isUpdating ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            <DeleteConfirmationDialog
                open={deleteDialogOpen}
                title="Delete Product"
                description={`Are you sure you want to delete "${getProductName()}"? This action cannot be undone.`}
                onConfirm={handleDeleteConfirm}
                onCancel={() => {
                    setDeleteDialogOpen(false)
                    setProductToDelete(null)
                }}
                isLoading={isDeleting}
            />
        </Card>
    )
}
