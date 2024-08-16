import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, NativeModules, Alert, RefreshControl, ScrollView } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view'; // Importing SwipeListView
import Icon from 'react-native-vector-icons/Ionicons'; // Importing the Icon component
import _ from "lodash";
import * as utils from "../utils";
import SMSDetailModal from "../modal/SMSDetailModal";

const { DatabaseHelper } = NativeModules;

interface Message {
  body: string;
  date: string; // Assuming date is stored as a string (timestamp)
  id: string;
  name: string;
  number: string;
  photoUri: string | undefined; // photoUri can be a string or null
  read: number; // 1 for read, 0 for unread
  status: string; // Status as a string
  thread_id: string;
  type: string;
}

interface SmsLog {
  address: string;
  messages: Message[];
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

const findLastUpdatedSmsLog = (logs: SmsLog[]): SmsLog | undefined => {
  return logs.reduce((latest, current) => {
      return (latest === null || Number(current.date) > Number(latest.date)) ? current : latest;
  }, null as SmsLog | null);
};

const SMSScreen: React.FC = ({ navigation }) => {
  const [smss, setSmss] = useState<SmsLog[]>([]);
  const [smsDetailVisible, setSMSDetailVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh

  const fetchSmsLogs = async () => {
    try {
      let smslogs = await utils.getObject('smslogs');
      if (smslogs === null || _.isEmpty(smslogs)) {
        console.log("fetch data ...");
        const response = await DatabaseHelper.fetchSmsLogs();
        console.log("fetchSmsLogs response :", response);

        setSmss(response);
        await utils.saveObject('smslogs', response);
      } else {
        setSmss(smslogs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSmsLogs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSmsLogs();
    setRefreshing(false);
  };

  const closeSMSDetailModal = () => {
    setSMSDetailVisible(false);
  };

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

  const renderItem = ({ item }: { item: SmsLog }) => {
    const lastMessage: SmsLog | undefined = findLastUpdatedSmsLog(item.messages);
    const callCount = _.filter(item.messages, item => item.read === 0).length;

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          navigation.navigate('SMSDetail', { thread_id: lastMessage.thread_id });
        }}
      >
        {/* <SMSDetailModal thread_id={lastMessage.thread_id} visible={smsDetailVisible} onClose={closeSMSDetailModal} title="SMS Detail" /> */}
        <Image source={{ uri: lastMessage.photoUri }} style={styles.image} />
        <View style={styles.detailsContainer}>
          {lastMessage.name === 'Unknown' ? <></> : <Text style={styles.name}>{lastMessage.name}</Text>}
          <Text style={styles.phone}>{item.address}</Text>
          <Text style={styles.note}>{lastMessage.body}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{getDate(lastMessage.date)}</Text>
          {_.isEmpty(callCount) ? <></> : <View style={styles.callCountContainer}><Text style={styles.callCount}>{callCount.toString()}</Text></View>}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHiddenItem = (data: { item: SmsLog }) => (
    <View style={styles.hiddenContainer}>
      <TouchableOpacity style={styles.blockButton} onPress={() => handleBlock(data.item.phone)}>
        <Text style={styles.blockText}>Block</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SwipeListView
      data={smss}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      keyExtractor={(item) => item.address}
      rightOpenValue={-75} // Width of the hidden block button
      style={styles.list}
      initialNumToRender={8}
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
  list: {
    // padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items to the start
    padding: 10,
    // borderBottomWidth: 1,
    backgroundColor: '#ccc',
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

export default SMSScreen;