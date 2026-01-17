import axios from 'axios';

// Dùng biến môi trường để linh hoạt (Local thì localhost, lên mạng thì dùng link Render)
// Nếu biến môi trường không có thì mặc định về localhost:5000
// import.meta: chứa thông tin về module hiện tại
// .env: chứa các biến môi trường được định nghĩa trong file .env
// VITE_API_URL: biến tự đặt tên theo quy ước của Vite (bắt đầu bằng VITE_)
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// axios.get() hoặc axios.post() sẽ tự động sử dụng baseURL này
// Tạo một instance của axios với cấu hình mặc định
const axiosClient = axios.create({
    // Cấu hình mặc định
    baseURL: baseURL,
    // Cấu hình mặc định, trả về JSON
    headers: {
        'Content-Type': 'application/json',
    },
});

// Export để các file khác có thể dùng axiosClient này
export default axiosClient;