import { View, Text, TextInput, Image, Button, TouchableOpacity, ScrollView, Alert } from "react-native";
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
import { dateShort, formatMonth } from "@/utils/date";

export default function TaskDetail(props: any) {
	const id = props.id;
	const blackImg = require("../../assets/images/black.jpg");
	const [loading, setLoading] = useState(false);
	const [date, setDate] = useState(new Date());
	const [showSelectDate, setShowSelectDate] = useState(false);
	const [task, setTask] = useState<TaskInterface>();
	const [creator, setCreator] = useState<UserInterface>();
	const [subtasks, setSubtasks] = useState<SubtaskInterface[]>([]);

	useEffect(() => {
		handleGetTask();
		handleGetSubtaskByTaskId();
	}, [id]);

	useEffect(() => {
		handleGetUserById(task?.creator ? task.creator : "");
	}, [task?.creator]);

	const handleDateChange = (event: any, selectedDate: Date | undefined) => {
		const currentDate = selectedDate || date;
		setDate(currentDate);
		setShowSelectDate(false);
	};

	const handleGetTask = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${Constanst.expoConfig?.extra?.API_URL}/tasks/${id}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${props.token}`,
				},
			});

			const data = response.data;
			if (data.status) {
				console.log(data.result);
				setTask(data.result);
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

	const handleGetUserById = async (idUser: string) => {
		setLoading(true);
		try {
			const response = await axios.get(`${Constanst.expoConfig?.extra?.API_URL}/users/${idUser}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${props.token}`,
				},
			});

			const data = response.data;
			if (data.status) {
				console.log(data.result);
				setCreator(data.result);
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

	const handleGetSubtaskByTaskId = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${Constanst.expoConfig?.extra?.API_URL}/subtasks/${id}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${props.token}`,
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

	const handleCheckboxChange = (id: string) => {
		setSubtasks((prevTasks) => prevTasks.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st)));
	};

	return (
		<ScrollView style={{ backgroundColor: Colors.background }}>
			<View style={styles.container}>
				<TextInput value={task?.name} style={[styles.title, { textAlign: "center" }]} />
				<View style={[styles.flexRowItem, { marginBottom: 20 }]}>
					<Image style={styles.avatar} source={creator?.avatar ? { uri: creator.avatar } : blackImg} />
					<Text>{creator?.username}</Text>
				</View>
				<View style={[styles.flexRowItem, { marginLeft: 6 }]}>
					<FontAwesome name="calendar" style={styles.icon} />
					<Text>${dateShort(task?.date ? task.date : new Date())}</Text>
				</View>

				<TouchableOpacity onPress={() => setShowSelectDate(true)} style={[styles.flexRowItem, { marginVertical: 20, marginLeft: 6 }]}>
					<FontAwesome5 name="clock" style={styles.icon} />
					<Text>${formatMonth(date) + " " + date.getDate()}</Text>
				</TouchableOpacity>
				{showSelectDate ? <RNDateTimePicker value={date} mode="datetime" onChange={handleDateChange} /> : ""}
				<View style={styles.flexRowLayout}>
					<TouchableOpacity style={styles.button}>
						<Text style={styles.buttonText}>New Subtask</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.button}>
						<Text style={styles.buttonText}>Delete Task</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.flexRowLayout}>
					<Text style={styles.title}>Progress</Text>
					<Text style={styles.title}>0%</Text>
				</View>
				<View style={{ position: "relative" }}>
					<View style={styles.baseProgress}></View>
					<View style={[styles.completeProgress, { width: "50%" }]}></View>
				</View>
				{subtasks.map((st: SubtaskInterface) => (
					<View style={[styles.flexRowLayout, { marginTop: 30 }]} key={st.id}>
						<View style={styles.flexRowItem}>
							<Checkbox value={st.completed} onValueChange={(id) => handleCheckboxChange(st.id)} color={Colors.lightGreen} />
							<Text>{st.title}</Text>
						</View>

						<View style={styles.flexRowItem}>
							<FontAwesome6 name="pen-to-square" style={styles.icon} />
							<FontAwesome6 name="trash" e style={styles.icon} />
						</View>
					</View>
				))}
			</View>
		</ScrollView>
	);
}
