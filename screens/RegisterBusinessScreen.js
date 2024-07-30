import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image, Alert, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import UserContext from '../contexts/UserContext';

const RegisterBusinessScreen = () => {
  const navigation = useNavigation();
  const { user, token, setUser } = useContext(UserContext);
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [address, setAddress] = useState('');
  const [openingHour, setOpeningHour] = useState(new Date());
  const [closingHour, setClosingHour] = useState(new Date());
  const [description, setDescription] = useState('');
  const [services, setServices] = useState([]);
  const [serviceInput, setServiceInput] = useState('');
  const [days, setDays] = useState([]);
  const [showOpeningHourPicker, setShowOpeningHourPicker] = useState(false);
  const [showClosingHourPicker, setShowClosingHourPicker] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://3.80.92.37:8003/api/v1/category');
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        Alert.alert('Error', 'No se pudo obtener las categorías');
      }
    };

    fetchCategories();
  }, []);

  const handleRegister = async () => {
    if (!user) {
      Alert.alert('Error', 'No se pudo obtener la información del usuario.');
      return;
    }

    const user_id = user.uuid;

    const establishment = {
      name: businessName,
      description: description,
      opening_hours: openingHour.toLocaleTimeString('en-US', { hour12: false }),
      closing_hours: closingHour.toLocaleTimeString('en-US', { hour12: false }),
      days: days.join(', '),
      category: category,
      services: services.map(service => ({ name: service })), 
      address: address,
    };

    try {
      await axios.post(`http://3.80.92.37:8003/api/v1/establishment/create/${user_id}`, establishment, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log('Negocio registrado:', establishment); 
      Alert.alert('Éxito', 'Negocio registrado correctamente');

      
      await axios.put(`http://3.80.92.37:8000/api/v1/upgrade/role/${user_id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log('Rol de usuario actualizado a admin');

      
      setUser({ ...user, role: 'admin' });

    
      navigation.navigate('BusinessPreview', { business: establishment });
    } catch (error) {
      console.error('Error registering business:', error.response ? error.response.data : error);
      Alert.alert('Error', 'No se pudo registrar el negocio');
    }
  };

  const handleAddService = () => {
    if (serviceInput.trim()) {
      setServices([...services, serviceInput.trim()]);
      setServiceInput('');
    }
  };

  const handleRemoveService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleDayChange = (day) => {
    if (days.includes(day)) {
      setDays(days.filter(d => d !== day));
    } else {
      setDays([...days, day]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome name="bars" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mi negocio</Text>
        </View>
        <Image source={require('../assets/register_business_banner.png')} style={styles.bannerImage} />
        <Image source={require('../assets/logo_business.png')} style={styles.logo} />
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Nombre establecimiento"
            style={styles.input}
            value={businessName}
            onChangeText={setBusinessName}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Categoría" value="" />
              {categories.map((cat) => (
                <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
              ))}
            </Picker>
          </View>
          <TextInput
            placeholder="Dirección"
            style={styles.input}
            value={address}
            onChangeText={setAddress}
          />
          <TouchableOpacity onPress={() => setShowOpeningHourPicker(true)} style={styles.input}>
            <Text>{`Hora de apertura: ${openingHour.toLocaleTimeString('en-US', { hour12: false })}`}</Text>
          </TouchableOpacity>
          {showOpeningHourPicker && (
            <DateTimePicker
              value={openingHour}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, selectedDate) => {
                setShowOpeningHourPicker(false);
                setOpeningHour(selectedDate || openingHour);
              }}
            />
          )}
          <TouchableOpacity onPress={() => setShowClosingHourPicker(true)} style={styles.input}>
            <Text>{`Hora de cierre: ${closingHour.toLocaleTimeString('en-US', { hour12: false })}`}</Text>
          </TouchableOpacity>
          {showClosingHourPicker && (
            <DateTimePicker
              value={closingHour}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, selectedDate) => {
                setShowClosingHourPicker(false);
                setClosingHour(selectedDate || closingHour);
              }}
            />
          )}
          <Text style={styles.sectionTitle}>Días de apertura</Text>
          <View style={styles.daysContainer}>
            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
              <TouchableOpacity
                key={day}
                style={[styles.dayButton, days.includes(day) && styles.dayButtonSelected]}
                onPress={() => handleDayChange(day)}
              >
                <Text style={[styles.dayButtonText, days.includes(day) && styles.dayButtonTextSelected]}>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.sectionTitle}>Servicios</Text>
          <View style={styles.serviceInputContainer}>
            <TextInput
              placeholder="Agregar servicio"
              style={[styles.input, { flex: 1 }]}
              value={serviceInput}
              onChangeText={setServiceInput}
            />
            <TouchableOpacity style={styles.addServiceButton} onPress={handleAddService}>
              <FontAwesome name="plus" size={24} color="white" />
            </TouchableOpacity>
          </View>
          {services.length > 0 && (
            <View style={styles.servicesList}>
              {services.map((service, index) => (
                <View key={index} style={styles.serviceItem}>
                  <Text style={styles.serviceText}>{service}</Text>
                  <TouchableOpacity style={styles.removeServiceButton} onPress={() => handleRemoveService(index)}>
                    <FontAwesome name="minus" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          <TextInput
            placeholder="Descripción"
            style={[styles.input, { height: 100 }]}
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: StatusBar.currentHeight || 0,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#268AAB',
    marginLeft: 10,
  },
  bannerImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  pickerContainer: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#268AAB',
    marginBottom: 10,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayButton: {
    borderWidth: 1,
    borderColor: '#268AAB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: '30%',
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: '#268AAB',
  },
  dayButtonText: {
    color: '#268AAB',
    fontSize: 14,
  },
  dayButtonTextSelected: {
    color: '#fff',
  },
  serviceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  addServiceButton: {
    backgroundColor: '#268AAB',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  removeServiceButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    padding: 6,
    borderRadius: 10,
    marginLeft: 10,
  },
  servicesList: {
    marginBottom: 20,
  },
  serviceItem: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceText: {
    color: '#000',
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  addPhotoText: {
    marginLeft: 10,
    color: 'gray',
  },
  registerButton: {
    backgroundColor: '#268AAB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegisterBusinessScreen;























