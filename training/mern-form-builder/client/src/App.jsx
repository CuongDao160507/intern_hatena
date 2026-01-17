import React, { useState } from "react";
import { DndContext, closestCorners, handleDragEnd } from "@dnd-kit/core"; // Thêm closestCorners
import { arrayMove } from "@dnd-kit/sortable"; // Import hàm đổi chỗ mảng
import { v4 as uuidv4 } from "uuid";
import { MdAdd, MdClose } from "react-icons/md";
import Sidebar from "./components/Sidebar";
import FormCanvas from "./components/FormCanvas";
import PropertiesPanel from "./components/PropertiesPanel";
import TopBar from "./components/TopBar";
import axiosClient from "./api/axiosClient";

function App() {
  // Kho chứa danh sách các Tab (Forms). Mặc định có 1 cái form rỗng.
  const [forms, setForms] = useState([
    { id: "form-default", title: "Untitled Form", elements: [] },
  ]);
  // Con trỏ: Đang xem cái Tab nào? (Lưu ID của tab đó)
  const [activeTabId, setActiveTabId] = useState("form-default");

  // Đang bấm vào phần tử nào để sửa? (Lưu object phần tử đó)
  const [selectedElement, setSelectedElement] = useState(null);

  // Biến phái sinh: Tự động tìm ra dữ liệu của Form đang mở dựa vào ID
  const activeForm = forms.find((f) => f.id === activeTabId);

  // --- TAB LOGIC ---
  const addNewTab = () => {
    const newId = uuidv4(); // Tạo ID mới ngẫu nhiên
    const newForm = { id: newId, title: "New Form", elements: [] }; // Tạo form mới rỗng
    setForms([...forms, newForm]); // Thêm vào mảng cũ
    setActiveTabId(newId); // Chuyển màn hình sang tab mới ngay
    setSelectedElement(null); // Bỏ chọn phần tử cũ (nếu có)
  };

  const closeTab = (e, id) => {
    // QUAN TRỌNG: Chặn click xuyên qua (để không bị kích hoạt tab)
    e.stopPropagation();
    // Nếu còn đúng 1 tab thì không cho xóa
    if (forms.length === 1) {
      alert("Không thể đóng tab cuối cùng!");
      return;
    }
    // Lọc bỏ tab cần xóa ra khỏi mảng
    const newForms = forms.filter((f) => f.id !== id);
    setForms(newForms);
    // Nếu lỡ tay đóng đúng cái tab đang xem, thì tự động nhảy về tab đầu t
    if (activeTabId === id) {
      setActiveTabId(newForms[0].id);
      setSelectedElement(null);
    }
  };

  // --- UPDATE LOGIC ---
  const updateActiveFormElements = (newElementsCallback) => {
    setForms((prevForms) =>
      prevForms.map((f) => {
        // Tìm đúng cái form đang mở
        if (f.id === activeTabId) {
          const updatedElements =
            typeof newElementsCallback === "function"
              ? newElementsCallback(f.elements) // Nếu truyền vào hàm (callback)
              : newElementsCallback; // Nếu truyền vào giá trị trực tiếp
          // Trả về form cũ nhưng thay ruột (elements) mới
          return { ...f, elements: updatedElements };
        }
        // Các form khác giữ nguyên
        return f;
      })
    );
  };

  const updateActiveFormTitle = (newTitle) => {
    setForms((prev) =>
      prev.map((f) => (f.id === activeTabId ? { ...f, title: newTitle } : f))
    );
  };

  // --- LOGIC KÉO THẢ  ---
  const handleDragEnd = (event) => {
    const { active, over } = event;

    // Nếu thả ra ngoài thì thôi
    if (!over) return;

    // LOGIC THÊM MỚI (Kéo từ Sidebar)
    // Sidebar item có data.current chứa thông tin tool, nhưng không có isSortable
    if (active.data.current && !active.data.current.isSortable) {
      // Cho phép thả vào vùng trống HOẶC thả đè lên phần tử khác (insert)
      // Tạo phần tử mới với dữ liệu mặc định
      const newElement = {
        id: uuidv4(),
        type: active.data.current.type,
        label: active.data.current.label,
        required: false,
        placeholder: `Nhập ${active.data.current.label}...`,
        // Nếu là radio/checkbox thì tạo sẵn options, không thì null
        options: ["radio", "checkbox"].includes(active.data.current.type)
          ? ["Option 1", "Option 2"]
          : null,
        style: { width: "100%", borderRadius: "4px", borderColor: "#e5e7eb" },
      };

      updateActiveFormElements((prev) => [...prev, newElement]);
      return;
    }

    // LOGIC SẮP XẾP (Kéo trong Canvas)
    // Chỉ chạy khi ID khác nhau (vị trí thay đổi)
    if (active.id !== over.id) {
      console.log("🔄 Đang sắp xếp:", active.id, " -> ", over.id);

      // Cập nhật mảng forms
      setForms((prevForms) =>
        prevForms.map((f) => {
          if (f.id === activeTabId) {
            // Tìm vị trí cũ (index)
            const oldIndex = f.elements.findIndex((el) => el.id === active.id);
            // Tìm vị trí mới (index)
            const newIndex = f.elements.findIndex((el) => el.id === over.id);

            // Bảo vệ: Nếu không tìm thấy index thì không làm gì
            if (oldIndex === -1 || newIndex === -1) return f;

            return {
              ...f,
              elements: arrayMove(f.elements, oldIndex, newIndex),
            };
          }
          return f;
        })
      );
    }
  };

  // --- Properties Logic ---
  const updateElement = (elId, key, value) => {
    updateActiveFormElements((prevElements) =>
      prevElements.map((el) => (el.id === elId ? { ...el, [key]: value } : el))
    );
    if (selectedElement && selectedElement.id === elId) {
      setSelectedElement((prev) => ({ ...prev, [key]: value }));
    }
  };

  const deleteElement = (elId) => {
    updateActiveFormElements((prevElements) =>
      prevElements.filter((el) => el.id !== elId)
    );
    setSelectedElement(null);
  };

  // --- API Logic ---
  const handleSaveForm = async () => {
    try {
      await axiosClient.post("/forms", {
        title: activeForm.title,
        elements: activeForm.elements,
      });
      alert("✅ Đã lưu tab hiện tại thành công!");
    } catch (error) {
      alert("Lỗi khi lưu");
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(activeForm, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeForm.title}.json`;
    link.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (importedData.elements) {
          updateActiveFormElements(importedData.elements);
          updateActiveFormTitle(importedData.title || "Imported Form");
          alert("Import thành công!");
        }
      } catch (err) {
        alert("File lỗi");
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  return (
    // DndContext: Lớp vỏ bao bọc để tính toán vật lý kéo thả
    // closestCorners: Thuật toán giúp kéo thả dạng lưới (Grid) mượt hơn
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-100">
        <TopBar
          onSave={handleSaveForm}
          onExport={handleExport}
          onImport={handleImport}
        />

        {/* TABS AREA */}
        <div className="flex items-center bg-gray-200 border-b border-gray-300 px-2 pt-2 gap-1 overflow-x-auto">
          {/* Map qua mảng forms để vẽ từng cái Tab */}
          {forms.map((form) => (
            // ... Giao diện từng tab (tên, nút đóng)
            <div
              key={form.id}
              onClick={() => {
                setActiveTabId(form.id);
                setSelectedElement(null);
              }}
              className={`group flex items-center gap-2 px-4 py-2 rounded-t-lg cursor-pointer min-w-[150px] max-w-[200px] border-t border-x border-transparent ${
                activeTabId === form.id
                  ? "bg-white border-gray-300 text-blue-600 font-medium"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-600"
              }`}
            >
              <span className="truncate flex-1 text-sm">{form.title}</span>
              <button
                onClick={(e) => closeTab(e, form.id)}
                className="p-0.5 rounded-full hover:bg-gray-400/20 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MdClose size={14} />
              </button>
            </div>
          ))}
          {/* Nút dấu cộng thêm tab */}
          <button
            onClick={addNewTab}
            className="p-2 hover:bg-gray-300 rounded-full ml-1 text-gray-600"
          >
            <MdAdd size={20} />
          </button>
        </div>

        {/* --- KHU VỰC CHÍNH (3 CỘT) --- */}
        <div className="flex flex-1 overflow-hidden">
          {/* Cột 1: Công cụ */}
          <Sidebar />

          {/* Cột 2: Giấy vẽ (Nhận elements của form đang active) */}
          <FormCanvas
            elements={activeForm.elements}
            title={activeForm.title}
            setTitle={updateActiveFormTitle}
            setSelectedElement={setSelectedElement}
            selectedId={selectedElement?.id}
          />

          {/* Cột 3: Cài đặt (Chỉ hiện khi selectedElement != null) */}
          {selectedElement && (
            <PropertiesPanel
              selectedElement={selectedElement}
              updateElement={updateElement}
              deleteElement={deleteElement}
              closePanel={() => setSelectedElement(null)}
            />
          )}
        </div>
      </div>
    </DndContext>
  );
}

export default App;
