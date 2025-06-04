// src/pages/Users.jsx
import React, { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../api/userApi";
import { useUser } from "../UserContext"; // Đảm bảo context đúng path

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "lab", label: "Phòng Lab" },
  { value: "design", label: "Phòng Thiết Kế" },
  { value: "declare", label: "Khai Báo" },
  { value: "purchasing", label: "Mua Hàng" },
  { value: "staff", label: "Nhân Viên" },
];
const DEPARTMENTS = [
  "Lab", "Design", "Khai Báo", "Mua Hàng", "Nhân Viên", "Khác"
];

export default function Users() {
  const { token, user } = useUser();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", password: "", role: "staff", department: "" });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchUsers(); }, [token]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers(token);
      setUsers(data);
    } catch (e) {
      setUsers([]);
      // Có thể báo lỗi nếu muốn
    }
    setLoading(false);
  };

  // Xử lý form tạo user
  const handleSubmit = async (e) => {
    e.preventDefault();
    await createUser(form, token);
    setForm({ username: "", password: "", role: "staff", department: "" });
    fetchUsers();
  };

  // Xử lý form sửa user
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await updateUser(editingId, editData, token);
    setEditingId(null);
    setEditData({});
    fetchUsers();
  };

  // Xóa user
  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa user này?")) {
      await deleteUser(id, token);
      fetchUsers();
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Quản lý tài khoản & phân quyền</h1>
      {/* FORM TẠO USER */}
      <form className="flex flex-wrap gap-2 mb-8" onSubmit={handleSubmit}>
        <input
          className="border p-2 rounded"
          placeholder="Tên đăng nhập"
          value={form.username}
          required
          onChange={e => setForm({ ...form, username: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Mật khẩu"
          type="password"
          value={form.password}
          required
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <select
          className="border p-2 rounded"
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          {ROLES.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <select
          className="border p-2 rounded"
          value={form.department}
          onChange={e => setForm({ ...form, department: e.target.value })}
        >
          <option value="">Phòng ban...</option>
          {DEPARTMENTS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <button className="bg-blue-500 text-white rounded px-4 py-2" type="submit">
          Thêm mới
        </button>
      </form>

      {loading ? <div>Đang tải...</div> : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border p-2">Tên đăng nhập</th>
              <th className="border p-2">Phòng ban</th>
              <th className="border p-2">Quyền</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u =>
              editingId === u.id ? (
                <tr key={u.id}>
                  <td className="border p-2">
                    <input value={editData.username || ""} onChange={e => setEditData({ ...editData, username: e.target.value })} />
                  </td>
                  <td className="border p-2">
                    <select value={editData.department || ""} onChange={e => setEditData({ ...editData, department: e.target.value })}>
                      <option value="">Phòng ban...</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </td>
                  <td className="border p-2">
                    <select value={editData.role || ""} onChange={e => setEditData({ ...editData, role: e.target.value })}>
                      {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </td>
                  <td className="border p-2">
                    <button onClick={handleEditSubmit} className="bg-green-500 text-white px-2 rounded">Lưu</button>
                    <button onClick={() => setEditingId(null)} className="ml-2 bg-gray-300 px-2 rounded">Huỷ</button>
                  </td>
                </tr>
              ) : (
                <tr key={u.id}>
                  <td className="border p-2">{u.username}</td>
                  <td className="border p-2">{u.department}</td>
                  <td className="border p-2">{u.role}</td>
                  <td className="border p-2">
                    <button onClick={() => { setEditingId(u.id); setEditData(u); }} className="bg-yellow-500 px-2 rounded text-white">Sửa</button>
                    <button onClick={() => handleDelete(u.id)} className="ml-2 bg-red-500 text-white px-2 rounded">Xoá</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
