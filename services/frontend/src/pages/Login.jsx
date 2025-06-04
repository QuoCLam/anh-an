import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, getCurrentUser } from "../api/userApi";
import { useUser } from "../UserContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useUser();

  // Nếu đã login, điều hướng về trang trước đó hoặc về "/"
  useEffect(() => {
    if (user && location.pathname === "/login") {
      navigate("/");
    }
  }, [user, navigate, location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await loginUser({ username, password });
      const { access_token } = response.data;
      localStorage.setItem("token", access_token);
      const userInfoRes = await getCurrentUser(access_token);
      const { username: userName, role, permissions } = userInfoRes.data;
      login({
        name: userName,
        role,
        permissions: permissions || [],
        token: access_token,
      });
      // Không cần navigate nữa, useEffect sẽ tự redirect
    } catch (err) {
      setError("Sai tài khoản hoặc mật khẩu hoặc lỗi mạng!");
    }
  };

  return (
    !user && (
      <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: "100px auto" }}>
        <h2>Đăng nhập hệ thống</h2>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Tên đăng nhập"
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
          autoFocus
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Mật khẩu"
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <button type="submit" style={{ width: "100%", padding: 8 }}>Đăng nhập</button>
        <div style={{ color: "red", marginTop: 10 }}>{error}</div>
      </form>
    )
  );
}

export default Login;
