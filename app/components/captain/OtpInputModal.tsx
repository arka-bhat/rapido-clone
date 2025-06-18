import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import React, { FC, memo, useRef, useState } from "react";
import { ModalStyles } from "@/styles/ModalStyles";
import { TextInput } from "react-native-gesture-handler";

interface OtpInputModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    onConfirm: (otp: string) => void;
}

const OtpInputModal: FC<OtpInputModalProps> = ({ onClose, onConfirm, title, visible }) => {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputs = useRef<Array<any>>([]);

    const handleOtpChange = (value: string, index: number) => {
        if (/^\d$/.test(value) || value === "") {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < inputs.current.length - 1) {
                inputs.current[index + 1].focus();
            }
            if (!value && index > 0) {
                inputs.current[index - 1].focus();
            }
        }
    };

    const handleConfirm = () => {
        const otpValue = otp.join("");
        if (otpValue.length === 4) {
            onConfirm(otpValue);
        } else {
            alert("Please enter a 4-digit OTP");
        }
    };

    return (
        <Modal
            animationType='slide'
            visible={visible}
            presentationStyle='formSheet'
            onRequestClose={onClose}
        >
            <View style={ModalStyles.modalContainer}>
                <Text style={ModalStyles.centerText}>{title}</Text>

                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputs.current[index] = ref)}
                            value={digit}
                            keyboardType='numeric'
                            onChangeText={(value) => handleOtpChange(value, index)}
                            style={styles.otpInput}
                            maxLength={1}
                        />
                    ))}
                </View>

                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 20,
    },
    otpInput: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: "#d3d3d3",
        textAlign: "center",
        fontSize: 18,
        borderRadius: 6,
    },
    confirmButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
        margin: 20,
    },
    confirmButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
export default memo(OtpInputModal);
