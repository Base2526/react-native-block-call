import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const DrawerContent = ({ navigation, openSettingModal, openAboutModal, openHelpSendFeedbackModal, openProfileModal }) => {
  // console.log("DrawerContent :", openSearchModal)
  const userProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    image: '', // Replace with actual image URL
  };

  return (
    <View style={styles.drawerContent}>
      {/* Profile Section */}
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          openProfileModal();
          navigation.closeDrawer()
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
        onPress={() => navigation.navigate('Home')}
      >
        <Icon name="home" size={20} />
        <Text style={styles.drawerItemText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() =>{
          navigation.closeDrawer()
          openSettingModal();
        }}>
        <Icon name="cogs" size={20} />
        <Text style={styles.drawerItemText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.drawerItem}
        onPress={() =>{
          navigation.closeDrawer()
          openHelpSendFeedbackModal();
        }}>
        <Text style={styles.drawerItemText}>Help & Send Feedback</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.drawerItem}
        onPress={()=>{
          navigation.closeDrawer()
          openAboutModal()
        }}>
        <Text style={styles.drawerItemText}>About</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    screenContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
      flex: 1,
      padding: 20,
      backgroundColor: '#f7f7f7',
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