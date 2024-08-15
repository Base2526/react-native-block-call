import React from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
}

const SearchScreen: React.FC<any> = ({  }) => {
  return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
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
          */}
          <Text style={styles.text}>
            Find over millions of numbers here!
          </Text>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
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
  searchContainer: {
    marginTop: 20, // Adjust this margin to avoid overlapping with the close button
    marginBottom: 40,
  },
  searchInput: {
    height: 50,
    backgroundColor: '#F0F0F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
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
