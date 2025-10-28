import { createContext, useContext, useState } from "react";

const ProductCategoriesContext = createContext()
export const useProductCategories = () => useContext(ProductCategoriesContext);
export const ProductCategoriesProvider = ({children}) => {
    const [loading, setLoading] = useState(true)

    const [categories, setCategories] = useState([])
    const [isFetched, setIsFetched] = useState(false)
    const value = {
        loading , setLoading , categories , setCategories , isFetched , setIsFetched 
    }
    return <ProductCategoriesContext.Provider value={value}>{children}</ProductCategoriesContext.Provider>
}
