import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import MiNegocioScreen from '../screens/MiNegocioScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import BusinessDetailsScreen from '../screens/BusinessDetailsScreen';
import ScheduleAppointmentScreen from '../screens/ScheduleAppointmentScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import RegisterBusinessScreen from '../screens/RegisterBusinessScreen';
import BusinessPreviewScreen from '../screens/BusinessPreviewScreen';
import WorkAgendaScreen from '../screens/WorkAgendaScreen';
import EditBusinessScreen from '../screens/EditBusinessScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MiNegocio" component={MiNegocioScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Politicas" component={PrivacyPolicyScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Appointments" component={AppointmentsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BusinessDetails" component={BusinessDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ScheduleAppointment" component={ScheduleAppointmentScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RegisterBusiness" component={RegisterBusinessScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BusinessPreview" component={BusinessPreviewScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WorkAgenda" component={WorkAgendaScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditBusiness" component={EditBusinessScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Login" drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="HomeStack" component={HomeStack} options={{ headerShown: false }} />
      <Drawer.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Drawer.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
};

export default AppNavigator;
