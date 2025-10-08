import React, { useState } from 'react'
import { FaTimes, FaUser, FaUserCircle } from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

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

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
    setUser(null)
    navigate('/')
  }

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
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div
          onClick={() => {
            navigate('/')
            closeMenu()
          }}
          className="text-2xl cursor-pointer font-bold text-blue-600"
        >
          iShop
        </div>

        {/* Hamburger Icon - Mobile */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-2xl focus:outline-none"
        >
          {!isOpen ? '☰' : <FaTimes /> }
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-6 text-gray-700 text-sm font-medium">
  {navLinks.map(
    (link, idx) =>
      link.show && (
        <Link
          key={idx}
          to={link.path}
          className="hover:text-blue-600 text-lg"
        >
          {link.label}
        </Link>
      )
  )}

  {isLoggedIn && (
    <div className="relative">
      <button
        className="text-4xl text-blue-600"
        onClick={() => setShowOrders((prev) => !prev)}
        aria-label="User Profile"
      >
        <FaUserCircle />
      </button>

      {showOrders && (
        <div className="absolute right-0 mt-2 w-56 p-4 bg-white border rounded shadow-lg z-50">
          <p className="font-semibold mb-2">
            Hello, {user?.name || "User"}!
          </p>
        {localStorage.getItem('userType') == 'buyer' &&  <button
            className="w-full text-left text-blue-600 hover:underline mb-2"
            onClick={() => {
              navigate("/buyer/orders");
              setShowOrders(false);
            }}
          >
            Your Orders
          </button>}
          <button
            className="w-full text-left text-red-600 hover:underline"
            onClick={() => {
              logout();
              setShowOrders(false);
            }}
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
  <div className="lg:hidden px-4 pb-4 space-y-3 text-gray-700 text-base font-medium">
    {navLinks.map(
      (link, idx) =>
        link.show && (
          <Link
            key={idx}
            to={link.path}
            onClick={closeMenu}
            className="block hover:text-blue-600"
          >
            {link.label}
          </Link>
        )
    )}

    {/* User Info and Orders - Mobile */}
    {isLoggedIn && (
      <div className="border-t pt-4 mt-4">
        <p className="font-semibold mb-2">
          Hello, {user?.name || "User"}!
        </p>
       {localStorage.getItem('userType') == 'buyer' && <button
          className="block w-full text-left text-blue-600 hover:underline mb-2"
          onClick={() => {
            navigate("/buyer/orders");
            closeMenu();
          }}
        >
          Your Orders
        </button>}
        <button
          className="block w-full text-left text-red-600 hover:underline"
          onClick={() => {
            logout();
            closeMenu();
          }}
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
