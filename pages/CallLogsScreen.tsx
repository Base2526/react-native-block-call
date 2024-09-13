import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, RefreshControl, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Divider } from 'react-native-paper';

import { RootState, AppDispatch } from '../redux/store';
import { CallLog, ItemCall } from "../redux/interface";
import { getDate } from "../utils";
import BlockReasonModal from './BlockReasonModal'; 
import { useMyContext } from '../MyProvider'; 

const CallLogsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { openLoginModal } = useMyContext();

  const [refreshing, setRefreshing] = useState(false);
  const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);

  const openMenu = (id: string) => setVisibleMenuId(id);
  const closeMenu = () => setVisibleMenuId(null);

  const dispatch: AppDispatch = useDispatch();
  const callLogs = useSelector((state: RootState) => state.callLog.callLogs);

  const [isBlockReasonModalVisible, setBlockReasonModalVisible] = useState(false);
  const openBlockReasonModal = () => setBlockReasonModalVisible(true);
  const closeBlockReasonModal = () => setBlockReasonModalVisible(false);

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
    const itemCall: ItemCall = item.callLogs[0];
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => { navigation.navigate("CallLogsDetail", { itemId: itemCall.number }); }}
        onLongPress={() => Alert.alert("onLongPress")}
      >
        <View style={styles.avatarContainer}>
          {itemCall.photoUri
            ? <Image source={{ uri: itemCall.photoUri }} style={styles.image} />
            : <Icon name="account" size={30}  />}
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
              onPress={() =>{
                openBlockReasonModal();
                closeMenu();
              }} title="Block" />
            <Divider />
            {/* <Menu.Item onPress={() => {openLoginModal(true); closeMenu();}} title="Report" /> */}
          </Menu>
          <View style={styles.timeAndIconContainer}>
            {renderItemCall(itemCall.type)}
            <Text style={styles.time}>{getDate(Number(itemCall.date))}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [visibleMenuId]);

  return (
    <>
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
      {
        isBlockReasonModalVisible && <BlockReasonModal visible={isBlockReasonModalVisible} onClose={closeBlockReasonModal} />
      }
      {/* {
         <LoginModal onLogin={ ()=>{ console.log('onLogin') }} />
      } */}
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
    borderRadius: 35, // Half of width/height for a circular shape
    backgroundColor: '#eee', // Background color if no image
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
});

export default CallLogsScreen;
