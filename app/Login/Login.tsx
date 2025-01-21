import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Button, Modal } from "react-native";
import { loginStyles } from "./Login.style";
import { router } from "expo-router";
import axios from "axios";
import Constanst from "expo-constants";
import { setToken } from "@/store/UserSlice";
import { useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Toast } from "toastify-react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { Colors } from "@/assets/Colors";
import Loading from "../Loading/Loading";
import ForgotPassword from "@/app/ForgotPassword/ForgotPassword";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();

	const [isScannerVisible, setIsScannerVisible] = useState(false);
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);

	useEffect(() => {
		(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	const handleLogin = async () => {
		setLoading(true);
		console.log("API URL:", Constanst.expoConfig?.extra?.API_URL);
		console.log("Email:", email);
		console.log("Password:", password);
		try {
			const response = await axios.post(
				`${Constanst.expoConfig?.extra?.API_URL}/auth/login`,
				{
					email: email,
					password: password,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			if (response.data.status) {
				const token = response.data.result.token;
				dispatch(setToken(token));
				console.log("Login successful, token:", token);
				setLoading(false);
				router.push({
					pathname: "/App",
					params: { token: token },
				});
			} else {
				Alert.alert("Error", response.data.message || "Login failed");
			}
		} catch (error) {
			console.error("Error during login:", error);
			Alert.alert("Error", "Wrong email or password. Please try again !!!");
			setLoading(false);
		}
	};

	const pickImage = async () => {
		setIsScannerVisible(false);
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			scanQRCodeFromImage(result.assets[0].uri);
		} else {
			setIsScannerVisible(true);
		}
	};

	const scanQRCodeFromImage = async (uri: string) => {
		try {
			const result = await BarCodeScanner.scanFromURLAsync(uri);
			if (result && result.length > 0) {
				const qrData = result[0].data;
				Toast.success("Login successful");
				dispatch(setToken(qrData));

				router.push({
					pathname: "/App",
					params: { token: qrData },
				});
			} else {
				Toast.error("No QR Code found in the image");
			}
		} catch (error) {
			console.error("Error scanning QR code from image:", error);
			Toast.error("Failed to scan QR code from image");
		}
	};

	const handleQrCodeScan = ({ type, data }: { type: string; data: string }) => {
		setIsScannerVisible(false);
		Toast.success("Login successful");
		dispatch(setToken(data));
		router.push({
			pathname: "/App",
			params: { token: data },
			
		});

	};

	if (hasPermission === null) {
		return <Text>Requesting for camera permission</Text>;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}

	return (
		<View style={loginStyles.container}>
			<Text style={loginStyles.welcomeText}>Welcome back!</Text>
			<Text style={loginStyles.subText}>We're glad to see you again!</Text>

			<TextInput style={loginStyles.input} placeholder="Email" placeholderTextColor="#888" value={email} onChangeText={setEmail} keyboardType="email-address" />

			<TextInput style={loginStyles.input} placeholder="Password" placeholderTextColor="#888" value={password} onChangeText={setPassword} secureTextEntry />

			<TouchableOpacity style={loginStyles.loginButton} onPress={handleLogin}>
				<Text style={loginStyles.buttonText}>LOGIN</Text>
			</TouchableOpacity>

			<View style={loginStyles.footer}>
				<TouchableOpacity
					onPress={() => {
						router.push("/ForgotPassword/ForgotPassword");
					}}
				>
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

			<TouchableOpacity style={loginStyles.flexItem} onPress={() => setIsScannerVisible(true)}>
				<Text style={loginStyles.footerText}>Scan QR code to login</Text>
				<FontAwesome6 name="qrcode" style={{ fontSize: 16, color: Colors.green }} />
			</TouchableOpacity>

			<Modal visible={isScannerVisible} transparent={false} animationType="slide">
				<BarCodeScanner onBarCodeScanned={handleQrCodeScan} style={StyleSheet.absoluteFillObject} />
				<TouchableOpacity style={loginStyles.cancelButton} onPress={() => setIsScannerVisible(false)}>
					{/* <Text style={loginStyles.cancelButtonText}>Cancel</Text> */}
					<FontAwesome6 name="xmark" style={{ fontSize: 30 }} />
				</TouchableOpacity>

				<TouchableOpacity onPress={pickImage} style={loginStyles.selectImg}>
					<FontAwesome6 name="image" style={{ fontSize: 30 }} />
				</TouchableOpacity>
			</Modal>

			{loading ? <Loading /> : ""}
		</View>
	);
}
