import React, { useEffect, useState } from 'react';
import { NativeModules, View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view'; // Importing SwipeListView
import Icon from 'react-native-vector-icons/Ionicons'; // Importing the Icon component
import _ from "lodash";

import CallLogsDetailModal from '../modal/CallLogsDetailModal';
import * as utils from "../utils"

const { DatabaseHelper } = NativeModules;

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

const CallLogsScreen: React.FC = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(async() => {
    let calllogs = await utils.getObject('calllogs');

    // console.log("calllogs :", calllogs);
    if(calllogs === null){
      DatabaseHelper.fetchCallLogs()
      .then(async(response: any) => {
        const contacts = [];
        _.map(response, (item, i) => {
          contacts.push({
            id: i.toString(),
            name: item.name,
            phone: item.number,
            time: getDate(item.date),
            image: item.photoUri,
          });
        });
        setContacts(contacts);
        await utils.saveObject('calllogs', contacts);
      })
      .catch((error: any) => console.log(error));
    }else{
      setContacts(calllogs);
    }
  }, []);

  // const openModal = () => {
  //   setModalVisible(true);
  // };

  // const closeModal = () => {
  //   setModalVisible(false);
  // };

  // Function to handle block action
  const handleBlock = (phone: string) => {
    Alert.alert(
      "Block Contact",
      `Are you sure you want to block ${phone}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log(`Blocked: ${phone}`) } // Implement your blocking logic here
      ]
    );
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => { navigation.navigate("CallLogsDetail"); }} onLongPress={() => Alert.alert("onLongPress")}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.detailsContainer}>
        {item.name === 'Unknown' ? null : <Text style={styles.name}>{item.name}</Text>}
        <Text style={styles.phone}>{item.phone}</Text>
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{item.time}</Text>
        <Icon name="call" size={20} color="#007AFF" style={styles.icon} />
      </View>
    </TouchableOpacity>
  );

  const renderHiddenItem = (data: { item: Contact }) => (
    <View style={styles.hiddenContainer}>
      <TouchableOpacity style={styles.blockButton} onPress={() => handleBlock(data.item.phone)}>
        <Text style={styles.blockText}>Block</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      {/* <CallLogsDetailModal visible={modalVisible} onClose={closeModal} title="CallLogs Detail Modal" /> */}
      <SwipeListView
        data={contacts}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        keyExtractor={(item) => item.id}
        rightOpenValue={-75} // Width of the hidden block button
        style={styles.list}
      />
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    // padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
    backgroundColor:'#ccc'
  },
  hiddenContainer: {
    // backgroundColor: '#FF3B30',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 15,
  },
  blockButton: {
    // backgroundColor: '#FF3B30',
    // padding: 15,
    borderRadius: 5,
  },
  blockText: {
    color: '#000',
    fontWeight: 'bold',
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