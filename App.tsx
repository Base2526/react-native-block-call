// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

// Import your screen components
import HomeScreen from './pages/HomeScreen'; // Create this component
import SettingsScreen from './pages/SettingsScreen'; // Create this component
import ProfileScreen from './pages/ProfileScreen'; // Create this component

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

const App = () => {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen 
                    name="Home" 
                    component={TabNavigator} 
                    // options={{ headerTitle: 'Home Page' }}
                    options={({ route }) => ({
                        // headerTitle: route.params?.title || 'Details', // Change title based on params
                        headerRight: () => (
                            // <Icon.Button 
                            //   name="search" 
                            //   size={25} 
                            //   backgroundColor="transparent" 
                            //   onPress={() => {
                            //     // Handle search icon press
                            //     console.log('Search icon pressed');
                            //   }}
                            // />
                            <Text>Profile Screen</Text>
                          ),
                    })} />
                <Drawer.Screen name="Settings" component={SettingsScreen} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

export default App;
