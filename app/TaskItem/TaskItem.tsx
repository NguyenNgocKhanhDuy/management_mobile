import React, { useState, useEffect, useCallback } from "react";
import { Animated, Text, Dimensions, View, Image, TouchableOpacity } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { taskItemStyles } from "./TaskItem.styles";
import { FontAwesome } from "@expo/vector-icons";

export default function TaskItem(props: any) {
	const [opacity] = useState(new Animated.Value(1));
	const translateX = useState(new Animated.Value(0))[0];
	const translateY = useState(new Animated.Value(0))[0];

	const screenWidth = Dimensions.get("window").width;
	const [hasMoved, setHasMoved] = useState(false);

	const blackImg = require("../../assets/images/black.jpg");

	const onGestureEvent = Animated.event(
		[
			{
				nativeEvent: {
					translationX: translateX,
					translationY: translateY,
				},
			},
		],
		{ useNativeDriver: true }
	);

	useEffect(() => {
		const listenerId = translateX.addListener(({ value }) => {
			if (value > screenWidth * 0.2 && !hasMoved) {
				setHasMoved(true);
				props.onMoveRight(props.task.id);
				console.log(`Task ID: ${props.task.id}, New Board Status: ${props.task.status}`);
			} else if (value < -screenWidth * 0.2 && !hasMoved) {
				setHasMoved(true);
				props.onMoveLeft(props.task.id);
				console.log(`Task ID: ${props.task.id}, New Board Status: ${props.task.status}`);
			}
		});

		const listenerIdY = translateY.addListener(({ value }) => {
			if (Math.abs(value) > 50 && !hasMoved) {
				setHasMoved(true);
				const direction = value > 0 ? "down" : "up"; // Di chuyển lên hoặc xuống
				handlePositionChange(direction);
			}
		});

		return () => {
			translateX.removeListener(listenerId);
			translateY.removeListener(listenerIdY);
		};
	}, [translateX, translateY, screenWidth, props, hasMoved]);

	const handlePositionChange = (direction: "up" | "down") => {
		if (direction === "up") {
			props.onMoveUp(props.task.id); // Gọi hàm onMoveUp khi kéo lên
		} else if (direction === "down") {
			props.onMoveDown(props.task.id); // Gọi hàm onMoveDown khi kéo xuống
		}
	};

	const onHandlerStateChange = useCallback(
		(event: any) => {
			if (event.nativeEvent.state === State.ACTIVE) {
				console.log(`Task ID: ${props.task.id}, Board Status: ${props.task.status}, Dragging started`);
				Animated.timing(opacity, {
					toValue: 0.7,
					duration: 200,
					useNativeDriver: true,
				}).start();
			}

			if (event.nativeEvent.state === State.END || event.nativeEvent.state === State.CANCELLED) {
				console.log(`Task ID: ${props.task.id}, Board Status: ${props.task.status}, Dragging ended`);
				Animated.timing(opacity, {
					toValue: 1,
					duration: 200,
					useNativeDriver: true,
				}).start();

				Animated.spring(translateX, {
					toValue: 0,
					useNativeDriver: true,
				}).start(() => {
					setHasMoved(false); // Đặt lại cờ khi hoàn thành animation
				});

				Animated.spring(translateY, {
					toValue: 0,
					useNativeDriver: true,
				}).start();

				props.onDrop(props.task.id);
			}
		},
		[opacity, translateX, translateY, props.task.id, props.task.status]
	);

	return (
		<PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
			<Animated.View style={[taskItemStyles.taskItem, { width: "100%", opacity, transform: [{ translateX }, { translateY }] }, taskItemStyles.container]}>
				<View style={taskItemStyles.date}>
					<FontAwesome name="calendar" style={taskItemStyles.dateText} />
					<Text style={taskItemStyles.dateText}>September 20</Text>
				</View>
				<Text style={taskItemStyles.name}>{props.task.name}</Text>
				<View style={taskItemStyles.info}>
					<Image style={taskItemStyles.avatar} source={blackImg} />
					<View style={taskItemStyles.date}>
						<FontAwesome name="flag" style={taskItemStyles.dateText} />
						<Text style={taskItemStyles.dateText}>September 28</Text>
					</View>
				</View>
			</Animated.View>
		</PanGestureHandler>
	);
}
