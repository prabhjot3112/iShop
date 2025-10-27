import { useContext , createContext } from "react";
import { useState } from "react";


const BuyerHomeContext = createContext([])
export const useBuyerHome = () => useContext(BuyerHomeContext);
export const BuyerHomeProvider = ({children}) => {
    const [products, setProducts] = useState([])
    const [isFetched, setIsFetched] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
return <BuyerHomeContext.Provider value={{products , setProducts , isLoading , setIsLoading , isFetched , setIsFetched}}>{children}</BuyerHomeContext.Provider>
}