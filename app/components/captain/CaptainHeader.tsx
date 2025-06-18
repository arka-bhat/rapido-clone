import { View, Text, SafeAreaView, TouchableOpacity, Image, Alert } from "react-native";
import React, { useEffect } from "react";
import { useCaptainStore } from "@/store/CaptainStore";
import { useWS } from "@/services/WSProvider";
import { useIsFocused } from "@react-navigation/native";
import { CaptainStyles } from "@/styles/CaptainStyles";
import { CommonStyles } from "@/styles/CommonStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { logout } from "@/services/authService";
import CustomText from "../shared/CustomText";
import * as Location from "expo-location";

const CaptainHeader = () => {
    const { disconnect, emit } = useWS();
    const { onDuty, setOnDuty, setLocation } = useCaptainStore();
    const isFocused = useIsFocused();

    const toggleOnDuty = async () => {
        if (onDuty) {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permissin Denied", "Location permisson is required");
                return;
            }
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude, heading } = location.coords;
            setLocation({
                latitude,
                longitude,
                heading: heading as number,
                address: "reverse geocode",
            });
            emit("goOnDuty", { latitude, longitude, heading });
        } else {
            emit("goOffDuty");
        }
    };

    useEffect(() => {
        if (isFocused) {
            toggleOnDuty();
        }
    }, [isFocused, onDuty]);
    return (
        <>
            <View style={CaptainStyles.headerContainer}>
                <SafeAreaView />
                <View style={CommonStyles.flexRowBetween}>
                    <MaterialIcons
                        name='menu'
                        size={24}
                        color='black'
                        onPress={() => logout(disconnect)}
                    />
                    <TouchableOpacity
                        style={CaptainStyles.toggleContainer}
                        onPress={() => setOnDuty(!onDuty)}
                    >
                        <CustomText fontFamily='SemiBold' fontSize={12} style={{ color: "#888" }}>
                            {onDuty ? "On Duty" : "Off Duty"}
                        </CustomText>
                        <Image
                            style={CaptainStyles.icon}
                            source={
                                onDuty
                                    ? require("@/assets/icons/switch_on.png")
                                    : require("@/assets/icons/switch_off.png")
                            }
                        />
                    </TouchableOpacity>
                    <MaterialIcons name='notifications' size={24} color='black' />
                </View>
            </View>

            <View style={CaptainStyles?.earningContainer}>
                <CustomText fontSize={13} style={{ color: "#fff" }} fontFamily='Medium'>
                    Today's earning
                </CustomText>
                <View style={CommonStyles.flexRowGap}>
                    <CustomText>₹100</CustomText>
                </View>
            </View>
        </>
    );
};

export default CaptainHeader;
