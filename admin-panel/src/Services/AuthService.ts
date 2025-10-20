import type { UserRegisterDTO } from "../types/UserTypes/UserRegisterDTO";
import type { UserLoginDTO } from "../types/UserTypes/UserLoginDTO";
import type { TokenResponseDTO } from "../types/UserTypes/TokenResponseDTO";
import type { RefreshTokenRequestDTO } from "../types/UserTypes/RefreshTokenRequestDTO";
import { ACCESS_TOKEN_KEY } from "../Context/AuthContext";
import api from "./api";

export const authService = {
  async register(req: UserRegisterDTO): Promise<{ userName: string }> {
    try {
      const request = await api.post(`/api/Auth/register`, req);
      console.log("Axios post sonrası", request.data);
      return request.data;
    } catch (err) {
      console.log("Axios hatası", err);
      throw err;
    }
  },
  async login(req: UserLoginDTO): Promise<TokenResponseDTO> {
    const request = await api.post<TokenResponseDTO>(`/api/Auth/login`, req);
    console.log(request);
    
    return request.data;
  },
  async logout(): Promise<string> {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    const request = await api.post(
      `/api/Auth/logout`,
      {}, // body boş
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return request.data;
  },
  async refresh_Token(req: RefreshTokenRequestDTO): Promise<TokenResponseDTO> {
    const request = await api.post(`/api/Auth/refresh-token`, req);
    return request.data;
  },
};
