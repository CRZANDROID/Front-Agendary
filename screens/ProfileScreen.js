import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal, SafeAreaView, StatusBar, Alert, ActivityIndicator, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import UserContext from '../contexts/UserContext';
import axios from 'axios';

const ProfileScreen = ({ navigation }) => {
  const { user, token, setUser } = useContext(UserContext);
  const [uuid, setUuid] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const defaultProfileImage = require('../assets/profile.jpg'); 

  useFocusEffect(
    useCallback(() => {
      if (user) {
        initializeUserData(user);
      }
    }, [user])
  );

  const initializeUserData = (userData) => {
    setUuid(userData.uuid);
    setName(userData.name);
    setLastname(userData.lastname);
    setPhone(userData.phone_number);
    setEditedName(userData.name);
    setEditedPhone(userData.phone_number);
    setProfileImage(userData.profile ? { uri: userData.profile + '?' + new Date().getTime() } : defaultProfileImage);
    setLoading(false);
  };

  const handleSaveName = async () => {
    if (!uuid) {
      Alert.alert('Error', 'ID de usuario no disponible');
      return;
    }

    try {
      console.log(`Updating user name for UUID: ${uuid}`); 
      await axios.put(`http://3.80.92.37:8000/api/v1/update/${uuid}`, {
        name: editedName,
        lastname,
        phone_number: phone,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('User name updated successfully'); 
      setIsEditingName(false);
      Alert.alert('Éxito', 'Nombre actualizado correctamente.');
      setUser((prevUser) => ({
        ...prevUser,
        name: editedName,
      }));
    } catch (error) {
      if (error.response) {
        console.log('Error updating user name:', error.response.data.message);
        Alert.alert('Error', error.response.data.message || 'No se pudo actualizar el nombre.');
      } else {
        console.log('Error connecting to server:', error.message); 
        Alert.alert('Error', 'No se pudo conectar con el servidor.');
      }
    }
  };

  const handleSavePhone = async () => {
    if (!uuid) {
      Alert.alert('Error', 'ID de usuario no disponible');
      return;
    }

    if (editedPhone.length !== 10) {
      Alert.alert('Error', 'El número de teléfono debe tener 10 dígitos.');
      return;
    }

    try {
      console.log(`Updating user phone number for UUID: ${uuid}`); 
      await axios.put(`http://3.80.92.37:8000/api/v1/update/${uuid}`, {
        name,
        lastname,
        phone_number: editedPhone,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('User phone number updated successfully'); 
      setIsEditingPhone(false);
      Alert.alert('Éxito', 'Número de teléfono actualizado correctamente.');
      setUser((prevUser) => ({
        ...prevUser,
        phone_number: editedPhone,
      }));
    } catch (error) {
      if (error.response) {
        console.log('Error updating user phone number:', error.response.data.message); 
        Alert.alert('Error', error.response.data.message || 'No se pudo actualizar el número de teléfono.');
      } else {
        console.log('Error connecting to server:', error.message); 
        Alert.alert('Error', 'No se pudo conectar con el servidor.');
      }
    }
  };

  const handleSaveProfileImage = async () => {
    if (!newProfileImage || !uuid) {
      console.log('No new profile image or UUID available.');
      return;
    }

    console.log('Uploading new profile image');
    const formData = new FormData();
    formData.append('file', {
      uri: Platform.OS === 'android' ? newProfileImage.uri : newProfileImage.uri.replace('file://', ''),
      type: newProfileImage.mimeType,
      name: newProfileImage.fileName
    });

    try {
      const response = await axios.post(`http://3.80.92.37:8000/api/v1/add/image/${uuid}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Profile image uploaded successfully');
      setProfileImage({ uri: newProfileImage.uri + '?' + new Date().getTime() });
      setUser((prevUser) => ({
        ...prevUser,
        profile: newProfileImage.uri,
      }));
      setNewProfileImage(null);
      Alert.alert('Éxito', 'Foto de perfil actualizada correctamente.');
    } catch (error) {
      if (error.response) {
        console.log('Error uploading profile image:', error.response.data.message);
        Alert.alert('Error', error.response.data.message || 'No se pudo actualizar la foto de perfil.');
      } else {
        console.log('Error connecting to server:', error.message);
        Alert.alert('Error', 'No se pudo conectar con el servidor.');
      }
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permiso requerido', 'Se requiere acceso a la galería para cambiar la foto de perfil.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      console.log('New profile image selected:', result.assets[0]);
      setNewProfileImage(result.assets[0]);
      handleSaveProfileImage(); 
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#268AAB" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome name="chevron-left" size={20} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil</Text>
        </View>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <Image source={profileImage} style={styles.profileImage} key={profileImage.uri} />
          <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
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
              maxLength={10} 
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
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: -20, 
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
    borderWidth: 4, 
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;