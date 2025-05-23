import React from "react";

export default function OrdersTable({ orders, onSelect, role }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 mt-4">
      <div className="text-xl font-semibold mb-2">Đơn hàng nổi bật</div>
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="p-2">Mã đơn</th>
            <th className="p-2">Khách hàng</th>
            <th className="p-2">Sản phẩm</th>
            <th className="p-2">Trạng thái</th>
            <th className="p-2">Xem</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => (
            <tr key={i} className="border-b hover:bg-gray-100">
              <td className="p-2">SO{1000 + i}</td>
              <td className="p-2">{o.customer}</td>
              <td className="p-2">{o.product}</td>
              <td className="p-2">{o.status}</td>
              <td className="p-2">
                <button className="underline text-blue-500" onClick={() => onSelect(i)}>
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
