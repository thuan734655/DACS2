import { useState } from "react";
import handleLogin from "../controller/HandleLogin";

const useFormData = (dataInitForm = {}) => {
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

  const handleSubmitLogin = () => {
    handleLogin(formData);
  };

  return { formData, handleChange, handleSubmit, handleSubmitLogin };
};

export default useFormData;
