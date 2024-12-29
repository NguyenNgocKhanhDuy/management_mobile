import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "./Register.styles";
import axios from "axios";
import Constants from "expo-constants";
import { router } from "expo-router";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email.includes("@")) {
      Alert.alert("Validation Error", "Invalid email address");
    } else if (username.trim().length < 3) {
      Alert.alert("Validation Error", "Username must be at least 3 characters");
    } else if (password.trim().length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters");
    } else {
      try {
        const response = await axios.post(
          `${Constants.expoConfig?.extra?.API_URL}/users/register`,
          {
            email: email.trim(),
            username: username.trim(),
            password: password.trim(),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status) {
          Alert.alert(
            "Success",
            "Registration successful! Redirecting to Login.",
            [
              {
                text: "OK",
                onPress: () => router.push("/Login/Login"),
              },
            ]
          );
        } else {
          Alert.alert("Error", response.data.message || "Registration failed.");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        Alert.alert("Error", "An error occurred while registering.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Account</Text>
      <Text style={styles.subtitle}>Join us and start your journey today!</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>REGISTER</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>
        Already have an account?{" "}
        <Text
          style={styles.link}
          onPress={() => router.push("/Login/Login")}
        >
          Log in
        </Text>
      </Text>
    </View>
  );
}
