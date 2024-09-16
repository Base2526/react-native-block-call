import React, { useState, useEffect } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Provider } from 'react-redux';
import { Provider as ProviderPaper } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import SplashScreen from 'react-native-splash-screen';
import { ToastProvider } from 'react-native-toast-notifications'

import CallLogsStackScreen from "./pages/CallLogsStackScreen";
import SMSStackScreen from "./pages/SMSStackScreen";
import MyBlocklistStackScreen from "./pages/MyBlocklistStackScreen";
import { store } from './redux/store';
import { AppDispatch } from './redux/store';
import LoadingDialog from './LoadingDialog';
import { addMultipleCallLogs, clearCallLogs } from './redux/slices/calllogSlice';
import { addMultipleSmsLogs, clearSmsLogs } from './redux/slices/smslogSlice';
import { addBlocks } from "./redux/slices/blockSlice";
import client from './apollo/apolloClient';

import { MyProvider } from './MyProvider';

const Tab = createBottomTabNavigator();
const { DatabaseHelper } = NativeModules;

export const AppNavigator: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const dispatch: AppDispatch = useDispatch();

  const fetchCallLogs = async () => {
    try {
      dispatch(clearCallLogs());

      const response = await DatabaseHelper.fetchCallLogs();
      console.log("fetchCallLog:", response);
      
      if (response.status) {
        dispatch(addMultipleCallLogs(response.data));
      } else {
        console.error("fetchCallLog:", response.message);
      }
    } catch (error) {
      console.error("Error fetching call logs:", error);
    }
  };

  const fetchSmsLogs = async () => {
    try {
      dispatch(clearSmsLogs());

      const response = await DatabaseHelper.fetchSmsLogs();
      console.log("fetchSmsLogs:", response);
      
      if (response.status) {
        dispatch(addMultipleSmsLogs(response.data));
      } else {
        console.error("fetchSmsLogs:", response.message);
      }
    } catch (error) {
      console.error("Error fetching sms logs:", error);
    }
  };

  const fetchBlockList = async()=>{
    try {
      const response = await DatabaseHelper.getBlockNumberAllData();
      console.log("fetchBlockNumberAll :", response);

      if(response.status){
        dispatch(addBlocks(response.data))
      }else{
        console.error("fetchBlockNumberAll:", response.message);
      }
    } catch (error ) {
      console.error("useEffect : ", error);
    }
  }

  useEffect(()=>{
    fetchCallLogs();
    fetchSmsLogs();
    fetchBlockList();

    setLoading(false)

  }, [])

  // useEffect(() => {
  //   const eventEmitter = new NativeEventEmitter(DatabaseHelper);
  //   const subscription = eventEmitter.addListener('onSmsReceived', (data) => {
  //     // Handle the data from the notification (sender, messageBody)
  //     console.log('SMS Received:', data);
  //     // Use this data to navigate or update the UI
  //   });
  //   // Cleanup the subscription
  //   return () => subscription.remove();
  // }, []);

  return (
    <NavigationContainer>
      <LoadingDialog visible={loading} />
      <MyProvider>
        <Tab.Navigator>
          <Tab.Screen 
            name={`Call Logs`}
            component={CallLogsStackScreen} 
            options={({ route }) => ({
              // tabBarBadge: 0,
              tabBarIcon: ({ color, size }) => (
                <Icon name="phone" color={color} size={size} />
              ),
            })}  
          />
          <Tab.Screen 
            name={`SMS`}
            component={SMSStackScreen} 
            options={({ route }) => ({
              // tabBarBadge: 0,
              tabBarIcon: ({ color, size }) => (
                <Icon name="envelope-open-o" color={color} size={size} />
              ),
            })}  
          />
          <Tab.Screen 
            name="Blocklist" 
            component={MyBlocklistStackScreen} 
            options={({ route }) => ({
              // tabBarBadge: 9,
              tabBarIcon: ({ color, size }) => (
                <Icon name="lock" color={color} size={size} />
              ),
            })}  
          />
        </Tab.Navigator>
      </MyProvider>
    </NavigationContainer>
  );
};

export const App: React.FC = () => {
  useEffect(() => {
    SplashScreen.hide(); 
  }, []);

  return (
    <ToastProvider>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <ProviderPaper>
          <AppNavigator />
        </ProviderPaper>
      </Provider>
    </ApolloProvider>
    </ToastProvider>
  );
};