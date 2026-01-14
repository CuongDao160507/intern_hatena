import axios from 'axios';

// Dùng biến môi trường để linh hoạt (Local thì localhost, lên mạng thì dùng link Render)
// Hoặc paste thẳng link Render vào đây nếu lười cấu hình
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosClient = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient;