
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { registerStyles } from "./Register.style";

export default function VerifyEmailScreen() {
  const [code, setCode] = useState(["", "", "", "", "", ""]); // Lưu giá trị của các ô nhập
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleChangeText = (text: string, index: number) => {
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

  const handleResendCode = () => {
    // Xử lý gửi lại mã xác thực
    alert("Code resent!");
  };

  const handleVerify = () => {
    // Xử lý khi nhấn nút VERIFY
    alert(`Code entered: ${code.join("")}`);
  };

  return (
    <KeyboardAvoidingView style={registerStyles.container} behavior="padding">
      <Text style={registerStyles.title}>Verify Email</Text>
      <Text style={registerStyles.subtitle}>
        We've sent a code to ******@gmail.com.{"\n"}Please check and input code
        to verify your email.
      </Text>
      <View style={registerStyles.inputContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)} // Gán ref cho từng TextInput
            value={digit}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={({ nativeEvent }) =>
              handleKeyPress(nativeEvent.key, index)
            }
            style={registerStyles.input}
            keyboardType="number-pad"
            maxLength={1}
          />
        ))}
      </View>
      <TouchableOpacity style={registerStyles.verifyButton} onPress={handleVerify}>
        <Text style={registerStyles.verifyButtonText}>VERIFY</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleResendCode}>
        <Text style={registerStyles.resendText}>
          Don't receive code? <Text style={registerStyles.resendLink}>Resend Code</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

