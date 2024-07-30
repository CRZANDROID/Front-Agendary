import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, StatusBar, ScrollView, TextInput, Alert } from 'react-native';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons'; 
import axios from 'axios';
import moment from 'moment';
import UserContext from '../contexts/UserContext';

const BusinessDetailsScreen = ({ route, navigation }) => {
  const { business } = route.params;
  const { user, token } = useContext(UserContext); 
  const [gallery, setGallery] = useState([]);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchGallery();
    fetchComments();
  }, [business.uuid, token]);

  const fetchGallery = async () => {
    try {
      const response = await axios.get(`http://3.80.92.37:8003/api/v1/establishment/gallery/${business.uuid}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setGallery(response.data.data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://3.80.92.37:8003/api/v1comment/establishment/${business.uuid}`, {
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

  const handleScheduleAppointment = () => {
    navigation.navigate('ScheduleAppointment', { business });
  };

  const handleCommentSubmit = async () => {
    if (comment) {
      try {
        console.log('Sending sentiment analysis request...');
        const sentimentResponse = await axios.post(
          'http://54.82.143.58:8004/analizar/', 
          { comentario: comment },
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );
  
        console.log('Sentiment analysis response:', sentimentResponse.data);
        const sentimentData = sentimentResponse.data;
  
        if (sentimentData.mensaje) {
          Alert.alert('Advertencia', sentimentData.mensaje);
          return;
        }
  
        const sentimentRating = Math.round(parseFloat(sentimentData.calificacion));
  
        const commentData = {
          user_id: user.uuid,
          establishment_id: business.uuid,
          comment: comment,
          rating: sentimentRating,
        };
  
        console.log('Sending comment data:', commentData);
        const commentResponse = await axios.post(
          'http://3.80.92.37:8003/api/v1/comment/create/', 
          commentData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
  
        console.log('Comment creation response:', commentResponse.data);
        setComment('');
        fetchComments(); 
      } catch (error) {
        if (error.response) {
          console.error('Response error:', error.response.data);
          if (error.response.status === 400 && error.response.data.detail === "El texto contiene groserías.") {
            Alert.alert('Advertencia', 'El texto contiene groserías. Por favor, modifique su comentario.');
          } else {
            Alert.alert('Error', 'Hubo un problema al enviar el comentario. Por favor, inténtelo de nuevo.');
          }
        } else if (error.request) {
          console.error('Request error:', error.request);
          Alert.alert('Error', 'No se recibió respuesta del servidor. Por favor, inténtelo de nuevo.');
        } else {
          console.error('Setup error:', error.message);
          Alert.alert('Error', 'Hubo un problema al configurar la solicitud. Por favor, inténtelo de nuevo.');
        }
      }
    }
  };

  const formatBusinessHours = (opening, closing) => {
    const formattedOpening = moment(opening, 'HH:mm:ss').format('hh:mm A');
    const formattedClosing = moment(closing, 'HH:mm:ss').format('hh:mm A');
    return `${formattedOpening} - ${formattedClosing}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Image source={business.portrait ? { uri: business.portrait } : require('../assets/placeholder.png')} style={styles.businessImage} />
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
                  keyExtractor={(item, index) => index.toString()}
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
          {comments.map((commentItem, index) => (
            <View key={commentItem.uuid} style={styles.commentContainer}>
              <Text style={styles.commentText}>{commentItem._comment}</Text>
              <View style={styles.commentRatingContainer}>
                {[...Array(5)].map((_, starIndex) => (
                  <FontAwesome key={starIndex} name="star" size={16} color={commentItem._rating > starIndex ? '#FFD700' : 'gray'} />
                ))}
              </View>                 
            </View>
          ))}
          <View style={styles.commentInputContainer}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.commentInput}
                placeholder="Escribe un comentario..."
                value={comment}
                onChangeText={setComment}
                multiline
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleCommentSubmit}>
                <Ionicons name="send-outline" size={24} color="#268AAB" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.agendarButton} onPress={handleScheduleAppointment}>
          <Text style={styles.agendarButtonText}>Agendar</Text>
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
  header: {
    position: 'absolute',
    top: StatusBar.currentHeight + 10,
    left: 10,
    zIndex: 1,
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  businessImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop: StatusBar.currentHeight,
  },
  infoContainer: {
    padding: 20,
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
  commentContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    elevation: 2,
  },
  commentText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  commentRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  commentInputContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  sendButton: {
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#268AAB',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 20,
  },
  agendarButton: {
    backgroundColor: '#268AAB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  agendarButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BusinessDetailsScreen;













