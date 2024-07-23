import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [nameError, setNameError] = useState('');
  const [lastnameError, setLastnameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleRegister = async () => {
    let isValid = true;

    
    if (!name) {
      setNameError('El nombre es obligatorio.');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!lastname) {
      setLastnameError('El apellido es obligatorio.');
      isValid = false;
    } else {
      setLastnameError('');
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      setPhoneError('El número de teléfono debe tener exactamente 10 dígitos.');
      isValid = false;
    } else {
      setPhoneError('');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('El correo electrónico no es válido.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres y contener letras y números.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden.');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (!isValid) {
      return;
    }

    try {
      const response = await fetch('http://54.205.215.254:8000/api/v1/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          lastname,
          phone_number: phoneNumber,
          email,
          password,
        }),
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        Alert.alert('Éxito', 'Usuario registrado correctamente.');
        navigation.navigate('Login');
      } else {
        if (result.message && result.message.includes('Duplicate entry')) {
          setEmailError('El correo electrónico ya está registrado.');
        } else {
          Alert.alert('Error', result.message || 'Algo salió mal.');
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Regístrate</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Nombre"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Apellido"
            style={styles.input}
            value={lastname}
            onChangeText={setLastname}
          />
          {lastnameError ? <Text style={styles.errorText}>{lastnameError}</Text> : null}
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Número de teléfono"
            style={styles.input}
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))} 
            keyboardType="numeric"
            maxLength={10}
          />
          {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>
        <View style={styles.inputWrapper}>
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
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Repite contraseña"
              secureTextEntry={!showConfirmPassword}
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.icon}>
              <Entypo name={showConfirmPassword ? "eye-with-line" : "eye"} size={24} color="grey" />
            </TouchableOpacity>
          </View>
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Regístrate</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>
          ¿Ya tienes una cuenta?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            Inicia sesión
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
  inputWrapper: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
  inputContainer: {
    width: '100%',
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 13,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  button: {
    width: '50%',
    height: 50,
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

export default RegisterScreen;
