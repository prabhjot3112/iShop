import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { SearchProvider } from "./context/SearchContext.jsx";
import { BuyerOrderProvider } from "./context/BuyerOrderContext.jsx";
import { BuyerHomeProvider } from "./context/BuyerHomeProducts.jsx";

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <SearchProvider>
      <BuyerOrderProvider>
        <BuyerHomeProvider>
        <App />
        </BuyerHomeProvider>
      </BuyerOrderProvider>
    </SearchProvider>
  </UserProvider>
);
