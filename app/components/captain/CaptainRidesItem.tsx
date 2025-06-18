import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { FC, memo } from "react";
import { useCaptainStore } from "@/store/CaptainStore";
import { acceptRideOffer } from "@/services/rideServices";
import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";
import { orderStyles } from "@/styles/CaptainStyles";
import { CommonStyles } from "@/styles/CommonStyles";
import { calculateDistance, vehicleIcons } from "@/utils/MapUtils";
import CustomText from "../shared/CustomText";
import { Ionicons } from "@expo/vector-icons";
import CounterButton from "./CounterButton";

type VehicleType = "bike" | "auto" | "cabEconomy" | "cabPremium";

interface RideItem {
    vehicle?: VehicleType;
    _id: string;
    pickup?: { address: string; latitude: number; longitude: number };
    drop?: { address: string; latitude: number; longitude: number };
    fare?: number;
    distance: number;
}

const CaptainRidesItem: FC<{ item: RideItem; removeIt: () => void }> = ({ item, removeIt }) => {
    const { location } = useCaptainStore();
    const acceptRide = async () => {
        acceptRideOffer(item?._id);
    };
    return (
        <Animated.View
            entering={FadeInLeft.duration(500)}
            exiting={FadeOutRight.duration(500)}
            style={orderStyles.container}
        >
            <View style={CommonStyles.flexRowBetween}>
                <View style={CommonStyles.flexRow}>
                    {item?.vehicle && (
                        <Image
                            source={vehicleIcons[item.vehicle]?.icon}
                            style={orderStyles.rideIcon}
                        />
                    )}
                    <CustomText style={{ textTransform: "captitalize" }} fontSize={11}>
                        {item?.vehicle}
                    </CustomText>
                </View>
                <CustomText fontSize={11} fontFamily='SemiBold'>
                    # {item?._id?.slice(0, 5).toUpperCase()}
                </CustomText>
            </View>

            <View style={orderStyles.locationsContainer}>
                <View style={orderStyles.flexRowBase}>
                    <View>
                        <View style={orderStyles.pickupHollowCircle} />
                        <View style={orderStyles.continuousLine} />
                    </View>
                    <View style={orderStyles.infoText}>
                        <CustomText fontSize={11} numberOfLines={1} fontFamily='SemiBold'>
                            # {item?.pickup?.address?.slice(0, 10)}
                        </CustomText>
                        <CustomText fontSize={9.5} numberOfLines={2} fontFamily='Medium'>
                            # {item?.pickup?.address}
                        </CustomText>
                    </View>
                </View>

                <View style={orderStyles.flexRowBase}>
                    <View style={orderStyles.dropHollowCircle} />
                    <View style={orderStyles.infoText}>
                        <CustomText fontSize={11} numberOfLines={1} fontFamily='SemiBold'>
                            # {item?.drop?.address?.slice(0, 10)}
                        </CustomText>
                        <CustomText fontSize={9.5} numberOfLines={2} fontFamily='Medium'>
                            # {item?.drop?.address}
                        </CustomText>
                    </View>
                </View>
            </View>

            <View style={CommonStyles.flexRowGap}>
                <View>
                    <CustomText fontFamily='Medium' fontSize={9} style={orderStyles.label}>
                        Pickup
                    </CustomText>
                    <CustomText fontFamily='SemiBold' fontSize={11}>
                        {(location &&
                            calculateDistance(
                                item?.pickup?.latitude,
                                item?.pickup?.longitude,
                                location?.latitude,
                                location?.longitude
                            ).toFixed(2)) + "Km" || "-"}
                    </CustomText>
                </View>

                <View style={orderStyles.borderLine}>
                    <CustomText fontFamily='Medium' fontSize={9} style={orderStyles.label}>
                        Drop
                    </CustomText>
                    <CustomText fontFamily='SemiBold' fontSize={11}>
                        {item?.distance.toFixed(2)} Km
                    </CustomText>
                </View>
            </View>

            <View style={orderStyles.flexRowEnd}>
                <TouchableOpacity>
                    <Ionicons name='close-circle' size={24} color='black' />
                    <CounterButton
                        onCountdownEnd={removeIt}
                        initialCount={12}
                        onPress={acceptRide}
                        title='Accept Ride'
                    />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

export default memo(CaptainRidesItem);
