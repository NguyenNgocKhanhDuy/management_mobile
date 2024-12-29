import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { membersStyle } from "./Members.style";
import { UserInterface } from "@/interfaces/Interface";
import axios from "axios";
import debounce from "lodash.debounce";
import { Toast } from "toastify-react-native";
import Loading from "../Loading/Loading";

export default function Members(props: any) {
	const blackImg = require("@/assets/images/black.jpg");
	const idProject = "";
	const token = "";
	const [loading, setLoading] = useState(false);
	const debouncedSearchRef = useRef<any>(null);
	const [users, setUsers] = useState<UserInterface[]>([]);
	const [usersId, setUsersId] = useState<string[]>([]);

	useEffect(() => {
		handleGetProject();
	}, []);

	useEffect(() => {
		handleGetAllUsers();
	}, [usersId]);

	if (!debouncedSearchRef.current) {
		debouncedSearchRef.current = debounce((nextValue: string) => {
			handleSearch(nextValue);
		}, 300);
	}

	const handleSearch = async (email: string) => {
		setLoading(true);
		try {
			const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/searchNotInProject`, {
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
			setLoading(false);
		}
	};

	const handleOnChange = (event: any) => {
		debouncedSearchRef.current(event.target.value);
	};

	const handleGetProject = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/projects/${idProject}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const data = response.data;
			if (data.status) {
				setUsersId((prevUser) => {
					return [...prevUser, data.result.creator, data.result.members, data.result.pending];
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
		setLoading(true);
		if (usersId.length > 0) {
			const usersPromise = usersId.map((id: string) => handleGetUserById(id));
			const allUsers = await Promise.all(usersPromise);
			setUsers(allUsers);
		}
		setLoading(false);
	};

	const handleGetUserById = async (id: string) => {
		console.log(id);
		try {
			const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/${id}`, {
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
						<TouchableOpacity style={[membersStyle.flexRowLayout, membersStyle.box]}>
							<View key={u.id} style={[membersStyle.flexRowItem]}>
								<Image source={u?.avatar ? { uri: u.avatar } : blackImg} style={membersStyle.image} />
								<View>
									<Text style={membersStyle.text}>{u.username}</Text>
									<Text style={membersStyle.text}>{u.email}</Text>
								</View>
							</View>
							<View style={[membersStyle.flexRowItem]}>
								<TouchableOpacity>
									<FontAwesome6 name="plus" style={membersStyle.icon} />
								</TouchableOpacity>
								<TouchableOpacity>
									<FontAwesome6 name="trash" style={[membersStyle.icon]} />
								</TouchableOpacity>
							</View>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>
		</View>
	);
}
