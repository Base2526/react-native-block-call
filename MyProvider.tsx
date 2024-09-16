import React, { useState, useEffect, ReactNode, createContext, useContext } from 'react';

import { NativeModules, NativeEventEmitter } from 'react-native';

import LoginModal from "./pages/LoginModal"
import NotificationHandler from './NotificationHandler'; 

const { DatabaseHelper } = NativeModules;

interface MyContextType {
    openLoginModal: () => void;
}

const MyContext = createContext<MyContextType | undefined>(undefined);

export const useMyContext = () => {
    const context = useContext(MyContext);
    if (context === undefined) {
        throw new Error('useMyContext must be used within a MyProvider');
    }
    return context;
};
  
export const MyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [visible, setVisible] = useState(false)
    const openLoginModal = () => {
      setVisible(true)
    };


    // useEffect(()=>{

    //   const eventEmitter = new NativeEventEmitter(DatabaseHelper);
      
    //   const subscription = eventEmitter.addListener('onSmsReceived', (data) => {
    //     // Handle the data from the notification (sender, messageBody)
    //     console.log('SMS Received:', data);
    //     // Use this data to navigate or update the UI
    //   });

    //   return () => subscription.remove();
    // }, [])
  
    return (
      <MyContext.Provider value={{ openLoginModal }} >
        {/* <NotificationHandler /> */}
        {children}
        {
          visible && <LoginModal 
                      onLogin={()=>{ console.log("onLogin") }} 
                      closeLoginModal={()=>{setVisible(false)}}
                      visible={visible}/>
        }
      </MyContext.Provider>
    );
};