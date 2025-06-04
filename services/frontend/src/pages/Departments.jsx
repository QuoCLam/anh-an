import React, { useEffect, useState } from "react";
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from "../api/departmentApi";
import { useUser } from "../UserContext"; // Đổi lại đúng hook

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const { hasPermission } = useUser();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      alert("Không lấy được danh sách phòng ban");
    }
  };

  const handleCreate = async () => {
    if (!newName) return;
    try {
      await createDepartment({ name: newName });
      setNewName("");
      fetchDepartments();
    } catch (error) {
      alert("Không tạo được phòng ban!");
    }
  };

  const handleUpdate = async (id) => {
    try {
      await updateDepartment(id, { name: editName });
      setEditId(null);
      setEditName("");
      fetchDepartments();
    } catch (error) {
      alert("Cập nhật thất bại!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá phòng ban này?")) return;
    try {
      await deleteDepartment(id);
      fetchDepartments();
    } catch (error) {
      alert("Xoá thất bại!");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Quản lý phòng ban</h1>
      <div className="flex gap-2 mb-4">
        <input
          placeholder="Tên phòng ban mới"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <button
          onClick={handleCreate}
          disabled={!hasPermission("departments:create") || !newName}
          className="bg-blue-600 text-white px-3 py-1 rounded disabled:bg-gray-300"
        >
          Thêm
        </button>
      </div>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Tên phòng ban</th>
            <th className="p-2 border">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((d) => (
            <tr key={d.id}>
              <td className="p-2 border">{d.id}</td>
              <td className="p-2 border">
                {editId === d.id ? (
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  d.name
                )}
              </td>
              <td className="p-2 border">
                {editId === d.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(d.id)}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-300 text-gray-800 px-2 py-1 rounded"
                    >
                      Huỷ
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditId(d.id);
                        setEditName(d.name);
                      }}
                      disabled={!hasPermission("departments:update")}
                      className="bg-yellow-400 text-black px-2 py-1 rounded disabled:bg-gray-200"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      disabled={!hasPermission("departments:delete")}
                      className="bg-red-600 text-white px-2 py-1 rounded disabled:bg-gray-300"
                    >
                      Xoá
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
