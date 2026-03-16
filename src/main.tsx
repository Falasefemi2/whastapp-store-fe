import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { Toaster } from "sonner"


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60,
            retry: 1,
        },
    },
})

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Toaster />
            <ThemeProvider>
                <App />
                <ReactQueryDevtools initialIsOpen={false} />
            </ThemeProvider>
        </QueryClientProvider>
    </StrictMode>
)
