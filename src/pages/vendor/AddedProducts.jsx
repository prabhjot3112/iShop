import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaPencilAlt, FaTimes, FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useAddedProducts } from '../../context/AddedProductsContext';

const BASE_URL = import.meta.env.VITE_API_URL;

const AddedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const {user} = useUser()
  const {AddedProducts , setAddedProducts , isLoading , setIsLoading} = useAddedProducts()

  const [isDeleteOpen, setIsDeleteOpen] = useState({isTrue:false , id:null})
    
  const token = localStorage.getItem('token');
  const [isDeleteProductLoading, setIsDeleteProductLoading] = useState(false)
  const deleteProduct = async(id) => {
    try {
      setIsDeleteProductLoading(true)
      const {data} = await axios.delete(`${BASE_URL}/products/product/delete/${id}` , {
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      console.log('data is:',data)
    if (data?.message === 'Success') {
  const updatedProducts = AddedProducts.filter(product => product.id !== parseInt(id));
  console.log('updatedProducts:',updatedProducts)
  setProducts(updatedProducts);
  setIsDeleteOpen({isTrue:false , id:null})
  toast.success('Product Deleted Successfully');
  setAddedProducts(updatedProducts);
}
    } catch (error) {
      setIsDeleteOpen({isTrue:false , id:null})
      toast.error(error.response.data.error) 
    }finally{
      setIsDeleteProductLoading(false)
    }
  }

  const navigate = useNavigate()
  useEffect(() => {
    const fetchVendorProducts = async () => {
      if (!token) {
        navigate('/vendor/login');
        return;
      }

      try {
        const { data } = await axios.get(`${BASE_URL}/products/vendor`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(data.products);
        setAddedProducts(data.products)
        console.log('products are:',data.products)
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to fetch products');
      } finally {
        setLoading(false);
        setIsLoading(false)
      }
    };

    fetchVendorProducts();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">My Products</h2>

        {isLoading ? (
          <div className=" animate-spin w-14 h-14 mx-auto rounded-full border-t-transparent border-r-blue-600 border-2 border-b-blue-600"></div> // 🔹 Show loading
        ) : AddedProducts.length === 0 ? (
          <p className="text-gray-500 text-lg">You haven’t added any products yet.</p> 
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {AddedProducts && AddedProducts.map((product) => (
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
                    <span className="text-blue-600 font-medium">₹{product.price}</span>
                    <span className={product.stock > 0 ? "text-green-600" : "text-red-500"}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                  </div>
                  <div>
                    {
                      product.category && product.category.length > 0 && (
                        <div className='mt-2 flex flex-wrap gap-2'>
                          {product.category.map((cat, index) => (
                            <span key={index} className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">
                              {cat}
                            </span>
                          ))}
                        </div>
                      )
                    }
                  </div>
                  <div className='mt-4 flex gap-3 flex-wrap justify-start'>
                    <Link to={`/vendor/product/edit/${product.id}`} className='py-1 flex justify-center items-center gap-2 px-4 rounded-lg hover:bg-blue-600 hover:text-white border border-blue-600'><FaPencilAlt /> Edit</Link>
                    <button onClick={() => setIsDeleteOpen({isTrue:true , id:product.id})} className='py-1 flex justify-center items-center gap-2 px-4 rounded-lg border-red-600 hover:text-white border hover:bg-red-600'><FaTrash /> Delete</button>
                  </div>
                  {isDeleteOpen.isTrue && isDeleteOpen.id == product.id  && <div className='mt-3 p-3 flex flex-col border border-black rounded'>
                    <FaTimes className='mb-2 self-end text-lg cursor-pointer' onClick={() => setIsDeleteOpen({isTrue:false , id:null})}/>
                      <p>Are you sure you want to delete this product?</p>
                      <div className='flex justify-start flex-wrap gap-3 mt-2'>
  <button
    className='py-1 px-3 bg-red-500 hover:bg-red-600 rounded-lg text-white flex items-center justify-center min-w-[60px]'
    onClick={()=> !isDeleteProductLoading && deleteProduct(product.id)}
    disabled={isDeleteProductLoading}
  >
    {isDeleteProductLoading ? (
      <div  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
    ) : (
      'Yes'
    )}
  </button>

  <button
    onClick={() => setIsDeleteOpen({ isTrue: false, id: null })}
    className='py-1 px-3 bg-green-500 hover:bg-green-600 rounded-lg text-white'
  >
    No
  </button>
</div>

                  </div>}
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
