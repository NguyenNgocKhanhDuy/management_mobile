import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import { forgotPasswordStyles } from "./ForgotPassword.style";
import { router } from "expo-router";


export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Gửi mã, 2: Xác minh, 3: Đặt mật khẩu

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    try {
      const response = await axios.post(
        `${Constants.expoConfig?.extra?.API_URL}/users/sendCodeToUser`,
        { email }
      );

      if (response.data.status) {
        Alert.alert("Success", "Verification code sent to your email.");
        setStep(2); // Chuyển sang bước xác minh
      } else {
        Alert.alert("Error", response.data.message || "Failed to send code.");
      }
    } catch (error) {
      console.error("Error sending code:", error);
      Alert.alert("Error", "An error occurred while sending the code.");
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      Alert.alert("Error", "Please enter the verification code.");
      return;
    }

    try {
      const response = await axios.post(
        `${Constants.expoConfig?.extra?.API_URL}/users/verifyCode`,
        { email, code }
      );

      if (response.data.status && response.data.result.valid) {
        Alert.alert("Success", "Code verified successfully!");
        setStep(3); // Chuyển sang bước đặt mật khẩu
      } else {
        Alert.alert("Error", response.data.message || "Invalid code.");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      Alert.alert("Error", "An error occurred while verifying the code.");
    }
  };

  const handleResetPassword = async () => {
    if (!password) {
      Alert.alert("Error", "Please enter a new password.");
      return;
    }
  
    try {
      const response = await axios.put(
        `${Constants.expoConfig?.extra?.API_URL}/users/updatePassword`,
        {
          email, // Email đã nhập từ người dùng
          password, // Mật khẩu mới
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.status) {
        const { email, username, avatar } = response.data.result;
        console.log("Reset password success, redirecting...");
  
        Alert.alert(
          "Success",
          `Password updated successfully`,
          [
            {
              text: "OK",
              onPress: () => 
                // Điều hướng về trang login
                router.push("/Login/Login")
            },
          ]
        );
      } else {
        Alert.alert("Error", response.data.message || "Failed to reset password.");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 
        error.message || 
        "An unknown error occurred.";
    
      console.error("Error resetting password:", error.response || error);
      Alert.alert("Error", errorMessage);
    }
  };
  
  
  return (
    <View style={forgotPasswordStyles.container}>
      {step === 1 && (
        <>
          <Text style={forgotPasswordStyles.title}>Forgot Password</Text>
          <TextInput
            style={forgotPasswordStyles.input}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity style={forgotPasswordStyles.button} onPress={handleSendCode}>
            <Text style={forgotPasswordStyles.buttonText}>Send Code</Text>
          </TouchableOpacity>
        </>
      )}
      {step === 2 && (
        <>
          <Text style={forgotPasswordStyles.title}>Verify Code</Text>
          <TextInput
            style={forgotPasswordStyles.input}
            placeholder="Enter the code"
            placeholderTextColor="#888"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
          />
          <TouchableOpacity style={forgotPasswordStyles.button} onPress={handleVerifyCode}>
            <Text style={forgotPasswordStyles.buttonText}>Verify Code</Text>
          </TouchableOpacity>
        </>
      )}
      {step === 3 && (
        <>
          <Text style={forgotPasswordStyles.title}>Reset Password</Text>
          <TextInput
            style={forgotPasswordStyles.input}
            placeholder="Enter new password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={forgotPasswordStyles.button} onPress={handleResetPassword}>
            <Text style={forgotPasswordStyles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

