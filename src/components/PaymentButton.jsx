import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

const PaymentButton = ({ totalAmount }) => {
  const [isLoading, setIsLoading] = useState(false); // loading state

  const handlePayment = async () => {
    const token = localStorage.getItem("token");

    try {
      setIsLoading(true); // Start loading

      // 1. Create order on backend
      const { data } = await axios.post(
        `${BASE_URL}/payment/create-order`,
        { totalAmount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { razorpayOrder } = data;

      // 2. Initialize Razorpay
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "iShop",
        description: "Payment for order",
        order_id: razorpayOrder.id,
        theme: { color: "#3399cc" },
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;


          try {
            const { data } = await axios.post(
              `${BASE_URL}/payment/verify-payment`,
              {
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log('server data is:',data)

            if (data.success) {
              toast.success("Payment Verified!");
              setTimeout(() => {
                window.location.href = `/buyer/order-success/${data.order.id}`;
              }, 1500);
            } else {
              toast.error("Payment verification failed.");
              setIsLoading(false);
            }
          } catch (error) {
            console.error("Verification failed:", error);
            toast.error("Verification failed. Try again.");
            setIsLoading(false);
          }
        },
        modal: {
          // Optional: handle modal close event
          ondismiss: () => {
            toast.info("Payment cancelled.");
            setIsLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initiation failed", err);
      toast.error("Failed to initiate payment");
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={`${
        isLoading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-indigo-600 hover:bg-indigo-700"
      } text-white font-semibold py-2 px-6 rounded-md shadow-md transition duration-200`}
    >
      {isLoading ? "Processing..." : `Pay ₹${totalAmount}`}
    </button>
  );
};

export default PaymentButton;
