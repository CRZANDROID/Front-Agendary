import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, FlatList, Image, Platform, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import axios from 'axios';
import UserContext from '../contexts/UserContext';

const WorkAgendaScreen = ({ route, navigation }) => {
  const { token } = useContext(UserContext);
  const { establishmentId } = route.params;
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://75.101.248.20:8001/api/v1/establishment/${establishmentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAppointmentsData(response.data.data);
        setFilteredAppointments(response.data.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        Alert.alert('Error', 'No se pudieron obtener las citas del establecimiento.');
      }
    };

    fetchAppointments();
  }, [establishmentId, token]);

  const toggleExpand = (id) => {
    setExpandedAppointment(expandedAppointment === id ? null : id);
  };

  const handleDelete = (id) => {
    setFilteredAppointments(filteredAppointments.filter(item => item.id !== id));
    setAppointmentsData(appointmentsData.filter(item => item.id !== id));
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
          <Text style={styles.appointmentName}>{item.service}</Text>
          <Text style={styles.appointmentTime}>{moment(item.hour, 'HH:mm:ss').format('hh:mm A')}</Text>
          <Text style={styles.appointmentDate}>{moment(item.date).format('DD/MM/YYYY')}</Text>
          {expandedAppointment === item.id && <Text style={styles.appointmentNote}>Nota: {item.detail}</Text>}
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
          keyExtractor={(item) => item.id.toString()}
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
  appointmentDate: {
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






