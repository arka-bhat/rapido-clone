import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { FC } from "react";
import { CommonStyles } from "@/styles/CommonStyles";
import { LocationStyles } from "@/styles/LocationStyles";
import CustomText from "@/components/shared/CustomText";
import { UIStyles } from "@/styles/UIStyles";

const LocationItem: FC<{ item: any; onPress: () => void }> = ({ item, onPress }) => {
    return (
        <TouchableOpacity
            style={[CommonStyles.flexRowBetween, LocationStyles.container]}
            onPress={onPress}
        >
            <View style={CommonStyles.flexRow}>
                <Image
                    source={require("@/assets/icons/map_pin2.png")}
                    style={UIStyles.mapPinIcon}
                />
                <View style={{ width: "83%" }}>
                    <CustomText fontFamily='Medium' numberOfLines={1} fontSize={12}>
                        {item?.title}
                    </CustomText>

                    <CustomText
                        fontFamily='Regular'
                        numberOfLines={1}
                        fontSize={10}
                        style={{ opacity: 0.7, marginTop: 2 }}
                    >
                        {item?.description}
                    </CustomText>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default LocationItem;
