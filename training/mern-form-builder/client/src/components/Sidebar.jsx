import React from "react";
import { useDraggable } from "@dnd-kit/core"; // 1. Import hook Kéo
import { BsTextParagraph, BsCardText } from "react-icons/bs";
import { MdOutlineRadioButtonChecked, MdCheckBox } from "react-icons/md";

// Component con: Đại diện cho 1 nút có thể kéo đi
const SidebarItem = ({ tool }) => {
  // useDraggable giúp tạo ra các thuộc tính để gắn vào thẻ HTML
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: tool.type,
    data: tool, // Gửi kèm dữ liệu của tool này để lúc thả còn biết là thả cái gì
  });

  // Nếu đang kéo thì nút sẽ dịch chuyển theo chuột (transform)
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef} // Gắn ref để thư viện biết đây là vật thể kéo
      {...listeners} // Gắn sự kiện chuột
      {...attributes} // Gắn thuộc tính ARIA
      style={style}
      className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-grab hover:bg-blue-50 hover:border-blue-500 shadow-sm z-50 touch-none"
    >
      <span className="text-xl text-gray-600">{tool.icon}</span>
      <span className="font-medium text-gray-700">{tool.label}</span>
    </div>
  );
};

const Sidebar = () => {
  const tools = [
    { type: "text", label: "Input Text", icon: <BsTextParagraph /> },
    { type: "textarea", label: "Text Area", icon: <BsCardText /> },
    {
      type: "radio",
      label: "Radio Group",
      icon: <MdOutlineRadioButtonChecked />,
    },
    { type: "checkbox", label: "Checkbox", icon: <MdCheckBox /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 h-screen shadow-md z-10">
      <h2 className="text-lg font-bold mb-4 text-gray-700">Toolbox</h2>
      <div className="grid grid-cols-1 gap-3">
        {tools.map((tool) => (
          // Gọi component con draggable ở đây
          <SidebarItem key={tool.type} tool={tool} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
