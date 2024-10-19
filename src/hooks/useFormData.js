import HandleLoginController from "../controller/HandleLoginController";
import { useState } from 'react';
import HandleSignUpController from '../controller/HandleSignUpController';
const useFormData = (dataInitForm = {}) => {
  const [formData, setFormData] = useState(dataInitForm);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitSignUp = (formData,setStep) => {
    HandleSignUpController(formData,setStep);
  };
  const handleSubmitLogin = () => {
    HandleLoginController(formData);
  };

  return { formData, handleChange, handleSubmitSignUp, handleSubmitLogin };
};

export default useFormData;
