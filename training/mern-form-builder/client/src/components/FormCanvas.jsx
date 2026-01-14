import React from "react";
import { useDroppable } from "@dnd-kit/core";

// Component con hiển thị từng ô
const FormElement = ({ element, onSelect, isSelected }) => {
  // Style chung cho wrapper: Nếu được chọn thì viền màu xanh dương đậm
  const wrapperStyle = `p-4 mb-3 border rounded cursor-pointer transition-all group relative ${
    isSelected
      ? "border-blue-600 ring-2 ring-blue-200 bg-blue-50"
      : "border-gray-300 bg-white hover:border-blue-400"
  }`;

  // Logic render input (Giữ nguyên, chỉ gắn thêm style động)
  const renderInput = () => {
    // Style động từ dữ liệu element.style
    const inputStyle = {
      width: "100%", // Mặc định full, width thật sẽ do wrapper quản lý
      borderRadius: element.style?.borderRadius,
      borderColor: element.style?.borderColor,
      borderWidth: "1px",
      borderStyle: "solid",
      padding: "8px",
    };

    switch (element.type) {
      case "textarea":
        return (
          <textarea
            className="bg-gray-50 resize-none"
            rows={3}
            style={inputStyle}
            disabled
          />
        );
      case "radio":
      case "checkbox":
        return (
          <div
            className="flex flex-col gap-2 p-2 border border-transparent"
            style={{
              borderColor: element.style?.borderColor,
              borderRadius: element.style?.borderRadius,
              borderStyle: "solid",
              borderWidth: "1px",
            }}
          >
            {element.options?.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type={element.type} disabled /> <span>{opt}</span>
              </div>
            ))}
          </div>
        );
      default:
        return <input className="bg-gray-50" style={inputStyle} disabled />;
    }
  };

  return (
    // Khi click vào div này -> gọi hàm onSelect
    <div
      className={wrapperStyle}
      onClick={(e) => {
        e.stopPropagation(); // Ngăn sự kiện lan ra ngoài
        onSelect(element);
      }}
      style={{ width: element.style?.width }} // Độ rộng của cả ô
    >
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {element.label}
      </label>
      {renderInput()}
    </div>
  );
};

// Component chính
const FormCanvas = ({ elements, setSelectedElement, selectedId }) => {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas-droppable" });

  return (
    <div
      className="flex-1 p-8 h-screen overflow-y-auto"
      onClick={() => setSelectedElement(null)}
    >
      <div className="max-w-3xl mx-auto bg-white min-h-[600px] p-8 shadow-lg rounded-xl border border-gray-300">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 pb-4 border-b">
          Untitled Form
        </h1>

        <div
          ref={setNodeRef}
          className={`min-h-[400px] rounded-lg p-4 transition-colors ${
            isOver ? "bg-blue-50 border-2 border-blue-400 border-dashed" : ""
          }`}
        >
          {elements.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg py-20">
              <p>Kéo phần tử vào đây</p>
            </div>
          ) : (
            elements.map((el) => (
              <FormElement
                key={el.id}
                element={el}
                onSelect={setSelectedElement}
                isSelected={selectedId === el.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FormCanvas;
