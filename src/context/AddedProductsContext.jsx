import { useContext } from "react";
import { createContext } from "react";
import { useState } from "react";


const AddedProductsContext = createContext();
export const useAddedProducts = () => useContext(AddedProductsContext);
export const AddedProductsProvider = ({children}) => {
    const [AddedProducts, setAddedProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    return <AddedProductsContext.Provider value={{AddedProducts , setAddedProducts , isLoading , setIsLoading}}>{children}</AddedProductsContext.Provider>
}
