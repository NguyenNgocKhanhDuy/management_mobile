import ToastManager from "toastify-react-native";
import TaskDetail from "./TaskDetail/TaskDetail";
import Login from "./Login/Login";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Task from "./Task/Task";
import HomePage from "./HomePage/HomePage";

export default function HomeScreen() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ToastManager />
			{/* <Login /> */}
			<HomePage />
		</GestureHandlerRootView>
	);
}
