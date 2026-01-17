import React from "react";

// Hook dùng để tạo vùng thả (droppable)
import { useDroppable } from "@dnd-kit/core";

// Đổi strategy sang rectSortingStrategy để hỗ trợ Grid (ngang + dọc)
import {
  SortableContext, //Quản lý danh sách các vật thể có thể sắp xếp
  rectSortingStrategy, //sắp xếp theo dạng hình học
  useSortable, //Hook biến một phần tử con thành vật có thể "Kéo" và "Sắp xếp"
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities"; // Hàm giúp chuyển đổi toạ độ thành CSS

// Import các icon từ react-icons (material)
import { MdDragIndicator } from "react-icons/md";

const SortableFormElement = ({ element, onSelect, isSelected }) => {
  const {
    attributes,
    listeners, // Các sự kiện chuột (onMouseDown, onKeyDown...)
    setNodeRef,
    transform, // Toạ độ di chuyển (x, y)
    transition, // Hiệu ứng mượt mà
    isDragging, // Trạng thái: Đang kéo hay không?
  } = useSortable({
    id: element.id,
    data: { ...element, isSortable: true },
  });

  const style = {
    transform: CSS.Transform.toString(transform), // Dịch chuyển div theo con chuột
    transition,
    opacity: isDragging ? 0.5 : 1, // Nếu đang kéo thì làm mờ đi (0.5) cho đẹp
    zIndex: isDragging ? 999 : 1, // Đang kéo thì nổi lên trên cùng
  };

  // Dùng padding (p-2) để tạo khoảng cách giữa các ô thay vì margin
  // wrapperClass: Class cho cái vỏ bao ngoài cùng.
  const wrapperClass = `p-2 transition-all relative group outline-none`;

  // innerCardClass: Class cho cái hộp trắng bên trong.
  // Logic: Nếu đang được chọn (isSelected) thì viền xanh (blue), còn không thì viền xám.
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
          {...attributes} // Chỉ khi cầm vào thanh này mới kéo được
          {...listeners}
          className="bg-gray-100 p-2 flex items-center gap-2 cursor-move border-b border-gray-200 hover:bg-gray-200"
          title="Giữ chuột để kéo"
        >
          {/* Icon 6 chấm */}
          <MdDragIndicator className="text-gray-500" size={20} />{" "}
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
  // Biến vùng này thành vùng "Thả được" (Droppable)
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
            onChange={(e) => setTitle(e.target.value)} // Cho phép sửa tên Form
            className="text-3xl font-bold text-gray-800 w-full border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors bg-transparent"
            placeholder="Nhập tên Form..."
          />
          <p className="text-gray-500 mt-2">Kéo thả để sắp xếp vị trí</p>
        </div>

        <div
          ref={setNodeRef} // Gắn hook Droppable vào đây
          // --- THÊM flex flex-wrap content-start ĐỂ CÁC Ô TỰ DỒN LÊN ---
          className={`min-h-[400px] rounded-lg p-2 transition-colors flex flex-wrap content-start ${
            isOver ? "bg-blue-50 border-2 border-blue-400 border-dashed" : ""
          }`} // Nếu đang kéo đồ đè lên thì đổi màu nền xanh nhạt
        >
          {/* rectSortingStrategy (chiến thuật sắp xếp lưới 2D) */}
          <SortableContext
            items={elements.map((el) => el.id)} // Danh sách ID các phần tử
            strategy={rectSortingStrategy} // Sắp xếp 2D (Lưới)
          >
            {elements.length === 0 ? (
              // Nếu chưa có gì thì hiện chữ "Chưa có phần tử nào"
              <div className="w-full h-60 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                <p>Chưa có phần tử nào</p>
              </div>
            ) : (
              // Nếu có rồi thì Map ra từng cái SortableFormElement
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
