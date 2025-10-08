import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import PaymentButton from '../../components/PaymentButton';

const BASE_URL = import.meta.env.VITE_API_URL;

const Cart = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token');
    const [isCartItemLoading, setIsCartItemLoading] = useState(true)
    const [cartItems, setCartItems] = useState([]);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [deletingProductId, setDeletingProductId] = useState(null);

    const fetchCartItems = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/cart/get`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCartItems(data.items);
        } catch (error) {
            toast.error(`Error occurred: ${error.response?.data?.error || error.message}`);
        } finally {
            setIsCartItemLoading(false)
        }
    };

    const removeFromCart = async (productId) => {
        try {
            setIsDeleteLoading(true);
            setDeletingProductId(productId);

            await axios.delete(`${BASE_URL}/cart/delete/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success('Product deleted from cart');
            await fetchCartItems(); // Refresh cart
        } catch (error) {
            toast.error(`Error occurred: ${error.response?.data?.error || error.message}`);
        } finally {
            setIsDeleteLoading(false);
            setDeletingProductId(null);
        }
    };

    useEffect(() => {
        if(localStorage.getItem('token') && localStorage.getItem('userType') == 'buyer')
        fetchCartItems();
    else navigate('/buyer/login')
    }, []);
    const totalToPay = cartItems.reduce((acc, item) => {
        return acc + item.product.price * item.quantity;
    }, 0);

    return (
        <div>
            <ToastContainer />
            <Header />
            <div className='px-4'>

            {
                isCartItemLoading ?
                    <div className="flex justify-center mt-10">
                        <div className="w-12 h-12 border-4 border-purple-700 border-t-transparent rounded-full animate-spin" />
                    </div>
                    : cartItems.length == 0 ? <div className='flex flex-col justify-center items-center'> 
                        <img src='https://cdn-icons-png.flaticon.com/512/11329/11329060.png'/>
                        <h3 className='text-center mt-5 text-lg font-bold'>Cart is Empty</h3>
                         </div> :
<div>

                    <div className="mt-5 max-w-4xl mx-auto grid grid-cols-1 gap-4">
                        {cartItems.map((cartItem) => {
                            const { product, quantity } = cartItem;

                            return (
                                <div key={cartItem.id} className="flex flex-col hover:underline border p-4 rounded shadow relative">
                                    {/* Delete Button - Top Right */}
                                    <div className="flex justify-end">
                                        {isDeleteLoading && deletingProductId === product.id ? (
                                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <button onClick={() => removeFromCart(product.id)}>
                                                <FaTrash className="text-red-600 hover:text-red-800" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Cart Item Info */}
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                                        {/* Product Image */}
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-32 h-32 object-cover rounded"
                                        />

                                        {/* Product Info */}
                                        <div className="flex-1 text-left">
                                            <Link to={`/product/${product.id}`} className=''>
                                            <h4 className="text-lg  font-semibold">{product.name}</h4>
                                            </Link>
                                            
                                            <p className="text-sm text-gray-600">{product.description}</p>
                                            <p className="mt-1 text-sm text-gray-800">Category: {product.category}</p>
                                        </div>

                                        {/* Quantity & Price */}
                                        <div className="text-right">
                                            <p className="text-md">
                                                Qty: <span className="font-medium">{quantity}</span>
                                            </p>
                                            <p className="text-md">
                                                Price:{' '}
                                                <span className="font-medium">₹{product.price.toFixed(2)}</span>
                                            </p>
                                            <p className="text-md mt-1 font-semibold">
                                                Total: ₹{(product.price * quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                       

                    </div>
                    <div>

                    { cartItems.length > 0 && (
                        <div className='max-w-4xl mx-auto mt-6 flex flex-col gap-4'>
                                <div className=" flex justify-end">
                                    <div className="text-right">
                                        <h4 className="text-lg font-semibold">To Pay:</h4>
                                        <p className="text-xl font-bold text-green-600">₹{totalToPay.toFixed(2)}</p>
                                    </div>
                                </div>
                              <PaymentButton totalAmount={totalToPay.toFixed(2)}/>   </div>

                     )}

</div>

                     </div>
            }
            </div>
        </div>
    );
};

export default Cart;
