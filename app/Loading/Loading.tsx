import { ActivityIndicator, StyleSheet, View } from "react-native";
import React from "react";
import { Colors } from "@/assets/Colors";

export default function Loading() {
	return (
		<View style={styles.container}>
			<ActivityIndicator size="large" color={Colors.lightGreen} />
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.2)",
		zIndex: 9999,
	},
});
