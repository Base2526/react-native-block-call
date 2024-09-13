import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, RefreshControl, FlatList } from 'react-native';
import _ from "lodash";
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

import { RootState } from '../redux/store';
import { SmsLog, ItemSms } from "../redux/interface"
import * as utils from "../utils"

const findLastUpdatedSmsLog = (logs: ItemSms[]): ItemSms => {
  return logs.reduce((latest, current) => {
      return (latest === null || Number(current.date) > Number(latest.date)) ? current : latest;
  });
};

const SMSScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false); 
  const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);

  const smsLogs = useSelector((state: RootState) => state.smsLog.smsLogs);

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
      <View style={styles.emptyContainer}>
        <Icon name="message-off" size={100} color="#ccc" />
        <Text style={styles.emptyText}>No SMS Logs available</Text>
      </View>
    );
  }

  return (
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
  );
};

const styles = StyleSheet.create({
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
});

export default SMSScreen;