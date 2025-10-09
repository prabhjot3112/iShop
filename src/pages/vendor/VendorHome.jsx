import React from 'react';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';

const VendorHome = () => {
  const menuItems = [
    { title: 'Sales', link: '/vendor/sales' },
    { title: 'Add Product', link: '/vendor/add-product' },
    { title: 'My Products', link: '/vendor/products' },
    { title: 'Orders', link: '/vendor/orders' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Vendor Dashboard</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <Link
              to={item.link}
              key={index}
              className="bg-white shadow-md rounded-lg p-6 text-center hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer"
            >
              <span className="text-xl font-semibold">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorHome;
