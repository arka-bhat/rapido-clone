import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { getMyRides } from "@/services/rideServices";
import { HomeStyles } from "@/styles/HomeStyles";
import { StatusBar } from "expo-status-bar";
import CaptainHeader from "@/components/captain/CaptainHeader";
import { useIsFocused } from "@react-navigation/native";
import { useWS } from "@/services/WSProvider";
import { useCaptainStore } from "@/store/CaptainStore";
import { CaptainStyles } from "@/styles/CaptainStyles";
import CustomText from "@/components/shared/CustomText";
import * as Location from "expo-location";
import CaptainRidesItem from "@/components/captain/CaptainRidesItem";

const Home = () => {
    const isFocused = useIsFocused();
    const { emit, on, off } = useWS();

    const { onDuty, setLocation } = useCaptainStore();
    const [rideOffers, setRideOffers] = useState<any>([]);
    useEffect(() => {
        getMyRides(false);
    }, []);

    useEffect(() => {
        let locationSubscription: any;
        const startLocationUpdates = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === "granted") {
                locationSubscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.Low,
                        timeInterval: 10000,
                        distanceInterval: 100,
                    },
                    (location) => {
                        const { latitude, longitude, heading } = location.coords;
                        setLocation({
                            latitude,
                            longitude,
                            heading: heading as number,
                            address: "captain addr",
                        });
                        emit("updateLocation", {
                            latitude,
                            longitude,
                            heading,
                        });
                    }
                );
            }
        };

        if (onDuty && isFocused) {
            startLocationUpdates();
        }

        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
        };
    }, [onDuty, isFocused]);

    useEffect(() => {
        if (onDuty && isFocused) {
            on("rideOffer", (rideDetails: any) => {
                setRideOffers((prevOffers: any[]) => {
                    const existingIds = new Set(prevOffers?.map((offer) => offer._id));
                    if (!existingIds.has(rideDetails?._id)) {
                        return [...prevOffers, rideDetails];
                    }
                    return prevOffers;
                });
            });
        }
        return () => {
            off("rideOffer");
        };
    }, [onDuty, on, off, isFocused]);

    const removeRide = (id: string) => {
        setRideOffers((prevOffers: any[]) =>
            prevOffers.filter((offer: { _id: string }) => offer._id !== id)
        );
    };
    const renderRides = ({ item }: any) => {
        return <CaptainRidesItem removeIt={() => removeRide(item?._id)} item={item} />;
    };
    return (
        <View style={HomeStyles.container}>
            <StatusBar style='light' backgroundColor='orange' translucent={false} />
            <CaptainHeader />
            <FlatList
                data={!onDuty ? [] : rideOffers}
                renderItem={renderRides}
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 10, paddingBottom: 120 }}
                keyExtractor={(item: any) => item?._id || Math.random().toString()}
                ListEmptyComponent={
                    <View style={CaptainStyles?.emptyContainer}>
                        <Image
                            source={require("@/assets/icons/ride.jpg")}
                            style={CaptainStyles.emptyImage}
                        />
                        <CustomText fontSize={12} style={{ textAlign: "center" }}>
                            {onDuty
                                ? "There are no available rides! Stay Active"
                                : "You're currently off duty, please go on duty to start earning"}
                        </CustomText>
                    </View>
                }
            />
        </View>
    );
};

export default Home;
