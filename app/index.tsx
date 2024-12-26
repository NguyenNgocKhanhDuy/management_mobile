<<<<<<< HEAD
import Task from "@/components/Task/Task";
import VerifyEmailScreen from "@/components/Register/Register";
=======
import ToastManager from "toastify-react-native";
import TaskDetail from "./TaskDetail/TaskDetail";
import Login from "./Login/Login";
>>>>>>> 62bfa329ed80dbe1fe6c2d7eab73550492ad9138
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function HomeScreen() {
	return (
<<<<<<< HEAD
		// <GestureHandlerRootView>
		// 	<Task />
		// </GestureHandlerRootView>
		<VerifyEmailScreen />
		
=======

		<GestureHandlerRootView style={{ flex: 1 }}>
			<ToastManager />
			<Login />
		</GestureHandlerRootView>
>>>>>>> 62bfa329ed80dbe1fe6c2d7eab73550492ad9138
	);
}

