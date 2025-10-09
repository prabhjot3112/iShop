import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import Header from '../../components/Header';
const BASE_URL = import.meta.env.VITE_API_URL;

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SalesChart = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get(`${BASE_URL}/vendor/get-sales`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        console.log('data is:',data)
        setSummary(data.summary);
      } catch (error) {
        console.error('Error fetching sales summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);



  // Data for Chart.js
    const labels = summary?.productBreakdown
    ? Object.values(summary.productBreakdown).map((p) => p.name)
    : [];

  const quantities = summary?.productBreakdown
    ? Object.values(summary.productBreakdown).map((p) => p.quantitySold)
    : [];


  const chartData = {
    labels,
    datasets: [
      {
        label: 'Units Sold',
        data: quantities,
        backgroundColor: '#3b82f6',
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive:true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div>
<Header />
{
    loading ? <div className='w-full mt-10 flex justify-center'>
    <div className='w-14 h-14 border-2 border-t-transparent border-blue-600 animate-spin rounded-full'></div>
  </div>
:
   !summary ? <div>
    No data found
   </div> : <div className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-md mt-10">
      <h2 className="text-xl font-bold mb-4">Sales Summary</h2>

      <div className="flex  flex-wrap w-full justify-between gap-6 mb-6">
        <div className="bg-blue-100 p-4 rounded-md">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-2xl font-semibold">{summary.totalOrders}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-md">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-semibold">₹{summary.totalRevenue.toFixed(2)}</p>
        </div>
      </div>
<div className="overflow-x-auto w-full flex md:justify-center">
  <div className=" min-w-[600px]"> {/* Adjust width based on how wide your chart needs to be */}
    <Bar data={chartData} options={options} />
  </div>
</div>

    </div>
}
    </div>
  );
};

export default SalesChart;
