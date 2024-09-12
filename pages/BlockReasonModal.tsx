import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

const BlockReasonModal = ({ visible, onClose }) => {
  const [reason, setReason] = useState('');

  const handleBlock = () => {
    console.log('Reason:', reason);
    // Handle the block action here
    onClose(); // Close the modal after action
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Reason</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter reason"
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={4} // Adjust this value as needed
          />
          <Button title="Block" onPress={handleBlock} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    paddingHorizontal: 10,
    textAlignVertical: 'top', // Ensure text aligns at the top of the TextInput
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});

export default BlockReasonModal;
