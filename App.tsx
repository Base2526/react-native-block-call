import React, { useState, useLayoutEffect, useEffect } from 'react';
import { SafeAreaView, Button, StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Provider } from 'react-native-paper';

import LoginScreen from './pages/LoginScreen';
import CallLogsScreen from './pages/CallLogsScreen';
import CallLogsDetailScreen from "./pages/CallLogsDetailScreen";
import SMSScreen from './pages/SMSScreen';
import SMSDetailScreen from './pages/SMSDetailScreen';
import MyBlocklist from './pages/MyBlocklistScreen';
import HelpSendFeedbackScreen from "./pages/HelpSendFeedbackScreen";
import AboutScreen from './pages/AboutScreen';
import SearchScreen from "./pages/SearchScreen";
import SettingsScreen from "./pages/SettingsScreen";
import ProfileScreen from "./pages/ProfileScreen";
import TabIconWithMenu from "./TabIconWithMenu";

import DrawerContent from "./DrawerContent";

import * as utils from "./utils"

// interface MenuProps {
//   isOpen: boolean;
//   onClose: () => void;
//   navigation: NavigationProp<any>;
// }

// const Menu: React.FC<MenuProps> = ({ isOpen, onClose, navigation }) => {
//   if (!isOpen) return null;

//   const userProfile = {
//     name: 'John Doe',
//     email: 'john.doe@example.com',
//     image: '', // Replace with actual image URL
//   };

//   return (
//     <View style={styles.drawerContent}>
//       <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//         <Text style={styles.closeButtonText}>Close</Text>
//       </TouchableOpacity>
//       {/* Profile Section */}
//       <TouchableOpacity
//         style={styles.drawerItem}
//         onPress={() => {
//           onClose();
//           navigation.navigate("Profile");
//         }}>
//         <View style={styles.profileSection}>
//           <Image source={{ uri: userProfile.image }} style={styles.profileImage} />
//           <View style={styles.profileInfo}>
//             <Text style={styles.profileName}>{userProfile.name}</Text>
//             <Text style={styles.profileEmail}>{userProfile.email}</Text>
//           </View>
//         </View>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.drawerItem}
//         onPress={() => navigation.navigate('Home')}>
//         <Icon name="home" size={20} />
//         <Text style={styles.drawerItemText}>Home</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.drawerItem}
//         onPress={() =>{ 
//           navigation.navigate('Settings');
//           onClose();
//         }}>
//         <Icon name="cogs" size={20} />
//         <Text style={styles.drawerItemText}>Settings</Text>
//       </TouchableOpacity>
//       <TouchableOpacity 
//         style={styles.drawerItem}
//         onPress={() =>{
//           // navigation.closeDrawer()
//           // openHelpSendFeedbackModal();

//           navigation.navigate('HelpSendFeedback');
//           onClose();
//         }}>
//         <Text style={styles.drawerItemText}>Help & Send Feedback</Text>
//       </TouchableOpacity>
//       <TouchableOpacity 
//         style={styles.drawerItem}
//         onPress={()=>{
//           // navigation.closeDrawer()
//           // openAboutModal()

//           navigation.navigate('About');
//           onClose();
//         }}>
//         <Text style={styles.drawerItemText}>About</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

const Tab = createBottomTabNavigator();
const CallLogsStack = createStackNavigator();
const SMSStack = createStackNavigator();
const MyBlocklistStack = createStackNavigator();

type CallLogsStackScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<any, any>;
};

type SMSStackScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<any, any>;
};

type MyBlocklistStackScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<any, any>;
};

