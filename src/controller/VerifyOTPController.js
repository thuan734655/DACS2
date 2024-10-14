import { verifyOTP } from "../services/loginService";

export const HandleVerifyOtp = async (e, email, otp, setLoading, setStep) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await verifyOTP(email, otp);
      alert(response.data.message);
      if (typeof setStep === "function") {
        setStep(3);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };