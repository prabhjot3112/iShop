import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const BASE_URL = import.meta.env.VITE_API_URL;

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${BASE_URL}/orders/order/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrder(data.order);
      } catch (err) {
        console.error("Failed to load order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  return (
    <div>
      <Header />

      {loading ? (
        <div className="text-center mt-12 w-full justify-center flex ">
          <div className="border-2 animate-spin border-b-transparent border-t-transparent border-blue-600 w-14 h-14 rounded-full "></div>
        </div>
      ) : !order ? (
        <div className="text-center mt-12 text-red-500">
          Could not load order. Please check your order history.
        </div>
      ) : (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            🎉 Payment Successful!
          </h1>
          <p className="text-gray-700 mb-2">
            Thank you for your purchase. Your order has been placed.
          </p>

          <div className="mt-4">
            <h2 className="font-semibold text-lg">Order Summary</h2>
            <p className="text-sm text-gray-600">
              Order ID: <span className="font-mono">{order.id}</span>
            </p>
            <p className="text-sm text-gray-600">Amount: ₹{order.totalAmount}</p>
            <p className="text-sm text-gray-600">Status: {order.status}</p>
            <p className="text-sm text-gray-600">
              Date: {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="mt-6 flex gap-4">
            <Link
              to="/buyer/orders"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              View My Orders
            </Link>
            <Link
              to="/"
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSuccess;
