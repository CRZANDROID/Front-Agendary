import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, FlatList, Image, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const appointmentsData = [
  { id: '1', name: 'Josue Galdamez Cruz', time: '10:00 am - 11:00 am', note: 'No aspiren la cajuela ni agreguen brillo al tablero', date: '2023-07-05' },
  { id: '2', name: 'Maria Hernandez', time: '11:00 am - 12:00 pm', note: 'Limpieza profunda del interior', date: '2023-07-05' },
  { id: '3', name: 'Carlos Ramirez', time: '1:00 pm - 2:00 pm', note: 'Solo lavado exterior', date: '2023-07-06' },
  { id: '4', name: 'Laura Martinez', time: '2:00 pm - 3:00 pm', note: 'Limpieza y encerado', date: '2023-07-06' },
  { id: '5', name: 'Pedro Lopez', time: '3:00 pm - 4:00 pm', note: 'Lavado y aspirado completo', date: '2023-07-07' },
  { id: '6', name: 'Ana Garcia', time: '9:00 am - 10:00 am', note: 'Limpieza rápida', date: '2023-07-07' },
  { id: '7', name: 'Luis Fernandez', time: '4:00 pm - 5:00 pm', note: 'Encerado y pulido', date: '2023-07-07' },
  { id: '8', name: 'Miguel Sanchez', time: '5:00 pm - 6:00 pm', note: 'Lavado de motor', date: '2023-07-07' },
  { id: '9', name: 'Paula Torres', time: '6:00 pm - 7:00 pm', note: 'Limpieza completa', date: '2023-07-08' },
  { id: '10', name: 'Juan Perez', time: '7:00 pm - 8:00 pm', note: 'Aspirado y lavado exterior', date: '2023-07-08' },
];

const WorkAgendaScreen = ({ navigation }) => {
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState(appointmentsData);

  const toggleExpand = (id) => {
    setExpandedAppointment(expandedAppointment === id ? null : id);
  };

  const handleDelete = (id) => {
    setFilteredAppointments(filteredAppointments.filter(item => item.id !== id));
  };

  const handleDateChange = (event, date) => {
    setDatePickerVisibility(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      const formattedDate = moment(date).format('YYYY-MM-DD');
      const filteredData = appointmentsData.filter(appointment => appointment.date === formattedDate);
      setFilteredAppointments(filteredData);
    }
  };

  const clearDateFilter = () => {
    setFilteredAppointments(appointmentsData);
    setSelectedDate(new Date());
  };

  const renderItem = ({ item }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.cardHeader}>
        <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.expandButton}>
          <FontAwesome name={expandedAppointment === item.id ? 'chevron-up' : 'chevron-down'} size={20} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardText}>
          <Text style={styles.appointmentName}>{item.name}</Text>
          <Text style={styles.appointmentTime}>{item.time}</Text>
          {expandedAppointment === item.id && <Text style={styles.appointmentNote}>Nota: {item.note}</Text>}
          {expandedAppointment === item.id && (
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
              <FontAwesome name="trash" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agenda</Text>
        <Image source={require('../assets/logo_business.png')} style={styles.logo} />
      </View>
      <View style={styles.container}>
        <View style={styles.datePickerContainer}>
          <TouchableOpacity style={styles.datePicker} onPress={() => setDatePickerVisibility(true)}>
            <Text style={styles.datePickerText}>{moment(selectedDate).format('DD/MM/YYYY')}</Text>
            <FontAwesome name="chevron-down" size={20} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearButton} onPress={clearDateFilter}>
            <FontAwesome name="times" size={20} color="white" />
          </TouchableOpacity>
        </View>
        {isDatePickerVisible && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <FlatList
          data={filteredAppointments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight || 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#268AAB',
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    marginRight: 10,
  },
  datePickerText: {
    fontSize: 16,
    color: 'gray',
  },
  clearButton: {
    backgroundColor: '#268AAB',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  appointmentCard: {
    backgroundColor: '#268AAB',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expandButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cardText: {
    flex: 1,
    alignItems: 'flex-end',
  },
  appointmentName: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  appointmentTime: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
  },
  appointmentNote: {
    fontSize: 14,
    color: 'white',
    marginTop: 10,
    textAlign: 'right',
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
});

export default WorkAgendaScreen;
