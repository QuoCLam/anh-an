// src/api/departmentApi.js
import axios from "../api/axios";

export const createDepartment = (data, token) =>
  axios.post("/departments", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getDepartments = (token) =>
  axios.get("/departments", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateDepartment = (id, data, token) =>
  axios.put(`/departments/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteDepartment = (id, token) =>
  axios.delete(`/departments/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
