import React from "react";
import { MdClose, MdDelete } from "react-icons/md";

const PropertiesPanel = ({
  selectedElement,
  updateElement,
  closePanel,
  deleteElement,
}) => {
  if (!selectedElement) return null;

  // Hàm xử lý khi thay đổi các trường cơ bản (Label, Required...)
  const handleLabelChange = (e) => {
    updateElement(selectedElement.id, "label", e.target.value);
  };

  // Hàm xử lý khi thay đổi Style (Màu, Border...)
  const handleStyleChange = (key, value) => {
    const newStyle = { ...selectedElement.style, [key]: value };
    updateElement(selectedElement.id, "style", newStyle);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-screen shadow-xl p-5 flex flex-col fixed right-0 top-0 z-20 overflow-y-auto">
      {/* Tiêu đề & Nút tắt */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Cài đặt</h2>
        <button
          onClick={closePanel}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <MdClose className="text-xl" />
        </button>
      </div>

      {/* 1. Sửa Nhãn (Label) */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tên nhãn (Label)
        </label>
        <input
          type="text"
          value={selectedElement.label}
          onChange={handleLabelChange}
          className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
        />
      </div>

      <hr className="my-4 border-gray-100" />

      {/* 2. Sửa Màu viền */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Màu viền (Border Color)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={selectedElement.style?.borderColor || "#e5e7eb"}
            onChange={(e) => handleStyleChange("borderColor", e.target.value)}
            className="w-10 h-10 p-0 border-0 rounded cursor-pointer"
          />
          <span className="text-gray-500 text-sm">
            {selectedElement.style?.borderColor}
          </span>
        </div>
      </div>

      {/* 3. Sửa Bo góc (Border Radius) */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Bo góc: {parseInt(selectedElement.style?.borderRadius || 0)}px
        </label>
        <input
          type="range"
          min="0"
          max="20"
          value={parseInt(selectedElement.style?.borderRadius || 0)}
          onChange={(e) =>
            handleStyleChange("borderRadius", `${e.target.value}px`)
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* 4. Sửa Độ rộng (Width) */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Độ rộng
        </label>
        <select
          value={selectedElement.style?.width || "100%"}
          onChange={(e) => handleStyleChange("width", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="100%">100% (Full)</option>
          <option value="50%">50% (Một nửa)</option>
          <option value="33%">33% (Một phần ba)</option>
        </select>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-100">
        <button
          onClick={() => deleteElement(selectedElement.id)}
          className="w-full flex items-center justify-center gap-2 p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium"
        >
          <MdDelete className="text-xl" />
          Xóa phần tử này
        </button>
      </div>
    </div>
  );
};

export default PropertiesPanel;
