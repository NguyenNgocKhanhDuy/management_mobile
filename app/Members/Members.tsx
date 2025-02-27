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
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { router } from "expo-router";

export default function Members() {
	const blackImg = require("@/assets/images/black.jpg");
	// const idProject = "66ed28755d88dd7f163a5773";
	const idProject = useSelector((state: RootState) => state.task.idProject);
	// const token = "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJubmtkLmNvbSIsInN1YiI6IjIxMTMwMDM1QHN0LmhjbXVhZi5lZHUudm4iLCJleHAiOjE3MzU0Nzg5ODAsImN1c3RvbUNsYWltIjoiQ3VzdG9tIiwiaWF0IjoxNzM1NDc1MzgwfQ.QfWM8zia7XJvsYJHGu3nNj3A5WWuEzUEEMogmJmI8sl2L1gHu8Ao6IBvY_pfkMaPbrHnjs5x-56g7HzGkB_zzg";
	const token = useSelector((state: RootState) => state.user.token);
	const [loading, setLoading] = useState(false);
	const debouncedSearchRef = useRef<any>(null);
	const [users, setUsers] = useState<UserInterface[]>([]);
	const [usersId, setUsersId] = useState<string[]>([]);
	const [pendingId, setPendingId] = useState<string[]>([]);
	const [membersId, setMembersId] = useState<string[]>([]);
	const [creatorId, setCreatorId] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
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
					return [data.result.creator];
				});

				if (data.result.members) {
					setUsersId((prevValue) => {
						return [...prevValue, ...data.result.members];
					});
					setMembersId(data.result.members);
				}

				if (data.result.pending) {
					setUsersId((prevValue) => {
						return [...prevValue, ...data.result.pending];
					});

					setPendingId(data.result.pending);
				}
				// setUsersId(() => {
				// 	return [data.result.creator, ...data.result.members, ...data.result.pending];
				// });

				setCreatorId(data.result.creator);

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
		console.log(selectUser);
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
				setModalVisible(!modalVisible);
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

	const handleDeleteMember = async () => {
		console.log(selectUser);

		const update = users.filter((user) => user.id != selectUser?.id);

		try {
			const response = await axios.put(
				`${Constanst.expoConfig?.extra?.API_URL}/projects/updateMembers`,
				{
					id: idProject,
					pending: update,
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
				Toast.success("Delete successfully");
				setModalDeleteVisible(!modalDeleteVisible);
				setUsers((prevValue) => {
					return prevValue.filter((user) => user.id != selectUser?.id);
				});
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

	const handleShowModal = (u: UserInterface) => {
		setSelectUser(u);

		if (u.id == creatorId || membersId.includes(u.id) || pendingId.includes(u.id)) {
			setModalDeleteVisible(true);
		} else {
			setModalVisible(!modalVisible);
		}
	};

	return loading ? (
		<Loading />
	) : (
		<View style={membersStyle.container}>
			<View style={[membersStyle.topBar]}>
				<TouchableOpacity onPress={() => router.back()} style={{ position: "absolute", left: 10 }}>
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
						<TouchableOpacity key={u.id} onPress={() => handleShowModal(u)} style={[membersStyle.flexRowLayout, membersStyle.box]}>
							<View style={[membersStyle.flexRowItem]}>
								<Image source={u?.avatar ? { uri: u.avatar } : blackImg} style={membersStyle.image} />
								<View>
									<Text style={membersStyle.text}>{u.username}</Text>
									<Text style={membersStyle.text}>{u.email}</Text>
								</View>
							</View>
							<View>
								<Text style={[membersStyle.text, { lineHeight: 40 }]}>{u.id == creatorId ? "Creator" : membersId.some((m) => m == u.id) ? "Member" : pendingId.some((p) => p == u.id) ? "Pending" : ""}</Text>
							</View>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>

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
						<View>
							<Image source={selectUser?.avatar ? { uri: selectUser.avatar } : blackImg} style={[membersStyle.modalImage, { marginHorizontal: "auto" }]} />
							<Text style={membersStyle.modalText}>{selectUser?.username}</Text>
							<Text style={membersStyle.modalText}>{selectUser?.email}</Text>
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

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalDeleteVisible}
				onRequestClose={() => {
					Alert.alert("Modal has been closed.");
					setModalDeleteVisible(!modalDeleteVisible);
				}}
			>
				<View style={membersStyle.centeredView}>
					<View style={membersStyle.modalView}>
						<View>
							<Image source={selectUser?.avatar ? { uri: selectUser.avatar } : blackImg} style={[membersStyle.modalImage, { marginHorizontal: "auto" }]} />
							<Text style={membersStyle.modalText}>{selectUser?.username}</Text>
							<Text style={membersStyle.modalText}>{selectUser?.email}</Text>
						</View>
						<View style={[membersStyle.flexRowLayout, { gap: 60, marginTop: 30 }]}>
							<Pressable style={[membersStyle.button, { backgroundColor: Colors.lightGreen }]} onPress={handleDeleteMember}>
								<Text style={membersStyle.textStyle}>Remove</Text>
							</Pressable>
							<Pressable style={[membersStyle.button, { backgroundColor: Colors.lightGrey }]} onPress={() => setModalDeleteVisible(!modalDeleteVisible)}>
								<Text style={membersStyle.textStyle}>Close</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}
