import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { login } from "../services/loginService";

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  // Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return passwordRegex.test(password);
};

const HandleLoginController = async (formData, navigate) => {
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
    // Khởi tạo thư viện FingerprintJS
    const fp = await FingerprintJS.load();

    // Lấy thông tin fingerprint
    const result = await fp.get();

    // Mã định danh duy nhất cho thiết bị
    visitorId = result.visitorId;

    // Gọi hàm login
    const response = await login(email, password, visitorId);
    console.log(response.data.is2FA
      
    );
    if (response.data.is2FA === true) {
      // Xử lý yêu cầu xác thực 2 yếu tố
      console.log("Two-factor authentication is required.");
      // Hiện thị giao diện xác thực OTP
      // Bạn có thể thêm logic để hiển thị VerifyOtp component ở đây
    } else {
      console.log("Login successful!", response);
      alert("Login successful");
      navigate("/homepage");
    }
  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed, please check your email and password again");
  }
};

export default HandleLoginController;
