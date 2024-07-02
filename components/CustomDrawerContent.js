import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { FontAwesome } from '@expo/vector-icons';

const CustomDrawerContent = (props) => (
  <View style={{ flex: 1 }}>
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
        onPress={() => props.navigation.navigate('MiNegocio')}
      />
    </DrawerContentScrollView>
    <View style={styles.logoutContainer}>
      <TouchableOpacity style={styles.logoutButton} onPress={() => props.navigation.navigate('Login')}>
        <FontAwesome name="sign-out" size={24} color="black" />
        <Text style={styles.logoutButtonText}>Salir</Text>
      </TouchableOpacity>
    </View>
  </View>
);

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
