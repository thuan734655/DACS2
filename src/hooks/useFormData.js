import { useState } from 'react';
import a from '../controller/HandleLogin';

const useFormData = (dataInitForm={}) => {
  const [formData, setFormData] = useState(dataInitForm);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return { formData, handleChange, handleSubmit };
};

export default useFormData;
