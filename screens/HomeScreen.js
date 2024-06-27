import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, FlatList, SectionList, SafeAreaView, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const services = [
  { id: '1', name: 'Coronita CarWash', location: 'Tuxtla Gutierrez', image: require('../assets/carwash1.jpeg') },
  { id: '2', name: 'Coronita CarWash', location: 'Tuxtla Gutierrez', image: require('../assets/carwash1.jpeg') },
  { id: '3', name: 'Coronita CarWash', location: 'Tuxtla Gutierrez', image: require('../assets/carwash1.jpeg') },
  { id: '4', name: 'Coronita CarWash', location: 'Tuxtla Gutierrez', image: require('../assets/carwash1.jpeg') },
  { id: '5', name: 'Coronita CarWash', location: 'Tuxtla Gutierrez', image: require('../assets/carwash1.jpeg') },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const sections = [
    { title: 'Para ti', data: [services] },
    { title: 'Servicios', data: services },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome name="bars" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Home</Text>
          <Image source={require('../assets/profile.jpg')} style={styles.profileImage} />
        </View>

        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.id + index}
          ListHeaderComponent={() => (
            <View style={styles.searchContainerWrapper}>
              <Text style={styles.searchTitle}>¡Busca tu servicio!</Text>
              <View style={styles.searchContainer}>
                <TextInput placeholder="Buscar" style={styles.searchInput} />
                <TouchableOpacity style={styles.searchIcon}>
                  <FontAwesome name="search" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionTitle}>{title}</Text>
          )}
          renderItem={({ item, section }) =>
            section.title === 'Para ti' ? (
              <FlatList
                data={item}
                horizontal
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <Image source={item.image} style={styles.cardImage} />
                    <Text style={styles.cardText}>{item.name}</Text>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <View style={styles.serviceCard}>
                <Image source={item.image} style={styles.serviceCardImage} />
                <View style={styles.serviceCardInfo}>
                  <Text style={styles.serviceCardName}>{item.name}</Text>
                  <View style={styles.locationContainer}>
                    <Image source={require('../assets/location.png')} style={styles.locationIcon} />
                    <Text style={styles.serviceCardLocation}>{item.location}</Text>
                  </View>
                  <TouchableOpacity style={styles.agendarButton}>
                    <Text style={styles.agendarButtonText}>Agendar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight, 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#268AAB',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainerWrapper: {
    paddingHorizontal: 20,
  },
  searchTitle: {
    fontSize: 20,
    color: '#268AAB',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
  searchIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#268AAB',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#268AAB',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  card: {
    width: 150,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    marginRight: 10,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 100,
  },
  cardText: {
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  serviceCard: {
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 20, 
    padding: 10, 
    overflow: 'hidden',
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 2, 
  },
  serviceCardImage: {
    width: 100,
    height: 100,
    borderRadius: 10, 
  },
  serviceCardInfo: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  serviceCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  locationIcon: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  serviceCardLocation: {
    fontSize: 14,
    color: 'gray',
  },
  agendarButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  agendarButtonText: {
    color: '#268AAB',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
