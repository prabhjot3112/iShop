import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import Header from '../../components/Header';
import { FaFilter } from 'react-icons/fa'; // npm install react-icons
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SalesChart = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const [filters, setFilters] = useState({
  startDate: '',
  endDate: '',
  category: [],
  sortBy:'unitsSold'
});

const [allCategories, setAllCategories] = useState([{
  id:0,name:'All'
}]); // Populate from API if needed

const handleFilterChange = (e) => {
  const { name, value } = e.target;

  if (name === 'category') {
    const options = Array.from(e.target.options);
    const selectedValues = options.filter(o => o.selected).map(o => o.value);

    const isAllSelected = selectedValues.includes('All');
    const wasAllSelected = filters.category.includes('All');

    if (isAllSelected && !wasAllSelected) {
      // "All" was just selected → clear other selections, keep only "All"
      setFilters(prev => ({ ...prev, category: ['All'] }));
    } else if (!isAllSelected && wasAllSelected) {
      // "All" was deselected → allow others to be selected now
      setFilters(prev => ({ ...prev, category: [] }));
    } else {
      // Normal multi-select logic (excluding "All")
      setFilters(prev => ({
        ...prev,
        category: selectedValues.filter(val => val !== 'All'),
      }));
    }
  } else {
    setFilters(prev => ({ ...prev, [name]: value }));
  }
};


const handleCategoryChange = (selectedOptions) => {
  const selectedValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];
  setFilters((prev) => ({ ...prev, category: selectedValues }));
};

 const fetchData = async () => {
  try {
    setLoading(true)
    const queryParams = new URLSearchParams();

    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.category.length > 0) queryParams.append('category', filters.category.join(','));
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);  // <-- Add this line!


    const { data } = await axios.get(`${BASE_URL}/vendor/get-sales?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const res  = await axios.get(`${BASE_URL}/product/categories`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('res:',res)
    console.log('all categories are:',allCategories)
    setAllCategories((prev) => [...prev , ...res.data]);  
    setSummary(data.summary);
  } catch (error) {
    console.error('Error fetching sales summary:', error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
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
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    tooltip: {
      callbacks: {
        label: (context) => `Units Sold: ${context.raw.toLocaleString()}`,
      },
    },
  },
  scales: {
    y: {
      ticks: {
        callback: (value) => `₹${value.toLocaleString()}`,
      },
    },
    x: {
      ticks: {
        autoSkip: true,
        maxTicksLimit: 10,
      },
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
   
<div className="flex justify-between items-center mb-4">
  <h2 className="text-xl font-bold">Sales Summary</h2>
  <button
    onClick={() => setFiltersOpen(!filtersOpen)}
    className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded hover:bg-gray-200"
  >
    <FaFilter className="text-blue-600" />
    <span className="text-sm font-medium text-gray-700">Filters</span>
  </button>
</div>
{filtersOpen && (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      fetchData(); // hook to backend API
    }}
    className="bg-white border border-gray-200 rounded-md p-4 shadow mb-6"
  >
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Start Date */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Start Date</label>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* End Date */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">End Date</label>
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Category Multi-Select */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
        <CreatableSelect
          isMulti
          name="category"
          options={allCategories.map((cat) => ({
            value: cat.name,
            label: cat.name,
          }))}
          value={filters.category.map((val) => ({ value: val, label: val }))}
          onChange={handleCategoryChange}
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Sort By</label>
        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleFilterChange}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="unitsSold">Units Sold</option>
          <option value="recent">Most Recent</option>
        </select>
      </div>
    </div>

    <div className="flex justify-end mt-4 gap-2">
      <button
        type="button"
        onClick={() => {
          setFilters({
            startDate: '',
            endDate: '',
            category: [],
            sortBy: 'unitsSold',
          });
          fetchData(); // refresh with cleared filters
        }}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
      >
        Reset
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Apply Filters
      </button>
    </div>
  </form>
)}


    <Bar data={chartData} options={options} />
  </div>
</div>

    </div>
}
    </div>
  );
};

export default SalesChart;
