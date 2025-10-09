import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Landing from './pages/Landing';
import VendorRegister from './pages/vendor/Register';
import Contact from './pages/Contact';
import VendorLogin from './pages/vendor/Login';
import VendorHome from './pages/vendor/VendorHome';
import BuyerRegister from './pages/buyer/Register';
import BuyerLogin from './pages/buyer/BuyerLogin';
import BuyerHome from './pages/buyer/BuyerHome';
import AddProducts from './pages/vendor/AddProducts';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/buyer/Cart';
import RefundPolicy from './pages/RefundPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/buyer/Orders';
import AddedProducts from './pages/vendor/AddedProducts';
import EditProduct from './pages/vendor/EditProduct';
import VendorOrders from './pages/vendor/VendorOrders';
import SalesChart from './pages/vendor/SalesChart';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/search" element={<Search />} />
        <Route path="/vendor/register" element={<VendorRegister />} />
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path='/vendor/home' element={<VendorHome />}/>
        <Route path='/vendor/add-product' element={<AddProducts />}/>
        <Route path='/vendor/products' element={<AddedProducts />}/>
        <Route path='/vendor/orders' element={<VendorOrders />}/>
      <Route path='/vendor/product/edit/:id' element={<EditProduct />}/>
      <Route path='/vendor/sales' element={<SalesChart />}/>

        <Route path='/buyer/home' element={<BuyerHome />}/>
        <Route path="/buyer/register" element={<BuyerRegister />} />
        <Route path="/buyer/login" element={<BuyerLogin />} />
        <Route path="/buyer/cart" element={<Cart />} />
        <Route path="/buyer/order-success/:id" element={<OrderSuccess />} />
<Route path='/buyer/orders' element={<Orders />}/>
        <Route path='/contact' element={<Contact />}/>
        <Route path='/product/:id' element={<ProductDetails />}/>

           <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
      </Routes>
    </Router>
  );
}
