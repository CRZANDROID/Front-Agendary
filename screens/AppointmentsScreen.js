import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';

const AppointmentsScreen = () => {
  const appointments = [
    { id: '1', date: '2024-06-28', time: '10:00 AM', service: 'Lavado de auto' },
    { id: '2', date: '2024-06-29', time: '02:00 PM', service: 'Cambio de aceite' },

  ];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.appointmentCard}>
            <Text style={styles.appointmentText}>{item.date} - {item.time}</Text>
            <Text style={styles.appointmentService}>{item.service}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  appointmentCard: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
  },
  appointmentText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  appointmentService: {
    fontSize: 16,
    color: '#555',
  },
});

export default AppointmentsScreen;
