import { Colors } from "@/assets/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 10,
		paddingBottom: 20,
	},

	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginVertical: 20,
	},

	flexRowItem: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: 20,
	},

	flexRowLayout: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	avatar: {
		borderRadius: 50,
		width: 30,
		height: 30,
	},

	icon: {
		fontSize: 20,
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

	baseProgress: {
		height: 5,
		backgroundColor: Colors.whiteGreen,
	},

	completeProgress: {
		position: "absolute",
		top: 0,
		left: 0,
		height: 5,
		backgroundColor: Colors.lightGreen,
	},
});
