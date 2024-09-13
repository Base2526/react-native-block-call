import { View, TouchableOpacity, Text, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { NavigationProp } from '@react-navigation/core'; 
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Divider } from 'react-native-paper';

import { useMyContext } from './MyProvider'; 

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: NavigationProp<any>;
}

const DrawerContent: React.FC<MenuProps> = ({ isOpen, onClose, navigation }) => {
  if (!isOpen) return null;

  const { openLoginModal } = useMyContext();

  const userProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    image: '', // Replace with actual image URL
  };

  return (
    <TouchableWithoutFeedback onPress={() => onClose()}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback>
          <View style={styles.drawerContent}>
            {/* <>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  onClose();
                  navigation.navigate("Profile");
                }}>
                <View style={styles.profileSection}>
                  <View style={styles.avatarContainer}>
                    {
                      userProfile.image
                      ? <Image source={{ uri: userProfile.image }} />
                      : <MaterialCommunityIcons name="account" size={40} color="#aaa" />
                    }
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{userProfile.name}</Text>
                    <Text style={styles.profileEmail}>{userProfile.email}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() =>{ 
                  navigation.navigate('Settings');
                  onClose();
                }}>
                <Icon name="cogs" size={20} style={{padding: 10}} />
                <Text style={styles.drawerItemText}>Settings</Text>
              </TouchableOpacity>
              <Divider />
            </> */}

          

            <TouchableOpacity style={styles.buttonLogin} onPress={()=>openLoginModal()}  >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Login</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.drawerItem}
              onPress={() =>{
                navigation.navigate('HelpSendFeedback');
                onClose();
              }}>
              <Icon name="question" size={20} style={{padding: 10}} />
              <Text style={styles.drawerItemText}>Help & Send Feedback</Text>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity 
              style={styles.drawerItem}
              onPress={() =>{
                // navigation.navigate('HelpSendFeedback');
                // onClose();
              }}>
              <Icon name="user-shield" size={20} style={{padding: 10}} />
              <Text style={styles.drawerItemText}>Private policy</Text>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity 
              style={styles.drawerItem}
              onPress={()=>{
                navigation.navigate('About');
                onClose();
              }}>
              <Icon name="info" size={20} style={{padding: 10}} />
              <Text style={styles.drawerItemText}>About</Text>
            </TouchableOpacity>
            <Divider />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    zIndex: 1000,
    justifyContent: 'flex-start',
    position: 'absolute',  // Ensures overlay is positioned on top
    top: 0,
    left: 0,
  },
  closeButton: {
    padding: 10,
    alignItems: 'flex-end',
  },
  closeButtonText: {
    fontSize: 16,
    color: 'blue',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    // padding: 16, // Optional: Add padding to the profileSection
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center', // Center profile info vertically
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  drawerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '70%',
    height: '100%',
    backgroundColor: 'white',
    // borderRightWidth: 1,
    borderColor: '#ccc',
    zIndex: 1000,
    padding: 16,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  drawerItemText: {
    marginLeft: 15,
    fontSize: 18,
  },
  avatarContainer: {
    width: 70, // Width of the avatar container
    height: 70, // Height of the avatar container
    justifyContent: 'center', // Center avatar content vertically
    alignItems: 'center', // Center avatar content horizontally
    borderRadius: 25, // Ensure container is circular
    backgroundColor: '#f0f0f0', // Background color if no image
    marginRight: 15,
  },

  buttonLogin: {
    backgroundColor: '#00A500',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default DrawerContent;