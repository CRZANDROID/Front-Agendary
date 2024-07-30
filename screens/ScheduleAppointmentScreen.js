import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, TextInput, ScrollView, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import UserContext from '../contexts/UserContext';
import axios from 'axios';

const ScheduleAppointmentScreen = ({ route, navigation }) => {
  const { business } = route.params;
  const { user } = useContext(UserContext); // Eliminamos token del contexto
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [note, setNote] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (event.type === "set" && date) {
      const selectedMoment = moment(date);
      const today = moment();
      const inTwoDays = moment().add(2, 'days');

      if (selectedMoment.isBetween(today.subtract(1, 'days'), inTwoDays, 'days', '[]')) {
        setSelectedDate(date);
      } else {
        Alert.alert('Error', 'Solo puedes seleccionar la fecha actual o los próximos dos días.');
      }
    }
  };

  const handleTimeChange = (event, time) => {
    setShowTimePicker(false);
    if (event.type === "set" && time) {
      const selectedMoment = moment(time);
      const selectedTimeFormatted = selectedMoment.format('HH:mm:ss');
      setSelectedTime(selectedTimeFormatted);
    }
  };

  const handleAppointment = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !note) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    const appointmentData = {
      user_id: user.uuid,
      establishment_id: business.uuid,
      service: selectedService,
      date: moment(selectedDate).format('YYYY-MM-DD'),
      hour: selectedTime,
      detail: note,
      status: 'active',
    };

    console.log('Datos de la cita a enviar:', appointmentData);

    try {
      const response = await axios.post('http://3.80.92.37:8001/api/v1/create/', appointmentData);

      if (response.status === 200) {
        Alert.alert('Éxito', 'Cita programada correctamente.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'No se pudo programar la cita.');
      }
    } catch (error) {
      if (error.response) {
        console.error('Response error:', error.response.data);
        Alert.alert('Error', `No se pudo programar la cita. Error: ${error.response.data.message || error.response.status}`);
      } else if (error.request) {
        console.error('Request error:', error.request);
        Alert.alert('Error', 'No se recibió respuesta del servidor. Por favor, inténtelo de nuevo.');
      } else {
        console.error('Setup error:', error.message);
        Alert.alert('Error', 'Hubo un problema al configurar la solicitud. Por favor, inténtelo de nuevo.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Image source={business.portrait ? { uri: business.portrait } : require('../assets/placeholder.png')} style={styles.businessImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.businessName}>{business.name}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedService}
              onValueChange={(itemValue) => setSelectedService(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona tu servicio" value="" />
              {business.service.map((service, index) => (
                <Picker.Item key={index} label={service.name} value={service.name} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
              <Text>{selectedDate ? moment(selectedDate).format('DD/MM/YYYY') : 'Selecciona la fecha'}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display="default"
                minimumDate={new Date()}
                maximumDate={moment().add(2, 'days').toDate()}
                onChange={handleDateChange}
              />
            )}
          </View>
          <View style={styles.pickerContainer}>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.datePicker}>
              <Text>{selectedTime || 'Selecciona la hora'}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={new Date()} 
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>
          <View style={styles.noteContainer}>
            <Text>Nota:</Text>
            <TextInput
              style={styles.noteInput}
              multiline
              numberOfLines={4}
              value={note}
              onChangeText={setNote}
            />
          </View>
          <TouchableOpacity style={styles.agendarButton} onPress={handleAppointment}>
            <Text style={styles.agendarButtonText}>Agendar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContainer: {
    paddingBottom: 20,
  },
  header: {
    position: 'absolute',
    top: StatusBar.currentHeight + 10,
    left: 10,
    zIndex: 1,
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  businessImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop: StatusBar.currentHeight,
  },
  infoContainer: {
    padding: 20,
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  pickerContainer: {
    marginVertical: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  datePicker: {
    height: 50,
    justifyContent: 'center',
  },
  noteContainer: {
    marginVertical: 10,
  },
  noteInput: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    height: 100,
  },
  agendarButton: {
    backgroundColor: '#268AAB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  agendarButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ScheduleAppointmentScreen;

























