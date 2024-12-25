import TaskDetail from "./TaskDetail/TaskDetail";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function HomeScreen() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<TaskDetail />
		</GestureHandlerRootView>
	);
}
