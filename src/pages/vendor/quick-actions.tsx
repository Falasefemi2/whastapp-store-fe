import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { IconArrowNarrowRight, IconPackage, IconPlus, IconUpload, IconX } from '@tabler/icons-react'
import { useState, useRef, useCallback } from 'react'
import { useCreateProduct } from '@/api/vendor/vendor.queries'
import { useNavigate } from '@tanstack/react-router'

export function QuickActions() {
    const [open, setOpen] = useState(false)
    const [images, setImages] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [dragging, setDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { mutate: createProduct, isPending } = useCreateProduct()
    const navigate = useNavigate()

    const addFiles = (files: File[]) => {
        const imageFiles = files.filter(f => f.type.startsWith('image/'))
        setImages(prev => [...prev, ...imageFiles])
        imageFiles.forEach(file => {
            const url = URL.createObjectURL(file)
            setPreviews(prev => [...prev, url])
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
        setImages(prev => prev.filter((_, i) => i !== index))
        setPreviews(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        const data = new FormData(form)

        createProduct({
            name: data.get('name') as string,
            description: data.get('description') as string,
            price: Number(data.get('price')),
            quantity: Number(data.get('quantity')),
            images,
        }, {
            onSuccess: () => {
                setOpen(false)
                setImages([])
                setPreviews([])
                form.reset()
            }
        })
    }

    return (
        <Card className="border-border">
            <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="flex flex-col gap-3">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                                <IconPlus className="w-4 h-4" />
                                Add New Product
                                <IconArrowNarrowRight className="w-4 h-4 ml-auto" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Add New Product</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                                <div className="space-y-1">
                                    <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                                    <Input id="name" name="name" placeholder="Product name" required />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" placeholder="Product description" rows={3} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="price">Price <span className="text-destructive">*</span></Label>
                                        <Input id="price" name="price" type="number" min="0" step="0.01" placeholder="0.00" required />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="quantity">Quantity</Label>
                                        <Input id="quantity" name="quantity" type="number" min="0" placeholder="0" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Images <span className="text-destructive">*</span></Label>
                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                                        onDragLeave={() => setDragging(false)}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragging ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'}`}
                                    >
                                        <IconUpload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">Drag & drop images here or <span className="text-accent underline">browse</span></p>
                                        <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                                    </div>
                                    {previews.length > 0 && (
                                        <div className="grid grid-cols-4 gap-2 mt-2">
                                            {previews.map((src, i) => (
                                                <div key={i} className="relative group">
                                                    <img src={src} className="w-full h-16 object-cover rounded-md" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(i)}
                                                        className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <IconX className="w-3 h-3 text-white" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isPending || images.length === 0}>
                                    {isPending ? 'Creating...' : 'Create Product'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Button
                        onClick={() => navigate({ to: '/vendor/products' })}
                        variant="outline"
                        size="lg"
                        className="flex items-center gap-2 border-border text-foreground hover:bg-secondary"
                    >
                        <IconPackage className="w-4 h-4" />
                        Manage Products
                        <IconArrowNarrowRight className="w-4 h-4 ml-auto" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
