import React, { useState, useEffect, ReactNode, createContext, useContext } from 'react';
import { SafeAreaView, View, NativeModules } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Provider } from 'react-redux';
import { Provider as ProviderPaper } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import SplashScreen from 'react-native-splash-screen';

import { ToastProvider } from 'react-native-toast-notifications'

// import LoginScreen from './pages/LoginScreen';
import CallLogsStackScreen from "./pages/CallLogsStackScreen";
import SMSStackScreen from "./pages/SMSStackScreen";
import MyBlocklistStackScreen from "./pages/MyBlocklistStackScreen";
import * as utils from "./utils"
import { store } from './redux/store';
import { RootState, AppDispatch } from './redux/store';
import LoadingDialog from './LoadingDialog';
import { addMultipleCallLogs, clearCallLogs } from './redux/slices/calllogSlice'
import { addMultipleSmsLogs, clearSmsLogs } from './redux/slices/smslogSlice'
import client from './apollo/apolloClient';

import { MyProvider } from './MyProvider'

const Tab = createBottomTabNavigator();
const { DatabaseHelper } = NativeModules;

export const AppNavigator: React.FC = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const dispatch: AppDispatch = useDispatch();

  const callLogs = useSelector((state: RootState) => state.callLog.callLogs);
  const smsLogs = useSelector((state: RootState) => state.smsLog.smsLogs);

  const fetchCallLogs = async () => {
    try {
      // dispatch(clearCallLogs());

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
      // dispatch(clearSmsLogs());

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

  useEffect(()=>{
    const checkLogin = async () => {
      let isLogin = await utils.getObject('login');
      if (isLogin !== null) {
        setIsLoggedIn(true);
      }
    };
    checkLogin();

    fetchCallLogs();
    fetchSmsLogs();

    setLoading(false)
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
    <NavigationContainer>
      <LoadingDialog visible={loading} />
      {/* {isLoggedIn ? (  */}
        <MyProvider>
        {/* <SafeAreaView style={{ flex: 1 }}> */}
          {/* <View style={{ flex: 1 }}> */}
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
          {/* </View> */}
        {/* </SafeAreaView> */}
        </MyProvider>
        {/* ) : (
           <LoginScreen onLogin={handleLogin} />
         )}
        */}
    </NavigationContainer>
  );
};

export const App: React.FC = () => {
  useEffect(() => {
    SplashScreen.hide(); // Hide splash screen once app is loaded
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