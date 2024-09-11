import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';

import { NavigationProp } from '@react-navigation/core'; 
import Icon from 'react-native-vector-icons/FontAwesome';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: NavigationProp<any>;
}

const DrawerContent: React.FC<MenuProps> = ({ isOpen, onClose, navigation }) => {
  if (!isOpen) return null;

  const userProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    image: '', // Replace with actual image URL
  };

  return (
    <View style={styles.drawerContent}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        {/* <Text style={styles.closeButtonText}>Close</Text> */}
        <FontAwesome name="xmark" size={50} color="#900" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          onClose();
          navigation.navigate("Profile");
        }}>
        <View style={styles.profileSection}>
          <Image source={{ uri: userProfile.image }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userProfile.name}</Text>
            <Text style={styles.profileEmail}>{userProfile.email}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate('Home')}>
        <Icon name="home" size={20} />
        <Text style={styles.drawerItemText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() =>{ 
          navigation.navigate('Settings');
          onClose();
        }}>
        <Icon name="cogs" size={20} />
        <Text style={styles.drawerItemText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.drawerItem}
        onPress={() =>{
          // navigation.closeDrawer()
          // openHelpSendFeedbackModal();

          navigation.navigate('HelpSendFeedback');
          onClose();
        }}>
        <Text style={styles.drawerItemText}>Help & Send Feedback</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.drawerItem}
        onPress={()=>{
          navigation.navigate('About');
          onClose();
        }}>
        <Text style={styles.drawerItemText}>About</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '70%',
    height: '100%',
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderColor: '#ccc',
    zIndex: 1000,
    padding: 16,
  },
  closeButton: {
    padding: 10,
    alignItems: 'flex-end',
  },
  closeButtonText: {
    fontSize: 16,
    color: 'blue',
  },
  menuItem: {
    fontSize: 18,
    marginVertical: 10,
  },
  menuButton: {
    marginLeft: 10,
  },

  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Make the image circular
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
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
    // flex: 1,
    // padding: 20,
    // backgroundColor: '#fff',

    position: 'absolute',
    top: 0,
    left: 0,
    width: '70%',
    height: '100%',
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderColor: '#ccc',
    zIndex: 1000,
    padding: 16,
  },
  drawerHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
});

export default DrawerContent;