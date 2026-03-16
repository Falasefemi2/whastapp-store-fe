import apiClient from "../client";
import type { LoginPayload, LoginSuccessResponse, MeSuccessResponse, RegisterPayload, RegisterSuccessResponse } from "./auth.types";

export const registerVendor = async (payload: RegisterPayload): Promise<RegisterSuccessResponse> => {
    try {
        const response = await apiClient.post<RegisterSuccessResponse>("/auth/register", payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const login = async (payload: LoginPayload): Promise<LoginSuccessResponse> => {
    try {
        const response = await apiClient.post<LoginSuccessResponse>("/auth/login", payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await apiClient.get<MeSuccessResponse>("/auth/me");
        return response.data;
    } catch (error) {
        throw error;
    }
}
