import { createContext, useContext, useState } from "react";

const BuyerOrderContext = createContext([]);
export const useBuyerOrder = () => useContext(BuyerOrderContext);

export const BuyerOrderProvider = ({ children }) => {
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <BuyerOrderContext.Provider
      value={{ buyerOrders, setBuyerOrders, isLoading, setIsLoading }}
    >
      {children}
    </BuyerOrderContext.Provider>
  );
};
