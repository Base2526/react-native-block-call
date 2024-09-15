import React, { useState, useLayoutEffect} from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, RefreshControl, FlatList, NativeModules } from 'react-native';
import _ from "lodash";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { RootState, AppDispatch } from '../redux/store';
import { SmsLog, ItemSms } from "../redux/interface"
import * as utils from "../utils"
import TabIconWithMenu from "../TabIconWithMenu"
import { addMultipleSmsLogs } from '../redux/slices/smslogSlice';

const { DatabaseHelper } = NativeModules;

type SMSProps = {
  navigation: any;
  route: any;
  setMenuOpen: () => void; 
};

const SMSScreen: React.FC<SMSProps> = ({ navigation, route, setMenuOpen }) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
      
    // Hide tab bar for certain routes
    if (  routeName === 'Profile' ||
          routeName === "SMSDetail" || 
          routeName === 'Settings' ||
          routeName === 'HelpSendFeedback' ||  
          routeName === 'Search' ||
          routeName ==='About') {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }

    console.log("HomeStackScreen:", routeName);
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => { setMenuOpen() }} style={styles.menuButton}>
          <Icon name="menu" size={24} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            style={{ padding:5, marginRight: 5 }} 
            onPress={()=>{ navigation.navigate("Search") }}>
            <Icon name="magnify" size={25} color="#333" />
          </TouchableOpacity>
          <TabIconWithMenu 
            iconName="dots-vertical"
            menuItems={[
              { label: 'Clear all', onPress: () => console.log('Item 1 pressed') },
            ]}/>
        </View>
      ),
      headerShown: true // hide/show header parent
    });

  }, [navigation, route]);

  const dispatch: AppDispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false); 

  const smsLogs = useSelector((state: RootState) => state.smsLog.smsLogs);

  const fetchSmsLogs = async () => {
    try {
      const response = await DatabaseHelper.fetchSmsLogs();      
      if (response.status) {
        dispatch(addMultipleSmsLogs(response.data));
      }
    } catch (error) {
      console.error("Error fetching sms logs:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  const findLastUpdatedSmsLog = (logs: ItemSms[]): ItemSms => {
    return logs.reduce((latest, current) => {
        return (latest === null || Number(current.date) > Number(latest.date)) ? current : latest;
    });
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
          {lastMessage.photoUri ? (
            <Image source={{ uri: lastMessage.photoUri }} style={styles.image} />
          ) : (
            <Icon name="account" size={30} style={styles.image} />
          )}
        </View>
        <View style={styles.detailsContainer}>
          {lastMessage.name === 'Unknown' ? null : <Text style={styles.name}>{lastMessage.name}</Text>}
          <Text style={styles.phone}>{item.address}</Text>
          <Text style={styles.note}>{lastMessage.body}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{utils.getDate(Number(lastMessage.date))}</Text>
          {!_.isEmpty(callCount) && (
            <View style={styles.callCountContainer}>
              <Text style={styles.callCount}>{callCount.toString()}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (_.isEmpty(smsLogs)) {
    return (
      <TouchableOpacity style={styles.emptyContainer} onPress={()=>fetchSmsLogs()}>
        <Icon name="message-off" size={80} color="#ccc" />
        <Text style={styles.emptyText}>No SMS Logs available</Text>
      </TouchableOpacity>
    );
  }

  return (
      <View style={styles.container}>
        {
        smsLogs.length === 0 ? (
          <TouchableOpacity style={styles.emptyContainer} onPress={()=>{fetchSmsLogs()}}>
            <Icon name="message-off" size={80} color="#ccc" />
            <Text style={styles.emptyText}>No SMS Logs available</Text>
          </TouchableOpacity>
        ) : (
          <FlatList
            data={smsLogs}
            renderItem={renderItem}
            keyExtractor={(item) => item.address}
            initialNumToRender={10}
            windowSize={5}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        )
      }
</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#eee',
    marginRight: 15,
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 15,
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
    justifyContent: 'center',
  },
  time: {
    color: '#888',
  },
  callCountContainer: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  callCount: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#ccc',
    marginTop: 10,
  },
  menuButton: {
    marginLeft: 10,
  },
});

export default SMSScreen;