import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext();
const BASE_URL = import.meta.env.VITE_API_URL;


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const userType = localStorage.getItem('userType')
      if (!token) return;

      try {
        const { data } = await axios.get(`${ userType == 'buyer' ? `${BASE_URL}/buyer/get}` : `${BASE_URL}/vendor/get`}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('data of user:',data)
       userType == 'buyer' ? setUser(data.buyer) : setUser(data.vendor);
      } catch (err) {
        console.log('error fetching details of user' , err)
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
