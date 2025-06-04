// src/api/auth.js
import axios from "axios";

export async function login(username, password) {
  // Lưu ý: phải gửi dạng form, không phải JSON
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  // Đổi URL cho đúng backend bạn đang chạy
  const response = await axios.post("http://localhost:8002/login", params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  return response.data; // Thường trả về access_token, token_type, role...
}
