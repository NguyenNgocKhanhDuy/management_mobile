import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, FlatList, TouchableOpacity } from "react-native";
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import Constanst from "expo-constants";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { setTaskId } from "@/store/TaskSlice";
import { setToken } from "@/store/UserSlice";

interface Task {
  id: string;
  name: string;
  status: string;
  deadline: string;
}

interface SearchScreenProps {
  token: string;
}

export default function SearchScreen({ token }: SearchScreenProps) {
  const [searchText, setSearchText] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskId, settaskId] = useState("");
	const dispatch = useDispatch();

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${Constanst.expoConfig?.extra?.API_URL}/tasks/search`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          taskName: searchText,
        },
      });

      if (response.data.status) {
        setTasks(response.data.result); // Lưu kết quả trả về vào state `tasks`
      } else {
        Alert.alert("Error", "Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      Alert.alert("Error", "An error occurred while fetching tasks");
    }
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity onPress={() => handleTaskPress(item.id)}>
      <View style={styles.taskCard}>
        <Text style={styles.taskName}>{item.name}</Text>
        <Text style={styles.taskStatus}>Trạng thái: {item.status}</Text>
        <Text style={styles.taskDeadline}>Hạn chót: {new Date(item.deadline).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
  const handleTaskPress = (id: string) => {
    dispatch(setTaskId(id)); // Cập nhật taskId vào Redux
    dispatch(setToken(token)); // Cập nhật token vào Redux (nếu cần)
    router.navigate("/TaskDetail/TaskDetail"); // Điều hướng sang trang TaskDetail
  };
  

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <View style={styles.inputContainer}>
            <Icon name="search" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Tìm kiếm"
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
              onSubmitEditing={fetchTasks}
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Hiển thị danh sách tasks */}
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          contentContainerStyle={styles.taskList}
          ListEmptyComponent={<Text style={styles.emptyText}>Không có kết quả tìm kiếm</Text>}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ddd",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
    borderRadius: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: "#9da8b7",
    backgroundColor: "#ddd",
  },
  icon: {
    marginRight: 5,
    color: "#333",
    fontSize: 25,
  },
  titleContainer: {
    height: 80,
    width: "100%",
    backgroundColor: "#323b46",
    justifyContent: "center",
    alignItems: "center",
  },
  taskList: {
    padding: 10,
  },
  taskCard: {
    backgroundColor: "#323b46",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  taskName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  taskStatus: {
    fontSize: 14,
    color: "#9da8b7",
    marginTop: 5,
  },
  taskDeadline: {
    fontSize: 14,
    color: "#f0ad4e",
    marginTop: 5,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#9da8b7",
  },
});
