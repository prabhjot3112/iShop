import { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';

function CategorySelect({ formData, setFormData, fetchedCategory }) {
  // Convert fetched categories to react-select format
  const [options, setOptions] = useState(
    fetchedCategory.map((cat) => ({ value: cat.name, label: cat.name }))
  );

  // Handle selecting existing options
  const handleChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(opt => opt.value) : [];

    setFormData({
      ...formData,
      category: selectedValues,
      isUserDefinedCategory: false,
    });
  };

  // Handle creating a new option
  const handleCreate = (inputValue) => {
    const newOption = { value: inputValue, label: inputValue };
    setOptions((prev) => [...prev, newOption]);

    // Add new value to selected categories
    setFormData((prev) => ({
      ...prev,
      category: [...(prev.category || []), inputValue],
      isUserDefinedCategory: true,
    }));
  };

  // Pre-select current values
  const selectedValues = options.filter((option) =>
    formData.category?.includes(option.value)
  );

  return (
    <CreatableSelect
      isMulti
      isClearable
      onChange={handleChange}
      onCreateOption={handleCreate}
      options={options}
      value={selectedValues}
      placeholder="Select or create categories"
    />
  );
}

export default CategorySelect;
