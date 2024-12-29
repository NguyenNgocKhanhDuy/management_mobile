import { Alert, Image, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { membersStyle } from "./Members.style";
import { UserInterface } from "@/interfaces/Interface";
import axios from "axios";
import debounce from "lodash.debounce";
import { Toast } from "toastify-react-native";
import Loading from "../Loading/Loading";
import Constanst from "expo-constants";
import { Colors } from "@/assets/Colors";

export default function Members(props: any) {
	const blackImg = require("@/assets/images/black.jpg");
	const idProject = "66ed28755d88dd7f163a5773";
	const token = "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJubmtkLmNvbSIsInN1YiI6IjIxMTMwMDM1QHN0LmhjbXVhZi5lZHUudm4iLCJleHAiOjE3MzU0NzQ4MzEsImN1c3RvbUNsYWltIjoiQ3VzdG9tIiwiaWF0IjoxNzM1NDcxMjMxfQ.riDUtxLCi73F7AdDLJca_scp_SEvT-r9fDvr9-AeC0x2l8l4uIoSPO34YU1HUJEBE0kIg2avfMHJAJLigHQTIQ";
	const [loading, setLoading] = useState(false);
	const debouncedSearchRef = useRef<any>(null);
	const [users, setUsers] = useState<UserInterface[]>([]);
	const [usersId, setUsersId] = useState<string[]>([]);
	const [pendingId, setPendingId] = useState<string[]>([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectUser, setSelectUser] = useState<UserInterface>();

	useEffect(() => {
		setLoading(true);
		handleGetProject();
	}, []);

	useEffect(() => {
		handleGetAllUsers();
	}, [usersId]);

	if (!debouncedSearchRef.current) {
		debouncedSearchRef.current = debounce((nextValue: string) => {
			if (nextValue.length > 0) {
				handleSearch(nextValue);
			} else {
				handleGetProject();
			}
		}, 300);
	}

	const handleSearch = async (email: string) => {
		try {
			const response = await axios.get(`${Constanst.expoConfig?.extra?.API_URL}/users/searchNotInProject`, {
				params: {
					email: email,
					idProject: idProject,
				},

				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const data = response.data;
			if (data.status) {
				setUsers(data.result);
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

	const handleOnChange = (text: string) => {
		debouncedSearchRef.current(text);
	};

	const handleGetProject = async () => {
		try {
			const response = await axios.get(`${Constanst.expoConfig?.extra?.API_URL}/projects/${idProject}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const data = response.data;
			if (data.status) {
				setUsersId(() => {
					return [data.result.creator, ...data.result.members, ...data.result.pending];
				});

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

	const handleGetAllUsers = async () => {
		if (usersId.length > 0) {
			const usersPromise = usersId.map((id: string) => handleGetUserById(id));
			const allUsers = await Promise.all(usersPromise);
			setUsers(allUsers);
		}
	};

	const handleGetUserById = async (id: string) => {
		try {
			const response = await axios.get(`${Constanst.expoConfig?.extra?.API_URL}/users/${id}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const data = response.data;
			if (data.status) {
				return data.result;
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

	const handleAddMember = async () => {
		setLoading(true);
		var updatePending;
		if (pendingId != null) {
			updatePending = [...pendingId, selectUser?.id];
		} else {
			updatePending = [selectUser?.id];
		}

		try {
			const response = await axios.put(
				`${Constanst.expoConfig?.extra?.API_URL}/projects/addUserIntoPending`,
				{
					id: idProject,
					pending: updatePending,
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
				handleGetProject();
				Toast.success("Mail sent successfully");
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

	return loading ? (
		<Loading />
	) : (
		<View style={membersStyle.container}>
			<View style={[membersStyle.topBar]}>
				<TouchableOpacity style={{ position: "absolute", left: 10 }}>
					<FontAwesome6 name="xmark" style={[membersStyle.icon, { color: "#fff", lineHeight: 60 }]} />
				</TouchableOpacity>
				<View style={{ marginHorizontal: "auto", transform: [{ translateX: -12 }] }}>
					<Text style={membersStyle.title}>Members</Text>
				</View>
			</View>
			<View style={{ marginTop: 80 }}>
				<TextInput style={membersStyle.input} placeholder="Enter Email" onChangeText={handleOnChange} />
				<ScrollView style={{ marginTop: 30 }}>
					{users.map((u) => (
						<TouchableOpacity
							key={u.id}
							onPress={() => {
								setSelectUser(u);
								setModalVisible(!modalVisible);
							}}
							style={[membersStyle.flexRowLayout, membersStyle.box]}
						>
							<View style={[membersStyle.flexRowItem]}>
								<Image source={u?.avatar ? { uri: u.avatar } : blackImg} style={membersStyle.image} />
								<View>
									<Text style={membersStyle.text}>{u.username}</Text>
									<Text style={membersStyle.text}>{u.email}</Text>
								</View>
							</View>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>
			{modalVisible ? (
				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => {
						Alert.alert("Modal has been closed.");
						setModalVisible(!modalVisible);
					}}
				>
					<View style={membersStyle.centeredView}>
						<View style={membersStyle.modalView}>
							<Text style={membersStyle.modalText}>Information</Text>
							<View>
								<Image source={selectUser?.avatar ? { uri: selectUser.avatar } : blackImg} style={membersStyle.modalImage} />
								<Text style={membersStyle.modalText}>{selectUser?.username}</Text>
								<Text style={membersStyle.modalText}>{selectUser?.username}</Text>
							</View>
							<View style={[membersStyle.flexRowLayout, { gap: 60, marginTop: 30 }]}>
								<Pressable style={[membersStyle.button, { backgroundColor: Colors.lightGreen }]} onPress={handleAddMember}>
									<Text style={membersStyle.textStyle}>Invite</Text>
								</Pressable>
								<Pressable style={[membersStyle.button, { backgroundColor: Colors.lightGrey }]} onPress={() => setModalVisible(!modalVisible)}>
									<Text style={membersStyle.textStyle}>Close</Text>
								</Pressable>
							</View>
						</View>
					</View>
				</Modal>
			) : (
				""
			)}
		</View>
	);
}
