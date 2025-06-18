import { View, Image, TouchableOpacity } from "react-native";
import React, { FC, memo, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import haversine from "haversine-distance";
import { useIsFocused } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";
import { RFValue } from "react-native-responsive-fontsize";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { FontAwesome6 } from "@expo/vector-icons";
import { useWS } from "@/services/WSProvider";
import { useUserStore } from "@/store/UserStore";
import { customMapStyle, indiaIntialRegion } from "@/utils/CustomMap";
import { reverseGeocode } from "@/utils/MapUtils";
import { MapStyles } from "@/styles/MapStyles";

import mapMarker from "@/assets/icons/marker.png";
import bikeMarker from "@/assets/icons/bike_marker.png";
import autoMarker from "@/assets/icons/auto_marker.png";
import cabMarker from "@/assets/icons/cab_marker.png";

const DraggableMap: FC<{ height: number }> = ({ height }) => {
    const mapRef = useRef<MapView>(null);
    const { emit, on, off } = useWS();
    const isFocused = useIsFocused();
    const [markers, setMarkers] = useState<any>([]);
    const MAX_DISTANCE_THRESHOLD = 10000;
    const { location, setLocation, outOfRange, setOutOfRange } = useUserStore();

    const askLocationAccess = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status == "granted") {
            try {
                const location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;
                mapRef?.current?.fitToCoordinates([{ latitude, longitude }], {
                    edgePadding: { top: 50, left: 50, right: 50, bottom: 50 },
                    animated: true,
                });
                const newRegion = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.5,
                    longitudeDelta: 0.5,
                };
                handleRegionChangeComplete(newRegion);
            } catch (error) {
                console.error("Error getting current location", error);
            }
        } else {
            console.info("User denied location permission");
        }
    };

    useEffect(() => {
        async () => {
            if (isFocused) {
                await askLocationAccess();
            }
        };
    }, [mapRef, isFocused]);

    useEffect(() => {
        generateRandomMarkers();
    }, [location]);

    const generateRandomMarkers = () => {
        if (!location?.latitude || !location?.longitude || outOfRange) return;
        const types = ["bike", "auto", "cab"];
        const newMarkers = Array.from({ length: 20 }, (_, index) => {
            const randomType = types[Math.floor(Math.random() * types.length)];
            const randomRotation = Math.floor(Math.random() * 360);
            return {
                id: index,
                latitude: location?.latitude + (Math.random() - 0.5) * 0.01,
                longitude: location?.longitude + (Math.random() - 0.5) * 0.01,
                type: randomType,
                rotation: randomRotation,
                visible: true,
            };
        });
        setMarkers(newMarkers);
    };

    const handleRegionChangeComplete = async (newRegion: Region) => {
        const address = await reverseGeocode(newRegion?.latitude, newRegion?.longitude);
        setLocation({
            latitude: newRegion?.latitude,
            longitude: newRegion?.longitude,
            address: address,
        });
        const userLocation = {
            latitude: location?.latitude,
            longitude: location?.longitude,
        } as any;

        if (userLocation) {
            const newLocation = {
                latitude: newRegion?.latitude,
                longitude: newRegion?.longitude,
            };
            const distance = haversine(userLocation, newLocation);
            setOutOfRange(distance > MAX_DISTANCE_THRESHOLD);
        }
    };

    const handleGpsButtonPress = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            const currentLocation = await Location.getCurrentPositionAsync();
            const { latitude, longitude } = currentLocation.coords;
            mapRef?.current?.fitToCoordinates([{ latitude, longitude }], {
                edgePadding: { top: 50, left: 50, right: 50, bottom: 50 },
                animated: true,
            });
            const address = await reverseGeocode(latitude, longitude);
            setLocation({
                latitude: latitude,
                longitude: longitude,
                address: address,
            });
        } catch (error) {
            console.error("Error getting location", error);
        }
    };

    //for real driver
    // useEffect(() => {
    //     if (location?.latitude && location?.longitude && isFocused) {
    //         emit("subscribeToZone", {
    //             latitude: location.latitude,
    //             longitude: location.longitude,
    //         });

    //         on("nearbyCaptains", (captains: any[]) => {
    //             const updatedMarkers = captains?.map((captain) => ({
    //                 id: captain.id,
    //                 latitude: captain?.coords?.latitude,
    //                 longitude: captain?.coords?.longitude,
    //                 type: "captain",
    //                 rotation: captain.coords.heading,
    //                 visible: true,
    //             }));
    //             setMarkers(updatedMarkers);
    //         });

    //         return () => {
    //             off("nearbyCaptains");
    //         };
    //     }
    // }, [location, emit, on, off, isFocused]);

    return (
        <View style={{ height: height, width: "100%" }}>
            <MapView
                provider={PROVIDER_DEFAULT}
                initialRegion={indiaIntialRegion}
                pitchEnabled={false}
                maxZoomLevel={16}
                minZoomLevel={12}
                showsMyLocationButton={false}
                showsCompass={false}
                showsIndoors={false}
                showsIndoorLevelPicker={false}
                showsTraffic={false}
                showsBuildings={false}
                showsPointsOfInterest={false}
                showsScale={false}
                showsUserLocation={true}
                ref={mapRef}
                onRegionChangeComplete={handleRegionChangeComplete}
                style={{ flex: 1 }}
                customMapStyle={customMapStyle}
            >
                {markers
                    .filter((marker: any) => marker.latitude && marker.longitude && marker.visible)
                    .map((marker: any, index: number) => (
                        <Marker
                            key={index}
                            zIndex={index + 1}
                            flat
                            anchor={{ x: 0.5, y: 0.5 }}
                            coordinate={{
                                latitude: marker.latitude,
                                longitude: marker.longitude,
                            }}
                        >
                            <View style={{ transform: [{ rotate: `${marker?.rotation}deg` }] }}>
                                <Image
                                    source={
                                        marker?.type === "bike"
                                            ? bikeMarker
                                            : marker?.type === "auto"
                                            ? autoMarker
                                            : cabMarker
                                    }
                                    style={{ height: 40, width: 40, resizeMode: "contain" }}
                                />
                            </View>
                        </Marker>
                    ))}
            </MapView>
            <View style={MapStyles.centerMarkerContainer}>
                <Image source={mapMarker} style={MapStyles.marker} />
            </View>
            <TouchableOpacity style={MapStyles.gpsButton} onPress={handleGpsButtonPress}>
                <MaterialCommunityIcons name='crosshairs-gps' size={RFValue(16)} color='#3C75BE' />
            </TouchableOpacity>
            {outOfRange && (
                <View style={MapStyles.outOfRange}>
                    <FontAwesome6 name='road-circle-exclamation' size={24} color='red' />
                </View>
            )}
        </View>
    );
};

export default memo(DraggableMap);
