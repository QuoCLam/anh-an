import React, { useState, useEffect } from "react";
import OrderForm from "./OrderForm";
import OrderDetail from "./OrderDetail";

const stepsFlow = [
  "Chờ xác nhận thiết kế",
  "Chờ xác nhận đăng ký công bố",
  "Chờ xác nhận thí nghiệm",
  "Chờ thu mua",
  "Chờ nhập kho nguyên vật liệu & bao bì",
  "Chờ sản xuất",
  "Chờ đóng gói",
  "Chờ nhập kho thành phẩm",
  "Chờ giao hàng",
  "Chờ thu tiền",
  "Hoàn tất",
];

const departmentButtons = [
  { label: "Thiết kế", icon: "🎨", color: "bg-pink-100" },
  { label: "Đăng ký công bố", icon: "📝", color: "bg-orange-100" },
  { label: "Thí nghiệm", icon: "🧪", color: "bg-indigo-100" },
  { label: "Thu mua", icon: "🛒", color: "bg-green-100" },
  { label: "Kho nguyên vật liệu & bao bì", icon: "🏬", color: "bg-lime-100" },
  { label: "Sản xuất", icon: "🏭", color: "bg-yellow-100" },
  { label: "Đóng gói", icon: "📦", color: "bg-blue-100" },
  { label: "Kho thành phẩm", icon: "🏪", color: "bg-gray-100" },
  { label: "Giao hàng", icon: "🚚", color: "bg-purple-100" },
  { label: "Thu tiền", icon: "💰", color: "bg-red-100" },
];

const notifications = [
  { msg: "Đơn SO1002 bị chậm xác nhận thu mua", type: "error" },
  { msg: "Đơn SO1003 đã thu tiền xong", type: "success" },
];

