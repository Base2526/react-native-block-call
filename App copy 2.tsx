import React, { useEffect, useState } from 'react';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
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
import SMSDetailScreen from "./pages/SMSDetailScreen"

import TabIconWithMenu from "./TabIconWithMenu";


import ProfileModal from './modal/ProfileModal';
import SearchModal from './modal/SearchModal';
import SettingModal from "./modal/SettingModal";
import AboutModal from "./modal/AboutModal";
import HelpSendFeedbackModal from "./modal/HelpSendFeedbackModal";


import DrawerContent from "./DrawerContent";

import * as utils from "./utils"

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();


function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="SMS"
          component={SMSScreen}
          options={{ headerShown: false }}
        />
      </Stack.Group>
      <Stack.Group
        screenOptions={{ presentation: 'fullScreenModal', headerShown: false }}
      >
        <Stack.Screen
          name="SMSDetail"
          component={SMSDetailScreen}
          options={{ 
            headerShown: false, 
            // tabBarStyle: { display: 'none' } // Hides the tab bar
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}


const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Call Logs" 
        component={MyStack}
        options={({ route }) => ({
          headerShown: false ,
          tabBarLabel: 'Call Logs  ^^^',
          tabBarBadge: 3,
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? ""
            console.log("Call Logs :", routeName)
            if (routeName === 'SMSDetail') {
              return { display: "none" }
            }
            return
          })(route),
          tabBarIcon: ({ color, size }) => (
            <Icon name="odnoklassniki" color={color} size={size} />
          ),
        })}
        // options={{
        //   tabBarBadge: 3,
        //   tabBarIcon: ({ color, size }) => (
        //     <Icon name="odnoklassniki" color={color} size={size} />
        //   ),
        // }}
      />
      {/* <Tab.Screen 
        name="SMS" 
        component={MyStack}
        // options={{
        //   tabBarBadge: 4,
        //   tabBarIcon: ({ color, size }) => (
        //     <Icon name="envelope-open-o" color={color} size={size} />
        //   ),
        //   // tabBarStyle: ((route) => {
        //   //   const routeName = getFocusedRouteNameFromRoute(route) ?? ""
        //   //   console.log("getFocusedRouteNameFromRoute ", routeName)
        //   //   // if (routeName === 'search' ||
        //   //   //     routeName === 'profile' ||
        //   //   //     routeName === 'detail' ) {
        //   //   //   return { display: "none" }
        //   //   // }
        //   //   return
        //   // }),
        // }} 

        options={({ route }) => ({
          tabBarLabel: 'SMS ^^^',
          tabBarBadge: 3,
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? ""
            console.log("SMS :", routeName)
            // if (routeName === 'search') {
              // return { display: "none" }
            // }
            return
          })(route),
          tabBarIcon: ({ color, size }) => (
            <Icon name="odnoklassniki" color={color} size={size} />
          ),
        })}
      /> */}
       <Tab.Screen 
        name="My Blocklist" 
        component={MyBlocklistScreen}
        options={{
          tabBarBadge: 10,
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
 
  useEffect(async()=>{
    let isLogin = await utils.getObject('login')
    if(isLogin !== null){
      setIsLoggedIn(true)
    }
  }, [])

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
  
 
  const handleLogin = async() => {

    await utils.saveObject('login', true)
    setIsLoggedIn(true);
  };

  const handleLogout = async() => {

    await utils.saveObject('login', null)
    setIsLoggedIn(false);
  };

  const checkNavigationCondition = (routeName: string) => {
    console.log("checkNavigationCondition routeName :", routeName)
  }
 
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
                // options={({ route }) => {
                //   // Use this option to check the current route
                //   checkNavigationCondition(route.name);
                //   return {};
                // }}
                options={({ route }) => {
                  // checkNavigationCondition(route.name);

                  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Call Logs';
                  console.log("getFocusedRouteNameFromRoute :", route)
                  return {
                    tabBarLabel: routeName,
                    // title: routeName,
                    drawerStyle: { 
                      display: 'none' 
                    },
                    // headerShown: false ,
                    tabBarStyle: { display: 'none' },
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
                  }
                  
                }}
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

