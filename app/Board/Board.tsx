import { View, Text } from "react-native";
import React from "react";
import { boardStyles } from "./Board.styles";
import TaskItem from "../TaskItem/TaskItem";

type Status = "todo" | "pending" | "done";

interface Task {
	id: string;
	name: string;
	status: string;
	position: number;
}

export default function Board(props: any) {
	const status: Status = props.title.toLocaleLowerCase().replace(/\s+/g, "");
	const statusStyle = boardStyles[status];

	const handleTaskDrop = (taskId: string) => {
		// Gọi hàm onTaskDrop truyền từ component cha (Task)
		const newStatus = status; // Trạng thái mới sẽ dựa trên board hiện tại
		props.onTaskDrop(taskId, newStatus);
	};

	return (
		<View style={[boardStyles.board, statusStyle]}>
			<Text style={boardStyles.title}>{props.title}</Text>

			{props.tasks.map((task: Task) => (
				<TaskItem
					key={task.id}
					task={task}
					onDrop={handleTaskDrop}
					onMoveRight={props.onMoveRight} // Truyền hàm moveRight cho TaskItem
					onMoveLeft={props.onMoveLeft} // Truyền hàm moveLeft cho TaskItem
				/>
			))}
		</View>
	);
}

