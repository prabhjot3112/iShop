import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { FaCross, FaTimes, FaUpload } from 'react-icons/fa';
import CategorySelect from '../../components/CategorySelect';
const BASE_URL = import.meta.env.VITE_API_URL

const AddProducts = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: [],
    image: null,
    isUserDefinedCategory:false
  });
  const [isPageLoading, setIsPageLoading] = useState(true);
const [fetchedCategory, setFetchedCategory] = useState([])


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsPageLoading(true)
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/product/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const categories = response.data.categories;
        console.log('res is: ',response.data[0].name)
        setFetchedCategory(response.data)
        // Process categories if needed
      } catch (error) {
        console.error('Error fetching categories:', error);
      }finally{
        setIsPageLoading(false)
      }
    };
      fetchCategories();
   
  
    return () => {
      
    }
  }, [])
  

  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files[0];
      console.log('file is:',file)
      if (file) {
        setFormData((prev) => ({
          ...prev,
          image: file,
        }));
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
    toast.error("Please select a product image.");
    return;
  }
    setIsLoading(true);

console.log('user defined:' , formData.isUserDefinedCategory)
console.log('formdata:',formData)
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('stock', formData.stock);
      data.append('category', formData.category);
      data.append('image', formData.image);
      data.append('isUserDefinedCategory', formData.isUserDefinedCategory);
        const token = localStorage.getItem('token')
      const data1 = await axios.post(`${BASE_URL}/products/add` , data, {
       headers:{
        Authorization:`Bearer ${token}`
       }     
      })
      toast.success('Product Added Successfully')
      setFormData({
          name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null,
      })
      setImagePreview(null)
    } catch (error) {   
          const errors = error.response?.data?.errors;
    if(errors){
    if (Array.isArray(errors)) {
      errors.forEach(err => toast.error(err.msg));
    } 
    }else{
      toast.error(error.response.data.error)
    }
        }finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />

    { isPageLoading ? <div className='w-full flex justify-center mt-10'>
      <div className='w-14 h-14 rounded-full animate-spin border border-t-transparent border-blue-700'></div>
    </div> :   <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-gray-700 mb-4">Product Image</label>
            <input
              name="image"
              type="file"
              id='file-upload'
              accept="image/*"
              onChange={handleChange}
              
              className="hidden"
            />
        {!imagePreview &&   <label
  htmlFor="file-upload"
  className="cursor-pointer w-32 h-32 flex items-center justify-center mt-5 border-2 border-dashed border-blue-500 rounded-full hover:bg-gray-100 transition"
>
    <FaUpload className="text-xl text-blue-500 mr-2" />
  Upload
</label>}


            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                <FaTimes className='text-red-500 mb-2 text-lg cursor-pointer' onClick={() => {
                  setImagePreview(null)
                }} />
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-64 object-contain rounded-md border"
                />
              </div>
            )}
          </div>

           <div>
            <label className="block text-gray-700">Product Name</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. iPhone 14 Pro"
            />
          </div>

          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Product description..."
              rows="4"
            />
          </div>

          <div>
            <label className="block text-gray-700">Price (₹)</label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 299"
            />
          </div>
           <div>
            <label className="block text-gray-700">Stock</label>
            <input
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 50"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Category</label>
            <CategorySelect formData={formData} setFormData={setFormData}  fetchedCategory={fetchedCategory}/>
          </div>


          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Add Product'
            )}
          </button>
        </form>
      </div>}
    </div>
  );
};

export default AddProducts;
