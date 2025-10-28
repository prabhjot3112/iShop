import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Landing from "./pages/Landing";
import VendorRegister from "./pages/vendor/Register";
import Contact from "./pages/Contact";
import VendorLogin from "./pages/vendor/Login";
import VendorHome from "./pages/vendor/VendorHome";
import BuyerRegister from "./pages/buyer/Register";
import BuyerLogin from "./pages/buyer/BuyerLogin";
import BuyerHome from "./pages/buyer/BuyerHome";
import { EventSourcePolyfill } from "event-source-polyfill";
import AddProducts from "./pages/vendor/AddProducts";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/buyer/Cart";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/buyer/Orders";
import AddedProducts from "./pages/vendor/AddedProducts";
import EditProduct from "./pages/vendor/EditProduct";
import VendorOrders from "./pages/vendor/VendorOrders";
import SalesChart from "./pages/vendor/SalesChart";
import TrackOrder from "./pages/buyer/TrackOrder";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Notifications from "./pages/Notifications";
import { useNotificationContext } from "./context/NotificationContext";
import { ProductCategoriesProvider } from "./context/ProductCategoriesContext";

export default function App() {
  const notificationContext = useNotificationContext()

  const [userInfo, setUserInfo] = useState({
    token:localStorage.getItem('token'),
    userType:localStorage.getItem('userType')
  })
 useEffect(() => {
  if (!userInfo.token || !userInfo.userType) return;

  console.log("Starting event listener for:", userInfo.userType);

  let evtSource;

  if (userInfo.userType === "vendor") {
    evtSource = new EventSource(
      `${import.meta.env.VITE_API_URL}/orders/updates/vendor/${userInfo.token}`
    );
    console.log("Vendor event source started");

    evtSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        toast.info(`🛒 New order : ${data.productName}`);
        notificationContext.setNotifications(prev => [...(prev || []), `🛒 New order: ${data.productName}`]);

      } catch (err) {
        console.error("Failed to parse vendor SSE data", err);
      }
    };
  } 
  
  if (userInfo.userType === "buyer") {
    evtSource = new EventSource(
      `${import.meta.env.VITE_API_URL}/orders/updates/buyer/${userInfo.token}`
    );
    console.log("Buyer event source started");

    evtSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        toast.info(data.message || `Order status updated to ${data.status}`);
        notificationContext.setNotifications(prev => [...(prev || []), `${data.message}`]);

      } catch (err) {
        console.error("Failed to parse buyer SSE data", err);
      }
    };
  }

  
  evtSource.onerror = (err) => {
    console.error("SSE connection error", err);
    evtSource.close();
  };

  return () => {
    if (evtSource) {
      console.log("Closing SSE for", userInfo.userType);
      evtSource.close();
    }
  };
}, [userInfo.token, userInfo.userType]);

  
  const [orderItems, setOrderItems] = useState([]);

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/search" element={<Search />} />
        <Route path="/vendor/register" element={<VendorRegister />} />
        <Route path="/vendor/login" element={<VendorLogin setUserInfo={setUserInfo} userInfo={userInfo} />} />
        <Route path="/vendor/home" element={<VendorHome />} />
      
        <Route path="/vendor/add-product" element={
          <AddProducts />
        } />
        <Route path="/vendor/product/edit/:id" element={
          <ProductCategoriesProvider>
          <EditProduct />
          </ProductCategoriesProvider>
          } />
        
        <Route path="/vendor/products" element={<AddedProducts />} />
        <Route
          path="/vendor/orders"
          element={
            <VendorOrders
              orderItems={orderItems}
              setOrderItems={setOrderItems}
            />
          }
        />
        <Route path="/vendor/sales" element={<SalesChart />} />

        <Route path="/buyer/home" element={<BuyerHome />} />
        <Route path="/buyer/register" element={<BuyerRegister />} />
        <Route path="/buyer/login" element={<BuyerLogin setUserInfo={setUserInfo} userInfo={userInfo}/>} />
        <Route path="/buyer/cart" element={<Cart />} />
        <Route path="/buyer/order/track/:id" element={<TrackOrder />} />
        <Route path="/buyer/order-success/:id" element={<OrderSuccess />} />
        <Route path="/buyer/orders" element={<Orders />} />


        <Route path="/notifications" element={<Notifications />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
      </Routes>
    </Router>
  );
}
