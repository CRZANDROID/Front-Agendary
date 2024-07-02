import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, TextInput, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';

const ScheduleAppointmentScreen = ({ route, navigation }) => {
  const { business } = route.params;
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [note, setNote] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [timeError, setTimeError] = useState(false);

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      const selectedMoment = moment(date);
      const today = moment().startOf('day');
      const threeDaysLater = moment().add(3, 'days').endOf('day');
      if (selectedMoment.isSameOrAfter(today) && selectedMoment.isSameOrBefore(threeDaysLater)) {
        setSelectedDate(date);
        setDateError(false);
      } else {
        setSelectedDate(null);
        setDateError(true);
      }
    }
  };

  const handleTimeChange = (event, time) => {
    setShowTimePicker(false);
    if (time) {
      const selectedMoment = moment(time, 'HH:mm');
      const [startHour, endHour] = business.hours.split(' - ');
      const businessStartHour = moment(startHour, 'HH:mm');
      const businessEndHour = moment(endHour, 'HH:mm');
      if (selectedMoment.isBetween(businessStartHour, businessEndHour, null, '[)')) {
        setSelectedTime(selectedMoment.format('HH:mm'));
        setTimeError(false);
      } else {
        setSelectedTime('');
        setTimeError(true);
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
        <Image source={business.image} style={styles.businessImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.businessName}>{business.name}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedService}
              onValueChange={(itemValue) => setSelectedService(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona tu servicio" value="" />
              <Picker.Item label="Lavado Básico" value="Lavado Básico" />
              <Picker.Item label="Lavado Completo" value="Lavado Completo" />
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
                maximumDate={moment().add(3, 'days').toDate()}
                onChange={handleDateChange}
              />
            )}
            {dateError && <Text style={styles.errorText}>Fecha no disponible</Text>}
          </View>
          <View style={styles.pickerContainer}>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.datePicker}>
              <Text>{selectedTime || 'Selecciona la hora'}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={selectedTime ? new Date(`1970-01-01T${selectedTime}:00`) : new Date()}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>
          {timeError && <Text style={styles.errorText}>Horario no disponible</Text>}
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
          <TouchableOpacity style={styles.agendarButton}>
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
  errorText: {
    color: 'red',
    marginTop: 5,
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
