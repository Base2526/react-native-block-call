import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, NativeModules, Alert, RefreshControl, FlatList } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from "lodash"
import * as utils from "../utils"

const { DatabaseHelper } = NativeModules;

interface Block {
  ID: string;
  NAME: string;
  PHONE_NUMBER: string;
  DETAIL: string;
  PHOTO_URI: string;
  REPORTER: string; 
}

const MyBlocklistScreen = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await DatabaseHelper.getAllData();
      console.log("getAllData response:", response);
      setBlocks(response);
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Block }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.PHOTO_URI }} style={styles.image} />
      <View style={styles.detailsContainer}>
        {item.NAME !== 'Unknown' && <Text style={styles.name}>{item.NAME}</Text>}
        <Text style={styles.phone}>{item.PHONE_NUMBER}</Text>
        <Text style={styles.note}>{item.DETAIL}</Text> 
      </View>
      <View style={styles.timeContainer}>
        {/* Add any time-related views here */}
      </View>
    </View>
  );

  const handleUnblock = (id: string) => {
    Alert.alert(
      "Unblock Contact",
      `Are you sure you want to unblock ${id}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: async () => {
            try {
              const response = await DatabaseHelper.deleteData(id);
              console.log("response:", response);
              fetchData(); // Refresh the list after unblocking
            } catch (error) {
              console.log(error);
            }
          } 
        }
      ]
    );
  };

  const renderHiddenItem = (data: { item: Block }) => (
    <View style={styles.hiddenContainer}>
      <TouchableOpacity style={styles.blockButton} onPress={() => handleUnblock(data.item.ID)}>
        <Text style={styles.blockText}>Unblock</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    // <SwipeListView
    //   data={blocks}
    //   renderItem={renderItem}
    //   renderHiddenItem={renderHiddenItem}
    //   keyExtractor={(item) => item.ID}
    //   rightOpenValue={-75}
    //   refreshControl={
    //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    //   }
    // />
    <FlatList
      data={blocks}
      renderItem={renderItem}
      keyExtractor={(item) => item.ID}
      refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }/>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    backgroundColor: '#ccc',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
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
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default MyBlocklistScreen;