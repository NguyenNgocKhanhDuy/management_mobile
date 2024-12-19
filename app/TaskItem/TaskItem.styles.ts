import { StyleSheet } from "react-native";

export const taskItemStyles = StyleSheet.create({
	container: {
		width: "100%",
		backgroundColor: "#fff",
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		margin: 12,
		padding: 12,
	},

	taskItem: {
		marginBottom: 10,
		borderRadius: 5,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 3,
	},

	date: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},

	dateText: {
		fontSize: 16,
	},

	name: {
		fontSize: 20,
		fontWeight: "600",
		marginVertical: 12,
		borderBottomColor: "#000",
		borderBottomWidth: 1,
		paddingBottom: 12,
	},

	info: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	avatar: {
		width: 30,
		height: 30,
		borderRadius: 50,
	},
});
