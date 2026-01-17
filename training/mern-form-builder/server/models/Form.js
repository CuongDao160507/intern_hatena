const mongoose = require('mongoose'); // Import mongoose (giao tiếp bằng dữ liệu thô JSON)

const FormSchema = new mongoose.Schema({
    title: { type: String, default: "Untitled Form" },
    elements: { type: Array, default: [] },
}, { timestamps: true });
// Tác dụng: Nó tự động tạo thêm 2 trường trong Database:
// createdAt: Ngày giờ tạo form.
// updatedAt: Ngày giờ sửa form lần cuối.

module.exports = mongoose.model('Form', FormSchema); 