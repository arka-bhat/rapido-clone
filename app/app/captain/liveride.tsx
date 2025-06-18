import { View, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { RideStyles } from "@/styles/RideStyles";
import { StatusBar } from "expo-status-bar";
import { useWS } from "@/services/WSProvider";
import { useCaptainStore } from "@/store/CaptainStore";
import { useRoute } from "@react-navigation/native";
import * as Location from "expo-location";
import { resetAndNavigate } from "@/utils/Helpers";
import CaptainLiveTracking from "@/components/captain/CaptainLiveTrackingMap";
import CaptainLiveTrackingMap from "@/components/captain/CaptainLiveTrackingMap";
import CaptainActionButton from "@/components/captain/CaptainActionButton";
import { updateRideStatus } from "@/services/rideServices";
import OtpInputModal from "@/components/captain/OtpInputModal";

const CaptainLiveRide = () => {
    const { location, setLocation, setOnDuty } = useCaptainStore();
    const [isOtpModalVisible, setIsOtpModalVisible] = useState<any>(false);
    const [rideData, setRideData] = useState<any>(null);
    const { emit, on, off } = useWS();
    const route = useRoute() as any;
    const params = route?.params || {};
    const id = params.id;

    useEffect(() => {
        let locationSubscription: any;
        const startLocationUpdates = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === "granted") {
                locationSubscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.Low,
                        timeInterval: 5000,
                        distanceInterval: 20,
                    },
                    (location) => {
                        const { latitude, longitude, heading } = location.coords;
                        setLocation({
                            latitude,
                            longitude,
                            heading: heading as number,
                            address: "captain addr",
                        });
                        setOnDuty(true);
                        emit("goOnDuty", {
                            latitude,
                            longitude,
                            heading,
                        });
                        emit("updateLocation", {
                            latitude,
                            longitude,
                            heading,
                        });
                    }
                );
            } else {
                console.log("Location permission denied");
            }
        };

        startLocationUpdates();

        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
        };
    }, [id]);

    useEffect(() => {
        if (id) {
            emit("subscribeRide", id);
            on("rideData", (data) => {
                setRideData(data);
            });
            on("rideCanceled", (error) => {
                console.error(error);
                resetAndNavigate("/captain/home");
                Alert.alert("Ride Canceled");
            });
            on("rideUpdate", (data) => {
                setRideData(data);
            });
            on("error", (error) => {
                console.error(error);
                resetAndNavigate("/captain/home");
                Alert.alert("There was an error");
            });
        }

        return () => {
            off("rideData");
            off("error");
        };
    }, [id, emit, on, off]);

    return (
        <View style={RideStyles.container}>
            <StatusBar style='light' backgroundColor='orange' translucent={false} />
            {rideData && (
                <CaptainLiveTrackingMap
                    status={rideData?.status}
                    drop={{
                        latitude: parseFloat(rideData?.drop.latitude),
                        longitude: parseFloat(rideData?.drop.longitude),
                    }}
                    pickup={{
                        latitude: parseFloat(rideData?.pickup.latitude),
                        longitude: parseFloat(rideData?.pickup.longitude),
                    }}
                    captain={{ latitude: location?.latitude, longitude: location?.longitude }}
                />
            )}

            <CaptainActionButton
                rideData={rideData}
                title={
                    rideData?.status === "START"
                        ? "ARRIVED"
                        : rideData?.status === "ARRIVED"
                        ? "COMPLETED"
                        : "SUCCESS"
                }
                onPress={async () => {
                    if (rideData?.status === "START") {
                        setIsOtpModalVisible(true);
                        return;
                    }
                    const isSuccess = await updateRideStatus(rideData?._id, "COMPLETED");
                    if (isSuccess) {
                        Alert.alert("Ride Completed!");
                        resetAndNavigate("/captain/home");
                    } else {
                        Alert.alert("There was an error");
                    }
                }}
                color='#228B22'
            />
            {isOtpModalVisible && (
                <OtpInputModal
                    visible={isOtpModalVisible}
                    onClose={() => setIsOtpModalVisible(false)}
                    title='Enter OTP below'
                    onConfirm={async (otp) => {
                        if (otp === rideData?.otp) {
                            const isSuccess = await updateRideStatus(rideData?._id, "ARRIVED");
                            if (isSuccess) {
                                setIsOtpModalVisible(false);
                            } else {
                                Alert.alert("Technical Error");
                            }
                        } else {
                            Alert.alert("Wrong OTP");
                        }
                    }}
                />
            )}
        </View>
    );
};

export default CaptainLiveRide;
