import { View, Text, Modal, TouchableOpacity, TextInput, FlatList, Image } from "react-native";
import React, { FC, memo, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import MapView, { PROVIDER_DEFAULT, Region } from "react-native-maps";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ModalStyles } from "@/styles/ModalStyles";
import { getLatLong, getPlacesSuggestions, reverseGeocode } from "@/utils/MapUtils";
import { useUserStore } from "@/store/UserStore";
import LocationItem from "@/components/customer/LocationItem";
import { customMapStyle, indiaIntialRegion } from "@/utils/CustomMap";
import { MapStyles } from "@/styles/MapStyles";

interface MapPickerModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    selectedLocation: {
        latitude: number;
        longitude: number;
        address: string;
    };
    onSelectLocation: (location: any) => void;
}

const MapPickerModal: FC<MapPickerModalProps> = ({
    visible,
    selectedLocation,
    title,
    onSelectLocation,
    onClose,
}) => {
    const { location } = useUserStore();

    const mapRef = useRef<MapView>(null);
    const textInputRef = useRef<TextInput>(null);

    const [text, setText] = useState("");
    const [address, setAddress] = useState("");
    const [region, setRegion] = useState<Region | null>(null);
    const [locations, setLocations] = useState([]);

    const fetchLocation = async (query: string) => {
        if (query?.length > 4) {
            const data = await getPlacesSuggestions(query);
            setLocations(data);
        } else {
            setLocations([]);
        }
    };

    useEffect(() => {
        if (selectedLocation?.latitude) {
            setAddress(selectedLocation?.address);
            setRegion({
                latitude: selectedLocation?.latitude,
                longitude: selectedLocation?.longitude,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
            });

            mapRef?.current?.fitToCoordinates(
                [
                    {
                        latitude: selectedLocation?.latitude,
                        longitude: selectedLocation?.longitude,
                    },
                ],
                {
                    edgePadding: { top: 50, left: 50, right: 50, bottom: 50 },
                    animated: true,
                }
            );
        }
    }, [selectedLocation, mapRef]);

    const addLocation = async (placeId: string) => {
        const data = await getLatLong(placeId);
        if (data) {
            setRegion({
                latitude: data?.latitude,
                longitude: data?.longitude,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
            });
            setAddress(data.address);
        }
        textInputRef.current?.blur();
        setText("");
    };

    const renderLocations = ({ item }: any) => {
        return (
            <LocationItem item={item} onPress={() => addLocation(item?.place_id)}></LocationItem>
        );
    };

    const handleRegionChangeComplete = async (newRegion: Region) => {
        try {
            const address = await reverseGeocode(newRegion?.latitude, newRegion?.longitude);
            setRegion(newRegion);
            setAddress(address);
        } catch (error) {
            console.error(error);
        }
    };

    const handleGpsButtonPress = async () => {
        try {
            const currentLocation = await Location.getCurrentPositionAsync();
            const { latitude, longitude } = currentLocation.coords;
            mapRef?.current?.fitToCoordinates([{ latitude, longitude }], {
                edgePadding: { top: 50, left: 50, right: 50, bottom: 50 },
                animated: true,
            });
            const address = await reverseGeocode(latitude, longitude);
            setAddress(address);
            setRegion({
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
            });
        } catch (error) {
            console.error("Error getting location", error);
        }
    };

    return (
        <Modal
            animationType='slide'
            visible={visible}
            presentationStyle='formSheet'
            onRequestClose={onClose}
        >
            <View style={ModalStyles.modalContainer}>
                <Text style={ModalStyles.centerText}>Select {title}</Text>
                <TouchableOpacity onPress={onClose}>
                    <Text style={ModalStyles.cancelButton}>Cancel</Text>
                </TouchableOpacity>

                <View style={ModalStyles.searchContainer}>
                    <Ionicons name='search-outline' size={RFValue(16)} color='#777' />
                    <TextInput
                        ref={textInputRef}
                        style={ModalStyles.input}
                        placeholder='Search address...'
                        placeholderTextColor='#aaa'
                        value={text}
                        onChangeText={(e) => {
                            setText(e);
                            fetchLocation(e);
                        }}
                    />
                </View>

                {text !== "" ? (
                    <FlatList
                        data={locations}
                        renderItem={renderLocations}
                        keyExtractor={(item: any) => item?.place_id}
                        initialNumToRender={5}
                        windowSize={5}
                        ListHeaderComponent={
                            <View>
                                {text.length > 4 ? null : (
                                    <Text style={{ marginHorizontal: 16 }}>
                                        Enter atleast 4 characters to search...
                                    </Text>
                                )}
                            </View>
                        }
                    />
                ) : (
                    <>
                        <View style={{ flex: 1, width: "100%" }}>
                            <MapView
                                provider={PROVIDER_DEFAULT}
                                initialRegion={{
                                    latitude:
                                        region?.latitude ??
                                        location?.latitude ??
                                        indiaIntialRegion.latitude,
                                    longitude:
                                        region?.longitude ??
                                        location?.longitude ??
                                        indiaIntialRegion.longitude,
                                    latitudeDelta: 0.5,
                                    longitudeDelta: 0.5,
                                }}
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
                            />
                            <View style={MapStyles.centerMarkerContainer}>
                                <Image
                                    source={
                                        title === "drop"
                                            ? require("@/assets/icons/drop_marker.png")
                                            : require("@/assets/icons/marker.png")
                                    }
                                    style={MapStyles.marker}
                                />
                            </View>
                            <TouchableOpacity
                                style={MapStyles.gpsButton}
                                onPress={handleGpsButtonPress}
                            >
                                <MaterialCommunityIcons
                                    name='crosshairs-gps'
                                    size={RFValue(16)}
                                    color='#3C75BE'
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={ModalStyles.footerContainer}>
                            <Text style={ModalStyles.addressText} numberOfLines={2}>
                                {address === "" ? "Getting address..." : address}
                            </Text>
                            <View style={ModalStyles.buttonContainer}>
                                <TouchableOpacity
                                    style={ModalStyles.button}
                                    onPress={() => {
                                        onSelectLocation({
                                            type: title,
                                            latitude: region?.latitude,
                                            longitude: region?.longitude,
                                            address: address,
                                        });
                                    }}
                                >
                                    <Text style={ModalStyles.buttonText}>Set address</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                )}
            </View>
        </Modal>
    );
};

export default memo(MapPickerModal);
