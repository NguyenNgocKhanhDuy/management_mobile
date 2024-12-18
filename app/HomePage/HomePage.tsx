import { router } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function HomePage() {
	return (
		<GestureHandlerRootView>
			<Text>Home Page</Text>
			<Button title="Go To Test" onPress={() => router.push("./Task/Task")} />
		</GestureHandlerRootView>
	);
}

export default HomePage;
