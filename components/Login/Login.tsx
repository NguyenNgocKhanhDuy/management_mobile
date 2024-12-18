import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { loginStyles } from "./Login.style";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Thêm logic xử lý đăng nhập tại đây
    console.log("Logging in with", email, password);
  };

  return (
    <View style={loginStyles.container}>
      <Text style={loginStyles.welcomeText}>Welcome back!</Text>
      <Text style={loginStyles.subText}>We're glad to see you again!</Text>

      <TextInput
        style={loginStyles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={loginStyles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={loginStyles.loginButton} onPress={handleLogin}>
        <Text style={loginStyles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      <View style={loginStyles.footer}>
        <TouchableOpacity>
          <Text style={loginStyles.footerText}>Forgot Password?</Text>
        </TouchableOpacity>
        <Text style={loginStyles.footerText}> | </Text>
        <TouchableOpacity>
          <Text style={loginStyles.footerText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
