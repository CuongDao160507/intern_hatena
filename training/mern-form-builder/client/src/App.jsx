import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "./components/Sidebar";
import FormCanvas from "./components/FormCanvas";
import PropertiesPanel from "./components/PropertiesPanel";
import TopBar from "./components/TopBar"; // Import TopBar vừa tạo
import axiosClient from "./api/axiosClient"; // Import API

function App() {
  const [formElements, setFormElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);

  // --- LOGIC KÉO THẢ (Giữ nguyên) ---
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || over.id !== "canvas-droppable") return;
    const toolData = active?.data?.current;
    if (!toolData) return;

    const newElement = {
      id: uuidv4(),
      type: toolData.type,
      label: toolData.label,
      required: false,
      options:
        toolData.type === "radio" || toolData.type === "checkbox"
          ? ["Option 1", "Option 2"]
          : null,
      style: {
        width: "100%",
        borderRadius: "4px",
        borderColor: "#e5e7eb",
        borderWidth: "1px",
      },
    };
    setFormElements((prev) => [...prev, newElement]);
  };

  const updateElement = (id, key, value) => {
    setFormElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, [key]: value } : el))
    );
    if (selectedElement && selectedElement.id === id) {
      setSelectedElement((prev) => ({ ...prev, [key]: value }));
    }
  };

  // MỚI: Hàm xóa phần tử
  const deleteElement = (id) => {
    // Lọc bỏ phần tử có id tương ứng
    setFormElements((prev) => prev.filter((el) => el.id !== id));
    // Đóng bảng cài đặt vì phần tử đó đã mất
    setSelectedElement(null);
  };

  // --- TÍNH NĂNG 1: LƯU VÀO DATABASE ---
  const handleSaveForm = async () => {
    if (formElements.length === 0) {
      alert("Form đang trống, không có gì để lưu!");
      return;
    }
    try {
      // Gọi API POST /forms
      const response = await axiosClient.post("/forms", {
        title: "My Custom Form", // Sau này có thể cho user nhập tên
        elements: formElements,
      });
      console.log("Saved:", response.data);
      alert("✅ Đã lưu form thành công vào MongoDB!");
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert("❌ Lưu thất bại! Kiểm tra lại Server.");
    }
  };

  // --- TÍNH NĂNG 2: EXPORT (Tải file JSON) ---
  const handleExport = () => {
    const fileData = JSON.stringify(formElements, null, 2); // Chuyển mảng thành chuỗi JSON đẹp
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Tạo thẻ a ảo để kích hoạt tải xuống
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-form-schema.json";
    link.click();
    URL.revokeObjectURL(url); // Dọn dẹp bộ nhớ
  };

  // --- TÍNH NĂNG 3: IMPORT (Đọc file JSON) ---
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedElements = JSON.parse(event.target.result);
        if (Array.isArray(importedElements)) {
          setFormElements(importedElements);
          alert("✅ Import thành công!");
        } else {
          alert("❌ File không hợp lệ (Không phải mảng JSON)");
        }
      } catch (error) {
        alert("❌ Lỗi đọc file JSON");
      }
    };
    reader.readAsText(file);
    // Reset input để chọn lại cùng 1 file vẫn kích hoạt sự kiện
    e.target.value = null;
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-100">
        {/* THANH CÔNG CỤ TRÊN CÙNG */}
        <TopBar
          onSave={handleSaveForm}
          onExport={handleExport}
          onImport={handleImport}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Cột 1: Sidebar */}
          <Sidebar />

          {/* Cột 2: Canvas */}
          <FormCanvas
            elements={formElements}
            setSelectedElement={setSelectedElement}
            selectedId={selectedElement?.id}
          />

          {/* Cột 3: Properties */}
          {selectedElement && (
            <PropertiesPanel
              selectedElement={selectedElement}
              updateElement={updateElement}
              deleteElement={deleteElement} // <--- Truyền hàm xóa xuống
              closePanel={() => setSelectedElement(null)}
            />
          )}
        </div>
      </div>
    </DndContext>
  );
}

export default App;
