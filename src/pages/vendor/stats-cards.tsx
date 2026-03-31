import { useGetDashboardStat } from "@/api/vendor/vendor.queries"
import {
  IconEyeFilled,
  IconPackage,
  IconShape2,
  IconX,
} from "@tabler/icons-react"

interface StatCard {
  icon: React.ReactNode
  label: string
  value: number
  trend?: { value: number; direction: "up" | "down" }
}

export function StatsCards() {
  const { data: dashboardStat } = useGetDashboardStat()

  const stats: StatCard[] = [
    {
      icon: <IconPackage className="h-5 w-5 text-[#2d4a3e]" />,
      label: "Total Products",
      value: dashboardStat?.totalProducts ?? 0,
    },
    {
      icon: <IconShape2 className="h-5 w-5 text-[#2d4a3e]" />,
      label: "Active Products",
      value: dashboardStat?.activeProducts ?? 0,
    },
    {
      icon: <IconX className="h-5 w-5 text-[#2d4a3e]" />,
      label: "Inactive Products",
      value:
        (dashboardStat?.totalProducts ?? 0) -
        (dashboardStat?.activeProducts ?? 0),
    },
    {
      icon: <IconEyeFilled className="h-5 w-5 text-[#2d4a3e]" />,
      label: "Total Store Views",
      value: dashboardStat?.totalVisits ?? 0,
      trend: { value: dashboardStat?.recentVisits ?? 0, direction: "up" },
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group cursor-pointer rounded-2xl border border-black/6 bg-white px-6 py-5 transition-shadow hover:shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="mb-2 text-[12px] text-[#999]">{stat.label}</p>
              <p className="text-[2rem] leading-none font-semibold text-[#1a1a1a]">
                {stat.value.toLocaleString()}
              </p>
              {stat.trend && (
                <div className="mt-2 flex items-center gap-1">
                  <span
                    className={`text-[11px] font-medium ${stat.trend.direction === "up" ? "text-[#2d4a3e]" : "text-red-500"}`}
                  >
                    {stat.trend.direction === "up" ? "↑" : "↓"}{" "}
                    {stat.trend.value}%
                  </span>
                  <span className="text-[11px] text-[#bbb]">vs last month</span>
                </div>
              )}
            </div>
            <div className="rounded-xl bg-[#f0f4f2] p-2.5 transition-colors group-hover:bg-[#e4ede9]">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
