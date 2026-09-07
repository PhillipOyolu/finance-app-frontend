import api from "./api";
import type { AuthResponse } from "../types/auth";

export const authService = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const params = new URLSearchParams();
        params.append("username", email); // OAuth2 expects 'username'
        params.append("password", password);

        const response = await api.post<AuthResponse>("/auth/login", params, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        return response.data;
    },
};