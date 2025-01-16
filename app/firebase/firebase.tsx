// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytesResumable, getDownloadURL  } from "firebase/storage";
import React from 'react';
import { View, Button, Alert,TouchableOpacity,Text } from 'react-native';
//import * as ImagePicker  from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import  { useState } from 'react';
import { Toast } from "toastify-react-native";
import axios from "axios";
import Constanst from "expo-constants";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import styles from '@/app/Profile/Profile.style';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAc_yg5itPB3X4VlCLw6z2DotSz-uhv6kg",
	authDomain: "management-71234.firebaseapp.com",
	projectId: "management-71234",
	storageBucket: "management-71234.appspot.com",
	messagingSenderId: "354337781871",
	appId: "1:354337781871:web:bf85a572f853c2e1e3759a",
	measurementId: "G-45PKLR5JQW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);


export { app, storage, analytics};

   

   
//Sử dụng upload ảnh lên bên react js
// const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// 	if (event.target.files && event.target.files[0]) {
// 		const file = event.target.files[0];

// 		const storageRef = ref(storage, `images/${file.name}`);
// 		const uploadTask = uploadBytesResumable(storageRef, file);

// 		uploadTask.on(
// 			"state_changed",
// 			(snapshot) => {
// 				props.close();
// 				props.setLoading(true);
// 				switch (snapshot.state) {
// 					case "paused":
// 						console.log("Upload is paused");
// 						props.setLoading(false);
// 						props.setErrorMessage("Upload is paused");
// 						props.setShowError(true);
// 						break;
// 					case "running":
// 						break;
// 				}
// 			},
// 			(error) => {
// 				console.error("Error uploading file: ", error);
// 				props.setLoading(false);
// 				props.setErrorMessage("Error uploading file: ", error);
// 				props.setShowError(true);
// 			},
// 			() => {
// 				getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl: string) => {
// 					console.log("File available at", downloadUrl);
// 					handleUpdateAvatar(downloadUrl);
// 				});
// 			}
// 		);
// 	}
// };

// Hàm tải ảnh lên Firebase Storage
 export const uploadImageToFirebase = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        throw new Error('Permission denied. You need to allow media access.');
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });
  
      if (result.canceled) {
        throw new Error('Image selection cancelled.');
      }
  
      // Lấy URI của ảnh được chọn
      const imageUri = result.assets[0].uri;
      const fileName = imageUri.split('/').pop();
  
      // Đọc file và convert sang blob
      const response = await fetch(imageUri);
      const blob = await response.blob();
  
      const storageRef = ref(storage, `images/${fileName}`);

      // Start uploading the file
      const uploadTask = uploadBytesResumable(storageRef, blob);
      // Gửi ảnh lên Firebase Storage
    //   const firebaseStorageUrl = `https://firebasestorage.googleapis.com/v0/b/management-71234.appspot.com/o/${fileName}`;
    //   const storageUrl = `https://firebasestorage.googleapis.com/v0/b/management-71234.appspot.com/o?name=images/${fileName}`;
  
       // Trả về Promise để theo dõi quá trình upload
    return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Xử lý tiến trình upload
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Uploading: ${progress}%`);
          },
          (error) => {
            // Xử lý lỗi
            console.error('Upload failed:', error);
            reject('Upload failed');
          },
          async () => {
            // Sau khi upload xong, lấy download URL
            try {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              console.log('File available at:', downloadUrl);
              resolve(downloadUrl);  // Resolve Promise với URL tải xuống
            } catch (error) {
              reject('Error getting download URL');
            }
          }
        );
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };
  