import React, { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import { View, Text, Image, Alert } from "react-native";
import { jwtDecode } from "jwt-decode";
import { tokenStorage } from "@/store/Storage";
import { refreshTokens } from "@/services/apiInterceptors";
import { useUserStore } from "@/store/UserStore";
import CustomText from "@/components/shared/CustomText";
import { CommonStyles } from "@/styles/CommonStyles";
import { SplashStyles } from "@/styles/SplashStyles";
import { resetAndNavigate } from "@/utils/Helpers";
import { DecodedToken } from "@/utils/Types";

import logoT from "@/assets/images/logo_t.png";

const Main = () => {
    const [loaded] = useFonts({
        Bold: require("@/assets/fonts/NotoSans-Bold.ttf"),
        Regular: require("@/assets/fonts/NotoSans-Regular.ttf"),
        Medium: require("@/assets/fonts/NotoSans-Medium.ttf"),
        Light: require("@/assets/fonts/NotoSans-Light.ttf"),
        SemiBold: require("@/assets/fonts/NotoSans-SemiBold.ttf"),
    });

    const { user } = useUserStore();

    const [hasNavigated, setHasNavigated] = useState(false);
    const tokenCheck = async () => {
        const access_token = (await tokenStorage.getString("access_token")) as string;
        const refresh_token = (await tokenStorage.getString("refresh_token")) as string;
        if (access_token) {
            const decodedAccessToken = jwtDecode<DecodedToken>(access_token);
            const decodedRefreshToken = jwtDecode<DecodedToken>(refresh_token);
            const currentTime = Date.now() / 1000;
            if (decodedRefreshToken?.exp < currentTime) {
                resetAndNavigate("/role");
                Alert.alert("Session expired! Please login again");
            }
            if (decodedAccessToken?.exp < currentTime) {
                try {
                    refreshTokens();
                } catch (error) {
                    console.error(error);
                    Alert.alert("Refresh token error");
                }
            }
            if (user) {
                resetAndNavigate("/customer/home");
            } else {
                resetAndNavigate("/captain/home");
            }
            return;
        }
        resetAndNavigate("/role");
    };

    useEffect(() => {
        if (loaded && !hasNavigated) {
            const timeoutId = setTimeout(() => {
                tokenCheck(), setHasNavigated(true);
            }, 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [loaded, hasNavigated]);

    return (
        <View style={CommonStyles.container}>
            <Image source={logoT} style={SplashStyles.img}></Image>
            <CustomText variant='h5' fontFamily='Medium' style={SplashStyles.text}>
                Made in 🇮🇳
            </CustomText>
        </View>
    );
};

export default Main;
