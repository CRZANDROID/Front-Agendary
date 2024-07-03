import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, Image } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const RegisterBusinessScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [openingHour, setOpeningHour] = useState('');
  const [closingHour, setClosingHour] = useState('');
  const [description, setDescription] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mi negocio</Text>
        </View>
        <Text style={styles.title}>Crea tu cuenta</Text>
        <Image source={require('../assets/logo_business.png')} style={styles.logo} />
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Nombre completo"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Cuenta"
            style={styles.input}
            value={account}
            onChangeText={setAccount}
          />
          <TextInput
            placeholder="Telefono"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
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
              <Picker.Item label="Vehículos" value="vehiculos" />
              <Picker.Item label="Alimentos" value="alimentos" />
              <Picker.Item label="Tecnología" value="tecnologia" />
            </Picker>
          </View>
          <TextInput
            placeholder="Dirección"
            style={styles.input}
            value={address}
            onChangeText={setAddress}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={openingHour}
              onValueChange={(itemValue) => setOpeningHour(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Hora apertura" value="" />
              <Picker.Item label="09:00 AM" value="09:00" />
              <Picker.Item label="10:00 AM" value="10:00" />
              <Picker.Item label="11:00 AM" value="11:00" />
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={closingHour}
              onValueChange={(itemValue) => setClosingHour(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Hora de cierre" value="" />
              <Picker.Item label="05:00 PM" value="17:00" />
              <Picker.Item label="06:00 PM" value="18:00" />
              <Picker.Item label="07:00 PM" value="19:00" />
            </Picker>
          </View>
          <TouchableOpacity style={styles.addPhotoButton}>
            <MaterialIcons name="add-a-photo" size={24} color="gray" />
            <Text style={styles.addPhotoText}>Agregar fotos</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Descripción"
            style={[styles.input, { height: 100 }]}
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Registrate</Text>
          </TouchableOpacity>
          <Text style={styles.loginText}>
            ¿Ya tienes un negocio?{' '}
            <Text style={styles.loginLink} onPress={() => navigation.navigate('MiNegocio')}>
              Inicia sesión
            </Text>
          </Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000', // Color negro
    alignSelf: 'flex-start', // Alinear a la izquierda
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
    height: 50, // Aumentar la altura de los campos
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 20, // Aumentar el espacio entre los campos
    backgroundColor: '#fff',
  },
  pickerContainer: {
    width: '100%',
    height: 50, // Aumentar la altura de los campos
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20, // Aumentar el espacio entre los campos
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: '100%',
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60, // Aumentar la altura del botón para agregar fotos
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20, // Aumentar el espacio entre los campos
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
  loginText: {
    marginTop: 20,
    color: 'gray',
  },
  loginLink: {
    color: '#268AAB',
    fontWeight: 'bold',
  },
});

export default RegisterBusinessScreen;
