import { Colors } from "@/assets/Colors";
import { StyleSheet } from "react-native";

export const membersStyle = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		alignContent: "center",
		padding: 20,
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
	title: {
		fontSize: 24,
		lineHeight: 60,
		marginLeft: 30,
		color: "#fff",
	},

	input: {
		borderWidth: 1,
		borderRadius: 5,
		height: 40,
		fontSize: 16,
		paddingHorizontal: 10,
	},
	box: {
		borderWidth: 1,
		padding: 12,
		borderRadius: 5,
		marginBottom: 30,
	},
	flexRowItem: {
		display: "flex",
		flexDirection: "row",
		alignContent: "center",
		gap: 16,
	},
	flexRowLayout: {
		display: "flex",
		flexDirection: "row",
		alignContent: "center",
		justifyContent: "space-between",
	},
	flexColumn: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignContent: "center",
	},
	image: {
		width: 30,
		height: 30,
		borderRadius: 50,
		marginTop: 6,
	},
	text: {
		fontSize: 16,
	},
	icon: {
		fontSize: 16,
		lineHeight: 40,
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
	modalImage: {
		width: 60,
		height: 60,
		borderRadius: 50,
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
});
