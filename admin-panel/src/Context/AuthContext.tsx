import React, { createContext, useContext, useState } from "react";
import { authService } from "../Services/AuthService";
import type { UserLoginDTO } from "../types/UserTypes/UserLoginDTO";
import type { UserRegisterDTO } from "../types/UserTypes/UserRegisterDTO";
import type { TokenResponseDTO } from "../types/UserTypes/TokenResponseDTO";
import { toast } from "react-toastify";
import api from "../Services/api";
import type { RefreshTokenRequestDTO } from "../types/UserTypes/RefreshTokenRequestDTO";
import * as jwt_decode from "jwt-decode";

export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
interface JwtPayload {

  userId: number;
  exp: number;
  iat: number;
}

type AuthContextType = {
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (req: UserLoginDTO) => Promise<boolean>;
  register: (req: UserRegisterDTO) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem(ACCESS_TOKEN_KEY)
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem(ACCESS_TOKEN_KEY)
  );

  const login = async (req: UserLoginDTO): Promise<boolean> => {
    try {
      const tokens: TokenResponseDTO = await authService.login(req);

      if (tokens?.accessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
        setAccessToken(tokens.accessToken);
        setIsAuthenticated(true);
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      // Axios hatası burada yakalanır
      if (error.response?.status === 401) {
        toast.error("Invalid username or password");
      } else {
        
      }
      return false; // hata olduğunda false dön
    }
  };

  const register = async (req: UserRegisterDTO) => {
    await authService.register(req);
  };

  const logout = async () => {
    await authService.logout();
    setAccessToken(null);
    setIsAuthenticated(false);
  };
  const checkAuth = async () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    let userId = 0;
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      const decoded = jwt_decode.jwtDecode<JwtPayload>(token); 
      userId = decoded.userId;
    }

    if (!accessToken && refreshToken) {
      try {
        const req: RefreshTokenRequestDTO = {
          refreshToken: refreshToken,
          UserId: userId
        };
        const tokens = await authService.refresh_Token(req);
        localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
        setIsAuthenticated(true);
        return;
      } catch {
        setIsAuthenticated(false);
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        return;
      }
    }

    if (!accessToken) {
      setIsAuthenticated(false);
      return;
    }

    // Access token varsa test isteği
    try {
      await api.get("/api/auth/protectedRoute");
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        accessToken,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
