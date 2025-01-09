import { Colors } from "@/assets/Colors";
import { StyleSheet } from "react-native";

export const taskStyles = StyleSheet.create({
	carousel: {
		flex: 1,
	},

	topBar: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: 60,
		zIndex: 999,
		paddingHorizontal: 12,
		backgroundColor: "rgba(0, 0, 0, 0.8)",
	},

	flexRowLayout: {
		display: "flex",
		flexDirection: "row",
		alignContent: "center",
		justifyContent: "space-between",
	},

	text: {
		fontSize: 24,
		lineHeight: 60,
		marginLeft: 30,
		color: "#fff",
	},

	input: {
		borderWidth: 1,
		width: 200,
		borderColor: "#ccc",
		padding: 10,
		borderRadius: 5,
	},

	button: {
		backgroundColor: Colors.green,
		width: "auto",
		borderRadius: 5,
		alignSelf: "flex-start",
		padding: 10,
	},

	buttonText: {
		color: "#fff",
		fontSize: 16,
	},

	icon: {
		fontSize: 20,
		lineHeight: 60,
		color: "#fff",
	},

	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
	},
});
