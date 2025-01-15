import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { GestureHandlerRootView, ScrollView, TextInput } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import Constanst from "expo-constants";
import { Modal } from "react-native";
import { useDispatch } from "react-redux";
import { setToken } from "@/store/UserSlice";
import { setIdProject } from "@/store/TaskSlice";
import { router } from "expo-router";
interface Project {
	id: string;
	name: string;
	date: string;
	creator: string;
	members: string[] | null;
	pending: string[] | null;
}
interface HomeScreenProps {
	token: string;
}
export default function HomeScreen({ token }: HomeScreenProps) {
	const [projects, setProjects] = useState<Project[]>([]);
	const [searchText, setSearchText] = useState("");
	const images = [require("../../assets/images/b1.jpg"), require("../../assets/images/b2.jpg"), require("../../assets/images/b3.jpg"), require("../../assets/images/b4.jpg")];
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [newProjectName, setNewProjectName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const handleDeleteProject = async (projectId: string) => {
		Alert.alert(
			"Xóa Project",
			"Bạn có chắc chắn muốn xóa project này?",
			[
				{
					text: "Hủy",
					style: "cancel",
				},
				{
					text: "Xóa",
					onPress: async () => {
						try {
							const response = await axios.delete(
								`${Constanst.expoConfig?.extra?.API_URL}/projects/${projectId}`, // Đường dẫn đúng với API
								{
									headers: {
										Authorization: `Bearer ${token}`, // Thêm header Authorization
									},
								}
							);
	
							if (response.status === 200) {
								Alert.alert("Thành công", "Đã xóa project");
								fetchProjects(); // Làm mới danh sách project
							} else {
								Alert.alert("Lỗi", "Không thể xóa project");
							}
						} catch (error) {
							console.error("Error deleting project:", error);
							Alert.alert("Lỗi", "Đã xảy ra lỗi khi xóa project");
						}
					},
				},
			],
			{ cancelable: true }
		);
	};
	
	
	const fetchProjects = async () => {
		try {
			const response = await axios.get(`${Constanst.expoConfig?.extra?.API_URL}/projects/projectsHasUser`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.data.status) {
				setProjects(response.data.result);
			} else {
				Alert.alert("Error", "Failed to fetch projects");
			}
		} catch (error) {
			console.error("Error fetching projects:", error);
			Alert.alert("Error", "An error occurred while fetching projects");
		}
	};
	const handleCreateProject = async () => {
		if (!newProjectName.trim()) {
			Alert.alert("Lỗi", "Vui lòng nhập tên project");
			return;
		}

		setIsLoading(true);
		try {
			const response = await axios.post(
				`${Constanst.expoConfig?.extra?.API_URL}/projects/addProject`,
				{
					name: newProjectName.trim(),
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.data.status) {
				Alert.alert("Thành công", "Đã tạo project mới");
				setNewProjectName("");
				setIsModalVisible(false);
				fetchProjects(); // Refresh danh sách
			} else {
				Alert.alert("Lỗi", "Không thể tạo project");
			}
		} catch (error) {
			console.error("Error creating project:", error);
			Alert.alert("Lỗi", "Đã xảy ra lỗi khi tạo project");
		} finally {
			setIsLoading(false);
		}
	};
	// Gọi API khi component được render
	useEffect(() => {
		fetchProjects();
	}, []);

	useEffect(() => {}, [projects]);

	const filteredProjects = projects.filter((project) =>
		project?.name
			?.trim()
			?.toLowerCase()
			?.includes(searchText?.trim()?.toLowerCase() || "")
	);

	const handleNavigateToProjectTask = (idProject: string) => {
		dispatch(setToken(token));
		dispatch(setIdProject(idProject));
		router.push("./Task/Task");
	};

	return (
		<GestureHandlerRootView>
			<ScrollView style={styles.container}>
				<View style={styles.titleContainer}>
					<Icon name="tablet-landscape" size={25} style={styles.titleIcon} />
					<Text style={styles.title}>My boards</Text>
					<Icon name="add" size={25} style={styles.addIcon} onPress={() => setIsModalVisible(true)} />
				</View>

				<View style={styles.inputContainer}>
					<Icon name="search" style={styles.icon} />
					<TextInput style={styles.input} placeholder="Bảng" value={searchText} onChangeText={(text) => setSearchText(text)} />
				</View>

				<View style={styles.contentContainer}>
					<Text style={styles.headingText}>Danh sách bảng của bạn</Text>
				</View>

				{filteredProjects.map((project, index) => {
    const randomImage = images[index % images.length];
    return (
        <TouchableOpacity
            key={project.id}
            onPress={() => handleNavigateToProjectTask(project.id)}
            onLongPress={() => handleDeleteProject(project.id)} // Thêm sự kiện xóa
        >
            <ImageBackground
                key={project.id}
                source={randomImage}
                style={styles.boardContainer}
                imageStyle={styles.image}
            >
                <Text style={styles.nameBoard}>{project.name}</Text>
            </ImageBackground>
        </TouchableOpacity>
    );
})}

				<Modal visible={isModalVisible} transparent={true} animationType="fade" onRequestClose={() => setIsModalVisible(false)}>
					<View style={styles.modalBackground}>
						<View style={styles.modalContent}>
							<View style={styles.modalHeader}>
								<Text style={styles.modalTitle}>Tạo Project Mới</Text>
								<TouchableOpacity onPress={() => setIsModalVisible(false)}>
									<Icon name="close" size={24} color="#333" />
								</TouchableOpacity>
							</View>

							<TextInput style={styles.modalInput} placeholder="Nhập tên project" value={newProjectName} onChangeText={setNewProjectName} placeholderTextColor="#666" />

							<View style={styles.modalButtonContainer}>
								<TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)} disabled={isLoading}>
									<Text style={styles.buttonText}>Hủy</Text>
								</TouchableOpacity>

								<TouchableOpacity style={styles.createButton} onPress={handleCreateProject} disabled={isLoading}>
									{isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Tạo Project</Text>}
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
			</ScrollView>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000000",
	},
	nameBoard: {
		color: "#ffffff",
		fontSize: 20,
		fontWeight: "bold",
	},
	boardContainer: {
		width: "97.5%",
		height: 100,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 20,
		marginLeft: 10,
		marginRight: 10,
		marginBottom: 20,
	},
	image: {
		borderRadius: 20,
		resizeMode: "cover",
	},
	titleContainer: {
		height: 80,
		width: "100%",
		backgroundColor: "#323b46",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#ddd",
		borderRadius: 20,
		marginHorizontal: 10, // Cách mép màn hình
		marginTop: 20, // Khoảng cách với titleContainer
		paddingHorizontal: 10,
	},
	input: {
		flex: 1,
		height: 40,
		paddingHorizontal: 10,
		color: "#333",
	},
	icon: {
		marginRight: 5,
		color: "#333",
		fontSize: 25,
	},
	contentContainer: {
		// flex: 1,
		padding: 10,
		marginTop: 20,
		marginBottom: 20,
	},
	headingText: {
		color: "#b3bac2",
		fontSize: 25,
		fontWeight: "bold",
	},
	title: {
		color: "white",
		fontSize: 30,
		fontWeight: "bold",
	},
	titleIcon: {
		color: "white",
		fontSize: 30,
		marginRight: 10,
	},
	addIcon: {
		color: "white",
		fontSize: 35,
		marginRight: 10,
		position: "absolute",
		right: 0,
		fontWeight: "bold",
	},
	modalBackground: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		width: "80%",
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 20,
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#333",
	},
	modalInput: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 5,
		padding: 10,
		marginBottom: 20,
		color: "#333",
	},
	modalButtonContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: 10,
	},
	createButton: {
		backgroundColor: "#2196F3",
		padding: 10,
		borderRadius: 5,
		minWidth: 100,
		alignItems: "center",
	},
	cancelButton: {
		backgroundColor: "#666",
		padding: 10,
		borderRadius: 5,
		minWidth: 100,
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
	},
});
