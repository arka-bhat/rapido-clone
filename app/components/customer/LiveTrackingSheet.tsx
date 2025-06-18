import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import { useWS } from "@/services/WSProvider";
import { RideStyles } from "@/styles/RideStyles";
import { CommonStyles } from "@/styles/CommonStyles";
import { vehicleIcons } from "@/utils/MapUtils";
import CustomText from "../shared/CustomText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

type VehicleType = "bike" | "auto" | "cabEconomy" | "cabPremium";

interface RideItem {
    vehicle?: VehicleType;
    _id: string;
    pickup?: { address: string };
    drop?: { address: string };
    fare?: number;
    otp?: string;
    captain: any;
    status: string;
}

const LiveTrackingSheet: FC<{ item: RideItem }> = ({ item }) => {
    const { emit } = useWS();
    return (
        <View>
            <View style={RideStyles.headerContainer}>
                <View style={CommonStyles.flexRowGap}>
                    {item?.vehicle && (
                        <Image
                            source={vehicleIcons[item?.vehicle]?.icon}
                            style={RideStyles.rideIcon}
                        />
                    )}
                    <View>
                        <CustomText fontSize={10}>
                            {item?.status === "START"
                                ? "Captain near you"
                                : item?.status === "ARRIVED"
                                ? "HAPPY JOURNEY"
                                : "COMPLETED"}
                        </CustomText>

                        <CustomText>
                            {" "}
                            {item?.status === "START" ? ` OTP: ${item?.otp}` : ""}
                        </CustomText>
                    </View>
                </View>
                <CustomText fontSize={11} numberOfLines={1}>
                    +91{" "}
                    {item?.captain?.phone &&
                        item?.captain?.phone?.slice(0, 5) + " " + item?.captain?.phone?.slice(5)}
                </CustomText>
            </View>

            <View style={{ padding: 10 }}>
                <CustomText fontSize={12} fontFamily='SemiBold'>
                    Location Details
                </CustomText>

                <View style={[CommonStyles.flexRowGap, { marginVertical: 15, width: "90%" }]}>
                    <Image
                        source={require("@/assets/icons/marker.png")}
                        style={RideStyles.pinIcon}
                    />
                    <CustomText numberOfLines={2} fontSize={10}>
                        {item?.pickup?.address}
                    </CustomText>
                </View>

                <View style={[CommonStyles.flexRowGap, { marginVertical: 15, width: "90%" }]}>
                    <Image
                        source={require("@/assets/icons/drop_marker.png")}
                        style={RideStyles.pinIcon}
                    />
                    <CustomText numberOfLines={2} fontSize={10}>
                        {item?.drop?.address}
                    </CustomText>
                </View>

                <View style={{ marginVertical: 20 }}>
                    <View style={[CommonStyles.flexRowBetween]}>
                        <View style={CommonStyles.flexRow}>
                            <MaterialCommunityIcons name='credit-card' size={24} color='black' />
                            <CustomText style={{ marginLeft: 10 }} fontFamily='Medium'>
                                Payment
                            </CustomText>
                        </View>
                        <CustomText fontSize={14} fontFamily='SemiBold'>
                            Rs. {item?.fare?.toFixed(2)}
                        </CustomText>
                    </View>
                    <CustomText fontSize={10} fontFamily='Regular'>
                        Payment via cash
                    </CustomText>
                </View>
            </View>

            <View style={RideStyles.bottomButtonContainer}>
                <TouchableOpacity
                    style={RideStyles.cancelButton}
                    onPress={() => emit("cancelRide", item?._id)}
                >
                    <CustomText style={RideStyles.cancelButtonText}>Cancel</CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={RideStyles.backButton2}
                    onPress={() => {
                        if (item?.status === "COMPLETED") {
                            router.navigate("/customer/home");
                            return;
                        }
                    }}
                >
                    <CustomText style={RideStyles.backButtonText}>Back</CustomText>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LiveTrackingSheet;
