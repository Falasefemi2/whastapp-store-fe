import { createFileRoute, redirect } from "@tanstack/react-router";
import { getCurrentUser } from "@/api/auth/auth.api";

export const Route = createFileRoute("/")({
    beforeLoad: async () => {
        try {
            const data = await getCurrentUser();

            if (data?.user?.role === "admin") {
                throw redirect({ to: "/admin/dashboard" });
            }

            if (data?.user?.role === "vendor") {
                throw redirect({ to: "/vendor/dashboard" });
            }
        } catch {
            // If we fail to fetch the current user (not logged in / session expired),
            // fall back to showing the login page.
        }

        throw redirect({ to: "/login" });
    },
    component: () => null,
});
