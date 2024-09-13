import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, RefreshControl, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Divider } from 'react-native-paper';

import { RootState, AppDispatch } from '../redux/store';
import { CallLog, ItemCall } from "../redux/interface";
import { getDate } from "../utils";

import BlockReasonModal from './BlockReasonModal'; // Import the modal component

const MyBlocklistScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);

  const openMenu = (id: string) => setVisibleMenuId(id);
  const closeMenu = () => setVisibleMenuId(null);

  const dispatch: AppDispatch = useDispatch();
  const callLogs = useSelector((state: RootState) => state.callLog.callLogs);

  const [isModalVisible, setModalVisible] = useState(false);
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

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
            : <Icon name="account" size={30} />}
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
                openModal();
                closeMenu();
              }} title="Unblock" />
          </Menu>
          <View style={styles.timeAndIconContainer}>
            {/* {renderItemCall(itemCall.type)} */}
            <Text style={styles.time}>{getDate(Number(itemCall.date))}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [visibleMenuId]);

  return (
    <View style={styles.container}>
      {
        callLogs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="file-document-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>No Call Logs Found</Text>
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
        )
      }
      {
        isModalVisible && <BlockReasonModal visible={isModalVisible} onClose={closeModal} />
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
});

export default MyBlocklistScreen;
