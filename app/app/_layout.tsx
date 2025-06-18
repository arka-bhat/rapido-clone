import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { WSProvider } from "@/services/WSProvider";

const Layout = () => {
    return (
        <WSProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name='index' />
                <Stack.Screen name='role' />
                <Stack.Screen name='customer/auth' />
                <Stack.Screen name='captain/auth' />
                <Stack.Screen name='customer/home' />
                <Stack.Screen name='captain/home' />
                <Stack.Screen name='captain/liveride' />
                <Stack.Screen name='customer/SelectLocations' />
                <Stack.Screen name='customer/ridebooking' />
                <Stack.Screen name='customer/liveride' />
            </Stack>
        </WSProvider>
    );
};

export default gestureHandlerRootHOC(Layout);
