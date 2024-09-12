import React from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
}

const SearchScreen: React.FC<any> = ({  }) => {
  return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#C7C7CD" style={styles.icon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search keyword or number"
            placeholderTextColor="#C7C7CD"
          />
        </View>
        
        <View style={styles.imageContainer}>
          {/* Uncomment and set your icon image path here if needed
          <Image 
            source={require('./path/to/your/icon.png')}
            style={styles.image}
          />
          // 
          */}
          {/* <Icon name="search" size={100} color="#aaa" style={styles.image} /> */}
          <Text style={styles.text}>
            Find over millions of numbers here!
          </Text>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7C7CD',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    marginLeft: 30, // Adjusted margin to account for the icon width
    paddingRight: 10, // Add right padding to ensure text doesn't touch the edge
  },
  icon: {
    position: 'absolute',
    left: 15, // Positioned to ensure it aligns nicely within the container
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  image: {
    width: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').width * 0.5,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: '#A3A3A3',
    textAlign: 'center',
  },
});

export default SearchScreen;
