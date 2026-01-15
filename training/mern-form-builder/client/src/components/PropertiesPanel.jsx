import React from "react";
import { MdClose, MdDelete, MdAdd } from "react-icons/md";

const PropertiesPanel = ({
  selectedElement,
  updateElement,
  deleteElement,
  closePanel,
}) => {
  if (!selectedElement) return null;

  const handleStyleChange = (key, value) => {
    const newStyle = { ...selectedElement.style, [key]: value };
    updateElement(selectedElement.id, "style", newStyle);
  };

  // Logic Options (Radio/Checkbox)
  const handleOptionChange = (index, value) => {
    const newOptions = [...selectedElement.options];
    newOptions[index] = value;
    updateElement(selectedElement.id, "options", newOptions);
  };

  const addOption = () => {
    const newOptions = [...(selectedElement.options || []), `New Option`];
    updateElement(selectedElement.id, "options", newOptions);
  };

  const removeOption = (index) => {
    const newOptions = selectedElement.options.filter((_, i) => i !== index);
    updateElement(selectedElement.id, "options", newOptions);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-screen shadow-xl p-5 flex flex-col fixed right-0 top-0 z-20 overflow-y-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Cài đặt</h2>
        <button
          onClick={closePanel}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <MdClose className="text-xl" />
        </button>
      </div>

      {/* 1. Tên nhãn (Label) */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tên nhãn (Label)
        </label>
        <input
          type="text"
          value={selectedElement.label}
          onChange={(e) =>
            updateElement(selectedElement.id, "label", e.target.value)
          }
          className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* 2. MỚI: Tùy chỉnh Placeholder (Văn bản gợi ý) */}
      {/* Chỉ hiện với các ô nhập liệu, không hiện với Radio/Checkbox */}
      {!["radio", "checkbox"].includes(selectedElement.type) && (
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Văn bản gợi ý (Placeholder)
          </label>
          <input
            type="text"
            value={selectedElement.placeholder || ""}
            onChange={(e) =>
              updateElement(selectedElement.id, "placeholder", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
            placeholder="Ví dụ: Nhập tên của bạn..."
          />
        </div>
      )}

      {/* 3. Logic Options (Radio/Checkbox) */}
      {(selectedElement.type === "radio" ||
        selectedElement.type === "checkbox") && (
        <div className="mb-5 border-t border-b border-gray-100 py-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Các lựa chọn
          </label>
          <div className="flex flex-col gap-2">
            {selectedElement.options?.map((opt, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={opt}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 p-1 px-2 border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={() => removeOption(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <MdClose />
                </button>
              </div>
            ))}
            <button
              onClick={addOption}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mt-1"
            >
              <MdAdd /> Thêm lựa chọn
            </button>
          </div>
        </div>
      )}

      <hr className="my-4 border-gray-100" />

      {/* 4. Màu viền */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Màu viền
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={selectedElement.style?.borderColor || "#e5e7eb"}
            onChange={(e) => handleStyleChange("borderColor", e.target.value)}
            className="w-10 h-10 p-0 border-0 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* 5. KHÔI PHỤC: Bo góc (Border Radius) */}
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

      {/* 6. KHÔI PHỤC: Độ rộng (Width) */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Độ rộng
        </label>
        <select
          value={selectedElement.style?.width || "100%"}
          onChange={(e) => handleStyleChange("width", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none"
        >
          <option value="100%">100% (Toàn dòng)</option>
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
