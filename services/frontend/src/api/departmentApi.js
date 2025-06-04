import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function getDepartments() {
  const res = await axios.get(`${API_URL}/departments`);
  return res.data;
}

export async function createDepartment(data) {
  return axios.post(`${API_URL}/departments`, data);
}

export async function updateDepartment(id, data) {
  return axios.put(`${API_URL}/departments/${id}`, data);
}

export async function deleteDepartment(id) {
  return axios.delete(`${API_URL}/departments/${id}`);
}
