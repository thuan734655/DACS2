import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { verifyOTP } from "../services/loginService";

export const HandleVerifyOtp = async (e, email, otp, setLoading, setStep) => {
  e.preventDefault();
  setLoading(true);
  console.log('Starting OTP verification with:', { email, otp });
  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    let visitorId = result.visitorId;
    console.log('Generated visitorId:', visitorId);

    console.log('Calling verifyOTP with:', { email, otp, visitorId });
    const response = await verifyOTP(email, otp, visitorId);
    console.log('Server response:', response);
    
    alert(response.data.message);
    if (response.status === 200) {
      if (typeof setStep === "function") {
        setStep(3);
      }
    }
  } catch (error) {
    console.log('Error details:', error);
    console.log('Response data:', error.response?.data);
    console.log('Full error object:', JSON.stringify(error, null, 2));
    alert(error.response?.data?.message || "Verification failed.");
  } finally {
    setLoading(false);
  }
};