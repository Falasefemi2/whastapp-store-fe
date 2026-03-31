import { createFileRoute, useNavigate, Link } from "@tanstack/react-router"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { FieldError } from "@/components/ui/field"

import { useRegisterVendor } from "@/api/auth/auth.queries"
import type { RegisterPayload } from "@/api/auth/auth.types"

import { useState } from "react"
import { Eye, EyeOff, ArrowRight } from "lucide-react"

export const Route = createFileRoute("/register")({
  component: RegisterPage,
})

const formSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.email("Enter a valid email"),
  storeName: z.string().min(2, "Store name is required"),
  phone: z.string().min(6, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type FormValues = z.infer<typeof formSchema>

function CohereLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="#1a1a1a" />
      <circle cx="11" cy="16" r="5" fill="#FF6B4A" />
      <circle cx="21" cy="16" r="5" fill="#9B59B6" opacity="0.85" />
      <circle cx="16" cy="16" r="5" fill="#E84B8A" opacity="0.85" />
    </svg>
  )
}

function RegisterPage() {
  const navigate = useNavigate()
  const registerMutation = useRegisterVendor()
  const [showPassword, setShowPassword] = useState(false)

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

  const fields: {
    name: keyof FormValues
    label: string
    type?: string
    placeholder: string
    autoComplete?: string
  }[] = [
    {
      name: "name",
      label: "Full Name",
      placeholder: "John Doe",
      autoComplete: "name",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "m@example.com",
      autoComplete: "email",
    },
    {
      name: "storeName",
      label: "Store Name",
      placeholder: "Your Store Name",
      autoComplete: "organization",
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "+234 (555) 000-0000",
      autoComplete: "tel",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-[#e8e8e8]">
      {/* Top Nav */}
      <header className="flex items-center justify-between px-8 py-5">
        <Link to="/" className="flex items-center gap-2" aria-label="Home">
          <CohereLogoIcon className="h-7 w-7" />
          <span className="text-[15px] font-medium tracking-tight text-[#1a1a1a]">
            WhatsApp Vendor
          </span>
        </Link>
        <Link
          to="/login"
          className="text-[14px] font-medium text-[#1a1a1a] transition-opacity hover:opacity-70"
        >
          Log In
        </Link>
      </header>

      {/* Main */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-8">
        {/* Decorative blobs */}
        <div
          className="pointer-events-none absolute top-0 right-12 h-44 w-44 select-none"
          aria-hidden="true"
        >
          <img
            src="/blob-top-right.jpg"
            alt=""
            className="h-full w-full object-contain mix-blend-multiply"
          />
        </div>
        <div
          className="pointer-events-none absolute top-1/3 -right-4 h-44 w-44 select-none"
          aria-hidden="true"
        >
          <img
            src="/blob-right.jpg"
            alt=""
            className="h-full w-full object-contain mix-blend-multiply"
          />
        </div>
        <div
          className="pointer-events-none absolute bottom-4 left-4 h-64 w-64 select-none"
          aria-hidden="true"
        >
          <img
            src="/blob-cluster.jpg"
            alt=""
            className="h-full w-full object-contain mix-blend-multiply"
          />
        </div>

        {/* Register Card */}
        <div className="relative z-10 w-full max-w-140 rounded-2xl bg-white px-14 py-12 shadow-sm">
          <h1 className="mb-8 text-center text-[2rem] font-semibold tracking-tight text-[#1a1a1a]">
            Create account
          </h1>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Stacked fields container */}
            <div className="mb-3 overflow-hidden rounded-xl border border-[#d4d4d4]">
              {fields.map((f, index) => (
                <Controller
                  key={f.name}
                  name={f.name}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div
                      className={
                        index < fields.length - 1
                          ? "border-b border-[#d4d4d4]"
                          : ""
                      }
                    >
                      <div className="px-4 pt-3 pb-3">
                        <label
                          htmlFor={f.name}
                          className="mb-1 block text-[10px] font-semibold tracking-widest text-[#999] uppercase"
                        >
                          {f.label}
                        </label>
                        <input
                          {...field}
                          id={f.name}
                          type={f.type ?? "text"}
                          placeholder={f.placeholder}
                          disabled={isLoading}
                          autoComplete={f.autoComplete}
                          aria-invalid={fieldState.invalid}
                          className="w-full bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#999] disabled:opacity-50"
                        />
                      </div>
                      {fieldState.invalid && (
                        <div className="px-4 pb-2">
                          <FieldError errors={[fieldState.error]} />
                        </div>
                      )}
                    </div>
                  )}
                />
              ))}

              {/* Password — last field with toggle */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div>
                    <div className="flex items-center gap-2 px-4 pt-3 pb-3">
                      <div className="flex-1">
                        <label
                          htmlFor="password"
                          className="mb-1 block text-[10px] font-semibold tracking-widest text-[#999] uppercase"
                        >
                          Password
                        </label>
                        <input
                          {...field}
                          id="password"
                          type={showPassword ? "text" : "password"}
                          disabled={isLoading}
                          autoComplete="new-password"
                          aria-invalid={fieldState.invalid}
                          className="w-full bg-transparent text-[15px] text-[#1a1a1a] outline-none disabled:opacity-50"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="mt-4 text-[#999] transition-colors hover:text-[#555]"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {fieldState.invalid && (
                      <div className="px-4 pb-2">
                        <FieldError errors={[fieldState.error]} />
                      </div>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Submit button group */}
            <div className="mt-8 mb-8 flex justify-center">
              <div className="flex overflow-hidden rounded-xl">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#2d4a3e] px-7 py-3 text-[15px] font-medium text-white transition-colors hover:bg-[#233b31] disabled:opacity-70"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="border-l border-[#3d6050] bg-[#2d4a3e] px-4 py-3 text-white transition-colors hover:bg-[#233b31] disabled:opacity-70"
                  aria-label="Continue"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* Terms */}
            <p className="mb-6 text-center text-[13px] leading-relaxed text-[#777]">
              By creating an account you agree to our{" "}
              <a
                href="#"
                className="text-[#555] underline transition-colors hover:text-[#1a1a1a]"
              >
                Terms of Use
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-[#555] underline transition-colors hover:text-[#1a1a1a]"
              >
                Privacy Policy
              </a>
              .
            </p>

            {/* Login link */}
            <p className="text-center text-[13px] text-[#777]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#555] transition-colors hover:text-[#1a1a1a]"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}
