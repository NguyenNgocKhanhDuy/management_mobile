import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#1D2125',
    },
    profileImageContainer: {
      alignItems: 'center',
      marginBottom: 10,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
    },
    changePhotoButton: {
      backgroundColor: '#3D4135',
      borderRadius: 5,
      padding: 10,
    },
    changePhotoButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    changePasswordContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
    changePasswordButton: {
      backgroundColor: '#38a125',
      borderRadius: 5,
      padding: 10,
    },
    changePasswordButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    header: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'left',
      color: '#ffffff',
    },
    input: {
      height: 40,
      width:350,
      borderWidth: 1,
      borderColor: '#fff',
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 15,
      backgroundColor: '#3D4135',
      color:"#fff"
    },
    Text:{
      fontSize: 14,
      fontWeight: 'medium',
      textAlign: 'left',
      color: '#ffffff',
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
    profileSection: {
      alignItems: 'center',
      padding: 20,
    },
  });

export default styles;
