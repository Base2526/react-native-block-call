import React, { useState, useLayoutEffect, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, NativeModules } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/core'; 
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';


import SettingsScreen from "./SettingsScreen";
import HelpSendFeedbackScreen from "./HelpSendFeedbackScreen";
import AboutScreen from './AboutScreen';
import ProfileScreen from "./ProfileScreen";
import DrawerContent from "../DrawerContent";
import SMSScreen from './SMSScreen';
import SMSDetailScreen from './SMSDetailScreen';
import SearchScreen from "./SearchScreen";

const SMSStack = createStackNavigator();

type SMSStackScreenProps = {
    navigation: NavigationProp<any>;
    route: RouteProp<any, any>;
};

const SMSStackScreen: React.FC<SMSStackScreenProps> = ({ navigation, route }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    useLayoutEffect(() => {
      const routeName = getFocusedRouteNameFromRoute(route);
      
      // Hide tab bar for certain routes
      if (  routeName === 'Profile' ||
            routeName === "SMSDetail" || 
            routeName === 'Settings' ||
            routeName === 'HelpSendFeedback' ||  
            routeName === 'Search' ||
            routeName ==='About') {
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
        headerShown:  routeName === "Profile" ||
                      routeName === "SMSDetail" || 
                      routeName === 'Settings' || 
                      routeName === 'HelpSendFeedback' ||  
                      routeName === 'Search' ||
                      routeName ==='About'? false : true, // hide/show header parent
      });
  
    }, [navigation, route]);
  
    return (
      <>
        <SMSStack.Navigator>
          <SMSStack.Screen
            name="SMS"
            component={SMSScreen} 
            options={{
              headerShown: false,
            }}/>
          <SMSStack.Screen
            name="SMSDetail"
            component={SMSDetailScreen}
            options={{  
              headerTitle: 'SMSDetail', 
            }}/>
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
            }}/>
          <SMSStack.Screen
            name="About"
            component={AboutScreen}
            options={{  
              headerTitle: 'About', 
            }}/>
          <SMSStack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{  
              headerTitle: 'Profile', 
            }}/>
          <SMSStack.Screen
            name="Search"
            component={SearchScreen}
            options={{  
              headerTitle: 'Search', 
            }}/>
        </SMSStack.Navigator>
        <DrawerContent isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} navigation={navigation} />
      </>
    )
}

const styles = StyleSheet.create({
    menuButton: {
      marginLeft: 10,
    },
});

export default SMSStackScreen;
  