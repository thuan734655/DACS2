import axios from "axios";

const handleForgotten = async (e, formData) => {
  const { email } = formData;
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:7749/forgotten", {
      email,
    });
    console.log(response.data.message);
    alert("Password reset email sent. Please check your mailbox.");
  } catch (error) {
    console.log(
      "Error sending password reset request:",
      error.response ? error.response.data : error.message
    );
    alert("Error sending password reset request");
  }
};
export default handleForgotten;
