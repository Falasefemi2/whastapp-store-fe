import { useMutation } from "@tanstack/react-query"
import type {
  LoginPayload,
  RegisterPayload,
  RegisterSuccessResponse,
} from "./auth.types"
import { getCurrentUser, login, registerVendor } from "./auth.api"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  })
}

export const useRegisterVendor = () => {
  return useMutation<RegisterSuccessResponse, Error, RegisterPayload>({
    mutationFn: registerVendor,
    onSuccess: (data) => {
      toast(data.message)
    },
  })
}

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
  })
}
