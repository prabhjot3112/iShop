import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { FaCross, FaTimes, FaUpload } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_API_URL
import CreatableSelect from 'react-select/creatable';





function CategorySelect({
  fetchedCategory = [],
  formData,
  setFormData,
  setHasChanges,
  isFormChanged,
  originalFormData,
}) {
  const [options, setOptions] = useState(fetchedCategory.map((cat) => ({
    value: cat.name,
    label: cat.name,
  })));
  console.log('fetchedCategory in edit is:',fetchedCategory)

  // Handle existing category change
  const handleChange = (selectedOption) => {
    const newCategory = selectedOption ? selectedOption.value : '';
    const newFormData = {
      ...formData,
      category: newCategory,
      isUserDefinedCategory: false,
    };

    setFormData(newFormData);
    if (setHasChanges && isFormChanged && originalFormData) {
      setHasChanges(isFormChanged(newFormData, originalFormData));
    }
  };

  // Handle custom category creation
  const handleCreate = (inputValue) => {
    const newOption = { value: inputValue, label: inputValue };

    setOptions((prev) => {
      const exists = prev.find((opt) => opt.value === inputValue);
      return exists ? prev : [...prev, newOption];
    });

    const newFormData = {
      ...formData,
      category: inputValue,
      isUserDefinedCategory: true,
    };

    setFormData(newFormData);
    if (setHasChanges && isFormChanged && originalFormData) {
      setHasChanges(isFormChanged(newFormData, originalFormData));
    }
  };

  // Preselect the current value
  const selectedOption = options.find(
    (opt) => opt.value === formData.category
  ) || null;

  return (
    <CreatableSelect
      isClearable
      value={selectedOption}
      onChange={handleChange}
      onCreateOption={handleCreate}
      options={options}
      placeholder="Select or create category"
    />
  );
}







const EditProduct = () => {
    const {id} = useParams()
    const [originalFormData, setOriginalFormData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null,
  });
const token = localStorage.getItem('token')
const [fetchedCategory, setFetchedCategory] = useState([])
  useEffect(() => {
    ;(async()=>{
      try {
        setIsPageLoading(true)
        const {data} = await axios.get(`${BASE_URL}/products/product/${id}`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        })
        const response = await axios.get(`${BASE_URL}/product/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('res is: ',response.data)
        setFetchedCategory(response.data)
        console.log('data is edit:',data)
        setFormData(data.product)
        setOriginalFormData(data.product)
        setImagePreview(data.product.image)
      } catch (error) {
        console.log('ok:',error)
        if(error.message == 'Network Error'){
          toast.error(error.message)
        }else toast.error(error.response.data.error)
      }finally{
        setIsPageLoading(false)
      }

    })()
  
    return () => {
      
    }
  }, [])
  const [isPageLoading, setIsPageLoading] = useState(true)
  
  const isFormChanged = (newData, originalData) => {
  if (!originalData) return false;

  for (const key in newData) {
    if (key === 'image') continue; // We'll compare image separately
    if (String(newData[key]).trim() !== String(originalData[key]).trim()) {
      return true;
    }
  }

  // Compare image only if new file is uploaded
  if (newData.image && typeof newData.image === 'object') {
    return true;
  }

  return false;
};


  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
const [hasChanges, setHasChanges] = useState(false)
  const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (name === 'image') {
    const file = files[0];
    if (file) {
      const newFormData = {
        ...formData,
        image: file,
      };
      setFormData(newFormData);
      setImagePreview(URL.createObjectURL(file));
      setHasChanges(isFormChanged(newFormData, originalFormData));
    }
  } else {
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);
    setHasChanges(isFormChanged(newFormData, originalFormData));
  }
};


  const navigate = useNavigate()
const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('stock', formData.stock);
      data.append('category', formData.category);
      data.append('image', formData.image);
        const token = localStorage.getItem('token')
      const data1 = await axios.put(`${BASE_URL}/products/update/${id}` , data, {
       headers:{
        Authorization:`Bearer ${token}`
       }     
      })
      toast.success('Product Updated Successfully')
      setFormData({
          name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null,
      })
      setHasChanges(false);
setOriginalFormData(null); // Reset baseline after update
      setImagePreview(null)
      navigate('/vendor/products')
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error occured: ${error.response.data.error} `)
     
    } finally {
      setIsLoading(false);
      setIsPageLoading(false)
    }
  };

  return (
    <div>
      <Header />
      <ToastContainer />
{isPageLoading ? <div className='mt-10 flex justify-center items-center '>
  <div className='w-14 h-14 rounded-full border border-t-transparent border-b-blue-600 animate-spin'></div>
</div> :
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Product</h2>

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
setHasChanges(isFormChanged({ ...formData, image: null }, originalFormData));
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
              defaultValue={formData.name}
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
              defaultValue={formData.description}
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
              defaultValue={formData.price}
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
              defaultValue={formData.stock}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 50"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700">Category</label>
           <CategorySelect
  formData={formData}
  setFormData={setFormData}
  setHasChanges={setHasChanges}
  isFormChanged={isFormChanged}
  originalFormData={originalFormData}
  fetchedCategory={fetchedCategory}
/>


         </div>


          {/* Submit button */}
         <button
  type="submit"
  className="w-full bg-blue-600 text-white py-2 cursor-pointer rounded-md hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-50"
  disabled={isLoading || !hasChanges}
>
  {isLoading ? (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  ) : (
    'Submit'
  )}
</button>

        </form>
      </div>
}
    </div>
  );
};

export default EditProduct;
