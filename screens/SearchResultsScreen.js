import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const SearchResultsScreen = ({ navigation, route }) => {
  const { query, establishments } = route.params;
  const [filteredEstablishments, setFilteredEstablishments] = useState([]);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const results = establishments.filter(establishment =>
      establishment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      establishment.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEstablishments(results);
  }, [searchQuery]);

  const handleSearch = () => {
    const results = establishments.filter(establishment =>
      establishment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      establishment.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEstablishments(results);
  };

  const handleAgendar = (business) => {
    navigation.navigate('BusinessDetails', { business });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar"
        />
        <TouchableOpacity style={styles.searchIconWrapper} onPress={handleSearch}>
          <FontAwesome name="search" size={24} color="white" style={styles.searchIcon} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredEstablishments}
        keyExtractor={item => item.uuid}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleAgendar(item)}>
            <View style={styles.serviceCard}>
              <Image source={item.portrait ? { uri: item.portrait } : require('../assets/placeholder.png')} style={styles.serviceCardImage} />
              <View style={styles.serviceCardInfo}>
                <Text style={styles.serviceCardName}>{item.name}</Text>
                <View style={styles.locationContainer}>
                  <Image source={require('../assets/location.png')} style={styles.locationIcon} />
                  <Text style={styles.serviceCardLocation}>{item.address}</Text>
                </View>
                <TouchableOpacity style={styles.agendarButton} onPress={() => handleAgendar(item)}>
                  <Text style={styles.agendarButtonText}>Agendar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight, 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },
  searchIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#268AAB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceCard: {
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: '#fff',
    margin: 10,
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

export default SearchResultsScreen;


