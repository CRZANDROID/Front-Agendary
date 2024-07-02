import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Inicia sesión</Text>

        <View style={styles.inputContainer}>
          <TextInput placeholder="Cuenta" style={styles.input} />
          <FontAwesome name="user" size={24} color="grey" style={styles.icon} />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
            <Entypo name={showPassword ? "eye-with-line" : "eye"} size={24} color="grey" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('HomeStack')}
        >
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          ¿No tienes una cuenta?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
            Registrate
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#268AAB',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#268AAB',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
  inputContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: 15,
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 8,
  },
  button: {
    width: '50%',
    height: 40,
    backgroundColor: '#268AAB',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 14,
  },
  link: {
    color: '#268AAB',
  },
});

export default LoginScreen;
