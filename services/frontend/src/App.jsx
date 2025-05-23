import React, { useState } from "react";

// Import dashboard các phòng ban
import DashboardMain from "./components/DashboardMain";
import DashboardDesign from "./components/DashboardDesign";
import DashboardDeclare from "./components/DashboardDeclare";
import DashboardLab from "./components/DashboardLab";
import DashboardPurchase from "./components/DashboardPurchase";
import DashboardMaterialWarehouse from "./components/DashboardMaterialWarehouse";
import DashboardProduction from "./components/DashboardProduction";
import DashboardPacking from "./components/DashboardPacking";
import DashboardProductWarehouse from "./components/DashboardProductWarehouse";
import DashboardDelivery from "./components/DashboardDelivery";
import DashboardPayment from "./components/DashboardPayment";

// Import cấu hình dùng chung
import { stepsFlow } from "./config/stepsFlow";
import { departmentButtons } from "./config/departmentButtons";

// Map các component dashboard theo thứ tự phòng ban (bắt đầu từ 0: Tổng, 1: Thiết kế,...)
const dashboardComponents = [
  DashboardMain,
  DashboardDesign,
  DashboardDeclare,
  DashboardLab,
  DashboardPurchase,
  DashboardMaterialWarehouse,
  DashboardProduction,
  DashboardPacking,
  DashboardProductWarehouse,
  DashboardDelivery,
  DashboardPayment,
];

// Danh sách orders mẫu (bạn có thể thay thế/nhận từ API thực tế)
const ordersInit = [
  { id: 1, customer: "Công ty A", product: "Kem Body", quantity: 10000, deliveryDate: "2025-07-05", note: "Khẩn", status: stepsFlow[0], step: 0 },
  { id: 2, customer: "Công ty B", product: "Dầu Gội", quantity: 5000, deliveryDate: "2025-07-06", note: "", status: stepsFlow[1], step: 1 },
  { id: 3, customer: "Công ty C", product: "Sữa Rửa Mặt", quantity: 2000, deliveryDate: "2025-07-08", note: "", status: stepsFlow[2], step: 2, labNote: "Kết quả đạt chuẩn." },
  { id: 4, customer: "Công ty D", product: "Kem Dưỡng", quantity: 3000, deliveryDate: "2025-07-10", note: "", status: stepsFlow[3], step: 3 },
  // ... các đơn tiếp theo ...
];

function App() {
  const [selectedDept, setSelectedDept] = useState(0); // 0 = Dashboard tổng
  const [orders, setOrders] = useState(ordersInit);

  const Dashboard = dashboardComponents[selectedDept];

  return (
    <div>
      {/* Navigation các phòng ban */}
      <nav className="flex gap-2 p-2 bg-gray-50 shadow sticky top-0 z-50">
        {[
          { label: "Dashboard tổng", icon: "🏠" },
          ...departmentButtons.slice(0, -1) // Bỏ "Hoàn tất" khỏi menu
        ].map((dept, idx) => (
          <button
            key={idx}
            className={`px-3 py-2 rounded-xl flex items-center gap-2 font-bold
              ${selectedDept === idx ? "bg-blue-600 text-white" : "bg-white text-gray-700"}
            `}
            onClick={() => setSelectedDept(idx)}
          >
            <span>{dept.icon}</span> {dept.label}
          </button>
        ))}
      </nav>
      {/* Hiển thị dashboard tương ứng */}
      <div>
        <Dashboard
          orders={orders}
          setOrders={setOrders}
          stepsFlow={stepsFlow}
          departmentButtons={departmentButtons}
        />
      </div>
    </div>
  );
}

export default App;
