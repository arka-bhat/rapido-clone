import React, { FC } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "./CustomText";
import { PhoneInputProps } from "@/utils/Types";

const PhoneInput: FC<PhoneInputProps> = ({ value, onChangeText, onBlur, onFocus }) => {
    return (
        <View style={styles.container}>
            <CustomText fontFamily='Medium' style={styles.text}>
                🇮🇳 +91
            </CustomText>
            <TextInput
                placeholder='0000000000'
                keyboardType='phone-pad'
                maxLength={10}
                value={value}
                onChangeText={onChangeText}
                onFocus={onFocus}
                onBlur={onBlur}
                style={styles.input}
                placeholderTextColor={"#ccc"}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginVertical: 15,
        borderWidth: 1,
        borderColor: "#222",
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    input: {
        fontSize: RFValue(13),
        fontFamily: "Medium",
        height: 45,
        width: "90%",
    },
    text: {
        fontSize: RFValue(13),
        fontFamily: "Medium",
        top: -1,
    },
});

export default PhoneInput;
