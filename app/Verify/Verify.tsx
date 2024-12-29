
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { verifyStyles } from "./Verify.style";
import axios from "axios";
import Constanst from "expo-constants";

export default function VerifyEmailScreen() {
  const [code, setCode] = useState(["", "", "", "", "", ""]); // Lưu giá trị của các ô nhập
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [isResending, setIsResending] = useState(false); // Trạng thái gửi lại mã

  const handleChangeText = (text: string, index: number) => {
     // Kiểm tra nếu ký tự nhập vào không phải số
    if (!/^\d$/.test(text)) {
    return; // Bỏ qua nếu không phải số
    }
    const updatedCode = [...code];
    updatedCode[index] = text;

    if (text && index < 5) {
      // Nếu có nhập số, chuyển con trỏ sang ô tiếp theo
      inputRefs.current[index + 1]?.focus();
    }

    setCode(updatedCode); // Cập nhật giá trị
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace") {
      const updatedCode = [...code];

      if (code[index] === "" && index > 0) {
        // Nếu ô hiện tại trống và người dùng nhấn Backspace, quay lại ô trước đó
        updatedCode[index - 1] = ""; // Xóa giá trị ô trước đó
        inputRefs.current[index - 1]?.focus();
      } else {
        // Nếu ô hiện tại có giá trị, xóa giá trị tại ô đó
        updatedCode[index] = "";
      }

      setCode(updatedCode); // Cập nhật giá trị
    }
  };

 
  const handleResendCode = async () => {
    setIsResending(true); // Đặt trạng thái gửi lại mã
    try {
      const response = await axios.post(
        `${Constanst.expoConfig?.extra?.API_URL}/users/sendCodeToUser`, // Endpoint phù hợp
        {
          email: "hoangson145juzk@gmail.com", // Thay thế bằng email người dùng thực tế
        }
      );
  
      if (response.data.status) {
        Alert.alert("Success", response.data.result || "Verification code resent successfully!"); // Thông báo từ API
      } else {
        Alert.alert("Error", "Failed to resend code."); // Thông báo lỗi nếu `status` là `false`
      }
    } catch (error) {
      console.error("Error resending code:", error);
      Alert.alert("Error", "An error occurred while resending the code."); // Xử lý lỗi kết nối hoặc server
    } finally {
      setIsResending(false); // Kết thúc trạng thái gửi lại mã
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");
    console.log("Verification code entered:", verificationCode);

    if (verificationCode.length !== 6) {
      Alert.alert("Error", "Please enter a complete 6-digit code.");
      return;
    }

    try {
      const response = await axios.post(
        `${Constanst.expoConfig?.extra?.API_URL}/users/verifyCode`,
        {
          email: "hoangson145juzk@gmail.com", // Email cần xác minh
          code: verificationCode, // Mã xác thực người dùng nhập
        }
      );
  
      // Kiểm tra kết quả trả về từ API
      const { status, result } = response.data;
  
      if (status && result.valid) {
        Alert.alert("Success", "Email verified successfully!"); // Xác thực thành công
        // Thực hiện điều hướng hoặc các thao tác khác nếu cần
      } else {
        Alert.alert("Error", "Invalid verification code. Please try again."); // Mã xác thực không hợp lệ
      }
    } catch (error) {
      console.error("Error during verification:", error);
      Alert.alert("Error", "An error occurred while verifying the code."); // Lỗi kết nối hoặc server
    }
  };

  return (
    <KeyboardAvoidingView style={verifyStyles.container} behavior="padding">
      <Text style={verifyStyles.title}>Verify Email</Text>
      <Text style={verifyStyles.subtitle}>
        We've sent a code to ******@gmail.com.{"\n"}Please check and input code
        to verify your email.
      </Text>
      <View style={verifyStyles.inputContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)} // Gán ref cho từng TextInput
            value={digit}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={({ nativeEvent }) =>
              handleKeyPress(nativeEvent.key, index)
            }
            style={verifyStyles.input}
            keyboardType="number-pad"
            maxLength={1}
          />
        ))}
      </View>
      <TouchableOpacity style={verifyStyles.verifyButton} onPress={handleVerify}>
        <Text style={verifyStyles.verifyButtonText}>VERIFY</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleResendCode}>
        <Text style={verifyStyles.resendText}>
          Don't receive code? <Text style={verifyStyles.resendLink}>Resend Code</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

