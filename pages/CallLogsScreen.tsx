import React, { useEffect, useState, useCallback } from 'react';
import { NativeModules, View, Text, StyleSheet, TouchableOpacity, Alert, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view'; // Importing SwipeListView
import Icon from 'react-native-vector-icons/Ionicons'; // Importing the Icon component
import _ from "lodash";

import * as utils from "../utils"

const { DatabaseHelper } = NativeModules;

interface Contact {
  id: string;
  name: string;
  phone: string;
  time: string;
  image: string;
}


const CallLogsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchContacts = async () => {
    // let calllogs = await utils.getObject('calllogs');

    // if (calllogs === null) {
      DatabaseHelper.fetchCallLogs()
        .then(async (response: any) => {
          const contacts = [];
          _.map(response, (item, i) => {
            contacts.push({
              id: i.toString(),
              name: item.name,
              phone: item.number,
              time: utils.getDate(item.date),
              image: item.photoUri,
            });
          });
          setContacts(contacts);
          // await utils.saveObject('calllogs', contacts);

          setLoading(false)
        })
        .catch((error: any) =>{
          setLoading(false);
          console.log(error);
        })
    // } else {
    //   setContacts(calllogs);
    // }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchContacts();
    setRefreshing(false);
  }, []);

  const handleBlock = (phone: string) => {
    Alert.alert(
      "Block Contact",
      `Are you sure you want to block ${phone}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => {
          DatabaseHelper.addData({ phoneNumber: phone, detail: "xxxx", reporter: "a1" })
          .then(async (response: any) => {
            console.log("response :", response)
          })
          .catch((error: any) => console.log(error));
        }} // Implement your blocking logic here
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

  if(loading){
    return <ActivityIndicator color={"#fff"}  size={'large'}/>
  }

  return (
    <SwipeListView
      data={contacts}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      keyExtractor={(item) => item.id}
      rightOpenValue={-75} // Width of the hidden block button
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor:'#ccc'
  },
  hiddenContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 15,
  },
  blockButton: {
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