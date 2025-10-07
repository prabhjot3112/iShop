import React from 'react';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Landing = () => {
  const navigate = useNavigate()
  useEffect(() => {
    if(localStorage.getItem('token') && localStorage.getItem('userType') == 'vendor')
      navigate('/vendor/home')
      else  if(localStorage.getItem('token') && localStorage.getItem('userType') == 'buyer')
      navigate('/buyer/home')

  
    return () => {
      
    }
  }, [])
  
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="bg-gray-100 py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-10">
          {/* Text Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Welcome to <span className="text-blue-600">iShop</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              A marketplace where <strong>buyers</strong> shop and <strong>vendors</strong> sell their products with ease. Start your journey now.
            </p>
            <Link to={'/buyer/register'} className="bg-blue-600 cursor-pointer text-white px-6 py-3 rounded-md hover:bg-blue-700 transition shadow-md">
              Register as a Buyer
            </Link>
          </div>

          {/* Hero Image */}
          <div className="md:w-1/2">
            <img
              src="https://cdn.pixabay.com/photo/2017/12/08/10/00/man-3005457_960_720.png"
              alt="Shopping illustration"
              className="w-full h-[350px] object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
