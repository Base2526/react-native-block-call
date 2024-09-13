import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, RefreshControl, FlatList } from 'react-native';
import _ from "lodash";
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

import { RootState, AppDispatch } from '../redux/store';
import { SmsLog, ItemSms } from "../redux/interface"

import * as utils from "../utils"

const findLastUpdatedSmsLog = (logs: ItemSms[]): ItemSms => {
  return logs.reduce((latest, current) => {
      return ( latest === null || Number(current.date) > Number(latest.date)) ? current : latest;
  });
};

const SMSScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false); 
  const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);

  const openMenu = (id: string) => setVisibleMenuId(id);
  const closeMenu = () => setVisibleMenuId(null);

  const smsLogs = useSelector((state: RootState) => state.smsLog.smsLogs);
  console.log("smsLogs length :", smsLogs, smsLogs.length)
  

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: SmsLog }) => {
    const lastMessage: ItemSms = findLastUpdatedSmsLog(item.messages);
    const callCount = _.filter(item.messages, item => item.read === 0).length;

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => { 
          navigation.navigate('SMSDetail', { thread_id: lastMessage.thread_id, number: lastMessage.address }); 
        }}>
        <View style={styles.avatarContainer}>
          {
            lastMessage.photoUri 
            ? <Image source={{ uri: lastMessage.photoUri }} style={styles.image} />
            : <Icon name="account" size={30}  style={styles.image} />
          }
        </View>
        <View style={styles.detailsContainer}>
          {lastMessage.name === 'Unknown' ? <></> : <Text style={styles.name}>{lastMessage.name}</Text>}
          <Text style={styles.phone}>{item.address}</Text>
          <Text style={styles.note}>{lastMessage.body}</Text>
        </View>
        <View style={styles.timeContainer}>
          {/* <TouchableOpacity onPress={() => openMenu(item.number) {}}>
            <Icon name="dots-vertical" size={24} color="#555" />
          </TouchableOpacity> */}

          <Menu
            visible={visibleMenuId === item.address}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity style={{}} onPress={() => openMenu(item.address)}>
                <Icon name="dots-vertical" size={24} color="#555" />
              </TouchableOpacity>
            }>
            <Menu.Item 
              onPress={() =>{
                // openModal();
                closeMenu();
              }} title="Block" />
            <Divider />
            <Menu.Item 
              onPress={() => {
                closeMenu();
              }} title="Report" />
          </Menu>
          <Text style={styles.time}>{utils.getDate(Number(lastMessage.date))}</Text>
          {_.isEmpty(callCount) ? <></> : <View style={styles.callCountContainer}><Text style={styles.callCount}>{callCount.toString()}</Text></View>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={smsLogs}
      renderItem={renderItem}
      keyExtractor={(item) => item.address}
      initialNumToRender={10} // Adjust this number based on screen size
      windowSize={5} // Adjust for optimal off-screen rendering
      removeClippedSubviews={true} // Helps improve performance for large lists
      maxToRenderPerBatch={10} // Renders a small batch of items at a time
      ItemSeparatorComponent={() => <Divider />}  // Add a divider between items
      refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }/>);
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Center items vertically
    // padding: 10,
    margin:10,
    // backgroundColor: 'yellow',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30, // Half of width/height for a circular shape
    backgroundColor: '#eee', // Background color if no image
    marginRight: 15,
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 15, // Half of width/height for a circular image
  },
  detailsContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
  },
  phone: {
    color: '#555',
  },
  note: {
    color: '#777',
    marginTop: 4,
  },
  timeContainer: {
    // alignItems: 'flex-end', 
    // justifyContent: 'center',
    // backgroundColor: 'blue',
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