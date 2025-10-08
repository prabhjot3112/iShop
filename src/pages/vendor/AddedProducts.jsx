import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_URL;

const AddedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // 🔹 Track loading state

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      try {
        const { data } = await axios.get(`${BASE_URL}/products/vendor/1`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProducts(data.products);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to fetch products');
      } finally {
        setLoading(false); // 🔹 Mark loading as done
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">My Products</h2>

        {loading ? (
          <div className=" animate-spin w-14 h-14 mx-auto rounded-full border-t-transparent border-r-blue-600 border-2 border-b-blue-600"></div> // 🔹 Show loading
        ) : products.length === 0 ? (
          <p className="text-gray-500 text-lg">You haven’t added any products yet.</p> // 🔹 Show "no products" only after loading
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-4 flex justify-between items-center text-sm">
                    <span className="text-blue-600 font-medium">${product.price}</span>
                    <span className={product.stock > 0 ? "text-green-600" : "text-red-500"}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                  </div>
                  <div className='mt-4 flex gap-3 flex-wrap justify-start'>
                    <Link to={`/edit/${product.id}`} className='py-1 flex justify-center items-center gap-2 px-4 rounded-lg hover:bg-blue-600 hover:text-white border border-blue-600'><FaPencilAlt /> Edit</Link>
                    <Link className='py-1 flex justify-center items-center gap-2 px-4 rounded-lg border-red-600 hover:text-white border hover:bg-red-600'><FaTrash /> Delete</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddedProducts;
