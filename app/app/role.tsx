import { Image, View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import React from "react";
import CustomText from "@/components/shared/CustomText";
import { RoleStyles } from "@/styles/RoleStyles";

import logoT from "@/assets/images/logo_t.png";
import customerImg from "@/assets/images/customer.png";
import captainImg from "@/assets/images/captain.png";
import { router } from "expo-router";

const role = () => {
    const handleCustomerPress = () => {
        router.navigate("/customer/auth");
    };

    const handleCaptainPress = () => {
        router.navigate("/captain/auth");
    };

    return (
        <SafeAreaView style={RoleStyles.container}>
            <Image source={logoT} style={RoleStyles.logo} />
            <CustomText fontFamily='Medium' variant='h6'>
                Choose your user type
            </CustomText>
            <TouchableOpacity style={RoleStyles.card} onPress={handleCustomerPress}>
                <Image source={customerImg} style={RoleStyles.image} />
                <View style={RoleStyles.cardContent}>
                    <CustomText style={RoleStyles.title}>Customer</CustomText>
                    <CustomText style={RoleStyles.description}>Order rides easily</CustomText>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={RoleStyles.card} onPress={handleCaptainPress}>
                <Image source={captainImg} style={RoleStyles.image} />
                <View style={RoleStyles.cardContent}>
                    <CustomText style={RoleStyles.title}>Captain</CustomText>
                    <CustomText style={RoleStyles.description}>
                        Join us to drive and deliver
                    </CustomText>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default role;
