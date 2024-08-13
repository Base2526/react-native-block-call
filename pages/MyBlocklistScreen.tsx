import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, NativeModules } from 'react-native';
// Importing the Icon component
import Icon from 'react-native-vector-icons/Ionicons';
import _ from "lodash"

const { DatabaseHelper } = NativeModules;

// const generateContacts = (count: number) => {
//   const contacts = [];
//   for (let i = 1; i <= count; i++) {
//     contacts.push({
//       id: i.toString(),
//       name: `Contact ${i}`,
//       phone: `+1 ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 9000 + 1000)}`,
//       time: `${Math.floor(Math.random() * 12 + 1)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() < 0.5 ? 'AM' : 'PM'}`,
//       image: 'https://via.placeholder.com/50', // Placeholder image URL
//       note: `This is a note for ${i}`, // Example note for multiline text
//       callCount: Math.floor(Math.random() * 10), // Random call count for each contact
//     });
//   }
//   return contacts;
// };
// Sample data for the contact list
// const smss = generateContacts(10);

// Define the type for the contact item
interface sms {
  id: string;
  name: string;
  phone: string;
  time: string;
  image: string;
  note: string; // Added note for multiline text
  callCount: number; // Added callCount
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

const MyBlocklistScreen = () => {
  const [smss, setSmss] = useState([]);

  useEffect(()=>{
    DatabaseHelper.fetchSmsLogs()
    .then((response: any) => {
        console.log("fetchSmsLogs response :", response)

        const smss = [];
        _.map(response, (item, i)=>{
          // {"address": "0817316162", "body": "0817316162 พยายามติดต่อคุณเวลา21:09น.This number tried to contact you.", "date": "1538489392080"}
          smss.push({
            id: i.toString(),
            name: item.name,
            phone: item.number,
            time: getDate(item.date),
            image: item.photoUri, // Placeholder image URL
            note: item.body, // Example note for multiline text
            callCount: Math.floor(Math.random() * 10), // Random call count for each contact
          });
        })
        setSmss(smss)
    })
    .catch((error: any) => console.log(error));
  }, [])

  const renderItem = ({ item }: { item: Contact }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.detailsContainer}>
        {
          item.name === 'Unknown' ? <></> : <Text style={styles.name}>{item.name}</Text>
        }
        
        <Text style={styles.phone}>{item.phone}</Text>
        <Text style={styles.note}>{item.note}</Text> 
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{item.time}</Text>
        <View style={styles.callCountContainer}>
          <Text style={styles.callCount}>{item.callCount.toString()}</Text> 
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={smss}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items to the start
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
  note: {
    color: '#777',
    marginTop: 4, // Space between phone and note
  },
  timeContainer: {
    alignItems: 'flex-end', // Align time and icon to the right
    justifyContent: 'center',
  },
  time: {
    color: '#888',
  },
  callCountContainer: {
    width: 25, // Set width for circular view
    height: 25, // Set height for circular view
    borderRadius: 12.5, // Half of width/height to make it circular
    backgroundColor: '#007AFF', // Background color for the circle
    alignItems: 'center', // Center text horizontally
    justifyContent: 'center', // Center text vertically
    marginTop: 5, // Space between time and call count
  },
  callCount: {
    color: '#FFFFFF', // Text color for call count
    fontWeight: 'bold',
    fontSize: 14, // Adjust font size as needed
  },
});

export default MyBlocklistScreen;