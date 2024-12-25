import { View, Text, TextInput, Image, Button, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { styles } from "./TaskDetail.style";
import { FontAwesome, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";
import { Colors } from "@/assets/Colors";

export default function TaskDetail(props: any) {
	const blackImg = require("../../assets/images/black.jpg");
	const [date, setDate] = useState(new Date());
	const [showSelectDate, setShowSelectDate] = useState(false);

	const handleDateChange = (event: any, selectedDate: Date | undefined) => {
		const currentDate = selectedDate || date;
		setDate(currentDate);
		setShowSelectDate(false);
	};

	const [tasks, setTasks] = useState([
		{ id: 1, name: "New sub task 1", check: true },
		{ id: 2, name: "New sub task 2", check: false },
		{ id: 3, name: "New sub task 3", check: false },
		{ id: 4, name: "New sub task 4", check: false },
	]);

	const handleCheckboxChange = (id: number) => {
		setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? { ...task, check: !task.check } : task)));
	};

	return (
		<ScrollView style={{ backgroundColor: Colors.background }}>
			<View style={styles.container}>
				<TextInput value="Task 1" style={[styles.title, { textAlign: "center" }]} />

				<View style={[styles.flexRowItem, { marginBottom: 20 }]}>
					<Image style={styles.avatar} source={blackImg} />
					<Text>Nguyeene nghoc Khanh Duy</Text>
				</View>

				<View style={[styles.flexRowItem, { marginLeft: 6 }]}>
					<FontAwesome name="calendar" style={styles.icon} />
					<Text>September 28, 2024</Text>
				</View>

				<TouchableOpacity onPress={() => setShowSelectDate(true)} style={[styles.flexRowItem, { marginVertical: 20, marginLeft: 6 }]}>
					<FontAwesome5 name="clock" style={styles.icon} />
					<Text>September 27th 2024, 02:30 AM</Text>
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

				{tasks.map((task) => (
					<View style={[styles.flexRowLayout, { marginTop: 30 }]}>
						<View style={styles.flexRowItem}>
							<Checkbox value={task.check} onValueChange={(id) => handleCheckboxChange(task.id)} color={Colors.lightGreen} />
							<Text>{task.name}</Text>
						</View>

						<View style={styles.flexRowItem}>
							<FontAwesome6 name="pen-to-square" style={styles.icon} />
							<FontAwesome6 name="trash" style={styles.icon} />
						</View>
					</View>
				))}
			</View>
		</ScrollView>
	);
}
