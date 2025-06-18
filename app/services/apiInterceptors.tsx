import axios from "axios";
import { BASE_URL } from "./config";
import { tokenStorage } from "@/store/Storage";
import { logout } from "./authService";

export const appAxios = axios.create({
    baseURL: BASE_URL,
});

export const refreshTokens = async () => {
    try {
        const refreshToken = (await tokenStorage.getString("refresh_token")) as string;
        const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
            refresh_token: refreshToken,
        });

        const new_access_token = response.data.access_token;
        const new_refresh_token = response.data.refresh_token;

        tokenStorage.set("access_token", new_access_token);
        tokenStorage.set("refresh_token", new_refresh_token);

        return new_access_token;
    } catch (error) {
        console.error("REFRESH TOKEN ERROR");
        logout();
    }
};

appAxios.interceptors.request.use(async (config) => {
    const accessToken = (await tokenStorage.getString("access_token")) as string;
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});
appAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            try {
                const newAccessToken = await refreshTokens();
                if (newAccessToken) {
                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axios(error.config);
                }
            } catch (error) {
                console.error("Error refreshing token");
            }
        }

        return Promise.reject(error);
    }
);
