import type { AuthMessage } from "./AuthMessage";

export type AuthMessageContextType = {
    poruka: AuthMessage | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}