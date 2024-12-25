import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { loginStyles } from "./Login.style";
import axios from 'axios';
import { router } from "expo-router";
import Constanst from "expo-constants";
import { Navigation } from "react-native-navigation";


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log("API URL:", Constanst.expoConfig?.extra?.API_URL);
    console.log("Email:", email);
    console.log("Password:", password);
    try {
      const response = await axios.post(`${Constanst.expoConfig?.extra?.API_URL}/auth/login`, {
        email: email,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.status) {
        const token = response.data.result.token;
        console.log('Login successful, token:', token);

        Alert.alert('Success', 'Login successful');
        router.push("/App"); // Điều hướng đến trang Task
      } else {
        Alert.alert('Error', response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'An error occurred while logging in');
    }
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
