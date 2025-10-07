import React, { useEffect, useState } from 'react';
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
const BASE_URL = import.meta.env.VITE_API_URL

const BuyerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    ;(()=>{
        if(localStorage.getItem('token'))
            navigate('/vendor/home')
    })()
  
    return () => {
      
    }
  }, [])
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const navigate = useNavigate();
  const handleSubmit = async(e) => {

    e.preventDefault();
    setIsLoading(true)
    console.log('Form Data:', formData);
    try {
        const {data} = await axios.post(`${BASE_URL}/buyer/register`,formData)
        console.log('data is:',data)
        toast.success('Buyer Registered Successfully')
        setFormData({
            name:'',
            email:'',
            password:'',
        })
        setTimeout(() => {
            navigate('/buyer/login')
        }, 2500);
    } catch (error) {   
        console.log('error occured',error)
        toast.error(`Error occured: ${error.response.data.error} `)
    }finally{
    setIsLoading(false)
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-10">

        <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-center">Register as a Buyer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-gray-700">Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>

        
        <button
  type="submit"
  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
  disabled={isLoading} 
>
  {isLoading ? (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  ) : (
    'Submit'
  )}
</button>
      </form>
      <div className='mt-5 text-center'>
        <p>Already have an account? <Link className='text-blue-700 font-bold' to='/buyer/login'>Login</Link></p>
      </div>
    </div>
  );
};

export default BuyerRegister;
