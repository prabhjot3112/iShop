import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import Select from 'react-select';
import { useProductCategories } from '../context/ProductCategoriesContext'; // assuming this exists
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_API_URL;

const Search = () => {
  const [data, setData] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { searchData, setSearchData } = useSearch();
    const {loading , setLoading , categories , setCategories , isFetched , setIsFetched} = useProductCategories()
   // only take categories

  // Map categories for react-select
  const categoryOptions = categories?.map(cat => ({ value: cat.name, label: cat.name })) || [];

  useEffect(() => {
    const token = localStorage.getItem('token')
    const getProductCategories = async() => {
      try {
        const {data} = await axios.get(`${apiUrl}/product/categories/all`);
        console.log('data is:',data)
        setCategories(data.categories)

      } catch (error) {
       toast.error(error.response.data.message || error.response.data.error) 
      }finally{
        setLoading(false)
      }
    }
  getProductCategories()
    return () => {
      
    }
  }, [])
  

  // Handle search + category filter
  const startSearch = async (page = 1) => {
    if (!searchData.search.trim()) return;

    setIsLoading(true);
    // setCategories([])
    try {
      // Append category filter if selected
      const categoryQuery = searchData.category ? `&category=${searchData.category}` : '';
      const { data } = await axios.get(
        `${apiUrl}/products/search/${searchData.search}?page=${page}${categoryQuery}`
      );

      setData(data.products || []);
      setSearchData({
        ...searchData,
        results: data.products || [],
        totalPages: data.totalPages || 1,
        currentPage: page,
      });
    } catch (err) {
      console.error('Search failed:', err.message);
      setData([]);
    } finally {
      setIsLoading(false);
      setIsSearched(true);
    }
  };

  const changePage = async (page) => startSearch(page);

  const renderPagination = () => {
    const totalPages = searchData.totalPages || 1;
    const currentPage = searchData.currentPage || 1;
    const visibleRange = 2;
    const pageButtons = [];

    const startPage = Math.max(1, currentPage - visibleRange);
    const endPage = Math.min(totalPages, currentPage + visibleRange);

    if (currentPage > 1) {
      pageButtons.push(
        <button key="prev" onClick={() => changePage(currentPage - 1)} className="px-3 py-2 border rounded hover:bg-blue-600 hover:text-white">Prev</button>
      );
    }

    if (startPage > 1) {
      pageButtons.push(
        <button key={1} onClick={() => changePage(1)} className={`px-3 py-2 border rounded ${currentPage === 1 ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'}`}>1</button>
      );
      if (startPage > 2) pageButtons.push(<span key="start-ellipsis">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button key={i} onClick={() => changePage(i)} className={`px-3 py-2 border rounded ${currentPage === i ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'}`}>{i}</button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageButtons.push(<span key="end-ellipsis">...</span>);
      pageButtons.push(
        <button key={totalPages} onClick={() => changePage(totalPages)} className={`px-3 py-2 border rounded ${currentPage === totalPages ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'}`}>{totalPages}</button>
      );
    }

    if (currentPage < totalPages) {
      pageButtons.push(
        <button key="next" onClick={() => changePage(currentPage + 1)} className="px-3 py-2 border rounded hover:bg-blue-600 hover:text-white">Next</button>
      );
    }

    return <div className="flex flex-wrap justify-center gap-2 mt-10">{pageButtons}</div>;
  };

  return (
    <div>
      <div className='shadow shadow-gray-400 bg-red-500'>
        <Header />
      </div>
    {loading ? <div className='flex w-full justify-center'>
      <div className='w-14 h-14 border-2 border-t-transparent border-blue-700 animate-spin rounded-full mt-16'></div>
    </div> :  <div className="px-4 py-5 min-h-screen bg-gray-50">

        {/* Search Input + Category Filter */}
        <div className="flex flex-col md:flex-row mt-10 justify-center gap-4 items-center">
          <input
            type="text"
            value={searchData.search}
            onChange={(e) => setSearchData({ ...searchData, search: e.target.value })}
            placeholder="Search for products..."
            className="w-full max-w-md border border-gray-400 focus:ring-purple-600 focus:ring-2 outline-none py-2 px-3 rounded-lg"
          />

          <div className="w-full max-w-xs">
            <Select
              options={categoryOptions}
              placeholder="Filter by category"
              isClearable
              onChange={(option) => setSearchData({ ...searchData, category: option?.value })}
            />
          </div>

          <button
            onClick={() => startSearch(1)}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition"
          >
            Search
          </button>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex justify-center mt-10">
            <div className="w-12 h-12 border-4 border-purple-700 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Search Results */}
        {!isLoading && searchData.results.length > 0 && (
          <>
            <div className="grid mt-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchData.results.map(product => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="bg-white hover:scale-105 shadow-lg rounded-lg p-4 hover:shadow-xl transition cursor-pointer flex flex-col items-center"
                >
                  <img src={product.image} alt={product.name} className="w-full h-48 object-contain mb-3" />
                  <div className='flex flex-col'>
                    <h3 className="text-center text-lg font-semibold">{product.name.length > 25 ? product.name.substring(0,25) + '...' : product.name}</h3>
                    <div className='flex gap-3 flex-wrap'>
                      <h4 className='mt-3 text-left text-gray-500 font-bold'>Price: ₹{product.price}</h4>
                      <h4 className='mt-3 text-left text-blue-600 font-bold'>{product.category[0]}</h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {searchData.totalPages && (
              <div className="mt-10 flex justify-center gap-3 flex-wrap">
                {renderPagination()}
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!isLoading && isSearched && data.length === 0 && (
          <div className="text-center text-red-600 mt-8 text-lg">
            No products found
          </div>
        )}
      </div>}
    </div>
  );
};

export default Search;
