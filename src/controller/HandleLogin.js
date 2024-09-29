import axios from "axios";
const handleLogin = async (formData,nagivate) => {
  const { email, password } = formData;
  console.log(formData);
  try {
    console.log(1235);
    const response = await axios.post("http://localhost:7749/login", {
      email: email, // giá trị email từ input
      password: password, // giá trị mật khẩu từ input
    });
    console.log("Đăng nhập thành công:", response.data);
    nagivate("/homepage")
  } catch (error) {
    console.error(
      "Lỗi đăng nhập:",
      error.response ? error.response.data : error.message
    );
  }
};

export default handleLogin;
