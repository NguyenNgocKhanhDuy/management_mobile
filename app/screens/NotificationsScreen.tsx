import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert} from 'react-native';
import axios from 'axios';


export default function NotificationsScreen() {

  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is theNotify Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
