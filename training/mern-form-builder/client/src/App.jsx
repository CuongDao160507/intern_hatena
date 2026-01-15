import React, { useState } from "react";
import { DndContext, closestCorners, DragOverlay } from "@dnd-kit/core"; // Thêm closestCorners
import { arrayMove } from "@dnd-kit/sortable"; // Import hàm đổi chỗ mảng
import { v4 as uuidv4 } from "uuid";
import { MdAdd, MdClose } from "react-icons/md";
import Sidebar from "./components/Sidebar";
import FormCanvas from "./components/FormCanvas";
import PropertiesPanel from "./components/PropertiesPanel";
import TopBar from "./components/TopBar";
import axiosClient from "./api/axiosClient";

function App() {
  const [forms, setForms] = useState([
    { id: "form-default", title: "Untitled Form", elements: [] },
  ]);
  const [activeTabId, setActiveTabId] = useState("form-default");
  const [selectedElement, setSelectedElement] = useState(null);

  const activeForm = forms.find((f) => f.id === activeTabId);

  // --- TAB LOGIC ---
  const addNewTab = () => {
    const newId = uuidv4();
    const newForm = { id: newId, title: "New Form", elements: [] };
    setForms([...forms, newForm]);
    setActiveTabId(newId);
    setSelectedElement(null);
  };

  const closeTab = (e, id) => {
    e.stopPropagation();
    if (forms.length === 1) {
      alert("Không thể đóng tab cuối cùng!");
      return;
    }
    const newForms = forms.filter((f) => f.id !== id);
    setForms(newForms);
    if (activeTabId === id) {
      setActiveTabId(newForms[0].id);
      setSelectedElement(null);
    }
  };

  // --- UPDATE LOGIC ---
  const updateActiveFormElements = (newElementsCallback) => {
    setForms((prevForms) =>
      prevForms.map((f) => {
        if (f.id === activeTabId) {
          const updatedElements =
            typeof newElementsCallback === "function"
              ? newElementsCallback(f.elements)
              : newElementsCallback;
          return { ...f, elements: updatedElements };
        }
        return f;
      })
    );
  };

  const updateActiveFormTitle = (newTitle) => {
    setForms((prev) =>
      prev.map((f) => (f.id === activeTabId ? { ...f, title: newTitle } : f))
    );
  };

  // --- LOGIC KÉO THẢ MỚI ---
  const handleDragEnd = (event) => {
    const { active, over } = event;

    // 1. Nếu thả ra ngoài thì thôi
    if (!over) return;

    // 2. LOGIC THÊM MỚI (Kéo từ Sidebar)
    // Sidebar item có data.current chứa thông tin tool, nhưng không có cờ isSortable
    if (active.data.current && !active.data.current.isSortable) {
      // Cho phép thả vào vùng trống HOẶC thả đè lên phần tử khác (insert)
      const newElement = {
        id: uuidv4(),
        type: active.data.current.type,
        label: active.data.current.label,
        required: false,
        placeholder: `Nhập ${active.data.current.label}...`,
        options: ["radio", "checkbox"].includes(active.data.current.type)
          ? ["Option 1", "Option 2"]
          : null,
        style: { width: "100%", borderRadius: "4px", borderColor: "#e5e7eb" },
      };

      updateActiveFormElements((prev) => [...prev, newElement]);
      return;
    }

    // 3. LOGIC SẮP XẾP (Kéo trong Canvas)
    // Chỉ chạy khi ID khác nhau (vị trí thay đổi)
    if (active.id !== over.id) {
      console.log("🔄 Đang sắp xếp:", active.id, " -> ", over.id);

      setForms((prevForms) =>
        prevForms.map((f) => {
          if (f.id === activeTabId) {
            const oldIndex = f.elements.findIndex((el) => el.id === active.id);
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
    // Thêm collisionDetection={closestCorners} để tính toán va chạm mượt hơn
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-100">
        <TopBar
          onSave={handleSaveForm}
          onExport={handleExport}
          onImport={handleImport}
        />

        {/* TABS AREA */}
        <div className="flex items-center bg-gray-200 border-b border-gray-300 px-2 pt-2 gap-1 overflow-x-auto">
          {forms.map((form) => (
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
          <button
            onClick={addNewTab}
            className="p-2 hover:bg-gray-300 rounded-full ml-1 text-gray-600"
          >
            <MdAdd size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <Sidebar />

          <FormCanvas
            elements={activeForm.elements}
            title={activeForm.title}
            setTitle={updateActiveFormTitle}
            setSelectedElement={setSelectedElement}
            selectedId={selectedElement?.id}
          />

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
