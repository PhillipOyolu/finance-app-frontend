export interface User {
    id: number;
    email: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}