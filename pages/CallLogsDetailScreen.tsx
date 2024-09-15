import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, NativeModules, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { CallLog } from "../redux/interface";
import * as utils from "../utils";

import BlockReasonModal from './BlockReasonModal'; 

const { DatabaseHelper } = NativeModules;

const CallLogsDetailScreen: React.FC<any> = ({ route, navigation }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const callLogs = useSelector((state: RootState) => state.callLog.callLogs);
  let callLogDetail: CallLog | undefined = callLogs.find(callLog => callLog.number === route.params.itemId);

  if (!callLogDetail) return null;

  console.log("CallLogsDetailScreen :", callLogDetail.callLogs[0]);

  const handleExpand = () => setIsExpanded(!isExpanded);

  /*
    CallLog.Calls.TYPE
    -  CallLog.Calls.INCOMING_TYPE (1): Incoming call.
    -  CallLog.Calls.OUTGOING_TYPE (2): Outgoing call.
    -  CallLog.Calls.MISSED_TYPE (3): Missed call.
    -  CallLog.Calls.REJECTED_TYPE (4): Rejected call.
    -  CallLog.Calls.BLOCKED_TYPE (5): Blocked call.
  */
  const renderItemCallIcon = (type : string) =>{
    switch(type){
      case "1": {
        return <Icon name="call-received" size={25} color="#007AFF" style={styles.icon} />
      }

      case "2": {
        return <Icon name="call-made" size={25} color="#007AFF" style={styles.icon} />
      }

      case "3": { 
        return <Icon name="call-missed" size={25} color="red" style={styles.icon} />
      }

      case "4": {
        return <Icon name="phone-outline" size={25} color="#007AFF" style={styles.icon} />
      }

      case "5": {
        return <Icon name="call-split" size={25} color="#007AFF" style={styles.icon} />
      }
    }
  }

  const renderItemCallText = (type : string) =>{
    switch(type){
      case "1": {
        return "Incoming call";
      }

      case "2": {
        return "Outgoing call";
      }

      case "3": { 
        return "Missed call";
      }

      case "4": {
        return "Rejected call";
      }

      case "5": {
        return "Blocked call";
      }
    }
  }

  const fetchSmsThreadIdLogs = async (number: string) => {
    try {
      const response = await DatabaseHelper.fetchSmsThreadIdLogs(number);
      if (response.status) {
        navigation.navigate('SMSDetail', { thread_id: response.data[0], number }); 
      } else {
        navigation.navigate('SMSDetail', { thread_id: undefined, number }); 
      }
    } catch (error) {
      console.error("Error fetchSmsThreadIdLogs :", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
          {
            callLogDetail.callLogs[0].photoUri
            ? <Image source={{ uri: callLogDetail.callLogs[0].photoUri }} style={styles.avatar} />
            : <Icon name="account" size={80} color="#aaa" style={styles.avatar} />
          }
          </View>
          <Text style={styles.nameText}>{callLogDetail.callLogs[0].name}</Text>
          <Text style={styles.headerText}>{callLogDetail.number}</Text>
          <Text style={styles.subHeaderText}>No results found</Text>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={()=>{
            Linking.openURL(`tel:${callLogDetail.number}`);
          }}>
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={async()=>{
            fetchSmsThreadIdLogs(callLogDetail.number);
          }}>
            <Text style={styles.actionText}>SMS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={()=>{  openModal() }}>
            <Text style={styles.actionText}>Block</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Report</Text>
          </TouchableOpacity> */}
        </View>
        <View style={styles.callHistoryContainer}>
          <ScrollView
            style={[
              styles.callHistory, 
              isExpanded ? { maxHeight: 250 } : { maxHeight: 100 }
            ]}
            nestedScrollEnabled={true}>
            {callLogDetail.callLogs.map((call, index) => (
              <View key={index} style={{flexDirection: 'row'}}>
                { renderItemCallIcon(call.type) }
                <View>
                  <Text style={styles.callText}>{utils.getDate(Number(call.date), "YYYY/MM/DD Day HH:mm")}</Text>
                  <Text style={styles.callSubText}>{renderItemCallText(call.type)} • 31s</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          {callLogDetail.callLogs.length > 2 && (
            <View style={{width: '100%', alignItems: 'center'}}>
              <TouchableOpacity onPress={handleExpand} style={{ width: 80, alignItems: 'center', padding: 5 }}>
                <Text style={styles.moreButton}>{isExpanded ? 'Show Less' : 'More'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Tell us who this is"
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchText}>Search more info for this number</Text>
        </TouchableOpacity>
      </ScrollView>
      {
        isModalVisible && <BlockReasonModal visible={isModalVisible} onClose={closeModal} />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#aaa',
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  actionText: {
    fontSize: 16,
  },
  callHistoryContainer: {
    marginBottom: 16,
  },
  callHistory: {
    marginBottom: 16,
  },
  callText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  callSubText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  moreButton: {
    color: '#007bff',
    // textAlign: 'center',
    // marginTop: 8,
  },
  searchButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  searchText: {
    fontSize: 16,
  },
  icon: {
    marginRight: 8,
  },
});

export default CallLogsDetailScreen;