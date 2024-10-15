
import { signUp } from "../services/loginService";

const HandleSignUpController = async (formData) => {
  const { day, month, year, gender, firstname, lastname, password } = formData;

  // Trim whitespace from fullName
  const fullName = `${firstname} ${lastname}`.trim();

  // Validation checks
  if (!fullName) {
    console.error("Full name is required.");
    return;
  }

  // Regular expression for validating an email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formData.email || !emailRegex.test(formData.email)) {
    console.error("A valid email is required.");
    return;
  }

  // Updated Password validation regex
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

  // Convert day, month, and year to integers
  const dayInt = parseInt(day, 10);
  const monthInt = parseInt(month, 10);
  const yearInt = parseInt(year, 10);

  // Check valid month range
  if (monthInt < 1 || monthInt > 12) {
    console.error("Month must be between 1 and 12.");
    return;
  }

  // Check valid day range for the given month
  const daysInMonth = new Date(yearInt, monthInt, 0).getDate();
  if (dayInt < 1 || dayInt > daysInMonth) {
    console.error(
      `Day must be between 1 and ${daysInMonth} for month ${monthInt}.`
    );
    return;
  }

  // Example year validation (optional)
  const currentYear = new Date().getFullYear();
  if (yearInt < 1890 || yearInt > currentYear) {
    console.error(
      "Year must be a valid year (e.g., between 1900 and the current year)."
    );
    return;
  }

  // Prepare data for API call
  const data = {
    email: formData.email,
    password,
    day,
    month,
    year,
    fullName,
    gender,
  };

  try {
    const res = await signUp(data);
    console.log("Sign up successful:", res);

    document.querySelector(".box-signUp").style.display = "none";
  } catch (error) {
    console.error("Sign up error:", error);
  }
};

export default HandleSignUpController;
