import { FontAwesome6 } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Pressable } from "react-native";
import { Toast } from "toastify-react-native";
import Loading from "../Loading/Loading";
import Constanst from "expo-constants";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

type Invitation = {
	id: string;
	title: string;
};

type Item = {
	id: string;
	name: string;
};

export default function InvitationScreen() {
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedInvitation, setSelectedInvitation] = useState<Invitation>();
	const [invitations, setInvitations] = useState<Invitation[]>([]);
	const [loading, setLoading] = useState(false);
	const token = useSelector((state: RootState) => state.user.token);

	const handlePress = (item: Invitation) => {
		setSelectedInvitation(item);
		setModalVisible(true);
	};

	useEffect(() => {
		handleGetInvitation();
	}, []);

	const handleGetInvitation = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${Constanst.expoConfig?.extra?.API_URL}/projects/projectHasPendingUser`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const data = response.data;
			if (data.status) {
				console.log(data.result);

				const invitations = data.result.map((item: Item) => ({
					id: item.id,
					title: item.name,
				}));

				setInvitations(invitations);

				setLoading(false);
			}
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

			setLoading(false);
		}
	};

	const handleAccept = async () => {
		try {
			const response = await axios.put(
				`${Constanst.expoConfig?.extra?.API_URL}/projects/userAcceptPending`,
				{
					id: selectedInvitation?.id,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const data = response.data;
			if (data.status) {
				console.log(data.result);
				setInvitations((prev) => prev.filter((i) => i.id != selectedInvitation?.id));
				Toast.success("Accept the invitation successfully");
				setModalVisible(false);
			}
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

	const handleReject = async () => {
		try {
			const response = await axios.put(
				`${Constanst.expoConfig?.extra?.API_URL}/projects/userRejectPending`,
				{
					id: selectedInvitation?.id,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const data = response.data;
			if (data.status) {
				console.log(data.result);
				setInvitations((prev) => prev.filter((i) => i.id != selectedInvitation?.id));
				Toast.success("Reject the invitation successfully");
				setModalVisible(false);
			}
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

	return loading ? (
		<Loading />
	) : (
		<View style={styles.container}>
			<Text style={styles.title}>Invitation</Text>
			<FlatList
				data={invitations}
				keyExtractor={(item) => item.id}
				renderItem={({ item }: { item: Invitation }) => (
					<TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
						<Text style={styles.cardText}>{item.title}</Text>
					</TouchableOpacity>
				)}
			/>

			<Modal visible={modalVisible} transparent={true} animationType="slide" onRequestClose={() => setModalVisible(false)}>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
							<FontAwesome6 name="xmark" style={{ fontSize: 20 }} />
						</TouchableOpacity>
						<Text style={styles.modalTitle}>{selectedInvitation ? `Invitation to ${selectedInvitation.title}` : ""}</Text>
						<View style={styles.buttonContainer}>
							<Pressable style={[styles.button, styles.acceptButton]} onPress={handleAccept}>
								<Text style={styles.buttonText}>Accept</Text>
							</Pressable>
							<Pressable style={[styles.button, styles.rejectButton]} onPress={handleReject}>
								<Text style={styles.buttonText}>Reject</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#f5f5f5",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
	},
	card: {
		backgroundColor: "#fff",
		padding: 15,
		borderRadius: 8,
		marginBottom: 10,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	cardText: {
		fontSize: 16,
		color: "#333",
	},
	closeBtn: {
		position: "absolute",
		top: 10,
		right: 10,
		color: "#000",
		padding: 10,
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: "80%",
		backgroundColor: "#fff",
		padding: 30,
		borderRadius: 10,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 5,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 20,
		marginTop: 30,
		textAlign: "center",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		marginTop: 20,
	},
	button: {
		flex: 1,
		paddingVertical: 10,
		marginHorizontal: 10,
		borderRadius: 20,
		alignItems: "center",
	},
	acceptButton: {
		backgroundColor: "#70be74", // Màu xanh nhạt
	},
	rejectButton: {
		backgroundColor: "#e55858", // Màu đỏ nhạt
	},
	buttonText: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#fff",
	},
});
