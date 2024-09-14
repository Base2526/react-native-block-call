import React, { useCallback, useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, 
        TouchableOpacity, Alert, Image, 
        RefreshControl, FlatList, NativeModules } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Divider } from 'react-native-paper';
import { useToast } from "react-native-toast-notifications";
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { RootState, AppDispatch } from '../redux/store';
import { CallLog, ItemCall } from "../redux/interface";
import { formatDate } from "../utils";
import BlockReasonModal from './BlockReasonModal'; 
import TabIconWithMenu from "../TabIconWithMenu"

const { DatabaseHelper } = NativeModules;

type MyBlocklistScreenProps = {
  navigation: any;
  route: any;
  setMenuOpen: () => void; // Define the function prop
};

interface dataItem{
  ID: string;
  DETAIL: string;
  NAME: string;
  PHONE_NUMBER: string;
  PHOTO_URI: string | null;
  REPORTER: string;
  CREATE_AT: string;
  UPDATE_AT: string;
}

const MyBlocklistScreen: React.FC<MyBlocklistScreenProps> = ({ navigation, route, setMenuOpen }) => {
  
  const [refreshing, setRefreshing] = useState(false);
  const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);

  const [datas, setDatas] = useState<dataItem[] | []>([])

  const openMenu = (id: string) => setVisibleMenuId(id);
  const closeMenu = () => setVisibleMenuId(null);

  const dispatch: AppDispatch = useDispatch();
  const callLogs = useSelector((state: RootState) => state.callLog.callLogs);

  const [isModalVisible, setModalVisible] = useState(false);
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const toast = useToast();

  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);

    if ( routeName === 'Profile' ||
          routeName === "SMSDetail" ||
          routeName === "Settings" ||
          routeName === 'HelpSendFeedback' ||  
          routeName === 'About'
      ) {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }

    navigation.setOptions({
      headerLeft: () => (
          <TouchableOpacity onPress={() => {  setMenuOpen()  }} style={styles.menuButton}>
            <Icon name="menu" size={24} />
          </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => {  onRefresh()  }} style={{marginRight: 5}}>
            <Icon name="reload" size={24} />
          </TouchableOpacity>
          <TabIconWithMenu 
            iconName="dots-vertical"
            menuItems={[
              { label: 'Clear all', onPress: ()=>{ console.log(">>") } },
            ]}
          />
        </View>
      ),
      headerShown: true, // hide/show header parent
    });
  }, [navigation, route]);
  
  const fetchBlockNumberAll = async()=>{
    try {
      const response = await DatabaseHelper.getBlockNumberAllData();
      console.log("response :", response);

      if(response.status){
        setDatas(response.data)
      }
    } catch (error ) {
      console.error("useEffect : ", error);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    fetchBlockNumberAll();
    setRefreshing(false);
  }, []);

  useEffect(() =>{
    fetchBlockNumberAll();
  }, [])

  useEffect(() =>{
    console.log("data :", datas)
  }, [datas])

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

  /*
  {"DETAIL": "", "ID": "1", "NAME": "ชมพู่", "PHONE_NUMBER": "0898945536", "PHOTO_URI": null, "REPORTER": ""}
  */

  const handleUnblock = async(data: dataItem) =>{
    try {
      const response = await DatabaseHelper.deleteBlockNumberData(data.ID);
      console.log("response :", response);
      if(response.status){
        toast.show("Unblock.", {
          type: "normal",
          placement: "bottom",
          duration: 4000,
          animationType: "slide-in",
        });
      }
      fetchBlockNumberAll();
      closeMenu();
    } catch (error ) {
      if(error instanceof Error){
        toast.show(error.message, {
          type: "danger",
          placement: "bottom",
          duration: 4000,
          animationType: "slide-in",
          style: {
            zIndex: 100, // Adjust the zIndex value as needed
          },
        });
      }else{
        console.error("Error fetching call logs:", error);
      }
    }
  }

  const renderItem = useCallback(({ item }: { item: dataItem }) => {
    // const itemCall: ItemCall = item.callLogs[0];
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => { navigation.navigate("CallLogsDetail", { itemId: item.PHONE_NUMBER }); }}
        onLongPress={() => Alert.alert("onLongPress")}
        key= {item.ID}
      >
        <View style={styles.avatarContainer}>
          {item.PHOTO_URI
            ? <Image source={{ uri: item.PHOTO_URI }} style={styles.image} />
            : <Icon name="account" size={30} />}
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{item.NAME}</Text>
          <Text style={styles.phone}>{item.PHONE_NUMBER}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Menu
            visible={visibleMenuId === item.PHONE_NUMBER}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity onPress={() => openMenu(item.PHONE_NUMBER)}>
                <Icon name="dots-vertical" size={24} color="#555" />
              </TouchableOpacity>
            }
          >
            <Menu.Item 
              onPress={() => { handleUnblock(item) }} title="Unblock" />
          </Menu>
          <View style={styles.timeAndIconContainer}>
            {/* {renderItemCall(itemCall.type)} */}
            <Text style={styles.time}>{formatDate(item.UPDATE_AT)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [visibleMenuId]);

  return (
    <View style={styles.container}>
      {
        datas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="file-document-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>No Call Logs Found</Text>
          </View>
        ) : (
          <FlatList
            data={datas}
            renderItem={renderItem}
            keyExtractor={(item) => item.PHONE_NUMBER}
            initialNumToRender={10}
            windowSize={5}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            ItemSeparatorComponent={() => <Divider />}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        )
      }
      {
        // isModalVisible && <BlockReasonModal visible={isModalVisible} onClose={closeModal} />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
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
  menuButton: {
    marginLeft: 10,
  },
});

export default MyBlocklistScreen;
