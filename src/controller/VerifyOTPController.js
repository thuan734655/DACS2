import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { verifyOTP } from "../services/loginService";

export const HandleVerifyOtp = async (e, email, otp, setLoading, setStep) => {
  e.preventDefault();
  setLoading(true);
  try {
    const fp = await FingerprintJS.load();

    const result = await fp.get();

   let visitorId = result.visitorId;

    const response = await verifyOTP(email, otp,visitorId);
    alert(response.data.message);
    if (response.status === 200) {
      if (typeof setStep === "function") {
        setStep(3);
      }
    }
  } catch (error) {
    alert(error.response?.data?.message || "Verification failed.");
  } finally {
    setLoading(false);
  }
};
