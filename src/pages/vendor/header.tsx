import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { IconBell, IconChevronDown, IconUser } from '@tabler/icons-react'
import { useCurrentUser } from '@/api/auth/auth.queries';

export function Header() {

    const { data } = useCurrentUser();

    return (
        <header className="fixed top-0 right-0 left-64 h-16 border-b border-border bg-card flex items-center justify-between px-8">
            <div>
                <h1 className="text-lg font-semibold text-foreground">{data?.user.vendor.storeName}</h1>
                <p className="text-xs text-muted-foreground">Vendor Dashboard</p>
            </div>

            <div className="flex items-center gap-6">
                {/* Notification Bell */}
                <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
                    <IconBell className="w-5 h-5 text-foreground" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
                </button>

                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 p-2 hover:bg-secondary rounded-lg transition-colors">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={data?.user.vendor.logoUrl ?? undefined} alt="Vendor" />
                                <AvatarFallback>VC</AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-medium text-foreground hidden sm:inline">{data?.user.name}</span>
                                <IconChevronDown className="w-4 h-4 text-muted-foreground" />
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <IconUser className="w-4 h-4 mr-2" />
                            <span>Profile Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <span>Store Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <span>Billing & Plan</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <span className="text-destructive">Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
