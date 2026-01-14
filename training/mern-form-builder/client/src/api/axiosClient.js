import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:5000/api', // Đường dẫn gốc của Server
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient;