import { useContext } from "react";
import type { AuthMessageContextType } from "../../types/auth/AuthMessageContext";
import AuthMessageContext from "../../contexts/auth/AuthMessContexts";

// Hook za korišćenje AuthContext-a
export const useMessAuth = (): AuthMessageContextType => {
    const context = useContext(AuthMessageContext);
    if (context === undefined) {
        throw new Error('useAuth mora biti korišćen unutar AuthProvider-a');
    }
    return context;
};