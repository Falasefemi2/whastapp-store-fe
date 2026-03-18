import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { useLogin } from "@/api/auth/auth.queries"
import type { LoginPayload } from "@/api/auth/auth.types"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import axios from "axios"

export const Route = createFileRoute("/login")({
    component: LoginPage,
})


const formSchema = z.object({
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

type FormValues = z.infer<typeof formSchema>


function LoginPage({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate()
    const loginMutation = useLogin()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })


    const onSubmit = async (data: LoginPayload) => {
        try {
            const result = await loginMutation.mutateAsync(data)
            toast(result.message);
            if (result.user.role === "admin") {
                navigate({ to: "/admin/dashboard" })
            } else {
                navigate({ to: "/vendor/dashboard" })
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message)
            }
        }
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <div className={cn("flex flex-col gap-6", className)} {...props}>
                    <Card className="overflow-hidden p-0">
                        <CardContent className="grid p-0 md:grid-cols-2">
                            <form
                                className="p-6 md:p-8"
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <FieldGroup>
                                    <div className="flex flex-col items-center gap-2 text-center">
                                        <h1 className="text-2xl font-bold">Welcome back</h1>
                                        <p className="text-balance text-muted-foreground">
                                            Login to your WhatsApp Vendor account
                                        </p>
                                    </div>

                                    {/* Email Field */}

                                    <Controller
                                        name="email"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="email">Email</FieldLabel>

                                                <Input
                                                    {...field}
                                                    id="email"
                                                    type="email"
                                                    placeholder="m@example.com"
                                                    disabled={loginMutation.isPending}
                                                    autoComplete="off"
                                                    aria-invalid={fieldState.invalid}
                                                />

                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />

                                    {/* Password Field */}

                                    <Controller
                                        name="password"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="password">
                                                    Password
                                                </FieldLabel>

                                                <Input
                                                    {...field}
                                                    id="password"
                                                    type="password"
                                                    disabled={loginMutation.isPending}
                                                    aria-invalid={fieldState.invalid}
                                                />

                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />

                                    {/* Submit Button */}

                                    <Field>
                                        <Button
                                            type="submit"
                                            disabled={loginMutation.isPending}
                                        >
                                            {loginMutation.isPending
                                                ? "Signing in..."
                                                : "Sign In"}
                                        </Button>
                                    </Field>

                                    <FieldDescription className="text-center">
                                        Don&apos;t have an account?{" "}
                                        <Link to="/register">Sign Up</Link>
                                    </FieldDescription>
                                </FieldGroup>
                            </form>

                            {/* Image Section */}

                            <div className="relative hidden bg-muted md:block">
                                <img
                                    src="/placeholder.svg"
                                    alt="Image"
                                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <FieldDescription className="px-6 text-center">
                        By clicking continue, you agree to our{" "}
                        <a href="#">Terms of Service</a> and{" "}
                        <a href="#">Privacy Policy</a>.
                    </FieldDescription>
                </div>
            </div>
        </div>
    )
}
