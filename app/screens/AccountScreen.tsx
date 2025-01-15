import { router } from "expo-router";
import React ,{useState,useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity ,Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import axios from "axios";
import Constanst from "expo-constants";

export default function AccountScreen() {
const [username, setUsername] = useState<string | null>(null);
  const [userMail, setUserMail] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string| null>(null);
const token = useSelector((state: RootState) => state.user.token);
  console.log('Kết quả trả về:', token);
  const [email, setEmail] = useState('');
  const blackImg = require("../../assets/images/b1.jpg");

    // Hàm tải dữ liệu từ API
    useEffect(() => {
    const fetchUserData = async () => {
      const handleGetUserName = async () => {
        try {
          const response = await axios.get(`${Constanst.expoConfig?.extra?.API_URL}/users/user`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
      
          //const data = response.data;
          if (response.data?.status && response.data.result?.username) {
            console.log('Kết quả trả về:', username);
            return response.data.result.username;
      
            
          }
        //	console.log('Kết quả trả về:', response.data.username);
        } catch (error: any) {
          if (error.response) {
            console.error("Error:", error.response.data.message || error.response.data.error);
          } else if (error.request) {
            console.error("Error:", error.request);
          } else {
            console.error("Error:", error.message);
          }
        }
      };
      const handleGetAvatar = async () => {
        try {
          const response = await axios.get(`${Constanst.expoConfig?.extra?.API_URL}/users/user`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
      
          //const data = response.data;
          if (response.data?.status && response.data.result?.avatar) {
            console.log('Kết quả trả về:', avatar);
            return response.data.result.avatar;
      
            
          }
        //	console.log('Kết quả trả về:', response.data.username);
        } catch (error: any) {
          if (error.response) {
            console.error("Error:", error.response.data.message || error.response.data.error);
          } else if (error.request) {
            console.error("Error:", error.request);
          } else {
            console.error("Error:", error.message);
          }
        }
      };
      const handleGetEmail = async () => {
        try {
          const response = await axios.get(`${Constanst.expoConfig?.extra?.API_URL}/users/user`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
      
          //const data = response.data;
          if (response.data?.status && response.data.result?.email) {
            console.log('Kết quả trả về:', email);
            return response.data.result.email;
      
            
          }
        //	console.log('Kết quả trả về:', response.data.username);
        } catch (error: any) {
          if (error.response) {
            console.error("Error:", error.response.data.message || error.response.data.error);
          } else if (error.request) {
            console.error("Error:", error.request);
          } else {
            console.error("Error:", error.message);
          }
        }
      };

     
        // Gọi API lấy username khi vào màn hình
        const fetchUsername = async () => {
          const fetchedUsername = await handleGetUserName();
          setUsername(fetchedUsername); // Cập nhật state
        };
        const fetchAvatar = async ()=>{
          const fetchedAvatar = await handleGetAvatar();
          setAvatar(fetchedAvatar)
        }
        const fetchMail = async ()=>{
          const fetchedMail = await handleGetEmail();
          setUserMail(fetchedMail)
        }
     
        fetchMail();
        fetchAvatar();
        fetchUsername();
     
    }

  fetchUserData()
}, 
[]);
  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
				<View style={styles.avatarContainer}>
        <View style={{ marginTop: 30 }}>
					<Image
					source={avatar ? { uri: avatar } : blackImg}
					style={styles.profileImage}/>
				</View>
				</View>
				<Text style={styles.nameText}>{username || "loading..."}</Text>
				<Text style={styles.usernameText}>@{username || "loading..."}</Text>
				<Text style={styles.emailText}>{userMail || "loading..."}</Text>
				<Text style={styles.memberText}>Là thành viên Trello từ tháng 3 năm 2024</Text>
			  </View>

      {/* Workspaces Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Các dự án làm việc của bạn</Text>
        <View style={styles.menuItem}>
          <Icon name="people-outline" size={24} color="#fff" />
          <Text style={styles.menuText}>2024_DW_Thu3_Ca3_Nhom7</Text>
        </View>
        <View style={styles.menuItem}>
          <Icon name="people-outline" size={24} color="#fff" />
          <Text style={styles.menuText}>Trello Workspace</Text>
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Tài khoản</Text>
        <View style={styles.menuItem}>
        <TouchableOpacity
        onPress={() => router.push("/Profile/Profile")}
        style={styles.menuItem}
      >
          <Icon name="person-outline" size={24} color="#fff" />
      <Text style={styles.menuText}>Hồ sơ và Hiển thị</Text>
      </TouchableOpacity>
    
        </View>
        <View style={styles.menuItem}>
          <Icon name="swap-horizontal-outline" size={24} color="#fff" />
          <Text style={styles.menuText}>Chuyển Đổi Tài Khoản</Text>
        </View>
        <View style={styles.menuItem}>
          <Icon name="bug-outline" size={24} color="#fff" />
          <Text style={styles.menuText}>Hãy là người kiểm tra bản beta</Text>
        </View>
        <View style={styles.menuItem}>
          <Icon name="globe-outline" size={24} color="#fff" />
          <Text style={styles.menuText}>Quản lý tài khoản trên trình duyệt</Text>
          <Text style={styles.subText}>Xem lại các tài khoản đã đăng nhập và xóa khỏi trình duyệt</Text>
        </View>
        <View style={styles.menuItem}>
          <Icon name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.menuText}>Đăng Xuất</Text>
        </View>
      </View>

      {/* Interface Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Giao diện</Text>
        <View style={styles.menuItem}>
          <Icon name="phone-portrait-outline" size={24} color="#fff" />
          <Text style={styles.menuText}>Cài biểu tượng ứng dụng</Text>
        </View>
        <View style={styles.menuItem}>
          <Icon name="color-palette-outline" size={24} color="#fff" />
          <Text style={styles.menuText}>Chọn chủ đề</Text>
        </View>
      </View>

    </ScrollView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D2125',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#26B5C0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  nameText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop:10,
  },
  usernameText: {
    color: '#B6C2CF',
    fontSize: 16,
    marginBottom: 5,
  },
  emailText: {
    color: '#B6C2CF',
    fontSize: 16,
    marginBottom: 5,
  },
  memberText: {
    color: '#B6C2CF',
    fontSize: 14,
    fontStyle: 'italic',
  },
  sectionContainer: {
    padding: 16,
  },
  sectionTitle: {
    color: '#B6C2CF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  subText: {
    color: '#B6C2CF',
    fontSize: 12,
    position: 'absolute',
    left: 34,
    top: 35,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#2D3135',
    paddingVertical: 8,
    backgroundColor: '#1D2125',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#B6C2CF',
    fontSize: 12,
    marginTop: 4,
  },
  activeNavText: {
    color: '#26B5C0',
  },
  smallAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#26B5C0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallAvatarText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

