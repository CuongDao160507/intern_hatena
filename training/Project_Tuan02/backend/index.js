// Khai báo các thư viện
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware (Cấu hình)
app.use(cors()); // Cho phép Frontend gọi API
app.use(express.json()); // Cho phép đọc dữ liệu JSON gửi lên từ Frontend

// Kết nối MongoDB
mongoose.connect('mongodb+srv://cuongDao1605:160507@projecttuan02.8w8n109.mongodb.net/?appName=projectTuan02')
    .then(() => console.log("Đã kết nối MongoDB thành công!"))
    .catch(err => console.log("Lỗi kết nối:", err));

// Tạo Schema (Cấu trúc bảng dữ liệu) 
const ContactSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    description: { type: String }
});

// Tạo Model từ Schema
const ContactModel = mongoose.model('Contact', ContactSchema);

// Tạo API (Điểm nhận yêu cầu từ Frontend)
// Method: POST, Route: /api/contact
app.post('/api/contact', async (req, res) => {
    try {
        const { fullName, email, phone, description } = req.body;

        // Validate dữ liệu cơ bản ở Backend
        if (!fullName || !email || !phone) {
            return res.status(400).json({ message: "Vui lòng điền đủ thông tin!" });
        }

        // Lưu vào Database
        const newContact = new ContactModel({ fullName, email, phone, description });
        await newContact.save();

        res.status(201).json({ message: "Gửi liên hệ thành công!", data: newContact });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
});

// API: Lấy toàn bộ danh sách liên hệ (GET)
app.get('/api/contact', async (req, res) => {
    try {
        // Lấy tất cả dữ liệu từ Mongo, sắp xếp cái mới nhất lên đầu
        const contacts = await ContactModel.find().sort({ _id: -1 });
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy dữ liệu", error });
    }
});

// Chạy Server
app.listen(5000, () => {
    console.log("Server đang chạy tại port 5000");
});