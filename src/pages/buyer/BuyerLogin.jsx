import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useUser } from "../../context/UserContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_URL;

const BuyerLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  // Redirect if already logged in
  useEffect(() => {
    if (
      localStorage.getItem("token") &&
      localStorage.getItem("userType") === "buyer"
    ) {
      navigate("/buyer/home");
    }
  }, [navigate]);

  // ✅ Check if all fields are filled
  const isAllFields =
    formData.email.trim() !== "" && formData.password.trim() !== "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post(`${BASE_URL}/buyer/login`, formData);
      toast.success(data.message);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", "buyer");
      setUser(data.user);
      setFormData({ email: "", password: "" });
      setTimeout(() => navigate("/buyer/home"), 2500);
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-center">Buyer Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        {/* Password Field with Eye Toggle */}
        <div>
          <label className="block text-gray-700">Password</label>
          <div className="flex items-center gap-2 relative">
            <input
              name="password"
              type={isPasswordVisible ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              placeholder="Enter your password"
            />
            <div
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              className="absolute right-3 top-3 text-gray-600 cursor-pointer hover:text-blue-500 transition"
            >
              {isPasswordVisible ? (
                <FaEyeSlash size={22} />
              ) : (
                <FaEye size={22} />
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full ${
            isAllFields
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          } text-white py-2 rounded-md transition flex items-center justify-center`}
          disabled={!isAllFields || isLoading}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Login"
          )}
        </button>
      </form>

      {/* Register Link */}
      <div className="mt-5 text-center">
        <p>
          Don't have an account?{" "}
          <Link className="text-blue-700 font-bold" to="/buyer/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default BuyerLogin;
