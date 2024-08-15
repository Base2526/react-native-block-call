import React from 'react';
import { Modal, View, Text, Switch, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import * as utils from "../utils"

const ProfileScreen: React.FC<any> = ({navigation}) => {
  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image 
            source={{uri: 'your-banner-image-url'}}
            style={styles.bannerImage} 
          />
          <Image 
            source={{uri: 'your-profile-image-url'}}
            style={styles.profileImage} 
          />
          </View>

        <View style={styles.infoContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Display name</Text>
            <Text style={styles.value}>MiAmi</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Status message</Text>
            <Text style={styles.value}>Build your money.</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Phone number</Text>
            <Text style={styles.value}>+66 62 958 0897</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>ID</Text>
            <View style={styles.idContainer}>
              <Text style={styles.value}>maiamili</Text>
              <TouchableOpacity onPress={() => {/* Handle copy action */}}>
                <Text style={styles.copyText}>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Allow others to add me by ID</Text>
            <Switch value={true} onValueChange={() => {/* Handle switch change */}} />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>QR code</Text>
            <TouchableOpacity onPress={() => {/* Handle QR code view */}}>
              <Text style={styles.qrText}>View QR Code</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={async()=>{
            await utils.saveObject('login', null)
          }}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#009688',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerImage: {
    width: '100%',
    height: 150,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'absolute',
    bottom: -40,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: semi-transparent background
    // borderRadius: 20,
  },
  closeText: {
    color: '#fff',
    fontSize: 18, // Adjust size as needed
  },
  infoContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyText: {
    marginLeft: 10,
    color: '#007AFF',
  },
  qrText: {
    color: '#007AFF',
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;