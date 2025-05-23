import React from "react";
export default function DashboardDone({ orders }) {
  const myOrders = orders.filter(order => order.step === 9);
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="text-2xl font-bold mb-4">Dashboard đơn đã hoàn tất</div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-4">
          <div className="text-gray-500 text-sm">Đơn hoàn tất</div>
          <div className="text-2xl font-bold">{myOrders.length}</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow p-4 mb-6">
        <div className="text-xl font-semibold mb-2">Danh sách đơn hoàn tất</div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="p-2">Mã đơn</th>
              <th className="p-2">Sản phẩm</th>
              <th className="p-2">Ngày giao</th>
            </tr>
          </thead>
          <tbody>
            {myOrders.length === 0 && (
              <tr>
                <td colSpan={3} className="text-gray-400 p-4">
                  Không có đơn hoàn tất
                </td>
              </tr>
            )}
            {myOrders.map((order, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">SO{1000 + order.id}</td>
                <td className="p-2">{order.product}</td>
                <td className="p-2">{order.deliveryDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
