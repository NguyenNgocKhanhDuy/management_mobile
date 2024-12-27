import React, { useEffect, useRef, useState } from "react";
import Carousel from "pinar";
import Board from "../Board/Board";
import axios from "axios";
import Constanst from "expo-constants";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { taskStyles } from "./Task.styles";
import { Toast } from "toastify-react-native";
import Loading from "../Loading/Loading";
import { TaskInterface } from "@/interfaces/Interface";

export default function Task(props: any) {
	const idProject = props.idProject;
	const [loading, setLoading] = useState(false);
	const [tasks, setTasks] = useState<TaskInterface[]>([]);
	const boards = ["To do", "Pending", "Done"];
	const [currentIndex, setCurrentIndex] = useState(0);
	const carouselRef = useRef<Carousel>(null);

	useEffect(() => {
		handleGetTaskOfProject();
	}, [idProject]);

	const handleGetTaskOfProject = async () => {
		setLoading(true);
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
				setTasks(data.result);
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

	const sortTaskByPosition = (tasks: TaskInterface[]) => {
		return tasks.sort((a, b) => a.position - b.position);
	};

	return loading ? (
		<Loading />
	) : (
		<GestureHandlerRootView>
			<Carousel
				ref={carouselRef}
				showsControls={false}
				style={taskStyles.carousel}
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
