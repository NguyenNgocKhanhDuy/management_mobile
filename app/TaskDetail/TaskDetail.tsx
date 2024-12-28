import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, Modal, Alert, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "./TaskDetail.style";
import { FontAwesome, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";
import { Colors } from "@/assets/Colors";
import { Toast } from "toastify-react-native";
import axios from "axios";
import Constanst from "expo-constants";
import { SubtaskInterface, TaskInterface, UserInterface } from "../../interfaces/Interface";
import { dateShort, formatTime } from "@/utils/date";
import Loading from "../Loading/Loading";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function TaskDetail(props: any) {
	// const token = "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJubmtkLmNvbSIsInN1YiI6IjIxMTMwMDM1QHN0LmhjbXVhZi5lZHUudm4iLCJleHAiOjE3MzUxODI0NzcsImN1c3RvbUNsYWltIjoiQ3VzdG9tIiwiaWF0IjoxNzM1MTc4ODc3fQ.9NwfcxfzrQxb11tHT8-DL_Of19Tv5qd_Xb61U5l9KGOztLOlRIdYvzxb7tz1HFF1XlWdkv_w2bV4wSSpWdD3mQ";
	const token = useSelector((state: RootState) => state.user.token);
	// const id = "66ed28835d88dd7f163a5774";
	const id = useSelector((state: RootState) => state.task.id);
	const blackImg = require("../../assets/images/black.jpg");
	const [loading, setLoading] = useState(false);
	const [date, setDate] = useState(new Date());
	const [showSelectDate, setShowSelectDate] = useState(false);
	const [showSelectTime, setShowSelectTime] = useState(false);
	const [task, setTask] = useState<TaskInterface>();
	const [creator, setCreator] = useState<UserInterface>();
	const [subtasks, setSubtasks] = useState<SubtaskInterface[]>([]);
	const [idSubtask, setIdSubtask] = useState("");
	const [idCreator, setIdCreator] = useState("");
	const [tempName, setTempName] = useState("");
	const [prevName, setPrevName] = useState("");
	const [percentage, setPercentage] = useState(100);
	const [modalVisible, setModalVisible] = useState(false);
	const [typeRename, setTypeRename] = useState("");
	const [typpUpdate, setTypeUpdate] = useState("");

	useEffect(() => {
		handleGetTask();
		handleGetSubtaskByTaskId();
	}, [id]);

	useEffect(() => {
		if (idCreator != "") {
			handleGetUserById(idCreator);
		}
	}, [idCreator]);

	useEffect(() => {
		if (subtasks.length > 0 && typpUpdate == "status") {
			handleUpdateStatusSubTask(idSubtask, subtasks.find((st) => st.id === idSubtask)?.completed ?? false);
		}
	}, [idSubtask]);

	useEffect(() => {
		completePercentage();
	}, [subtasks]);

	useEffect(() => {
		console.log(date);
		handleUpdateDeadlineTask();
	}, [date]);

	const handleDateChange = (event: any, selectedDate: Date | undefined) => {
		setShowSelectDate(!showSelectDate);
		if (selectedDate) {
			setDate(selectedDate);
		}
	};

	const handleTimeChange = (event: any, selectedDate: Date | undefined) => {
		setShowSelectTime(!showSelectTime);
		if (selectedDate) {
			setDate(selectedDate);
		}
	};

	const handleGetTask = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${Constanst.expoConfig?.extra?.API_URL}/tasks/${id}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const data = response.data;
			if (data.status) {
				// console.log(data.result);
				setTask(data.result);
				setDate(new Date(data.result.deadline));
				setIdCreator(data.result.creator);
				setLoading(false);
			}
		} catch (error: any) {
			if (error.response) {
				console.error("Error:", error.response.data.message || error.response.data.error);
				Toast.error("Task: " + error.response.data.message || error.response.data.error);
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

	const handleGetUserById = async (idUser: string) => {
		setLoading(true);
		try {
			const response = await axios.get(`${Constanst.expoConfig?.extra?.API_URL}/users/${idUser}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const data = response.data;
			if (data.status) {
				// console.log(data.result);
				setCreator(data.result);
				setLoading(false);
			}
		} catch (error: any) {
			if (error.response) {
				console.error("Error:", error.response.data.message || error.response.data.error);
				Toast.error("User:  " + error.response.data.message || error.response.data.error);
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

	const handleGetSubtaskByTaskId = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${Constanst.expoConfig?.extra?.API_URL}/subtasks/${id}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const data = response.data;
			if (data.status) {
				console.log(data.result);
				setSubtasks(data.result);
				setLoading(false);
			}
		} catch (error: any) {
			if (error.response) {
				console.error("Error:", error.response.data.message || error.response.data.error);
				Toast.error("Get Sub: " + error.response.data.message || error.response.data.error);
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

	const handleRenameTask = async () => {
		setLoading(true);
		try {
			const response = await axios.put(
				`${Constanst.expoConfig?.extra?.API_URL}/tasks/updateTaskName`,
				{
					id: id,
					name: tempName,
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
				// console.log(data.result);
				setTask((prevTask) => {
					if (!prevTask) return undefined;
					return { ...prevTask, name: tempName };
				});
				setModalVisible(!modalVisible);
				setLoading(false);
			}
		} catch (error: any) {
			if (error.response) {
				console.error("Error:", error.response.data.message || error.response.data.error);
				Toast.error("Rename Task: " + error.response.data.message || error.response.data.error);
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

	const handleUpdateDeadlineTask = async () => {
		setLoading(true);
		try {
			const response = await axios.put(
				`${Constanst.expoConfig?.extra?.API_URL}/tasks/updateTaskDeadline`,
				{
					id: id,
					deadline: date,
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
				// console.log(data.result);
				setLoading(false);
			}
		} catch (error: any) {
			if (error.response) {
				console.error("Error:", error.response.data.message || error.response.data.error);
				Toast.error("Delete Task: " + error.response.data.message || error.response.data.error);
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

	const handleDeleteTask = async () => {
		setLoading(true);
		try {
			const response = await axios.delete(`${Constanst.expoConfig?.extra?.API_URL}/tasks/${id}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const data = response.data;
			if (data.status) {
				// console.log(data.result);
				router.push("/Task/Task");
				setLoading(false);
			}
		} catch (error: any) {
			if (error.response) {
				console.error("Error:", error.response.data.message || error.response.data.error);
				Toast.error("Delete Task: " + error.response.data.message || error.response.data.error);
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

	const handleAddSubTask = async () => {
		setLoading(true);
		const title = "New Subtask " + (subtasks.length > 0 ? subtasks.length + 1 : "1");
		try {
			const response = await axios.post(
				`${Constanst.expoConfig?.extra?.API_URL}/subtasks/addSubtask`,
				{
					title: title,
					completed: false,
					task: id,
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
				setSubtasks((prevST) => {
					return [...prevST, data.result];
				});
				setLoading(false);
			}
		} catch (error: any) {
			if (error.response) {
				console.error("Error:", error.response.data.message || error.response.data.error);
				Toast.error("Add sub: " + error.response.data.message || error.response.data.error);
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

	const handleDeleteSubTask = async (idSubtask: string) => {
		setLoading(true);
		try {
			const response = await axios.delete(`${Constanst.expoConfig?.extra?.API_URL}/subtasks/${idSubtask}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const data = response.data;
			if (data.status) {
				setSubtasks((st) => {
					return st.filter((st) => st.id !== idSubtask);
				});
				setIdSubtask("");
				setLoading(false);
			}
		} catch (error: any) {
			if (error.response) {
				console.error("Error:", error.response.data.message || error.response.data.error);
				Toast.error("Delete sub: " + error.response.data.message || error.response.data.error);
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

	const handleUpdateStatusSubTask = async (idSubtask: string, status: boolean) => {
		setLoading(true);
		try {
			const response = await axios.put(
				`${Constanst.expoConfig?.extra?.API_URL}/subtasks/updateSubtaskStatus`,
				{
					id: idSubtask,
					completed: status,
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
				setTypeUpdate("");
				setIdSubtask("");
				setLoading(false);
			}
		} catch (error: any) {
			if (error.response) {
				console.error("Error:", error.response.data.message || error.response.data.error);
				Toast.error("Update sub: " + error.response.data.message || error.response.data.error);
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

	const handleUpdateTitleSubTask = async () => {
		setLoading(true);
		try {
			const response = await axios.put(
				`${Constanst.expoConfig?.extra?.API_URL}/subtasks/updateSubtaskTitle`,
				{
					id: idSubtask,
					title: tempName,
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
				setSubtasks((prevST) => {
					if (!prevST) return [];
					return prevST.map((st) => (st.id === idSubtask ? { ...st, title: tempName } : st));
				});
				setModalVisible(!modalVisible);
				setTypeUpdate("");
				setIdSubtask("");
				setLoading(false);
			}
		} catch (error: any) {
			if (error.response) {
				console.error("Error:", error.response.data.message || error.response.data.error);
				Toast.error("Update Title: " + error.response.data.message || error.response.data.error);
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

	const handleModalRename = () => {
		if (typeRename == "task") {
			handleRenameTask();
		} else if (typeRename == "subtask") {
			handleUpdateTitleSubTask();
		}
	};

	const handleCheckboxChange = (id: string) => {
		setIdSubtask(id);
		setTypeUpdate("status");
		setSubtasks((prevTasks) => prevTasks.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st)));
	};

	const completePercentage = () => {
		if (subtasks.length > 0) {
			var all = subtasks.length;
			var subtaskCompleted = subtasks.filter((t) => t.completed === true);
			var percentageCal = ((subtaskCompleted.length / all) * 100).toFixed(2);
			console.log(percentageCal);
			setPercentage(parseFloat(percentageCal));
		}
	};

	const handleFormatDate = (dateString: string) => {
		const date = new Date(dateString);
		return dateShort(date);
	};

	return loading ? (
		<Loading />
	) : (
		<ScrollView style={{ flex: 1, backgroundColor: Colors.background, position: "relative" }}>
			<View style={styles.container}>
				<TouchableOpacity
					onPress={() => {
						setModalVisible(!modalVisible);
						setTypeRename("task");
						setPrevName(task?.name ?? "");
					}}
				>
					<Text style={[styles.title, { textAlign: "center" }]}>{task?.name}</Text>
				</TouchableOpacity>
				<View style={[styles.flexRowItem, { marginBottom: 20 }]}>
					<Image style={styles.avatar} source={creator?.avatar ? { uri: creator.avatar } : blackImg} />
					<Text>{creator?.username}</Text>
				</View>
				<View style={[styles.flexRowItem, { marginLeft: 6 }]}>
					<FontAwesome name="calendar" style={styles.icon} />
					<Text>{handleFormatDate(task?.date ?? "")}</Text>
				</View>

				<View style={[{ marginVertical: 20, marginLeft: 6 }]}>
					<View style={styles.flexRowLayout}>
						<TouchableOpacity onPress={() => setShowSelectDate(!showSelectDate)} style={styles.flexRowItem}>
							<FontAwesome5 name="clock" style={styles.icon} />
							<Text>{dateShort(date)}</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => setShowSelectTime(!showSelectTime)}>
							<Text>Time: {formatTime(date)}</Text>
						</TouchableOpacity>
					</View>
				</View>
				{showSelectDate ? <RNDateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} /> : ""}
				{showSelectTime ? <RNDateTimePicker value={date} mode="time" display="default" onChange={handleTimeChange} /> : ""}
				<View style={styles.flexRowLayout}>
					<TouchableOpacity style={styles.button} onPress={handleAddSubTask}>
						<Text style={styles.buttonText}>New Subtask</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.button} onPress={handleDeleteTask}>
						<Text style={styles.buttonText}>Delete Task</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.flexRowLayout}>
					<Text style={styles.title}>Progress</Text>
					<Text style={styles.title}>{percentage}%</Text>
				</View>
				<View style={{ position: "relative" }}>
					<View style={styles.baseProgress}></View>
					<View style={[styles.completeProgress, { width: `${percentage}%` }]}></View>
				</View>
				{subtasks.length > 0 &&
					subtasks.map((st: SubtaskInterface) => (
						<View style={[styles.flexRowLayout, { marginTop: 30 }]} key={st.id}>
							<View style={styles.flexRowItem}>
								<Checkbox value={st.completed} onValueChange={() => handleCheckboxChange(st.id)} color={Colors.lightGreen} />
								<Text>{st.title}</Text>
							</View>

							<View style={styles.flexRowItem}>
								<TouchableOpacity
									onPress={() => {
										setIdSubtask(st.id);
										setModalVisible(!modalVisible);
										setTypeRename("subtask");
										setTypeUpdate("title");
										setPrevName(st.title);
									}}
								>
									<FontAwesome6 name="pen-to-square" style={styles.icon} />
								</TouchableOpacity>
								<TouchableOpacity onPress={() => handleDeleteSubTask(st.id)}>
									<FontAwesome6 name="trash" style={styles.icon} />
								</TouchableOpacity>
							</View>
						</View>
					))}
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
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={styles.modalText}>Rename</Text>
							<TextInput style={styles.input} placeholder={prevName} onChangeText={(text) => setTempName(text)} />
							<View style={[styles.flexRowLayout, { gap: 60, marginTop: 30 }]}>
								<Pressable style={[styles.button, { backgroundColor: Colors.lightGreen }]} onPress={handleModalRename}>
									<Text style={styles.textStyle}>Save</Text>
								</Pressable>
								<Pressable style={[styles.button, { backgroundColor: Colors.lightGrey }]} onPress={() => setModalVisible(!modalVisible)}>
									<Text style={styles.textStyle}>Close</Text>
								</Pressable>
							</View>
						</View>
					</View>
				</Modal>
			) : (
				""
			)}
		</ScrollView>
	);
}
