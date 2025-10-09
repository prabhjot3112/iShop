import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = import.meta.env.VITE_API_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/orders/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setOrders(data.orders || []);
      } catch (error) {
        toast.error(error?.response?.data?.error || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">🧾 My Orders</h1>

        {loading ? (
          <div className="text-center text-gray-600 mt-20">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-600 mt-20">You haven't placed any orders yet.</div>
        ) : (
          <div className="space-y-8">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded shadow p-6">
                <div className="mb-4 border-b pb-2">
                  <p><span className="font-medium">Order ID:</span> #{order.id}</p>
                <p>
  <span className="font-medium">Status: </span> 
  <span className={order.status === 'pending' ? 'text-orange-600' : 'text-green-600'}>
    {order.status}
  </span>
</p>
   <p><span className="font-medium">Total:</span> ₹{order.totalAmount.toFixed(2)}</p>
                  <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
                </div>

                {order.items.length === 0 ? (
                  <p className="text-sm text-red-500">No items in this order.</p>
                ) : (
                  <div className="space-y-4">
                    {order.items.map(item => (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 border rounded p-3 bg-gray-50"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{item.product.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-sm text-gray-600">Price: ₹{item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
