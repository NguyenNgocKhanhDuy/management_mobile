import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Alert } from 'react-native';
import { GestureHandlerRootView, ScrollView, TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import  Constanst  from 'expo-constants';
import { Constants } from 'react-native-navigation';
interface Project {
  id: string;
  name: string;
  date: string;
  creator: string;
  members: string[] | null;
  pending: string[] | null;
}
interface HomeScreenProps {
  token: string;
}
export default function HomeScreen({ token }: HomeScreenProps) {
  const [projects, setProjects] = useState<Project[]>([]); 
  const [searchText, setSearchText] = useState('');
  const images = [
    require('../../assets/images/b1.jpg'),
    require('../../assets/images/b2.jpg'),
    require('../../assets/images/b3.jpg'),
    require('../../assets/images/b4.jpg'),
  ];



  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${Constanst.expoConfig?.extra?.API_URL}/projects/projectsHasUser`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status) {
        setProjects(response.data.result);
      } else {
        Alert.alert('Error', 'Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      Alert.alert('Error', 'An error occurred while fetching projects');
    }
  };

  // Gọi API khi component được render
  useEffect(() => {
    fetchProjects();
  }, []);

 
  useEffect(() => {
    console.log('Projects:', projects); // Thêm dòng này
  }, [projects]);
  
  const filteredProjects = projects.filter(project =>
    project?.name?.trim()?.toLowerCase()?.includes(searchText?.trim()?.toLowerCase() || '')
  );


  return (
    <GestureHandlerRootView>
      <ScrollView style={styles.container}>
        <View style={styles.titleContainer}>
          <Icon name="tablet-landscape" size={25} style={styles.titleIcon} />
          <Text style={styles.title}>My boards</Text>
          <Icon name="add" size={25} style={styles.addIcon} />
        </View>
  
        <View style={styles.inputContainer}>
          <Icon name="search" style={styles.icon} />
          <TextInput style={styles.input} placeholder="Bảng" value={searchText} onChangeText={(text) => setSearchText(text)}/>
        </View>
  
        <View style={styles.contentContainer}>
          <Text style={styles.headingText}>Danh sách bảng của bạn</Text>
        </View>
  
        {filteredProjects.map((project, index) => {
          const randomImage = images[index % images.length];
          return (
            <ImageBackground
              key={project.id}
              source={randomImage}
              style={styles.boardContainer}
              imageStyle={styles.image}
            >
              <Text style={styles.nameBoard}>{project.name}</Text>
            </ImageBackground>
          );
        })}
      </ScrollView>
    </GestureHandlerRootView>
  );
  
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    nameBoard: {
      color: '#ffffff',
      fontSize: 20,
      fontWeight: 'bold',

    },
    boardContainer: {
      width: '97.5%',
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 20,
    },
    image: {
      borderRadius: 20,
      resizeMode: 'cover',

    },
    titleContainer: {
      height: 80, 
      width: '100%',
      backgroundColor: '#323b46',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#ddd',
      borderRadius: 20,
      marginHorizontal: 10, // Cách mép màn hình
      marginTop: 20, // Khoảng cách với titleContainer
      paddingHorizontal: 10,
    },
    input: {
      flex: 1,
      height: 40,
      paddingHorizontal: 10,
      color: '#333',
    },
    icon: {
      marginRight: 5,
      color: '#333',
      fontSize: 25,
    },
    contentContainer: {
      // flex: 1, 
      padding: 10,
      marginTop: 20,
      marginBottom: 20,
    },
    headingText: {
      color: '#b3bac2',
      fontSize: 25,
      fontWeight: 'bold',
    },
    title: {
      color: 'white',
      fontSize: 30,
      fontWeight: 'bold',
    },
    titleIcon: {
      color: 'white',
      fontSize: 30,
      marginRight: 10,
    },
    addIcon: {
      color: 'white',
      fontSize: 35,
      marginRight: 10,
      position: 'absolute',
      right: 0,
      fontWeight: 'bold'
    },
  });
  