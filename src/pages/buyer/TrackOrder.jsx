import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

const STATUS_FLOW = [
  "pending",
  "packed",
  "dispatched",
  "out-for-delivery",
  "delivered",
];

const TrackOrder = () => {
  const { id } = useParams();
  const [orderItem, setOrderItem] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('');
  const isCancelled = currentStatus === "cancelled";


  useEffect(() => {
    const trackOrder = async () => {
      const token = localStorage.getItem('token');
      try {
        const { data } = await axios.get(`${BASE_URL}/orders/order/item/track/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('data is:', data);
        setOrderItem(data.orderItem);
        setCurrentStatus(data.orderItem.status);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Something went wrong');
      }
    };

    trackOrder();
  }, [id]);

  const getStatusClass = (status) => {
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    const stepIndex = STATUS_FLOW.indexOf(status);

    if (stepIndex < currentIndex) return "bg-green-500 text-white";
    if (stepIndex === currentIndex) return "bg-blue-500 text-white";
    return "bg-gray-200 text-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-md shadow">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Track Your Order Item</h2>

        {!orderItem ? (
          <div className='w-full justify-center flex mt-10'>
            <div className='w-14 h-14 rounded-full animate-spin border-2 border-t-transparent border-blue-600'></div>
          </div> 
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p><span className="font-semibold">Order ID:</span> #{orderItem.order.id}</p>
                <p><span className="font-semibold">Product ID:</span> {orderItem.productId}</p>
                <p><span className="font-semibold">Quantity:</span> {orderItem.quantity}</p>
                <p><span className="font-semibold">Price:</span> ₹{orderItem.price}</p>
                <Link to={`/product/${orderItem.product.id}`}>
                <div className='py-2 px-3 rounded bg-gray-100 mt-3 mb-2'>
                    <p>Product Information </p>
                    <div className='relative'>
                        <p className='mt-3 font-bold  text-lg '>{orderItem.product.name}</p>
                        <img src={`${orderItem.product.image}`} className='mt-2 rounded max-w-[260px]'/>
                        <div className='mt-2 absolute bottom-4 flex gap-2 items-start flex-wrap justify-center'>
                          {
                            orderItem.product.category.map((cat, index) => (
                              <span key={index} className="bg-white  px-2 py-1 rounded  text-blue-600">{cat} {index < orderItem.product.category.length - 1 ? ',' : ''}</span>
                            ))
                          }
                        </div>
                          </div>
                </div>
                </Link>
              </div>
            </div>
{isCancelled ? (
      <div className="text-center py-10">
        <div className="inline-block px-4 py-2 text-red-700 bg-red-100 rounded-full font-semibold mb-4">
          Order Cancelled
        </div>
        <p className="text-gray-600">This order has been cancelled and will not be processed further.</p>
      </div>
    ) : (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {STATUS_FLOW.map((status, index) => (
            
          <div
            key={status}
            className="flex-1 flex flex-col items-center relative"
            style={{ opacity: index <= STATUS_FLOW.indexOf(currentStatus) ? 1 : 1 }}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
                index < STATUS_FLOW.indexOf(currentStatus)
                  ? "bg-green-500 text-white"
                  : index === STATUS_FLOW.indexOf(currentStatus)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {index + 1}
            </div>
            <span className="mt-2 text-center text-sm capitalize">
              {status.replace(/-/g, ' ')}
            </span>
            {index !== STATUS_FLOW.length - 1 && (
              <div className="hidden sm:block absolute top-4 left-1/2 w-full h-1 z-0 transform translate-x-4 sm:translate-x-0 sm:left-full sm:-translate-y-1/2 sm:w-full">
                <div className="h-1 w-full bg-gray-300"></div>
              </div>
            )}
            {index !== STATUS_FLOW.length - 1 && (
           <div className="sm:hidden">
                <div className="h-[45px] w-1 bg-gray-300"></div>
              </div>)}
          </div>
        ))}
      </div>
    )}
           
          </>
        )}
      </div>
      
  </div>
);
}

export default TrackOrder;
