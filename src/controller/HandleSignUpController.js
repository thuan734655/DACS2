import { signUp } from "../services/loginService";
import { auth } from "../config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

const HandleSignUpController = async (formData, setStep, setLoading) => {
  const { email, day, month, year, gender, firstname, lastname, password } =
    formData;

  // Trim whitespace from fullName
  const fullName = `${firstname} ${lastname}`.trim();

  // Validation checks
  if (!fullName) {
    console.error("Full name is required.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    console.error("A valid email is required.");
    return;
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!password || !passwordRegex.test(password)) {
    console.error(
      "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character."
    );
    return;
  }

  if (gender !== "Male" && gender !== "Female") {
    console.error("Gender must be 'Male' or 'Female'.");
    return;
  }

  if (!day || !month || !year) {
    console.error("Date of birth is required.");
    return;
  }

  // Prepare data for API call
  const data = {
    email: email,
    password,
    day,
    month,
    year,
    fullName,
    gender,
  };

  try {
    setLoading(true);

    // Firebase user creation
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Send email verification
    await sendEmailVerification(user);

    alert("Registration successful! Please check your email for verification.");
    console.log("Registered as:", userCredential.user);

    // Call signUp function to store additional user data
    const res = await signUp(data);

    if (res.success === true) {
      setStep(2);
    } else {
      console.error("Sign up failed:", res.status);
      alert("There was an error with your sign-up. Please try again.");
    }
  } catch (error) {
    console.error("Sign up error:", error);
    if (error.code === "auth/email-already-in-use") {
      alert("This email is already registered.");
    } else if (error.code === "auth/invalid-email") {
      alert("Invalid email format.");
    } else if (error.code === "auth/weak-password") {
      alert("Password should be at least 6 characters.");
    } else {
      alert(`Error: ${error.message}`);
    }
  } finally {
    setLoading(false); // Stop loading when done
  }
};

export default HandleSignUpController;