const CallLogsStackScreen: React.FC<CallLogsStackScreenProps> = ({ navigation, route }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    
    // // Hide tab bar for certain routes
    if (  routeName === "Profile" || 
          routeName === 'CallLogsDetail' || 
          routeName === 'Search' || 
          routeName === 'Settings' ||
          routeName === 'HelpSendFeedback' || 
          routeName === 'About'
        ) {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }
    // 

    console.log("HomeStackScreen:", routeName);
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => { setIsMenuOpen(!isMenuOpen) }} style={styles.menuButton}>
          <Icon name="bars" size={24} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            style={{ padding:5, marginRight: 10 }} 
            onPress={()=>{ navigation.navigate("Search") }}>
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
      headerShown: routeName === "Profile" || 
                   routeName === 'CallLogsDetail' || 
                   routeName === 'Search' || 
                   routeName === 'Settings' ||
                   routeName === 'HelpSendFeedback' || 
                   routeName === 'About' ? false : true, // hide/show header parent
    });
  }, [navigation, route]);

  return (
    <>
    <CallLogsStack.Navigator
      // screenOptions={{
      //   headerShown: false, // hide screen all child
      // }}
    
    >
      <CallLogsStack.Screen
        name="home"
        component={CallLogsScreen} 
        options={{
          headerShown: false, // hide screen child
          // headerTitle: 'Home ^ ',
        }}
      />
      <CallLogsStack.Screen
          name="CallLogsDetail"
          component={CallLogsDetailScreen}
          options={{  
            headerTitle: 'CallLogs Detail', 
          }}
        />
        <CallLogsStack.Screen
          name="Search"
          component={SearchScreen}
          options={{  
            headerTitle: 'CallLogs Detail', 
          }}
        />
        <CallLogsStack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{  
            headerTitle: 'Settings', 
          }}
        />
        <CallLogsStack.Screen
          name="HelpSendFeedback"
          component={HelpSendFeedbackScreen}
          options={{  
            headerTitle: 'Help & SendFeedback', 
          }}
        />
        <CallLogsStack.Screen
          name="About"
          component={AboutScreen}
          options={{  
            headerTitle: 'About', 
          }}
        />
        <CallLogsStack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{  
            headerTitle: 'Profile', 
          }}
        />
    </CallLogsStack.Navigator>
    <DrawerContent isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} navigation={navigation} />
    </>
  )
}

const SMSStackScreen: React.FC<SMSStackScreenProps> = ({ navigation, route }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    
    // Hide tab bar for certain routes
    if (  routeName === 'Profile' ||
          routeName === "SMSDetail" || 
          routeName === 'Settings' ||
          routeName === 'HelpSendFeedback' ||  
          routeName ==='About') {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }

    console.log("HomeStackScreen:", routeName);
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => { setIsMenuOpen(!isMenuOpen) }} style={styles.menuButton}>
          <Icon name="bars" size={24} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            style={{ padding:5, marginRight: 10 }} 
            onPress={()=>{ navigation.navigate("Search") }}>
            <Icon name="search" size={25} color="#333" />
          </TouchableOpacity>
        </View>
      ),
      headerShown:  routeName === "Profile" ||
                    routeName === "SMSDetail" || 
                    routeName === 'Settings' || 
                    routeName === 'HelpSendFeedback' ||  
                    routeName ==='About'? false : true, // hide/show header parent
    });

  }, [navigation, route]);

  return (
    <>
    <SMSStack.Navigator
      // screenOptions={{
      //   headerShown: false, // hide screen all child
      // }}
    
    >
      <SMSStack.Screen
        name="SMS"
        component={SMSScreen} 
        options={{
          headerShown: false, // hide screen child
          // headerTitle: 'Home ^ ',
        }}
      />
      <SMSStack.Screen
          name="SMSDetail"
          component={SMSDetailScreen}
          options={{  
            headerTitle: 'SMSDetail', 
          }}
        />
      <SMSStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{  
          headerTitle: 'Settings', 
        }}/>
        <SMSStack.Screen
          name="HelpSendFeedback"
          component={HelpSendFeedbackScreen}
          options={{  
            headerTitle: 'Help & SendFeedback', 
          }}
        />
        <SMSStack.Screen
          name="About"
          component={AboutScreen}
          options={{  
            headerTitle: 'About', 
          }}
        />
        <SMSStack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{  
            headerTitle: 'Profile', 
          }}
        />
    </SMSStack.Navigator>
    <DrawerContent isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} navigation={navigation} />
    </>
  )
}

