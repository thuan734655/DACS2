import axios from "axios";

const handleSignUp = async (formData) => {
  const { day, month, year, gender, firstname, lastname, email, password } =
    formData;

  // Trim whitespace from fullName
  const fullName = `${firstname} ${lastname}`.trim();

  // Validation checks
  if (!fullName) {
    console.error("Full name is required.");
    return;
  }

  // Regular expression for validating an email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
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

  try {
    const res = await axios.post("http://localhost:7749/signup", {
      email,
      password,
      day,
      month,
      year,
      fullName,
      gender,
    });

    console.log("Sign up successful:", res.data);
    // Navigate to homepage if needed
    // navigate("/homepage");
  } catch (error) {
    console.error(
      "Sign up error:",
      error.response ? error.response.data : error.message
    );
  }
};

export default handleSignUp;
