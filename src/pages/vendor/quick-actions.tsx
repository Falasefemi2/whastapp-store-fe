import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  IconArrowNarrowRight,
  IconPackage,
  IconPlus,
  IconUpload,
  IconX,
} from "@tabler/icons-react"
import { useState, useRef, useCallback } from "react"
import { useCreateProduct } from "@/api/vendor/vendor.queries"
import { useNavigate } from "@tanstack/react-router"

export function QuickActions() {
  const [open, setOpen] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mutate: createProduct, isPending } = useCreateProduct()
  const navigate = useNavigate()

  const addFiles = (files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"))
    setImages((prev) => [...prev, ...imageFiles])
    imageFiles.forEach((file) => {
      const url = URL.createObjectURL(file)
      setPreviews((prev) => [...prev, url])
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files))
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(Array.from(e.dataTransfer.files))
  }, [])

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    createProduct(
      {
        name: data.get("name") as string,
        description: data.get("description") as string,
        price: Number(data.get("price")),
        quantity: Number(data.get("quantity")),
        images,
      },
      {
        onSuccess: () => {
          setOpen(false)
          setImages([])
          setPreviews([])
          form.reset()
        },
      }
    )
  }

  return (
    <div className="rounded-2xl border border-black/6 bg-white px-6 py-5">
      <h3 className="mb-4 text-[14px] font-semibold text-[#1a1a1a]">
        Quick Actions
      </h3>
      <div className="flex flex-col gap-3">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-xl bg-[#2d4a3e] px-4 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#233b31]">
              <IconPlus className="h-4 w-4 shrink-0" />
              Add New Product
              <IconArrowNarrowRight className="ml-auto h-4 w-4 shrink-0" />
            </button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-2xl border border-[#d4d4d4]">
            <DialogHeader>
              <DialogTitle className="text-[16px] font-semibold text-[#1a1a1a]">
                Add New Product
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="mt-2 space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="qa-name"
                  className="text-[11px] font-semibold tracking-widest text-[#999] uppercase"
                >
                  Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="qa-name"
                  name="name"
                  placeholder="Product name"
                  required
                  className="rounded-xl border-[#d4d4d4] text-[14px]"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="qa-description"
                  className="text-[11px] font-semibold tracking-widest text-[#999] uppercase"
                >
                  Description
                </Label>
                <Textarea
                  id="qa-description"
                  name="description"
                  placeholder="Product description"
                  rows={3}
                  className="rounded-xl border-[#d4d4d4] text-[14px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="qa-price"
                    className="text-[11px] font-semibold tracking-widest text-[#999] uppercase"
                  >
                    Price <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="qa-price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                    className="rounded-xl border-[#d4d4d4] text-[14px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="qa-quantity"
                    className="text-[11px] font-semibold tracking-widest text-[#999] uppercase"
                  >
                    Quantity
                  </Label>
                  <Input
                    id="qa-quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    placeholder="0"
                    className="rounded-xl border-[#d4d4d4] text-[14px]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold tracking-widest text-[#999] uppercase">
                  Images <span className="text-red-400">*</span>
                </Label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragging(true)
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                    dragging
                      ? "border-[#2d4a3e] bg-[#f0f4f2]"
                      : "border-[#d4d4d4] hover:border-[#2d4a3e]/50 hover:bg-[#f8faf9]"
                  }`}
                >
                  <IconUpload className="mx-auto mb-2 h-5 w-5 text-[#999]" />
                  <p className="text-[13px] text-[#999]">
                    Drag & drop images here or{" "}
                    <span className="text-[#2d4a3e] underline">browse</span>
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                {previews.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {previews.map((src, i) => (
                      <div key={i} className="group relative">
                        <img
                          src={src}
                          alt=""
                          className="h-16 w-full rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <IconX className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex overflow-hidden rounded-xl">
                <button
                  type="submit"
                  disabled={isPending || images.length === 0}
                  className="flex-1 bg-[#2d4a3e] py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#233b31] disabled:opacity-50"
                >
                  {isPending ? "Creating..." : "Create Product"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <button
          onClick={() => navigate({ to: "/vendor/products" })}
          className="flex w-full items-center gap-3 rounded-xl border border-[#d4d4d4] bg-white px-4 py-3 text-[13px] font-medium text-[#1a1a1a] transition-colors hover:bg-[#f5f5f5]"
        >
          <IconPackage className="h-4 w-4 shrink-0 text-[#777]" />
          Manage Products
          <IconArrowNarrowRight className="ml-auto h-4 w-4 shrink-0 text-[#777]" />
        </button>
      </div>
    </div>
  )
}
