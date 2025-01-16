// import React from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert} from 'react-native';
// import axios from 'axios';


// export default function NotificationsScreen() {

  
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>This is theNotify Screen</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   text: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
// });
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Pressable } from 'react-native';

type Invitation = {
  id: string;
  title: string;
};

export default function NotificationsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);

  const invitations: Invitation[] = [
    { id: '1', title: 'Project A' },
    { id: '2', title: 'Project B' },
    { id: '3', title: 'Project C' },
  ];

  const handlePress = (item: Invitation) => {
    setSelectedInvitation(item);
    setModalVisible(true);
  };

  const handleAccept = () => {
    if (selectedInvitation) {
      console.log('Accepted:', selectedInvitation.title);
    }
    setModalVisible(false);
  };

  const handleReject = () => {
    if (selectedInvitation) {
      console.log('Rejected:', selectedInvitation.title);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={invitations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: Invitation }) => (
          <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedInvitation ? `Invitation to ${selectedInvitation.title}` : ''}
            </Text>
            <View style={styles.buttonContainer}>
              <Pressable style={[styles.button, styles.acceptButton]} onPress={handleAccept}>
                <Text style={styles.buttonText}>Accept</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.rejectButton]} onPress={handleReject}>
                <Text style={styles.buttonText}>Reject</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#70be74', // Màu xanh nhạt
  },
  rejectButton: {
    backgroundColor: '#e55858', // Màu đỏ nhạt
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
