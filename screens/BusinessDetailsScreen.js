import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, StatusBar, ScrollView, Dimensions } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';

const BusinessDetailsScreen = ({ route, navigation }) => {
  const { business } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  const handleScheduleAppointment = () => {
    navigation.navigate('ScheduleAppointment', { business });
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const formatBusinessHours = (hours) => {
    const [startHour, endHour] = hours.split(' - ');
    const formattedStartHour = moment(startHour, 'HH:mm').format('hh:mm A');
    const formattedEndHour = moment(endHour, 'HH:mm').format('hh:mm A');
    return `${formattedStartHour} - ${formattedEndHour}`;
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
        <Image source={business.image} style={styles.businessImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.businessName}>{business.name}</Text>
          <View style={styles.categoryContainer}>
            <MaterialIcons name="category" size={24} color="gray" />
            <Text style={styles.businessCategory}>{business.category}</Text>
          </View>
          <View style={styles.locationContainer}>
            <FontAwesome name="map-marker" size={24} color="#FFA500" />
            <Text style={styles.businessLocation}>{business.location}</Text>
          </View>
          <View style={styles.hoursContainer}>
            <FontAwesome name="clock-o" size={24} color="gray" />
            <Text style={styles.businessHours}>{formatBusinessHours(business.hours)}</Text>
          </View>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.businessDescription}>{business.description}</Text>
          <Text style={styles.sectionTitle}>Galería</Text>
          <View style={styles.galleryWrapper}>
            <FlatList
              data={business.gallery}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Image source={item} style={styles.galleryImage} />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToAlignment="center"
              decelerationRate="fast"
              contentContainerStyle={styles.galleryContainer}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoriteToggle}>
          <FontAwesome name="heart" size={24} color={isFavorite ? 'red' : 'gray'} />
        </TouchableOpacity>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  favoriteButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  agendarButton: {
    backgroundColor: '#268AAB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  agendarButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BusinessDetailsScreen;

