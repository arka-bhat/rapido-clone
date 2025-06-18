import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomText from "@/components/shared/CustomText";
import { UIStyles } from "@/styles/UIStyles";
import { CommonStyles } from "@/styles/CommonStyles";
import { RFValue } from "react-native-responsive-fontsize";

const cubes = [
    { name: "Bike", imageUri: require("@/assets/icons/bike.png") },
    { name: "Auto", imageUri: require("@/assets/icons/auto.png") },
    { name: "Cab Economy", imageUri: require("@/assets/icons/cab.png") },
    { name: "Parcel", imageUri: require("@/assets/icons/parcel.png") },
    { name: "Cab Premium", imageUri: require("@/assets/icons/cab_premium.png") },
];

const SheetContent = () => {
    return (
        <View>
            <TouchableOpacity
                style={UIStyles.searchBarContainer}
                onPress={() => router.navigate("/customer/SelectLocations")}
            >
                <Ionicons name='search-outline' color='black' />
                <CustomText fontFamily='Medium' fontSize={11}>
                    Where are you going?
                </CustomText>
            </TouchableOpacity>
            <View style={CommonStyles.flexRowBetween}>
                <CustomText fontFamily='Medium' fontSize={11}>
                    Explore
                </CustomText>

                <TouchableOpacity style={CommonStyles.flexRow}>
                    <CustomText fontFamily='Regular' fontSize={10}>
                        View All
                    </CustomText>
                    <Ionicons name='chevron-forward' size={RFValue(14)} color='black' />
                </TouchableOpacity>
            </View>

            <View style={UIStyles.cubes}>
                {cubes?.slice(0, 4).map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={UIStyles.cubeContainer}
                        onPress={() => router.navigate("/customer/SelectLocations")}
                    >
                        <View style={UIStyles.cubeIconContainer}>
                            <Image source={item?.imageUri} style={UIStyles.cubeIcon}></Image>
                        </View>
                        <CustomText
                            fontFamily='Medium'
                            fontSize={9.5}
                            style={{ textAlign: "center" }}
                        >
                            {item?.name}
                        </CustomText>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={UIStyles.bannerContainer}>
                <Image source={require("@/assets/icons/rapido.jpg")} style={UIStyles.banner} />
            </View>
        </View>
    );
};

export default SheetContent;
