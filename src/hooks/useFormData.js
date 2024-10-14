import HandleLoginController from "../controller/HandleLoginController";
import { useState } from "react";
import HandleSignUpController from "../controller/HandleSignUpController";
const useFormData = (dataInitForm = {}) => {
  const [formData, setFormData] = useState(dataInitForm);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitSignUp = (formData) => {
    HandleSignUpController(formData);
  };
  const handleSubmitLogin = (formData,navigate) => {
    console.log(JSON.stringify( formData, null, 2)); 
    HandleLoginController(formData,navigate)
  };

  return { formData, handleChange, handleSubmitSignUp, handleSubmitLogin };
};

export default useFormData;
