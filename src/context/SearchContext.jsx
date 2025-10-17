import { createContext, useContext, useState } from "react";
const SearchContext = createContext({
    search:'',
    results:[],
    currentPage:1,
    totalPages:null
})


export const useSearch = () => useContext(SearchContext);
export const SearchProvider = ({children}) => {
    const [searchData, setSearchData] = useState({
        search:'',
        results:[],
        currentPage:1,
        totalPages:null
    })
    return <SearchContext.Provider value={{searchData, setSearchData}}>
        {children}
    </SearchContext.Provider>
}