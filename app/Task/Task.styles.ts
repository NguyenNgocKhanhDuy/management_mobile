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
		backgroundColor: "rgba(0, 0, 0, 0.3)",
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
	},

	icon: {
		fontSize: 20,
		lineHeight: 60,
	},
});
