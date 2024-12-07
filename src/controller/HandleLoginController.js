import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { login } from "../services/loginService";
import { auth } from "../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return passwordRegex.test(password);
};

const HandleLoginController = async (formData, navigate, setStep, setLoading) => {
  const { email, password } = formData;

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

    // Firebase Authentication
    let userCredential;
    try {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in as: ", userCredential.user);
    } catch (firebaseError) {
      console.error("Firebase login error:", firebaseError);
      alert("Invalid email or password. Please try again.");
      return;
    }

    // FingerprintJS for device fingerprinting
    let visitorId;
    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      visitorId = result.visitorId;
    } catch (fingerprintError) {
      console.error("FingerprintJS error:", fingerprintError);
      alert("Unable to generate device fingerprint. Please try again later.");
      return;
    }
    
    // API login
    let response;
    try {
      response = await login(email, password,visitorId);
      console.log("full data",response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));     // Assuming `login` is an Axios call
    } catch (apiError) {
      console.error("API login error:", apiError);
      alert("Login failed. Please try again later.");
      return;
    }

    // Process API response
    const { requires2FA, active } = response.data;

    if (requires2FA) {
      setStep(2); // Step 2 for 2FA
    } else if (active) {
      setStep(4); // Step 4 for active account
    } else {
      // // Save user data to localStorage
      // localStorage.setItem("user", JSON.stringify(userData));
      // alert("Login successful!");
      // console.log("User data:", userData);

      // Navigate to homepage
      navigate("/homepage");
    }
  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed. Please check your email and password.");
  } finally {
    setLoading(false);
  }
};

export default HandleLoginController;