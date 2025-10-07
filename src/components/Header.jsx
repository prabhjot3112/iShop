import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Toggle mobile menu

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
    navigate('/')
  }

  return (
    <header className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className="text-2xl cursor-pointer font-bold text-blue-600"
        >
          iShop
        </div>

        {/* Hamburger - only on mobile */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-2xl focus:outline-none"
        >
          ☰
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-gray-700 text-sm font-medium">
          {  <Link to={localStorage.getItem('userType') == 'vendor' ? `/vendor/home` :'/buyer/home'} className="hover:text-blue-600 text-lg">
            Home
</Link>}
          {!localStorage.getItem('token') && location.pathname !== '/vendor/register' && localStorage.getItem('userType') != 'vendor' && (
            <Link to="/vendor/register" className="hover:text-blue-600 text-lg">
              Register as Vendor
            </Link>
          )}
          {location.pathname !== '/buyer/cart' && localStorage.getItem('userType') == 'buyer' &&
            <Link to={`/buyer/cart`} className="hover:text-blue-600 text-lg">Cart
</Link>
          }
          {location.pathname !== '/contact' && (
            <Link to="/contact" className="hover:text-blue-600 text-lg">
              Contact
            </Link>
          )}
           <Link className="block hover:text-blue-600 text-lg" to={'/search'}>Search</Link>
          {          localStorage.getItem('token') && <button onClick={logout} className='px-3 py-2 text-lg rounded-lg bg-red-500 hover:bg-red-700 text-white'>Logout</button>
}

        </nav>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 text-gray-700 text-sm font-medium">
          {  <Link to={localStorage.getItem('userType') == 'vendor' ? `/vendor/home` :'/buyer/home'} className="hover:text-blue-600 block text-lg">
            Home
</Link>}
          { 
  !localStorage.getItem('token') && location.pathname !== '/vendor/register' && (
    <Link
      to="/vendor/register"
      className="block hover:text-blue-600 text-lg"
      onClick={() => setIsOpen(false)}
    >
      Register as Vendor
    </Link>
  )

}
{location.pathname !== '/buyer/cart' && localStorage.getItem('userType') == 'buyer' &&
            <Link to={`/buyer/cart`} className="block hover:text-blue-600 text-lg">Cart
</Link>
          }

          {location.pathname !== '/contact' && (
           <Link className="block hover:text-blue-600 text-lg" to={'/contact'}>Contact</Link>
          )}
           <Link className="block hover:text-blue-600 text-lg" to={'/search'}>Search</Link>

{          localStorage.getItem('token') && <button onClick={logout} className='px-2 py-1 text-lg rounded bg-red-500 hover:bg-red-700 text-white'>Logout</button>
}

        </div>
      )}
    </header>
  );
};

export default Header;
