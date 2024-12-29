import { StyleSheet } from "react-native";

export const boardStyles = StyleSheet.create({
	board: {
		width: "80%",
		height: "auto",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#f0f0f0",
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 10,
		marginTop: 80,
		padding: 20,
		marginHorizontal: "auto",
	},

	todo: {
		backgroundColor: "purple",
	},
	pending: {
		backgroundColor: "orange",
	},
	done: {
		backgroundColor: "green",
	},

	title: {
		color: "#fff",
		fontSize: 24,
		fontWeight: "600",
		textShadowColor: "#000",
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 3,
	},
});
