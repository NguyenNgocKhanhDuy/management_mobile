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
import { BackHandler } from "react-native";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { setTaskId } from "@/store/TaskSlice";
import { setToken } from "@/store/UserSlice";

export default function Task(props: any) {
	const idProject = "66ed28755d88dd7f163a5773";
	const token = "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJubmtkLmNvbSIsInN1YiI6IjIxMTMwMDM1QHN0LmhjbXVhZi5lZHUudm4iLCJleHAiOjE3MzUzOTAwNDksImN1c3RvbUNsYWltIjoiQ3VzdG9tIiwiaWF0IjoxNzM1Mzg2NDQ5fQ.o-wqygb2BraAsNzQsBrvRIdLGLd4ReM70gupRlMF7vvqooL-9JzHEqzSwf5ErZ-in3SEWaWs6qe7-T70_Lg3tw";
	const [loading, setLoading] = useState(false);
	const [tasks, setTasks] = useState<TaskInterface[]>([]);
	const boards = ["To do", "Pending", "Done"];
	const [currentIndex, setCurrentIndex] = useState(0);
	const carouselRef = useRef<Carousel>(null);
	const [move, setMove] = useState(false);
	const [taskId, settaskId] = useState("");
	const dispatch = useDispatch();

	useEffect(() => {
		handleGetTaskOfProject();
	}, [idProject]);

	useEffect(() => {
		const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
			handleBackPress();
			return false;
		});

		return () => {
			backHandler.remove();
		};
	}, [tasks, move]);

	useEffect(() => {
		if (taskId != "") {
			dispatch(setTaskId(taskId));
			dispatch(setToken(token));
			router.navigate("/TaskDetail/TaskDetail");
		}
	}, [taskId]);

	const handleBackPress = async () => {
		if (move) {
			await handleUpdateStatusAndPositionTask();
		} else {
			setLoading(false);
		}
	};

	const handleGetTaskOfProject = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${Constanst.expoConfig?.extra?.API_URL}/tasks/tasksOfProject/${idProject}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
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

	const handleUpdateStatusAndPositionTask = async () => {
		setLoading(true);
		console.log("Update");
		console.log(tasks);

		try {
			const response = await axios.put(
				`${Constanst.expoConfig?.extra?.API_URL}/tasks/updateTaskStatusAndPosition`,
				tasks.map((t) => ({
					id: t.id,
					status: t.status,
					position: t.position,
				})),
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
				// setTasks(data.result);
				setLoading(false);
				setMove(false);
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
		const updatedTasks = tasks.filter((task) => task.status === newStatus);

		const newPosition = updatedTasks.length + 1;

		setTasks((prevTasks) =>
			prevTasks.map((task) => {
				if (task.id === taskId) {
					return { ...task, status: newStatus, position: newPosition };
				}
				return task;
			})
		);

		setMove(true);

		// In ra thông tin vị trí mới (nếu cần debug)
		console.log(`Task ID: ${taskId}, New Status: ${newStatus}, New Position: ${newPosition}`);
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
				{boards.map((title, index) => (
					<Board key={index} title={title} tasks={sortTaskByPosition(tasks.filter((task) => task.status === title.toLowerCase().replace(/\s+/g, "")))} onMoveRight={handleMoveRight} onMoveLeft={handleMoveLeft} onTaskDrop={handleTaskDrop} setTaskId={(id: string) => settaskId(id)} />
				))}
			</Carousel>
		</GestureHandlerRootView>
	);
}
