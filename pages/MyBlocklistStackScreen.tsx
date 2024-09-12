import React, { useState, useLayoutEffect, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, NativeModules } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/core'; 
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';

import TabIconWithMenu from "../TabIconWithMenu"
import SettingsScreen from "./SettingsScreen";
import HelpSendFeedbackScreen from "./HelpSendFeedbackScreen";
import AboutScreen from './AboutScreen';
import ProfileScreen from "./ProfileScreen";
import DrawerContent from "../DrawerContent";
import MyBlocklist from './MyBlocklistScreen';

const MyBlocklistStack = createStackNavigator();

type MyBlocklistStackScreenProps = {
    navigation: NavigationProp<any>;
    route: RouteProp<any, any>;
  };

const MyBlocklistStackScreen: React.FC<MyBlocklistStackScreenProps> = ({ navigation, route }) => {
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
            <TabIconWithMenu 
              iconName="ellipsis-v"
              menuItems={[
                { label: 'Clear all', onPress: () => console.log('Item 1 pressed') },
                // { label: 'Item 2', onPress: () => console.log('Item 2 pressed') },
              ]}/>
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

const styles = StyleSheet.create({
    menuButton: {
      marginLeft: 10,
    },
});

export default MyBlocklistStackScreen;
  