import React, { useEffect, useState }from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, NativeModules } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { DatabaseHelper } = NativeModules;


const SMSDetailModal: React.FC<any> = ({ route }) => {
  const { thread_id } = route.params;
  const [datas, setDatas] = useState([]);

  useEffect(()=>{
    try {
      DatabaseHelper.fetchSmsMessagesByThreadId(thread_id).then((response: any) => {
        console.log("fetchSmsMessagesByThreadId response @1:", response)

        setDatas(response);
      })
      .catch((error: any) =>{
        console.log("fetchSmsMessagesByThreadId response @2:",error)
      } );
    } catch (error) {
      console.error("Error fetching SMS messages: ", error);
    }

  }, [])

  return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Text style={styles.text}>{ JSON.stringify(datas) }</Text>
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
    marginTop: 60, // Adjust this margin to avoid overlapping with the close button
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
    // alignItems: 'center',
    // justifyContent: 'center',
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

export default SMSDetailModal;