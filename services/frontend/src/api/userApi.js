/* src/api/userApi.js
 * Giao tiếp với USERS-service (port 8000)
 */
import axios from "axios";

// Mặc định lấy URL từ biến môi trường, fallback localhost:8000 khi chạy dev
const API_URL = import.meta.env.VITE_USERS_API;   // <-- đã tách riêng

/** Lấy access token đã lưu (nếu có) */
function getToken(token) {
  return token || localStorage.getItem("token");
}

/* ---------- ENDPOINTS ---------- */

/** Đăng nhập – nhận { access_token, token_type, role, ... } */
export async function loginUser({ username, password }) {
  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);

  return axios.post(`${API_URL}/login`, form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
}

/** Lấy hồ sơ người dùng hiện tại */
export async function getCurrentUser(token) {
  const realToken = getToken(token);
  return axios.get(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${realToken}` },
  });
}

/* ------ Các thao tác CRUD user (chỉ admin) ------ */

export async function getUsers(token) {
  const realToken = getToken(token);
  return axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${realToken}` },
  });
}

export async function createUser(data, token) {
  const realToken = getToken(token);
  return axios.post(`${API_URL}/users`, data, {
    headers: { Authorization: `Bearer ${realToken}` },
  });
}

export async function updateUser(id, data, token) {
  const realToken = getToken(token);
  return axios.put(`${API_URL}/users/${id}`, data, {
    headers: { Authorization: `Bearer ${realToken}` },
  });
}

export async function deleteUser(id, token) {
  const realToken = getToken(token);
  return axios.delete(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${realToken}` },
  });
}
