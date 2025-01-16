import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker"; // Make sure to install `expo-image-picker`
import styles from "./Profile.style";
import { Toast } from "toastify-react-native";
import axios from "axios";
import Constanst from "expo-constants";
import store, { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { TextInput, StyleSheet, Button } from "react-native";
import { storage } from "../firebase/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
const Profile = () => {
	const blackImg = require("../../assets/images/b1.jpg");
	const token = useSelector((state: RootState) => state.user.token);
	console.log("Kết quả trả về:", token);
	const [email, setEmail] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [NewUserName, setNewUserName] = useState("");

	const [username, setUsername] = useState<string | null>(null);
	const [userMail, setUserMail] = useState<string | null>(null);
	const [avatar, setAvatar] = useState<string | null>(null);

	const [NewUserAvatar, setNewUserAvatar] = useState("");
	const [loading, setLoading] = useState(false);

	const uploadImageToFirebase = async () => {
		try {
			const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (!permissionResult.granted) {
				throw new Error("Permission denied. You need to allow media access.");
			}

			const result = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				quality: 1,
			});

			if (result.canceled) {
				throw new Error("Image selection cancelled.");
			}

			// Lấy URI của ảnh được chọn
			const imageUri = result.assets[0].uri;
			const fileName = imageUri.split("/").pop();

			// Đọc file và convert sang blob
			const response = await fetch(imageUri);
			const blob = await response.blob();

			const storageRef = ref(storage, `images/${fileName}`);

			// Start uploading the file
			const uploadTask = uploadBytesResumable(storageRef, blob);
			// Gửi ảnh lên Firebase Storage
			//   const firebaseStorageUrl = `https://firebasestorage.googleapis.com/v0/b/management-71234.appspot.com/o/${fileName}`;
			//   const storageUrl = `https://firebasestorage.googleapis.com/v0/b/management-71234.appspot.com/o?name=images/${fileName}`;

			// Trả về Promise để theo dõi quá trình upload
			return new Promise((resolve, reject) => {
				uploadTask.on(
					"state_changed",
					(snapshot) => {
						// Xử lý tiến trình upload
						const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						console.log(`Uploading: ${progress}%`);
					},
					(error) => {
						// Xử lý lỗi
						console.error("Upload failed:", error);
						reject("Upload failed");
					},
					async () => {
						// Sau khi upload xong, lấy download URL
						try {
							const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
							console.log("File available at:", downloadUrl);
							resolve(downloadUrl); // Resolve Promise với URL tải xuống
						} catch (error) {
							reject("Error getting download URL");
						}
					}
				);
			});
		} catch (error) {
			console.error("Error uploading image:", error);
			throw error;
		}
	};

	const handleGetUserName = async () => {
		try {
			const response = await axios.get(`${Constanst.expoConfig?.extra?.API_URL}/users/user`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			//const data = response.data;
			if (response.data?.status && response.data.result?.username) {
				console.log("Kết quả trả về:", username);
				return response.data.result.username;
			}
			//	console.log('Kết quả trả về:', response.data.username);
		} catch (error: any) {
			if (error.response) {
				console.error("Error:", error.response.data.message || error.response.data.error);
				Toast.error(error.response.data.message || error.response.data.error);
			} else if (error.request) {
				console.error("Error:", error.request);
				Toast.error("Failed to connect to server.");
			} else {
				console.error("Error:", error.message);
				Toast.error("An unexpected error occurred: " + error.message);
			}
		}
	};
	const handleGetAvatar = async () => {
		try {
			const response = await axios.get(`${Constanst.expoConfig?.extra?.API_URL}/users/user`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			//const data = response.data;
			if (response.data?.status && response.data.result?.avatar) {
				console.log("Kết quả trả về:", avatar);
				return response.data.result.avatar;
			}
			//	console.log('Kết quả trả về:', response.data.username);
		} catch (error: any) {
			if (error.response) {
				console.error("Error:", error.response.data.message || error.response.data.error);
				Toast.error(error.response.data.message || error.response.data.error);
			} else if (error.request) {
				console.error("Error:", error.request);
				Toast.error("Failed to connect to server.");
			} else {
				console.error("Error:", error.message);
				Toast.error("An unexpected error occurred: " + error.message);
			}
		}
	};
	const handleGetEmail = async () => {
		try {
			const response = await axios.get(`${Constanst.expoConfig?.extra?.API_URL}/users/user`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			//const data = response.data;
			if (response.data?.status && response.data.result?.email) {
				console.log("Kết quả trả về:", email);
				return response.data.result.email;
			}
			//	console.log('Kết quả trả về:', response.data.username);
		} catch (error: any) {
			if (error.response) {
				console.error("Error:", error.response.data.message || error.response.data.error);
				Toast.error(error.response.data.message || error.response.data.error);
			} else if (error.request) {
				console.error("Error:", error.request);
				Toast.error("Failed to connect to server.");
			} else {
				console.error("Error:", error.message);
				Toast.error("An unexpected error occurred: " + error.message);
			}
		}
	};
	useEffect(() => {
		// Gọi API lấy username khi vào màn hình
		const fetchUsername = async () => {
			const fetchedUsername = await handleGetUserName();
			setUsername(fetchedUsername); // Cập nhật state
		};
		const fetchAvatar = async () => {
			const fetchedAvatar = await handleGetAvatar();
			setAvatar(fetchedAvatar);
		};
		const fetchMail = async () => {
			const fetchedMail = await handleGetEmail();
			setUserMail(fetchedMail);
		};

		fetchMail();
		fetchAvatar();
		fetchUsername();
	}, []);

	const handleUpdateUserName = async () => {
		if (!NewUserName.trim()) {
			Alert.alert("Error", "hãy nhập userName mới ! ");
			return;
		}
		setIsLoading(true);
		try {
			const response = await axios.put(
				`${Constanst.expoConfig?.extra?.API_URL}/users/updateUsername`,
				{ username: NewUserName.trim() },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (response.data.status) {
				Alert.alert("Success", "UserName cập nhật thành công");
				setNewUserName("");
			} else {
				Alert.alert("Error", response.data.message || "lỗi khi cập nhật userName");
			}
			console.log("Kết quả trả về:", response.data);
		} catch (error) {
			console.error("lỗi cập nhật thất bại:", error);
			Alert.alert("lỗi", "thất bại");
		} finally {
			setIsLoading(false);
		}
		setTimeout(() => {
			setIsLoading(false);
		}, 3000);
	};

	const handleUpdatePassword = async () => {
		if (!email || !newPassword) {
			Alert.alert("Error", "Please fill in both email and new password");
			return;
		}

		setIsLoading(true);
		try {
			const response = await axios.put(
				`${Constanst.expoConfig?.extra?.API_URL}/users/updatePassword`,
				{ email: email, password: newPassword },
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (response.data.status) {
				Alert.alert("Success", "Password updated successfully");
				setEmail("");
				setNewPassword("");
			} else {
				Alert.alert("Error", response.data.message || "Failed to update password");
			}
		} catch (error) {
			console.error("Error updating password:", error);
			Alert.alert("Error", "FaildFaild");
		} finally {
			setIsLoading(false);
		}
		setTimeout(() => {
			setIsLoading(false);
		}, 3000);
	};
	const handleUpload = async () => {
		try {
			setLoading(true);
			const imageUrl = await uploadImageToFirebase();
			handleUpdateAvatar(imageUrl as string); // Gọi hàm cập nhật avatar
			Alert.alert("Success", "Avatar updated successfully!");
		} catch (error) {
			Alert.alert("Error", "Something went wrong.");
		} finally {
			setLoading(false);
		}
	};
	const handleUpdateAvatar = async (NewUserAvatar: string) => {
		// if (!NewUserAvatar.trim()) {
		//    // Alert.alert('Error', 'hãy nhập userName mới ! ');
		//     return;
		//   }
		setIsLoading(true);
		try {
			const response = await axios.put(
				`${Constanst.expoConfig?.extra?.API_URL}/users/updateAvatar`,
				{ avatar: NewUserAvatar.trim() },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (response.data.status) {
				Alert.alert("Success", "avatar cập nhật thành công");
				setAvatar("");
			} else {
				Alert.alert("Error", response.data.message || "lỗi khi cập nhật avatar");
			}
			console.log("Kết quả trả về:", response.data);
		} catch (error) {
			console.error("lỗi cập nhật thất bại:", error);
			Alert.alert("lỗi", "thất bại");
		} finally {
			setIsLoading(false);
		}
		setTimeout(() => {
			setIsLoading(false);
		}, 3000);
	};
	return (
		<ScrollView style={styles.container}>
			<View style={styles.container}>
				<View style={styles.profileSection}>
					<View style={styles.avatarContainer}>
						<View style={{ marginTop: 30 }}>
							<Image source={avatar ? { uri: avatar } : blackImg} style={styles.profileImage} />
						</View>
					</View>
					<Text style={styles.nameText}>{username || "loading..."}</Text>
					<Text style={styles.usernameText}>@{username || "loading..."}</Text>
					<Text style={styles.emailText}>{userMail || "loading..."}</Text>
					<Text style={styles.memberText}>Là thành viên Trello từ tháng 3 năm 2024</Text>
				</View>
				{/* Container cho ảnh đại diện */}
				<View style={styles.profileImageContainer}>{isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : <Button title="Thay đổi Avatar" onPress={handleUpload} color={"#3D4135"} />}</View>

				{/* Container cho chức năng đổi mật khẩu */}
				<View style={styles.changePasswordContainer}>
					<Text style={styles.header}>Thay đổi mật khẩu </Text>
					<View style={{ padding: 20 }}>
						<Text style={styles.Text}>Nhập địa chỉ Email tài khoản này :</Text>
						<TextInput style={styles.input} placeholder="Enter your email" placeholderTextColor="#888" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
						<Text style={styles.Text}>Nhập mật khẩu mới cho tài khoản :</Text>

						<TextInput style={styles.input} placeholderTextColor="#888" placeholder="New Password" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
						{isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : <Button title="Cập Nhật" onPress={handleUpdatePassword} color={"#3D4135"} />}
					</View>
				</View>
				<View style={styles.changePasswordContainer}>
					<Text style={styles.header}>Thay đổi username </Text>
					<View style={{ padding: 20 }}>
						<Text style={styles.Text}>Nhập username mới :</Text>
						<TextInput style={styles.input} placeholderTextColor="#888" placeholder="New username" value={NewUserName} onChangeText={setNewUserName} keyboardType="default" autoCapitalize="none" />
						{isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : <Button title="Cập Nhật" onPress={handleUpdateUserName} color={"#3D4135"} />}
					</View>
				</View>
			</View>
		</ScrollView>
	);
};
export default Profile;
