import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { Link } from 'react-router-dom'
import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL;

const BuyerHome = () => {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
  // Run an initial search (optional)
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/products/random`);
        console.log('data is:',data)
        setData(data.products)
        console.log('Initial data:', data);
      } catch (err) {
        console.error('Initial fetch failed:', err.message);
      }finally{
        setIsLoading(false)
      }
    };

    fetchInitial();
  }, []);
  return (
    <div>
        <Header />
            {/* Search */}
        <Link to={'/search'}>
        <div
  className="mt-10 w-11/12 sm:w-1/2 mx-auto bg-gradient-to-r from-gray-300 to-gray-500 text-black 
  hover:text-white hover:from-gray-600 hover:to-gray-800 transition-all duration-300 ease-in-out
  font-semibold text-lg py-4 px-6 rounded-xl text-center shadow-md hover:shadow-xl transform hover:scale-105
  cursor-pointer"
>
  🔍 Search for Products
</div>
    </Link>
    <div className='mt-5 '>
        {
            isLoading  ? <div className='animate-spin border-2 rounded-full w-14 h-14 mx-auto mt-10 border-l-red-600 border-r-yellow-500 border-t-blue-700 border-b-green-600'></div> : 
            
                 <div className="grid mt-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((product, id) => (
            <Link
            to={`/product/${product.id}`}
              key={product.id}
              className="bg-gray-100 hover:scale-105 shadow-lg rounded-lg p-4 hover:shadow-xl transition cursor-pointer flex flex-col items-center"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-contain mb-3"
              />
              <h3 className="text-center text-lg font-semibold">{product.name.toString().length > 25 ? product.name.substring(0,25) + '...' : product.name}</h3>
              <p className='flex items-start'><span>$</span>
              <span className='text-xl'>{product.price}</span>
                </p>
            </Link>
          ))}
        </div>
            
        } </div>

    </div>
  )
}

export default BuyerHome