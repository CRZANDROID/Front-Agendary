import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

const EditBusinessScreen = ({ route, navigation }) => {
  const { business, onUpdate } = route.params;

  const [selectedCategory, setSelectedCategory] = useState(business.category);
  const [services, setServices] = useState(business.services || []);
  const [newService, setNewService] = useState('');
  const [openingTime, setOpeningTime] = useState(moment(business.openingTime, 'hh:mm A').toDate());
  const [closingTime, setClosingTime] = useState(moment(business.closingTime, 'hh:mm A').toDate());
  const [isOpeningTimePickerVisible, setOpeningTimePickerVisible] = useState(false);
  const [isClosingTimePickerVisible, setClosingTimePickerVisible] = useState(false);
  const [serviceDuration, setServiceDuration] = useState(business.serviceDuration || 30);
  const [name, setName] = useState(business.name);
  const [location, setLocation] = useState(business.location);
  const [description, setDescription] = useState(business.description);

  const handleSave = () => {
    const updatedBusiness = {
      ...business,
      category: selectedCategory,
      services: services,
      openingTime: moment(openingTime).format('hh:mm A'),
      closingTime: moment(closingTime).format('hh:mm A'),
      serviceDuration: serviceDuration,
      name: name,
      location: location,
      description: description,
    };

    onUpdate(updatedBusiness);
    navigation.goBack();
  };

  const addService = () => {
    if (newService.trim() !== '') {
      setServices([...services, newService]);
      setNewService('');
    }
  };

  const renderGalleryItem = ({ item, index }) => (
    <View key={index} style={styles.galleryImageContainer}>
      <Image source={item} style={styles.galleryImage} />
      <TouchableOpacity style={styles.editGalleryButton}>
        <FontAwesome name="camera" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={[{ key: 'header' }, { key: 'content' }]}
        renderItem={({ item }) => {
          if (item.key === 'header') {
            return (
              <View style={styles.imageContainer}>
                <Image source={business.image} style={styles.businessImage} />
                <TouchableOpacity style={styles.editImageButton}>
                  <FontAwesome name="camera" size={20} color="white" />
                </TouchableOpacity>
              </View>
            );
          } else if (item.key === 'content') {
            return (
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
                    {/* Agregar más categorías según sea necesario */}
                  </Picker>
                </View>
                <Text style={styles.label}>Servicios:</Text>
                <View style={styles.serviceInputContainer}>
                  <TextInput
                    style={styles.serviceInput}
                    value={newService}
                    onChangeText={setNewService}
                    placeholder="Agregar servicio"
                  />
                  <TouchableOpacity onPress={addService} style={styles.addServiceButton}>
                    <FontAwesome name="plus" size={20} color="white" />
                  </TouchableOpacity>
                </View>
                <View>
                  {services.map((service, index) => (
                    <Text key={index} style={styles.serviceItem}>{service}</Text>
                  ))}
                </View>
                <Text style={styles.label}>Dirección:</Text>
                <TextInput style={styles.input} value={location} onChangeText={setLocation} />
                <Text style={styles.label}>Abierto:</Text>
                <TouchableOpacity
                  onPress={() => setOpeningTimePickerVisible(true)}
                  style={styles.timePickerButton}
                >
                  <Text style={styles.timePickerButtonText}>
                    {moment(openingTime).format('hh:mm A')}
                  </Text>
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
                <TouchableOpacity
                  onPress={() => setClosingTimePickerVisible(true)}
                  style={styles.timePickerButton}
                >
                  <Text style={styles.timePickerButtonText}>
                    {moment(closingTime).format('hh:mm A')}
                  </Text>
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
                <Text style={styles.label}>Duración del servicio (minutos):</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={serviceDuration}
                    onValueChange={(itemValue) => setServiceDuration(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="15 minutos" value={15} />
                    <Picker.Item label="30 minutos" value={30} />
                    <Picker.Item label="45 minutos" value={45} />
                    <Picker.Item label="60 minutos" value={60} />
                    {/* Agregar más duraciones según sea necesario */}
                  </Picker>
                </View>
                <Text style={styles.label}>Descripción:</Text>
                <TextInput
                  style={[styles.input, { height: 80 }]}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                />
                <Text style={styles.label}>Galería:</Text>
                <FlatList
                  data={business.gallery}
                  renderItem={renderGalleryItem}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.galleryContainer}
                  ListFooterComponent={
                    <TouchableOpacity style={styles.addGalleryButton}>
                      <FontAwesome name="plus" size={24} color="white" />
                    </TouchableOpacity>
                  }
                />
              </View>
            );
          }
          return null;
        }}
        keyExtractor={(item) => item.key}
        ListHeaderComponentStyle={{ marginBottom: 20 }}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <FontAwesome name="chevron-left" size={24} color="black" />
          <Text style={styles.headerButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  headerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#268AAB',
    marginLeft: 5,
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
  serviceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  addServiceButton: {
    backgroundColor: '#268AAB',
    padding: 10,
    borderRadius: 10,
  },
  serviceItem: {
    fontSize: 16,
    color: 'gray',
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  galleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  editGalleryButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 5,
    borderRadius: 20,
  },
  addGalleryButton: {
    width: 100,
    height: 100,
    backgroundColor: '#268AAB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
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
});

export default EditBusinessScreen;
