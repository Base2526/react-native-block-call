import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet, NativeModules } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useToast } from "react-native-toast-notifications";

const { DatabaseHelper } = NativeModules;

interface choiceItem {
  id: number;
  name: string;
}

interface dataItem {
  phoneNumber: string;
  type: number;
  detail: string;
  reporter: string;
}

interface BlockReasonModalProps {
  visible: boolean;
  phoneNumber: string;
  onClose: () => void;
}

const choices: choiceItem[] = [ {id: 1, name: 'Sales/Ads'}, 
                                {id: 2, name: 'Fraud'}, 
                                {id: 3, name: 'Harassment'}, 
                                {id: 4, name: 'Other'} ];

const BlockReasonModal: React.FC<BlockReasonModalProps> = ({ visible, phoneNumber, onClose }) => {
  const [isModalVisible, setModalVisible] = useState(visible);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [otherText, setOtherText] = useState('');

  const toast = useToast();

  const handleChoiceSelect = (choice: choiceItem) => {
    selectedChoice === choice.id ? setSelectedChoice(null) : setSelectedChoice(choice.id);

    if (choice.id === 4) {
      setOtherText(''); 
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    if (!isModalVisible) {
      onClose(); 
    }
  };

  const handleBlock = async() =>{
    try {
      let data: dataItem = { phoneNumber, type: selectedChoice ? selectedChoice : -1, detail: otherText, reporter: "" }
      const response = await DatabaseHelper.addBlockNumberData(data);
      console.log("response :", response);

      if(response){
        toast.show("Complete.", {
          type: "normal",
          placement: "bottom",
          duration: 4000,
          animationType: "slide-in",
        });

        onClose()
      }
      // const responseBlockNumberAll = await DatabaseHelper.getBlockNumberAllData()
      // console.log("responseBlockNumberAll:", responseBlockNumberAll);
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

  return (
    <Modal 
      isVisible={isModalVisible} 
      onBackdropPress={toggleModal} 
      onModalHide={toggleModal}>
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
          <Icon name="close" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Select block reason</Text>
        {
          choices.map((choice: choiceItem) => {
            return  <TouchableOpacity
                      key={choice.id}
                      style={styles.choiceButton}
                      onPress={() => handleChoiceSelect(choice) }>
                      <Text style={styles.choiceText}>{choice.name}</Text>
                      {selectedChoice === choice.id && <Icon name="check" size={15} style={styles.icon} />}
                    </TouchableOpacity>
          })
        }
        { selectedChoice === 4 && (
          <TextInput
            style={styles.input}
            placeholder="Enter details"
            value={otherText}
            onChangeText={setOtherText}
            multiline={true}
            numberOfLines={4}
          />
        )}
        <Button title="Block" disabled={selectedChoice ? false : true} onPress={handleBlock} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    position: 'relative', 
    zIndex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1, 
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
    textAlignVertical: 'top', 
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