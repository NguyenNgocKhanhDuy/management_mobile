import ToastManager from "toastify-react-native";
// import TaskDetail from "./TaskDetail/TaskDetail";
// import TaskDetail from "./Login/Login";
import Login from "./Login/Login";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import HomeScreen from './index';

export default function HomeScreen() {
	return (

		<GestureHandlerRootView style={{ flex: 1 }}>
			<ToastManager />
			<Login />
		</GestureHandlerRootView>
	);
}

