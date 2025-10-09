import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

const Search = () => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1)
const [pages, setPages] = useState([])


const changePage = async(page) => {
  if (!query.trim()) return; // prevent empty queries

    setIsLoading(true);
    try {
      const { data } = await axios.get(`${apiUrl}/products/search/${query}?page=${page}`);
      console.log('Search result:', data);
      setData(data.products || []);
      setPages(Array.from({ length: Number(data.totalPages) }, (_, i) => i + 1))
      setCurrentPage(page)
    } catch (err) {
      console.error('Search failed:', err.message);
      setData([]);
    } finally {
      setIsLoading(false);
      setIsSearched(true);
    }
}

const renderPagination = () => {
  const totalPages = pages.length;
  const maxVisiblePages = 5;
  const pageButtons = [];

  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Previous Button
  if (currentPage > 1) {
    pageButtons.push(
      <button
        key="prev"
        onClick={() => changePage(currentPage - 1)}
        className="px-3 py-2 border rounded hover:bg-blue-600 hover:text-white"
      >
        Prev
      </button>
    );
  }

  // Leading Ellipsis
  if (startPage > 1) {
    pageButtons.push(
      <button key={1} onClick={() => changePage(1)} className="px-3 py-2 border rounded">
        1
      </button>
    );
    if (startPage > 2) {
      pageButtons.push(<span key="start-ellipsis">...</span>);
    }
  }

  // Middle Page Buttons
  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(
      <button
        key={i}
        onClick={() => changePage(i)}
        className={`px-3 py-2 border rounded ${
          currentPage === i ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'
        }`}
      >
        {i}
      </button>
    );
  }

  // Trailing Ellipsis
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pageButtons.push(<span key="end-ellipsis">...</span>);
    }
    pageButtons.push(
      <button key={totalPages} onClick={() => changePage(totalPages)} className="px-3 py-2 border rounded">
        {totalPages}
      </button>
    );
  }

  // Next Button
  if (currentPage < totalPages) {
    pageButtons.push(
      <button
        key="next"
        onClick={() => changePage(currentPage + 1)}
        className="px-3 py-2 border rounded hover:bg-blue-600 hover:text-white"
      >
        Next
      </button>
    );
  }

  return <div className="flex flex-wrap justify-center gap-2 mt-10">{pageButtons}</div>;
};


  const startSearch = async () => {
    if (!query.trim()) return; // prevent empty queries

    setIsLoading(true);
    try {
      const { data } = await axios.get(`${apiUrl}/products/search/${query}`);
      console.log('Search result:', data);
      setData(data.products || []);
      setPages(Array.from({ length: Number(data.totalPages) }, (_, i) => i + 1))
    } catch (err) {
      console.error('Search failed:', err.message);
      setData([]);
    } finally {
      setIsLoading(false);
      setIsSearched(true);
    }
  };

  return (
    <div>
      <div className='shadow shadow-gray-400 bg-red-500'>
      <Header />
      </div>
    <div className="px-4 py-5 min-h-screen bg-gray-50">

      {/* Search Input */}
      <div className="flex mt-10 justify-center gap-4 items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
          className="w-full max-w-md border border-gray-400 focus:ring-purple-600 focus:ring-2 outline-none py-2 px-3 rounded-lg"
        />
        <button
          onClick={startSearch}
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
      {!isLoading && data.length > 0 && (
        <div>

        <div className="grid mt-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((product, id) => (
            <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="bg-white hover:scale-105 shadow-lg rounded-lg p-4 hover:shadow-xl transition cursor-pointer flex flex-col items-center"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-contain mb-3"
                />
                <div className='flex  flex-col '>
              <h3 className="text-center text-lg font-semibold">{product.name.length > 25 ? product.name.substring(0,25) + '...' : product.name}</h3>
              <div className='flex  gap-3 flex-wrap'>
              <h4 className=  'mt-3 text-left text-gray-500 font-bold'>Price: ₹{product.price}</h4>
              <h4 className=  'mt-3 text-left text-blue-600 font-bold'>{product.category}</h4>
              </div>
                </div>
            </Link>
          ))}
      
          </div>
      <div className="mt-10 flex justify-center gap-3 flex-wrap">
  {pages &&
    renderPagination()}
</div>

        </div>
      )}

      {/* No Results */}
      {!isLoading && isSearched && data.length === 0 && (
        <div className="text-center text-red-600 mt-8 text-lg">
          No products found 
        </div>
      )}
    </div>
    </div>

  );
};

export default Search;
