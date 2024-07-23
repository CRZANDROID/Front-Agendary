import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import UserContext from '../contexts/UserContext';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const EditBusinessScreen = ({ route, navigation }) => {
  const { business } = route.params;
  const { token } = useContext(UserContext);

  const [selectedCategory, setSelectedCategory] = useState(business.category);
  const [openingTime, setOpeningTime] = useState(moment(business.opening_hours, 'HH:mm:ss').toDate());
  const [closingTime, setClosingTime] = useState(moment(business.closing_hours, 'HH:mm:ss').toDate());
  const [isOpeningTimePickerVisible, setOpeningTimePickerVisible] = useState(false);
  const [isClosingTimePickerVisible, setClosingTimePickerVisible] = useState(false);
  const [selectedDays, setSelectedDays] = useState(business.days.split(','));
  const [name, setName] = useState(business.name);
  const [address, setAddress] = useState(business.address);
  const [description, setDescription] = useState(business.description);
  const [profileImage, setProfileImage] = useState(business.portrait ? { uri: business.portrait } : require('../assets/placeholder.png'));
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const daysOfWeek = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await axios.get(`http://75.101.248.20:8000/api/v1/establishment/gallery/${business.uuid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGalleryImages(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching gallery:', error);
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, [business.uuid, token]);

  const handleSave = async () => {
    try {
      await axios.put(`http://75.101.248.20:8000/api/v1/establishment/update/${business.uuid}`, {
        name,
        description,
        opening_hours: moment(openingTime).format('HH:mm:ss'),
        closing_hours: moment(closingTime).format('HH:mm:ss'),
        days: selectedDays.join(','),
        address,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert('Éxito', 'Negocio actualizado correctamente.');
      navigation.goBack();
    } catch (error) {
      if (error.response) {
        console.error('Error updating business:', error.response.data);
        Alert.alert('Error', error.response.data.message || 'No se pudo actualizar el negocio.');
      } else {
        console.error('Error connecting to server:', error.message);
        Alert.alert('Error', 'No se pudo conectar con el servidor.');
      }
    }
  };

  const handleSaveProfileImage = async (image) => {
    const formData = new FormData();
    formData.append('file', {
      uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
      type: 'image/jpeg',
      name: image.fileName, 
    });
  
    try {
      const response = await axios({
        method: 'post',
        url: `http://75.101.248.20:8000/api/v1/establishment/add/portrait/${business.uuid}`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('Profile image uploaded successfully', response.data);
      setProfileImage({ uri: image.uri + '?' + new Date().getTime() });
      Alert.alert('Éxito', 'Foto de portada actualizada correctamente.');
    } catch (error) {
      if (error.response) {
        console.log('Error uploading profile image:', error.response.data.message);
        Alert.alert('Error', error.response.data.message || 'No se pudo actualizar la foto de portada.');
      } else {
        console.log('Error connecting to server:', error.message);
        Alert.alert('Error', 'No se pudo conectar con el servidor.');
      }
    }
  };
  

  const handleSaveGalleryImages = async (images) => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('files', {
        uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
        type: 'image/jpeg',
        name: image.fileName, 
      });
    });
  
    try {
      const response = await axios({
        method: 'post',
        url: `http://75.101.248.20:8000/api/v1/establishment/add/gallery/${business.uuid}`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('Gallery images uploaded successfully', response.data);
      const updatedGalleryResponse = await axios.get(`http://75.101.248.20:8000/api/v1/establishment/gallery/${business.uuid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGalleryImages(updatedGalleryResponse.data.data);
      Alert.alert('Éxito', 'Imágenes de la galería actualizadas correctamente.');
    } catch (error) {
      if (error.response) {
        console.log('Error uploading gallery images:', error.response.data.message);
        Alert.alert('Error', error.response.data.message || 'No se pudo actualizar las imágenes de la galería.');
      } else {
        console.log('Error connecting to server:', error.message);
        Alert.alert('Error', 'No se pudo conectar con el servidor.');
      }
    }
  };
  

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permiso requerido', 'Se requiere acceso a la galería para cambiar la foto de portada.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      handleSaveProfileImage(result.assets[0]);
    }
  };

  const pickGalleryImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permiso requerido', 'Se requiere acceso a la galería para cambiar las imágenes de la galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      handleSaveGalleryImages(result.assets);
    }
  };

  const handleDeleteGalleryImage = async (imageId) => {
    try {
      await axios.delete(`http://75.101.248.20:8000/api/v1/establishment/gallery/${imageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedGalleryResponse = await axios.get(`http://75.101.248.20:8000/api/v1/establishment/gallery/${business.uuid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGalleryImages(updatedGalleryResponse.data.data);
      Alert.alert('Éxito', 'Imagen eliminada correctamente.');
    } catch (error) {
      if (error.response) {
        console.log('Error deleting gallery image:', error.response.data.message);
        Alert.alert('Error', error.response.data.message || 'No se pudo eliminar la imagen.');
      } else {
        console.log('Error connecting to server:', error.message);
        Alert.alert('Error', 'No se pudo conectar con el servidor.');
      }
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.imageContainer}>
          <Image source={profileImage} style={styles.businessImage} />
          <TouchableOpacity style={styles.editImageButton} onPress={pickImage}>
            <FontAwesome name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nombre:</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
          <Text style={styles.label}>Categoría:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Vehículos" value="Vehículos" />
              <Picker.Item label="Servicios" value="Servicios" />
            </Picker>
          </View>
          <Text style={styles.label}>Dirección:</Text>
          <TextInput style={styles.input} value={address} onChangeText={setAddress} />
          <Text style={styles.label}>Abierto:</Text>
          <TouchableOpacity onPress={() => setOpeningTimePickerVisible(true)} style={styles.timePickerButton}>
            <Text style={styles.timePickerButtonText}>{moment(openingTime).format('hh:mm A')}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isOpeningTimePickerVisible}
            mode="time"
            onConfirm={(date) => {
              setOpeningTime(date);
              setOpeningTimePickerVisible(false);
            }}
            onCancel={() => setOpeningTimePickerVisible(false)}
          />
          <Text style={styles.label}>Cerrado:</Text>
          <TouchableOpacity onPress={() => setClosingTimePickerVisible(true)} style={styles.timePickerButton}>
            <Text style={styles.timePickerButtonText}>{moment(closingTime).format('hh:mm A')}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isClosingTimePickerVisible}
            mode="time"
            onConfirm={(date) => {
              setClosingTime(date);
              setClosingTimePickerVisible(false);
            }}
            onCancel={() => setClosingTimePickerVisible(false)}
          />
          <Text style={styles.label}>Días de la semana:</Text>
          <View style={styles.daysContainer}>
            {daysOfWeek.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  selectedDays.includes(day) && styles.dayButtonSelected,
                ]}
                onPress={() => {
                  setSelectedDays((prevDays) =>
                    prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]
                  );
                }}
              >
                <Text
                  style={[
                    styles.dayButtonText,
                    selectedDays.includes(day) && styles.dayButtonTextSelected,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Descripción:</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <Text style={styles.label}>Galería:</Text>
          <ScrollView horizontal>
            {galleryImages.map((image, index) => (
              <View key={index} style={styles.galleryImageContainer}>
                <Image source={{ uri: image.url }} style={styles.galleryImage} />
                <TouchableOpacity
                  style={styles.deleteGalleryImageButton}
                  onPress={() => handleDeleteGalleryImage(image.uuid)}
                >
                  <FontAwesome name="trash" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.addGalleryImageButton} onPress={pickGalleryImages}>
            <FontAwesome name="plus" size={20} color="white" />
            <Text style={styles.addGalleryImageButtonText}>Agregar imágenes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContainer: {
    paddingBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  businessImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 30,
  },
  infoContainer: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  timePickerButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    justifyContent: 'center',
  },
  timePickerButtonText: {
    fontSize: 16,
    color: 'gray',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    margin: 5,
  },
  dayButtonSelected: {
    backgroundColor: '#268AAB',
  },
  dayButtonText: {
    fontSize: 16,
    color: 'gray',
  },
  dayButtonTextSelected: {
    color: 'white',
  },
  addGalleryImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#268AAB',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  addGalleryImageButtonText: {
    color: 'white',
    marginLeft: 10,
  },
  galleryImageContainer: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  galleryImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  deleteGalleryImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 5,
    borderRadius: 15,
  },
  saveButton: {
    backgroundColor: '#268AAB',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -50 }],
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditBusinessScreen;

















