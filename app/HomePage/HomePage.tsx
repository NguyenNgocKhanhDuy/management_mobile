import { router } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

function HomePage() {
	return (
		<View style={styles.container}>
			<Text>Home Page</Text>
			<Button title="Go To Test" onPress={() => router.push("./Task/Task")} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default HomePage;
