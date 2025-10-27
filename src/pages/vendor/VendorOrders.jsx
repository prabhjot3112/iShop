import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify';
import OrderStatusSelector from '../../components/OrderStatusSelector';
const BASE_URL = import.meta.env.VITE_API_URL;


const VendorOrders = ({orderItems , setOrderItems }) => {
  
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchOrders = async() => {
      console.log('fetching orders')
      const token = localStorage.getItem('token')
      try {
        const {data} = await axios.get(`${BASE_URL}/orders/vendor` , {
          headers:{
            Authorization:`Bearer ${token}`
          }
        })
        console.log('data is:',data)
        setOrderItems(data.orderItems)
        
      } catch (error) {
        toast.error(error.response.data.error)
      }finally{
        setIsLoading(false)
      }
    }
    fetchOrders()
  
    return () => {
      
    }
  }, [])

  const [isUpdateStatusLoading, setIsUpdateStatusLoading] = useState({isTrue:false,id:null})
  const [orderStatus, setOrderStatus] = useState('pending')
  const updateStatus = async (id, newStatus) => {
  const token = localStorage.getItem("token");

  try {
    setIsUpdateStatusLoading({ isTrue: true, id });
    const { data } = await axios.put(
      `${BASE_URL}/orders/order/update/item/status`,
      {
        orderItemId: id,
        status: newStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(data.message);

    // ✅ Update status locally in orderItems
    setOrderItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  } catch (error) {
    toast.error(error.response?.data?.error || "Something went wrong");
  } finally {
    setIsUpdateStatusLoading({ isTrue: false, id: null });
  }
};

  
  return (
    <div>
      <Header />
     {  isLoading ? <div className='w-full flex justify-center mt-7'>
      <div className='w-14 h-14 border-2 rounded-full border-t-transparent border-blue-700 animate-spin'></div>
     </div> : <div>

     <h3 className='font-bold text-xl mt-5 text-center'>
        Orders of your Products
      </h3>
     {orderItems.length > 0 ?  <div className='p-4 grid grid-cols-1 gap-8  md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto mt-4'>
        {
          orderItems.map((orderItem,id) => (
            <div key={orderItem.id} className='flex flex-col p-3 hover:scale-105 transition cursor-pointer gap-3 w-full shadow-xl bg-gray-50 rounded '>
              <div>
                <p>Order ID: {orderItem.order.id}</p>
                <p>Total Amount: {orderItem.order.totalAmount}</p>
                <p className={``}>Status: <span className={`${orderItem.order.status == 'paid' ? 'text-green-600' : orderItem.order.status == 'pending' ? 'text-orange-400' : 'text-red-500' }`}>{orderItem.order.status}</span></p>
                <p>PaymentIntentId: {orderItem.order.paymentIntentId}</p>
                <p>Date & Time: {orderItem.order.createdAt.toString().substring(0,10)} - {orderItem.order.createdAt.toString().substring(11,19)}</p>
              </div>
              <div className='p-3 rounded-lg shadow-lg border flex flex-col gap-2'>
                <h4>
                  {orderItem.product.name}
                </h4>
                <div className='relative'>
                <img src={`${orderItem.product.image}`} 
                  className="w-full object-cover"
/>
<div className='flex justify-start flex-wrap mt-2 gap-2'>
{
  orderItem.product.category.length > 0 && orderItem.product.category.map((cat,id) => (
    <div key={id} className='bg-blue-600 text-white rounded py-1 px-2'>
      {cat}
    </div>
  ))
}
  </div>
                </div>
              </div>
                            <div className='p-3 rounded-lg shadow-lg border flex flex-col gap-2'>
<p className='text-center'>Ordered by: <span className='font-bold'>
   {orderItem.order.buyer.name}
  </span>
 
   </p>
              </div>
 <OrderStatusSelector
  currentStatus={orderItem.status}
  orderItem={orderItem}
  isUpdateStatusLoading={isUpdateStatusLoading}
  onUpdate={updateStatus}
/>


              <div></div>
            </div>
          ))
        }

      </div> : <div className='text-center mt-10 tex-lg'>No Orders found</div>}</div>}
    </div>
  )
}

export default VendorOrders