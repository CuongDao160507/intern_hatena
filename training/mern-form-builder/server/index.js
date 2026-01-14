const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Import kết nối DB
const formRoutes = require('./routes/formRoutes'); // Import routes
require('dotenv').config(); // Load biến môi trường

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Cấu hình middleware
app.use(cors());
app.use(express.json());

// 2. Kết nối Database
connectDB();

// 3. Định nghĩa Routes
app.use('/api/forms', formRoutes);

// 4. Chạy Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});