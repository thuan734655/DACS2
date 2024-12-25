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

const HandleLoginController = async (
  formData,
  navigate,
  setStep,
  setLoading
) => {
  const { email, password } = formData;

  // Validate email
  if (!isValidEmail(email)) {
    alert("Vui lòng nhập địa chỉ email hợp lệ.");
    return;
  }

  // Validate password
  if (!isValidPassword(password)) {
    alert(
      "Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất một chữ thường, một chữ hoa, một số và một ký tự đặc biệt."
    );
    return;
  }

  try {
    setLoading(true);

    // Firebase Authentication
    let userCredential;
    try {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Đã đăng nhập với tài khoản: ", userCredential.user);
    } catch (firebaseError) {
      console.error("Lỗi đăng nhập Firebase:", firebaseError);
      alert("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
      return;
    }

    // FingerprintJS for device fingerprinting
    let visitorId;
    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      visitorId = result.visitorId;
    } catch (fingerprintError) {
      console.error("Lỗi FingerprintJS:", fingerprintError);
      alert("Không thể tạo mã thiết bị. Vui lòng thử lại sau.");
      return;
    }

    // API login
    let response;
    try {
      response = await login(email, password, visitorId);
      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data.user || {
            fullName: "Người dùng",
            avatar: "",
            background: "",
            idUser: "",
          }
        )
      );
    } catch (apiError) {
      console.error("Lỗi đăng nhập API:", apiError);
      alert("Đăng nhập thất bại. Vui lòng thử lại sau.");
      return;
    }

    // Process API response
    const { requires2FA, active, user } = response.data;
    console.log(user, "user");
    if (requires2FA) {
      alert("Vui lòng xác thực 2FA!");
      setStep(2);
    } else if (active) {
      alert("Vui lòng xác thực tài khoản!");
      setStep(2); 
    } else {
      navigate("/homepage");
    }
  } catch (error) {
    console.error("Đăng nhập thất bại:", error);
    alert("Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.");
  } finally {
    setLoading(false);
  }
};

export default HandleLoginController;
