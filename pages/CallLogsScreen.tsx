import React, { useEffect, useState } from 'react';
import { NativeModules, View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Importing the Icon component
import _ from "lodash"

import CallLogsDetailModal from '../modal/CallLogsDetailModal';

const { DatabaseHelper } = NativeModules;

// const generateContacts = (count: number) => {
//     const contacts = [];
//     for (let i = 1; i <= count; i++) {
//       contacts.push({
//         id: i.toString(),
//         name: `Contact ${i}`,
//         phone: `+1 ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 9000 + 1000)}`,
//         time: `${Math.floor(Math.random() * 12 + 1)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() < 0.5 ? 'AM' : 'PM'}`,
//         image: 'https://via.placeholder.com/50', // Placeholder image URL
//       });
//     }
//     return contacts;
//   };

// // Sample data for the contact list
// const contacts = generateContacts(10);

// Define the type for the contact item
interface Contact {
  id: string;
  name: string;
  phone: string;
  time: string;
  image: string;
}

function getDate(format: string = 'MM/DD'): string {
  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero
  const year = today.getFullYear();
  const date = today.getDate().toString().padStart(2, '0'); // Add leading zero

  switch (format) {
    case 'DD/MM':
      return `${date}/${month}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${date}`;
    default: // 'MM/DD'
      return `${month}/${date}`;
  }
}

const CallLogsScreen: React.FC<Props> = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [contacts, setContacts] = useState([]);

  useEffect(()=>{
    DatabaseHelper.fetchCallLogs()
    .then((response: any) => {
        console.log("fetchCallLogs response :", response)
        // {"date": "1723250685093", "name": "Unknown", "number": "1234567890", "type": "2", "photoUri": null}
        const contacts = [];
        _.map(response, (item, i)=>{
          contacts.push({
            id: i.toString(),
            name: item.name,
            phone: item.number,
            time: getDate( item.date ),
            image: item.photoUri,
          });
        })
        setContacts(contacts)
    })
    .catch((error: any) => console.log(error));
  }, [])
 
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={()=>{ openModal() }} onLongPress={()=>Alert.alert("onLongPress")}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.detailsContainer}>
        {/* <Text style={styles.name}>{item.name}</Text> */}
        {
          item.name === 'Unknown' ? <></> : <Text style={styles.name}>{item.name}</Text>
        }
        <Text style={styles.phone}>{item.phone}</Text>
      </View> 
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{item.time}</Text>
        <Icon name="call" size={20} color="#007AFF" style={styles.icon} /> 
      </View> 
    </TouchableOpacity>
  );

  return (
    <>
      <CallLogsDetailModal visible={modalVisible} onClose={closeModal} title="CallLogs Detail Modal" />
      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}/>
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25, // Circular image
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1, // Allows the name and phone to take available space
  },
  name: {
    fontWeight: 'bold',
  },
  phone: {
    color: '#555',
  },
  timeContainer: {
    alignItems: 'flex-end', // Align time and icon to the right
    justifyContent: 'center',
  },
  time: {
    color: '#888',
  },
  icon: {
    marginTop: 5, // Space between time and icon
  },
});

export default CallLogsScreen;
