import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const LOCAL_API_URL = "http://localhost:5000/api";
export const DEPLOYED_API_URL = "https://foodfit-production.up.railway.app/api";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

export const api = axios.create({
  baseURL: configuredApiUrl || (import.meta.env.PROD ? DEPLOYED_API_URL : LOCAL_API_URL)
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const { refreshToken, setTokens, logout } = useAuthStore.getState();

    if (error.response?.status === 401 && refreshToken && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });
        setTokens(data.accessToken, data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        logout();
      }
    }

    return Promise.reject(error);
  }
);
