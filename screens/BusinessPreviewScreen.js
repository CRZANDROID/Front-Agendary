import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, FlatList, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import moment from 'moment';
import UserContext from '../contexts/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get("window").width;

const BusinessPreviewScreen = ({ navigation }) => {
  const { user, token } = useContext(UserContext);
  const [business, setBusiness] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [ratingsData, setRatingsData] = useState(null);

  const fetchBusiness = async () => {
    try {
      const response = await axios.get(`http://3.80.92.37:8003/api/v1/establishment/by/${user.uuid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.data && response.data.data.length > 0) {
        const businessData = response.data.data[0];
        setBusiness(businessData);

        const galleryResponse = await axios.get(`http://3.80.92.37:8003/api/v1/establishment/gallery/${businessData.uuid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGallery(galleryResponse.data.data);

        fetchComments(businessData.uuid);
        fetchRatingsData(businessData.uuid);
      } else {
        Alert.alert('Error', 'No se encontró el negocio');
      }
    } catch (error) {
      console.error('Error fetching business:', error.response ? error.response.data : error);
      Alert.alert('Error', 'No se pudo obtener la información del negocio');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (businessId) => {
    try {
      const response = await axios.get(`http://3.80.92.37:8003/api/v1comment/establishment/${businessId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      setComments(response.data.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      if (error.response) {
        Alert.alert('Error', `Hubo un problema al obtener los comentarios: ${error.response.status}`);
      } else if (error.request) {
        Alert.alert('Error', 'No se recibió respuesta del servidor. Por favor, inténtelo de nuevo.');
      } else {
        Alert.alert('Error', 'Hubo un problema al configurar la solicitud. Por favor, inténtelo de nuevo.');
      }
    }
  };

  const fetchRatingsData = async (businessId) => {
    try {
      const response = await axios.get(`http://3.80.92.37:8003/api/v1/comments/ratings_over_time/${businessId}/1D`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const ratings = response.data.data.map(item => ({
        date: moment(item.date).format('DD MMM'),
        rating: item.rating
      }));

      setRatingsData({
        labels: ratings.map(r => r.date),
        datasets: [
          {
            data: ratings.map(r => r.rating),
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            strokeWidth: 2
          }
        ],
        legend: ["Predicción de desempeño"]
      });
    } catch (error) {
      console.error('Error fetching ratings data:', error);
      if (error.response) {
        Alert.alert('Error', `Hubo un problema al obtener los datos de calificaciones: ${error.response.status}`);
      } else if (error.request) {
        Alert.alert('Error', 'No se recibió respuesta del servidor. Por favor, inténtelo de nuevo.');
      } else {
        Alert.alert('Error', 'Hubo un problema al configurar la solicitud. Por favor, inténtelo de nuevo.');
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBusiness();
    }, [user.uuid])
  );

  const handleViewAppointments = () => {
    if (business) {
      navigation.navigate('WorkAgenda', { establishmentId: business.uuid });
    } else {
      Alert.alert('Error', 'No se encontró el negocio');
    }
  };

  const formatBusinessHours = (opening, closing) => {
    const formattedOpening = moment(opening, 'HH:mm:ss').format('hh:mm A');
    const formattedClosing = moment(closing, 'HH:mm:ss').format('hh:mm A');
    return `${formattedOpening} - ${formattedClosing}`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#268AAB" />
      </View>
    );
  }

  if (!business) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se encontró el negocio</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={business.portrait ? { uri: business.portrait } : require('../assets/placeholder.png')}
          style={styles.businessImage}
        />
      </View>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.drawerButton}>
            <FontAwesome name="bars" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mi negocio</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.businessName}>{business.name}</Text>
          <View style={styles.categoryContainer}>
            <MaterialIcons name="category" size={24} color="gray" />
            <Text style={styles.businessCategory}>{business.category}</Text>
          </View>
          <View style={styles.locationContainer}>
            <FontAwesome name="map-marker" size={24} color="#FFA500" />
            <Text style={styles.businessLocation}>{business.address}</Text>
          </View>
          <View style={styles.hoursContainer}>
            <FontAwesome name="clock-o" size={24} color="gray" />
            <Text style={styles.businessHours}>{formatBusinessHours(business.opening_hours, business.closing_hours)}</Text>
          </View>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.businessDescription}>{business.description}</Text>
          {gallery.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Galería</Text>
              <View style={styles.galleryWrapper}>
                <FlatList
                  data={gallery}
                  keyExtractor={(item) => item.uuid.toString()}
                  renderItem={({ item }) => (
                    <Image source={{ uri: item.url }} style={styles.galleryImage} />
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  pagingEnabled
                  snapToAlignment="center"
                  decelerationRate="fast"
                  contentContainerStyle={styles.galleryContainer}
                />
              </View>
            </>
          )}
          <Text style={styles.sectionTitle}>Comentarios</Text>
          <View style={styles.commentsContainer}>
            {comments.map(comment => (
              <View key={comment.uuid} style={styles.comment}>
                <Text style={styles.commentUser}>Usuario anónimo</Text>
                <Text style={styles.commentText}>{comment._comment}</Text>
                <View style={styles.commentRatingContainer}>
                  {[...Array(5)].map((_, starIndex) => (
                    <FontAwesome key={starIndex} name="star" size={16} color={comment._rating > starIndex ? '#FFD700' : 'gray'} />
                  ))}
                </View>
              </View>
            ))}
          </View>
          <Text style={styles.sectionTitle}>Predicción de Desempeño</Text>
          {ratingsData && (
            <LineChart
              data={ratingsData}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                backgroundColor: '#e26a00',
                backgroundGradientFrom: '#fb8c00',
                backgroundGradientTo: '#ffa726',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726"
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          )}
        </View>
      </ScrollView>
      <View style={styles.footerButtons}>
        <TouchableOpacity style={styles.citasButton} onPress={handleViewAppointments}>
          <Text style={styles.citasButtonText}>Ver citas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditBusiness', { business })}>
          <FontAwesome name="edit" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContainer: {
    paddingBottom: 20,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    marginTop: 40,
  },
  businessImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    paddingHorizontal: 10,
    paddingTop: 40,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    alignSelf: 'flex-start',
  },
  drawerButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#268AAB',
    marginLeft: 10,
  },
  infoContainer: {
    padding: 20,
    marginTop: 20,
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  businessCategory: {
    fontSize: 16,
    color: 'gray',
    marginLeft: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  businessLocation: {
    fontSize: 16,
    color: 'gray',
    marginLeft: 5,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  businessHours: {
    fontSize: 16,
    color: 'gray',
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  businessDescription: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  galleryWrapper: {
    marginHorizontal: -20,
  },
  galleryContainer: {
    paddingHorizontal: 20,
  },
  galleryImage: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
    marginHorizontal: 10,
  },
  commentsContainer: {
    marginTop: 10,
  },
  comment: {
    marginBottom: 10,
  },
  commentUser: {
    fontWeight: 'bold',
  },
  commentText: {
    marginTop: 5,
  },
  commentRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  citasButton: {
    flex: 1,
    backgroundColor: '#268AAB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  citasButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#268AAB',
    borderRadius: 10,
    padding: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default BusinessPreviewScreen;




































