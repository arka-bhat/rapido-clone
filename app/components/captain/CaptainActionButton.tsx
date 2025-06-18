import { View, Text } from "react-native";
import React, { FC } from "react";
import { Ionicons } from "@expo/vector-icons";
import { RideStyles } from "@/styles/RideStyles";
import { CommonStyles } from "@/styles/CommonStyles";
import CustomText from "../shared/CustomText";
import { orderStyles } from "@/styles/CaptainStyles";
import SwipeButton from "rn-swipe-button";
import { RFValue } from "react-native-responsive-fontsize";

interface CaptainActionButtonProps {
    rideData: any;
    color?: string;
    title: string;
    onPress: () => void;
}

const CaptainActionButton: FC<CaptainActionButtonProps> = ({ rideData, color, title, onPress }) => {
    const CheckoutButton = () => (
        <Ionicons name='arrow-forward-sharp' style={{ bottom: 2 }} size={32} color='#fff' />
    );
    return (
        <View style={RideStyles.swipeableContaninerCaptain}>
            <View style={CommonStyles.flexRowBetween}>
                <CustomText
                    fontSize={11}
                    style={{ marginTop: 10, marginBottom: 3 }}
                    numberOfLines={1}
                    fontFamily='Medium'
                >
                    Meet the customer
                </CustomText>
                <CustomText
                    fontSize={11}
                    style={{ marginTop: 10, marginBottom: 3 }}
                    numberOfLines={1}
                    fontFamily='Medium'
                >
                    +91{" "}
                    {rideData?.customer?.phone &&
                        rideData?.customer?.phone?.slice(0, 5) +
                            " " +
                            rideData?.customer?.phone?.slice(0, 5)}
                </CustomText>
            </View>

            <View style={orderStyles.flexRowBase}>
                <View>
                    <View style={orderStyles.pickupHollowCircle} />
                    <View style={orderStyles.continuousLine} />
                </View>
                <View style={orderStyles.infoText}>
                    <CustomText fontSize={11} numberOfLines={1} fontFamily='SemiBold'>
                        {rideData?.pickup?.address?.slice(0, 10)}
                    </CustomText>
                    <CustomText fontSize={9.5} numberOfLines={2} fontFamily='Medium'>
                        {rideData?.pickup?.address}
                    </CustomText>
                </View>
            </View>

            <View style={orderStyles.flexRowBase}>
                <View style={orderStyles.dropHollowCircle} />
                <View style={orderStyles.infoText}>
                    <CustomText fontSize={11} numberOfLines={1} fontFamily='SemiBold'>
                        {rideData?.drop?.address?.slice(0, 10)}
                    </CustomText>
                    <CustomText fontSize={9.5} numberOfLines={2} fontFamily='Medium'>
                        {rideData?.drop?.address}
                    </CustomText>
                </View>
            </View>

            <SwipeButton
                title={title.toUpperCase()}
                containerStyles={RideStyles.swipeButtonContainer}
                height={30}
                shouldResetAfterSuccess={true}
                resetAfterSuccessAnimDelay={200}
                onSwipeSuccess={onPress}
                railBackgroundColor={color}
                railStyles={RideStyles.railStyles}
                railBorderColor='transparent'
                railFillBackgroundColor='rgba(255,255,255,0.6)'
                railFillBorderColor='rgba(255,255,255,0.6)'
                titleColor='#fff'
                titleFontSize={RFValue(13)}
                titleStyles={RideStyles.titleStyles}
                thumbIconComponent={CheckoutButton}
                thumbIconStyles={RideStyles.thumbIconStyles}
                thumbIconBackgroundColor='transparent'
                thumbIconBorderColor='transparent'
                thumbIconHeight={50}
                thumbIconWidth={60}
            />
        </View>
    );
};

export default CaptainActionButton;
