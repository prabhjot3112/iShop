import React, { useState } from 'react'
import { FaTimes, FaUser, FaUserCircle } from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { toast } from 'react-toastify';
import PushNotificationToggle from './PushNotificationToggle';
import { useRef } from 'react';
import { useNotificationContext } from '../context/NotificationContext';
import './styles/Header.style.css'
const VAPID_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const userType = localStorage.getItem('userType')
  const isLoggedIn = !!localStorage.getItem('token')

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }
    const {user , setUser} = useUser();
// const [permission, setPermission] = useState(Notification.permission);
const { setNotifications , setIsLoading} = useNotificationContext()

  const logout = async () => {
    // alert('ok')
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');

        await fetch(`${import.meta.env.VITE_API_URL}/notifications/unsubscribe/${userType === 'buyer' ? 'buyer' : 'vendor'}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
// toast.success('Notifications disabled!!!')
      }
    }
  } catch (error) {
    console.error("Error during push unsubscribe:", error);
    // Optionally alert user: alert("Something went wrong while disabling notifications.");
    toast.error(error.response.data.error)
  }

  // setPermission('default');
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
  setNotifications([])
  setIsLoading(true)
  setUser(null);
  navigate('/');
};



const hasChecked = useRef(false);

  


  // Common nav links
  const navLinks = [
    {
      label: 'Home',
      path: userType === 'vendor' ? '/vendor/home' : '/buyer/home',
      show: !!userType
    },
    {
      label: 'Register as Vendor',
      path: '/vendor/register',
      show: !isLoggedIn && userType !== 'vendor' && location.pathname !== '/vendor/register'
    },
    {
      label: 'Cart',
      path: '/buyer/cart',
      show: userType === 'buyer' && location.pathname !== '/buyer/cart'
    },
    {
      label: 'Privacy Policy',
      path: '/privacy-policy',
      show: location.pathname !== '/privacy-policy'
      
    },
    {
      label: 'Refund Policy',
      path: '/refund-policy',
            show: location.pathname !== '/refund-policy'

    },
    {
      label: 'Shipping Policy',
      path: '/shipping-policy',
           show: location.pathname !== '/shipping-policy'

    },
    {
      label: 'Terms and Conditions',
      path: '/terms',
            show: location.pathname !== '/terms'

    },
    {
      label: 'Contact',
      path: '/contact',
      show: location.pathname !== '/contact'
    },
    {
      label: 'Search',
      path: '/search',
      show: true
    }
  ]

  const [showOrders, setShowOrders] = useState(false);

  
  
  
  

  return (
  <header className="header w-full bg-white shadow-md sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
    {/* Logo */}
    <div
      className="text-2xl cursor-pointer font-bold text-blue-600"
      onClick={() => { navigate('/'); closeMenu(); }}
    >
      iShop
    </div>

    {/* Hamburger - Mobile */}
    <button className="hamburger" onClick={toggleMenu}>
      {!isOpen ? '☰' : <FaTimes />}
    </button>

    {/* Desktop Nav */}
    <nav className="desktop-nav">
      {navLinks.map((link, idx) => 
        link.show && (
          <Link key={idx} to={link.path} className="nav-link">
            {link.label}
          </Link>
        )
      )}

      {isLoggedIn && (
        <div className="user-menu">
          <button onClick={() => setShowOrders(prev => !prev)}>
            <FaUserCircle size={28} className="text-blue-600" />
          </button>

          {showOrders && (
            <div className="user-dropdown">
              <p className="font-semibold mb-2">Hello, {user?.name || "User"}!</p>

              {userType === 'buyer' && (
                <button
                  className="w-full text-left text-blue-600 hover:underline mb-2"
                  onClick={() => { navigate("/buyer/orders"); setShowOrders(false); }}
                >
                  My Orders
                </button>
              )}

              <button
                className="block w-full text-left text-blue-600 hover:underline mb-2"
                onClick={() => { navigate("/notifications"); setShowOrders(false); }}
              >
                Notifications
              </button>

              <PushNotificationToggle userType={userType} isLoggedIn={isLoggedIn} hasChecked={hasChecked} />

              <button
                className="w-full text-left text-red-600 hover:underline"
                onClick={() => { logout(); setShowOrders(false); }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  </div>

  {/* Mobile Nav */}
  {isOpen && (
    <div className="mobile-nav">
      {navLinks.map((link, idx) => 
        link.show && (
          <Link key={idx} to={link.path} onClick={closeMenu} className="nav-link block">
            {link.label}
          </Link>
        )
      )}

      {isLoggedIn && (
        <div className="border-t pt-4 mt-4">
          <p className="font-semibold mb-2">Hello, {user?.name || "User"}!</p>

          {userType === 'buyer' && (
            <button
              className="block w-full text-left text-blue-600 hover:underline mb-2"
              onClick={() => { navigate("/buyer/orders"); closeMenu(); }}
            >
              My Orders
            </button>
          )}

          <button
            className="block w-full text-left text-blue-600 hover:underline mb-2"
            onClick={() => { navigate("/notifications"); closeMenu(); }}
          >
            Notifications
          </button>

          <PushNotificationToggle userType={userType} isLoggedIn={isLoggedIn} hasChecked={hasChecked} />

          <button
            className="block w-full text-left text-red-600 hover:underline"
            onClick={() => { logout(); closeMenu(); }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )}
</header>

  )
}

export default Header
