import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image, StatusBar, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import UserContext from '../contexts/UserContext';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/es'; 

moment.locale('es'); 

const AppointmentsScreen = ({ navigation }) => {
  const { user, token } = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://3.80.92.37:8001/api/v1/user/${user.uuid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        
        const appointmentsWithEstablishmentNames = await Promise.all(response.data.data.map(async (appointment) => {
          try {
            const establishmentResponse = await axios.get(`http://3.80.92.37:8001/api/v1/establishment/${appointment.establishment_id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            return {
              ...appointment,
              establishment_name: establishmentResponse.data.data[0]?.name || 'Nombre no disponible',
            };
          } catch (error) {
            console.error(`Error fetching establishment name for ID ${appointment.establishment_id}:`, error);
            return {
              ...appointment,
              establishment_name: 'Nombre no disponible',
            };
          }
        }));
  
        setAppointments(appointmentsWithEstablishmentNames);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        Alert.alert('Error', 'No se pudieron obtener las citas del usuario.');
      }
    };
  
    fetchAppointments();
  }, [user.uuid, token]);
  

  const renderAppointment = ({ item }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentInfo}>
        <Text style={styles.appointmentText}>{moment(item.date).format('LL')} - {moment(item.hour, 'HH:mm:ss').format('hh:mm A')}</Text>
        <Text style={styles.appointmentService}>{item.service}</Text>
        <Text style={styles.appointmentEstablishment}>{item.establishment_name}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Citas</Text>
        </View>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAppointment}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0877A0',
    marginLeft: 10,
  },
  logo: {
    width: 90,
    height: 70,
    resizeMode: 'contain',
  },
  appointmentCard: {
    marginHorizontal: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  appointmentInfo: {
    marginBottom: 10,
  },
  appointmentText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0877A0',
  },
  appointmentService: {
    fontSize: 16,
    color: '#555',
  },
  appointmentEstablishment: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
  },
});

export default AppointmentsScreen;






