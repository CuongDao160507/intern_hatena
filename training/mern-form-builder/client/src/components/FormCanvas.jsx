import React from "react";
import { useDroppable } from "@dnd-kit/core";
// Đổi strategy sang rectSortingStrategy để hỗ trợ Grid (ngang + dọc)
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";

const SortableFormElement = ({ element, onSelect, isSelected }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: element.id,
    data: { ...element, isSortable: true },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  // --- STYLE QUAN TRỌNG ĐỂ CHIA CỘT ---
  // 1. Dùng padding (p-2) để tạo khoảng cách giữa các ô thay vì margin
  // 2. Border và Background chuyển vào thẻ div con bên trong
  const wrapperClass = `p-2 transition-all relative group outline-none`;

  // Style cho cái hộp nội dung bên trong
  const innerCardClass = `h-full border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all bg-white ${
    isSelected
      ? "border-blue-600 ring-2 ring-blue-200"
      : "border-gray-300 hover:border-blue-400"
  }`;

  const inputStyle = {
    width: "100%",
    borderRadius: element.style?.borderRadius,
    borderColor: element.style?.borderColor,
    borderWidth: "1px",
    borderStyle: "solid",
    padding: "8px",
  };

  const renderInput = () => {
    switch (element.type) {
      case "textarea":
        return (
          <textarea
            className="bg-gray-50 resize-none w-full"
            rows={3}
            style={inputStyle}
            disabled
            placeholder={element.placeholder}
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
        return (
          <input
            type={element.type === "password" ? "password" : "text"}
            className="bg-gray-50 w-full"
            style={inputStyle}
            disabled
            placeholder={element.placeholder}
          />
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      // Style width nằm ở wrapper bên ngoài để chia cột
      style={{ ...style, width: element.style?.width || "100%" }}
      className={wrapperClass}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(element);
      }}
    >
      <div className={innerCardClass}>
        {/* HEADER KÉO THẢ */}
        <div
          {...attributes}
          {...listeners}
          className="bg-gray-100 p-2 flex items-center gap-2 cursor-move border-b border-gray-200 hover:bg-gray-200"
          title="Giữ chuột để kéo"
        >
          <MdDragIndicator className="text-gray-500" size={20} />
          <label className="text-sm font-bold text-gray-700 cursor-pointer flex-1 truncate select-none">
            {element.label}{" "}
            {element.required && <span className="text-red-500">*</span>}
          </label>
        </div>

        {/* NỘI DUNG FORM */}
        <div className="p-4">{renderInput()}</div>
      </div>
    </div>
  );
};

const FormCanvas = ({
  elements,
  title,
  setTitle,
  setSelectedElement,
  selectedId,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas-droppable" });

  return (
    <div
      className="flex-1 p-8 bg-gray-100 h-full overflow-y-auto"
      onClick={() => setSelectedElement(null)}
    >
      <div className="max-w-4xl mx-auto bg-white min-h-[700px] p-8 shadow-lg rounded-xl border border-gray-300">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-bold text-gray-800 w-full border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors bg-transparent"
            placeholder="Nhập tên Form..."
          />
          <p className="text-gray-500 mt-2">Kéo thả để sắp xếp vị trí</p>
        </div>

        <div
          ref={setNodeRef}
          // --- THÊM flex flex-wrap content-start ĐỂ CÁC Ô TỰ DỒN LÊN ---
          className={`min-h-[400px] rounded-lg p-2 transition-colors flex flex-wrap content-start ${
            isOver ? "bg-blue-50 border-2 border-blue-400 border-dashed" : ""
          }`}
        >
          {/* Đổi sang rectSortingStrategy (chiến thuật sắp xếp lưới 2D) */}
          <SortableContext
            items={elements.map((el) => el.id)}
            strategy={rectSortingStrategy}
          >
            {elements.length === 0 ? (
              <div className="w-full h-60 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                <p>Chưa có phần tử nào</p>
              </div>
            ) : (
              elements.map((el) => (
                <SortableFormElement
                  key={el.id}
                  element={el}
                  onSelect={setSelectedElement}
                  isSelected={selectedId === el.id}
                />
              ))
            )}
          </SortableContext>
        </div>
      </div>
    </div>
  );
};

export default FormCanvas;
