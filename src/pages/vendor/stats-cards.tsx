
import { useGetDashboardStat } from '@/api/vendor/vendor.queries'
import { Card, CardContent } from '@/components/ui/card'
import { IconEyeFilled, IconPackage, IconShape2, IconX } from '@tabler/icons-react'

interface StatCard {
    icon: React.ReactNode
    label: string
    value: number
    trend?: { value: number; direction: 'up' | 'down' }
}

export function StatsCards() {
    const { data: dashboardStat } = useGetDashboardStat();

    const stats: StatCard[] = [
        {
            icon: <IconPackage className="w-6 h-6 text-accent" />,
            label: 'Total Products',
            value: dashboardStat?.totalProducts ?? 0,
        },
        {
            icon: <IconShape2 className="w-6 h-6 text-accent" />,
            label: 'Active Products',
            value: dashboardStat?.activeProducts ?? 0,
        },
        {
            icon: <IconX className="w-6 h-6 text-accent" />,
            label: 'Inactive Products',
            value: (dashboardStat?.totalProducts ?? 0) - (dashboardStat?.activeProducts ?? 0),
        },
        {
            icon: <IconEyeFilled className="w-6 h-6 text-accent" />,
            label: 'Total Store Views',
            value: dashboardStat?.totalVisits ?? 0,
            trend: { value: dashboardStat?.recentVisits ?? 0, direction: 'up' },
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <Card
                    key={index}
                    className="bg-card hover:shadow-lg hover:bg-opacity-80 transition-all duration-300 border-border cursor-pointer group"
                >
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                </div>
                                <p className="text-3xl font-bold text-foreground">{stat.value.toLocaleString()}</p>
                                {stat.trend && (
                                    <div className="mt-2 flex items-center gap-1">
                                        <span className={`text-xs font-medium ${stat.trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                            {stat.trend.direction === 'up' ? '↑' : '↓'} {stat.trend.value}%
                                        </span>
                                        <span className="text-xs text-muted-foreground">vs last month</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-3 bg-secondary rounded-lg  group-hover:bg-opacity-10 transition-colors">
                                {stat.icon}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
