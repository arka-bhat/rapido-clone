import axios from "axios";
import { Alert } from "react-native";
import { BASE_URL } from "./config";
import { useCaptainStore } from "@/store/CaptainStore";
import { tokenStorage } from "@/store/Storage";
import { useUserStore } from "@/store/UserStore";
import { resetAndNavigate } from "@/utils/Helpers";

export const signIn = async (
    payload: { role: "customer" | "captain"; phone: string },
    updateAccessToken: () => void
) => {
    const { setUser } = useUserStore.getState();
    const { setCaptainUser } = useCaptainStore.getState();
    try {
        const res = await axios.post(`${BASE_URL}/auth/signin`, payload);
        const { user, access_token, refresh_token } = res.data;
        if (user.role === "customer") {
            setUser(user);
        } else {
            setCaptainUser(user);
        }

        tokenStorage.set("access_token", access_token);
        tokenStorage.set("refresh_token", refresh_token);

        if (user.role === "customer") {
            resetAndNavigate("/customer/home");
        } else {
            resetAndNavigate("/captain/home");
        }

        updateAccessToken();
    } catch (error) {
        Alert.alert("There was an error!");
        console.error("Error:", error);
    }
};

export const logout = async (disconnect?: () => void) => {
    if (disconnect) disconnect();

    const { clearData } = useUserStore.getState();
    const { clearCaptainData } = useCaptainStore.getState();

    tokenStorage.clearAll();
    clearCaptainData();
    clearData();
    resetAndNavigate("/role");
};
