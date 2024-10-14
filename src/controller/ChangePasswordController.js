import { changePassword } from "../services/loginService";

export const HandleChangePassword = async (
    e,
    email,
    otp,
    newPassword,
    confirmPassword,
    setLoading,
    setStep
  ) => {
    e.preventDefault();
    setLoading(true);
  
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await changePassword(email, otp, newPassword);
      alert(response.data.message);
      if (typeof setStep === "function") {
        setStep(4);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };