import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  IconDotsVertical,
  IconEye,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { useState } from "react"
import {
  useDeleteProduct,
  useGetAllVendorProducts,
  useToggleProduct,
  useUpdateProduct,
} from "@/api/vendor/vendor.queries"
import type { Product } from "@/api/vendor/vendor.types"
import { Link } from "@tanstack/react-router"
import { formatNaira } from "@/lib/utils"

interface ProductsTableProps {
  limit?: number
}

export function ProductsTable({ limit }: ProductsTableProps) {
  const { data: products = [] } = useGetAllVendorProducts()
  const displayedProducts = limit ? products.slice(0, limit) : products
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
      onError: () => setIsDeleting(false),
    })
  }

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!productToEdit) return
    const form = e.currentTarget
    const data = new FormData(form)

    updateProduct(
      {
        id: productToEdit.id,
        payload: {
          name: data.get("name") as string,
          description: data.get("description") as string,
          price: Number(data.get("price")),
          quantity: Number(data.get("quantity")),
        },
      },
      {
        onSuccess: () => {
          setEditDialogOpen(false)
          setProductToEdit(null)
        },
      }
    )
  }

  const getProductName = () => {
    return (
      products.find((p) => p.id === productToDelete)?.name || "this product"
    )
  }

  return (
    <div className="col-span-1 rounded-2xl border border-black/6 bg-white lg:col-span-2">
      <div className="border-b border-black/6 px-6 py-5">
        <h3 className="text-[14px] font-semibold text-[#1a1a1a]">
          Recent Products
        </h3>
        <p className="mt-0.5 text-[12px] text-[#999]">
          Manage your product inventory and status
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-black/6 hover:bg-transparent">
              <TableHead className="w-48 text-[11px] font-semibold tracking-wider text-[#999] uppercase">
                Product
              </TableHead>
              <TableHead className="text-[11px] font-semibold tracking-wider text-[#999] uppercase">
                Price
              </TableHead>
              <TableHead className="text-[11px] font-semibold tracking-wider text-[#999] uppercase">
                Quantity
              </TableHead>
              <TableHead className="text-[11px] font-semibold tracking-wider text-[#999] uppercase">
                Status
              </TableHead>
              <TableHead className="text-right text-[11px] font-semibold tracking-wider text-[#999] uppercase">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedProducts.map((product) => (
              <TableRow
                key={product.id}
                className="border-black/6 transition-colors hover:bg-[#f8f8f8]"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images[0]?.url}
                      alt={product.name}
                      className="h-9 w-9 rounded-lg bg-[#f3f3f3] object-cover"
                    />
                    <p className="text-[13px] font-medium text-[#1a1a1a]">
                      {product.name}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-[13px] font-semibold text-[#1a1a1a]">
                    {formatNaira(product.price)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-[13px] text-[#777]">
                    {product.quantity ?? 0}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={product.active}
                      onCheckedChange={() => toggleProduct(product.id)}
                      className="cursor-pointer"
                    />
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        product.active
                          ? "bg-[#e4ede9] text-[#2d4a3e]"
                          : "bg-[#f0f0f0] text-[#999]"
                      }`}
                    >
                      {product.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[#f0f0f0]">
                        <IconDotsVertical className="h-4 w-4 text-[#777]" />
                        <span className="sr-only">Open menu</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-xl border border-[#d4d4d4] bg-white shadow-sm"
                    >
                      <DropdownMenuLabel className="text-[11px] font-normal text-[#999]">
                        Actions
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-[#eee]" />
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer rounded-lg text-[13px]"
                      >
                        <Link
                          to="/vendor/products/$id"
                          params={{ id: product.id }}
                        >
                          <IconEye className="mr-2 h-4 w-4 text-[#777]" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openEditDialog(product)}
                        className="cursor-pointer rounded-lg text-[13px]"
                      >
                        <IconPencil className="mr-2 h-4 w-4 text-[#777]" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[#eee]" />
                      <DropdownMenuItem
                        onClick={() => openDeleteDialog(product.id)}
                        className="cursor-pointer rounded-lg text-[13px] text-red-500 focus:text-red-500"
                      >
                        <IconTrash className="mr-2 h-4 w-4" />
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

      {/* Edit Modal */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg rounded-2xl border border-[#d4d4d4]">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-semibold text-[#1a1a1a]">
              Edit Product
            </DialogTitle>
          </DialogHeader>
          {productToEdit && (
            <form onSubmit={handleEditSubmit} className="mt-2 space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="text-[12px] font-semibold tracking-wider text-[#999] uppercase"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={productToEdit.name}
                  required
                  className="rounded-xl border-[#d4d4d4] text-[14px]"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="description"
                  className="text-[12px] font-semibold tracking-wider text-[#999] uppercase"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={productToEdit.description ?? ""}
                  rows={3}
                  className="rounded-xl border-[#d4d4d4] text-[14px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="price"
                    className="text-[12px] font-semibold tracking-wider text-[#999] uppercase"
                  >
                    Price
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={Number(productToEdit.price)}
                    required
                    className="rounded-xl border-[#d4d4d4] text-[14px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="quantity"
                    className="text-[12px] font-semibold tracking-wider text-[#999] uppercase"
                  >
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    defaultValue={productToEdit.quantity ?? 0}
                    className="rounded-xl border-[#d4d4d4] text-[14px]"
                  />
                </div>
              </div>
              <div className="mt-2 flex overflow-hidden rounded-xl">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-[#2d4a3e] py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#233b31] disabled:opacity-70"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
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
    </div>
  )
}