export default function DashboardMain() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Load orders từ backend mỗi khi mở trang hoặc xóa/thêm đơn mới
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/`);
      const data = await res.json();
      console.log("Fetched orders:", data);
      setOrders(data);
      // KHÔNG alert nếu mảng rỗng!
    } catch (e) {
      alert("Không thể tải danh sách đơn hàng!");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Thêm đơn hàng mới
  const addOrder = async (data) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      fetchOrders();
    } catch (e) {
      alert("Lỗi khi thêm đơn hàng!");
    }
  };

  // Khi xác nhận tiến trình
  const advanceStep = (id) => {
    setOrders(
      orders.map((o) =>
        o.id === id
          ? {
              ...o,
              step: o.step + 1,
              status:
                o.step + 1 >= stepsFlow.length
                  ? stepsFlow[stepsFlow.length - 1]
                  : stepsFlow[o.step + 1],
            }
          : o
      )
    );
    setSelected(null);
  };

  // Hàm xoá đơn hàng
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, {
        method: "DELETE",
      });
      fetchOrders();
    } catch (e) {
      alert("Lỗi khi xóa đơn hàng!");
    }
  };

  // Thống kê số lượng các trạng thái
  const numProcessing = orders.filter((o) => o.status !== "Hoàn tất").length;
  const numLate = orders.filter((o) => {
    const today = new Date();
    return (
      o.delivery_date &&
      new Date(o.delivery_date) < today &&
      o.status !== "Hoàn tất"
    );
  }).length;
  const numDone = orders.filter((o) => o.status === "Hoàn tất").length;
  const numDelivering = orders.filter((o) => o.status === stepsFlow[8]).length;

  // Việc cá nhân: đơn chưa hoàn tất, đang ở bước
  const myTasks = orders
    .filter((o) => o.status !== "Hoàn tất" && o.step < stepsFlow.length - 1)
    .map((o) => ({
      order: o,
      stepName: stepsFlow[o.step],
      stepIdx: o.step,
    }));

  // Lấy sản phẩm đầu tiên trong order (nếu có)
  const getFirstItem = (order) =>
    order.items && order.items.length > 0 ? order.items[0] : {};

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header và nút tạo đơn mới */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-3xl font-bold">Dashboard Anh An</div>
        <button
          className="px-4 py-2 rounded-xl font-bold shadow bg-blue-500 text-white hover:scale-105 duration-200"
          onClick={() => setShowOrderModal(true)}
        >
          + Tạo đơn hàng mới
        </button>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Đơn đang xử lý" value={numProcessing} icon="🕓" />
        <StatCard title="Đơn trễ" value={numLate} icon="⏰" />
        <StatCard title="Đơn hoàn tất" value={numDone} icon="✅" />
        <StatCard title="Đơn chờ giao" value={numDelivering} icon="🚚" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tasks */}
        <div>
          <div className="text-xl font-semibold mb-2">Việc của tôi hôm nay</div>
          <div className="bg-white rounded-2xl shadow p-4">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="p-2">Đơn hàng</th>
                  <th className="p-2">Bước công việc</th>
                  <th className="p-2">Tác vụ</th>
                </tr>
              </thead>
              <tbody>
                {myTasks.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-gray-400 p-4">
                      Không có việc cần xác nhận
                    </td>
                  </tr>
                )}
                {myTasks.map((task, i) => {
                  const dep = departmentButtons[task.stepIdx];
                  return (
                    <tr key={i} className="border-b">
                      <td className="p-2">SO{1000 + task.order.id}</td>
                      <td className="p-2 flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-lg ${dep.color}`}
                        >
                          {dep.icon}
                        </span>
                        {task.stepName}
                      </td>
                      <td className="p-2">
                        <button
                          className="bg-green-500 px-3 py-1 rounded-xl text-white"
                          onClick={() => advanceStep(task.order.id)}
                        >
                          Xác nhận
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {/* Notifications */}
        <div>
          <div className="text-xl font-semibold mb-2">Thông báo hệ thống</div>
          <div className="bg-white rounded-2xl shadow p-4 space-y-2">
            {notifications.map((n, i) => (
              <div
                key={i}
                className={`p-2 rounded ${
                  n.type === "error"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {n.msg}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Orders table */}
      <div className="mt-8">
        <div className="text-xl font-semibold mb-2">Đơn hàng nổi bật</div>
        <div className="bg-white rounded-2xl shadow p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="p-2">Mã đơn</th>
                <th className="p-2">Khách hàng</th>
                <th className="p-2">Sản phẩm</th>
                <th className="p-2">Số lượng</th>
                <th className="p-2">Đơn vị</th>
                <th className="p-2">Ngày nhận</th>
                <th className="p-2">Ngày giao</th>
                <th className="p-2">Trạng thái</th>
                <th className="p-2">Bước</th>
                <th className="p-2">Chi tiết</th>
                <th className="p-2">Xóa</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={11} className="text-center text-gray-400 p-4">
                    Không có đơn hàng nào.
                  </td>
                </tr>
              )}
              {orders.map((o, i) => {
                const dep = departmentButtons[o.step || 0] || {};
                const item = getFirstItem(o);
                return (
                  <tr key={i} className="border-b hover:bg-gray-100">
                    <td className="p-2">SO{1000 + o.id}</td>
                    <td className="p-2">{o.customer_name}</td>
                    <td className="p-2">{item.product_name || ""}</td>
                    <td className="p-2">{item.quantity || ""}</td>
                    <td className="p-2">{item.unit || ""}</td>
                    <td className="p-2">{o.order_date}</td>
                    <td className="p-2">{o.delivery_date}</td>
                    <td className="p-2">{o.status}</td>
                    <td className="p-2 flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-lg ${dep.color}`}
                      >
                        {dep.icon}
                      </span>
                      {dep.label}
                    </td>
                    <td className="p-2">
                      <button
                        className="underline text-blue-500"
                        onClick={() => setSelected(o)}
                      >
                        Xem
                      </button>
                    </td>
                    <td className="p-2">
                      <button
                        className="text-red-500 underline"
                        onClick={() => handleDeleteOrder(o.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Order Detail Popup */}
      {selected && (
        <OrderDetail
          order={selected}
          onClose={() => setSelected(null)}
          onAdvance={advanceStep}
          role="admin"
          stepsFlow={stepsFlow}
          departmentButtons={departmentButtons}
        />
      )}
      {/* Modal tạo đơn mới */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 min-w-[500px] max-w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xl font-bold">Tạo đơn hàng mới</div>
              <button
                className="text-xl"
                onClick={() => setShowOrderModal(false)}
              >
                ✕
              </button>
            </div>
            <OrderForm
              onAdd={(data) => {
                addOrder(data);
                setShowOrderModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Card hiển thị thống kê
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <div className="text-gray-500 text-sm">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}
