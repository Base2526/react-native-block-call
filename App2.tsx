import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

// Import your screens
import CallLogsScreen from './pages/CallLogsScreen';
import SMSScreen from './pages/SMSScreen';
// import CustomDrawer from './CustomDrawer';

// CustomDrawer.tsx
// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomDrawer = ({ closeDrawer }) => {
  return (
    <View style={styles.drawer}>
      <TouchableOpacity onPress={closeDrawer}>
        <Text style={styles.closeButton}>Close</Text>
      </TouchableOpacity>
      <Text style={styles.item}>Home</Text>
      <Text style={styles.item}>Settings</Text>
      {/* Add more items as needed */}
    </View>
  );
};

/*
const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  closeButton: {
    fontSize: 16,
    marginBottom: 20,
  },
  item: {
    fontSize: 18,
    marginVertical: 10,
  },
});
*/

// export default CustomDrawer;


const Tab = createBottomTabNavigator();

const App2 = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <NavigationContainer>
      {drawerVisible && (
        <CustomDrawer closeDrawer={closeDrawer} />
      )}
      <View style={drawerVisible ? styles.overlay : styles.container}>
        <TouchableOpacity style={styles.drawerButton} onPress={toggleDrawer}>
          <Icon name="bars" size={30} />
        </TouchableOpacity>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen 
            name="Call Logs" 
            component={CallLogsScreen} 
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="phone" color={color} size={size} />
              ),
            }} 
          />
          <Tab.Screen 
            name="SMS" 
            component={SMSScreen} 
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="envelope" color={color} size={size} />
              ),
            }} 
          />
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerButton: {
    padding: 10,
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 1,
  },
  drawer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  closeButton: {
    fontSize: 16,
    marginBottom: 20,
  },
  item: {
    fontSize: 18,
    marginVertical: 10,
  },
});

export default App2;
