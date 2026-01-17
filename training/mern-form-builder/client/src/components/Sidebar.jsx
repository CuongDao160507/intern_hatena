import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";

// Import các icon từ react-icons (boostrap)
import {
  BsTextParagraph,
  BsCardText,
  BsPerson,
  BsEnvelope,
  BsTelephone,
  BsKey,
} from "react-icons/bs";

// Import các icon từ react-icons (material)
import {
  MdOutlineRadioButtonChecked,
  MdCheckBox,
  MdSearch,
} from "react-icons/md";

// Component con Draggable (Giữ nguyên)
const SidebarItem = ({ tool }) => {
  // Hook này biến thẻ div bình thường thành vật thể "Kéo được"
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: tool.type, //'text', 'email', ...
    data: tool, //{ label: 'Input Text', icon: ... }
  });

  //Tùy chỉnh tọa độ X, Y khi kéo
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef} //Kết nối thẻ div thật (DOM) với logic ảo của React.
      {...listeners} //Lắng nghe sự kiện chuột/tay của người dùng
      {...attributes}
      style={style} //Chứa thông tin vị trí X và Y khi bạn đang kéo
      className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-grab hover:bg-blue-50 hover:border-blue-500 shadow-sm z-50 touch-none mb-3"
    >
      <span className="text-xl text-gray-600">{tool.icon}</span>
      <span className="font-medium text-gray-700">{tool.label}</span>
    </div>
  );
};

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Danh sách công cụ mở rộng
  const tools = [
    { type: "text", label: "Input Text", icon: <BsTextParagraph /> },
    { type: "textarea", label: "Text Area", icon: <BsCardText /> },
    { type: "name", label: "Full Name", icon: <BsPerson /> },
    { type: "email", label: "Email", icon: <BsEnvelope /> },
    { type: "password", label: "Password", icon: <BsKey /> },
    { type: "phone", label: "Phone Number", icon: <BsTelephone /> },
    {
      type: "radio",
      label: "Radio Group",
      icon: <MdOutlineRadioButtonChecked />,
    },
    { type: "checkbox", label: "Checkbox", icon: <MdCheckBox /> },
  ];

  // Logic lọc theo từ khóa tìm kiếm
  const filteredTools = tools.filter((tool) =>
    tool.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen shadow-md flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-bold mb-3 text-gray-700">Toolbox</h2>

        {/* Thanh tìm kiếm */}
        <div className="relative">
          <MdSearch className="absolute left-2 top-2.5 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 overflow-y-auto flex-1">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <SidebarItem key={tool.type} tool={tool} />
          ))
        ) : (
          <p className="text-center text-gray-400 text-sm">Không tìm thấy</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
