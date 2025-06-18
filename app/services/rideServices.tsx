import { Alert } from "react-native";
import { appAxios } from "./apiInterceptors";
import { router } from "expo-router";
import { resetAndNavigate } from "@/utils/Helpers";

interface coords {
    address: string | undefined;
    latitude: number | undefined;
    longitude: number | undefined;
}

export interface CreateRideOptions {
    vehicle: "bike" | "auto" | "cabEconomy" | "cabPremium";
    pickup: coords;
    drop: coords;
}

export const createRide = async (payload: CreateRideOptions) => {
    try {
        const res = await appAxios.post("/ride/create", payload);
        router.navigate({
            pathname: "/customer/liveride",
            params: {
                id: res?.data?.ride?._id,
            },
        });
    } catch (error) {
        Alert.alert("There was an error creating your ride");
        console.error("Create Ride error", error);
    }
};

export const getMyRides = async (isCustomer: boolean = true) => {
    try {
        const res = await appAxios.get("/ride/rides");
        const filterRides = res.data.rides?.filter((ride: any) => ride?.status !== "COMPLETED");
        if (filterRides?.length > 0)
            router.navigate({
                pathname: isCustomer ? "/customer/liveride" : "/captain/liveride",
                params: {
                    id: filterRides[0]?._id,
                },
            });
    } catch (error) {
        Alert.alert("There was an error creating your ride");
        console.error("Get Rides error", error);
    }
};

export const acceptRideOffer = async (rideId: string) => {
    try {
        await appAxios.get(`/ride/accept/${rideId}`);
        resetAndNavigate({
            pathname: "/captain/liveride",
            params: { id: rideId },
        });
    } catch (error) {
        Alert.alert("There was an error creating your ride");
        console.error("Get Rides error", error);
    }
};

export const updateRideStatus = async (rideId: string, status: string) => {
    try {
        await appAxios.patch(`/ride/update/${rideId}`, { status });
        return true;
    } catch (error) {
        Alert.alert("There was an error creating your ride");
        console.error("Get Rides error", error);
        return false;
    }
};
