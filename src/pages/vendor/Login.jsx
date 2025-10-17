import React, { useEffect, useState } from 'react';
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { useUser } from '../../context/UserContext';
const BASE_URL = import.meta.env.VITE_API_URL

const VendorLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  useEffect(() => {
    ;(()=>{
        if(localStorage.getItem('token') && localStorage.getItem('userType') == 'vendor')
            navigate('/vendor/home')
    })()
  
    return () => {
      
    }
  }, [])
  
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const navigate = useNavigate();
  const {user , setUser} = useUser()
  const handleSubmit = async(e) => {

    e.preventDefault();
    setIsLoading(true)
    console.log('Form Data:', formData);
    try {
        const {data} =await axios.post(`${BASE_URL}/vendor/login`,formData)
        console.log('data is:',data)
        toast.success(data.message)
        localStorage.setItem('token',data.token)
        setUser(data.vendor)
        localStorage.setItem('userType','vendor')
        setFormData({
            email:'',
            password:'',        })
        setTimeout(() => {
            navigate('/vendor/home')
        }, 2500);
    } catch (error) {
      if(error.response.data.errors)
      {
      const errors = error.response?.data?.errors;
      
      if (Array.isArray(errors)) {
      errors.forEach(err => toast.error(err.msg));
      }
    } else if(error.response.data.error) {
      toast.error(error.response.data.error)
    } else{
      toast.error('An unexpected error occurred');
    }
    }finally{
    setIsLoading(false)
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-10">

        <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-center">Vendor Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
          

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
    'Login'
  )}
</button>

      </form>
       <div className='mt-5 text-center'>
        <p>Don't have an account <Link className='text-blue-700 font-bold' to='/vendor/register'>Register</Link></p>
      </div>
    </div>
  )
};

export default VendorLogin;
