import React, { useEffect, useCallback, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, RefreshControl, FlatList, NativeModules } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Divider } from 'react-native-paper';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import _ from "lodash"

import { RootState, AppDispatch } from '../redux/store';
import { CallLog, ItemCall } from "../redux/interface";
import { getDate } from "../utils";
import BlockReasonModal from './BlockReasonModal'; 
import { useMyContext } from '../MyProvider'; 
import TabIconWithMenu from "../TabIconWithMenu"

// const { DatabaseHelper } = NativeModules;

type CallLogsProps = {
  navigation: any;
  route: any;
  setMenuOpen: () => void; // Define the function prop
};

interface BlockNumberItem{
  ID: string;
  DETAIL: string;
  NAME: string;
  PHONE_NUMBER: string;
  PHOTO_URI: string | null;
  REPORTER: string;
  CREATE_AT: string;
  UPDATE_AT: string;
}

const CallLogsScreen: React.FC<CallLogsProps> = ({ navigation, route, setMenuOpen }) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    
    // Hide tab bar for certain routes
    if (  routeName === "Profile" || 
          routeName === 'CallLogsDetail' || 
          routeName === 'Search' || 
          routeName === 'Settings' ||
          routeName === 'HelpSendFeedback' || 
          routeName === 'About' ||
          routeName === 'SMSDetail'
        ) {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }
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
              // { label: 'Item 2', onPress: () => console.log('Item 2 pressed') },
            ]}/>
        </View>
      ),
      headerShown: true, 
    });
  }, [navigation, route]);

  const { openLoginModal } = useMyContext();

  const [refreshing, setRefreshing] = useState(false);
  const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);

  const openMenu = (id: string) => setVisibleMenuId(id);
  const closeMenu = () => setVisibleMenuId(null);

  const dispatch: AppDispatch = useDispatch();
  const callLogs = useSelector((state: RootState) => state.callLog.callLogs);
  const blockList = useSelector((state: RootState) => state.block.blockList );


  const [blockReasonModal, setBlockReasonModal] = useState<ItemCall | null>(null);
  // const [blockNumber, setBlockNumber] = useState<BlockNumberItem | []>([]);

  const openBlockReasonModal = (item: ItemCall) => {
    setBlockReasonModal(item);
  };

  const closeBlockReasonModal = () => {
    setBlockReasonModal(null);
  };

  // const fetchBlockNumberAll = async()=>{
  //   try {
  //     const response = await DatabaseHelper.getBlockNumberAllData();
  //     console.log("response :", response);

  //     if(response.status){
  //       setBlockNumber(response.data)
  //     }
  //   } catch (error ) {
  //     console.error("useEffect : ", error);
  //   }
  // }

  // useEffect(()=>{
  //   // fetchBlockNumberAll()
  // }, [])

  // useEffect(()=>{
  //   console.log("blockNumber :", blockNumber)
  // }, [blockNumber])

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshing(false);
  }, []);

  const renderItemCall = (type: string) => {
    switch (type) {
      case "1":
        return <Icon name="call-received" size={17} color="#007AFF" style={styles.icon} />;
      case "2":
        return <Icon name="call-made" size={17} color="#007AFF" style={styles.icon} />;
      case "3":
        return <Icon name="call-missed" size={17} color="red" style={styles.icon} />;
      case "4":
        return <Icon name="phone-outline" size={17} color="#007AFF" style={styles.icon} />;
      case "5":
        return <Icon name="call-split" size={17} color="#007AFF" style={styles.icon} />;
    }
  };

  const renderItem = useCallback(({ item }: { item: CallLog }) => {
  // const renderItem = async ({ item }: { item: CallLog }) => {
    const itemCall: ItemCall = item.callLogs[0];

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => { navigation.navigate("CallLogsDetail", { itemId: itemCall.number }); }}
        onLongPress={() => Alert.alert("onLongPress")}
      >
        <View style={styles.avatarContainer}>
          {
          itemCall.photoUri
            ? <Image source={{ uri: itemCall.photoUri }} style={styles.image} />
            : <Icon name="account" size={30} />
          }
          {
          _.find(blockList, (v: BlockNumberItem)=>{
            // console.log(">> ", v.PHONE_NUMBER," | " ,item.number, v.PHONE_NUMBER === item.number)
            if(v.PHONE_NUMBER === item.number) return true;
            return false
          }) 
            ? <TouchableOpacity style={styles.addIconContainer}>
                <Icon name="cancel" size={30} color="red" />
              </TouchableOpacity> 
            : "" 
          }
        </View>


        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{itemCall.name}</Text>
          <Text style={styles.phone}>{item.number}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Menu
            visible={visibleMenuId === item.number}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity onPress={() => openMenu(item.number)}>
                <Icon name="dots-vertical" size={24} color="#555" />
              </TouchableOpacity>
            }
          >
            <Menu.Item 
              onPress={() => {
                openBlockReasonModal(itemCall);
                closeMenu();
              }} title="Block" />
          </Menu>
          <View style={styles.timeAndIconContainer}>
            {renderItemCall(itemCall.type)}
            <Text style={styles.time}>{getDate(Number(itemCall.date))}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  // }
  }, [visibleMenuId, blockList]);

  return (
    <>
      {callLogs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="phone" size={100} color="#ccc" />
          <Text style={styles.emptyText}>No call logs available</Text>
        </View>
      ) : (
        <FlatList
          data={callLogs}
          renderItem={renderItem}
          keyExtractor={(item) => item.number}
          initialNumToRender={10}
          windowSize={5}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          ItemSeparatorComponent={() => <Divider />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
      {blockReasonModal && (
        <BlockReasonModal visible={true} phoneNumber={blockReasonModal.number} onClose={closeBlockReasonModal} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    backgroundColor: '#eee',
    marginRight: 15,
    position: 'relative', // Add this to allow absolute positioning of the add icon
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
  addIconContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    // backgroundColor: '#007AFF',
    borderRadius: 15,
    // padding: 4,
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
  timeContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  timeAndIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    color: '#888',
    marginLeft: 5,
  },
  icon: {
    marginRight: 5,
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

export default CallLogsScreen;