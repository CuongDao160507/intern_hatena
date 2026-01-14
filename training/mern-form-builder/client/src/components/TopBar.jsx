import React from "react";
import { FiSave, FiDownload, FiUpload } from "react-icons/fi"; // Cần cài icon nếu thiếu

const TopBar = ({ onSave, onExport, onImport }) => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-20">
      {/* Logo hoặc Tên */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
          F
        </div>
        <span className="font-bold text-gray-700 text-lg">Form Builder</span>
      </div>

      {/* Các nút chức năng */}
      <div className="flex items-center gap-3">
        {/* Nút Import (Ẩn input file đi, dùng label để kích hoạt) */}
        <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
          <FiUpload />
          <span>Import</span>
          <input
            type="file"
            className="hidden"
            accept=".json"
            onChange={onImport}
          />
        </label>

        {/* Nút Export */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <FiDownload />
          <span>Export</span>
        </button>

        {/* Nút Save */}
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition-all active:scale-95"
        >
          <FiSave />
          <span>Lưu Form</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
