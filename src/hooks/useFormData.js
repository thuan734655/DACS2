import { useState } from 'react';
import handleSignUp from '../controller/HandleSignUp';

const useFormData = (dataInitForm={}) => {
  const [formData, setFormData] = useState(dataInitForm);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitSignUp = (formData) => {
    handleSignUp(formData);
  };

  return { formData, handleChange, handleSubmitSignUp };
};

export default useFormData;
