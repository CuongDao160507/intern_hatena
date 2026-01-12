import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // File CSS trang trí giao diện

function App() {
  // Lưu dữ liệu người dùng đang nhập vào Form
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    description: "",
  });

  // Lưu danh sách contact lấy từ Database về để hiển thị ra bảng
  const [contactList, setContactList] = useState([]);

  // Lưu thông báo (Thành công/Thất bại)
  const [message, setMessage] = useState("");

  // LẤY DỮ LIỆU TỪ BACKEND
  const fetchContacts = async () => {
    try {
      // Gọi API GET của Backend (đang chạy ở port 5000)
      // deploy lên render nên đổi lại URL (https://api-cuongdao-projecttuan02.onrender.com)
      const response = await axios.get(
        "https://api-cuongdao-projecttuan02.onrender.com/api/contact"
      );
      // Backend trả về mảng dữ liệu -> Lưu vào state để React vẽ lại bảng
      setContactList(response.data);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    }
  };

  // USE EFFECT: CHẠY KHI VỪA MỞ WEB
  // Giúp tự động gọi hàm lấy dữ liệu ngay khi tải trang.
  useEffect(() => {
    fetchContacts();
  }, []);

  // XỬ LÝ KHI GÕ PHÍM (Two-way binding)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // XỬ LÝ KHI BẤM NÚT GỬI
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trình duyệt tải lại trang

    // Validate: Kiểm tra xem có bỏ trống không
    if (!formData.fullName || !formData.email || !formData.phone) {
      setMessage("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      // Gọi API POST để gửi dữ liệu xuống Backend
      await axios.post(
        "https://api-cuongdao-projecttuan02.onrender.com/api/contact",
        formData
      );

      setMessage("Gửi thành công!");

      // Reset form về rỗng để nhập người tiếp theo
      setFormData({ fullName: "", email: "", phone: "", description: "" });

      // Gọi lại hàm này để bảng cập nhật dòng mới ngay lập tức
      fetchContacts();
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi gửi dữ liệu.");
    }
  };

  // PHẦN GIAO DIỆN (JSX)
  return (
    <div className="container">
      {/* FORM ĐĂNG KÝ */}
      <div className="form-card">
        <h2>Contact Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ và tên (*)</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nhập tên của bạn..."
            />
          </div>

          <div className="form-group">
            <label>Email (*)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại (*)</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="098..."
            />
          </div>

          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nội dung chi tiết..."
            />
          </div>

          <button type="submit" className="btn-submit">
            Gửi Thông Tin
          </button>
        </form>

        {/* Hiển thị thông báo nếu có */}
        {message && <p className="message">{message}</p>}
      </div>

      {/* BẢNG HIỂN THỊ DANH SÁCH */}
      <div className="table-card">
        <h3>Contact List</h3>
        <table>
          <thead>
            <tr>
              <th>Họ Tên</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Mô tả</th>
            </tr>
          </thead>
          <tbody>
            {/* Dùng hàm map để lặp qua danh sách và in ra từng dòng */}
            {contactList.map((contact) => (
              <tr key={contact._id}>
                <td>{contact.fullName}</td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
                <td>{contact.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
