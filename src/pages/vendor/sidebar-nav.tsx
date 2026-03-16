import { useCurrentUser } from "@/api/auth/auth.queries"
import { cn } from "@/lib/utils"
import { IconLayoutDashboard, IconPackage, IconPlus } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import { useLocation } from "@tanstack/react-router"

interface NavItem {
    label: string
    href: string
    icon: React.ReactNode
}

const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/vendor/dashboard', icon: <IconLayoutDashboard className="w-5 h-5" /> },
    { label: 'Products', href: '/vendor/products', icon: <IconPackage className="w-5 h-5" /> },
    { label: 'Add Product', href: '/add-product', icon: <IconPlus className="w-5 h-5" /> },
]

export function SidebarNav() {
    const location = useLocation()
    const pathname = location.pathname

    const { data } = useCurrentUser();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground p-6 flex flex-col gap-8">
            {/* Logo Section */}
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
                    <span className="text-sidebar-primary-foreground font-bold text-lg">V</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-sm">{data?.user.vendor.storeName}</span>
                    <span className="text-xs text-sidebar-accent-foreground opacity-70">{data?.user.email}</span>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200',
                            pathname === item.href
                                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:bg-opacity-50'
                        )}
                    >
                        {item.icon}
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* Footer Section */}
            <div className="pt-4 border-t border-sidebar-border text-xs text-sidebar-accent-foreground opacity-60">
                <p>© 2024 VendorHub</p>
            </div>
        </aside>
    )
}
