import { GestureHandlerRootView } from "react-native-gesture-handler";
import HomePage from "./HomePage/HomePage";

export default function HomeScreen() {
	return (
		<GestureHandlerRootView>
			<HomePage/>
		</GestureHandlerRootView>
	);
}
