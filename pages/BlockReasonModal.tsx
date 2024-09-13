import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BlockReasonModal = ({ visible, onClose }) => {
  const [isModalVisible, setModalVisible] = useState(visible);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [otherText, setOtherText] = useState('');

  const choices = ['Sales/Ads', 'Fraud', 'Harassment', 'Other'];

  const handleChoiceSelect = (choice) => {
    setSelectedChoice(choice);
    if (choice === 'Other') {
      setOtherText(''); // Clear the input field if "Other" is selected
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    if (!isModalVisible) {
      onClose(); // Call the onClose function when the modal is closed
    }
  };

  return (
    <Modal isVisible={isModalVisible} onBackdropPress={toggleModal} onModalHide={toggleModal}>
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
          <Icon name="close" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Select block reason</Text>
        {choices.map((choice) => (
          <TouchableOpacity
            key={choice}
            style={styles.choiceButton}
            onPress={() => handleChoiceSelect(choice)}
          >
            <Text style={styles.choiceText}>{choice}</Text>
            {selectedChoice === choice && <Icon name="check" size={15} style={styles.icon} />}
          </TouchableOpacity>
        ))}
        {selectedChoice === 'Other' && (
          <TextInput
            style={styles.input}
            placeholder="Enter details"
            value={otherText}
            onChangeText={setOtherText}
            multiline={true}
            numberOfLines={4}
          />
        )}
        <Button title="Block" onPress={toggleModal} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    position: 'relative', // Ensure the close button is positioned relative to this container
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1, // Ensure the button is above other content
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#efefef',
    marginTop: 10,
    marginBottom: 10,
    padding: 8,
    borderRadius: 10,
    textAlignVertical: 'top', // Ensure text starts from the top of the input field
  },
  choiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  choiceText: {
    fontSize: 16,
  },
  icon: {
    color: 'green',
    marginLeft: 10,
  },
});

export default BlockReasonModal;