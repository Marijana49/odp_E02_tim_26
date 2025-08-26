import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { AuthMessageContextType } from '../../types/auth/AuthMessageContext';
import type { AuthMessage } from '../../types/auth/AuthMessage';
import { ObrišiVrednostPoKljuču, PročitajVrednostPoKljuču, SačuvajVrednostPoKljuču } from '../../helpers/LocalStorage';
import type { JwtTokenMessage } from '../../types/auth/JwtTokenMessage';

const AuthMessageContext = createContext<AuthMessageContextType | undefined>(undefined);

// Helper funkcija za dekodiranje JWT tokena
const decodeJWT = (token: string): JwtTokenMessage | null => {
    try {
        const decoded = jwtDecode<JwtTokenMessage>(token);
        
        // Proveri da li token ima potrebna polja
        if (decoded.korIme) {
            return {
                korIme: decoded.korIme,
                ulogovani: decoded.ulogovani
            };
        }
        
        return null;
    } catch (error) {
        console.error('Greška pri dekodiranju JWT tokena:', error);
        return null;
    }
};

// Helper funkcija za proveru da li je token istekao
const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        return decoded.exp ? decoded.exp < currentTime : false;
    } catch {
        return true;
    }
};

export const AuthMessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [poruka, setPoruka] = useState<AuthMessage | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Učitaj token iz localStorage pri pokretanju
    useEffect(() => {
        const savedToken = PročitajVrednostPoKljuču("authToken");
        
        if (savedToken) {
            // Proveri da li je token istekao
            if (isTokenExpired(savedToken)) {
                ObrišiVrednostPoKljuču("authToken");
                setIsLoading(false);
                return;
            }
            
            const claims = decodeJWT(savedToken);
            if (claims) {
                setToken(savedToken);
                setPoruka({
                    korIme: claims.korIme,
                    ulogovani: claims.ulogovani
                });
            } else {
                ObrišiVrednostPoKljuču("authToken");
            }
        }
        
        setIsLoading(false);
    }, []);

    const login = (newToken: string) => {
        const claims = decodeJWT(newToken);
        
        if (claims && !isTokenExpired(newToken)) {
            setToken(newToken);
            setPoruka({
                korIme: claims.korIme,
                ulogovani: claims.ulogovani
            });
            SačuvajVrednostPoKljuču("authToken", newToken);
        } else {
            console.error('Nevažeći ili istekao token');
        }
    };

    const logout = () => {
        setToken(null);
        setPoruka(null);
        ObrišiVrednostPoKljuču("authToken");
    };

    const isAuthenticated = !!poruka && !!token;

    const value: AuthMessageContextType = {
        poruka,
        token,
        login,
        logout,
        isAuthenticated,
        isLoading
    };

    return (
        <AuthMessageContext.Provider value={value}>
            {children}
        </AuthMessageContext.Provider>
    );
};

export default AuthMessageContext;