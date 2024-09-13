import React, { useState, useLayoutEffect, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, NativeModules } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/core'; 
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';

import TabIconWithMenu from "../TabIconWithMenu";
import CallLogsScreen from './CallLogsScreen';
import CallLogsDetailScreen from "./CallLogsDetailScreen";
import SearchScreen from "./SearchScreen";
import SettingsScreen from "./SettingsScreen";
import HelpSendFeedbackScreen from "./HelpSendFeedbackScreen";
import AboutScreen from './AboutScreen';
import ProfileScreen from "./ProfileScreen";
import DrawerContent from "../DrawerContent";
import SMSDetailScreen from './SMSDetailScreen';

type CallLogsStackScreenProps = {
    navigation: NavigationProp<any>;
    route: RouteProp<any, any>;
};
const CallLogsStack = createStackNavigator();

const CallLogsStackScreen: React.FC<CallLogsStackScreenProps> = ({ navigation, route }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    useLayoutEffect(() => {
      const routeName = getFocusedRouteNameFromRoute(route);
      
      // Hide tab bar for certain routes
      if (  routeName === "Profile" || 
            routeName === 'CallLogsDetail' || 
            routeName === 'Search' || 
            routeName === 'Settings' ||
            routeName === 'HelpSendFeedback' || 
            routeName === 'About' ||
            routeName === 'SMSDetail'
          ) {
        navigation.setOptions({ tabBarStyle: { display: 'none' } });
      } else {
        navigation.setOptions({ tabBarStyle: { display: 'flex' } });
      }
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
                { label: 'Clear all', onPress: () => console.log('Item 1 pressed') },
                // { label: 'Item 2', onPress: () => console.log('Item 2 pressed') },
              ]}/>
          </View>
        ),
        headerShown: routeName === "Profile" || 
                     routeName === 'CallLogsDetail' || 
                     routeName === 'Search' || 
                     routeName === 'Settings' ||
                     routeName === 'HelpSendFeedback' || 
                     routeName === 'About' ||
                     routeName === 'SMSDetail' ? false : true
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
              headerTitle: '', 
            }}
          />
          <CallLogsStack.Screen
            name="SMSDetail"
            component={SMSDetailScreen}
            options={{  
              headerTitle: 'SMS', 
            }}/>
          <CallLogsStack.Screen
            name="Search"
            component={SearchScreen}
            options={{  
              headerTitle: 'Search', 
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
      <DrawerContent 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        navigation={navigation} />
      </>
    )
}

const styles = StyleSheet.create({
    menuButton: {
      marginLeft: 10,
    },
});

export default CallLogsStackScreen;
  