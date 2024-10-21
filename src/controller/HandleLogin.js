import axios from "axios";
const handleLogin = async (formData, nagivate) => {
  const { email, password } = formData;
  console.log(formData);
  try {
    console.log(1235);
    const response = await axios.post("http://localhost:7749/login", {
      email: email, // giá trị email từ input
      password: password, // giá trị mật khẩu từ input
    });
    console.log("Login successful!:", response.data);
    alert("Login successful");
    nagivate("/homepage");
  } catch (error) {
    console.error(
      "Login failed:",
      error.response ? error.response.data : error.message
    );
    alert("Login failed, please check your email and password again");

  }
};

export default handleLogin;

