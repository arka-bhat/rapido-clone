import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { FC, memo, useEffect, useRef, useState } from "react";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import { customMapStyle, indiaIntialRegion } from "@/utils/CustomMap";
import MapViewDirections from "react-native-maps-directions";
import { Colors } from "@/utils/Constants";
import { getPoints } from "@/utils/MapUtils";
import { MapStyles } from "@/styles/MapStyles";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "../shared/CustomText";

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_MAP_API_KEY || "";

const CaptainLiveTrackingMap: FC<{
    drop: any;
    pickup: any;
    captain: any;
    status: any;
}> = ({ drop, pickup, captain, status }) => {
    const mapRef = useRef<MapView>(null);
    const [isUserInteracting, setIsUserInteracting] = useState(false);

    const fitToMarkers = async () => {
        if (isUserInteracting) return;
        const coordinates = [];
        if (pickup?.latitude && pickup?.longitude && status === "START") {
            coordinates.push({ latitude: pickup?.latitude, longitude: pickup?.longitude });
        }
        if (drop?.latitude && drop?.longitude && status === "ARRIVED") {
            coordinates.push({ latitude: drop?.latitude, longitude: drop?.longitude });
        }
        if (captain?.latitude && captain?.longitude) {
            coordinates.push({ latitude: captain?.latitude, longitude: captain?.longitude });
        }

        if (coordinates.length === 0) return;

        try {
            mapRef?.current?.fitToCoordinates(coordinates, {
                edgePadding: { top: 50, left: 50, right: 50, bottom: 50 },
                animated: true,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const calcualateInitialRegion = () => {
        if (drop?.latitude && pickup?.latitude) {
            const latitude = (pickup?.latitude + drop?.latitude) / 2;
            const longitude = (pickup?.longitude + drop?.longitude) / 2;
            return {
                latitude,
                longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            };
        }
        return indiaIntialRegion;
    };

    const fitToMarkersWithDelay = () => {
        setTimeout(() => {
            fitToMarkers();
        }, 500);
    };

    useEffect(() => {
        if (drop?.latitude && pickup?.latitude) {
            fitToMarkers();
        }
    }, [drop?.latitude, pickup?.latitude, captain?.latitude]);

    return (
        <View style={{ flex: 1 }}>
            <MapView
                provider={PROVIDER_DEFAULT}
                initialRegion={calcualateInitialRegion()}
                onRegionChange={() => setIsUserInteracting(true)}
                onRegionChangeComplete={() => setIsUserInteracting(false)}
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
                style={{ flex: 1 }}
                customMapStyle={customMapStyle}
            >
                {captain?.latitude && pickup?.latitude && (
                    <MapViewDirections
                        origin={status === "START" ? pickup : captain}
                        destination={status === "START" ? captain : drop}
                        apikey={GOOGLE_MAPS_API_KEY}
                        onReady={fitToMarkersWithDelay}
                        precision='low'
                        strokeWidth={5}
                        strokeColor={Colors.iosColor}
                        onError={(err) => console.error("Directions error", err)}
                    />
                )}
                {drop?.latitude && (
                    <Marker
                        coordinate={{ latitude: drop.latitude, longitude: drop.longitude }}
                        anchor={{ x: 0.5, y: 1 }}
                        zIndex={1}
                    >
                        <Image
                            source={require("@/assets/icons/drop_marker.png")}
                            style={{ height: 30, width: 30, resizeMode: "contain" }}
                        />
                    </Marker>
                )}
                {pickup?.latitude && (
                    <Marker
                        coordinate={{ latitude: pickup.latitude, longitude: pickup.longitude }}
                        anchor={{ x: 0.5, y: 1 }}
                        zIndex={2}
                    >
                        <Image
                            source={require("@/assets/icons/marker.png")}
                            style={{ height: 30, width: 30, resizeMode: "contain" }}
                        />
                    </Marker>
                )}
                {captain?.latitude && (
                    <Marker
                        coordinate={{ latitude: captain.latitude, longitude: captain.longitude }}
                        anchor={{ x: 0.5, y: 1 }}
                        zIndex={2}
                    >
                        <View style={{ transform: [{ rotate: `${captain?.heading}deg` }] }}>
                            <Image
                                source={require("@/assets/icons/cab_marker.png")}
                                style={{ height: 40, width: 40, resizeMode: "contain" }}
                            />
                        </View>
                    </Marker>
                )}

                {drop && pickup && (
                    <Polyline
                        coordinates={getPoints([drop, pickup])}
                        strokeWidth={2}
                        strokeColor={Colors.text}
                        geodesic={true}
                        lineDashPattern={[12, 10]}
                    />
                )}
            </MapView>

            <TouchableOpacity style={MapStyles.gpsLiveButton} onPress={() => {}}>
                <CustomText fontFamily='SemiBold' fontSize={10}>
                    Open Live GPS
                </CustomText>
                <FontAwesome6 name='location-arrow' size={RFValue(12)} color='#000' />
            </TouchableOpacity>

            <TouchableOpacity style={MapStyles.gpsButton} onPress={fitToMarkers}>
                <MaterialCommunityIcons name='crosshairs-gps' size={RFValue(16)} color='#3C75BE' />
            </TouchableOpacity>
        </View>
    );
};

export default memo(CaptainLiveTrackingMap);
