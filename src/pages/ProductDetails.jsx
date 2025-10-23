import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import {FaInfo, FaInfoCircle, FaMinus, FaPlus, FaTrash} from 'react-icons/fa'

const BASE_URL = import.meta.env.VITE_API_URL;

const ProductDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [deleteCartLoading, setDeleteCartLoading] = useState(false)
  const [updateCartLoading, setUpdateCartLoading] = useState(false)
  const [product, setProduct] = useState(null);
  const [vendorOfProduct, setVendorOfProduct] = useState({})
  const { id } = useParams();
  const [addCartLoading, setAddCartLoading] = useState(false)
  const [incartOrNot, setIncartOrNot] = useState(false);
  const [totalItemsIncart, setTotalItemsIncart] = useState(0)
  const [isIncreaseClicked, setIsIncreaseClicked] = useState(false)

  const token = localStorage.getItem('token')
  const updatecart = async(increase) =>{
    try {
      setUpdateCartLoading(true)
        const {data} = await axios.put(`${BASE_URL}/cart/update/${id}/${ increase == true ? totalItemsIncart + 1 : totalItemsIncart - 1}` , {} , {
          headers:{
            Authorization:  `Bearer ${token}`
          }
        })
        console.log('data is:',data)
        
        toast.success(data.message)
        if(increase)
          if(product.stock > totalItemsIncart)
         setTotalItemsIncart(totalItemsIncart + 1)
        else toast.error('No more stock available')
        else 
         setTotalItemsIncart(totalItemsIncart - 1)
        if(totalItemsIncart == 1 && !increase)
          setIncartOrNot(false)

    } catch (error) {

                toast.error(`${error.response.data.message} `)
    }finally{
      setUpdateCartLoading(false)
    }
  }
const removeFromCart = async() =>{
    try {
      setDeleteCartLoading(true)
        const {data} = await axios.delete(`${BASE_URL}/cart/delete/${id}` , {
headers:{
    Authorization:`Bearer ${token}`
}
        } )
        toast.success('Product deleted from cart')
        setIncartOrNot(false)
    } catch (error) {
                        toast.error(`Error occured: ${error.response.data.error} `)

    }finally{
      setDeleteCartLoading(false)
    }
}
  const addTocart = async() =>{
    try {
        setAddCartLoading(true)
        const {data} = await axios.post(`${BASE_URL}/cart/add/`,{
            productId:id , quantity:1
        },{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        toast.success('Product Successfully added to cart')
        setIncartOrNot(true)
        setTotalItemsIncart(1)
    } catch (error) {
        console.log('error is:',error)
                toast.error(`Error occured: ${error.response.data.message} `)
        
    }finally{
        setAddCartLoading(false)
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token')
        const { data } = await axios.get(`${BASE_URL}/products/product/${id}`);
        if(localStorage.getItem('token') && localStorage.getItem('userType') == 'buyer')
        {

        
        const data2 = await axios.get(`${BASE_URL}/cart/in-cart/${id}` , {
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        setIncartOrNot(data2.data.inCart);
        setTotalItemsIncart(data2.data.quantity)
        console.log('data2 is:',data2)
      }
        console.log('Product data:', data);
        setProduct(data.product);
        setVendorOfProduct(data.vendor)
      } catch (error) {
        console.error('Error fetching product:', error.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
        <ToastContainer />
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center mt-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : product ? (
          <div>
            <div className="flex flex-col md:flex-row gap-10 bg-white shadow-md rounded-lg p-6">
  {/* Image - Always on top in mobile */}
  <div className="w-full md:w-1/2 flex justify-center items-center">
    <img
      src={product.image}
      alt={product.name}
      className="w-full max-h-[400px] object-contain rounded-lg"
    />
  </div>

  {/* Product Details */}
  <div className="w-full md:w-1/2 flex flex-col justify-between">
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

      <p className="text-gray-600 text-lg mb-4">{product.description}</p>

      <div className="mb-2">
        <span className="font-semibold text-gray-700">Category:</span>{' '}
       {
        product.category.map((cat, index) => (
          <span key={index} className="text-blue-600 mr-2">{cat} {index < product.category.length - 1 ? ',' : ''}</span>
        ))
       }
      </div>

      <div className="mb-2">
        <span className="font-semibold text-gray-700">Stock:</span>{' '}
        <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
          {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
        </span>
      </div>

      <div className="text-2xl font-bold text-blue-700 mb-4">₹{product.price}</div>
    </div>

    {/* Add to Cart / Quantity Control */}
    { localStorage.getItem('userType') == 'buyer' ?
    <div className="mt-4">
      {token ? (
        product.stock > 0 ? !incartOrNot ? (
          <button
            onClick={addTocart}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition w-full md:w-auto"
          >
            {addCartLoading ? (
              <div className="w-5 h-5 border-2 border-white mx-auto border-t-transparent rounded-full animate-spin" />
            ) : (
              'Add To Cart'
            )}
          </button>
        ) : (
          <div className="flex items-center justify-between border rounded px-4 py-2 w-fit gap-4 bg-gray-100 shadow-sm">
            <button
              className="text-red-500 hover:text-red-700"
              onClick={removeFromCart}
              title="Remove"
            >
              <FaTrash className="cursor-pointer text-lg" />
            </button>


            <button
              onClick={() => updatecart(false)}
              className="text-red-600 hover:text-red-800"
              title="Remove"
            >
              <FaMinus className="cursor-pointer text-lg" />
            </button>

            {deleteCartLoading || updateCartLoading ? (
              <div className="w-5 h-5 border-2 border-black mx-auto border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="font-semibold text-gray-700 text-lg">{totalItemsIncart}</span>
            )}

            <button
              onClick={() => updatecart(true)}
              className="text-green-600 hover:text-green-800"
              title="Add"
            >
              <FaPlus className="cursor-pointer text-lg" />
            </button>
          </div>
        ) : <p className='text-red-600'>This Product is Currently Out of Stock</p>
      ) : (
        <p>
          <Link className="text-blue-600 font-bold" to={'/buyer/login'}>
            Sign in
          </Link>{' '}
          to add this item to cart
        </p>
      )}
    </div>
    : <div className='flex  items-start gap-2 justify-start'> <FaInfoCircle className='text-xl' /> <p className='text-md p-0  m-0'>
      Please create an Buyer account to purchase this product
      </p>
      </div>
}
  </div>
</div>

{/* Vendor Info - Always below */}
<div className="mt-6 w-full flex justify-end">
  <div className="text-right">
    <span className="text-gray-700 block mb-1">Vendor Details</span>
    <div className="flex flex-col">
      <span className="font-bold text-md text-blue-600">{vendorOfProduct.name}</span>
      <span className="font-bold text-md text-blue-600">{vendorOfProduct.companyName}</span>
    </div>
  </div>
</div>

          </div>
        ) : (
          <div className="text-center text-red-600 text-lg mt-10">Product not found.</div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
