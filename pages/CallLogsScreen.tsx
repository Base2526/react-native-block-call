import React, { useEffect, useState, useCallback } from 'react';
import { NativeModules, View, Text, StyleSheet, TouchableOpacity, Alert, Image, RefreshControl, ActivityIndicator, FlatList, Button } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view'; // Importing SwipeListView
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing the Icon component
import _ from "lodash";
import { useSelector, useDispatch } from 'react-redux';

import * as utils from "../utils"

import { RootState, AppDispatch } from '../redux/store';
import { increment, decrement, incrementByAmount, incrementAsync } from '../redux/slices/counterSlice';
import { addCallLog, updateCallLog, removeCallLog, clearCallLogs } from '../redux/slices/calllogSlice';



// import { RootState, AppDispatch } from '../redux/store';
// import { increment, decrement, setValue } from '../redux/slices/counterSlice';

const { DatabaseHelper } = NativeModules;

interface Contact {
  id: string;
  name: string;
  phone: string;
  time: string;
  image: string;
}

const CallLogsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  // const count = useSelector((state: RootState) => state.counter.value);
  // const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const count = useSelector((state: RootState) => state.counter.value);
  const status = useSelector((state: RootState) => state.counter.status);

  // const dispatch: AppDispatch = useDispatch();
  const callLogs = useSelector((state: RootState) => state.callLog.callLogs);


  const fetchContacts = async () => {
    // let calllogs = await utils.getObject('calllogs');

    // if (calllogs === null) {
      DatabaseHelper.fetchCallLogs()
        .then(async (response: any) => {
          const contacts = [];
          // _.map(response, (item, i) => {
          //   contacts.push({
          //     id: i.toString(),
          //     name: item.name,
          //     phone: item.number,
          //     time: utils.getDate(item.date),
          //     image: item.photoUri,
          //   });
          // });
          // setContacts(contacts);
          // await utils.saveObject('calllogs', contacts);

          console.log("CallLogsScreen :", response)

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
    // <TouchableOpacity style={styles.itemContainer} onPress={() => { navigation.navigate("CallLogsDetail"); }} onLongPress={() => Alert.alert("onLongPress")}>
    //   <Image source={{ uri: item.image }} style={styles.image} />
    //   <View style={styles.detailsContainer}>
    //     {item.name === 'Unknown' ? null : <Text style={styles.name}>{item.name}</Text>}
    //     <Text style={styles.phone}>{item.phone}</Text>
    //   </View>
    //   <View style={styles.timeContainer}>
    //     <Text style={styles.time}>{item.time}</Text>
    //     <Icon name="call" size={20} color="#007AFF" style={styles.icon} />
    //   </View>
    // </TouchableOpacity>

    <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => { navigation.navigate("CallLogsDetail"); }}
        onLongPress={() => Alert.alert("onLongPress")}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.detailsContainer}>
          {item.name === 'Unknown' ? null : <Text style={styles.name}>{item.name}</Text>}
          <Text style={styles.phone}>{item.phone}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{item.time}</Text>
          <Icon name="call" size={20} color="#007AFF" style={styles.icon} />
          <TouchableOpacity
            // style={styles.menuButton}
            onPress={() => Alert.alert("Menu options")}
          >
            <Icon name="more-vert" size={24} color="#000" />
          </TouchableOpacity>
        </View>
    </TouchableOpacity>
  );


  const handleAddLog = () => {
    const min = 1;
    const max = 100;
    const rand = min + Math.random() * (max - min);
    const newLog = {
      id: rand.toString(),
      name: 'Sample Name',
      number: '1234567890',
      photoUri: null,
      type: 'Incoming',
      date: Date.now().toString(),
    };
    dispatch(addCallLog(newLog));
  };

  const handleUpdateCallLog = (id: string) => {
    const min = 100;
    const max = 100000;
    const rand = min + Math.random() * (max - min);

    dispatch(updateCallLog({
      id,
      updatedData: { name: 'Updated Name + '+ rand }, // Example update
    }));
  };

  const handleRemoveCallLog = (id: string) => {
    dispatch(removeCallLog(id));
  };

  return (
    // <View>
      <View style={styles.container}>
        {/*  */}
        <Button title="Add Call Log" onPress={() =>handleAddLog()} />
        {callLogs.map((log) => (
          <View key={log.date}>
            <Text>{log.id}</Text>
            <Text>{log.name}</Text>
            <Text>{log.number}</Text>
            <Text>{log.date}</Text>
            <Text>{log.type}</Text>
            <Button title="Update" onPress={() =>{
              handleUpdateCallLog(log.id)
            }} />
           <Button title="Remove" onPress={() =>{
              handleRemoveCallLog(log.id)
            }} />
          </View>
        ))}
        {/*  */}

        <Text style={styles.count}>{count}</Text>
        <Button title="Increment" onPress={() => dispatch(increment())} />
        <Button title="Decrement" onPress={() => dispatch(decrement())} />
        <Button title="Increment by 5" onPress={() => dispatch(incrementByAmount(5))} />
        <Button
          title="Increment Async"
          onPress={() => dispatch(incrementAsync(10))}
          disabled={status === 'loading'}
        />
        {status === 'loading' && <ActivityIndicator size="small" color="#0000ff" />}
        {status === 'failed' && <Text style={styles.error}>Error occurred</Text>}
      </View>
      // {
      //   loading 
      //   ? <ActivityIndicator color={"#fff"}  size={'large'}/>
      //   : <FlatList
      //       data={contacts}
      //       renderItem={renderItem}
      //       keyExtractor={(item) => item.id}
      //       refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }/>
      // } 
    // </View>
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



  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    fontSize: 32,
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default CallLogsScreen;