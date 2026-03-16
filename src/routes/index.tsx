import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useCurrentUser } from "@/api/auth/auth.queries";

export const Route = createFileRoute("/")({
    component: IndexPage,
});

function IndexPage() {
    const { data, isLoading } = useCurrentUser();

    if (isLoading) return <p>Loading...</p>;

    if (data?.user.role === "admin") return <Navigate to="/admin/dashboard" />;
    if (data?.user.role === "vendor") return <Navigate to="/vendor/dashboard" />;

    return <Navigate to="/login" />;
}
