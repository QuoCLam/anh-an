// src/pages/LabTests.jsx
import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_LAB_API_URL || "http://localhost:8002";

export default function LabTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách lab test
  useEffect(() => {
    fetch(`${API_URL}/labtest/`)
      .then(res => res.json())
      .then(data => setTests(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh sách kiểm nghiệm Lab</h1>
      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : (
        <table className="min-w-full border border-slate-300 rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-3 py-2">Mã Đơn</th>
              <th className="px-3 py-2">Mã Test</th>
              <th className="px-3 py-2">Yêu cầu từ</th>
              <th className="px-3 py-2">Tên mẫu</th>
              <th className="px-3 py-2">Ngày yêu cầu</th>
              <th className="px-3 py-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {tests.map(test => (
              <tr key={test.id}>
                <td className="px-3 py-2">{test.order_id}</td>
                <td className="px-3 py-2">{test.test_code}</td>
                <td className="px-3 py-2">{test.request_from}</td>
                <td className="px-3 py-2">{test.sample_name}</td>
                <td className="px-3 py-2">{test.request_date?.slice(0, 10)}</td>
                <td className="px-3 py-2">{test.pass_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
