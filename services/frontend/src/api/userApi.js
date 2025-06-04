// src/api/userApi.js
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8002";

// Hàm tiện ích lấy token: ưu tiên context, fallback localStorage
function getToken(token) {
  return token || localStorage.getItem("token");
}

// Lấy tất cả user (phải có token, thường chỉ admin mới được quyền này)
export async function getUsers(token) {
  const realToken = getToken(token);
  const res = await axios.get(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${realToken}`
    }
  });
  return res.data;
}

// Tạo user mới
export async function createUser(data, token) {
  const realToken = getToken(token);
  return axios.post(`${API_URL}/users`, data, {
    headers: { Authorization: `Bearer ${realToken}` }
  });
}

// Sửa user
export async function updateUser(id, data, token) {
  const realToken = getToken(token);
  return axios.put(`${API_URL}/users/${id}`, data, {
    headers: { Authorization: `Bearer ${realToken}` }
  });
}

// Xóa user
export async function deleteUser(id, token) {
  const realToken = getToken(token);
  return axios.delete(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${realToken}` }
  });
}

// Lấy thông tin user hiện tại (khi đã login)
export async function getCurrentUser(token) {
  const realToken = getToken(token);
  return axios.get(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${realToken}` }
  });
}

// Đăng nhập, nhận về access_token
export async function loginUser({ username, password }) {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);
  return axios.post(`${API_URL}/login`, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
}
