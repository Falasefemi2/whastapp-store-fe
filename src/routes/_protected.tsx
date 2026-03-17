import { getCurrentUser } from "@/api/auth/auth.api"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected")({
    beforeLoad: async () => {
        try {
            const data = await getCurrentUser()
            console.log({ data })
            if (!data?.user) {
                throw redirect({ to: "/login" })
            }
            return { user: data.user }
        } catch {
            throw redirect({ to: "/login" })
        }
    },
    component: () => <Outlet />,
})
