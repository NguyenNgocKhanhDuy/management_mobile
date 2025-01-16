import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function AccountScreen() {
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
  {projects.length > 0 ? (
    projects.map((project) => (
      <TouchableOpacity style={styles.menuItem} key={project.id} onPress={() => handleNavigateToProjectTask(project.id)}>
        <Icon name="people-outline" size={24} color="#fff" />
        <Text style={styles.menuText}>{project.name}</Text>
      </TouchableOpacity>
    ))
  ) : (
    <Text style={styles.menuText}>Không có dự án nào</Text>
  )}
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
          <Text style={styles.menuText} onPress={handleAccountSwitch}>Chuyển Đổi Tài Khoản</Text>
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
          <Text style={styles.menuText} onPress={handleAccountSwitch}>Đăng Xuất</Text>
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

