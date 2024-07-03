import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const MiNegocioScreen = () => {
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleRegisterNavigation = () => {
    navigation.navigate('RegisterBusiness');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <FontAwesome name="bars" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi negocio</Text>
      </View>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleRegisterNavigation} style={styles.bannerTouchable}>
          <Image source={require('../assets/register_business_banner.png')} style={styles.bannerImage} />
        </TouchableOpacity>
        <Image source={require('../assets/logo_business.png')} style={styles.logo} />
        <Text style={styles.subtitle}>Inicia sesión</Text>
        <View style={styles.inputContainer}>
          <TextInput placeholder="Cuenta" style={styles.input} />
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Contraseña"
              secureTextEntry={!passwordVisible}
              style={styles.input}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.eyeIcon}
            >
              <FontAwesome name={passwordVisible ? 'eye-slash' : 'eye'} size={20} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>
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
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#268AAB',
    marginLeft: 10, // Espacio entre el icono del menú y el título
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bannerTouchable: {
    width: '100%',
    height: 150, // Altura fija para el contenedor
    marginBottom: 20,
    borderRadius: 20, // Bordes redondeados
    shadowColor: '#000', // Efecto de profundidad
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: 'hidden', // Asegurar que los bordes redondeados se apliquen correctamente
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Ajustar la imagen para que se vea completa dentro del contenedor
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#268AAB',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
  loginButton: {
    backgroundColor: '#268AAB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MiNegocioScreen;
