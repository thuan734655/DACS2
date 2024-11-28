import axios from "axios";

const handleSetInfo = async (email, password) => {
    try {
        // Gửi yêu cầu POST đến API
        const response = await axios.post("http://localhost:5000/set-info", {
            email,
            password
        });

        // Lấy dữ liệu phản hồi từ server
        const data = response.data;

        // Nếu phản hồi thành công, thực hiện các hành động tiếp theo
        if (response.status === 200) {
            // Ví dụ: xử lý dữ liệu hoặc cập nhật state
            console.log('Thông tin đã được cập nhật:', data);
        }
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Lỗi trong quá trình gửi thông tin:', error);
    }
};

export default handleSetInfo;
