import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { loginStyles } from "./Login.style";
import { router } from "expo-router";
import axios from 'axios';
import Constanst from "expo-constants";


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
        router.push({
          pathname: '/App',
          params: { token: token },
        });; 
      } else {
        Alert.alert('Error', response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'Wrong email or password. Please try again !!!');
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
        <TouchableOpacity
     onPress={() => {
      router.push("/Register/Register");
    }}
  >
          <Text style={loginStyles.footerText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
