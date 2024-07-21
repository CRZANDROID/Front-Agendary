import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import UserContext from '../contexts/UserContext';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { setUser, setToken } = useContext(UserContext);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Por favor, completa todos los campos');
      return;
    }

    const url = `http://54.205.215.254:8000/api/v1/login`;

    try {
      const response = await axios.post(url, {
        email: email,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        }
      });

      const result = response.data;
      console.log('Login response:', result);  // Log the response to see the JWT and other data

      if (response.status === 200 && result.data && result.data.token) {
        setErrorMessage('');
        setToken(result.data.token);
        setUser({ email: result.data.email });  // Assuming we only need the email for the user context
        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeStack' }],
        });
      } else {
        setErrorMessage(result.message || 'Correo o contraseña incorrectos');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || 'Correo o contraseña incorrectos');
      } else {
        console.error('Error connecting to server:', error);
        setErrorMessage('No se pudo conectar con el servidor');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Inicia sesión</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Correo electrónico"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <FontAwesome name="user" size={24} color="grey" style={styles.icon} />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
            <Entypo name={showPassword ? "eye-with-line" : "eye"} size={24} color="grey" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <Text style={styles.footerText}>
          ¿No tienes una cuenta?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
            Regístrate
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
  errorText: {
    color: 'red',
    marginTop: 10,
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 14,
    marginTop: 20,
  },
  link: {
    color: '#268AAB',
  },
});

export default LoginScreen;



