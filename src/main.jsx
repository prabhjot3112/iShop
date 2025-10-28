import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { SearchProvider } from "./context/SearchContext.jsx";
import { BuyerOrderProvider } from "./context/BuyerOrderContext.jsx";
import { BuyerHomeProvider } from "./context/BuyerHomeProducts.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { AddedProductsProvider } from "./context/AddedProductsContext.jsx";
import { ProductCategoriesProvider } from "./context/ProductCategoriesContext";

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <SearchProvider>
      <BuyerOrderProvider>
        <BuyerHomeProvider>
          <NotificationProvider>
            <AddedProductsProvider>
              <ProductCategoriesProvider>
        <App />
              </ProductCategoriesProvider>
            </AddedProductsProvider>
          </NotificationProvider>
        </BuyerHomeProvider>
      </BuyerOrderProvider>
    </SearchProvider>
  </UserProvider>
);
