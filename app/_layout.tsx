import { Slot } from "expo-router";
import ToastManager from "toastify-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import store from "@/store/store";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
	return (
		<GestureHandlerRootView>
			<SafeAreaProvider>
				<Provider store={store}>
					<ToastManager />
					<SafeAreaView style={{ flex: 1 }}>
						<Slot />
					</SafeAreaView>
				</Provider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}
