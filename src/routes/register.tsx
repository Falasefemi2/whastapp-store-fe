import { createFileRoute, useNavigate, Link } from "@tanstack/react-router"
import { cn } from "@/lib/utils"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldDescription,
} from "@/components/ui/field"
import { Card, CardContent } from "@/components/ui/card"

import { useRegisterVendor } from "@/api/auth/auth.queries"
import type { RegisterPayload } from "@/api/auth/auth.types"

export const Route = createFileRoute("/register")({
    component: RegisterPage,
})


const formSchema = z.object({
    name: z.string().min(2, "Full name is required"),
    email: z.string().email("Enter a valid email"),
    storeName: z.string().min(2, "Store name is required"),
    phone: z.string().min(6, "Enter a valid phone number"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

type FormValues = z.infer<typeof formSchema>


function RegisterPage({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate()
    const registerMutation = useRegisterVendor()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            storeName: "",
            phone: "",
        },
    })

    const isLoading = registerMutation.isPending

    const onSubmit = async (data: RegisterPayload) => {
        try {
            await registerMutation.mutateAsync(data)
            navigate({ to: "/login" })
        } catch {
            // handled by react-query
        }
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <div className={cn("flex flex-col gap-6", className)} {...props}>
                    <Card className="overflow-hidden p-0">
                        <CardContent className="grid p-0 md:grid-cols-2">

                            {/* FORM */}

                            <form
                                className="p-6 md:p-8"
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <FieldGroup>
                                    <div className="flex flex-col items-center gap-2 text-center">
                                        <h1 className="text-2xl font-bold">Create account</h1>
                                        <p className="text-balance text-muted-foreground">
                                            Start selling on WhatsApp today
                                        </p>
                                    </div>

                                    {/* Name */}

                                    <Controller
                                        name="name"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                                                <Input
                                                    {...field}
                                                    id="name"
                                                    placeholder="John Doe"
                                                    disabled={isLoading}
                                                    aria-invalid={fieldState.invalid}
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />

                                    {/* Email */}

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
                                                    disabled={isLoading}
                                                    aria-invalid={fieldState.invalid}
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />

                                    {/* Store */}

                                    <Controller
                                        name="storeName"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="storeName">
                                                    Store Name
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id="storeName"
                                                    placeholder="Your Store Name"
                                                    disabled={isLoading}
                                                    aria-invalid={fieldState.invalid}
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />

                                    {/* Phone */}

                                    <Controller
                                        name="phone"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="phone">
                                                    Phone Number
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="+1 (555) 000-0000"
                                                    disabled={isLoading}
                                                    aria-invalid={fieldState.invalid}
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />

                                    {/* Password */}

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
                                                    disabled={isLoading}
                                                    aria-invalid={fieldState.invalid}
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Field>
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full"
                                        >
                                            {isLoading
                                                ? "Creating account..."
                                                : "Create Account"}
                                        </Button>
                                    </Field>

                                    <FieldDescription className="text-center">
                                        Already have an account?{" "}
                                        <Link to="/login">Sign in</Link>
                                    </FieldDescription>
                                </FieldGroup>
                            </form>

                            {/* IMAGE */}

                            <div className="relative hidden bg-muted md:block">
                                <img
                                    src="/placeholder.svg"
                                    alt="Register"
                                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                                />
                            </div>

                        </CardContent>
                    </Card>

                    <FieldDescription className="px-6 text-center">
                        By creating an account you agree to our{" "}
                        <a href="#">Terms of Service</a> and{" "}
                        <a href="#">Privacy Policy</a>.
                    </FieldDescription>
                </div>
            </div>
        </div>
    )
}
