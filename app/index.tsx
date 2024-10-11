import Task from "@/components/Task/Task";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function HomeScreen() {
	return (
		<GestureHandlerRootView>
			<Task />
		</GestureHandlerRootView>
	);
}
