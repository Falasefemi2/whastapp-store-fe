import { useState } from 'react'
import { IconCopy, IconCheck } from '@tabler/icons-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function StoreLinkCard({ slug }: { slug: string }) {
    const [copied, setCopied] = useState(false)
    const storeUrl = `${window.location.origin}/store/${slug}`

    const handleCopy = () => {
        navigator.clipboard.writeText(storeUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Card className="border-border">
            <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground mb-1">Your Store Link</h3>
                <p className="text-xs text-muted-foreground mb-3">Share this link on your WhatsApp status so customers can view your products</p>
                <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
                    <span className="text-sm text-foreground flex-1 truncate">{storeUrl}</span>
                    <Button size="sm" variant="ghost" onClick={handleCopy} className="shrink-0">
                        {copied ? <IconCheck className="w-4 h-4 text-green-500" /> : <IconCopy className="w-4 h-4" />}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
