import React, { useEffect, useState } from "react";
import { View, Text, Alert, TouchableOpacity, ScrollView } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Constanst from "expo-constants";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import { StyleSheet } from "react-native";
import { formatToLocalDateTime, dateShortFull } from "@/utils/date"; // Import các hàm định dạng thời gian

interface Log {
  action: string;
  dateTime: string;
  id: string;
  project: string;
  subTaskLog: { id: string; name: string } | null;
  taskLog: { id: string; name: string; status: string | null } | null;
  userLog: { id: string; name: string };
}

const ActivityScreen: React.FC = () => {
  const navigation = useNavigation();
  const token = useSelector((state: RootState) => state.user.token);
  const idProject = useSelector((state: RootState) => state.task.idProject);
  const [logs, setLogs] = useState<Log[]>([]);

  // Hàm fetchLogs
  const fetchLogs = async () => {
    try {
      const response = await axios.get(
        `${Constanst.expoConfig?.extra?.API_URL}/logs/${idProject}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        // Sắp xếp logs theo thời gian (mới nhất lên đầu)
        const sortedLogs = response.data.result.sort(
          (a: Log, b: Log) =>
            new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
        );
        setLogs(sortedLogs);
      } else {
        Alert.alert("Lỗi", "Không thể lấy danh sách hoạt động");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API logs:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi lấy danh sách hoạt động");
    }
  };
  const adjustedDate = (date: Date, offsetHours: number): Date => {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + offsetHours);
    return newDate;
  };
  
  // Gọi fetchLogs khi load trang
  useEffect(() => {
    fetchLogs();
  }, []);

  // Hàm xử lý quay về trang trước
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Activity</Text>
      </View>
      <ScrollView style={styles.contentContainer}>
        {logs.map((item) => {
          const taskName = item.taskLog?.name || "";
          const subTaskName = item.subTaskLog?.name || "";
          const dateTime = dateShortFull(adjustedDate(new Date(item.dateTime), 7));
          return (
            <View key={item.id} style={styles.logItem}>
              <Text style={styles.logText}>
                <Text style={styles.userName}>{item.userLog.name}</Text>
                {item.action}
                {taskName && (
                  <Text style={styles.taskName}>{` ${taskName}`}</Text>
                )}
                {subTaskName && (
                  <Text style={styles.taskName}>{` ${subTaskName}`}</Text>
                )}
              </Text>
              <Text style={styles.dateTime}>{dateTime}</Text>
            </View>
          );
        })}
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  titleContainer: {
    height: 80,
    width: "100%",
    backgroundColor: "#323b46",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  backButton: {
    position: "absolute",
    left: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    marginTop: 10,
  },
  logItem: {
    backgroundColor: "#2c3e50",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  logText: {
    color: "white",
    fontSize: 16,
  },
  userName: {
    fontWeight: "bold",
    color: "#1abc9c",
  },
  taskName: {
    fontStyle: "italic",
    color: "#3498db",
  },
  dateTime: {
    color: "#bdc3c7",
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
  },
});

export default ActivityScreen;
