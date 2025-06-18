import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { FC, memo, useEffect, useRef } from "react";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { MapStyles } from "@/styles/MapStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { customMapStyle, indiaIntialRegion } from "@/utils/CustomMap";
import MapViewDirections from "react-native-maps-directions";

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_MAP_API_KEY || "";

const RoutesMap: FC<{ drop: any; pickup: any }> = ({ drop, pickup }) => {
    const mapRef = useRef<MapView>(null);

    const fitToMarkers = async () => {
        const coordinates = [];
        if (pickup?.latitude && pickup?.longitude) {
            coordinates.push({ latitude: pickup?.latitude, longitude: pickup?.longitude });
        }
        if (drop?.latitude && drop?.longitude) {
            coordinates.push({ latitude: drop?.latitude, longitude: drop?.longitude });
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

    const fitToMarkersWithDelay = () => {
        setTimeout(() => {
            fitToMarkers();
        }, 500);
    };

    useEffect(() => {
        if (drop?.latitude && pickup?.latitude) {
            fitToMarkersWithDelay();
        }
    }, [drop?.latitude, pickup?.latitude, mapRef]);

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

    return (
        <View style={{ flex: 1 }}>
            <MapView
                provider={PROVIDER_DEFAULT}
                initialRegion={calcualateInitialRegion()}
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
                {drop?.latitude && pickup?.latitude && (
                    <MapViewDirections
                        origin={pickup}
                        destination={drop}
                        apikey={GOOGLE_MAPS_API_KEY}
                        precision='low'
                        strokeWidth={5}
                        strokeColor='red'
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
            </MapView>
            <TouchableOpacity style={MapStyles.gpsButton} onPress={fitToMarkers}>
                <MaterialCommunityIcons name='crosshairs-gps' size={RFValue(16)} color='#3C75BE' />
            </TouchableOpacity>
        </View>
    );
};

export default memo(RoutesMap);
