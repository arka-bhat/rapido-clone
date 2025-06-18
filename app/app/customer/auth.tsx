import {
    View,
    Text,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { signIn } from "@/services/authService";
import { useWS } from "@/services/WSProvider";
import { AuthStyles } from "@/styles/AuthStyles";
import { CommonStyles } from "@/styles/CommonStyles";
import CustomText from "@/components/shared/CustomText";
import PhoneInput from "@/components/shared/PhoneInput";
import CustomButton from "@/components/shared/CustomButton";

import logoT from "@/assets/images/logo_t.png";

const Auth = () => {
    const { updateAccessToken } = useWS();
    const [phone, setPhone] = useState("");

    const handleNext = () => {
        if (!phone || phone.length !== 10) {
            Alert.alert("Please enter a valid number");
            return;
        }
        signIn({ role: "customer", phone }, updateAccessToken);
    };
    return (
        <SafeAreaView style={AuthStyles.container}>
            <ScrollView contentContainerStyle={AuthStyles.container}>
                <View style={CommonStyles.flexRowBetween}>
                    <Image source={logoT} style={AuthStyles.logo}></Image>
                    <TouchableOpacity style={AuthStyles.flexRowGap}>
                        <MaterialIcons name='help' size={18} color='grey' />
                        <CustomText>Help</CustomText>
                    </TouchableOpacity>
                </View>

                <CustomText fontFamily='Medium' variant='h6'>
                    What's your number
                </CustomText>
                <CustomText fontFamily='Regular' variant='h7' style={CommonStyles.lightText}>
                    Enter your number to proceed
                </CustomText>

                <PhoneInput onChangeText={setPhone} value={phone}></PhoneInput>
            </ScrollView>

            <View style={AuthStyles.footerContainer}>
                <CustomText
                    variant='h8'
                    fontFamily='Regular'
                    style={[CommonStyles.lightText, styles.footerText]}
                >
                    By continuing, you agree to the terms and privacy policy of Rapido
                </CustomText>
                <CustomButton title='Next' onPress={handleNext} loading={false} disabled={false} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    footerText: {
        textAlign: "center",
        marginHorizontal: 20,
    },
});

export default Auth;
