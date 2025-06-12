import React from "react";

// Dialog cơ bản, dùng cho modal hoặc popup
export default function Dialog({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white p-4 rounded shadow-lg min-w-[300px]">
        {title && <div className="text-lg font-bold mb-2">{title}</div>}
        <div>{children}</div>
        <button className="mt-4 px-3 py-1 border rounded" onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
}
