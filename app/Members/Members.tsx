import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import React from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { membersStyle } from "./Members.style";

export default function Members() {
	const blackImg = require("@/assets/images/black.jpg");

	return (
		<View style={membersStyle.container}>
			<View style={[membersStyle.topBar]}>
				<TouchableOpacity style={{ position: "absolute", left: 10 }}>
					<FontAwesome6 name="xmark" style={[membersStyle.icon, { color: "#fff", lineHeight: 60 }]} />
				</TouchableOpacity>
				<View style={{ marginHorizontal: "auto", transform: [{ translateX: -12 }] }}>
					<Text style={membersStyle.title}>Members</Text>
				</View>
			</View>
			<View style={{ marginTop: 80 }}>
				<TextInput style={membersStyle.input} placeholder="Email" />
				<ScrollView style={{ marginTop: 30 }}>
					<TouchableOpacity style={[membersStyle.flexRowLayout, membersStyle.box]}>
						<View style={[membersStyle.flexRowItem]}>
							<Image source={blackImg} style={membersStyle.image} />
							<View>
								<Text style={membersStyle.text}>Nguyen Ngoc Khanh Duy</Text>
								<Text style={membersStyle.text}>21130035@st.hcmuaf.edu.vn</Text>
							</View>
						</View>
						<View style={[membersStyle.flexRowItem]}>
							<TouchableOpacity>
								<FontAwesome6 name="plus" style={membersStyle.icon} />
							</TouchableOpacity>
							<TouchableOpacity>
								<FontAwesome6 name="trash" style={[membersStyle.icon]} />
							</TouchableOpacity>
						</View>
					</TouchableOpacity>
				</ScrollView>
			</View>
		</View>
	);
}
