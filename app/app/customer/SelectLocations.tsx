import { View, Text, SafeAreaView, TouchableOpacity, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { HomeStyles } from "@/styles/HomeStyles";
import { Ionicons } from "@expo/vector-icons";
import { CommonStyles } from "@/styles/CommonStyles";
import { router } from "expo-router";
import { Colors } from "@/utils/Constants";
import CustomText from "@/components/shared/CustomText";
import LocationInput from "@/components/customer/LocationInput";
import { UIStyles } from "@/styles/UIStyles";
import { calculateDistance, getLatLong, getPlacesSuggestions } from "@/utils/MapUtils";
import { FlatList } from "react-native-gesture-handler";
import { LocationStyles } from "@/styles/LocationStyles";
import { ModalStyles } from "@/styles/ModalStyles";
import { useUserStore } from "@/store/UserStore";
import LocationItem from "../../components/customer/LocationItem";
import MapPickerModal from "@/components/customer/MapPickerModal";

const SelectLocations = () => {
    const { location, setLocation } = useUserStore();
    const [focusedInput, setFocusedInput] = useState("");

    const [pickup, setPickup] = useState<any>("");
    const [pickupCoords, setPickupCoords] = useState<any>("");

    const [drop, setDrop] = useState("");
    const [dropCoords, setDropCoords] = useState<any>("");

    const [locations, setLocations] = useState([]);

    const [modalTitle, setModalTitle] = useState("drop");
    const [isMapModalVisible, setMapModalVisible] = useState(false);

    const fetchLocation = async (query: string) => {
        if (query?.length > 4) {
            const data = await getPlacesSuggestions(query);
            setLocations(data);
        }
    };

    useEffect(() => {
        if (location) {
            setPickupCoords(location);
            setPickup(location?.address);
        }
    }, [location]);

    const checkDistance = async () => {
        if (!pickupCoords || !dropCoords) return;
        const { latitude: pickupLat, longitude: pickupLong } = pickupCoords;
        const { latitude: dropLat, longitude: dropLong } = dropCoords;

        if (pickupLat === dropLat && pickupLong === dropLong) {
            alert("Pickup and drop locations cannot be same. Please select different locations.");
            return;
        }

        const distance = calculateDistance(pickupLat, pickupLong, dropLat, dropLong);

        const minDistance = 0.5;
        const maxDistance = 50;

        if (distance < minDistance) {
            alert("Selected locations are too close");
        } else if (distance > maxDistance) {
            alert("Selected locations are too far apart");
        } else {
            setLocations([]);
            router.navigate({
                pathname: "/customer/ridebooking",
                params: {
                    distanceInKm: distance.toFixed(2),
                    drop_latitude: dropCoords?.latitude,
                    drop_longitude: dropCoords?.longitude,
                    address: drop,
                },
            });
            setDrop("");
            setPickup("");
            setDropCoords(null);
            setPickupCoords(null);
            setMapModalVisible(false);
            console.info("VValid Distance: ", distance.toFixed(2));
        }
    };

    useEffect(() => {
        if (dropCoords && pickupCoords) {
            checkDistance();
        } else {
            setLocations([]);
            setMapModalVisible(false);
        }
    }, [dropCoords, pickupCoords]);

    const addLocation = async (placeId: string) => {
        const data = await getLatLong(placeId);
        if (data) {
            if (focusedInput === "drop") {
                setDrop(data?.address);
                setDropCoords(data);
            } else {
                setLocation(data);
                setPickupCoords(data);
                setPickup(data?.address);
            }
        }
    };

    const renderLocations = ({ item }: any) => {
        return (
            <LocationItem item={item} onPress={() => addLocation(item?.place_id)}></LocationItem>
        );
    };

    return (
        <View style={HomeStyles.container}>
            <StatusBar style='light' backgroundColor='orange' translucent={false} />
            <SafeAreaView />
            <TouchableOpacity style={CommonStyles.flexRow} onPress={() => router.back()}>
                <Ionicons name='chevron-back' size={24} color={Colors.iosColor} />
                <CustomText fontFamily='Regular' style={{ color: Colors.iosColor }}>
                    Back
                </CustomText>
            </TouchableOpacity>
            <View style={UIStyles.locationInputs}>
                <LocationInput
                    placeholder='Search pickup location...'
                    type='pickup'
                    value={pickup}
                    onChangeText={(text) => {
                        setPickup(text);
                        fetchLocation(text);
                    }}
                    onFocus={() => setFocusedInput("pickup")}
                />
                <LocationInput
                    placeholder='Search drop location...'
                    type='drop'
                    value={drop}
                    onChangeText={(text) => {
                        setDrop(text);
                        fetchLocation(text);
                    }}
                    onFocus={() => setFocusedInput("drop")}
                />
                <CustomText fontFamily='Medium' fontSize={10} style={UIStyles.suggestionText}>
                    {focusedInput} suggestions
                </CustomText>
            </View>
            <FlatList
                data={locations}
                renderItem={renderLocations}
                keyExtractor={(item: any) => item?.place_id}
                initialNumToRender={5}
                windowSize={5}
                ListFooterComponent={
                    <TouchableOpacity
                        style={[CommonStyles.flexRow, LocationStyles.container]}
                        onPress={() => {
                            setModalTitle(focusedInput);
                            setMapModalVisible(true);
                        }}
                    >
                        <Image
                            source={require("@/assets/icons/map_pin.png")}
                            style={UIStyles.mapPinIcon}
                        />
                        <CustomText fontFamily='Medium' fontSize={12}>
                            Select from map
                        </CustomText>
                    </TouchableOpacity>
                }
            />
            {isMapModalVisible && (
                <MapPickerModal
                    selectedLocation={{
                        latitude:
                            focusedInput === "drop" ? dropCoords?.latitude : pickupCoords?.latitude,
                        longitude:
                            focusedInput === "drop"
                                ? dropCoords?.longitude
                                : pickupCoords?.longitude,
                        address: focusedInput === "drop" ? drop : pickup,
                    }}
                    title={modalTitle}
                    visible={isMapModalVisible}
                    onClose={() => setMapModalVisible(false)}
                    onSelectLocation={(data) => {
                        if (data) {
                            if (modalTitle === "drop") {
                                setDropCoords(data);
                                setDrop(data?.address);
                            } else {
                                setLocation(data);
                                setPickupCoords(data);
                                setPickup(data?.address);
                            }
                        }
                    }}
                />
            )}
        </View>
    );
};

export default SelectLocations;
