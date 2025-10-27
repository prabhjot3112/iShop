import { createContext } from "react";
import { useState } from "react";
import { useContext } from "react";


const NotificationContext = createContext()
export const useNotificationContext = () => useContext(NotificationContext)

export const NotificationProvider = ({children}) => {
    const [notifications, setNotifications] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    return <NotificationContext.Provider value={{notifications , setNotifications , isLoading , setIsLoading}}>{children}</NotificationContext.Provider>
}