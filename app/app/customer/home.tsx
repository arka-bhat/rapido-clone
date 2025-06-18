import { View, Text, Platform } from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { HomeStyles } from "@/styles/HomeStyles";
import LocationBar from "@/components/customer/LocationBar";
import { screenHeight } from "@/utils/Constants";
import DraggableMap from "@/components/customer/DraggableMap";
import SheetContent from "@/components/customer/SheetContent";
import { getMyRides } from "@/services/rideServices";

const SnapPoints =
    Platform.OS === "android"
        ? [screenHeight * 0.12, screenHeight * 0.42]
        : [screenHeight * 0.2, screenHeight * 0.5];

const Home = () => {
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => SnapPoints, []);

    const [mapHeight, setMapHeight] = useState(snapPoints[0]);

    useEffect(() => {
        getMyRides();
    }, []);
    const handleSheetChange = useCallback((index: number) => {
        let height = screenHeight * 0.8;
        if (index === 1) {
            height = screenHeight * 0.5;
        }
        setMapHeight(height);
    }, []);
    return (
        <View style={HomeStyles.container}>
            <StatusBar style='light' backgroundColor='orange' translucent={false} />
            <LocationBar />
            <DraggableMap height={mapHeight} />
            <BottomSheet
                ref={bottomSheetRef}
                index={1}
                handleIndicatorStyle={{
                    backgroundColor: "#ccc",
                }}
                enableOverDrag={false}
                enableDynamicSizing={false}
                style={{
                    zIndex: 4,
                }}
                snapPoints={snapPoints}
                onChange={handleSheetChange}
            >
                <BottomSheetScrollView contentContainerStyle={HomeStyles.scrollContainer}>
                    <SheetContent />
                </BottomSheetScrollView>
            </BottomSheet>
        </View>
    );
};

export default Home;
