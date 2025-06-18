import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import React, { FC } from "react";
import { Colors } from "@/utils/Constants";
import CustomText from "./CustomText";
import { RFValue } from "react-native-responsive-fontsize";
import { CustomButtonProps } from "@/utils/Types";

const CustomButton: FC<CustomButtonProps> = ({ title, disabled, loading, onPress }) => {
    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            activeOpacity={0.8}
            style={[
                styles.container,
                { backgroundColor: disabled ? Colors.secondary : Colors.primary },
            ]}
        >
            {loading ? (
                <ActivityIndicator color={Colors.text} size='small' />
            ) : (
                <CustomText
                    fontFamily='SemiBold'
                    style={{ fontSize: RFValue(12), color: disabled ? "#fff" : Colors.text }}
                >
                    {title}
                </CustomText>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        margin: 10,
        padding: 10,
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
});

export default CustomButton;
