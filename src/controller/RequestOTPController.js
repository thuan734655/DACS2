import { requestOTP } from "../services/loginService";

export const HandleRequestOtp = async (e, email, setLoading, setStep) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await requestOTP(email);
    alert(response.data.message);
    if (typeof setStep === "function") {
      setStep(2);
    }
  } catch (error) {
    alert(error.response?.data?.message || "Request failed.");
  } finally {
    setLoading(false);
  }
};
