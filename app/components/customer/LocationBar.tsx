import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useUserStore } from "@/store/UserStore";
import { useWS } from "@/services/WSProvider";
import { UIStyles } from "@/styles/UIStyles";
import { RFValue } from "react-native-responsive-fontsize";
import { Colors } from "@/utils/Constants";
import { router } from "expo-router";
import CustomText from "../shared/CustomText";
import { logout } from "@/services/authService";

const LocationBar = () => {
    const { location } = useUserStore();
    const { disconnect } = useWS();

    return (
        <View style={UIStyles.absoluteTop}>
            <SafeAreaView />
            <View style={UIStyles.container}>
                <TouchableOpacity style={UIStyles.btn} onPress={() => logout(disconnect)}>
                    <Ionicons name='menu-outline' size={RFValue(18)} color={Colors.text} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={UIStyles.locationBar}
                    onPress={() => router.navigate("/customer/SelectLocations")}
                >
                    <View style={UIStyles.dot} />
                    <CustomText numberOfLines={1} style={UIStyles.locationText}>
                        {location?.address || "Getting address..."}
                    </CustomText>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LocationBar;
