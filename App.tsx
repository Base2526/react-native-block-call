import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

// Import your screen components
import LoginScreen from './pages/LoginScreen';
import CallLogsScreen from './pages/CallLogsScreen';
import SettingsScreen from './pages/SettingsScreen';
import SMSScreen from './pages/SMSScreen';
import MyBlocklistScreen from './pages/MyBlocklistScreen';
import PhoneDetailsScreen from './pages/PhoneDetailsScreen';
import TabIconWithMenu from "./TabIconWithMenu";

import ProfileModal from './modal/ProfileModal';
import SearchModal from './modal/SearchModal';
import SettingModal from "./modal/SettingModal";
import AboutModal from "./modal/AboutModal";
import HelpSendFeedbackModal from "./modal/HelpSendFeedbackModal";

import DrawerContent from "./DrawerContent";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Call Logs" 
        component={CallLogsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="odnoklassniki" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="SMS" 
        component={SMSScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="envelope-open-o" color={color} size={size} />
          ),
        }} 
      />
       <Tab.Screen 
        name="My Blocklist" 
        component={MyBlocklistScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="thumbs-down" color={color} size={size} />
          ),
        }} 
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status

  const [profileVisible, setProfileVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [helpSendFeedbackVisible, setHelpSendFeedbackVisible] = useState(false);

  const openProfileModal = () => {
    setProfileVisible(true);
  };

  const closeProfileModal = () => {
    setProfileVisible(false);
  };

  const openSearchModal = () => {
    setSearchVisible(true);
  };

  const closeSearchModal = () => {
    setSearchVisible(false);
  };

  const openSettingModal = () => {
    setSettingVisible(true);
  };

  const closeSettingModal = () => {
    setSettingVisible(false);
  };

  const openAboutModal = () => {
    setAboutVisible(true);
  };

  const closeAboutModal = () => {
    setAboutVisible(false);
  };

  const openHelpSendFeedbackModal = () => {
    setHelpSendFeedbackVisible(true);
  };

  const closeHelpSendFeedbackModal = () => {
    setHelpSendFeedbackVisible(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };
 
  return (
    <Provider>
      <NavigationContainer>
        {isLoggedIn ? ( 
          <>
            <ProfileModal visible={profileVisible} onClose={closeProfileModal} onLogout={handleLogout} title="Profile Modal" />
            <SettingModal visible={settingVisible} onClose={closeSettingModal} title="Setting Modal" />
            <SearchModal visible={searchVisible} onClose={closeSearchModal} title="Search Modal" />
            <AboutModal visible={aboutVisible} onClose={closeAboutModal} title="About Modal" />
            <HelpSendFeedbackModal visible={helpSendFeedbackVisible} onClose={closeHelpSendFeedbackModal} title="Help & SendFeedback" />
            <Drawer.Navigator   
              initialRouteName="Home"
              drawerContent={(props) => <DrawerContent 
                                          {...props} 
                                          openSettingModal={()=>openSettingModal()}
                                          openAboutModal={()=>openAboutModal()}
                                          openHelpSendFeedbackModal={()=>openHelpSendFeedbackModal()}
                                          openProfileModal={()=>openProfileModal()}
                                          />}>
              <Drawer.Screen 
                name="Home" 
                component={TabNavigator}
                options={({ route }) => ({
                  headerRight: () => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TouchableOpacity 
                        style={{ padding:5, marginRight: 10 }} 
                        onPress={()=>openSearchModal()}>
                        <Icon name="search" size={25} color="#333" />
                      </TouchableOpacity>
                      <TabIconWithMenu 
                        iconName="ellipsis-v"
                        menuItems={[
                          { label: 'Item 1', onPress: () => console.log('Item 1 pressed') },
                          { label: 'Item 2', onPress: () => console.log('Item 2 pressed') },
                        ]}
                      />
                    </View>
                  ),
                })}
              />
            </Drawer.Navigator>
          </>
        ) : (
          <LoginScreen onLogin={handleLogin} />
        )}
      </NavigationContainer>
    </Provider>
  );
};

export default App;