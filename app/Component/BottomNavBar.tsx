import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type BottomNavBarProps = {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
};

const TabNavigation: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab }) => {
  const handleTabPress = (tab: string) => {
    setActiveTab(tab); // Set active tab when a tab is pressed
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'Home' && styles.activeTab]}
        onPress={() => handleTabPress('Home')}
      >
        <Icon name="tablet-landscape" size={30} color={activeTab === 'Home' ? '#579bfc' : '#a1adbd'} />
        <Text style={[styles.tabText, activeTab === 'Home' && styles.activeTabText]}>Bảng</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'Search' && styles.activeTab]}
        onPress={() => handleTabPress('Search')}
      >
        <Icon name="search" size={30} color={activeTab === 'Search' ? '#579bfc' : '#a1adbd'} />
        <Text style={[styles.tabText, activeTab === 'Search' && styles.activeTabText]}>Tìm kiếm</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'Notifications' && styles.activeTab]}
        onPress={() => handleTabPress('Notifications')}
      >
        <Icon name="notifications" size={30} color={activeTab === 'Notifications' ? '#579bfc' : '#a1adbd'} />
        <Text style={[styles.tabText, activeTab === 'Notifications' && styles.activeTabText]}>Thông báo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'Account' && styles.activeTab]}
        onPress={() => handleTabPress('Account')}
      >
        <Icon name="person" size={30} color={activeTab === 'Account' ? '#579bfc' : '#a1adbd'} />
        <Text style={[styles.tabText, activeTab === 'Account' && styles.activeTabText]}>Tài khoản</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Arrange items horizontally
    justifyContent: 'space-around', // Distribute tabs evenly
    alignItems: 'center',
    backgroundColor: '#282d33',
    padding: 10,
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  tab: {
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
  },
  tabText: {
    fontSize: 12,
    color: '#a1adbd',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#579bfc', // Highlight active tab with a border
  },
  activeTabText: {
    color: '#579bfc', // Active tab text color
  },
});

export default TabNavigation;
