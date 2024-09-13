import React, { useState, useEffect, ReactNode, createContext, useContext } from 'react';
import LoginModal from "./pages/LoginModal"

interface MyContextType {
    openLoginModal: (open: boolean) => void;
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
      console.log("openLoginModal")
      setVisible(true)
    };
  
    return (
      <MyContext.Provider value={{ openLoginModal }} >
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