import { StyleSheet } from "react-native";
export const loginStyles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
		backgroundColor: "#f7f7f7",
	},
	welcomeText: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 10,
	},
	subText: {
		fontSize: 16,
		color: "#777",
		marginBottom: 20,
	},
	input: {
		width: "100%",
		height: 50,
		borderColor: "#ddd",
		borderWidth: 1,
		borderRadius: 10,
		paddingLeft: 15,
		marginBottom: 15,
		backgroundColor: "#fff",
	},
	loginButton: {
		width: "100%",
		height: 50,
		backgroundColor: "#2d7f39",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
		marginBottom: 20,
	},
	buttonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
	footer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 10,
	},
	footerText: {
		color: "#2d7f39",
		fontSize: 14,
	},
	qrButton: {
		color: "blue",
		fontSize: 18,
		textAlign: "center",
		marginVertical: 10,
	},

	flexItem: {
		marginTop: 20,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	cancelButton: {
		position: "absolute",
		top: 10,
		right: 10,
		padding: 10,
	},
	cancelButtonText: {
		color: "#fff",
		fontWeight: "bold",
	},

	selectImg: {
		position: "absolute",
		bottom: 50,
		left: "50%",
		transform: [{ translateX: -15 }],
		padding: 20,
	},
});
