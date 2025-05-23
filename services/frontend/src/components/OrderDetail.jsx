import React from "react";

export default function OrderDetail({ order, onClose, onAdvance, stepsFlow, departmentButtons }) {
  if (!order) return null;

  const currentStep = order.step ?? 0;
  const dep = departmentButtons ? departmentButtons[currentStep] : {};

  // Chuẩn hóa lấy thông tin từ order đúng format mới
  const item = order.items && order.items.length > 0 ? order.items[0] : {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[400px] max-w-[90vw] relative">
        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-red-500 text-2xl"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="text-xl font-bold mb-2">Chi tiết đơn hàng SO{1000 + order.id}</div>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-gray-500 text-sm">Khách hàng:</div>
            <div className="font-semibold">{order.customer_name}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Sản phẩm:</div>
            <div className="font-semibold">{item.product_name}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Số lượng:</div>
            <div className="font-semibold">{item.quantity}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Đơn vị:</div>
            <div className="font-semibold">{item.unit}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Ngày giao:</div>
            <div className="font-semibold">{order.delivery_date}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Ghi chú:</div>
            <div className="font-semibold">{order.note || <span className="text-gray-400">-</span>}</div>
          </div>
        </div>

        {/* Tiến trình các bước */}
        {stepsFlow && departmentButtons && (
          <div className="mb-4">
            <div className="text-gray-500 text-sm mb-2">Tiến trình đơn hàng:</div>
            <div className="flex flex-wrap gap-2">
              {stepsFlow.map((s, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold
                    ${idx === currentStep ? dep.color + " text-black shadow" : "bg-gray-200 text-gray-500"}
                    ${order.status === "Hoàn tất" && idx === stepsFlow.length - 1 ? "bg-green-100 text-green-600" : ""}
                  `}
                >
                  <span>{departmentButtons[idx]?.icon || "⏺"}</span>
                  {s}
                  {idx < stepsFlow.length - 1 && <span className="mx-1">→</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trạng thái hiện tại */}
        <div className="mb-4">
          <div className="text-gray-500 text-sm">Trạng thái hiện tại:</div>
          <div className="font-bold flex items-center gap-2">
            {dep.icon && <span className="text-lg">{dep.icon}</span>}
            {order.status}
          </div>
        </div>

        {/* Nút xác nhận/chuyển bước */}
        {onAdvance && order.status !== "Hoàn tất" && (
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-bold shadow mt-4"
            onClick={() => onAdvance(order.id)}
          >
            Xác nhận hoàn thành bước này
          </button>
        )}
      </div>
    </div>
  );
}
