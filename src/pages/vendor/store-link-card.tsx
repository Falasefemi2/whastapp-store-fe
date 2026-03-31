import { useState } from "react"
import { IconCopy, IconCheck } from "@tabler/icons-react"

export function StoreLinkCard({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false)
  const storeUrl = `${window.location.origin}/store/${slug}`

  const handleCopy = () => {
    navigator.clipboard.writeText(storeUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-2xl border border-black/6 bg-white px-6 py-5">
      <h3 className="mb-0.5 text-[14px] font-semibold text-[#1a1a1a]">
        Your Store Link
      </h3>
      <p className="mb-4 text-[12px] text-[#999]">
        Share this link on your WhatsApp status so customers can view your
        products
      </p>
      <div className="flex items-center gap-2 rounded-xl bg-[#f3f3f3] px-4 py-2.5">
        <span className="flex-1 truncate text-[13px] text-[#555]">
          {storeUrl}
        </span>
        <button
          onClick={handleCopy}
          className="shrink-0 rounded-lg p-1.5 transition-colors hover:bg-black/6"
          aria-label={copied ? "Copied" : "Copy link"}
        >
          {copied ? (
            <IconCheck className="h-4 w-4 text-[#2d4a3e]" />
          ) : (
            <IconCopy className="h-4 w-4 text-[#777]" />
          )}
        </button>
      </div>
    </div>
  )
}
