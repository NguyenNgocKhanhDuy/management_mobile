import Login from "./Login/Login";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function HomeScreen() {
	return (
		<GestureHandlerRootView>
			<Login />
		</GestureHandlerRootView>
	);
}

