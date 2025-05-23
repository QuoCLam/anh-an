import React, { useState } from "react";
import OrderDetail from "./OrderDetail";

export default function DashboardLab({ orders }) {
  // Đơn phòng thí nghiệm (step = 2)
  const labOrders = orders.filter(o => o.step === 2);
  const myTasks = labOrders.filter(o => o.status !== "Hoàn tất");
  const today = new Date().toISOString().slice(0, 10);
  const lateOrders = labOrders.filter(o => o.deliveryDate < today && o.status !== "Hoàn tất");
  const last10Orders = labOrders.sort((a, b) => b.id - a.id).slice(0, 10);
  const [selected, setSelected] = useState(null);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="text-3xl font-bold mb-4">Dashboard phòng Thí Nghiệm</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
          <div className="text-3xl">🧪</div>
          <div>
            <div className="text-gray-500 text-sm">Đơn phòng Thí Nghiệm</div>
            <div className="text-2xl font-bold">{labOrders.length}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
          <div className="text-3xl">⏰</div>
          <div>
            <div className="text-gray-500 text-sm">Đơn trễ</div>
            <div className="text-2xl font-bold text-red-500">{lateOrders.length}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
          <div className="text-3xl">✅</div>
          <div>
            <div className="text-gray-500 text-sm">Đơn đã hoàn tất</div>
            <div className="text-2xl font-bold">{labOrders.filter(o => o.status === "Hoàn tất").length}</div>
          </div>
        </div>
      </div>
      {/* Việc hôm nay */}
      <div className="mb-8">
        <div className="text-xl font-semibold mb-2">Việc của tôi hôm nay</div>
        <div className="bg-white rounded-2xl shadow p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="p-2">Đơn hàng</th>
                <th className="p-2">Khách hàng</th>
                <th className="p-2">Sản phẩm</th>
                <th className="p-2">Ngày giao</th>
                <th className="p-2">Tác vụ</th>
              </tr>
            </thead>
            <tbody>
              {myTasks.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-gray-400 p-4">
                    Không có việc cần xác nhận
                  </td>
                </tr>
              )}
              {myTasks.map((order, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">SO{1000 + order.id}</td>
                  <td className="p-2">{order.customer}</td>
                  <td className="p-2">{order.product}</td>
                  <td className="p-2">{order.deliveryDate}</td>
                  <td className="p-2">
                    <button
                      className="bg-green-500 px-3 py-1 rounded-xl text-white"
                      onClick={() => {/* Xác nhận hoặc chuyển bước */}}
                    >
                      Xác nhận
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Thông báo hệ thống */}
      <div className="mb-8">
        <div className="text-xl font-semibold mb-2">Thông báo hệ thống</div>
        <div className="bg-white rounded-2xl shadow p-4 space-y-2">
          {lateOrders.length === 0 ? (
            <div className="text-gray-400">Không có đơn trễ</div>
          ) : (
            lateOrders.map((o, i) => (
              <div key={i} className="p-2 rounded bg-red-100 text-red-600">
                Đơn SO{1000 + o.id} đã trễ ngày giao!
              </div>
            ))
          )}
        </div>
      </div>
      {/* Danh sách 10 đơn gần nhất */}
      <div>
        <div className="text-xl font-semibold mb-2">10 đơn gần nhất phòng Thí Nghiệm</div>
        <div className="bg-white rounded-2xl shadow p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="p-2">Mã đơn</th>
                <th className="p-2">Khách hàng</th>
                <th className="p-2">Sản phẩm</th>
                <th className="p-2">Ngày giao</th>
                <th className="p-2">Trạng thái</th>
                <th className="p-2">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {last10Orders.map((o, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">SO{1000 + o.id}</td>
                  <td className="p-2">{o.customer}</td>
                  <td className="p-2">{o.product}</td>
                  <td className="p-2">{o.deliveryDate}</td>
                  <td className="p-2">{o.status}</td>
                  <td className="p-2">
                    <button
                      className="underline text-blue-500"
                      onClick={() => setSelected(o)}
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Popup chi tiết đơn */}
      {selected && (
        <OrderDetail
          order={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
