import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

// Configurar interceptores de Axios
axios.interceptors.request.use(
  async (config) => {
    // Verificar la conexión a Internet
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      Alert.alert('No Internet', 'Please check your internet connection.');
      return Promise.reject(new Error('No Internet Connection'));
    }
    
    console.log('Request:', config);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('Response Error:', error);
    return Promise.reject(error);
  }
);


axios.defaults.headers.common['Cache-Control'] = 'no-cache';
axios.defaults.headers.common['Pragma'] = 'no-cache';
axios.defaults.headers.common['Expires'] = '0';

export default axios;
