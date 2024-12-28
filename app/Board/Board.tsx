import { View, Text, Pressable, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { boardStyles } from "./Board.styles";
import TaskItem from "../TaskItem/TaskItem";
import { TaskInterface } from "@/interfaces/Interface";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";

type Status = "todo" | "pending" | "done";

export default function Board(props: any) {
	const status: Status = props.title.toLocaleLowerCase().replace(/\s+/g, "");
	const statusStyle = boardStyles[status];

	const handleTaskDrop = (taskId: string) => {
		// Gọi hàm onTaskDrop truyền từ component cha (Task)
		const newStatus = status; // Trạng thái mới sẽ dựa trên board hiện tại
		props.onTaskDrop(taskId, newStatus);
	};

	const handleMoveUp = (taskId: string) => {
		const taskIndex = props.tasks.findIndex((task: TaskInterface) => task.id === taskId);
		if (taskIndex > 0) {
			const updatedTasks = [...props.tasks];
			const [taskToMove] = updatedTasks.splice(taskIndex, 1); // Lấy task cần di chuyển
			updatedTasks.splice(taskIndex - 1, 0, taskToMove); // Chèn task lên trên

			// Cập nhật lại vị trí (position) cho tất cả task
			updatedTasks.forEach((task, index) => {
				task.position = index + 1;
			});

			props.onTaskDrop(updatedTasks); // Truyền cập nhật lên component cha
		}
	};

	const handleMoveDown = (taskId: string) => {
		const taskIndex = props.tasks.findIndex((task: TaskInterface) => task.id === taskId);
		if (taskIndex < props.tasks.length - 1) {
			const updatedTasks = [...props.tasks];
			const [taskToMove] = updatedTasks.splice(taskIndex, 1); // Lấy task cần di chuyển
			updatedTasks.splice(taskIndex + 1, 0, taskToMove); // Chèn task xuống dưới

			// Cập nhật lại vị trí (position) cho tất cả task
			updatedTasks.forEach((task, index) => {
				task.position = index + 1;
			});

			props.onTaskDrop(updatedTasks); // Truyền cập nhật lên component cha
		}
	};

	return (
		<View>
			<View style={[boardStyles.board, statusStyle]}>
				<Text style={boardStyles.title}>{props.title}</Text>
				<ScrollView style={{ width: "100%" }}>
					{props.tasks.map((task: TaskInterface) => (
						<Pressable style={{ width: "100%", transform: [{ translateX: -11 }] }} onPress={() => props.setTaskId(task.id)}>
							<TaskItem
								key={task.id}
								task={task}
								onDrop={handleTaskDrop}
								onMoveUp={handleMoveUp} // Truyền hàm moveUp cho TaskItem
								onMoveDown={handleMoveDown} // Truyền hàm moveDown cho TaskItem
								onMoveRight={props.onMoveRight} // Truyền hàm moveRight cho TaskItem
								onMoveLeft={props.onMoveLeft} // Truyền hàm moveLeft cho TaskItem
							/>
						</Pressable>
					))}
				</ScrollView>
			</View>
		</View>
	);
}