const MyBlocklistScreen: React.FC<MyBlocklistStackScreenProps> = ({ navigation, route }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    
    // // Hide tab bar for certain routes
    if ( routeName === 'Profile' ||
         routeName === "SMSDetail" ||
         routeName === "Settings" ||
         routeName === 'HelpSendFeedback' ||  
         routeName === 'About'
     ) {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }

    // console.log("HomeStackScreen:", routeName);
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => { setIsMenuOpen(!isMenuOpen) }} style={styles.menuButton}>
          <Icon name="bars" size={24} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            style={{ padding:5, marginRight: 10 }} 
            onPress={()=>{ navigation.navigate("Search") }}>
            <Icon name="search" size={25} color="#333" />
          </TouchableOpacity>
        </View>
      ),
      headerShown:  routeName === 'Profile' ||
                    routeName === "SMSDetail" || 
                    routeName === "Settings" ||
                    routeName === 'HelpSendFeedback' ||  
                    routeName ==='About' ? false : true, // hide/show header parent
    });
  }, [navigation, route]);

  return (
    <>
    <MyBlocklistStack.Navigator
      // screenOptions={{
      //   headerShown: false, // hide screen all child
      // }}
    
    >
      <MyBlocklistStack.Screen
        name="SMS"
        component={MyBlocklist} 
        options={{
          headerShown: false, // hide screen child
          // headerTitle: 'Home ^ ',
        }}/>
      <MyBlocklistStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{  
          headerTitle: 'Settings', 
        }}/>
        <MyBlocklistStack.Screen
          name="HelpSendFeedback"
          component={HelpSendFeedbackScreen}
          options={{  
            headerTitle: 'Help & SendFeedback', 
          }}
        />
        <MyBlocklistStack.Screen
          name="About"
          component={AboutScreen}
          options={{  
            headerTitle: 'About', 
          }}
        />
         <MyBlocklistStack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{  
            headerTitle: 'Profile', 
          }}
        />
    </MyBlocklistStack.Navigator>
    <DrawerContent isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} navigation={navigation} />
    </>
  )
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(async()=>{
    let isLogin = await utils.getObject('login')
    if(isLogin !== null){
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = async() => {
    await utils.saveObject('login', true)
    setIsLoggedIn(true);
  };

  const handleLogout = async() => {
    await utils.saveObject('login', null)
    setIsLoggedIn(false);
  };

  return (
    <Provider>
    <NavigationContainer>
    {isLoggedIn ? ( 
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {/* <Button title="Toggle Menu" onPress={() => setIsMenuOpen(!isMenuOpen)} /> */}
          <Tab.Navigator>
            <Tab.Screen 
              name="Call Logs" 
              component={CallLogsStackScreen} 
              options={({ route }) => ({
                tabBarBadge: 3,
                // headerShown: false, // hide Header title
                // tabBarLabel: 'Home',
                // tabBarStyle: ((route) => {
                //   const routeName = getFocusedRouteNameFromRoute(route) ?? ""
                //   console.log("getFocusedRouteNameFromRoute @@@ :", routeName)
                //   if (routeName === 'profile'  ) {
                //     console.log("getFocusedRouteNameFromRoute @@@ 5555 :", routeName)
                //     return ;
                //   }
                //   return { display: 'flex' }
                // })(route),
                tabBarIcon: ({ color, size }) => (
                  <Icon name="odnoklassniki" color={color} size={size} />
                ),
              })}  
            />
            <Tab.Screen 
              name="SMS" 
              component={SMSStackScreen} 
              options={({ route }) => ({
                tabBarBadge: 2,
                tabBarIcon: ({ color, size }) => (
                  <Icon name="envelope-open-o" color={color} size={size} />
                ),
              })}  
            />
            <Tab.Screen 
              name="My Blocklist" 
              component={MyBlocklistScreen} 
              options={({ route }) => ({
                tabBarBadge: 9,
                tabBarIcon: ({ color, size }) => (
                  <Icon name="lock" color={color} size={size} />
                ),
              })}  
            />
          </Tab.Navigator>
        </View>
      </SafeAreaView>
       ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </NavigationContainer>
    </Provider>
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

export default App;
