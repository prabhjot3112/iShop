import { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';



function CategorySelect({ formData, setFormData  , fetchedCategory}) {
  const [options, setOptions] = useState(fetchedCategory.map(cat => ({ value: cat.name, label: cat.name })));
 
  // Handle selecting an existing option
  const handleChange = (selectedOption) => {
    setFormData({
      ...formData,
      category: selectedOption ? selectedOption.value : '',
      isUserDefinedCategory: false,
    });
  };

  // Handle creating a new category
  const handleCreate = (inputValue) => {
    const newOption = { value: inputValue, label: inputValue };
    setOptions((prev) => [...prev, newOption]);

    setFormData({
      ...formData,
      category: inputValue,
      isUserDefinedCategory: true,
    });
  };

  // Pre-select current value if any
  const selectedValue = options.find(
    (option) => option.value === formData.category
  );

  return (
    <CreatableSelect
      isClearable
      onChange={handleChange}
      onCreateOption={handleCreate}
      options={options}
      value={selectedValue || null}
      placeholder="Select or create category"
    />
  );
}

export default CategorySelect;
