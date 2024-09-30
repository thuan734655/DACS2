import axios from "axios";

const handleLogin = async (formData, navigate) => {
  const { email, password } = formData;
  console.log(formData);

  try {
    // Lấy địa chỉ IP của thiết bị
    const ipResponse = await axios.get("https://api.ipify.org?format=json");
    const userIP = ipResponse.data.ip; // Lấy địa chỉ IP từ phản hồi

    // Gửi thông tin đăng nhập cùng với địa chỉ IP
    const response = await axios.post("http://localhost:7749/login", {
      email: email,
      password: password,
      ip: userIP, // Gửi địa chỉ IP cùng với thông tin đăng nhập
    });
    
    console.log("Login successful!:", response.data);
    const {is2FA} = response.data;
    alert("Login successful" + is2FA);
    navigate("/homepage");
  } catch (error) {
    console.error(
      "Login failed:",
      error.response ? error.response.data : error.message
    );
    alert("Login failed, please check your email and password again");
  }
};

export default handleLogin;
