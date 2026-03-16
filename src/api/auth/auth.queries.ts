import { useMutation } from "@tanstack/react-query";
import type { LoginPayload, RegisterPayload } from "./auth.types";
import { getCurrentUser, login, registerVendor } from "./auth.api";
import { useQuery } from "@tanstack/react-query"

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
    })
}

export const useRegisterVendor = () => {
    return useMutation({
        mutationFn: (payload: RegisterPayload) => registerVendor(payload),
    });
};

export const useLogin = () => {
    return useMutation({
        mutationFn: (payload: LoginPayload) => login(payload),
    });
};
