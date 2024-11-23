import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { login } from "../services/loginService";
import { auth } from "../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  // Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return passwordRegex.test(password);
};

const HandleLoginController = async (formData, navigate, setStep,setLoading) => {
  const { email, password } = formData;
  console.log(formData);
  let visitorId;

  // Validate email
  if (!isValidEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Validate password
  if (!isValidPassword(password)) {
    alert(
      "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character."
    );
    return;
  }

  try {
    setLoading(true);
    const userCredential = await signInWithEmailAndPassword(auth,email,password);
    console.log("Logged in as: ",userCredential.user);
    
    // Initialize FingerprintJS library
    const fp = await FingerprintJS.load();

    // Get fingerprint information
    const result = await fp.get();

    // Unique identifier for the device
    visitorId = result.visitorId;

    // Call login function
    const response = await login(email, password, visitorId);
    const { requires2FA, active } = response.data;
    console.log(response);
    
    if (requires2FA) {
      setStep(2);
    } else if (active) {
      setStep(4);
    } else {
      console.log("Login successful!", response);
      alert("Login successful");
      navigate("/homepage");
    }
  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed, please check your email and password again");
  } finally{
    setLoading(false);
  }
};

export default HandleLoginController;
