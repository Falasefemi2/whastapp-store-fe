import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IconChevronDown, IconUser } from "@tabler/icons-react"
import { useCurrentUser } from "@/api/auth/auth.queries"

export function Header() {
  const { data } = useCurrentUser()

  return (
    <header className="fixed top-0 right-0 left-64 flex h-16 items-center justify-between border-b border-black/6 bg-[#e8e8e8] px-8">
      <div>
        <h1 className="text-[15px] font-semibold tracking-tight text-[#1a1a1a]">
          {data?.user.vendor.storeName}
        </h1>
        <p className="text-[11px] text-[#999]">Vendor Dashboard</p>
      </div>

      <div className="flex items-center gap-6">
        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-black/5">
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src={data?.user.vendor.logoUrl ?? undefined}
                  alt="Vendor"
                />
                <AvatarFallback className="bg-[#2d4a3e] text-[11px] font-semibold text-white">
                  {data?.user.name?.charAt(0) ?? "V"}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1">
                <span className="hidden text-[13px] font-medium text-[#1a1a1a] sm:inline">
                  {data?.user.name}
                </span>
                <IconChevronDown className="h-3.5 w-3.5 text-[#999]" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 rounded-xl border border-[#d4d4d4] bg-white shadow-sm"
          >
            <DropdownMenuLabel className="text-[12px] font-normal text-[#999]">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#eee]" />
            <DropdownMenuItem className="group cursor-pointer rounded-lg text-[13px] text-[#1a1a1a] transition-colors hover:bg-[#2d4a3e] hover:text-white">
              <IconUser className="mr-2 h-4 w-4 text-[#777] group-hover:text-white" />
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="group cursor-pointer rounded-lg text-[13px] transition-colors hover:bg-[#2d4a3e] hover:text-white">
              <span className="text-red-500 group-hover:text-white">
                Logout
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
