
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomNavBar from './Component/BottomNavBar';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import AccountScreen from './screens/AccountScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLocalSearchParams, useRouter } from 'expo-router';

const App = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const { token } = useLocalSearchParams(); // Lấy tham số từ router



  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen token={token as string}/>;
      case 'Search':
        return <SearchScreen token={token as string}/>;
      case 'Notifications':
        return <NotificationsScreen />;
      case 'Account':
        return <AccountScreen token={token as string}/>;
      default:
        return <HomeScreen token={token as string}/>;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

    <View style={styles.container}>
      {renderScreen()}
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
    </GestureHandlerRootView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default App;