import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import UserContext from '../contexts/UserContext';

const CustomDrawerContent = (props) => {
  const { user, token } = useContext(UserContext);

  const handleMiNegocio = async () => {
    if (user.rol === 'admin') {
      try {
        const response = await axios.get(`http://3.80.92.37:8003/api/v1/establishment/by/${user.uuid}`, {
          params: {
            user_id: user.uuid,
          },
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          props.navigation.navigate('BusinessPreview', { business: response.data.data });
        } else {
          Alert.alert('Error', 'No se pudo obtener la información del negocio');
        }
      } catch (error) {
        console.error('Error fetching business:', error.response ? error.response.data : error);
        Alert.alert('Error', 'No se pudo obtener la información del negocio');
      }
    } else {
      props.navigation.navigate('MiNegocio');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
        <View style={styles.drawerHeader}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <TouchableOpacity onPress={() => props.navigation.closeDrawer()} style={styles.closeButton}>
            <FontAwesome name="times" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <DrawerItem
          label="Home"
          icon={({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate('Home')}
        />
        <DrawerItem
          label="Mi Negocio"
          icon={({ color, size }) => (
            <FontAwesome name="briefcase" size={size} color={color} />
          )}
          onPress={handleMiNegocio}
        />
        <DrawerItem
          label="Políticas de Privacidad"
          icon={({ color, size }) => (
            <FontAwesome name="file-text" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate('Politicas')}
        />
      </DrawerContentScrollView>
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={() => props.navigation.navigate('Login')}>
          <FontAwesome name="sign-out" size={24} color="black" />
          <Text style={styles.logoutButtonText}>Salir</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 75,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
  },
  closeButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
  },
  logoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButtonText: {
    marginLeft: 10,
    fontSize: 18,
    color: 'black',
  },
});

export default CustomDrawerContent;









