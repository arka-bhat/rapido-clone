import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { memo, useCallback, useMemo, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useUserStore } from "@/store/UserStore";
import { calculateFare } from "@/utils/MapUtils";
import { RideStyles } from "@/styles/RideStyles";
import { StatusBar } from "expo-status-bar";
import CustomText from "@/components/shared/CustomText";
import { CommonStyles } from "@/styles/CommonStyles";
import { router } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";
import CustomButton from "@/components/shared/CustomButton";
import RoutesMap from "@/components/customer/RoutesMap";
import { createRide, CreateRideOptions } from "@/services/rideServices";

const RideBooking = () => {
    const route = useRoute();
    const item = route?.params as any;
    const distanceInKm = item?.distanceInKm;
    const { location } = useUserStore();

    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Bike");

    const farePrices = useMemo(() => calculateFare(parseFloat(distanceInKm)), [distanceInKm]);
    const rideOptions = useMemo(
        () => [
            {
                type: "Bike",
                seats: 1,
                time: "1 min",
                dropTime: "4:00 pm",
                prices: farePrices?.bike,
                isFastest: true,
                icon: require("@/assets/icons/bike.png"),
            },
            {
                type: "Auto",
                seats: 3,
                time: "3 min",
                dropTime: "3:55 pm",
                prices: farePrices?.auto,
                icon: require("@/assets/icons/auto.png"),
            },
            {
                type: "Cab Economy",
                seats: 4,
                time: "4 min",
                dropTime: "3:50 pm",
                prices: farePrices?.cabEconomy,
                icon: require("@/assets/icons/cab.png"),
            },
            {
                type: "Cab Premium",
                seats: 4,
                time: "4 min",
                dropTime: "3:50 pm",
                prices: farePrices?.cabPremium,
                icon: require("@/assets/icons/cab_premium.png"),
            },
        ],
        [farePrices]
    );

    const handleOptionSelect = useCallback((type: string) => {
        setSelectedOption(type);
    }, []);

    const handleRideBooking = async () => {
        setLoading(true);
        let vehicle: "bike" | "auto" | "cabEconomy" | "cabPremium" = "bike";
        switch (selectedOption) {
            case "Cab Economy":
                vehicle = "cabEconomy";
                break;
            case "Cab Premium":
                vehicle = "cabPremium";
                break;
            case "Bike":
                vehicle = "bike";
                break;
            case "Auto":
                vehicle = "auto";
                break;
            default:
                vehicle = "bike";
                break;
        }
        await createRide({
            vehicle,
            drop: {
                latitude: parseFloat(item?.drop_latitude),
                longitude: parseFloat(item?.drop_longitude),
                address: item?.address,
            },
            pickup: {
                latitude: location?.latitude,
                longitude: location?.longitude,
                address: location?.address?.toString(),
            },
        });
        setLoading(false);
    };

    return (
        <View style={RideStyles.container}>
            <StatusBar style='light' backgroundColor='orange' translucent={false} />
            {item?.drop_latitude && location?.latitude && (
                <RoutesMap
                    drop={{
                        latitude: parseFloat(item?.drop_latitude),
                        longitude: parseFloat(item?.drop_longitude),
                    }}
                    pickup={{ latitude: location?.latitude, longitude: location?.longitude }}
                />
            )}
            <View style={RideStyles.rideSelectionContainer}>
                <View style={RideStyles.offerContainer}>
                    <CustomText fontSize={12} style={RideStyles.offerText}>
                        {" "}
                        You get ₹10 off 5 coins cashback!
                    </CustomText>
                </View>

                <ScrollView
                    contentContainerStyle={RideStyles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {rideOptions?.map((ride, index) => (
                        <RideOption
                            key={index}
                            ride={ride}
                            selected={selectedOption}
                            onSelect={handleOptionSelect}
                        />
                    ))}
                </ScrollView>
            </View>
            <TouchableOpacity onPress={() => router.back()} style={[RideStyles.backButton]}>
                <MaterialIcons
                    name='arrow-back-ios'
                    size={RFValue(14)}
                    style={{ left: 4 }}
                    color='black'
                />
            </TouchableOpacity>

            <View style={RideStyles.bookingContainer}>
                <View style={CommonStyles.flexRowBetween}>
                    <View
                        style={[
                            RideStyles.couponContainer,
                            { borderRightWidth: 1, borderRightColor: "#ccc" },
                        ]}
                    >
                        <Image
                            source={require("@/assets/icons/rupee.png")}
                            style={RideStyles?.icon}
                        />
                        <View>
                            <CustomText fontFamily='Medium' fontSize={12}>
                                Cash
                            </CustomText>
                            <CustomText fontFamily='Medium' fontSize={10} style={{ opacity: 0.7 }}>
                                Dist: {distanceInKm}
                            </CustomText>
                        </View>
                        <Ionicons name='chevron-forward' size={RFValue(14)} color='#777' />
                    </View>

                    <View style={[RideStyles.couponContainer, ,]}>
                        <Image
                            source={require("@/assets/icons/coupon.png")}
                            style={RideStyles?.icon}
                        />
                        <View>
                            <CustomText fontFamily='Medium' fontSize={12}>
                                GORPAIDO
                            </CustomText>
                            <CustomText fontFamily='Medium' fontSize={10} style={{ opacity: 0.7 }}>
                                Coupon applied
                            </CustomText>
                        </View>
                        <Ionicons name='chevron-forward' size={RFValue(14)} color='#777' />
                    </View>
                </View>

                <CustomButton
                    title='Book Ride'
                    disabled={loading}
                    loading={loading}
                    onPress={handleRideBooking}
                />
            </View>
        </View>
    );
};

const RideOption = memo(({ ride, selected, onSelect }: any) => (
    <TouchableOpacity
        onPress={() => onSelect(ride?.type)}
        style={[RideStyles.rideOption, { borderColor: selected === ride.type ? "#222" : "#ddd" }]}
    >
        <View style={CommonStyles.flexRowBetween}>
            <Image source={ride?.icon} style={RideStyles.rideIcon} />
            <View style={RideStyles.rideDetails}>
                <CustomText fontFamily='Medium' fontSize={12}>
                    {ride?.type}{" "}
                    {ride?.isFastest && <Text style={RideStyles.fastestLabel}>Fastest</Text>}
                </CustomText>
                <CustomText fontFamily='Regular' fontSize={10}>
                    {ride?.seats} seats · {ride?.time} away · Drop{ride?.dropTime}{" "}
                </CustomText>
            </View>
            <View style={RideStyles.priceContainer}>
                <CustomText fontFamily='Medium' fontSize={14}>
                    ₹{ride?.prices?.toFixed(2)}
                </CustomText>
                {selected === ride.type && (
                    <Text style={RideStyles.discountedPrice}>
                        ₹{Number(ride?.prices + 10).toFixed(2)}
                    </Text>
                )}
            </View>
        </View>
    </TouchableOpacity>
));

export default memo(RideBooking);
