import { View, StyleSheet } from "react-native";
import React, { useRef, useState } from "react";
import Carousel from "pinar";
import Board from "../Board/Board";
import axios from "axios";
import Constanst from "expo-constants";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface Task {
	id: string;
	name: string;
	status: string;
	position: number;
}

export default function Task(props: any) {
	let idProject = "1234";
	const handleGetTaskOfProject = async () => {
		try {
			const response = await axios.get(`${Constanst.expoConfig?.extra?.API_URL}/tasks/tasksOfProject/${idProject}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${props.token}`,
				},
			});

			const data = response.data;
			if (data.status) {
				console.log(data.result);
				// setTasks(data.result);
			}
		} catch (error: any) {
			if (error.response) {
				console.error("Error:", error.response.data.message || error.response.data.error);
				// props.setErrorMessage(error.response.data.message || error.response.data.error);
			} else if (error.request) {
				console.error("Error:", error.request);
				// props.setErrorMessage("Failed to connect to server.");
			} else {
				console.error("Error:", error.message);
				// props.setErrorMessage("An unexpected error occurred: " + error.message);
			}
			// props.setLoading(false);
			// props.isSelectProject();
			// props.setShowError(true);
		}
	};

	const boards = ["To do", "Pending", "Done"];
	const [tasks, setTasks] = useState<Task[]>([
		{ id: "1", name: "Test 1", status: "todo", position: 0 },
		{ id: "2", name: "Test 2", status: "pending", position: 0 },
		{ id: "3", name: "Test 3", status: "done", position: 0 },
		{ id: "4", name: "Test 4", status: "todo", position: 1 },
		{ id: "5", name: "Test 5", status: "todo", position: 2 },
		{ id: "6", name: "Test 6", status: "pending", position: 1 },
	]);

	const [currentIndex, setCurrentIndex] = useState(0); // Lưu trữ chỉ số hiện tại của carousel
	const carouselRef = useRef<Carousel>(null);

	const handleMoveRight = (taskId: string) => {
		const newIndex = currentIndex + 1;
		if (newIndex < boards.length) {
			carouselRef.current?.scrollToNext();
			const statusNew = boards[newIndex].toLowerCase().replace(/\s+/g, "");

			handleTaskDrop(taskId, statusNew);
			console.log(`Carousel: Moving to the right, New Board Status: ${statusNew}`);
		}
	};

	const handleMoveLeft = (taskId: string) => {
		const newIndex = currentIndex - 1;
		if (newIndex >= 0) {
			carouselRef.current?.scrollToPrev();
			const statusNew = boards[newIndex].toLowerCase().replace(/\s+/g, "");

			handleTaskDrop(taskId, statusNew);
			console.log(`Carousel: Moving to the left, New Board Status: ${statusNew}`);
		}
	};

	const handleTaskDrop = (taskId: string, newStatus: string) => {
		setTasks((prevTasks) =>
			prevTasks.map((task) => {
				if (task.id === taskId) {
					return { ...task, status: newStatus };
				}
				return task;
			})
		);

		// Cập nhật currentIndex dựa vào status mới
		// const newIndex = boards.indexOf(newStatus.charAt(0).toUpperCase() + newStatus.slice(1));
		// if (newIndex !== -1) {
		// 	setCurrentIndex(newIndex);
		// }
	};

	const sortTaskByPosition = (tasks: Task[]) => {
		return tasks.sort((a, b) => a.position - b.position);
	};

	return (
		<GestureHandlerRootView>
			<Carousel
				ref={carouselRef}
				showsControls={false}
				index={currentIndex} // Chỉ số hiện tại của carousel
				onIndexChanged={(params) => {
					setCurrentIndex(params.index);
					console.log(`Carousel: Current index is ${params.index}`);
				}} // Cập nhật chỉ số khi chuyển đổi
			>
				{boards.map((title) => (
					<Board key={title} title={title} tasks={sortTaskByPosition(tasks.filter((task) => task.status === title.toLowerCase().replace(/\s+/g, "")))} onMoveRight={handleMoveRight} onMoveLeft={handleMoveLeft} onTaskDrop={handleTaskDrop} />
				))}
			</Carousel>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	carousel: {
		height: "100%",
		width: "100%",
	},
});


