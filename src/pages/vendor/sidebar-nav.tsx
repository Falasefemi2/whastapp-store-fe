import { useCurrentUser } from "@/api/auth/auth.queries"
import { cn } from "@/lib/utils"
import { IconLayoutDashboard, IconPackage } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import { useLocation } from "@tanstack/react-router"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/vendor/dashboard",
    icon: <IconLayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Products",
    href: "/vendor/products",
    icon: <IconPackage className="h-5 w-5" />,
  },
]

function CohereLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="#1a1a1a" />
      <circle cx="11" cy="16" r="5" fill="#FF6B4A" />
      <circle cx="21" cy="16" r="5" fill="#9B59B6" opacity="0.85" />
      <circle cx="16" cy="16" r="5" fill="#E84B8A" opacity="0.85" />
    </svg>
  )
}

export function SidebarNav() {
  const location = useLocation()
  const pathname = location.pathname

  const { data } = useCurrentUser()

  return (
    <aside className="fixed top-0 left-0 flex h-screen w-64 flex-col gap-8 bg-[#1f1f1f] p-6 text-white">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <CohereLogoIcon className="h-8 w-8 shrink-0" />
        <div className="flex flex-col">
          <span className="text-[14px] leading-tight font-semibold tracking-tight text-white">
            {data?.user.vendor.storeName ?? "cohere"}
          </span>
          <span className="truncate text-[11px] leading-tight text-[#999]">
            {data?.user.email}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-2.5 text-[13px] font-medium transition-colors duration-200",
              pathname === item.href
                ? "bg-[#2d4a3e] text-white"
                : "text-[#aaa] hover:bg-white/10 hover:text-white"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 pt-4 text-[11px] text-[#666]">
        <p>&copy; 2026 WhatsApp Vendor</p>
      </div>
    </aside>
  )
}
