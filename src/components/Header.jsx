import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'

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

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
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
            <button
              onClick={logout}
              className="px-3 py-2 text-lg rounded-lg bg-red-500 hover:bg-red-700 text-white"
            >
              Logout
            </button>
          )}
        </nav>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 text-gray-700 text-base font-medium">
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
          {isLoggedIn && (
            <button
              onClick={() => {
                logout()
                closeMenu()
              }}
              className="px-3 py-2 text-lg rounded bg-red-500 hover:bg-red-700 text-white"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  )
}

export default Header
