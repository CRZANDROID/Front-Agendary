import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal, SafeAreaView, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('Josue Galdamez Cruz');
  const [phone, setPhone] = useState('9683934023');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedPhone, setEditedPhone] = useState(phone);

  const handleSaveName = () => {
    setName(editedName);
    setIsEditingName(false);
  };

  const handleSavePhone = () => {
    setPhone(editedPhone);
    setIsEditingPhone(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <Image source={require('../assets/profile.jpg')} style={styles.profileImage} />
          <TouchableOpacity style={styles.editIcon}>
            <FontAwesome name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <FontAwesome name="user" size={24} color="#268AAB" />
          <Text style={styles.infoText}>{name}</Text>
          <TouchableOpacity onPress={() => setIsEditingName(true)}>
            <FontAwesome name="edit" size={24} color="#268AAB" />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoItem}>
          <FontAwesome name="phone" size={24} color="#268AAB" />
          <Text style={styles.infoText}>{phone}</Text>
          <TouchableOpacity onPress={() => setIsEditingPhone(true)}>
            <FontAwesome name="edit" size={24} color="#268AAB" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.appointmentButton} onPress={() => navigation.navigate('Appointments')}>
          <Text style={styles.appointmentButtonText}>Ver citas</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isEditingName} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Escribe tu nombre</Text>
            <TextInput
              style={styles.input}
              value={editedName}
              onChangeText={setEditedName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setIsEditingName(false)}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveName}>
                <Text style={styles.modalButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isEditingPhone} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Escribe tu número</Text>
            <TextInput
              style={styles.input}
              value={editedPhone}
              onChangeText={setEditedPhone}
              keyboardType="phone-pad"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setIsEditingPhone(false)}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSavePhone}>
                <Text style={styles.modalButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#268AAB',
    marginLeft: 10,
  },
  logo: {
    width: 90,
    height: 70,
    resizeMode: 'contain',
    marginLeft: 'auto',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#37A8CD',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    backgroundColor: '#37A8CD',
    borderRadius: 15,
    padding: 5,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20, 
  },
  appointmentButton: {
    width: '50%',
    backgroundColor: '#268AAB',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  appointmentButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    marginTop: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  modalButtonText: {
    fontSize: 18,
    color: '#268AAB',
  },
});

export default ProfileScreen;
